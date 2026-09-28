/* Importes de un pedido. Los precios de venta YA INCLUYEN IVA (16%):
   el total es la suma de los artículos y el IVA solo se desglosa. */

export const IVA_RATE = 0.16

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100

/** Total del pedido = suma de precio × cantidad (precios con IVA incluido). */
export function totalDe(items: Array<{ price: number; quantity: number }>): number {
  return round2(items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0))
}

/** Desglose de un total con IVA incluido: subtotal (sin IVA) + IVA = total. */
export function desgloseTotales(total: number) {
  const subtotal = round2(total / (1 + IVA_RATE))
  return { subtotal, iva: round2(total - subtotal), total: round2(total) }
}

/** Precio unitario sin IVA (6 decimales, como lo pide el CFDI). */
export function precioSinIva(precioConIva: number): number {
  return Math.round((precioConIva / (1 + IVA_RATE)) * 1e6) / 1e6
}

export interface ShippingConfig { freeShippingMin: number; shippingFee: number; basicShippingFee?: number }

/** Envío básico por omisión (IVA incl.), como lo cobra SYSCOM: el SAT no admite un concepto de envío en $0. */
export const ENVIO_BASICO = 1.75

/** Mínimo para envío sin costo expresado con IVA (freeShippingMin se captura sin IVA: $1,000 + IVA = $1,160). */
export function minimoEnvioConIva(cfg: ShippingConfig): number {
  return round2(cfg.freeShippingMin * (1 + IVA_RATE))
}

/** Envío cobrado al cliente (IVA incluido): si la compra (IVA incl.) no llega al mínimo + IVA se cobra el cargo;
    si lo alcanza, solo el envío básico (nunca $0, para que el concepto de envío lleve precio en el CFDI). */
export function envioDe(totalArticulos: number, cfg: ShippingConfig): number {
  if (!(totalArticulos > 0)) return 0
  const basico = round2(cfg.basicShippingFee ?? ENVIO_BASICO)
  if (cfg.shippingFee > 0 && totalArticulos < minimoEnvioConIva(cfg)) return round2(cfg.shippingFee)
  return basico
}

/** true si el envío cobrado es solo el básico (la compra alcanzó el mínimo). */
export function esEnvioBasico(totalArticulos: number, cfg: ShippingConfig): boolean {
  return totalArticulos > 0 && !(cfg.shippingFee > 0 && totalArticulos < minimoEnvioConIva(cfg))
}

/** Concepto de CFDI para el cargo de envío (servicio de transporte de carga, unidad de servicio). */
export function conceptoEnvio(shippingFee: number) {
  return {
    descripcion:   'Envío',
    claveProdServ: '78102203',
    claveUnidad:   'E48',
    unidad:        'Servicio',
    cantidad:      1,
    valorUnitario: precioSinIva(shippingFee),
  }
}
