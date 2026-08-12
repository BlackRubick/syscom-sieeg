import { createHmac } from 'crypto'
import type { H3Event } from 'h3'

export const SESSION_COOKIE = 'sieeg_sess'
export const TTL_MS        = 15 * 60 * 1000  // 15 min inactividad
export const COOKIE_MAX_AGE = 15 * 60         // segundos

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
  if (sign(body) !== sig) return null
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (!p.exp || p.exp < Date.now()) return null
    return p
  } catch { return null }
}

export function getSession(event: H3Event): SessionPayload | null {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return null
  return verifyToken(token)
}

export function requireSession(event: H3Event): SessionPayload {
  const session = getSession(event)
  if (!session) throw createError({ statusCode: 401, message: 'No autorizado' })
  return session
}
