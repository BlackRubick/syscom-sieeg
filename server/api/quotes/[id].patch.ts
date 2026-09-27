import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { QUOTE_INCLUDE, serializeQuote, puedeVerCotizacion } from '~/server/utils/cotizacion'

/* Cancelar una cotización abierta (el cliente, vendedores o administración). */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role === 'viewer') throw createError({ statusCode: 403, message: 'Tu cuenta es de solo consulta' })
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ status?: string }>(event)
  if (body.status !== 'cancelled') throw createError({ statusCode: 400, message: 'Solo se puede cancelar la cotización' })

  const quote = await prisma.quote.findUnique({ where: { id } })
  if (!quote || !puedeVerCotizacion(session, quote)) throw createError({ statusCode: 404, message: 'Cotización no encontrada' })
  if (quote.status !== 'open') throw createError({ statusCode: 400, message: 'La cotización ya no está abierta' })

  const actualizada = await prisma.quote.update({ where: { id }, data: { status: 'cancelled' }, include: QUOTE_INCLUDE })
  return { quote: serializeQuote(actualizada) }
})
