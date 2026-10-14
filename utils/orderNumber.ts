/* Número de pedido que ve la gente: consecutivo de la tabla orders ("Orden #12"). */
export function formatOrderNumber(n?: number | null): string {
  return n ? `Orden #${n}` : ''
}

/** Acepta "Orden #12", "orden 12", "#12" o "12" y devuelve 12; si no parece número de orden, null. */
export function parseOrderNumber(q: string): number | null {
  const m = q.trim().match(/^(?:orden|pedido)?\s*#?\s*(\d{1,9})$/i)
  return m ? Number(m[1]) : null
}
