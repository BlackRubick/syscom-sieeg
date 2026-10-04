import prisma from '~/server/utils/prisma'
import { syscomGet } from '~/server/utils/syscom'
import { getPricing, precioVenta } from '~/server/utils/pricing'
import { getShippingConfig } from '~/server/utils/shipping'
import { totalDe, envioDe } from '~/utils/orderTotals'
import { formatGarantia } from '~/utils/garantia'
import type { OrderItem, SyscomProducto } from '~/types'

/* Mientras un pedido siga pendiente y sin pagar, su precio sigue al de SYSCOM: si sube (o baja) se actualiza solo.
   Un producto que SYSCOM no responde o ya no tiene precio conserva el que tenía.
   Devuelve true si cambió el total (queda registrado en el historial del pedido). */
export async function actualizarPreciosPendiente(orderId: string): Promise<boolean> {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order || order.status !== 'pending' || order.paymentStatus !== 'unpaid' || order.syscomFolio) return false

  const pricing = await getPricing(order.userId)
  const antes   = order.items as unknown as OrderItem[]
  const items   = await Promise.all(antes.map(async (item) => {
    if (!/^\d+$/.test(String(item.productId))) return item
    try {
      const prod     = await syscomGet<SyscomProducto>(`/productos/${item.productId}`, { moneda: 'MXN' })
      const price    = precioVenta(prod, pricing)
      const garantia = formatGarantia(prod.garantia) || item.garantia
      return { ...item, ...(price > 0 ? { price } : {}), ...(garantia ? { garantia } : {}) }
    } catch {
      return item
    }
  }))

  const shippingFee = envioDe(totalDe(items), await getShippingConfig())
  const total       = Math.round((totalDe(items) + shippingFee) * 100) / 100
  const cambioTotal = Math.abs(total - order.total) >= 0.01
  const cambioItems = JSON.stringify(items) !== JSON.stringify(antes)
  if (!cambioTotal && !cambioItems) return false

  // Solo se toca si nadie lo aprobó/pagó mientras consultábamos a SYSCOM
  const log = cambioTotal
    ? [...((order.auditLog ?? []) as unknown[]), { status: 'precio_actualizado', from: order.total, to: total, by: 'system', byName: 'Precio del día (SYSCOM)', at: new Date().toISOString() }]
    : (order.auditLog ?? undefined)
  const r = await prisma.order.updateMany({
    where: { id: orderId, status: 'pending', paymentStatus: 'unpaid', syscomFolio: null },
    data:  { items: items as object[], shippingFee, total, ...(log ? { auditLog: log as object[] } : {}) },
  })
  return r.count > 0 && cambioTotal
}
