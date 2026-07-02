import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { buildCfdiConcepto, crearCFDI, obtenerCliente, crearCliente } from '~/server/utils/factura'
import type { CfdiPayload, ConceptoInput } from '~/server/utils/factura'
import type { OrderItem } from '~/types'

const RFC_PUBLICO = 'XAXX010101000'

async function getOrCreatePublicoUid(): Promise<string> {
  const existente = await obtenerCliente(RFC_PUBLICO)
  if (existente?.UID) return existente.UID

  const nuevo = await crearCliente({
    rfc:    RFC_PUBLICO,
    razons: 'PUBLICO EN GENERAL',
    codpos: '00000',
    email:  process.env.FACTURA_ADMIN_EMAIL ?? process.env.NUXT_ADMIN_EMAIL ?? 'admin@empresa.com',
    regimen:'616',
    pais:   'MEX',
  })
  return nuevo.UID
}

interface GlobalCfdiBody {
  periodicidad: string
  meses:        string
  año:          string
  formaPago:    string
  metodoPago:   string
  usoCfdi:      string
  moneda?:      string
  orderIds?:    string[]
}

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores' })

  const body = await readBody<GlobalCfdiBody>(event)

  const { periodicidad, meses, año, formaPago, metodoPago, usoCfdi } = body
  if (!periodicidad) throw createError({ statusCode: 400, message: 'Periodicidad requerida' })
  if (!meses)        throw createError({ statusCode: 400, message: 'Mes requerido' })
  if (!año)          throw createError({ statusCode: 400, message: 'Año requerido' })
  if (!formaPago)    throw createError({ statusCode: 400, message: 'Forma de pago requerida' })
  if (!metodoPago)   throw createError({ statusCode: 400, message: 'Método de pago requerido' })
  if (!usoCfdi)      throw createError({ statusCode: 400, message: 'Uso de CFDI requerido' })

  const serieId = Number(process.env.FACTURA_SERIE_ID)
  if (!serieId) throw createError({ statusCode: 500, message: 'FACTURA_SERIE_ID no configurado en .env' })

  // Obtener pedidos aprobados sin CFDI individual
  const where = {
    status:  { in: ['approved', 'processing', 'shipped', 'delivered'] as const },
    cfdiUid: null,
    ...(body.orderIds?.length ? { id: { in: body.orderIds } } : {}),
  }

  const orders = await prisma.order.findMany({ where })

  if (!orders.length) {
    throw createError({ statusCode: 400, message: 'No hay pedidos aprobados pendientes de facturar' })
  }

  // Agrupar todos los items de todos los pedidos en conceptos
  const conceptos: ConceptoInput[] = []
  for (const order of orders) {
    const items = order.items as OrderItem[]
    for (const item of items) {
      conceptos.push({
        descripcion:   item.sku ? `${item.name} (${item.sku})` : item.name,
        claveProdServ: item.satKey ?? '43211500',
        claveUnidad:   'H87',
        unidad:        'Pieza',
        cantidad:      item.quantity,
        valorUnitario: item.price,
      })
    }
  }

  // Obtener o crear el receptor "PUBLICO EN GENERAL" en Factura.com
  const receptorUid = await getOrCreatePublicoUid()

  const payload: CfdiPayload = {
    Receptor:      { UID: receptorUid },
    TipoDocumento: 'factura',
    Conceptos:     conceptos.map(buildCfdiConcepto),
    UsoCFDI:       usoCfdi,
    Serie:         serieId,
    FormaPago:     formaPago,
    MetodoPago:    metodoPago,
    Moneda:        body.moneda ?? 'MXN',
    EnviarCorreo:  false,
    InformacionGlobal: {
      Periodicidad: periodicidad,
      Meses:        meses,
      Año:          año,
    },
  }

  const result = await crearCFDI(payload)

  // Marcar todos los pedidos incluidos como facturados (con el UID de la global)
  await prisma.order.updateMany({
    where: { id: { in: orders.map(o => o.id) } },
    data:  { cfdiUid: result.uid },
  })

  return { ...result, ordersIncluded: orders.length }
})
