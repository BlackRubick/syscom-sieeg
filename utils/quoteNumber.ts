/* Folio de cotización: se guarda como entero y se muestra como COT-0001. */

export function formatQuoteNumber(n?: number | null): string {
  return n ? `COT-${String(n).padStart(4, '0')}` : ''
}

/** Acepta "COT-0012", "cot12" o "12" y devuelve 12; si no parece folio, null. */
export function parseQuoteNumber(q: string): number | null {
  const m = q.trim().match(/^(?:cot[\s-]*)?0*(\d{1,7})$/i)
  return m ? Number(m[1]) : null
}
