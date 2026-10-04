import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { guardarDatosFiscales } from '~/server/utils/datosFiscales'

/* Administración o el vendedor capturan los datos fiscales de un cliente (misma validación que el propio cliente). */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin' && session.role !== 'seller') {
    throw createError({ statusCode: 403, message: 'Solo administradores y vendedores pueden editar datos fiscales de otros usuarios' })
  }
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const existing = await prisma.user.findUnique({ where: { id }, select: { role: true } })
  if (!existing) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })
  if (session.role === 'seller' && existing.role !== 'buyer') throw createError({ statusCode: 403, message: 'Solo puedes editar datos fiscales de clientes' })

  return guardarDatosFiscales(id, await readBody<Record<string, unknown>>(event))
})
