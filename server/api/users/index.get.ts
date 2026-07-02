import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  requireSession(event)

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id:true, name:true, email:true, role:true, status:true, createdAt:true, lastLogin:true, avatar:true },
  })

  return { users }
})
