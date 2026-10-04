import prisma from '~/server/utils/prisma'
import { syscomGet } from '~/server/utils/syscom'
import { formatGarantia } from '~/utils/garantia'
import type { OrderItem, SyscomProducto } from '~/types'

/* Precios de venta calculados siempre en servidor:
   costo SYSCOM (sin IVA) → + margen global (siteConfig.markupPct) → − descuento del cliente (user.discountPct) → + IVA 16%.
   El precio que ve el cliente YA INCLUYE IVA. El costo de SYSCOM nunca debe llegar al navegador. */

const IVA = 1.16

export interface Pricing { markupPct: number; discountPct: number }

export async function getPricing(userId: string): Promise<Pricing> {
  const [user, siteConfig] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { discountPct: true } }),
    prisma.siteConfig.findUnique({ where: { id: 1 } }),
  ])
  return { markupPct: siteConfig?.markupPct ?? 0, discountPct: user?.discountPct ?? 0 }
}

/** Precios para lo que se muestra: el vendedor/admin puede ver los del cliente que eligió (?cliente=<id>). */
export async function pricingParaVista(session: { userId: string; role: string }, cliente: unknown): Promise<Pricing> {
  if (typeof cliente === 'string' && cliente && cliente !== session.userId && ['admin', 'seller'].includes(session.role)) {
    const c = await prisma.user.findUnique({ where: { id: cliente }, select: { role: true } })
    if (c?.role === 'buyer') return getPricing(cliente)
  }
  return getPricing(session.userId)
}

function parsePrice(v?: unknown): number { return v ? Math.max(0, parseFloat(String(v)) || 0) : 0 }

/** Costo base de SYSCOM (precio especial o, si no hay, de lista). */
export function costoSyscom(p: Pick<SyscomProducto, 'precios'>): number {
  const especial = parsePrice(p.precios?.precio_especial)
  const lista    = parsePrice(p.precios?.precio_lista)
  return especial > 0 ? especial : lista
}

/** Precio con margen e IVA, antes del descuento del cliente. */
export function precioConMargen(p: Pick<SyscomProducto, 'precios'>, pr: Pricing): number {
  return Math.round(costoSyscom(p) * (1 + pr.markupPct / 100) * IVA * 100) / 100
}

/** Precio final de venta para el cliente, con IVA incluido. */
export function precioVenta(p: Pick<SyscomProducto, 'precios'>, pr: Pricing): number {
  return Math.round(costoSyscom(p) * (1 + pr.markupPct / 100) * (1 - pr.discountPct / 100) * IVA * 100) / 100
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
  const pricing = await getPricing(userId)
  return Promise.all(items.map(async (item) => {
    if (!/^\d+$/.test(String(item.productId))) {
      throw createError({ statusCode: 400, message: `Producto inválido: "${item.name}"` })
    }
    let prod: SyscomProducto
    try {
      prod = await syscomGet<SyscomProducto>(`/productos/${item.productId}`, { moneda: 'MXN' })
    } catch {
      throw createError({ statusCode: 502, message: `No se pudo verificar el precio de "${item.name}" con SYSCOM. Intenta de nuevo.` })
    }
    const price = precioVenta(prod, pricing)
    if (!(price > 0)) throw createError({ statusCode: 400, message: `"${item.name}" no tiene precio disponible` })
    const quantity = Math.floor(Number(item.quantity))
    if (!(quantity >= 1)) throw createError({ statusCode: 400, message: `Cantidad inválida para "${item.name}"` })
    const garantia = formatGarantia(prod.garantia) || item.garantia
    return { ...item, price, quantity, ...(garantia ? { garantia } : {}) }
  }))
}
