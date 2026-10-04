/* Cliente integrador: lleva un descuento fijo sobre el precio de venta. */
export const DESCUENTO_INTEGRADOR = 30

export function esIntegrador(discountPct?: number | null): boolean {
  return Number(discountPct) === DESCUENTO_INTEGRADOR
}
