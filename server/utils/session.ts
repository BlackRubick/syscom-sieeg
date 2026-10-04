import { createHash, createHmac, timingSafeEqual } from 'crypto'
import type { H3Event } from 'h3'

export const SESSION_COOKIE = 'sieeg_sess'
export const TTL_MS        = 2 * 60 * 60 * 1000  // 2 h de inactividad
export const COOKIE_MAX_AGE = 2 * 60 * 60         // segundos

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
  // Huella de la contraseña: si la contraseña cambia, las sesiones anteriores dejan de valer
  pv?: string
}

function secret(): string {
  const s = process.env.SESSION_SECRET
  if (s && s.length >= 32) return s
  // Sin secreto propio cualquiera podría firmar sesiones: solo se tolera en desarrollo
  if (import.meta.dev) return 'dev-secret-solo-para-desarrollo-local'
  throw createError({ statusCode: 500, message: 'SESSION_SECRET no está configurado (mínimo 32 caracteres)' })
}

function sign(data: string): string {
  return createHmac('sha256', secret()).update(data).digest('base64url')
}

/** Huella corta del hash de la contraseña (no revela nada de ella). */
export function passwordVersion(passwordHash: string): string {
  return createHash('sha256').update(passwordHash).digest('base64url').slice(0, 16)
}

// Sesiones cerradas con "Cerrar sesión" antes de expirar (firma → expiración)
const revocadas = new Map<string, number>()

export function revokeToken(token: string) {
  const p = verifyToken(token)
  if (!p) return
  const now = Date.now()
  if (revocadas.size > 5000) for (const [k, exp] of revocadas) if (exp < now) revocadas.delete(k)
  revocadas.set(token.slice(token.lastIndexOf('.') + 1), p.exp)
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
  if (revocadas.has(sig)) return null
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (!p.exp || p.exp < Date.now()) return null
    return p
  } catch { return null }
}

export function getSession(event: H3Event): SessionPayload | null {
  // El middleware refresh-session ya validó la sesión contra la base de datos
  // (usuario activo, rol actual, contraseña vigente); si lo hizo, esa es la fuente de verdad.
  if ('session' in event.context) return event.context.session as SessionPayload | null
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return null
  return verifyToken(token)
}

export function requireSession(event: H3Event): SessionPayload {
  const session = getSession(event)
  if (!session) throw createError({ statusCode: 401, message: 'Tu sesión expiró. Vuelve a iniciar sesión.' })
  return session
}
