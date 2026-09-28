import type { Prisma } from '@prisma/client'
import prisma from '~/server/utils/prisma'
import { esMostrador } from '~/server/utils/mostrador'
import { formatRmaNumber } from '~/utils/rma'

export const RMA_INCLUDE = {
  user:   { select: { id: true, name: true, email: true, clientNumber: true, fiscalRazonSocial: true, fiscalRfc: true, fiscalTelefono: true } },
  seller: { select: { id: true, name: true, email: true } },
} satisfies Prisma.RmaInclude

type RmaRow = Prisma.RmaGetPayload<{ include: typeof RMA_INCLUDE }>

export interface RmaEvento { status: string; nota?: string; byName: string; at: string }

export function serializeRma(r: RmaRow) {
  return {
    id:             r.id,
    number:         r.number,
    folio:          formatRmaNumber(r.number),
    status:         r.status,
    orderId:        r.orderId,
    productId:      r.productId,
    sku:            r.sku,
    productName:    r.productName,
    serie:          r.serie,
    quantity:       r.quantity,
    falla:          r.falla,
    accesorios:     r.accesorios,
    folioProveedor: r.folioProveedor,
    resolucion:     r.resolucion,
    historial:      (r.historial ?? []) as unknown as RmaEvento[],
    createdAt:      r.createdAt.toISOString(),
    updatedAt:      r.updatedAt.toISOString(),
    cliente: {
      id:           r.user.id,
      name:         r.user.name,
      email:        r.user.email,
      clientNumber: r.user.clientNumber,
      razonSocial:  r.user.fiscalRazonSocial,
      rfc:          r.user.fiscalRfc,
      telefono:     r.user.fiscalTelefono,
      mostrador:    esMostrador(r.user.email),
    },
    atiende: r.seller ? { id: r.seller.id, name: r.seller.name, email: r.seller.email } : null,
  }
}

/** Guarda la garantía con el siguiente folio (reintenta si dos se guardan al mismo tiempo). */
export async function crearRma(data: Omit<Prisma.RmaUncheckedCreateInput, 'number'>) {
  for (let intento = 0; intento < 5; intento++) {
    const { _max } = await prisma.rma.aggregate({ _max: { number: true } })
    try {
      return await prisma.rma.create({ data: { ...data, number: (_max.number ?? 0) + 1 }, include: RMA_INCLUDE })
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') continue
      throw e
    }
  }
  throw createError({ statusCode: 500, message: 'No se pudo asignar folio a la garantía, intenta de nuevo' })
}

/** Personal que registra y da seguimiento a garantías. */
export const atiendeGarantias = (role: string) => ['admin', 'seller', 'approver'].includes(role)

export const texto = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null)
