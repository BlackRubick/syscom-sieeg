import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { crearPedido } from '~/server/utils/crearPedido'
import { puedeVerCotizacion } from '~/server/utils/cotizacion'
import { vendeAClientes } from '~/server/utils/roles'
import { formatQuoteNumber } from '~/utils/quoteNumber'
import type { OrderItem } from '~/types'

/* Convierte la cotización en pedido con precios del día. La acepta el cliente o la convierte su vendedor/admin. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role === 'viewer') throw createError({ statusCode: 403, message: 'Tu cuenta es de solo consulta' })
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ priority?: string; notes?: string }>(event).catch(() => ({} as { priority?: string; notes?: string }))

  const quote = await prisma.quote.findUnique({ where: { id }, include: { user: { select: { status: true } } } })
  if (!quote || !puedeVerCotizacion(session, quote)) throw createError({ statusCode: 404, message: 'Cotización no encontrada' })
  const esCliente = quote.userId === session.userId
  if (!esCliente && !vendeAClientes(session.role)) throw createError({ statusCode: 403, message: 'Sin autorización para convertir esta cotización' })
  if (quote.status !== 'open') throw createError({ statusCode: 400, message: 'La cotización ya no está abierta' })
  if (quote.user.status !== 'active') throw createError({ statusCode: 400, message: 'La cuenta del cliente no está activa' })

  // Reservar la cotización primero para que no se convierta dos veces
  const reservada = await prisma.quote.updateMany({ where: { id, status: 'open' }, data: { status: 'converted' } })
  if (!reservada.count) throw createError({ statusCode: 409, message: 'La cotización ya fue convertida' })

  try {
    // Si la acepta el cliente, el pedido queda a nombre del vendedor que la preparó
    const sellerId = esCliente ? quote.sellerId : session.userId
    const order = await crearPedido({
      clientId:    quote.userId,
      sellerId,
      items:       quote.items as unknown as OrderItem[],
      priority:    body.priority,
      notes:       [quote.notes, body.notes].filter(Boolean).join('\n') || null,
      quoteNumber: quote.number,
    })
    await prisma.quote.update({ where: { id }, data: { orderId: order.id } })

    if (esCliente && quote.sellerId) {
      await prisma.notification.create({
        data: {
          userId:  quote.sellerId,
          type:    'approval',
          title:   `${formatQuoteNumber(quote.number)} aceptada`,
          message: `${order.user.name} aceptó la cotización y se generó el pedido.`,
          orderId: order.id,
        },
      })
    }
    return { orderId: order.id }
  } catch (e) {
    await prisma.quote.update({ where: { id }, data: { status: 'open' } })
    throw e
  }
})
