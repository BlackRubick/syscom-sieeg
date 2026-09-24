import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { enviarPedidoSyscom } from '~/server/utils/syscom'
import type { OrderItem } from '~/types'

// Evita dos pedidos reales en SYSCOM si se presiona "Reintentar" dos veces seguidas
const enCurso = new Set<string>()

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin' && session.role !== 'approver') {
    throw createError({ statusCode: 403, message: 'Sin autorización' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order)              throw createError({ statusCode: 404, message: 'Orden no encontrada' })
  if (order.status !== 'approved') throw createError({ statusCode: 400, message: 'Solo se puede reintentar en órdenes aprobadas' })
  if (order.syscomFolio)   throw createError({ statusCode: 400, message: 'Esta orden ya tiene folio SYSCOM' })

  if (enCurso.has(id)) throw createError({ statusCode: 409, message: 'Ya se está enviando este pedido a SYSCOM' })
  enCurso.add(id)
  let result
  try {
    result = await enviarPedidoSyscom(order.userId, order.items as OrderItem[], order.id.slice(-8).toUpperCase())
  } finally {
    enCurso.delete(id)
  }

  const auditLog = [...((order.auditLog ?? []) as unknown[]), {
    status: 'approved', by: session.userId, byName: session.name, at: new Date().toISOString(), retry: true,
    ...(result.folio ? { syscomFolio: result.folio } : {}),
    ...(result.error ? { syscomError: result.error } : {}),
  }]

  if (result.error && !result.folio) {
    await prisma.order.update({ where: { id }, data: { auditLog, syscomData: (result.data ?? { error: result.error }) as object } })
    throw createError({ statusCode: 502, message: result.error })
  }

  const updated = await prisma.order.update({
    where: { id },
    data:  { auditLog, syscomFolio: result.folio, syscomData: result.data ?? undefined },
  })

  return { folio: updated.syscomFolio, syscomError: result.error }
})
