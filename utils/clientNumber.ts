/* Número de cliente: se guarda como entero y se muestra como CL-0001. */

export function formatClientNumber(n?: number | null): string {
  return n ? `CL-${String(n).padStart(4, '0')}` : ''
}

/** Acepta "CL-0012", "cl12", "CL 12" o "12" y devuelve 12; si no parece número de cliente, null. */
export function parseClientNumber(q: string): number | null {
  const m = q.trim().match(/^(?:cl[\s-]*)?0*(\d{1,7})$/i)
  return m ? Number(m[1]) : null
}
