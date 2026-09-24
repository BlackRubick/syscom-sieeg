import { syscomGet, SyscomHttpError } from '~/server/utils/syscom'
import { requireSession } from '~/server/utils/session'
import { getPricing, sanitizeProductoPrecios } from '~/server/utils/pricing'

/* Proxy de solo lectura a SYSCOM.
   - Solo GET y solo las rutas que usa la app: nunca debe poder generar pedidos
     (carrito/generar) ni leer otros datos de la cuenta de la empresa.
   - Los precios de productos se devuelven ya con margen y descuento: el costo de SYSCOM no sale del servidor. */

const PRODUCT_ROUTES = [
  /^\/productos$/,
  /^\/productos\/\d+$/,
  /^\/productos\/\d+\/(relacionados|accesorios)$/,
]
const CATALOG_ROUTES = [/^\/categorias$/, /^\/categorias\/\d+$/, /^\/marcas$/]
// Facturas de la empresa con SYSCOM — solo para roles que ven el dashboard
const FACTURAS_ROUTE = /^\/facturas$/
const FACTURAS_ROLES = ['admin', 'approver', 'viewer']

export default defineEventHandler(async (event) => {
  const session = requireSession(event)

  if (getMethod(event) !== 'GET') throw createError({ statusCode: 405, message: 'Método no permitido' })

  const segments = (getRouterParam(event, 'path') ?? '').split('/').filter(Boolean)
  const path     = '/' + segments.join('/')

  const isProduct  = PRODUCT_ROUTES.some(r => r.test(path))
  const isCatalog  = CATALOG_ROUTES.some(r => r.test(path))
  const isFacturas = FACTURAS_ROUTE.test(path)
  if (!isProduct && !isCatalog && !isFacturas) throw createError({ statusCode: 404, message: 'Ruta no disponible' })
  if (isFacturas && !FACTURAS_ROLES.includes(session.role)) throw createError({ statusCode: 403, message: 'Sin autorización' })

  const params: Record<string, string> = {}
  for (const [k, v] of Object.entries(getQuery(event))) if (v != null) params[k] = String(v)

  let data: unknown
  try {
    data = await syscomGet(path, params)
  } catch (e) {
    if (e instanceof SyscomHttpError) throw createError({ statusCode: e.status, data: e.data, message: e.message })
    throw createError({ statusCode: 502, message: 'Error al conectar con SYSCOM' })
  }

  if (!isProduct) return data

  const pricing  = await getPricing(session.userId)
  const sanitize = (p: unknown) => sanitizeProductoPrecios(p as { precios?: unknown }, pricing)

  if (Array.isArray(data)) return data.map(sanitize)
  const obj = data as Record<string, unknown>
  if (Array.isArray(obj?.productos)) return { ...obj, productos: obj.productos.map(sanitize) }
  return sanitize(obj)
})
