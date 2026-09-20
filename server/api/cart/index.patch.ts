import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const { items } = await readBody(event)
  await prisma.user.update({
    where: { id: session.userId },
    data: { cartItems: items ?? [] },
  })
  return { ok: true }
})
