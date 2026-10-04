import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { actualizarEstadoSyscom } from '~/server/utils/syscomTracking'
import { ORDER_INCLUDE, serializeOrder } from '~/server/utils/orderDto'

/* Consulta ahora mismo el estado del pedido en SYSCOM y lo guarda. */
export default defineEventHandler(async (event) => {
  const session   = requireSession(event)
  const isManager = session.role === 'admin' || session.role === 'approver'

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) throw createError({ statusCode: 404, message: 'Orden no encontrada' })
  // El vendedor ve todos los pedidos, así que también puede consultar su estado en SYSCOM
  if (order.userId !== session.userId && !isManager && session.role !== 'seller') throw createError({ statusCode: 403, message: 'Sin autorización' })
  if (!order.syscomFolio) throw createError({ statusCode: 400, message: 'Este pedido no tiene folio SYSCOM' })

  let result
  try {
    result = await actualizarEstadoSyscom(order)
  } catch {
    throw createError({ statusCode: 502, message: 'No se pudo consultar SYSCOM, intenta de nuevo' })
  }

  const updated = await prisma.order.findUniqueOrThrow({ where: { id }, include: ORDER_INCLUDE })
  return { statusUpdated: result?.statusUpdated ?? null, order: serializeOrder(updated, isManager) }
})
