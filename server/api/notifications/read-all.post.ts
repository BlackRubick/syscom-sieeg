import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  await prisma.notification.updateMany({
    where: { userId: session.userId, read: false },
    data:  { read: true },
  })
  return { ok: true }
})
