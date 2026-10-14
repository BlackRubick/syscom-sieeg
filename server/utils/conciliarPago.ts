import type { Order } from '@prisma/client'
import prisma from '~/server/utils/prisma'
import { getCharge, type OpenPayCharge } from '~/server/utils/openpay'
import { approveOrder } from '~/server/utils/approveOrder'

/**
 * Aplica al pedido el estado real del cargo en OpenPay (lo usan el webhook y la conciliación periódica).
 * Pagado → se marca pagado y, si seguía pendiente, se aprueba (y se pide a SYSCOM).
 * Un pago que llega tarde a un pedido cancelado no lo revive: queda pagado para reembolsar.
 */
export async function conciliarPago(order: Order, charge?: OpenPayCharge) {
  if (!order.paymentId) return
  charge ??= await getCharge(order.paymentId)

  if (charge.status === 'completed') {
    const marcado = await prisma.order.updateMany({ where: { id: order.id, NOT: { paymentStatus: 'paid' } }, data: { paymentStatus: 'paid' } })
    if (marcado.count) await avisarPago(order)
    if (order.status === 'pending') {
      await approveOrder(order.id).catch(e => console.error(`[pago] ${order.id} pagado pero no se pudo aprobar:`, e?.message ?? e))
    }
  } else if ((charge.status === 'failed' || charge.status === 'cancelled') && order.paymentStatus !== charge.status) {
    await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: charge.status } })
  }
}

async function avisarPago(order: Order) {
  const total = order.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
  const admins = await prisma.user.findMany({ where: { role: 'admin', status: 'active' }, select: { id: true } })
  await prisma.notification.createMany({
    data: [order.userId, ...admins.map(a => a.id)].filter((v, i, a) => a.indexOf(v) === i).map(userId => ({
      userId,
      type:    'approval',
      title:   '💰 Pago recibido',
      message: `Se recibió el pago de ${total} del pedido PED-${order.id.slice(-8).toUpperCase()}.`,
      orderId: order.id,
    })),
  }).catch(() => {})
}
