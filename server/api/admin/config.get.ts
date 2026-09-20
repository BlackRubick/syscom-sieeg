import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true } })
  if (user?.role !== 'admin') throw createError({ statusCode: 403, message: 'Forbidden' })

  return prisma.siteConfig.upsert({
    where:  { id: 1 },
    create: { id: 1, markupPct: 0 },
    update: {},
  })
})
