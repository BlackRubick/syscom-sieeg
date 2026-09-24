import { syscomGet } from '~/server/utils/syscom'
import { rateLimit } from '~/server/utils/rateLimit'
import type { SyscomProducto } from '~/types'

/* Catálogo público de exhibición (landing): SIN precios ni existencias exactas.
   Solo se copian campos de una lista blanca para que ningún precio se filtre. */

const DEFAULT_CATEGORIA = '22' // Videovigilancia

function toPublic(p: SyscomProducto & { marca_logo?: string }) {
  const cats = p['categorías'] ?? p.categorias ?? []
  return {
    id:         String(p.producto_id),
    nombre:     String(p.titulo ?? ''),
    modelo:     String(p.modelo ?? ''),
    marca:      String(p.marca ?? ''),
    marcaLogo:  typeof p.marca_logo === 'string' ? p.marca_logo : '',
    imagen:     typeof p.img_portada === 'string' ? p.img_portada : '',
    categoria:  cats[0]?.nombre ? String(cats[0].nombre).replace(/\s+/g, ' ').trim() : '',
    disponible: Number(p.total_existencia) > 0,
  }
}

export default defineEventHandler(async (event) => {
  rateLimit(event, 'public-catalogo', 120, 60_000)

  const q = getQuery(event)
  const busqueda  = typeof q.busqueda  === 'string' ? q.busqueda.trim().slice(0, 80) : ''
  const categoria = typeof q.categoria === 'string' && /^\d{1,8}$/.test(q.categoria) ? q.categoria : ''
  const pagina    = Math.min(50, Math.max(1, Number(q.pagina) || 1))

  const params: Record<string, string> = { moneda: 'mxn', pagina: String(pagina), por_pagina: '24' }
  if (busqueda)  params.busqueda  = busqueda.split(/\s+/).join('+')
  if (categoria) params.categoria = categoria
  if (!busqueda && !categoria) params.categoria = DEFAULT_CATEGORIA

  let raw: { productos?: SyscomProducto[]; cantidad?: number; pagina?: number; paginas?: number }
  try {
    raw = await syscomGet('/productos', params)
  } catch {
    throw createError({ statusCode: 502, message: 'Catálogo no disponible por el momento' })
  }

  setResponseHeader(event, 'Cache-Control', 'public, max-age=300')
  return {
    productos: (raw.productos ?? []).filter(p => p.img_portada && p.titulo).map(toPublic),
    cantidad:  Number(raw.cantidad ?? 0),
    pagina:    Number(raw.pagina ?? pagina),
    paginas:   Math.min(50, Number(raw.paginas ?? 1)),
  }
})
