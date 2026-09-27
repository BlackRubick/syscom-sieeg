import { requireSession } from '~/server/utils/session'
import { getShippingConfig } from '~/server/utils/shipping'

/* Mínimo de compra para envío sin costo y cargo de envío (lo muestra el carrito). */
export default defineEventHandler(async (event) => {
  requireSession(event)
  return getShippingConfig()
})
