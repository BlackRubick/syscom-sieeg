import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import type { OrderItem } from '~/types'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)

  const body = await readBody<{
    items:     OrderItem[]
    total?:    number   // ignorado — calculamos server-side (#2)
    priority?: string
    notes?:    string
  }>(event)

  if (!body.items?.length) {
    throw createError({ statusCode: 400, message: 'El carrito está vacío' })
  }

  for (const item of body.items) {
    if (!item.productId || !item.name) throw createError({ statusCode: 400, message: 'Ítem inválido en el carrito' })
    if (!item.quantity  || item.quantity  <= 0) throw createError({ statusCode: 400, message: `Cantidad inválida para "${item.name}"` })
    if (item.price === undefined || item.price < 0) throw createError({ statusCode: 400, message: `Precio inválido para "${item.name}"` })
  }

  // #2 — Calcular total en servidor; ignorar lo que manda el cliente
  const serverTotal = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total       = Math.round(serverTotal * 100) / 100

  const order = await prisma.order.create({
    data: {
      userId:   session.userId,
      items:    body.items,
      total,
      priority: body.priority ?? 'normal',
      notes:    body.notes ?? null,
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  })

  // Notificar a todos los admins que hay un nuevo pedido
  const admins = await prisma.user.findMany({
    where:  { role: 'admin', status: 'active' },
    select: { id: true },
  })
  if (admins.length) {
    await prisma.notification.createMany({
      data: admins.map(a => ({
        userId:  a.id,
        type:    'order',
        title:   'Nuevo pedido recibido',
        message: `${order.user.name} realizó un pedido por ${total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} (${body.items.length} art.)`,
        orderId: order.id,
      })),
    })
  }

  return {
    order: {
      id:        order.id,
      userId:    order.userId,
      userName:  order.user.name,
      userEmail: order.user.email,
      status:    order.status,
      items:     order.items,
      total:     order.total,
      priority:  order.priority,
      notes:     order.notes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    },
  }
})
