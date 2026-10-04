import prisma from '~/server/utils/prisma'
import { verifyToken, createToken, passwordVersion, SESSION_COOKIE, SESSION_COOKIE_OPTS } from '~/server/utils/session'
import type { SessionPayload } from '~/server/utils/session'

// Estado del usuario en caché unos segundos para no consultar la BD en cada asset/petición
type CachedUser = { role: string; status: string; name: string; email: string; pv: string } | null
const userCache = new Map<string, { user: CachedUser; exp: number }>()
const CACHE_MS  = 10_000

async function lookupUser(id: string): Promise<CachedUser> {
  const hit = userCache.get(id)
  if (hit && hit.exp > Date.now()) return hit.user
  const u = await prisma.user.findUnique({ where: { id }, select: { role: true, status: true, name: true, email: true, password: true } })
  const user = u ? { role: u.role, status: u.status, name: u.name, email: u.email, pv: passwordVersion(u.password) } : null
  if (userCache.size > 1000) userCache.clear()
  userCache.set(id, { user, exp: Date.now() + CACHE_MS })
  return user
}

/** Tras cambiar contraseña, rol o estado: que el cambio aplique de inmediato y no hasta que caduque la caché. */
export function olvidarUsuarioEnCache(id: string) { userCache.delete(id) }

/* En cada request autenticado:
   - revoca la sesión si el usuario ya no existe, no está activo o cambió su contraseña
   - toma el rol/nombre actuales de la BD (un cambio de rol aplica de inmediato)
   - renueva el cookie → 2 h de inactividad */
export default defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return

  const payload = verifyToken(token)
  if (!payload) {
    event.context.session = null
    return
  }

  try {
    const user = await lookupUser(payload.userId)
    // Tokens anteriores a este cambio no traen pv: se aceptan hasta que se renueven
    if (!user || user.status !== 'active' || (payload.pv && payload.pv !== user.pv)) {
      event.context.session = null
      deleteCookie(event, SESSION_COOKIE, SESSION_COOKIE_OPTS)
      return
    }

    const session: SessionPayload = { userId: payload.userId, role: user.role, name: user.name, email: user.email, pv: user.pv }
    event.context.session = session
    setCookie(event, SESSION_COOKIE, createToken(session), SESSION_COOKIE_OPTS)
  } catch {
    // Si la BD falla no tumbamos la request: se usa el token tal cual (getSession lo valida)
  }
})
