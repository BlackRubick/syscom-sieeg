import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { syscomGet } from '~/server/utils/syscom'
import { getPricing, precioVenta } from '~/server/utils/pricing'
import { formatGarantia } from '~/utils/garantia'
import type { SyscomProducto } from '~/types'
import { formatQuoteNumber } from '~/utils/quoteNumber'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { cartItems: true, cartQuoteId: true },
  })
  const items = JSON.parse(JSON.stringify((user?.cartItems as any[]) ?? [])) as Array<{ product: { id: string; price: number; garantia?: string }; quantity: number }>

  // El carrito guarda una copia del producto: actualizamos el precio vigente (margen, descuento e IVA)
  if (items.length) {
    const pricing = await getPricing(session.userId)
    await Promise.all(items.map(async (it) => {
      if (!/^\d+$/.test(String(it?.product?.id))) return
      try {
        const prod = await syscomGet<SyscomProducto>(`/productos/${it.product.id}`, { moneda: 'MXN' })
        const price = precioVenta(prod, pricing)
        if (price > 0) it.product.price = price
        const garantia = formatGarantia(prod.garantia)
        if (garantia) it.product.garantia = garantia
      } catch { /* si SYSCOM falla se queda el precio guardado; el pedido se recalcula en servidor */ }
    }))
  }

  // Cotización que está comprando (si sigue abierta)
  let quote = null
  if (user?.cartQuoteId) {
    const q = await prisma.quote.findUnique({ where: { id: user.cartQuoteId }, include: { seller: { select: { name: true } } } })
    if (q && q.userId === session.userId && q.status === 'open') {
      quote = { id: q.id, folio: formatQuoteNumber(q.number, q.createdAt), name: q.name, vendedor: q.seller?.name ?? null }
    } else {
      await prisma.user.update({ where: { id: session.userId }, data: { cartQuoteId: null } })
    }
  }

  return { items, quote }
})
