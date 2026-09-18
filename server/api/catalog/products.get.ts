import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import type { SyscomProducto } from '~/types'

// Server-side cache for raw SYSCOM responses (shared across all users, keyed by query params)
const syscomCache = new Map<string, { data: unknown; exp: number }>()
const SYSCOM_TTL  = 5 * 60_000 // 5 min

function parsePrice(v?: string): number { return v ? Math.max(0, parseFloat(v) || 0) : 0 }

function adaptWithDiscount(p: SyscomProducto, markupPct: number, discountPct: number) {
  const especial = parsePrice(p.precios?.precio_especial)
  const lista    = parsePrice(p.precios?.precio_lista)
  const base     = especial > 0 ? especial : lista
  const markedUp = base * (1 + markupPct / 100)
  const price    = Math.round(markedUp * (1 - discountPct / 100) * 100) / 100
  const cats     = p['categorías'] ?? p.categorias ?? []
  const discount = discountPct > 0 ? discountPct : undefined
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

  const [user, siteConfig] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId }, select: { discountPct: true } }),
    prisma.siteConfig.findUnique({ where: { id: 1 } }),
  ])
  const markupPct   = siteConfig?.markupPct ?? 0
  const discountPct = user?.discountPct ?? 0

  const qs = getQuery(event)
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(qs)) {
    if (v != null) params.set(k, String(v))
  }
  if (!params.has('moneda'))    params.set('moneda',    'MXN')
  if (!params.has('por_pagina')) params.set('por_pagina', '50')

  // Cache key includes only SYSCOM params (not user-specific pricing)
  const cacheKey = params.toString()
  const now = Date.now()
  const cached = syscomCache.get(cacheKey)
  let rawData: { productos?: SyscomProducto[]; cantidad?: number; pagina?: number; paginas?: number }

  if (cached && cached.exp > now) {
    rawData = cached.data as typeof rawData
  } else {
    const cookie = getHeader(event, 'cookie') ?? ''
    rawData = await $fetch<typeof rawData>(`/api/syscom/productos?${params}`, {
      headers: { cookie },
    })
    syscomCache.set(cacheKey, { data: rawData, exp: now + SYSCOM_TTL })
  }

  return {
    products: (rawData.productos ?? []).map(p => adaptWithDiscount(p, markupPct, discountPct)),
    cantidad: rawData.cantidad ?? 0,
    pagina:   rawData.pagina  ?? 1,
    paginas:  rawData.paginas ?? 1,
  }
})
