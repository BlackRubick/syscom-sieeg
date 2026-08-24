const HOSTS = {
  sandbox:    'https://sandbox.factura.com/api',
  production: 'https://api.factura.com',
} as const

type FacturaEnv = keyof typeof HOSTS

// ID de plugin requerido por Factura.com en todos los requests
const F_PLUGIN = '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed'

export function getFacturaEnv(): FacturaEnv {
  const env = process.env.FACTURA_ENV ?? 'sandbox'
  return env === 'production' ? 'production' : 'sandbox'
}

export function getFacturaHost(): string {
  return HOSTS[getFacturaEnv()]
}

export function getFacturaHeaders(): Record<string, string> {
  const apiKey    = process.env.FACTURA_API_KEY    ?? ''
  const secretKey = process.env.FACTURA_SECRET_KEY ?? ''

  if (!apiKey || !secretKey) {
    throw createError({ statusCode: 500, message: 'Credenciales de Factura.com no configuradas' })
  }

  return {
    'F-PLUGIN':     F_PLUGIN,
    'F-Api-Key':    apiKey,
    'F-Secret-Key': secretKey,
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  }
}

export async function facturaFetch<T = unknown>(
  version: 'v1' | 'v3' | 'v4',
  endpoint: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const host    = getFacturaHost()
  const url     = `${host}/${version}/${endpoint.replace(/^\//, '')}`
  const method  = options.method ?? 'GET'
  const headers = getFacturaHeaders()

  const res = await fetch(url, {
    method,
    headers,
    body: options.body != null ? JSON.stringify(options.body) : undefined,
  })

  const text = await res.text()
  let data: unknown = null
  try { data = JSON.parse(text) } catch { data = { raw: text } }

  const body = data as Record<string, unknown>

  // Error HTTP
  if (!res.ok) {
    const rawMsg = body?.message ?? `Factura.com error ${res.status}`
    const msg = typeof rawMsg === 'string' ? rawMsg : JSON.stringify(rawMsg)
    throw createError({ statusCode: res.status, message: msg })
  }

  // Factura.com devuelve HTTP 200 pero con status/response = 'error' en el body
  if (body?.status === 'error' || body?.response === 'error') {
    const rawMsg = body?.message ?? body?.msg ?? 'Error en Factura.com'
    const msg = typeof rawMsg === 'string' ? rawMsg : JSON.stringify(rawMsg)
    throw createError({ statusCode: 422, message: msg })
  }

  return data as T
}

/* ── Tipos de respuesta ── */
export interface FacturaCliente {
  UID:          string
  RazonSocial:  string
  RFC:          string
  Regimen:      string
  RegimenId:    string
  Calle:        string
  Numero:       string
  Interior:     string
  Colonia:      string
  CodigoPostal: string
  Ciudad:       string
  Delegacion:   string
  Estado:       string
  Localidad:    string | null
  Pais:         string
  NumRegIdTrib: string
  UsoCFDI:      string
  Contacto: {
    Nombre:    string
    Apellidos: string
    Email:     string
    Email2:    string
    Email3:    string
    Telefono:  string
  }
  cfdis: number
}

export interface FacturaClientePayload {
  rfc:              string
  razons:           string
  codpos:           string | number
  email:            string
  regimen:          string
  pais:             string
  usocfdi?:         string
  calle?:           string
  numero_exterior?: string
  numero_interior?: string
  colonia?:         string
  ciudad?:          string
  delegacion?:      string
  localidad?:       string
  estado?:          string
  numregidtrib?:    string
  nombre?:          string
  apellidos?:       string
  telefono?:        string
}

/* ── Operaciones de clientes ── */

export async function listarClientes(opts: {
  razon_social?: string
  rfc?: string
  page?: number
  per_page?: number
} = {}): Promise<{ data: FacturaCliente[]; pagination: unknown }> {
  const params = new URLSearchParams()
  if (opts.razon_social) params.set('razon_social', opts.razon_social)
  if (opts.rfc)          params.set('rfc',          opts.rfc)
  if (opts.page)         params.set('page',         String(opts.page))
  if (opts.per_page)     params.set('per_page',     String(opts.per_page))
  const qs = params.toString()
  const res = await facturaFetch<{ status: string; data: FacturaCliente[]; pagination: unknown }>(
    'v1', `clients${qs ? `?${qs}` : ''}`
  )
  return { data: res.data ?? [], pagination: res.pagination }
}

export async function obtenerCliente(rfc: string): Promise<FacturaCliente | null> {
  try {
    const res = await facturaFetch<{ status: string; Data: FacturaCliente }>('v1', `clients/${rfc}`)
    return res.Data ?? null
  } catch { return null }
}

export async function crearCliente(payload: FacturaClientePayload): Promise<FacturaCliente> {
  const res = await facturaFetch<{ status: string; Data: FacturaCliente }>(
    'v1', 'clients/create', { method: 'POST', body: payload }
  )
  return res.Data
}

export async function actualizarCliente(uid: string, payload: FacturaClientePayload): Promise<FacturaCliente> {
  const res = await facturaFetch<{ status: string; Data: FacturaCliente }>(
    'v1', `clients/${uid}/update`, { method: 'POST', body: { UID: uid, ...payload } }
  )
  return res.Data
}

export async function eliminarCliente(uid: string): Promise<{ response: string; message: string }> {
  return facturaFetch('v1', `clients/destroy/${uid}`, { method: 'POST' })
}

/* ── Tipos CFDI 4.0 ── */

export interface CfdiConcepto {
  ClaveProdServ:     string
  NoIdentificacion?: string
  Cantidad:          string
  ClaveUnidad:       string
  Unidad:            string
  ValorUnitario:     string
  Descripcion:       string
  ObjetoImp:         string
  Impuestos: {
    Traslados: Array<{
      Base:       string
      Impuesto:   string
      TipoFactor: string
      TasaOCuota: string
      Importe:    string
    }>
    Retenidos: unknown[]
    Locales:   unknown[]
  }
}

export interface CfdiPayload {
  Receptor: {
    UID:               string
    ResidenciaFiscal?: string
    NumRegIdTrib?:     string
  }
  TipoDocumento: 'factura'
  Conceptos:     CfdiConcepto[]
  UsoCFDI:       string
  Serie:         number
  FormaPago:     string
  MetodoPago:    string
  Moneda:        string
  Comentarios?:  string
  EnviarCorreo?: boolean
  InformacionGlobal?: {
    Periodicidad: string
    Meses:        string
    Año:          string
  }
}

export interface CfdiResult {
  response: string
  UUID:     string
  uid:      string
  SAT: {
    UUID:          string
    FechaTimbrado: string
  }
  INV: {
    Serie: string
    Folio: string | number
  }
}

export interface ConceptoInput {
  descripcion:       string
  claveProdServ:     string
  claveUnidad:       string
  unidad:            string
  cantidad:          number
  valorUnitario:     number
  noIdentificacion?: string
}

export function buildCfdiConcepto(item: ConceptoInput): CfdiConcepto {
  const base = parseFloat((item.cantidad * item.valorUnitario).toFixed(6))
  const iva  = parseFloat((base * 0.16).toFixed(6))
  return {
    ClaveProdServ:    item.claveProdServ,
    NoIdentificacion: item.noIdentificacion || undefined,
    Cantidad:         item.cantidad.toFixed(6),
    ClaveUnidad:      item.claveUnidad,
    Unidad:           item.unidad,
    ValorUnitario:    item.valorUnitario.toFixed(6),
    Descripcion:      item.descripcion,
    ObjetoImp:        '02',
    Impuestos: {
      Traslados: [{
        Base:       base.toFixed(6),
        Impuesto:   '002',
        TipoFactor: 'Tasa',
        TasaOCuota: '0.160000',
        Importe:    iva.toFixed(6),
      }],
      Retenidos: [],
      Locales:   [],
    },
  }
}

export async function crearCFDI(payload: CfdiPayload): Promise<CfdiResult> {
  return facturaFetch<CfdiResult>('v4', 'cfdi40/create', { method: 'POST', body: payload })
}

/* ── Listado de CFDIs ── */

export interface CfdiListItem {
  UUID:                string
  UID:                 string
  Folio?:              string
  FechaTimbrado?:      string
  Receptor?:           string
  RazonSocialReceptor?: string
  ReferenceClient?:    number
  Total?:              string
  Subtotal?:           string
  NumOrder?:           string
  Status?:             string
  Version?:            string
}

export interface CfdiListResponse {
  total:        number
  per_page:     number
  current_page: number
  last_page:    number
  from:         number
  to:           number
  data:         CfdiListItem[]
}

export async function listarCFDIs(opts: {
  month?:    string
  year?:     string
  rfc?:      string
  page?:     number
  per_page?: number
} = {}): Promise<CfdiListResponse> {
  const body: Record<string, unknown> = {}
  if (opts.month)    body.month    = opts.month
  if (opts.year)     body.year     = opts.year
  if (opts.rfc)      body.rfc      = opts.rfc
  if (opts.page)     body.page     = opts.page
  if (opts.per_page) body.per_page = opts.per_page

  return facturaFetch<CfdiListResponse>('v4', 'cfdi/list', { method: 'POST', body })
}
