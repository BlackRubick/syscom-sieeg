import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

const SURTIDOS = ['approved', 'processing', 'shipped', 'delivered'] as const

/* Ventas propias de SIEEG (no las compras a SYSCOM): lo que hay que atender hoy y cómo va el mes. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (!['admin', 'approver', 'viewer'].includes(session.role)) throw createError({ statusCode: 403, message: 'Sin autorización' })

  const ahora = new Date()
  const iniMes  = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  const iniPrev = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)

  const [pendientes, porCobrar, aReembolsar, cotizaciones, mes, mesPrev, ultimos] = await Promise.all([
    prisma.order.aggregate({ where: { status: 'pending' }, _count: { _all: true }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { status: { in: [...SURTIDOS] }, paymentStatus: { not: 'paid' } }, _count: { _all: true }, _sum: { total: true } }),
    prisma.order.count({ where: { status: { in: ['cancelled', 'rejected'] }, paymentStatus: 'paid' } }),
    prisma.quote.aggregate({ where: { status: 'open' }, _count: { _all: true }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { status: { in: [...SURTIDOS] }, createdAt: { gte: iniMes } }, _count: { _all: true }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { status: { in: [...SURTIDOS] }, createdAt: { gte: iniPrev, lt: iniMes } }, _count: { _all: true }, _sum: { total: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' }, take: 6,
      select: { id: true, total: true, status: true, paymentStatus: true, createdAt: true, user: { select: { name: true } } },
    }),
  ])

  return {
    pendientes:   { pedidos: pendientes._count._all, total: pendientes._sum.total ?? 0 },
    porCobrar:    { pedidos: porCobrar._count._all, total: porCobrar._sum.total ?? 0 },
    aReembolsar,
    cotizaciones: { abiertas: cotizaciones._count._all, total: cotizaciones._sum.total ?? 0 },
    ventasMes:    { pedidos: mes._count._all, total: mes._sum.total ?? 0 },
    ventasMesAnterior: { pedidos: mesPrev._count._all, total: mesPrev._sum.total ?? 0 },
    ultimos: ultimos.map(o => ({ id: o.id, folio: `PED-${o.id.slice(-8).toUpperCase()}`, cliente: o.user.name, total: o.total, status: o.status, paymentStatus: o.paymentStatus, createdAt: o.createdAt.toISOString() })),
  }
})
