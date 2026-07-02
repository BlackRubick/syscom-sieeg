import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session   = requireSession(event)
  const isManager = session.role === 'admin' || session.role === 'approver'

  const q       = getQuery(event)
  const page    = Math.max(1, Number(q.page    ?? 1))
  const perPage = Math.min(100, Math.max(1, Number(q.per_page ?? 30)))
  const status  = q.status ? String(q.status) : undefined
  const search  = q.search ? String(q.search) : undefined

  const where = {
    ...(isManager ? {} : { userId: session.userId }),
    ...(status ? { status: status as never } : {}),
    ...(search ? {
      OR: [
        { id:              { contains: search } },
        { user: { name:  { contains: search } } },
        { user: { email: { contains: search } } },
        { syscomFolio:     { contains: search } },
      ],
    } : {}),
  }

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip:    (page - 1) * perPage,
      take:    perPage,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.order.count({ where }),
  ])

  return {
    orders: orders.map(o => ({
      id:          o.id,
      userId:      o.userId,
      userName:    o.user.name,
      userEmail:   o.user.email,
      status:      o.status,
      items:       o.items,
      total:       o.total,
      priority:    o.priority,
      notes:       o.notes,
      syscomFolio: o.syscomFolio,
      cfdiUid:     o.cfdiUid,
      auditLog:    o.auditLog,
      createdAt:   o.createdAt.toISOString(),
      updatedAt:   o.updatedAt.toISOString(),
    })),
    pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
  }
})
