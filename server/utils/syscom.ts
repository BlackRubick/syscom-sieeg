import prisma from '~/server/utils/prisma'

interface TokenCache { token: string; expiresAt: number }
let cache: TokenCache | null = null

export async function getSyscomToken(): Promise<string> {
  if (cache && cache.expiresAt > Date.now() + 60_000) return cache.token

  const clientId     = process.env.SYSCOM_CLIENT_ID ?? ''
  const clientSecret = process.env.SYSCOM_CLIENT_SECRET ?? ''

  const res = await fetch('https://developers.syscom.mx/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     clientId,
      client_secret: clientSecret,
    }),
  })

  if (!res.ok) throw createError({ statusCode: 502, message: 'No se pudo autenticar con SYSCOM' })

  const data = await res.json() as { access_token: string; expires_in: number }
  cache = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return cache.token
}

/* ── Pedidos (POST /carrito/generar) ──
   Doc: https://developers.syscom.mx/llms-full.txt — el cuerpo va como JSON. */

// Claves SAT de forma de pago → claves del catálogo de SYSCOM (GET /carrito/pago)
const METODO_PAGO_SAT: Record<string, string> = {
  '01': 'sucursal-efectivo', '02': 'sucursal-cheque', '03': 'transferencia',
  '04': 'sucursal-credito',  '28': 'sucursal-debito',
}

export interface SyscomCarritoOpts {
  tipo_entrega:  'domicilio' | 'sucursal'
  direccion:     Record<string, string>
  fletera?:      string
  metodo_pago:   string
  productos:     Array<{ id: number; tipo: string; cantidad: number }>
  uso_cfdi:      string
  moneda?:       string
  ordenar?:      boolean
  orden_compra?: string
}

export interface SyscomCarritoResult {
  folio: string | null
  data: unknown
  error?: string
}

function syscomErrorMessage(data: unknown, status?: number): string {
  const d = data as Record<string, unknown> | null
  const det = Array.isArray(d?.detalles) ? (d!.detalles as Array<Record<string, unknown>>)[0] : undefined
  const detMsg = det ? `${det.campo ?? ''}: ${det.problema ?? ''}`.trim() : ''
  const base = (typeof d?.message === 'string' && d.message) || (typeof d?.error === 'string' && d.error) || (status ? `SYSCOM ${status}` : 'Error de SYSCOM')
  return detMsg ? `${base} (${detMsg})` : base
}

export async function generateSyscomOrder(opts: SyscomCarritoOpts): Promise<SyscomCarritoResult> {
  const token = await getSyscomToken()

  const body: Record<string, unknown> = {
    tipo_entrega: opts.tipo_entrega,
    direccion:    opts.direccion,
    metodo_pago:  METODO_PAGO_SAT[opts.metodo_pago] ?? opts.metodo_pago,
    tipo_pago:    'PUE',
    moneda:       opts.moneda ?? 'mxn',
    uso_cfdi:     opts.uso_cfdi,
    productos:    opts.productos,
  }
  if (opts.tipo_entrega === 'domicilio') body.fletera = opts.fletera ?? 'estafeta'
  if (opts.orden_compra) body.orden_compra = opts.orden_compra
  // Sin SYSCOM_ORDENAR=true solo se cotiza: nunca se genera un pedido real por accidente
  if (opts.ordenar) body.ordenar = true
  else              body.testmode = true

  const res = await fetch('https://developers.syscom.mx/api/v1/carrito/generar', {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body:    JSON.stringify(body),
  })

  const text = await res.text()
  let data: unknown = null
  try { data = JSON.parse(text) } catch { data = { raw: text } }

  if (!res.ok) return { folio: null, data, error: syscomErrorMessage(data, res.status) }

  // SYSCOM responde 200 con { error: "..." } en errores de negocio (p.ej. sin existencia)
  const bizError = (data as Record<string, unknown>)?.error
  if (typeof bizError === 'string' && bizError.trim()) return { folio: null, data, error: bizError.trim() }

  const resumen = (data as Record<string, unknown>)?.resumen as Record<string, unknown> | undefined
  const folio   = String(resumen?.folio_pedido ?? resumen?.folio ?? '') || null

  if (!folio || folio === 'TESTMODE') {
    return { folio: null, data, error: opts.ordenar ? 'SYSCOM no devolvió folio de pedido' : 'Modo prueba (SYSCOM_ORDENAR no está en true): se cotizó pero no se generó el pedido' }
  }
  return { folio, data }
}

/* Arma y envía el pedido a SYSCOM con los datos fiscales del cliente como dirección de entrega. */
export async function enviarPedidoSyscom(
  userId: string,
  items: Array<{ productId: string; quantity: number }>,
  ordenCompra?: string,
): Promise<SyscomCarritoResult> {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: {
      name: true, fiscalRazonSocial: true, fiscalCalle: true, fiscalNumExt: true,
      fiscalNumInt: true, fiscalColonia: true, fiscalCodpos: true, fiscalCiudad: true,
      fiscalEstado: true, fiscalPais: true, fiscalTelefono: true,
    },
  })

  const tipoEntrega = process.env.SYSCOM_TIPO_ENTREGA === 'sucursal' ? 'sucursal' : 'domicilio'
  const clip = (v: string | null | undefined, max: number) => (v ?? '').trim().slice(0, max)
  let direccion: Record<string, string>

  if (tipoEntrega === 'sucursal') {
    const sucursal = process.env.SYSCOM_SUCURSAL ?? ''
    if (!sucursal) return { folio: null, data: null, error: 'Falta SYSCOM_SUCURSAL en .env para recoger en sucursal' }
    direccion = { sucursal, atencion_a: clip(user?.fiscalRazonSocial ?? user?.name, 120) }
  } else {
    const cp = clip(user?.fiscalCodpos, 5)
    direccion = {
      atencion_a:    clip(user?.fiscalRazonSocial ?? user?.name, 120),
      calle:         clip(user?.fiscalCalle, 100),
      num_ext:       clip(user?.fiscalNumExt, 20) || 'S/N',
      num_int:       clip(user?.fiscalNumInt, 20),
      colonia:       clip(user?.fiscalColonia, 100),
      ciudad:        clip(user?.fiscalCiudad, 100),
      estado:        '',
      pais:          clip(user?.fiscalPais, 3) || 'MEX',
      codigo_postal: cp,
      telefono:      clip(user?.fiscalTelefono, 20),
    }
    const faltan = ([['calle', 'calle'], ['colonia', 'colonia'], ['ciudad', 'ciudad'], ['codigo_postal', 'código postal'], ['telefono', 'teléfono']] as const)
      .filter(([k]) => !direccion[k]).map(([, label]) => label)
    if (faltan.length) {
      return { folio: null, data: null, error: `Faltan datos de entrega del cliente: ${faltan.join(', ')}. Complétalos en Datos Fiscales y reintenta.` }
    }

    // SYSCOM exige la clave de estado (máx. 4 letras, p.ej. CHIS), no el nombre
    try {
      const r = await syscomGet<{ estado?: Array<{ codigo_estado?: string; estado_sat?: string }> }>(`/carrito/estados/${cp}`)
      direccion.estado = r.estado?.[0]?.codigo_estado ?? r.estado?.[0]?.estado_sat ?? ''
    } catch { /* se valida abajo */ }
    if (!direccion.estado) {
      const est = clip(user?.fiscalEstado, 4)
      if (est.length === (user?.fiscalEstado ?? '').trim().length) direccion.estado = est
    }
    if (!direccion.estado) {
      return { folio: null, data: null, error: `No se pudo obtener el estado del código postal ${cp}. Verifica el C.P. del cliente.` }
    }
  }

  return generateSyscomOrder({
    tipo_entrega: tipoEntrega,
    direccion,
    fletera:      process.env.SYSCOM_FLETERA || 'estafeta',
    metodo_pago:  process.env.SYSCOM_METODO_PAGO || 'transferencia',
    // Uso de CFDI de la factura que SYSCOM emite a SIEEG (compra para reventa), no el del cliente final
    uso_cfdi:     process.env.SYSCOM_USO_CFDI || 'G01',
    productos:    items.map(i => ({ id: Number(i.productId), tipo: 'nuevo', cantidad: i.quantity })),
    ordenar:      process.env.SYSCOM_ORDENAR === 'true',
    orden_compra: ordenCompra,
  })
}

/* ── GET a la API de SYSCOM con caché en memoria (compartida por todos los usuarios) ── */
const getCache = new Map<string, { data: unknown; exp: number }>()

function ttlFor(path: string): number {
  if (path === '/categorias' || path === '/marcas' || path === '/tipocambio') return 30 * 60_000
  if (/^\/productos\/\d+/.test(path)) return 5 * 60_000   // detalle + relacionados + accesorios
  return 2 * 60_000                                         // listados / búsquedas
}

export class SyscomHttpError extends Error {
  status: number
  data:   unknown
  constructor(status: number, data: unknown, message: string) {
    super(message)
    this.status = status
    this.data   = data
  }
}

export async function syscomGet<T = unknown>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`https://developers.syscom.mx/api/v1${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const key = url.toString()

  const hit = getCache.get(key)
  if (hit && hit.exp > Date.now()) return hit.data as T

  const token = await getSyscomToken()
  const res   = await fetch(key, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } })
  const text  = await res.text()
  let data: unknown = null
  if (text) { try { data = JSON.parse(text) } catch { data = { raw: text } } }

  if (!res.ok) {
    const msg = (data as Record<string, unknown>)?.message
    throw new SyscomHttpError(res.status, data, typeof msg === 'string' ? msg : `SYSCOM ${res.status}`)
  }

  if (getCache.size > 600) {
    const now = Date.now()
    for (const [k, v] of getCache) if (v.exp < now) getCache.delete(k)
  }
  getCache.set(key, { data, exp: Date.now() + ttlFor(path) })
  return data as T
}
