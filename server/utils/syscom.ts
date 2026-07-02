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

export interface SyscomCarritoOpts {
  tipo_entrega: 'domicilio' | 'sucursal'
  direccion: Record<string, string>
  metodo_pago: string
  productos: Array<{ id: number; tipo: string; cantidad: number }>
  uso_cfdi: string
  moneda?: string
  ordenar?: boolean
}

export interface SyscomCarritoResult {
  folio: string | null
  data: unknown
  error?: string
}

export async function generateSyscomOrder(opts: SyscomCarritoOpts): Promise<SyscomCarritoResult> {
  const token = await getSyscomToken()

  const url = new URL('https://developers.syscom.mx/api/v1/carrito/generar')
  url.searchParams.set('tipo_entrega', opts.tipo_entrega)
  url.searchParams.set('metodo_pago',  opts.metodo_pago)
  url.searchParams.set('moneda',       opts.moneda ?? 'mxn')
  url.searchParams.set('uso_cfdi',     opts.uso_cfdi)
  url.searchParams.set('ordenar',      String(opts.ordenar ?? false))
  url.searchParams.set('productos',    JSON.stringify(opts.productos))
  url.searchParams.set('direccion',    JSON.stringify(opts.direccion))

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
  })

  const text = await res.text()
  let data: unknown = null
  try { data = JSON.parse(text) } catch { data = { raw: text } }

  if (!res.ok) {
    const msg = (data as Record<string, unknown>)?.message as string ?? `SYSCOM ${res.status}`
    return { folio: null, data, error: msg }
  }

  const resumen = (data as Record<string, unknown>)?.resumen as Record<string, unknown> | undefined
  const folio   = (resumen?.folio ?? resumen?.folio_pedido) as string | undefined ?? null

  return { folio, data }
}
