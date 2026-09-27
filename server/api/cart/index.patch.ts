import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const body = await readBody<{ items?: unknown[]; quoteId?: string | null }>(event)
  const data: { cartItems: unknown[]; cartQuoteId?: string | null } = { cartItems: body.items ?? [] }

  // Cotización cargada en el carrito: solo una propia y abierta; null la quita
  if ('quoteId' in body) {
    if (body.quoteId) {
      const q = await prisma.quote.findUnique({ where: { id: String(body.quoteId) }, select: { userId: true, status: true } })
      if (!q || q.userId !== session.userId || q.status !== 'open') throw createError({ statusCode: 400, message: 'Esa cotización ya no está disponible' })
      data.cartQuoteId = String(body.quoteId)
    } else {
      data.cartQuoteId = null
    }
  }
  if (!(body.items ?? []).length) data.cartQuoteId = null

  await prisma.user.update({ where: { id: session.userId }, data: data as never })
  return { ok: true }
})
