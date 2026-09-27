import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true } })
  if (user?.role !== 'admin') throw createError({ statusCode: 403, message: 'Forbidden' })

  const body = await readBody(event)
  const clamp = (v: unknown, max: number) => Math.max(0, Math.min(max, Math.round((parseFloat(String(v)) || 0) * 100) / 100))
  const data: { markupPct?: number; freeShippingMin?: number; shippingFee?: number } = {}
  if (body.markupPct       !== undefined) data.markupPct       = clamp(body.markupPct, 500)
  if (body.freeShippingMin !== undefined) data.freeShippingMin = clamp(body.freeShippingMin, 1_000_000)
  if (body.shippingFee     !== undefined) data.shippingFee     = clamp(body.shippingFee, 100_000)

  return prisma.siteConfig.upsert({
    where:  { id: 1 },
    create: { id: 1, ...data },
    update: data,
  })
})
