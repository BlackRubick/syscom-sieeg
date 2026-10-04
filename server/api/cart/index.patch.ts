import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const body = await readBody<{ items?: unknown[]; quoteId?: string | null }>(event)
  if (session.role === 'viewer') throw createError({ statusCode: 403, message: 'Tu cuenta es de solo consulta' })
  const items = Array.isArray(body.items) ? body.items : []
  // El carrito se guarda tal cual en la BD: se limita su tamaño y forma
  if (items.length > 100) throw createError({ statusCode: 400, message: 'Máximo 100 productos en el carrito' })
  if (JSON.stringify(items).length > 200_000) throw createError({ statusCode: 413, message: 'El carrito es demasiado grande' })
  for (const it of items as Array<{ product?: { id?: unknown }; quantity?: unknown }>) {
    const q = Number(it?.quantity)
    if (!it?.product || typeof it.product.id !== 'string' || !Number.isInteger(q) || q < 1 || q > 9999) {
      throw createError({ statusCode: 400, message: 'Producto inválido en el carrito' })
    }
  }
  const data: { cartItems: unknown[]; cartQuoteId?: string | null } = { cartItems: items }

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
  if (!items.length) data.cartQuoteId = null

  await prisma.user.update({ where: { id: session.userId }, data: data as never })
  return { ok: true }
})
