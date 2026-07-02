import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const q       = getQuery(event)
  const onlyUnread = q.unread === 'true'

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.userId,
      ...(onlyUnread ? { read: false } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const unreadCount = await prisma.notification.count({
    where: { userId: session.userId, read: false },
  })

  return { notifications, unreadCount }
})
