import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { QUOTE_INCLUDE, serializeQuote, puedeVerCotizacion, limpiarNombre } from '~/server/utils/cotizacion'
import { resolverCliente, vendeAClientes } from '~/server/utils/roles'
import { esMostrador } from '~/server/utils/mostrador'
import { formatQuoteNumber } from '~/utils/quoteNumber'

/* Cambiar el nombre, cancelar o (vendedor/admin) asignar a otro cliente una cotización abierta. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role === 'viewer') throw createError({ statusCode: 403, message: 'Tu cuenta es de solo consulta' })
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ status?: string; name?: string; clientId?: string }>(event)
  const renombrar = 'name' in body
  const asignar   = typeof body.clientId === 'string' && !!body.clientId
  if (!renombrar && !asignar && body.status !== 'cancelled') throw createError({ statusCode: 400, message: 'Solo se puede renombrar, asignar o cancelar la cotización' })

  const quote = await prisma.quote.findUnique({ where: { id } })
  if (!quote || !puedeVerCotizacion(session, quote)) throw createError({ statusCode: 404, message: 'Cotización no encontrada' })
  if (renombrar) {
    const actualizada = await prisma.quote.update({ where: { id }, data: { name: limpiarNombre(body.name) }, include: QUOTE_INCLUDE })
    return { quote: serializeQuote(actualizada) }
  }
  if (quote.status !== 'open') throw createError({ statusCode: 400, message: 'La cotización ya no está abierta' })

  if (asignar) {
    // Ej. la cotización se hizo a "Mostrador · Público en general" y ya se sabe quién es el cliente
    if (!vendeAClientes(session.role)) throw createError({ statusCode: 403, message: 'Solo vendedores y administradores pueden asignar cotizaciones' })
    const { clientId } = await resolverCliente(session, body.clientId)
    await prisma.user.updateMany({ where: { id: quote.userId, cartQuoteId: id }, data: { cartQuoteId: null } })
    const actualizada = await prisma.quote.update({
      where: { id },
      data:  { userId: clientId, sellerId: quote.sellerId ?? session.userId },
      include: QUOTE_INCLUDE,
    })
    if (clientId !== session.userId && !esMostrador(actualizada.user.email)) {
      await prisma.notification.create({
        data: {
          userId:  clientId,
          type:    'system',
          title:   `Nueva cotización ${actualizada.name ? `«${actualizada.name}»` : formatQuoteNumber(actualizada.number)}`,
          message: `${actualizada.seller?.name ?? 'Tu vendedor'} te asignó una cotización. Entra, revísala y haz tu pedido.`,
        },
      })
    }
    return { quote: serializeQuote(actualizada) }
  }

  const actualizada = await prisma.quote.update({ where: { id }, data: { status: 'cancelled' }, include: QUOTE_INCLUDE })
  return { quote: serializeQuote(actualizada) }
})
