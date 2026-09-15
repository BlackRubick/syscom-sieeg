import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { createCardCharge, createSpeiCharge, openpayErrorMessage } from '~/server/utils/openpay'
import { approveOrder } from '~/server/utils/approveOrder'
import type { OrderItem } from '~/types'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)

  const body = await readBody<{
    method:           'card' | 'spei'
    token?:           string
    deviceSessionId?: string
    redirectUrl?:     string
    items:            OrderItem[]
    priority?:        string
    notes?:           string
  }>(event)

  if (!body.method || !['card', 'spei'].includes(body.method)) {
    throw createError({ statusCode: 400, message: 'Método de pago inválido' })
  }
  if (body.method === 'card' && (!body.token || !body.deviceSessionId)) {
    throw createError({ statusCode: 400, message: 'Token de pago requerido' })
  }
  if (!body.items?.length) {
    throw createError({ statusCode: 400, message: 'El carrito está vacío' })
  }

  for (const item of body.items) {
    if (!item.productId || !item.name) throw createError({ statusCode: 400, message: 'Ítem inválido' })
    if (!item.quantity || item.quantity <= 0) throw createError({ statusCode: 400, message: `Cantidad inválida para "${item.name}"` })
    if (item.price === undefined || item.price < 0) throw createError({ statusCode: 400, message: `Precio inválido para "${item.name}"` })
  }

  // IP real del cliente — requerida por OpenPay para prevención de fraude
  const clientIp =
    getRequestHeader(event, 'x-forwarded-for')?.split(',')[0].trim() ??
    getRequestHeader(event, 'x-real-ip') ??
    event.node.req.socket?.remoteAddress ??
    '127.0.0.1'

  const user        = await prisma.user.findUniqueOrThrow({ where: { id: session.userId } })
  const serverSubtotal = body.items.reduce((s, i) => s + i.price * i.quantity, 0)
  const total          = Math.round(serverSubtotal * 1.16 * 100) / 100

  const nameParts = user.name.trim().split(' ')
  const firstName = user.fiscalNombre ?? nameParts[0]
  const lastName  = user.fiscalApellidos ?? (nameParts.slice(1).join(' ') || 'N/A')
  const customer  = {
    name:        firstName,
    lastName,
    email:       user.email,
    phoneNumber: user.fiscalTelefono ?? undefined,
  }
  const description = `Pedido SIEEG (${body.items.length} art.)`

  let paymentId:     string
  let paymentStatus: string
  let paymentData:   Record<string, string> | null = null
  let authorization: string | undefined
  let threeDSUrl:    string | undefined

  if (body.method === 'card') {
    try {
      const charge = await createCardCharge({
        sourceId:        body.token!,
        amount:          total,
        description,
        deviceSessionId: body.deviceSessionId!,
        clientIp,
        redirectUrl:     body.redirectUrl,
        customer,
      })
      paymentId  = charge.id
      if (charge.status === 'completed') {
        paymentStatus = 'paid'
        authorization = charge.authorization
      } else if (charge.status === 'charge_pending' && charge.payment_method?.url) {
        paymentStatus = 'pending_3ds'
        threeDSUrl    = charge.payment_method.url
      } else {
        paymentStatus = charge.status
      }
    } catch (e: any) {
      throw createError({ statusCode: 402, message: openpayErrorMessage(e) })
    }
  } else {
    try {
      const charge  = await createSpeiCharge({ amount: total, description, clientIp, customer })
      paymentId     = charge.id
      paymentStatus = 'pending_spei'
      paymentData   = {
        clabe:       charge.payment_method.clabe,
        bank:        charge.payment_method.bank,
        agreement:   charge.payment_method.agreement,
        beneficiary: charge.payment_method.name,
        reference:   charge.payment_method.reference ?? '',
        dueDate:     charge.due_date ?? '',
        createdAt:   charge.creation_date,
      }
    } catch (e: any) {
      throw createError({ statusCode: 402, message: openpayErrorMessage(e) })
    }
  }

  const order = await prisma.order.create({
    data: {
      userId:        session.userId,
      items:         body.items,
      total,
      priority:      body.priority ?? 'normal',
      notes:         body.notes ?? null,
      paymentId,
      paymentStatus,
      paymentMethod: body.method,
      paymentData,
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  })

  // Auto-approve when card payment is immediately confirmed
  if (paymentStatus === 'paid') {
    try {
      await approveOrder(order.id)
    } catch {
      // Payment went through; approval failure is logged in audit log — don't block the response
    }
  }

  const admins = await prisma.user.findMany({
    where:  { role: 'admin', status: 'active' },
    select: { id: true },
  })
  if (admins.length) {
    const titleMap = {
      card: paymentStatus === 'paid' ? 'Nuevo pedido aprobado (tarjeta)' : 'Nuevo pedido (3DS pendiente)',
      spei: 'Nuevo pedido (SPEI pendiente)',
    }
    const msgMap = {
      card: paymentStatus === 'paid'
        ? `${order.user.name} pagó ${total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} con tarjeta — aprobado automáticamente`
        : `${order.user.name} inició pago con 3DS — cargo ${paymentId}`,
      spei: `${order.user.name} generó un pedido por ${total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} vía SPEI — pendiente de recibir transferencia`,
    }
    await prisma.notification.createMany({
      data: admins.map(a => ({
        userId:  a.id,
        type:    'order',
        title:   titleMap[body.method],
        message: msgMap[body.method],
        orderId: order.id,
      })),
    })
  }

  return {
    order: {
      id:            order.id,
      total:         order.total,
      paymentId,
      paymentStatus: order.paymentStatus,
      authorization,
      spei:          paymentData,
    },
    threeDSUrl,
  }
})
