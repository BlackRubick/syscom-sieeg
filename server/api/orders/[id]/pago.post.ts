import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { ORDER_INCLUDE, serializeOrder } from '~/server/utils/orderDto'

const METODOS = ['transferencia', 'efectivo', 'tarjeta', 'cheque', 'otro'] as const

/* Administración registra el pago recibido fuera de línea (transferencia, efectivo…) o el reembolso
   de un pedido cancelado que ya estaba pagado. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin' && session.role !== 'approver') throw createError({ statusCode: 403, message: 'Sin autorización' })
  const id   = getRouterParam(event, 'id')!
  const body = await readBody<{ accion?: 'pagado' | 'reembolsado'; metodo?: string; referencia?: string; fecha?: string }>(event)

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) throw createError({ statusCode: 404, message: 'Pedido no encontrado' })

  const referencia = typeof body.referencia === 'string' ? body.referencia.trim().slice(0, 80) : ''
  const fecha = typeof body.fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.fecha) ? body.fecha : new Date().toISOString().slice(0, 10)
  const ahora = new Date().toISOString()
  const previo = (order.paymentData ?? {}) as Record<string, unknown>

  let data: { paymentStatus: string; paymentMethod?: string; paymentData: object; auditLog: object[] }
  if (body.accion === 'pagado') {
    if (order.paymentStatus === 'paid') throw createError({ statusCode: 400, message: 'Este pedido ya está marcado como pagado' })
    if (['rejected', 'cancelled'].includes(order.status)) throw createError({ statusCode: 400, message: 'El pedido está cancelado o rechazado' })
    const metodo = METODOS.includes(body.metodo as typeof METODOS[number]) ? body.metodo! : 'transferencia'
    data = {
      paymentStatus: 'paid',
      paymentMethod: order.paymentMethod ?? metodo,
      paymentData:   { ...previo, pago: { metodo, referencia, fecha, registradoPor: session.name, registradoEl: ahora } },
      auditLog:      [...((order.auditLog ?? []) as object[]), { status: 'pago_registrado', by: session.userId, byName: session.name, at: ahora, note: `Pago por ${metodo}${referencia ? ` · Ref. ${referencia}` : ''} (${fecha})` }],
    }
  } else if (body.accion === 'reembolsado') {
    if (order.paymentStatus !== 'paid' || !['rejected', 'cancelled'].includes(order.status)) {
      throw createError({ statusCode: 400, message: 'Solo se registra reembolso de pedidos cancelados que estaban pagados' })
    }
    data = {
      paymentStatus: 'refunded',
      paymentData:   { ...previo, reembolso: { referencia, fecha, registradoPor: session.name, registradoEl: ahora } },
      auditLog:      [...((order.auditLog ?? []) as object[]), { status: 'reembolso', by: session.userId, byName: session.name, at: ahora, note: `Reembolso${referencia ? ` · Ref. ${referencia}` : ''} (${fecha})` }],
    }
  } else {
    throw createError({ statusCode: 400, message: 'Acción inválida' })
  }

  const updated = await prisma.order.update({ where: { id }, data, include: ORDER_INCLUDE })
  await prisma.notification.create({
    data: {
      userId:  order.userId,
      type:    'order',
      title:   body.accion === 'pagado' ? 'Recibimos tu pago' : 'Reembolso registrado',
      message: `Pedido PED-${id.slice(-8).toUpperCase()} por ${order.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}.`,
      orderId: id,
    },
  })
  return { order: serializeOrder(updated, true) }
})
