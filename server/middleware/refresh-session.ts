import prisma from '~/server/utils/prisma'
import { verifyToken, createToken, SESSION_COOKIE, SESSION_COOKIE_OPTS } from '~/server/utils/session'
import type { SessionPayload } from '~/server/utils/session'

// Estado del usuario en caché unos segundos para no consultar la BD en cada asset/petición
const userCache = new Map<string, { user: { role: string; status: string; name: string; email: string } | null; exp: number }>()
const CACHE_MS  = 10_000

async function lookupUser(id: string) {
  const hit = userCache.get(id)
  if (hit && hit.exp > Date.now()) return hit.user
  const user = await prisma.user.findUnique({ where: { id }, select: { role: true, status: true, name: true, email: true } })
  if (userCache.size > 1000) userCache.clear()
  userCache.set(id, { user, exp: Date.now() + CACHE_MS })
  return user
}

/* En cada request autenticado:
   - revoca la sesión si el usuario ya no existe o no está activo
   - toma el rol/nombre actuales de la BD (un cambio de rol aplica de inmediato)
   - renueva el cookie → 15 min de inactividad */
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
    if (!user || user.status !== 'active') {
      event.context.session = null
      deleteCookie(event, SESSION_COOKIE, SESSION_COOKIE_OPTS)
      return
    }

    const session: SessionPayload = { userId: payload.userId, role: user.role, name: user.name, email: user.email }
    event.context.session = session
    setCookie(event, SESSION_COOKIE, createToken(session), SESSION_COOKIE_OPTS)
  } catch {
    // Si la BD falla no tumbamos la request: se usa el token tal cual (getSession lo valida)
  }
})
