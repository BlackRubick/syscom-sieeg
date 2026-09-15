import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { approveOrder } from '~/server/utils/approveOrder'

const ALLOWED = ['approved', 'rejected', 'cancelled', 'processing', 'shipped', 'delivered'] as const
type AllowedStatus = typeof ALLOWED[number]

export default defineEventHandler(async (event) => {
  const session   = requireSession(event)
  const isManager = session.role === 'admin' || session.role === 'approver'

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const body = await readBody<{ status: AllowedStatus }>(event)
  if (!ALLOWED.includes(body.status)) {
    throw createError({ statusCode: 400, message: 'Estado inválido' })
  }

  const existing = await prisma.order.findUnique({
    where:   { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  })
  if (!existing) throw createError({ statusCode: 404, message: 'Orden no encontrada' })

  // Compradores solo pueden cancelar sus propios pedidos en estado pendiente/aprobado
  if (!isManager) {
    if (existing.userId !== session.userId) {
      throw createError({ statusCode: 403, message: 'Sin autorización' })
    }
    if (body.status !== 'cancelled') {
      throw createError({ statusCode: 403, message: 'Solo puedes cancelar tus propios pedidos' })
    }
    if (!['pending', 'approved'].includes(existing.status)) {
      throw createError({ statusCode: 400, message: `No se puede cancelar un pedido en estado "${existing.status}"` })
    }
  }

  let syscomError: string | undefined

  if (body.status === 'approved') {
    const result = await approveOrder(existing.id, session.userId, session.name)
    syscomError = result.syscomError
    const updated = result.order
    return {
      order: {
        id:            updated.id,
        userId:        updated.userId,
        userName:      updated.user.name,
        userEmail:     updated.user.email,
        status:        updated.status,
        items:         updated.items,
        total:         updated.total,
        priority:      updated.priority,
        notes:         updated.notes,
        syscomFolio:   updated.syscomFolio,
        cfdiUid:       updated.cfdiUid,
        auditLog:      updated.auditLog,
        paymentId:     updated.paymentId,
        paymentStatus: updated.paymentStatus,
        paymentMethod: updated.paymentMethod,
        paymentData:   updated.paymentData,
        createdAt:     updated.createdAt.toISOString(),
        updatedAt:     updated.updatedAt.toISOString(),
      },
      syscomError,
    }
  }

  // Audit log entry for non-approval status changes
  const auditEntry = {
    status:  body.status,
    by:      session.userId,
    byName:  session.name,
    at:      new Date().toISOString(),
  }
  const newLog = [...((existing.auditLog ?? []) as unknown[]), auditEntry]

  const updated = await prisma.order.update({
    where: { id },
    data:  { status: body.status, auditLog: newLog },
    include: { user: { select: { id: true, name: true, email: true } } },
  })

  if (body.status === 'rejected' || body.status === 'cancelled') {
    const titles: Record<string, string> = {
      rejected:  '❌ Pedido rechazado',
      cancelled: '🚫 Pedido cancelado',
    }
    const messages: Record<string, string> = {
      rejected:  `Tu pedido por ${updated.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} fue rechazado.`,
      cancelled: `Tu pedido por ${updated.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} fue cancelado.`,
    }
    await prisma.notification.create({
      data: {
        userId:  existing.userId,
        type:    'order',
        title:   titles[body.status],
        message: messages[body.status],
        orderId: id,
      },
    })
  }

  return {
    order: {
      id:            updated.id,
      userId:        updated.userId,
      userName:      updated.user.name,
      userEmail:     updated.user.email,
      status:        updated.status,
      items:         updated.items,
      total:         updated.total,
      priority:      updated.priority,
      notes:         updated.notes,
      syscomFolio:   updated.syscomFolio,
      cfdiUid:       updated.cfdiUid,
      auditLog:      updated.auditLog,
      paymentId:     updated.paymentId,
      paymentStatus: updated.paymentStatus,
      paymentMethod: updated.paymentMethod,
      paymentData:   updated.paymentData,
      createdAt:     updated.createdAt.toISOString(),
      updatedAt:     updated.updatedAt.toISOString(),
    },
    syscomError,
  }
})
