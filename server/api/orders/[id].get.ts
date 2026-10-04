import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { ORDER_INCLUDE, serializeOrder } from '~/server/utils/orderDto'
import { actualizarPreciosPendiente } from '~/server/utils/actualizarPrecios'

/* Un pedido (detalle y PDF): el cliente ve los suyos; vendedores y administración, todos. */
export default defineEventHandler(async (event) => {
  const session   = requireSession(event)
  const isManager = session.role === 'admin' || session.role === 'approver'
  const id = getRouterParam(event, 'id')!
  let order = await prisma.order.findUnique({ where: { id }, include: ORDER_INCLUDE })
  const puedeVer = !!order && (isManager || session.role === 'seller' || order.userId === session.userId)
  if (!puedeVer) throw createError({ statusCode: 404, message: 'Pedido no encontrado' })
  // Pendiente y sin pagar: se trae al precio del día antes de mostrarlo
  const actualizado = await actualizarPreciosPendiente(id).catch(() => false)
  if (actualizado) order = await prisma.order.findUniqueOrThrow({ where: { id }, include: ORDER_INCLUDE })
  return { order: serializeOrder(order!, isManager), precioActualizado: actualizado }
})
