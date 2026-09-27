import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { QUOTE_INCLUDE, serializeQuote, puedeVerCotizacion, preciosDelDia } from '~/server/utils/cotizacion'
import type { OrderItem } from '~/types'

/* Detalle de la cotización con precios del día para el cliente. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const id = getRouterParam(event, 'id')!
  const quote = await prisma.quote.findUnique({ where: { id }, include: QUOTE_INCLUDE })
  if (!quote || !puedeVerCotizacion(session, quote)) throw createError({ statusCode: 404, message: 'Cotización no encontrada' })

  // Solo las abiertas se recalculan; las convertidas o canceladas muestran lo que se guardó
  const precios = quote.status === 'open' ? await preciosDelDia(quote.userId, quote.items as unknown as OrderItem[]) : null
  return { quote: serializeQuote(quote), precios }
})
