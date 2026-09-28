import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { resolverCliente } from '~/server/utils/roles'
import { normalizarItems, preciosDelDia, crearCotizacion, limpiarNombre, limpiarFolio, QUOTE_INCLUDE, serializeQuote } from '~/server/utils/cotizacion'
import { getMostradorId } from '~/server/utils/mostrador'
import { formatQuoteNumber } from '~/utils/quoteNumber'

/* Guarda el carrito como cotización (pedido previo) con folio consecutivo (0001). */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role === 'viewer') throw createError({ statusCode: 403, message: 'Tu cuenta es de solo consulta' })

  const body = await readBody<{ items?: unknown; clientId?: string; notes?: string; name?: string; purchaseOrder?: string }>(event)
  const items = normalizarItems(body.items)
  const { clientId, sellerId } = await resolverCliente(session, body.clientId)

  // Se guarda el total del día como referencia; al verla o aceptarla se recalcula
  const cot = await preciosDelDia(clientId, items)
  const guardados = cot.items.map(({ disponible: _d, existencia: _e, ...i }) => i)
  const notes = typeof body.notes === 'string' && body.notes.trim() ? body.notes.trim().slice(0, 1000) : null

  const nueva = await crearCotizacion({ userId: clientId, sellerId, name: limpiarNombre(body.name), items: guardados, total: cot.total, notes, purchaseOrder: limpiarFolio(body.purchaseOrder) })
  const quote = await prisma.quote.findUniqueOrThrow({ where: { id: nueva.id }, include: QUOTE_INCLUDE })

  if (sellerId && clientId !== await getMostradorId()) {
    await prisma.notification.create({
      data: {
        userId:  clientId,
        type:    'system',
        title:   `Nueva cotización ${quote.name ? `«${quote.name}»` : formatQuoteNumber(quote.number, quote.createdAt)}`,
        message: `${quote.seller?.name ?? 'Tu vendedor'} te preparó una cotización. Ya la tienes en tu carrito: entra, revísala y haz tu pedido.`,
      },
    })
  }

  return { quote: serializeQuote(quote) }
})
