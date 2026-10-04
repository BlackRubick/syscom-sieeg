/* Número de cliente: se guarda como entero y se muestra solo el número (0012), como lo maneja SYSCOM. */

export function formatClientNumber(n?: number | null): string {
  return n ? String(n).padStart(4, '0') : ''
}

/** Acepta "0012", "12" o el formato anterior "CL-0012" y devuelve 12; si no parece número de cliente, null. */
export function parseClientNumber(q: string): number | null {
  const m = q.trim().match(/^(?:cl[\s-]*)?0*(\d{1,7})$/i)
  return m ? Number(m[1]) : null
}
