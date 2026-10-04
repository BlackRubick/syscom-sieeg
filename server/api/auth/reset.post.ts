import { rateLimit } from '~/server/utils/rateLimit'
import { usuarioDeTokenReset, guardarPassword } from '~/server/utils/resetPassword'

/* Crea o restablece la contraseña con la liga del correo. Una cuenta pendiente que llega aquí ya fue aprobada. */
export default defineEventHandler(async (event) => {
  rateLimit(event, 'auth-reset', 10, 15 * 60_000)
  const body = await readBody<{ token?: string; password?: string }>(event)
  const user = await usuarioDeTokenReset(body?.token)
  await guardarPassword(user.id, String(body?.password ?? ''))
  return { ok: true, email: user.email }
})
