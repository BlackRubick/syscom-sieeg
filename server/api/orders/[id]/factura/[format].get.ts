import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { getFacturaHost, getFacturaHeaders } from '~/server/utils/factura'

/* El cliente descarga la factura (PDF o XML) de su propio pedido; administración, la de cualquiera. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const format  = getRouterParam(event, 'format')
  if (format !== 'pdf' && format !== 'xml') throw createError({ statusCode: 400, message: 'Formato inválido' })

  const order = await prisma.order.findUnique({ where: { id: getRouterParam(event, 'id')! }, select: { id: true, userId: true, cfdiUid: true } })
  const puede = !!order && (order.userId === session.userId || ['admin', 'approver'].includes(session.role))
  if (!puede) throw createError({ statusCode: 404, message: 'Pedido no encontrado' })
  if (!order!.cfdiUid) throw createError({ statusCode: 404, message: 'Este pedido todavía no tiene factura' })

  const res = await fetch(`${getFacturaHost()}/v4/cfdi40/${encodeURIComponent(order!.cfdiUid)}/${format}`, { headers: getFacturaHeaders() })
  if (!res.ok || !res.body) throw createError({ statusCode: 502, message: 'No se pudo obtener la factura. Intenta más tarde.' })

  setResponseHeader(event, 'Content-Type', format === 'pdf' ? 'application/pdf' : 'application/xml')
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="factura-PED-${order!.id.slice(-8).toUpperCase()}.${format}"`)
  return sendStream(event, res.body)
})
