import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { repriceItems } from '~/server/utils/pricing'
import { totalDe, envioDe } from '~/utils/orderTotals'
import { getShippingConfig } from '~/server/utils/shipping'
import { formatClientNumber } from '~/utils/clientNumber'
import type { OrderItem } from '~/types'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role === 'viewer') throw createError({ statusCode: 403, message: 'Tu cuenta es de solo consulta y no puede realizar pedidos' })

  const body = await readBody<{
    items:     OrderItem[]
    total?:    number   // ignorado — calculamos server-side (#2)
    priority?: string
    notes?:    string
  }>(event)

  if (!body.items?.length) {
    throw createError({ statusCode: 400, message: 'El carrito está vacío' })
  }

  for (const item of body.items) {
    if (!item.productId || !item.name) throw createError({ statusCode: 400, message: 'Ítem inválido en el carrito' })
    if (!item.quantity  || item.quantity  <= 0) throw createError({ statusCode: 400, message: `Cantidad inválida para "${item.name}"` })
    if (item.price === undefined || item.price < 0) throw createError({ statusCode: 400, message: `Precio inválido para "${item.name}"` })
  }

  // #2 — Precios y total calculados en servidor con datos de SYSCOM; se ignora lo que manda el cliente
  // Los precios ya incluyen IVA: el total es la suma de los artículos + envío si no llega al mínimo
  const items       = await repriceItems(session.userId, body.items)
  const shippingFee = envioDe(totalDe(items), await getShippingConfig())
  const total       = Math.round((totalDe(items) + shippingFee) * 100) / 100

  const order = await prisma.order.create({
    data: {
      userId:   session.userId,
      items,
      total,
      shippingFee,
      priority: body.priority ?? 'normal',
      notes:    body.notes ?? null,
    },
    include: { user: { select: { id: true, name: true, email: true, clientNumber: true } } },
  })

  // Notificar a todos los admins que hay un nuevo pedido
  const admins = await prisma.user.findMany({
    where:  { role: 'admin', status: 'active' },
    select: { id: true },
  })
  if (admins.length) {
    await prisma.notification.createMany({
      data: admins.map(a => ({
        userId:  a.id,
        type:    'order',
        title:   'Nuevo pedido recibido',
        message: `${order.user.name}${order.user.clientNumber ? ` (${formatClientNumber(order.user.clientNumber)})` : ''} realizó un pedido por ${total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} IVA incl. (${items.length} art.)`,
        orderId: order.id,
      })),
    })
  }

  return {
    order: {
      id:        order.id,
      userId:    order.userId,
      userName:  order.user.name,
      userEmail: order.user.email,
      status:    order.status,
      items:     order.items,
      total:     order.total,
      shippingFee: order.shippingFee,
      priority:  order.priority,
      notes:     order.notes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    },
  }
})
