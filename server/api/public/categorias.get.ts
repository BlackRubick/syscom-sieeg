import { syscomGet } from '~/server/utils/syscom'
import { rateLimit } from '~/server/utils/rateLimit'
import { categoriaNombre } from '~/utils/categoriaNombre'

/* Categorías principales para el catálogo público (sin sesión). */
export default defineEventHandler(async (event) => {
  rateLimit(event, 'public-categorias', 120, 60_000)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=1800')
  try {
    const cats = await syscomGet<Array<{ id: string; nombre: string }>>('/categorias')
    return (Array.isArray(cats) ? cats : [])
      .map(c => ({ id: String(c.id), nombre: categoriaNombre(String(c.id), String(c.nombre).replace(/\s+/g, ' ').trim()) }))
      .filter(c => c.nombre.toLowerCase() !== 'marketing')
  } catch {
    throw createError({ statusCode: 502, message: 'Catálogo no disponible por el momento' })
  }
})
