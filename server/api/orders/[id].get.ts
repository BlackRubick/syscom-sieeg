import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { ORDER_INCLUDE, serializeOrder } from '~/server/utils/orderDto'

/* Un pedido (para su PDF): el cliente ve los suyos; vendedores y administración, todos. */
export default defineEventHandler(async (event) => {
  const session   = requireSession(event)
  const isManager = session.role === 'admin' || session.role === 'approver'
  const id = getRouterParam(event, 'id')!
  const order = await prisma.order.findUnique({ where: { id }, include: ORDER_INCLUDE })
  const puedeVer = !!order && (isManager || session.role === 'seller' || order.userId === session.userId)
  if (!puedeVer) throw createError({ statusCode: 404, message: 'Pedido no encontrado' })
  return { order: serializeOrder(order!, isManager) }
})
