/* Cliente integrador: descuento por nivel sobre el precio de SYSCOM, antes de sumar el IVA
   (precio SYSCOM − descuento, y después + 16%). */
export const NIVELES_INTEGRADOR = [25, 20, 10] as const

/** Descuento máximo que se le puede dar a un cliente (%). */
export const DESCUENTO_MAX = 25

export function esIntegrador(discountPct?: number | null): boolean {
  return (NIVELES_INTEGRADOR as readonly number[]).includes(Number(discountPct))
}

/** Nivel que manda el navegador (0 = sin descuento); cualquier otro valor no es válido. */
export function nivelIntegrador(v: unknown): number | null {
  const n = v === true ? 25 : v === false ? 0 : Number(v)
  return n === 0 || esIntegrador(n) ? n : null
}

/** Compra mínima del mes (pesos, IVA incluido, sin envío) para conservar cada nivel. */
export const MINIMO_MENSUAL: Record<number, number> = { 25: 5000, 20: 2800, 10: 1000 }

export interface MetaMensual { nivel: number; minimo: number; comprado: number; falta: number; avance: number; cumplida: boolean }

/** Avance del integrador hacia su compra mínima del mes; null si no es integrador. */
export function metaMensual(discountPct: number | null | undefined, comprado: number): MetaMensual | null {
  if (!esIntegrador(discountPct)) return null
  const nivel  = Number(discountPct)
  const minimo = MINIMO_MENSUAL[nivel]!
  const c      = Math.round(Math.max(0, comprado) * 100) / 100
  const falta  = Math.round(Math.max(0, minimo - c) * 100) / 100
  return { nivel, minimo, comprado: c, falta, avance: Math.min(100, Math.round(c / minimo * 100)), cumplida: falta === 0 }
}

/** Inicio y fin del mes en curso en hora de México (UTC−6, sin horario de verano). */
export function mesEnCurso(ahora = new Date()): { inicio: Date; fin: Date } {
  const mx = new Date(ahora.getTime() - 6 * 3600_000)
  const y = mx.getUTCFullYear(), m = mx.getUTCMonth()
  return { inicio: new Date(Date.UTC(y, m, 1, 6)), fin: new Date(Date.UTC(y, m + 1, 1, 6)) }
}
