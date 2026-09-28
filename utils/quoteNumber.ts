/* Folio de cotización: se guarda como entero y se muestra solo como número (0001). */

export function formatQuoteNumber(n?: number | null): string {
  return n ? String(n).padStart(4, '0') : ''
}

/** Acepta "0012", "12" o el formato anterior "COT-0012" y devuelve 12; si no parece folio, null. */
export function parseQuoteNumber(q: string): number | null {
  const m = q.trim().match(/^(?:cot[\s-]*)?0*(\d{1,7})$/i)
  return m ? Number(m[1]) : null
}
