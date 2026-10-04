import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { vendeAClientes } from '~/server/utils/roles'
import { getMostradorId } from '~/server/utils/mostrador'
import { formatQuoteNumber } from '~/utils/quoteNumber'

/* Ficha completa de un cliente (vendedores y administración): contacto, datos fiscales, descuento y actividad. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (!vendeAClientes(session.role)) throw createError({ statusCode: 403, message: 'Sin autorización' })
  const id = getRouterParam(event, 'id')!

  const u = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, clientNumber: true, role: true, status: true, createdAt: true, lastLogin: true, discountPct: true,
      fiscalCompleted: true, fiscalRfc: true, fiscalRazonSocial: true, fiscalCodpos: true, fiscalEmail: true, fiscalUsocfdi: true, fiscalRegimen: true,
      fiscalPais: true, fiscalCalle: true, fiscalNumExt: true, fiscalNumInt: true, fiscalColonia: true, fiscalCiudad: true, fiscalDelegacion: true,
      fiscalLocalidad: true, fiscalEstado: true, fiscalNombre: true, fiscalApellidos: true, fiscalTelefono: true,
      _count: { select: { orders: true, quotes: true, rmas: true } },
      orders: { orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, total: true, status: true, createdAt: true } },
      quotes: { orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, number: true, name: true, total: true, status: true, createdAt: true } },
    },
  })
  if (!u) throw createError({ statusCode: 404, message: 'Cliente no encontrado' })

  const { _count, orders, quotes, ...datos } = u
  return {
    cliente: {
      ...datos,
      mostrador:     u.id === await getMostradorId(),
      pedidos:       _count.orders,
      cotizaciones:  _count.quotes,
      garantias:     _count.rmas,
      ultimosPedidos: orders.map(o => ({ id: o.id, folio: `PED-${o.id.slice(-8).toUpperCase()}`, total: o.total, status: o.status, createdAt: o.createdAt.toISOString() })),
      ultimasCotizaciones: quotes.map(q => ({ id: q.id, folio: formatQuoteNumber(q.number, q.createdAt), name: q.name, total: q.total, status: q.status, createdAt: q.createdAt.toISOString() })),
    },
  }
})
