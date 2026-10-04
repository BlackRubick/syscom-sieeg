import prisma from '~/server/utils/prisma'
import { rateLimit } from '~/server/utils/rateLimit'
import { crearTokenReset, urlSitio } from '~/server/utils/resetPassword'
import { sendPasswordEmail } from '~/server/utils/email'

/* "Olvidé mi contraseña": manda una liga de 1 hora. Siempre responde igual para no revelar qué correos existen. */
export default defineEventHandler(async (event) => {
  rateLimit(event, 'auth-forgot', 5, 15 * 60_000)
  const body  = await readBody<{ email?: string }>(event)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase().slice(0, 160) : ''
  if (!email) throw createError({ statusCode: 400, message: 'Escribe tu correo' })

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true, password: true, status: true } })
  if (user && user.status === 'active') {
    const link = `${urlSitio(event)}/restablecer?token=${encodeURIComponent(crearTokenReset(user, 1))}`
    await sendPasswordEmail({ to: user.email, nombre: user.name, link, bienvenida: false, horas: 1 }).catch(() => { /* se responde igual */ })
  }
  return { ok: true }
})
