import type { Prisma } from '@prisma/client'
import { esMostrador } from '~/server/utils/mostrador'

/* Forma única en que la API devuelve un pedido (lista, aprobación, reintento…). */

export const ORDER_INCLUDE = {
  user: {
    select: {
      id: true, name: true, email: true, clientNumber: true,
      fiscalRfc: true, fiscalRazonSocial: true, fiscalRegimen: true, fiscalUsocfdi: true,
      fiscalCalle: true, fiscalNumExt: true, fiscalNumInt: true, fiscalColonia: true,
      fiscalCiudad: true, fiscalEstado: true, fiscalCodpos: true, fiscalTelefono: true,
    },
  },
  seller: { select: { id: true, name: true } },
} satisfies Prisma.OrderInclude

type OrderWithUser = Prisma.OrderGetPayload<{ include: typeof ORDER_INCLUDE }>

const num = (v: unknown) => (v == null || v === '' ? null : Number(v))

const REGIMENES: Record<string, string> = {
  '601': 'General de Ley Personas Morales', '603': 'Personas Morales con Fines no Lucrativos',
  '605': 'Sueldos y Salarios', '606': 'Arrendamiento', '608': 'Demás ingresos',
  '612': 'Personas Físicas con Actividades Empresariales y Profesionales', '616': 'Sin obligaciones fiscales',
  '621': 'Incorporación Fiscal', '625': 'Plataformas Tecnológicas', '626': 'Régimen Simplificado de Confianza',
}

// "S/N", "SN" o vacío no aportan nada; tampoco repetir el número si ya viene en la calle
const SIN_NUM = /^(s\/?n|n\/?a|0)?$/i
function calleCompleta(calle?: string | null, ext?: string | null, int?: string | null): string {
  const c = (calle ?? '').trim()
  const e = (ext ?? '').trim()
  const i = (int ?? '').trim()
  const parts = [c]
  if (!SIN_NUM.test(e) && !c.toUpperCase().endsWith(e.toUpperCase())) parts.push(`#${e}`)
  else if (SIN_NUM.test(e) && e && !/S\/?N$/i.test(c)) parts.push('S/N')
  if (!SIN_NUM.test(i)) parts.push(`Int. ${i}`)
  return parts.filter(Boolean).join(' ')
}

export function serializeOrder(o: OrderWithUser, isManager: boolean) {
  const u  = o.user
  const sd = (o.syscomData ?? null) as Record<string, unknown> | null
  const de = sd?.datos_entrega as Record<string, string> | undefined

  // Dirección confirmada por SYSCOM si ya se envió; si no, la fiscal del cliente
  const entrega = de
    ? {
        fuente:     'syscom' as const,
        atencionA:  de.atencion_a ?? '',
        linea1:     calleCompleta(de.calle, de.num_exterior, de.num_interior),
        linea2:     [de.colonia, de.ciudad, de.estado].filter(Boolean).join(', '),
        cp:         '',
        telefono:   u.fiscalTelefono ?? '',
      }
    : u.fiscalCalle || u.fiscalCodpos
      ? {
          fuente:     'fiscal' as const,
          atencionA:  u.fiscalRazonSocial ?? u.name,
          linea1:     calleCompleta(u.fiscalCalle, u.fiscalNumExt, u.fiscalNumInt),
          linea2:     [u.fiscalColonia, u.fiscalCiudad, u.fiscalEstado].filter(Boolean).join(', '),
          cp:         u.fiscalCodpos ?? '',
          telefono:   u.fiscalTelefono ?? '',
        }
      : null

  // Costo real que cobró SYSCOM (solo para admin/approver: es información de margen)
  const tot = sd?.totales as Record<string, unknown> | undefined
  const syscom = isManager && tot
    ? {
        subtotal: num(tot.subtotal),
        flete:    num(tot.flete),
        iva:      num(tot.iva),
        total:    num(tot.total),
        almacenes: ((sd?.productos ?? []) as Array<{ id?: number; almacenes?: Record<string, number> }>)
          .map(p => ({ productId: String(p.id ?? ''), almacenes: p.almacenes ?? {} })),
      }
    : null

  // Estado en SYSCOM: el cliente solo ve el estado del envío; admin/approver ven folio de factura y pasos
  const tr = (o.syscomTracking ?? null) as Record<string, unknown> | null
  const syscomEstado = tr
    ? {
        estado:     String(tr.estado ?? ''),
        label:      String(tr.label ?? ''),
        detalle:    String(tr.detalle ?? ''),
        fletera:    (tr.fletera as string | undefined) ?? null,
        guia:       (tr.guia as string | undefined) ?? null,
        consultado: (tr.consultado as string | undefined) ?? o.syscomStatusAt?.toISOString() ?? null,
        ...(isManager ? { factura: (tr.factura as string | undefined) ?? null, pasos: (tr.pasos as unknown[]) ?? [] } : {}),
      }
    : null

  return {
    id:            o.id,
    userId:        o.userId,
    userName:      u.name,
    userEmail:     u.email,
    clientNumber:  u.clientNumber,
    mostrador:     esMostrador(u.email),
    vendedor:      o.seller ? { id: o.seller.id, name: o.seller.name } : null,
    quoteNumber:   o.quoteNumber,
    status:        o.status,
    items:         o.items,
    total:         o.total,
    shippingFee:   o.shippingFee,
    priority:      o.priority,
    notes:         o.notes,
    purchaseOrder: o.purchaseOrder,
    syscomFolio:   o.syscomFolio,
    syscomEstado,
    cfdiUid:       o.cfdiUid,
    auditLog:      o.auditLog,
    paymentId:     o.paymentId,
    paymentStatus: o.paymentStatus,
    paymentMethod: o.paymentMethod,
    paymentData:   o.paymentData,
    cliente: {
      rfc:         u.fiscalRfc,
      razonSocial: u.fiscalRazonSocial,
      regimen:     u.fiscalRegimen ? (REGIMENES[u.fiscalRegimen] ? `${u.fiscalRegimen} — ${REGIMENES[u.fiscalRegimen]}` : u.fiscalRegimen) : null,
      usoCfdi:     u.fiscalUsocfdi,
    },
    entrega,
    syscom,
    createdAt:     o.createdAt.toISOString(),
    updatedAt:     o.updatedAt.toISOString(),
  }
}
