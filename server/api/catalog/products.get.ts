import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import type { SyscomProducto } from '~/types'

function parsePrice(v?: string): number { return v ? Math.max(0, parseFloat(v) || 0) : 0 }

function adaptWithDiscount(p: SyscomProducto, factor: number) {
  const especial = parsePrice(p.precios?.precio_especial)
  const lista    = parsePrice(p.precios?.precio_lista)
  const base     = especial > 0 ? especial : lista
  const price    = Math.round(base * factor * 100) / 100
  const cats     = p['categorías'] ?? p.categorias ?? []
  let discount: number | undefined
  if (factor < 1) {
    const pct = Math.round((1 - factor) * 100)
    if (pct > 0) discount = pct
  }
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

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { discountPct: true },
  })
  const factor = 1 - ((user?.discountPct ?? 0) / 100)

  const qs = getQuery(event)
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(qs)) {
    if (v != null) params.set(k, String(v))
  }
  if (!params.has('moneda')) params.set('moneda', 'MXN')

  const cookie = getHeader(event, 'cookie') ?? ''
  const data = await $fetch<{
    productos?: SyscomProducto[]
    cantidad?: number
    pagina?: number
    paginas?: number
  }>(`/api/syscom/productos?${params}`, {
    headers: { cookie },
  })

  return {
    products: (data.productos ?? []).map(p => adaptWithDiscount(p, factor)),
    cantidad: data.cantidad ?? 0,
    pagina:   data.pagina  ?? 1,
    paginas:  data.paginas ?? 1,
  }
})
