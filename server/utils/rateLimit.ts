import type { H3Event } from 'h3'

/* Límite de peticiones en memoria por IP. X-Real-IP lo fija nginx con $remote_addr. */
const buckets = new Map<string, Map<string, { count: number; resetAt: number }>>()

export function clientIp(event: H3Event): string {
  return getHeader(event, 'x-real-ip')
    ?? getHeader(event, 'x-forwarded-for')?.split(',').pop()?.trim()
    ?? 'unknown'
}

/** Borra el contador de una IP (p. ej. después de un login correcto). */
export function limpiarLimite(event: H3Event, name: string) {
  buckets.get(name)?.delete(clientIp(event))
}

export function rateLimit(event: H3Event, name: string, max: number, windowMs: number) {
  let b = buckets.get(name)
  if (!b) buckets.set(name, b = new Map())
  const ip  = clientIp(event)
  const now = Date.now()
  const cur = b.get(ip)
  if (!cur || cur.resetAt < now) {
    if (b.size > 5000) for (const [k, v] of b) if (v.resetAt < now) b.delete(k)
    b.set(ip, { count: 1, resetAt: now + windowMs })
    return
  }
  if (++cur.count > max) {
    const min = Math.ceil((cur.resetAt - now) / 60_000)
    throw createError({ statusCode: 429, message: `Demasiados intentos. Espera ${min} minuto${min !== 1 ? 's' : ''} e intenta de nuevo.` })
  }
}
