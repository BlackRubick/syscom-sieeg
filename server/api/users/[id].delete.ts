import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores pueden eliminar usuarios' })

  const id = getRouterParam(event, 'id')!

  if (id === session.userId) {
    throw createError({ statusCode: 400, message: 'No puedes eliminar tu propia cuenta' })
  }

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })

  await prisma.user.delete({ where: { id } })

  return { ok: true }
})
