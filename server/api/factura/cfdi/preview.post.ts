import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import {
  buildCfdiConcepto, validarConceptos, conceptosDePedidos,
  obtenerEmisor, obtenerNombreSerie, obtenerCliente, getFacturaEnv,
} from '~/server/utils/factura'
import type { ConceptoInput } from '~/server/utils/factura'
import { renderCfdiPreview } from '~/server/utils/cfdiPreview'

/* Vista previa de CFDI con plantilla propia.
   No llama a cfdi40/create, así que no crea borrador ni consume folio. */

interface PreviewBody {
  tipo:          'individual' | 'global'
  // individual
  userId?:       string
  orderId?:      string
  conceptos?:    ConceptoInput[]
  comentarios?:  string
  // global
  periodicidad?: string
  meses?:        string
  año?:          string
  usoCfdi?:      string
  orderIds?:     string[]
  // ambos
  formaPago:     string
  metodoPago:    string
  moneda?:       string
}

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores' })

  const body = await readBody<PreviewBody>(event)
  if (!body.formaPago)  throw createError({ statusCode: 400, message: 'Forma de pago requerida' })
  if (!body.metodoPago) throw createError({ statusCode: 400, message: 'Método de pago requerido' })

  const serieId = Number(process.env.FACTURA_SERIE_ID)
  const [emisor, serie] = await Promise.all([obtenerEmisor(), obtenerNombreSerie(serieId)])

  let conceptos: ConceptoInput[]
  let receptor: Parameters<typeof renderCfdiPreview>[0]['receptor']
  let informacionGlobal: Parameters<typeof renderCfdiPreview>[0]['informacionGlobal']

  if (body.tipo === 'global') {
    if (!body.periodicidad || !body.meses || !body.año || !body.usoCfdi) {
      throw createError({ statusCode: 400, message: 'Completa periodicidad, mes, año y uso de CFDI' })
    }
    // Misma selección de pedidos que usa global.post.ts
    const orders = await prisma.order.findMany({
      where: {
        status:  { in: ['approved', 'processing', 'shipped', 'delivered'] },
        cfdiUid: null,
        ...(body.orderIds?.length ? { id: { in: body.orderIds } } : {}),
      },
    })
    if (!orders.length) throw createError({ statusCode: 400, message: 'No hay pedidos aprobados pendientes de facturar' })

    conceptos = conceptosDePedidos(orders)
    receptor  = {
      rfc:         'XAXX010101000',
      razonSocial: 'PUBLICO EN GENERAL',
      regimen:     '616',
      codpos:      emisor.codpos,
      usoCfdi:     body.usoCfdi,
    }
    informacionGlobal = { periodicidad: body.periodicidad, meses: body.meses, año: body.año }
  } else {
    if (!body.userId) throw createError({ statusCode: 400, message: 'userId requerido' })
    validarConceptos(body.conceptos)
    conceptos = body.conceptos!

    const user = await prisma.user.findUnique({
      where:  { id: body.userId },
      select: {
        name: true, email: true, fiscalRfc: true, fiscalRazonSocial: true, fiscalRegimen: true,
        fiscalCodpos: true, fiscalUsocfdi: true, fiscalEmail: true,
      },
    })
    if (!user) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })

    // Preferimos los datos que tiene Factura.com, que son los que irán en el CFDI real
    const cliente = user.fiscalRfc ? await obtenerCliente(user.fiscalRfc) : null
    receptor = {
      rfc:         cliente?.RFC          || user.fiscalRfc         || '',
      razonSocial: cliente?.RazonSocial  || user.fiscalRazonSocial || user.name,
      regimen:     cliente?.RegimenId    || user.fiscalRegimen     || '',
      codpos:      cliente?.CodigoPostal || user.fiscalCodpos      || '',
      usoCfdi:     user.fiscalUsocfdi    || '',
      email:       cliente?.Contacto?.Email || user.fiscalEmail || user.email,
    }
  }

  const html = renderCfdiPreview({
    emisor,
    receptor,
    serie,
    conceptos:   conceptos.map(buildCfdiConcepto),
    formaPago:   body.formaPago,
    metodoPago:  body.metodoPago,
    moneda:      body.moneda ?? 'MXN',
    comentarios: body.comentarios?.trim() || undefined,
    informacionGlobal,
    referencia:  body.orderId ? body.orderId.slice(-6).toUpperCase() : undefined,
    logoUrl:     `${getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin}/logosieeg.jpg`,
    entorno:     getFacturaEnv(),
  })

  setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return html
})
