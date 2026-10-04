import { SESSION_COOKIE, SESSION_COOKIE_OPTS, revokeToken } from '~/server/utils/session'

export default defineEventHandler((event) => {
  // Además de borrar el cookie, la sesión deja de valer en el servidor (por si alguien copió el cookie)
  const token = getCookie(event, SESSION_COOKIE)
  if (token) revokeToken(token)
  deleteCookie(event, SESSION_COOKIE, SESSION_COOKIE_OPTS)
  return { ok: true }
})
