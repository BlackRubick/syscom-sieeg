import { getSyscomToken } from '~/server/utils/syscom'
import { requireSession } from '~/server/utils/session'

const SAFE = /^[a-zA-Z0-9_\-]+$/

interface CacheEntry { data: unknown; exp: number }
const serverCache = new Map<string, CacheEntry>()

function ttlFor(path: string): number {
  if (path === '/categorias' || path === '/marcas' || path === '/tipocambio') return 30 * 60_000
  if (/^\/productos\/\d+/.test(path)) return 5 * 60_000   // detail + relacionados + accesorios
  return 2 * 60_000                                         // product lists / searches
}

export default defineEventHandler(async (event) => {
  requireSession(event)

  const segments = (getRouterParam(event, 'path') as string ?? '').split('/').filter(Boolean)
  if (!segments.length || segments.length > 8 || !segments.every(s => s.length > 0 && s.length < 120 && SAFE.test(s))) {
    throw createError({ statusCode: 400, message: 'Ruta inválida' })
  }

  const path   = '/' + segments.join('/')
  const method = getMethod(event)
  const qs     = getQuery(event)
  const url    = new URL(`https://developers.syscom.mx/api/v1${path}`)
  Object.entries(qs).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  const cacheKey = url.toString()

  if (method === 'GET') {
    const hit = serverCache.get(cacheKey)
    if (hit && hit.exp > Date.now()) return hit.data
  }

  const token = await getSyscomToken()
  let reqBody: string | undefined
  if (method !== 'GET' && method !== 'HEAD') {
    const raw = await readBody(event).catch(() => null)
    if (raw != null) reqBody = JSON.stringify(raw)
  }

  const upstream = await fetch(cacheKey, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type':  'application/json',
      'Accept':        'application/json',
    },
    body: reqBody,
  })

  const text = await upstream.text()
  let data: unknown = null
  if (text) {
    try { data = JSON.parse(text) } catch { data = { raw: text } }
  }

  setResponseStatus(event, upstream.status)

  if (!upstream.ok) {
    throw createError({ statusCode: upstream.status, data, message: (data as Record<string,unknown>)?.message as string ?? `SYSCOM ${upstream.status}` })
  }

  if (method === 'GET') {
    if (serverCache.size > 600) {
      const now = Date.now()
      for (const [k, v] of serverCache) if (v.exp < now) serverCache.delete(k)
    }
    serverCache.set(cacheKey, { data, exp: Date.now() + ttlFor(path) })
  }

  return data
})
