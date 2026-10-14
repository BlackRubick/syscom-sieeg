/* Número de pedido que ve la gente: consecutivo de la tabla orders ("ORD#12"). */
export function formatOrderNumber(n?: number | null): string {
  return n ? `ORD#${n}` : ''
}

/** Acepta "ORD#12", "Orden #12", "#12" o "12" y devuelve 12; si no parece número de orden, null. */
export function parseOrderNumber(q: string): number | null {
  const m = q.trim().match(/^(?:ord(?:en)?|pedido)?\s*#?\s*(\d{1,9})$/i)
  return m ? Number(m[1]) : null
}
