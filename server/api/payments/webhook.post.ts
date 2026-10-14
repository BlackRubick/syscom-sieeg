import prisma from '~/server/utils/prisma'
import { getCharge } from '~/server/utils/openpay'
import { conciliarPago } from '~/server/utils/conciliarPago'

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

  await conciliarPago(order, charge)

  return { ok: true }
})
