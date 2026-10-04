/* Folio de cotización: se guarda como entero y se muestra con la fecha en que se hizo y el consecutivo
   (280926-0005 = 28 de septiembre de 2026, cotización 5) para ubicarla rápido al leerla. */

/** Fecha DDMMAA en hora de México. */
function fechaFolio(fecha: Date | string): string {
  const p = Object.fromEntries(new Intl.DateTimeFormat('es-MX', { timeZone: 'America/Mexico_City', day: '2-digit', month: '2-digit', year: '2-digit' })
    .formatToParts(new Date(fecha)).map(x => [x.type, x.value]))
  return `${p.day}${p.month}${p.year}`
}

export function formatQuoteNumber(n?: number | null, fecha?: Date | string | null): string {
  if (!n) return ''
  const num = String(n).padStart(4, '0')
  return fecha ? `${fechaFolio(fecha)}-${num}` : num
}

/** Acepta "280926-0012", "0012", "12" o el formato anterior "COT-0012" y devuelve 12; si no parece folio, null. */
export function parseQuoteNumber(q: string): number | null {
  const m = q.trim().match(/^(?:cot[\s-]*)?(?:\d{6}[\s-]+)?0*(\d{1,7})$/i)
  return m ? Number(m[1]) : null
}

/** Vigencia de una cotización (informativa: al confirmar siempre se cobra el precio del día). */
export const VIGENCIA_DIAS = 15

export function venceCotizacion(creada: string | Date): string {
  const d = new Date(creada)
  d.setDate(d.getDate() + VIGENCIA_DIAS)
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function cotizacionVencida(creada: string | Date): boolean {
  return Date.now() > new Date(creada).getTime() + VIGENCIA_DIAS * 86_400_000
}
