import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const id      = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  await prisma.notification.updateMany({
    where: { id, userId: session.userId },
    data:  { read: true },
  })
  return { ok: true }
})
