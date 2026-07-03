import type { Product, SyscomProducto, SyscomCategoria, SyscomFactura } from '~/types'

interface CacheEntry { data: unknown; exp: number }
const MEM: Map<string, CacheEntry> = new Map()
function get<T>(key: string): T | null {
  const e = MEM.get(key); return (e && e.exp > Date.now()) ? e.data as T : null
}
function set(key: string, data: unknown, ttl: number) { MEM.set(key, { data, exp: Date.now() + ttl }) }

/* ── Adapter ── */
function parsePrice(v?: string): number { return v ? Math.max(0, parseFloat(v) || 0) : 0 }

export function adaptProduct(p: SyscomProducto): Product {
  const especial = parsePrice(p.precios?.precio_especial)
  const lista    = parsePrice(p.precios?.precio_lista)
  const price    = especial > 0 ? especial : lista
  let discount: number | undefined
  if (lista > especial && especial > 0) {
    const pct = Math.round((1 - especial / lista) * 100)
    if (pct > 0 && pct < 90) discount = pct
  }
  const cats = p['categorías'] ?? p.categorias ?? []
  return {
    id: String(p.producto_id), name: p.titulo ?? '', description: '',
    price, currency: 'MXN', category: cats[0]?.nombre ?? 'General',
    supplier: p.marca ?? '',
    supplierId: p.marca?.toLowerCase().replace(/\s+/g, '_') ?? String(p.producto_id),
    sku: p.modelo ?? '', stock: Number(p.total_existencia) || 0, unit: 'pieza',
    images: p.img_portada ? [p.img_portada] : [],
    tags: [], rating: 0, reviewCount: 0, leadTime: 0, featured: false, discount,
    satKey: p.sat_key || undefined,
  }
}

/* ── API helpers ── */
export async function fetchCategorias(): Promise<SyscomCategoria[]> {
  const key = '/api/syscom/categorias'
  const cached = get<SyscomCategoria[]>(key); if (cached) return cached
  try {
    const data = await $fetch<SyscomCategoria[]>(key)
    const cats = Array.isArray(data) ? data : []
    set(key, cats, 30 * 60_000)
    return cats
  } catch { return [] }
}

export interface FetchProductosOpts {
  busqueda?: string; categoria?: string; marca?: string; pagina?: number; orden?: string
}
export interface ProductosResult {
  products: Product[]; cantidad: number; pagina: number; paginas: number; error?: string
}

export async function fetchProductos(opts: FetchProductosOpts): Promise<ProductosResult> {
  const empty = (error?: string): ProductosResult => ({ products: [], cantidad: 0, pagina: 1, paginas: 1, error })
  if (!opts.busqueda && !opts.categoria && !opts.marca) return empty()
  const params = new URLSearchParams()
  if (opts.busqueda)  params.set('busqueda',  opts.busqueda.trim().split(/\s+/).join('+'))
  if (opts.categoria) params.set('categoria', opts.categoria)
  if (opts.marca)     params.set('marca',     opts.marca)
  if (opts.pagina && opts.pagina > 1) params.set('pagina', String(opts.pagina))
  if (opts.orden && opts.orden !== 'relevancia') params.set('orden', opts.orden)
  params.set('moneda', 'MXN')
  const url = `/api/syscom/productos?${params}`
  const cached = get<ProductosResult>(url); if (cached) return cached
  try {
    const data = await $fetch<{ productos?: SyscomProducto[]; cantidad?: number; pagina?: number; paginas?: number; error?: string }>(url)
    const result: ProductosResult = {
      products: (data.productos ?? []).map(adaptProduct),
      cantidad: data.cantidad ?? 0, pagina: data.pagina ?? 1, paginas: data.paginas ?? 1,
    }
    set(url, result, 5 * 60_000)
    return result
  } catch (e) { return empty(e instanceof Error ? e.message : 'Error de conexión') }
}

export async function fetchMarcas(): Promise<Array<{ id: string; nombre: string }>> {
  const key = '/api/syscom/marcas'
  const cached = get<Array<{ id: string; nombre: string }>>(key); if (cached) return cached
  try {
    const data = await $fetch<unknown>(key)
    const brands = Array.isArray(data) ? data as Array<{ id: string; nombre: string }> : []
    set(key, brands, 30 * 60_000)
    return brands
  } catch { return [] }
}

export interface FacturasResult {
  facturas: SyscomFactura[]; cantidad: number; pagina: number; paginas: number; error?: string
}

export async function fetchFacturas(opts: { anio: number; pagina?: number }): Promise<FacturasResult> {
  const empty = (error?: string): FacturasResult => ({ facturas: [], cantidad: 0, pagina: 1, paginas: 1, error })
  const params = new URLSearchParams({ anio: String(opts.anio) })
  if (opts.pagina && opts.pagina > 1) params.set('pagina', String(opts.pagina))
  const url = `/api/syscom/facturas?${params}`
  const cached = get<FacturasResult>(url); if (cached) return cached
  try {
    const data = await $fetch<unknown>(url)
    let facturas: SyscomFactura[] = [], cantidad = 0, pagina = 1, paginas = 1
    if (Array.isArray(data)) {
      facturas = data as SyscomFactura[]; cantidad = facturas.length
    } else if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>
      facturas = (Array.isArray(d.facturas) ? d.facturas : []) as SyscomFactura[]
      cantidad = Number(d.cantidad ?? facturas.length)
      pagina   = Number(d.pagina   ?? 1)
      paginas  = Number(d.paginas  ?? 1)
    }
    const result: FacturasResult = { facturas, cantidad, pagina, paginas }
    set(url, result, 5 * 60_000)
    return result
  } catch (e) { return empty(e instanceof Error ? e.message : 'Error de conexión') }
}

export function parseTotal(t?: string | number): number {
  if (t === undefined || t === null) return 0
  return parseFloat(String(t).replace(/,/g, '')) || 0
}

export function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
}

export function fmtDate(s?: string): string {
  if (!s) return '—'
  const d = new Date(s); if (isNaN(d.getTime())) return s
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function facturaStatusStyle(estatus?: string) {
  const s = (estatus ?? '').toLowerCase()
  if (s.includes('cancel'))                          return { color: '#fb7185', dot: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  label: estatus ?? 'Cancelada'  }
  if (s.includes('entrega') || s.includes('recib'))  return { color: '#4ade80', dot: '#22c55e', bg: 'rgba(34,197,94,0.12)',  label: estatus ?? 'Entregada'  }
  if (s.includes('enviad')  || s.includes('transit'))return { color: '#22d3ee', dot: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  label: estatus ?? 'Enviada'    }
  if (s.includes('aprob'))                           return { color: '#34d399', dot: '#10b981', bg: 'rgba(16,185,129,0.12)', label: estatus ?? 'Aprobada'   }
  return { color: '#38bdf8', dot: '#0ea5e9', bg: 'rgba(14,165,233,0.12)', label: estatus ?? 'En proceso' }
}
