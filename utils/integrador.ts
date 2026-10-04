/* Cliente integrador: descuento por nivel sobre el precio de SYSCOM, antes de sumar el IVA
   (precio SYSCOM − descuento, y después + 16%). */
export const NIVELES_INTEGRADOR = [30, 20, 10] as const

export function esIntegrador(discountPct?: number | null): boolean {
  return (NIVELES_INTEGRADOR as readonly number[]).includes(Number(discountPct))
}

/** Nivel que manda el navegador (0 = sin descuento); cualquier otro valor no es válido. */
export function nivelIntegrador(v: unknown): number | null {
  const n = v === true ? 30 : v === false ? 0 : Number(v)
  return n === 0 || esIntegrador(n) ? n : null
}
