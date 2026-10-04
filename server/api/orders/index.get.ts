import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { ORDER_INCLUDE, serializeOrder } from '~/server/utils/orderDto'
import { parseClientNumber } from '~/utils/clientNumber'

export default defineEventHandler(async (event) => {
  const session   = requireSession(event)
  const isManager = session.role === 'admin' || session.role === 'approver'
  const veTodos   = isManager || session.role === 'seller'

  const q       = getQuery(event)
  const page    = Math.max(1, Number(q.page    ?? 1))
  const perPage = Math.min(100, Math.max(1, Number(q.per_page ?? 30)))
  const ESTADOS = ['pending', 'approved', 'rejected', 'cancelled', 'processing', 'shipped', 'delivered']
  if (q.status && !ESTADOS.includes(String(q.status))) throw createError({ statusCode: 400, message: 'Estado inválido' })
  const status  = q.status ? String(q.status) : undefined
  const search  = q.search ? String(q.search) : undefined
  // Filtros por cliente y empresa (solo admin/approver)
  const cliente = veTodos && typeof q.cliente === 'string' && q.cliente ? q.cliente : undefined
  const empresa = veTodos && typeof q.empresa === 'string' && q.empresa ? q.empresa : undefined

  // Empresa → usuarios con esa razón social (se compara sin espacios sobrantes)
  const idsEmpresa = empresa
    ? (await prisma.user.findMany({ where: { fiscalRazonSocial: { contains: empresa.trim() } }, select: { id: true, fiscalRazonSocial: true } }))
        .filter(u => u.fiscalRazonSocial?.trim() === empresa.trim()).map(u => u.id)
    : undefined

  const whereBase = {
    ...(veTodos ? {} : { userId: session.userId }),
    ...(cliente ? { userId: cliente } : {}),
    ...(idsEmpresa ? { userId: { in: cliente ? idsEmpresa.filter(id => id === cliente) : idsEmpresa } } : {}),
    ...(search ? {
      OR: [
        { id:              { contains: search } },
        { user: { name:  { contains: search } } },
        { user: { email: { contains: search } } },
        { user: { fiscalRazonSocial: { contains: search } } },
        { syscomFolio:     { contains: search } },
        { seller: { name: { contains: search } } },
        ...(parseClientNumber(search) ? [{ user: { clientNumber: parseClientNumber(search)! } }] : []),
      ],
    } : {}),
  }

  const where = { ...whereBase, ...(status ? { status: status as never } : {}) }

  const [orders, total, porEstado] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip:    (page - 1) * perPage,
      take:    perPage,
      include: ORDER_INCLUDE,
    }),
    prisma.order.count({ where }),
    // Conteo por estado con los mismos filtros (las pestañas no dependen de la página cargada)
    prisma.order.groupBy({ by: ['status'], where: whereBase, _count: { _all: true }, orderBy: { status: 'asc' } }),
  ])
  const conteos: Record<string, number> = { all: 0 }
  for (const g of porEstado) {
    const n = (g._count as { _all: number })._all
    conteos[g.status] = n
    conteos.all += n
  }

  return {
    orders: orders.map(o => serializeOrder(o, isManager)),
    pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
    conteos,
  }
})
