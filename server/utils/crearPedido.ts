import prisma from '~/server/utils/prisma'
import { repriceItems } from '~/server/utils/pricing'
import { totalDe, envioDe } from '~/utils/orderTotals'
import { getShippingConfig } from '~/server/utils/shipping'
import { formatClientNumber } from '~/utils/clientNumber'
import { formatQuoteNumber } from '~/utils/quoteNumber'
import type { OrderItem } from '~/types'

/* Crea un pedido pendiente (sin pago en línea): precios del día para el cliente, envío y avisos.
   Lo usan el carrito, los vendedores y la aceptación de cotizaciones. */
export async function crearPedido(opts: {
  clientId:     string
  sellerId?:    string | null
  items:        OrderItem[]
  priority?:    string
  notes?:       string | null
  quoteNumber?: number | null
}) {
  if (!opts.items?.length) throw createError({ statusCode: 400, message: 'El pedido no tiene productos' })

  // Precios y total calculados en servidor con el descuento del CLIENTE (no del vendedor)
  const items       = await repriceItems(opts.clientId, opts.items)
  const shippingFee = envioDe(totalDe(items), await getShippingConfig())
  const total       = Math.round((totalDe(items) + shippingFee) * 100) / 100

  const order = await prisma.order.create({
    data: {
      userId:      opts.clientId,
      sellerId:    opts.sellerId ?? null,
      quoteNumber: opts.quoteNumber ?? null,
      items,
      total,
      shippingFee,
      priority:    opts.priority ?? 'normal',
      notes:       opts.notes ?? null,
    },
    include: {
      user:   { select: { id: true, name: true, email: true, clientNumber: true } },
      seller: { select: { name: true } },
    },
  })

  const monto   = total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
  const cliente = `${order.user.name}${order.user.clientNumber ? ` (${formatClientNumber(order.user.clientNumber)})` : ''}`
  const origen  = [
    order.seller ? `levantado por ${order.seller.name}` : '',
    opts.quoteNumber ? `desde ${formatQuoteNumber(opts.quoteNumber)}` : '',
  ].filter(Boolean).join(', ')

  // Avisar a los admins; si lo hizo un vendedor, también al cliente
  const admins = await prisma.user.findMany({ where: { role: 'admin', status: 'active' }, select: { id: true } })
  const avisos = admins
    .filter(a => a.id !== opts.sellerId)
    .map(a => ({
      userId:  a.id,
      type:    'order',
      title:   'Nuevo pedido recibido',
      message: `${cliente} — ${monto} IVA incl. (${items.length} art.)${origen ? ` · ${origen}` : ''}`,
      orderId: order.id,
    }))
  if (opts.sellerId) {
    avisos.push({
      userId:  opts.clientId,
      type:    'order',
      title:   'Se registró un pedido a tu nombre',
      message: `${order.seller?.name ?? 'Tu vendedor'} levantó un pedido por ${monto} IVA incl.`,
      orderId: order.id,
    })
  }
  if (avisos.length) await prisma.notification.createMany({ data: avisos })

  return order
}
