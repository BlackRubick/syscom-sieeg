import prisma from '~/server/utils/prisma'
import { getCharge } from '~/server/utils/openpay'
import { approveOrder } from '~/server/utils/approveOrder'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    type:               string
    verification_code?: string
    event_date?:        string
    transaction?:       { id: string; status: string }
  }>(event)

  // OpenPay sends this when you first register the webhook URL
  if (body?.type === 'verification') {
    return { verification_code: body.verification_code }
  }

  const transactionId = body?.transaction?.id
  if (!transactionId) return { ok: true }

  // Verify the charge against OpenPay API — never trust the webhook body alone
  let charge
  try {
    charge = await getCharge(transactionId)
  } catch {
    return { ok: false }
  }

  const order = await prisma.order.findFirst({
    where: { paymentId: transactionId },
  })
  // Not our order (could be a test or old transaction) — ack anyway
  if (!order) return { ok: true }

  if (body.type === 'charge.succeeded' && charge.status === 'completed') {
    if (order.paymentStatus !== 'paid') {
      await prisma.order.update({
        where: { id: order.id },
        data:  { paymentStatus: 'paid' },
      })
    }
    // Un pago que llega tarde a un pedido cancelado no lo revive: queda pagado para reembolsar
    if (order.status === 'pending') {
      await approveOrder(order.id).catch(() => { /* queda pagado y pendiente; se aprueba a mano */ })
    }
  } else if (
    (body.type === 'charge.failed' || body.type === 'charge.cancelled') &&
    (charge.status === 'failed' || charge.status === 'cancelled')
  ) {
    await prisma.order.update({
      where: { id: order.id },
      data:  { paymentStatus: charge.status },
    })
  }

  return { ok: true }
})
