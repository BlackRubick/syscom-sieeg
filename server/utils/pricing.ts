import prisma from '~/server/utils/prisma'
import { syscomGet } from '~/server/utils/syscom'
import { formatGarantia } from '~/utils/garantia'
import { comprasDelMes } from '~/server/utils/comprasMes'
import { esIntegrador, nivelConCarrito } from '~/utils/integrador'
import { totalDe } from '~/utils/orderTotals'
import type { OrderItem, SyscomProducto } from '~/types'

/* Precios de venta calculados siempre en servidor:
   costo SYSCOM (sin IVA) → + margen global (siteConfig.markupPct) → − descuento del cliente (user.discountPct) → + IVA 16%.
   El precio que ve el cliente YA INCLUYE IVA. El costo de SYSCOM nunca debe llegar al navegador. */

import { costoSyscom, precioConMargen, precioVenta, type Pricing } from './preciosPuros'
export { costoSyscom, precioConMargen, precioVenta, type Pricing }

export async function getPricing(userId: string): Promise<Pricing> {
  const [user, siteConfig] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { discountPct: true } }),
    prisma.siteConfig.findUnique({ where: { id: 1 } }),
  ])
  return { markupPct: siteConfig?.markupPct ?? 0, discountPct: user?.discountPct ?? 0 }
}

/** Precios de un pedido nuevo: al integrador que con este pedido junta en el mes el mínimo de un nivel
    más alto se le cobra ya con ese descuento (los productos sin precio no cuentan). */
export async function pricingDelPedido(userId: string, productos: Array<{ prod: SyscomProducto | null; quantity: number }>): Promise<Pricing> {
  const pricing = await getPricing(userId)
  if (!esIntegrador(pricing.discountPct)) return pricing
  const comprado = (await comprasDelMes([userId])).get(userId) ?? 0
  const totalAlNivel = (discountPct: number) =>
    totalDe(productos.map(p => ({ price: p.prod ? precioVenta(p.prod, { ...pricing, discountPct }) : 0, quantity: p.quantity })))
  return { ...pricing, discountPct: nivelConCarrito(pricing.discountPct, comprado, totalAlNivel) }
}

/** Precios para lo que se muestra: el vendedor/admin puede ver los del cliente que eligió (?cliente=<id>). */
export async function pricingParaVista(session: { userId: string; role: string }, cliente: unknown): Promise<Pricing> {
  if (typeof cliente === 'string' && cliente && cliente !== session.userId && ['admin', 'seller'].includes(session.role)) {
    const c = await prisma.user.findUnique({ where: { id: cliente }, select: { role: true } })
    if (c?.role === 'buyer') return getPricing(cliente)
  }
  return getPricing(session.userId)
}

/** Reemplaza `precios` de un producto SYSCOM por los precios de venta (oculta el costo). */
export function sanitizeProductoPrecios<T extends { precios?: unknown }>(p: T, pr: Pricing): T {
  if (!p || typeof p !== 'object' || !('precios' in p)) return p
  const prod = p as unknown as Pick<SyscomProducto, 'precios'>
  return {
    ...p,
    precios: {
      precio_lista:    precioConMargen(prod, pr).toFixed(2),
      precio_especial: precioVenta(prod, pr).toFixed(2),
    },
  }
}

/** Recalcula el precio de cada artículo con datos de SYSCOM; ignora el precio que mande el navegador. */
export async function repriceItems(userId: string, items: OrderItem[]): Promise<OrderItem[]> {
  const prods = await Promise.all(items.map(async (item) => {
    if (!/^\d+$/.test(String(item.productId))) {
      throw createError({ statusCode: 400, message: `Producto inválido: "${item.name}"` })
    }
    try {
      return await syscomGet<SyscomProducto>(`/productos/${item.productId}`, { moneda: 'MXN' })
    } catch {
      throw createError({ statusCode: 502, message: `No se pudo verificar el precio de "${item.name}" con SYSCOM. Intenta de nuevo.` })
    }
  }))
  const cantidades = items.map(item => Math.floor(Number(item.quantity)))
  const pricing = await pricingDelPedido(userId, prods.map((prod, i) => ({ prod, quantity: cantidades[i]! >= 1 ? cantidades[i]! : 0 })))
  return items.map((item, i) => {
    const prod  = prods[i]!
    const price = precioVenta(prod, pricing)
    if (!(price > 0)) throw createError({ statusCode: 400, message: `"${item.name}" no tiene precio disponible` })
    const quantity = cantidades[i]!
    if (!(quantity >= 1)) throw createError({ statusCode: 400, message: `Cantidad inválida para "${item.name}"` })
    const garantia = formatGarantia(prod.garantia) || item.garantia
    return { ...item, price, quantity, ...(garantia ? { garantia } : {}) }
  })
}
