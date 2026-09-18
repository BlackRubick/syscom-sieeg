import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { cartItems: true },
  })
  const raw = (user?.cartItems as any[]) ?? []
  return { items: JSON.parse(JSON.stringify(raw)) }
})
