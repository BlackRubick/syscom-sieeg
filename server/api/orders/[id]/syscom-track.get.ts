import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { getSyscomToken } from '~/server/utils/syscom'
import type { SyscomFactura } from '~/types'

function isDelivered(estatus?: string): boolean {
  const s = (estatus ?? '').toLowerCase()
  return s.includes('entrega') || s.includes('recib')
}

export default defineEventHandler(async (event) => {
  const session = requireSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) throw createError({ statusCode: 404, message: 'Orden no encontrada' })

  // Solo el dueño del pedido o un admin/approver puede consultarlo
  if (order.userId !== session.userId && session.role !== 'admin' && session.role !== 'approver') {
    throw createError({ statusCode: 403, message: 'Sin autorización' })
  }

  if (!order.syscomFolio) {
    throw createError({ statusCode: 400, message: 'Este pedido no tiene folio SYSCOM' })
  }

  const token = await getSyscomToken()
  const res = await fetch(
    `https://developers.syscom.mx/api/v1/pedidos/${encodeURIComponent(order.syscomFolio)}`,
    { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } },
  )

  if (!res.ok) {
    const msg = res.status === 404
      ? 'Folio no encontrado en SYSCOM'
      : `SYSCOM respondió con error ${res.status}`
    throw createError({ statusCode: res.status === 404 ? 404 : 502, message: msg })
  }

  const tracking = await res.json() as SyscomFactura

  // Si SYSCOM dice entregado y el pedido local no lo está, actualizar
  let statusUpdated = false
  if (isDelivered(tracking.estatus ?? tracking.estado) && order.status !== 'delivered') {
    await prisma.order.update({
      where: { id },
      data:  { status: 'delivered' },
    })
    statusUpdated = true
  }

  return { tracking, statusUpdated }
})
