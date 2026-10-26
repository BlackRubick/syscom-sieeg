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

export interface MetaMensual {
  nivel: number; minimo: number; comprado: number; falta: number; avance: number; cumplida: boolean
  /** Nivel al que baja si no llega al mínimo (igual al actual en 10 %) */
  bajaA: number
  /** Siguiente nivel y cuánto le falta para subir en este mes (null si ya está en el más alto) */
  sube: { nivel: number; falta: number } | null
}

/** Avance del integrador hacia su compra mínima del mes; null si no es integrador. */
export function metaMensual(discountPct: number | null | undefined, comprado: number): MetaMensual | null {
  if (!esIntegrador(discountPct)) return null
  const nivel  = Number(discountPct)
  const minimo = MINIMO_MENSUAL[nivel]!
  const c      = Math.round(Math.max(0, comprado) * 100) / 100
  const falta  = Math.round(Math.max(0, minimo - c) * 100) / 100
  const arriba = NIVELES_INTEGRADOR[NIVELES_INTEGRADOR.indexOf(nivel as typeof NIVELES_INTEGRADOR[number]) - 1]
  return {
    nivel, minimo, comprado: c, falta, avance: Math.min(100, Math.round(c / minimo * 100)), cumplida: falta === 0,
    bajaA: nivelAlCerrarMes(nivel, 0),
    sube: arriba ? { nivel: arriba, falta: Math.round(Math.max(0, MINIMO_MENSUAL[arriba]! - c) * 100) / 100 } : null,
  }
}

/** Nivel más alto que alcanza una compra mensual (0 = ninguno). */
export function nivelAlcanzado(comprado: number): number {
  return NIVELES_INTEGRADOR.find(n => comprado >= MINIMO_MENSUAL[n]!) ?? 0
}

/** Durante el mes: si ya compró el mínimo de un nivel más alto, sube a ese nivel en ese momento. */
export function nivelAlSubir(actual: number, comprado: number): number {
  if (!esIntegrador(actual)) return actual
  return Math.max(actual, nivelAlcanzado(comprado))
}

/** Nivel con el que sale un pedido nuevo: si lo comprado en el mes más este pedido (a los precios de ese
    nivel, IVA incl. y sin envío) llega al mínimo de un nivel más alto, el mismo pedido ya lleva ese descuento. */
export function nivelConCarrito(actual: number, comprado: number, totalAlNivel: (nivel: number) => number): number {
  const base = nivelAlSubir(actual, comprado)
  if (!esIntegrador(base)) return base
  return NIVELES_INTEGRADOR.find(n => n > base && comprado + totalAlNivel(n) >= MINIMO_MENSUAL[n]!) ?? base
}

/** Al cerrar el mes: si no llegó a su mínimo baja un nivel (25 → 20 → 10, del 10 ya no baja). */
export function nivelAlCerrarMes(actual: number, comprado: number): number {
  if (!esIntegrador(actual)) return actual
  if (comprado >= MINIMO_MENSUAL[actual]!) return nivelAlSubir(actual, comprado)
  const i = NIVELES_INTEGRADOR.indexOf(actual as typeof NIVELES_INTEGRADOR[number])
  return NIVELES_INTEGRADOR[Math.min(i + 1, NIVELES_INTEGRADOR.length - 1)]!
}

/** Mes en hora de México (UTC−6, sin horario de verano): desplazamiento 0 = el actual, −1 = el anterior. */
export function mesEnCurso(ahora = new Date(), desplazamiento = 0): { inicio: Date; fin: Date; clave: string } {
  const mx = new Date(ahora.getTime() - 6 * 3600_000)
  const inicio = new Date(Date.UTC(mx.getUTCFullYear(), mx.getUTCMonth() + desplazamiento, 1, 6))
  const fin    = new Date(Date.UTC(mx.getUTCFullYear(), mx.getUTCMonth() + desplazamiento + 1, 1, 6))
  return { inicio, fin, clave: `${inicio.getUTCFullYear()}-${String(inicio.getUTCMonth() + 1).padStart(2, '0')}` }
}
