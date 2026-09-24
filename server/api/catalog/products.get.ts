import { requireSession } from '~/server/utils/session'
import { syscomGet } from '~/server/utils/syscom'
import { getPricing, precioVenta } from '~/server/utils/pricing'
import type { Pricing } from '~/server/utils/pricing'
import type { SyscomProducto } from '~/types'

function adaptWithDiscount(p: SyscomProducto, pricing: Pricing) {
  const price    = precioVenta(p, pricing)
  const cats     = p['categorías'] ?? p.categorias ?? []
  const discount = pricing.discountPct > 0 ? pricing.discountPct : undefined
  return {
    id: String(p.producto_id), name: p.titulo ?? '', description: '',
    price, currency: 'MXN' as const,
    category: cats[0]?.nombre ?? 'General',
    supplier: p.marca ?? '',
    supplierId: p.marca?.toLowerCase().replace(/\s+/g, '_') ?? String(p.producto_id),
    sku: p.modelo ?? '', stock: Number(p.total_existencia) || 0, unit: 'pieza',
    images: p.img_portada ? [p.img_portada] : [],
    tags: [], rating: 0, reviewCount: 0, leadTime: 0, featured: false,
    discount, satKey: p.sat_key || undefined,
  }
}

export default defineEventHandler(async (event) => {
  const session = requireSession(event)

  const pricing = await getPricing(session.userId)

  const params: Record<string, string> = {}
  for (const [k, v] of Object.entries(getQuery(event))) if (v != null) params[k] = String(v)
  params.moneda     ??= 'MXN'
  params.por_pagina ??= '50'

  let rawData: { productos?: SyscomProducto[]; cantidad?: number; pagina?: number; paginas?: number }
  try {
    rawData = await syscomGet('/productos', params)
  } catch (e) {
    throw createError({ statusCode: 502, message: e instanceof Error ? e.message : 'Error al conectar con SYSCOM' })
  }

  return {
    products: (rawData.productos ?? []).map(p => adaptWithDiscount(p, pricing)),
    cantidad: rawData.cantidad ?? 0,
    pagina:   rawData.pagina  ?? 1,
    paginas:  rawData.paginas ?? 1,
  }
})
