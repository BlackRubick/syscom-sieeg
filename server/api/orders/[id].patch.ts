import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { approveOrder } from '~/server/utils/approveOrder'
import { ORDER_INCLUDE, serializeOrder } from '~/server/utils/orderDto'

const ALLOWED = ['approved', 'rejected', 'cancelled', 'processing', 'shipped', 'delivered'] as const
type AllowedStatus = typeof ALLOWED[number]

// Cambios de estado permitidos (p. ej. un pedido rechazado o entregado ya no se puede aprobar)
const TRANSICIONES: Record<string, AllowedStatus[]> = {
  pending:    ['approved', 'rejected', 'cancelled'],
  approved:   ['processing', 'shipped', 'delivered', 'cancelled'],
  processing: ['shipped', 'delivered', 'cancelled'],
  shipped:    ['delivered'],
}
const ESTADO_TEXTO: Record<string, string> = {
  pending: 'pendiente', approved: 'aprobado', rejected: 'rechazado', cancelled: 'cancelado', processing: 'en proceso', shipped: 'enviado', delivered: 'entregado',
}

export default defineEventHandler(async (event) => {
  const session   = requireSession(event)
  const isManager = session.role === 'admin' || session.role === 'approver'

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const body = await readBody<{ status: AllowedStatus; motivo?: string }>(event)
  const motivo = typeof body.motivo === 'string' && body.motivo.trim() ? body.motivo.trim().slice(0, 300) : null
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
    // El cliente cancela los suyos; el vendedor, los que levantó él
    if (existing.userId !== session.userId && existing.sellerId !== session.userId) {
      throw createError({ statusCode: 403, message: 'Sin autorización' })
    }
    if (body.status !== 'cancelled') {
      throw createError({ statusCode: 403, message: 'Solo puedes cancelar tus propios pedidos' })
    }
    // Ya aprobado = ya se compró a SYSCOM: solo administración puede cancelarlo (y gestionar la devolución)
    if (existing.status !== 'pending') {
      throw createError({ statusCode: 400, message: 'El pedido ya fue aprobado y comprado; para cancelarlo comunícate con SIEEG.' })
    }
  }

  if (!TRANSICIONES[existing.status]?.includes(body.status)) {
    throw createError({ statusCode: 400, message: `Un pedido ${ESTADO_TEXTO[existing.status] ?? existing.status} no puede pasar a ${ESTADO_TEXTO[body.status]}` })
  }

  let syscomError: string | undefined

  if (body.status === 'approved') {
    const result = await approveOrder(existing.id, session.userId, session.name)
    syscomError = result.syscomError
    const updated = result.order
    return {
      order: serializeOrder(updated, isManager),
      syscomError,
    }
  }

  // Audit log entry for non-approval status changes
  const auditEntry = {
    status:  body.status,
    by:      session.userId,
    byName:  session.name,
    at:      new Date().toISOString(),
    ...(motivo ? { note: `Motivo: ${motivo}` } : {}),
  }
  const newLog = [...((existing.auditLog ?? []) as unknown[]), auditEntry]

  const updated = await prisma.order.update({
    where: { id },
    data:  { status: body.status, auditLog: newLog },
    include: ORDER_INCLUDE,
  })

  if (body.status === 'rejected' || body.status === 'cancelled') {
    const titles: Record<string, string> = {
      rejected:  '❌ Pedido rechazado',
      cancelled: '🚫 Pedido cancelado',
    }
    const monto = updated.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
    const messages: Record<string, string> = {
      rejected:  `Tu pedido por ${monto} IVA incl. fue rechazado.${motivo ? ` Motivo: ${motivo}` : ''}`,
      cancelled: `Tu pedido por ${monto} IVA incl. fue cancelado.${motivo ? ` Motivo: ${motivo}` : ''}${existing.paymentStatus === 'paid' ? ' Te contactaremos para el reembolso.' : ''}`,
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
    order: serializeOrder(updated, isManager),
    syscomError,
  }
})
