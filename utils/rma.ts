/* Garantías (RMA): folio consecutivo que se muestra como RMA-0001 y estados del proceso. */

export function formatRmaNumber(n?: number | null): string {
  return n ? `RMA-${String(n).padStart(4, '0')}` : ''
}

/** Acepta "RMA-0012", "rma12" o "12" y devuelve 12; si no parece folio, null. */
export function parseRmaNumber(q: string): number | null {
  const m = q.trim().match(/^(?:rma[\s-]*)?0*(\d{1,7})$/i)
  return m ? Number(m[1]) : null
}

export const RMA_ESTADOS = {
  recibido:          { label: 'Recibido',              color: '#0B5BD3', bg: 'rgba(21,112,239,0.1)' },
  en_revision:       { label: 'En revisión',           color: '#B45309', bg: 'rgba(245,158,11,0.12)' },
  enviado_proveedor: { label: 'Enviado al proveedor',  color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
  reparado:          { label: 'Reparado',              color: '#15803D', bg: 'rgba(34,197,94,0.12)' },
  reemplazado:       { label: 'Reemplazado',           color: '#15803D', bg: 'rgba(34,197,94,0.12)' },
  rechazado:         { label: 'Garantía no procede',   color: '#B91C1C', bg: 'rgba(239,68,68,0.1)' },
  entregado:         { label: 'Entregado al cliente',  color: '#334155', bg: 'rgba(51,65,85,0.1)' },
} as const

export type RmaEstado = keyof typeof RMA_ESTADOS
export const RMA_ESTADO_KEYS = Object.keys(RMA_ESTADOS) as RmaEstado[]

/** Garantía tal como la devuelve la API. */
export interface Rma {
  id: string; folio: string; status: RmaEstado; orderId: string | null; sku: string; productName: string; serie: string | null; quantity: number
  falla: string; accesorios: string | null; folioProveedor: string | null; resolucion: string | null; createdAt: string
  historial: Array<{ status: string; nota?: string; byName: string; at: string }>
  cliente: { name: string; email: string; clientNumber: number | null; razonSocial: string | null; telefono: string | null; mostrador: boolean }
  atiende: { name: string; email: string } | null
}
