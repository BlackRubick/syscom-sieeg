import prisma from '~/server/utils/prisma'
import { getPricing, precioVenta } from '~/server/utils/pricing'
import { syscomGet } from '~/server/utils/syscom'
import { totalDe, envioDe } from '~/utils/orderTotals'
import { getShippingConfig } from '~/server/utils/shipping'
import { formatQuoteNumber } from '~/utils/quoteNumber'
import type { OrderItem, SyscomProducto } from '~/types'
import type { Prisma } from '@prisma/client'

export interface ItemCotizado extends OrderItem { disponible: boolean; existencia: number }

/** Limpia lo que manda el navegador: solo productos SYSCOM válidos y cantidades enteras. */
export function normalizarItems(items: unknown): OrderItem[] {
  if (!Array.isArray(items) || !items.length) throw createError({ statusCode: 400, message: 'La cotización no tiene productos' })
  if (items.length > 100) throw createError({ statusCode: 400, message: 'Máximo 100 productos por cotización' })
  return items.map((raw) => {
    const i = raw as Partial<OrderItem>
    const quantity = Math.floor(Number(i.quantity))
    if (!/^\d+$/.test(String(i.productId ?? '')) || !i.name) throw createError({ statusCode: 400, message: 'Producto inválido en la cotización' })
    if (!(quantity >= 1 && quantity <= 9999)) throw createError({ statusCode: 400, message: `Cantidad inválida para "${i.name}"` })
    return {
      productId: String(i.productId),
      name:      String(i.name).slice(0, 300),
      sku:       String(i.sku ?? '').slice(0, 80),
      price:     0,
      quantity,
      images:    Array.isArray(i.images) ? i.images.slice(0, 1).map(String) : [],
      ...(i.satKey ? { satKey: String(i.satKey) } : {}),
    }
  })
}

/** Precio del día para el cliente. Un producto descontinuado o sin precio se marca no disponible (no truena). */
export async function preciosDelDia(clientId: string, items: OrderItem[]) {
  const pricing = await getPricing(clientId)
  const cotizados: ItemCotizado[] = await Promise.all(items.map(async (item) => {
    try {
      const prod  = await syscomGet<SyscomProducto>(`/productos/${item.productId}`, { moneda: 'MXN' })
      const price = precioVenta(prod, pricing)
      return { ...item, price, disponible: price > 0, existencia: Number(prod.total_existencia) || 0 }
    } catch {
      return { ...item, price: 0, disponible: false, existencia: 0 }
    }
  }))
  const validos  = cotizados.filter(i => i.disponible)
  const subtotal = totalDe(validos)
  const envio    = envioDe(subtotal, await getShippingConfig())
  return {
    items: cotizados,
    subtotal,
    envio,
    total: Math.round((subtotal + envio) * 100) / 100,
    noDisponibles: cotizados.length - validos.length,
  }
}

/** Guarda la cotización con el siguiente folio (reintenta si dos se guardan al mismo tiempo). */
export async function crearCotizacion(data: { userId: string; sellerId: string | null; items: OrderItem[]; total: number; notes: string | null }) {
  for (let intento = 0; intento < 5; intento++) {
    const { _max } = await prisma.quote.aggregate({ _max: { number: true } })
    try {
      return await prisma.quote.create({ data: { ...data, number: (_max.number ?? 0) + 1 } })
    } catch (e) {
      const err = e as { code?: string }
      if (err.code === 'P2002') continue
      throw e
    }
  }
  throw createError({ statusCode: 500, message: 'No se pudo asignar folio a la cotización, intenta de nuevo' })
}

/** Quién puede ver una cotización: el cliente, vendedores y administración. */
export function puedeVerCotizacion(session: { userId: string; role: string }, q: { userId: string }) {
  return ['admin', 'approver', 'seller'].includes(session.role) || q.userId === session.userId
}

export const QUOTE_INCLUDE = {
  user:   { select: { id: true, name: true, email: true, clientNumber: true, fiscalRazonSocial: true, fiscalRfc: true, fiscalTelefono: true, discountPct: true } },
  seller: { select: { id: true, name: true, email: true } },
} satisfies Prisma.QuoteInclude

type QuoteRow = Prisma.QuoteGetPayload<{ include: typeof QUOTE_INCLUDE }>

export function serializeQuote(q: QuoteRow) {
  return {
    id:        q.id,
    number:    q.number,
    folio:     formatQuoteNumber(q.number),
    status:    q.status,
    items:     q.items as unknown as OrderItem[],
    total:     q.total,
    notes:     q.notes,
    orderId:   q.orderId,
    createdAt: q.createdAt.toISOString(),
    updatedAt: q.updatedAt.toISOString(),
    cliente: {
      id:           q.user.id,
      name:         q.user.name,
      email:        q.user.email,
      clientNumber: q.user.clientNumber,
      razonSocial:  q.user.fiscalRazonSocial,
      rfc:          q.user.fiscalRfc,
      telefono:     q.user.fiscalTelefono,
    },
    vendedor: q.seller ? { id: q.seller.id, name: q.seller.name, email: q.seller.email } : null,
  }
}
