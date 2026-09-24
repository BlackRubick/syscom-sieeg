import { createHmac, timingSafeEqual } from 'crypto'
import type { H3Event } from 'h3'

export const SESSION_COOKIE = 'sieeg_sess'
export const TTL_MS        = 15 * 60 * 1000  // 15 min inactividad
export const COOKIE_MAX_AGE = 15 * 60         // segundos

// En producción el sitio solo se sirve por HTTPS (nginx redirige el puerto 80)
export const SESSION_COOKIE_OPTS = {
  httpOnly: true,
  secure:   !import.meta.dev,
  sameSite: 'lax' as const,
  maxAge:   COOKIE_MAX_AGE,
  path:     '/',
}

export interface SessionPayload {
  userId: string
  role: string
  name: string
  email: string
}

function secret(): string {
  return process.env.SESSION_SECRET ?? 'dev-secret'
}

function sign(data: string): string {
  return createHmac('sha256', secret()).update(data).digest('base64url')
}

export function createToken(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + TTL_MS })).toString('base64url')
  return `${body}.${sign(body)}`
}

export function verifyToken(token: string): (SessionPayload & { exp: number }) | null {
  const dot = token.lastIndexOf('.')
  if (dot < 0) return null
  const body = token.slice(0, dot)
  const sig  = token.slice(dot + 1)
  const expected = Buffer.from(sign(body))
  const given    = Buffer.from(sig)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (!p.exp || p.exp < Date.now()) return null
    return p
  } catch { return null }
}

export function getSession(event: H3Event): SessionPayload | null {
  // El middleware refresh-session ya validó la sesión contra la base de datos
  // (usuario activo, rol actual); si lo hizo, esa es la fuente de verdad.
  if ('session' in event.context) return event.context.session as SessionPayload | null
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return null
  return verifyToken(token)
}

export function requireSession(event: H3Event): SessionPayload {
  const session = getSession(event)
  if (!session) throw createError({ statusCode: 401, message: 'No autorizado' })
  return session
}
