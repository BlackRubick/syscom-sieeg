import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { vendeAClientes } from '~/server/utils/roles'
import { parseClientNumber } from '~/utils/clientNumber'

/* Clientes (compradores) para vendedores y administración: selector del carrito y página Clientes. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (!vendeAClientes(session.role)) throw createError({ statusCode: 403, message: 'Sin autorización' })

  const search = typeof getQuery(event).search === 'string' ? String(getQuery(event).search).trim().slice(0, 80) : ''
  const cl = search ? parseClientNumber(search) : null

  const clientes = await prisma.user.findMany({
    where: {
      role: 'buyer',
      ...(search ? {
        OR: [
          ...(cl ? [{ clientNumber: cl }] : []),
          { name: { contains: search } },
          { email: { contains: search } },
          { fiscalRazonSocial: { contains: search } },
          { fiscalRfc: { contains: search } },
        ],
      } : {}),
    },
    orderBy: { name: 'asc' },
    take: 300,
    select: {
      id: true, name: true, email: true, clientNumber: true, status: true, createdAt: true,
      fiscalCompleted: true, fiscalRazonSocial: true, fiscalRfc: true, fiscalTelefono: true, discountPct: true,
      _count: { select: { orders: true, quotes: true } },
    },
  })

  return {
    clientes: clientes.map(c => ({
      id: c.id, name: c.name, email: c.email, clientNumber: c.clientNumber, status: c.status, createdAt: c.createdAt,
      fiscalCompleted: c.fiscalCompleted, razonSocial: c.fiscalRazonSocial, rfc: c.fiscalRfc, telefono: c.fiscalTelefono,
      discountPct: c.discountPct, pedidos: c._count.orders, cotizaciones: c._count.quotes,
    })),
  }
})
