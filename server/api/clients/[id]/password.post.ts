import { randomInt } from 'crypto'
import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { vendeAClientes } from '~/server/utils/roles'
import { getMostradorId } from '~/server/utils/mostrador'
import { guardarPassword, crearTokenReset, urlSitio } from '~/server/utils/resetPassword'
import { sendPasswordEmail } from '~/server/utils/email'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'

/* El cliente olvidó su contraseña: se le manda la liga por correo o se genera una nueva para dársela.
   Vendedores solo con clientes (compradores); administración, con cualquiera. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (!vendeAClientes(session.role)) throw createError({ statusCode: 403, message: 'Sin autorización' })
  const id   = getRouterParam(event, 'id')!
  const body = await readBody<{ modo?: 'correo' | 'generar' }>(event)

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true, status: true, password: true } })
  if (!user) throw createError({ statusCode: 404, message: 'Cliente no encontrado' })
  if (session.role === 'seller' && user.role !== 'buyer') throw createError({ statusCode: 403, message: 'Solo puedes hacerlo con clientes' })
  if (id === await getMostradorId()) throw createError({ statusCode: 400, message: 'El cliente de mostrador no inicia sesión' })
  if (user.status === 'inactive') throw createError({ statusCode: 400, message: 'La cuenta está desactivada' })

  // Una cuenta pendiente que recibe acceso del vendedor queda activa
  const activar = user.status === 'pending' ? { status: 'active' as const } : {}

  if (body?.modo === 'generar') {
    const password = Array.from({ length: 10 }, () => CHARS[randomInt(CHARS.length)]).join('')
    await guardarPassword(id, password, activar)
    return { password, email: user.email }
  }

  if (user.status === 'pending') await prisma.user.update({ where: { id }, data: activar })
  const link = `${urlSitio(event)}/restablecer?token=${encodeURIComponent(crearTokenReset(user, 72))}`
  await sendPasswordEmail({ to: user.email, nombre: user.name, link, bienvenida: user.status === 'pending', horas: 72 })
    .catch(() => { throw createError({ statusCode: 502, message: 'No se pudo enviar el correo. Genera una contraseña y compártesela.' }) })
  return { enviadoA: user.email }
})
