import prisma from '~/server/utils/prisma'
import { syscomGet } from '~/server/utils/syscom'

/* Estado de un pedido en SYSCOM.
   SYSCOM no expone el pedido antes de facturarlo: se consulta en GET /facturas?busqueda=<folio>
   (LIKE por prefijo sobre folio / folio_pedido). Mientras no aparezca, el pedido está creado
   pero pendiente de pago o facturación. */

export type SyscomEstado =
  | 'pendiente_pago' | 'autorizado' | 'en_proceso' | 'facturado' | 'en_camino' | 'entregado' | 'cancelado'

export interface SyscomTracking {
  estado:       SyscomEstado
  label:        string
  detalle:      string          // mensaje de SYSCOM del último paso
  factura?:     string          // folio de factura SYSCOM
  fechaFactura?: string
  fletera?:     string
  guia?:        string
  pasos:        Array<{ paso: string; mensaje: string; fecha: string }>
  consultado:   string          // ISO
}

export const ESTADOS_FINALES: SyscomEstado[] = ['entregado', 'cancelado']

const LABELS: Record<SyscomEstado, string> = {
  pendiente_pago: 'Pendiente de pago',
  autorizado:     'Orden autorizada',
  en_proceso:     'En proceso',
  facturado:      'Facturado',
  en_camino:      'En camino',
  entregado:      'Entregado',
  cancelado:      'Cancelado',
}

interface Paso { mensaje?: string; fecha?: string; guias?: string; fletera?: string; estado?: string }
interface FacturaSyscom {
  folio_factura?: string; fecha?: string; folio_pedido?: string; estatus?: string
  entrega?: Record<string, Paso | Paso[] | undefined>
}

const limpiar = (s?: string) => (s ?? '').replace(/\s*-{2,}\s*/g, ' · ').replace(/\s+/g, ' ').replace(/^[\s·-]+|[\s·-]+$/g, '').trim()

function interpretar(f: FacturaSyscom): Omit<SyscomTracking, 'consultado'> {
  const e = f.entrega ?? {}
  const pasos: SyscomTracking['pasos'] = []
  for (const [paso, v] of Object.entries(e)) {
    for (const p of Array.isArray(v) ? v : v ? [v] : []) pasos.push({ paso, mensaje: limpiar(p.mensaje), fecha: limpiar(p.fecha) })
  }

  const entregas = (Array.isArray(e.proceso_entrega) ? e.proceso_entrega : []) as Paso[]
  const ultimaEntrega = entregas[entregas.length - 1]
  const base = { factura: f.folio_factura, fechaFactura: f.fecha, pasos }

  if (e.cancelado || /cancel/i.test(f.estatus ?? '')) {
    return { ...base, estado: 'cancelado', label: LABELS.cancelado, detalle: limpiar((e.cancelado as Paso)?.mensaje) || 'Pedido cancelado en SYSCOM' }
  }
  if (ultimaEntrega) {
    const txt = `${ultimaEntrega.mensaje ?? ''} ${ultimaEntrega.guias ?? ''}`
    const guia = limpiar(ultimaEntrega.guias)
    const conGuia = /^[A-Z0-9-]{6,40}$/i.test(guia) ? guia : undefined // solo números de guía, no textos como "Firmado por…"
    const estado: SyscomEstado = /entregad|recibid|firmad/i.test(txt) && !/esperando/i.test(txt) ? 'entregado' : 'en_camino'
    return { ...base, estado, label: LABELS[estado], detalle: limpiar(ultimaEntrega.mensaje), fletera: limpiar(ultimaEntrega.fletera) || undefined, guia: conGuia }
  }
  if ((e.facturacion as Paso)?.fecha) return { ...base, estado: 'facturado', label: LABELS.facturado, detalle: limpiar((e.facturacion as Paso).mensaje) }
  if (e.espera)       return { ...base, estado: 'en_proceso', label: LABELS.en_proceso, detalle: limpiar((e.espera as Paso).mensaje) }
  if (e.orden_compra) return { ...base, estado: 'autorizado', label: LABELS.autorizado, detalle: limpiar((e.orden_compra as Paso).mensaje) }
  return { ...base, estado: 'en_proceso', label: LABELS.en_proceso, detalle: limpiar((e.creacion as Paso)?.mensaje) }
}

/** Estado recién creado el pedido en SYSCOM (aún no aparece en facturas). */
export function trackingInicial(): SyscomTracking {
  return {
    estado: 'pendiente_pago', label: LABELS.pendiente_pago,
    detalle: 'SYSCOM registró el pedido; se factura y envía al recibir el pago.',
    pasos: [], consultado: new Date().toISOString(),
  }
}

/** Consulta SYSCOM para un folio de pedido (p.ej. "576-5029982/26-API"). */
export async function consultarEstadoSyscom(folio: string): Promise<SyscomTracking> {
  // La búsqueda es por prefijo; el sufijo "-API" no siempre forma parte del folio_pedido
  const base = folio.replace(/-API$/i, '').slice(0, 40)
  const r = await syscomGet<{ facturas?: FacturaSyscom[] }>('/facturas', { busqueda: base })
  const f = (r.facturas ?? []).find(x => (x.folio_pedido ?? '').startsWith(base)) ?? r.facturas?.[0]
  if (!f) return trackingInicial()
  return { ...interpretar(f), consultado: new Date().toISOString() }
}

// Estado local que corresponde a cada estado de SYSCOM (solo se avanza, nunca se retrocede)
const FLUJO = ['pending', 'approved', 'processing', 'shipped', 'delivered'] as const
const LOCAL: Partial<Record<SyscomEstado, typeof FLUJO[number]>> = {
  en_proceso: 'processing', facturado: 'processing', en_camino: 'shipped', entregado: 'delivered',
}

/** Consulta y guarda el estado; avanza el estado local del pedido si corresponde. */
export async function actualizarEstadoSyscom(order: { id: string; syscomFolio: string | null; status: string }) {
  if (!order.syscomFolio) return null
  const tracking = await consultarEstadoSyscom(order.syscomFolio)
  const destino  = LOCAL[tracking.estado]
  const avanzar  = destino && FLUJO.indexOf(destino) > FLUJO.indexOf(order.status as typeof FLUJO[number])
    && FLUJO.includes(order.status as typeof FLUJO[number])
  await prisma.order.update({
    where: { id: order.id },
    data:  {
      syscomTracking: tracking as object,
      syscomStatusAt: new Date(),
      ...(avanzar ? { status: destino } : {}),
    },
  })
  return { tracking, statusUpdated: avanzar ? destino : null }
}
