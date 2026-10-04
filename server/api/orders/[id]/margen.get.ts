import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { syscomGet } from '~/server/utils/syscom'
import type { OrderItem, SyscomProducto } from '~/types'

const IVA = 1.16
const num = (v: unknown) => Math.max(0, parseFloat(String(v ?? '')) || 0)

/* Margen estimado de un pedido ANTES de aprobarlo (solo admin/aprobador):
   venta al cliente contra lo que SYSCOM le cobra a SIEEG (precio_descuento = precio de distribuidor). */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin' && session.role !== 'approver') throw createError({ statusCode: 403, message: 'Sin autorización' })
  const order = await prisma.order.findUnique({ where: { id: getRouterParam(event, 'id')! }, select: { items: true, shippingFee: true } })
  if (!order) throw createError({ statusCode: 404, message: 'Pedido no encontrado' })

  const items = order.items as unknown as OrderItem[]
  let sinCosto = 0
  const filas = await Promise.all(items.map(async (i) => {
    let costo = 0
    try {
      const p = await syscomGet<SyscomProducto & { precios: Record<string, unknown> }>(`/productos/${i.productId}`, { moneda: 'MXN' })
      // precio de distribuidor; si SYSCOM no lo manda, el especial (peor caso)
      costo = num(p.precios?.precio_descuento) || num(p.precios?.precio_especial) || num(p.precios?.precio_lista)
    } catch { /* sin dato */ }
    if (!costo) sinCosto++
    const ventaSinIva = Math.round((i.price / IVA) * 100) / 100
    return { productId: i.productId, sku: i.sku, cantidad: i.quantity, ventaSinIva, costoSinIva: costo }
  }))

  const venta = filas.reduce((s, f) => s + f.ventaSinIva * f.cantidad, 0)
  const costo = filas.reduce((s, f) => s + f.costoSinIva * f.cantidad, 0)
  const margen = venta - costo
  return {
    ventaSinIva:  Math.round(venta * 100) / 100,
    costoSinIva:  Math.round(costo * 100) / 100,
    margen:       Math.round(margen * 100) / 100,
    margenPct:    venta > 0 ? Math.round((margen / venta) * 1000) / 10 : 0,
    envioCobrado: order.shippingFee,
    sinCosto,
    items: filas,
  }
})
