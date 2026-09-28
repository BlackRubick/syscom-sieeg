import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { resolverCliente, vendeAClientes } from '~/server/utils/roles'
import { crearRma, serializeRma, texto } from '~/server/utils/rma'
import { esMostrador } from '~/server/utils/mostrador'
import { formatRmaNumber } from '~/utils/rma'
import type { OrderItem } from '~/types'

/* Registra una garantía (RMA) cuando el cliente entrega el producto. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (!vendeAClientes(session.role)) throw createError({ statusCode: 403, message: 'Solo vendedores y administración registran garantías' })

  const body = await readBody<{
    clientId?: string; orderId?: string; productId?: string; sku?: string; productName?: string
    serie?: string; quantity?: number; falla?: string; accesorios?: string; folioProveedor?: string
  }>(event)

  if (!body.clientId) throw createError({ statusCode: 400, message: 'Elige el cliente' })
  const { clientId } = await resolverCliente(session, body.clientId)

  const falla = texto(body.falla, 2000)
  if (!falla) throw createError({ statusCode: 400, message: 'Describe la falla del producto' })
  const quantity = Math.floor(Number(body.quantity) || 1)
  if (!(quantity >= 1 && quantity <= 999)) throw createError({ statusCode: 400, message: 'Cantidad inválida' })

  // Producto: del pedido del cliente o capturado a mano
  let sku = texto(body.sku, 80)
  let productName = texto(body.productName, 300)
  let productId = texto(body.productId, 40)
  let orderId: string | null = null
  if (body.orderId) {
    const order = await prisma.order.findUnique({ where: { id: body.orderId }, select: { id: true, userId: true, items: true } })
    if (!order || order.userId !== clientId) throw createError({ statusCode: 400, message: 'El pedido no es de este cliente' })
    orderId = order.id
    const item = (order.items as unknown as OrderItem[]).find(i => i.productId === body.productId)
    if (item) { sku = item.sku; productName = item.name; productId = item.productId }
  }
  if (!sku || !productName) throw createError({ statusCode: 400, message: 'Indica el modelo y la descripción del producto' })

  const ahora = new Date().toISOString()
  const rma = await crearRma({
    userId: clientId, sellerId: session.userId, orderId, productId, sku, productName, quantity, falla,
    serie:          texto(body.serie, 120),
    accesorios:     texto(body.accesorios, 300),
    folioProveedor: texto(body.folioProveedor, 60),
    historial:      [{ status: 'recibido', nota: 'Producto recibido para garantía', byName: session.name, at: ahora }],
  })

  if (clientId !== session.userId && !esMostrador(rma.user.email)) {
    await prisma.notification.create({
      data: {
        userId:  clientId,
        type:    'system',
        title:   `Garantía ${formatRmaNumber(rma.number)} registrada`,
        message: `Recibimos tu ${rma.productName.slice(0, 80)} para revisión de garantía. Te avisaremos cada avance.`,
      },
    })
  }
  return { rma: serializeRma(rma) }
})
