import prisma from '~/server/utils/prisma'
import { conciliarPago } from '~/server/utils/conciliarPago'

// Respaldo del webhook: OpenPay a veces no avisa cuando cae un SPEI. Cada 5 min se consultan los pendientes.
const CADA_MS = 5 * 60_000

export default defineNitroPlugin(() => {
  if (import.meta.dev || import.meta.prerender) return
  let corriendo = false
  const revisar = async () => {
    if (corriendo) return
    corriendo = true
    try {
      const desde = new Date(Date.now() - 35 * 24 * 60 * 60_000)   // la referencia SPEI vence a los 30 días
      const pendientes = await prisma.order.findMany({
        where: { paymentMethod: 'spei', paymentStatus: 'pending_spei', paymentId: { not: null }, createdAt: { gte: desde } },
      })
      for (const order of pendientes) {
        await conciliarPago(order).catch(e => console.error(`[spei] ${order.id}:`, e?.message ?? e))
      }
    } finally { corriendo = false }
  }
  setTimeout(revisar, 30_000)
  setInterval(revisar, CADA_MS)
})
