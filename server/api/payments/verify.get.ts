import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { getCharge } from '~/server/utils/openpay'

export default defineEventHandler(async (event) => {
  const session  = requireSession(event)
  const { id }   = getQuery(event) as { id?: string }

  if (!id) throw createError({ statusCode: 400, message: 'chargeId requerido' })

  const order = await prisma.order.findFirst({
    where: { paymentId: id, userId: session.userId },
  })
  if (!order) throw createError({ statusCode: 404, message: 'Orden no encontrada' })

  const charge = await getCharge(id)

  let paymentStatus = order.paymentStatus
  if (charge.status === 'completed' && order.paymentStatus !== 'paid') {
    paymentStatus = 'paid'
    await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'paid' } })
  } else if (charge.status === 'failed' && order.paymentStatus !== 'failed') {
    paymentStatus = 'failed'
    await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'failed' } })
  }

  return {
    orderId:       order.id,
    paymentStatus,
    authorization: charge.authorization,
    chargeStatus:  charge.status,
  }
})
