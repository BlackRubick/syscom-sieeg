import { getSession, createToken, SESSION_COOKIE, COOKIE_MAX_AGE } from '~/server/utils/session'

// Renueva el cookie en cada request autenticado → 15 min de inactividad
export default defineEventHandler((event) => {
  const session = getSession(event)
  if (!session) return

  const fresh = createToken({
    userId: session.userId,
    role:   session.role,
    name:   session.name,
    email:  session.email,
  })

  setCookie(event, SESSION_COOKIE, fresh, {
    httpOnly: true,
    secure:   false,
    sameSite: 'lax',
    maxAge:   COOKIE_MAX_AGE,
    path:     '/',
  })
})
