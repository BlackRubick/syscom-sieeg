import type { SyscomProducto } from '../../types'

/* Cálculo de precios sin dependencias (se prueba en tests/precios.test.ts).
   precio SYSCOM (sin IVA) → + margen global → − descuento del cliente → + IVA 16 %. */

const IVA = 1.16

export interface Pricing { markupPct: number; discountPct: number }

function parsePrice(v?: unknown): number { return v ? Math.max(0, parseFloat(String(v)) || 0) : 0 }

/** Costo base de SYSCOM (precio especial o, si no hay, de lista). */
export function costoSyscom(p: Pick<SyscomProducto, 'precios'>): number {
  const especial = parsePrice(p.precios?.precio_especial)
  const lista    = parsePrice(p.precios?.precio_lista)
  return especial > 0 ? especial : lista
}

/** Precio con margen e IVA, antes del descuento del cliente. */
export function precioConMargen(p: Pick<SyscomProducto, 'precios'>, pr: Pricing): number {
  return Math.round(costoSyscom(p) * (1 + pr.markupPct / 100) * IVA * 100) / 100
}

/** Precio final de venta para el cliente, con IVA incluido. */
export function precioVenta(p: Pick<SyscomProducto, 'precios'>, pr: Pricing): number {
  return Math.round(costoSyscom(p) * (1 + pr.markupPct / 100) * (1 - pr.discountPct / 100) * IVA * 100) / 100
}

