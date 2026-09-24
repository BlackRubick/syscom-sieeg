import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores' })

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id:true, name:true, email:true, role:true, status:true, createdAt:true, lastLogin:true, avatar:true, clientNumber:true },
  })

  return { users }
})
