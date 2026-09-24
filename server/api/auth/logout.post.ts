import { SESSION_COOKIE, SESSION_COOKIE_OPTS } from '~/server/utils/session'

export default defineEventHandler((event) => {
  deleteCookie(event, SESSION_COOKIE, SESSION_COOKIE_OPTS)
  return { ok: true }
})
