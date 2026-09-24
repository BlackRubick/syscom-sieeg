import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { syscomGet } from '~/server/utils/syscom'
import { getPricing, precioVenta } from '~/server/utils/pricing'
import type { SyscomProducto } from '~/types'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { cartItems: true },
  })
  const items = JSON.parse(JSON.stringify((user?.cartItems as any[]) ?? [])) as Array<{ product: { id: string; price: number }; quantity: number }>

  // El carrito guarda una copia del producto: actualizamos el precio vigente (margen, descuento e IVA)
  if (items.length) {
    const pricing = await getPricing(session.userId)
    await Promise.all(items.map(async (it) => {
      if (!/^\d+$/.test(String(it?.product?.id))) return
      try {
        const prod = await syscomGet<SyscomProducto>(`/productos/${it.product.id}`, { moneda: 'MXN' })
        const price = precioVenta(prod, pricing)
        if (price > 0) it.product.price = price
      } catch { /* si SYSCOM falla se queda el precio guardado; el pedido se recalcula en servidor */ }
    }))
  }

  return { items }
})
