import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { QUOTE_INCLUDE, serializeQuote, preciosDelDia } from '~/server/utils/cotizacion'
import { vendeAClientes } from '~/server/utils/roles'
import { sendQuoteEmail } from '~/server/utils/email'
import { rateLimit } from '~/server/utils/rateLimit'
import type { OrderItem } from '~/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Vendedor/admin manda la cotización por correo al destinatario que elija (por omisión, el correo del cliente). */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (!vendeAClientes(session.role)) throw createError({ statusCode: 403, message: 'Solo vendedores y administradores pueden enviar cotizaciones' })
  const id   = getRouterParam(event, 'id')!
  const body = await readBody<{ to?: string }>(event)
  const to   = typeof body.to === 'string' ? body.to.trim().toLowerCase() : ''
  if (!EMAIL_RE.test(to) || to.length > 160) throw createError({ statusCode: 400, message: 'Escribe un correo válido' })
  rateLimit(event, 'quote-email', 30, 60 * 60_000)

  const q = await prisma.quote.findUnique({ where: { id }, include: QUOTE_INCLUDE })
  if (!q) throw createError({ statusCode: 404, message: 'Cotización no encontrada' })
  const quote = serializeQuote(q)

  // Abierta: precios del día (sin los que ya no tienen precio). Cerrada: lo que se guardó.
  const precios = q.status === 'open' ? await preciosDelDia(q.userId, q.items as unknown as OrderItem[]) : null
  const items   = precios ? precios.items.filter(i => i.disponible) : quote.items
  const total   = precios?.total ?? quote.total
  const envio   = precios?.envio ?? Math.max(0, total - items.reduce((s, i) => s + i.price * i.quantity, 0))

  const sender = await prisma.user.findUnique({ where: { id: session.userId }, select: { name: true, email: true } })
  await sendQuoteEmail({
    to,
    replyTo:  q.seller?.email ?? sender?.email,
    folio:    quote.folio,
    proyecto: quote.name,
    cliente:  quote.cliente.mostrador ? 'cliente' : quote.cliente.name.split(' ')[0],
    vendedor: q.seller?.name ?? sender?.name ?? null,
    items, envio, total,
    link: `${getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin}/quotes/${id}`,
  }).catch((e: unknown) => {
    if ((e as { statusCode?: number }).statusCode) throw e
    throw createError({ statusCode: 502, message: 'No se pudo enviar el correo. Revisa la dirección e intenta de nuevo.' })
  })
  return { ok: true, to }
})
