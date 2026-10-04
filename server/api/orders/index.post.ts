import { requireSession } from '~/server/utils/session'
import { crearPedido } from '~/server/utils/crearPedido'
import { resolverCliente } from '~/server/utils/roles'
import { reservarCotizacion, liberarCotizacion, ligarCotizacion, limpiarFolio } from '~/server/utils/cotizacion'
import type { OrderItem } from '~/types'

/* Pedido sin pago en línea (queda pendiente para aprobación manual).
   Un vendedor o admin puede levantarlo a nombre de un cliente con `clientId`. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role === 'viewer') throw createError({ statusCode: 403, message: 'Tu cuenta es de solo consulta y no puede realizar pedidos' })

  const body = await readBody<{
    items:     OrderItem[]
    total?:    number   // ignorado — calculamos server-side (#2)
    priority?: string
    notes?:    string
    purchaseOrder?: string
    clientId?: string
    quoteId?:  string
  }>(event)

  if (!Array.isArray(body.items) || !body.items.length) {
    throw createError({ statusCode: 400, message: 'El carrito está vacío' })
  }
  // Cada producto se valida contra SYSCOM: se limita para que un pedido no dispare cientos de consultas
  if (body.items.length > 100) throw createError({ statusCode: 400, message: 'Máximo 100 productos por pedido' })
  for (const item of body.items) {
    if (!item.productId || !item.name) throw createError({ statusCode: 400, message: 'Ítem inválido en el carrito' })
    const q = Number(item.quantity)
    if (!Number.isInteger(q) || q < 1 || q > 9999) throw createError({ statusCode: 400, message: `Cantidad inválida para "${item.name}"` })
  }

  const { clientId, sellerId } = await resolverCliente(session, body.clientId)
  // Si el carrito viene de una cotización, el pedido queda ligado a ella y a su vendedor
  const cot = await reservarCotizacion(body.quoteId, clientId)
  let order
  try {
    order = await crearPedido({
      clientId, sellerId: sellerId ?? cot?.sellerId ?? null, items: body.items, priority: body.priority, notes: body.notes,
      purchaseOrder: limpiarFolio(body.purchaseOrder),
      quoteNumber: cot?.number ?? null,
    })
  } catch (e) {
    if (cot) await liberarCotizacion(cot.id)
    throw e
  }
  if (cot) await ligarCotizacion(cot, order.id, order.user.name)

  return {
    order: {
      id:          order.id,
      userId:      order.userId,
      userName:    order.user.name,
      userEmail:   order.user.email,
      status:      order.status,
      items:       order.items,
      total:       order.total,
      shippingFee: order.shippingFee,
      priority:    order.priority,
      notes:       order.notes,
      purchaseOrder: order.purchaseOrder,
      createdAt:   order.createdAt.toISOString(),
      updatedAt:   order.updatedAt.toISOString(),
    },
  }
})
