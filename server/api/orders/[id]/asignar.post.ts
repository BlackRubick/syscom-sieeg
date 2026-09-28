import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { resolverCliente, vendeAClientes } from '~/server/utils/roles'
import { repriceItems } from '~/server/utils/pricing'
import { getShippingConfig } from '~/server/utils/shipping'
import { esMostrador } from '~/server/utils/mostrador'
import { ORDER_INCLUDE, serializeOrder } from '~/server/utils/orderDto'
import { totalDe, envioDe } from '~/utils/orderTotals'
import type { OrderItem } from '~/types'

/* Asigna un pedido pendiente a otro cliente (ej. se levantó a "Mostrador · Público en general").
   Los precios se recalculan con el descuento del nuevo cliente. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (!vendeAClientes(session.role)) throw createError({ statusCode: 403, message: 'Solo vendedores y administradores pueden asignar pedidos' })
  const id   = getRouterParam(event, 'id')!
  const body = await readBody<{ clientId?: string }>(event)
  if (!body.clientId) throw createError({ statusCode: 400, message: 'Elige el cliente' })

  const order = await prisma.order.findUnique({ where: { id }, include: { user: { select: { name: true } } } })
  if (!order) throw createError({ statusCode: 404, message: 'Pedido no encontrado' })
  if (order.status !== 'pending' || order.paymentStatus !== 'unpaid' || order.syscomFolio) {
    throw createError({ statusCode: 400, message: 'Solo se pueden reasignar pedidos pendientes y sin pago' })
  }
  const { clientId } = await resolverCliente(session, body.clientId)
  if (clientId === order.userId) throw createError({ statusCode: 400, message: 'El pedido ya es de ese cliente' })

  const items       = await repriceItems(clientId, order.items as unknown as OrderItem[])
  const shippingFee = envioDe(totalDe(items), await getShippingConfig())
  const total       = Math.round((totalDe(items) + shippingFee) * 100) / 100
  const nuevo = await prisma.user.findUniqueOrThrow({ where: { id: clientId }, select: { name: true } })
  const log = [...((order.auditLog ?? []) as unknown[]), {
    status: 'reasignado', from: order.userId, to: clientId, note: `De ${order.user.name} a ${nuevo.name}`,
    by: session.userId, byName: session.name, at: new Date().toISOString(),
  }]

  const updated = await prisma.order.update({
    where: { id },
    data:  { userId: clientId, sellerId: order.sellerId ?? session.userId, items, shippingFee, total, auditLog: log },
    include: ORDER_INCLUDE,
  })

  if (clientId !== session.userId && !esMostrador(updated.user.email)) {
    await prisma.notification.create({
      data: {
        userId:  clientId,
        type:    'order',
        title:   'Se registró un pedido a tu nombre',
        message: `${session.name} te asignó un pedido por ${total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} IVA incl.`,
        orderId: id,
      },
    })
  }
  return { order: serializeOrder(updated, ['admin', 'approver'].includes(session.role)) }
})
