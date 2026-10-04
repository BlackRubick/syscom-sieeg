import { createHmac, timingSafeEqual } from 'crypto'
import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'
import prisma from '~/server/utils/prisma'
import { passwordVersion } from '~/server/utils/session'
import { olvidarUsuarioEnCache } from '~/server/middleware/refresh-session'

/* Liga para crear o restablecer contraseña, sin guardar nada en la BD:
   va firmada y lleva la huella de la contraseña actual, así que deja de servir en cuanto se usa. */

function firma(body: string) {
  const s = process.env.SESSION_SECRET
  if (!s && !import.meta.dev) throw createError({ statusCode: 500, message: 'SESSION_SECRET no está configurado' })
  return createHmac('sha256', `${s ?? 'dev'}:reset`).update(body).digest('base64url')
}

export function crearTokenReset(user: { id: string; password: string }, horas: number): string {
  const body = Buffer.from(JSON.stringify({ uid: user.id, pv: passwordVersion(user.password), exp: Date.now() + horas * 3600_000 })).toString('base64url')
  return `${body}.${firma(body)}`
}

export async function usuarioDeTokenReset(token: unknown) {
  const t = typeof token === 'string' ? token : ''
  const dot = t.lastIndexOf('.')
  const invalida = createError({ statusCode: 400, message: 'La liga ya no es válida o ya se usó. Pide una nueva.' })
  if (dot < 0) throw invalida
  const body = t.slice(0, dot)
  const a = Buffer.from(firma(body)), b = Buffer.from(t.slice(dot + 1))
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw invalida
  let p: { uid?: string; pv?: string; exp?: number }
  try { p = JSON.parse(Buffer.from(body, 'base64url').toString()) } catch { throw invalida }
  if (!p.uid || !p.exp || p.exp < Date.now()) throw invalida
  const user = await prisma.user.findUnique({ where: { id: p.uid }, select: { id: true, name: true, email: true, password: true, status: true } })
  if (!user || user.status === 'inactive' || passwordVersion(user.password) !== p.pv) throw invalida
  return user
}

export function validarPassword(pw: unknown): string {
  if (typeof pw !== 'string' || pw.length < 8) throw createError({ statusCode: 400, message: 'La contraseña debe tener al menos 8 caracteres' })
  if (pw.length > 200) throw createError({ statusCode: 400, message: 'La contraseña es demasiado larga' })
  return pw
}

/** Guarda la contraseña nueva (bcrypt) y cierra las sesiones anteriores del usuario. */
export async function guardarPassword(userId: string, pw: string, extra: { status?: 'active' } = {}) {
  const hash = await bcrypt.hash(validarPassword(pw), 12)
  await prisma.user.update({ where: { id: userId }, data: { password: hash, ...extra } })
  olvidarUsuarioEnCache(userId)
}

export function urlSitio(event: H3Event) {
  return getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin
}
