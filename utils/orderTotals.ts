/* Desglose de importes de un pedido. Los precios de los artículos son sin IVA;
   el total del pedido se guarda con IVA (16%). */

export const IVA_RATE = 0.16

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100

export function subtotalDe(items: Array<{ price: number; quantity: number }>): number {
  return round2(items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0))
}

/** Total con IVA a partir de los artículos (precios sin IVA). */
export function totalConIva(items: Array<{ price: number; quantity: number }>): number {
  return round2(subtotalDe(items) * (1 + IVA_RATE))
}

/** Desglose para mostrar: subtotal, IVA y total (el total es el guardado en el pedido). */
export function desgloseTotales(items: Array<{ price: number; quantity: number }>, total: number) {
  const subtotal = subtotalDe(items)
  return { subtotal, iva: round2(total - subtotal), total }
}
