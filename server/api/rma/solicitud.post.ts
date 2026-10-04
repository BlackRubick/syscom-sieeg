import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { rateLimit } from '~/server/utils/rateLimit'
import type { OrderItem } from '~/types'

/* El cliente avisa que un producto de su pedido falló: se notifica al personal para que registre la garantía
   cuando reciba el equipo (la garantía como tal la abre el personal). */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  rateLimit(event, 'rma-solicitud', 10, 60 * 60_000)
  const body  = await readBody<{ orderId?: string; productId?: string; falla?: string; serie?: string }>(event)
  const falla = typeof body.falla === 'string' ? body.falla.trim().slice(0, 1000) : ''
  if (falla.length < 5) throw createError({ statusCode: 400, message: 'Describe brevemente la falla' })

  const order = await prisma.order.findUnique({ where: { id: String(body.orderId ?? '') }, include: { user: { select: { name: true } } } })
  if (!order || order.userId !== session.userId) throw createError({ statusCode: 404, message: 'Pedido no encontrado' })
  if (!['approved', 'processing', 'shipped', 'delivered'].includes(order.status)) throw createError({ statusCode: 400, message: 'Ese pedido no se surtió' })
  const item = (order.items as unknown as OrderItem[]).find(i => i.productId === body.productId)
  if (!item) throw createError({ statusCode: 400, message: 'Elige el producto' })
  const serie = typeof body.serie === 'string' ? body.serie.trim().slice(0, 120) : ''

  const personal = await prisma.user.findMany({
    where: { status: 'active', OR: [{ role: 'admin' }, ...(order.sellerId ? [{ id: order.sellerId }] : [])] },
    select: { id: true },
  })
  await prisma.notification.createMany({
    data: personal.map(p => ({
      userId:  p.id,
      type:    'alert',
      title:   'Solicitud de garantía',
      message: `${order.user.name} reporta falla en ${item.sku} (${item.name.slice(0, 60)})${serie ? `, serie ${serie}` : ''}: ${falla.slice(0, 300)}`,
      orderId: order.id,
    })),
  })
  return { ok: true }
})
