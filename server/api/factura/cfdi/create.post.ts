import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { buildCfdiConcepto, crearCFDI, validarConceptos } from '~/server/utils/factura'
import type { CfdiPayload, ConceptoInput } from '~/server/utils/factura'

interface CreateCfdiBody {
  userId:        string
  orderId?:      string
  conceptos:     ConceptoInput[]
  formaPago:     string
  metodoPago:    string
  moneda?:       string
  comentarios?:  string
  enviarCorreo?: boolean
}

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores' })

  const body = await readBody<CreateCfdiBody>(event)
  const { userId, conceptos, formaPago, metodoPago } = body

  if (!userId)            throw createError({ statusCode: 400, message: 'userId requerido' })
  if (!formaPago)         throw createError({ statusCode: 400, message: 'formaPago requerido' })
  if (!metodoPago)        throw createError({ statusCode: 400, message: 'metodoPago requerido' })

  const serieId = Number(process.env.FACTURA_SERIE_ID)
  if (!serieId) throw createError({ statusCode: 500, message: 'FACTURA_SERIE_ID no está configurado en .env — configúralo con el ID numérico de tu serie en Factura.com' })

  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { facturaUid: true, fiscalUsocfdi: true, fiscalCompleted: true, fiscalEmail: true },
  })

  if (!user)              throw createError({ statusCode: 404, message: 'Usuario no encontrado' })
  if (!user.facturaUid)   throw createError({ statusCode: 400, message: 'El usuario no está sincronizado con Factura.com — sincronízalo primero' })
  if (!user.fiscalUsocfdi) throw createError({ statusCode: 400, message: 'El usuario no tiene Uso de CFDI configurado en sus datos fiscales' })

  validarConceptos(conceptos)

  // #11 — Race condition: verificar que el pedido no tenga ya un CFDI
  if (body.orderId) {
    const existingOrder = await prisma.order.findUnique({
      where:  { id: body.orderId },
      select: { cfdiUid: true },
    })
    if (existingOrder?.cfdiUid) {
      throw createError({ statusCode: 409, message: 'Este pedido ya tiene un CFDI generado. Actualiza la página.' })
    }
  }

  const payload: CfdiPayload = {
    Receptor:      { UID: user.facturaUid },
    TipoDocumento: 'factura',
    Conceptos:     conceptos.map(buildCfdiConcepto),
    UsoCFDI:       user.fiscalUsocfdi,
    Serie:         serieId,
    FormaPago:     formaPago,
    MetodoPago:    metodoPago,
    Moneda:        body.moneda ?? 'MXN',
    Comentarios:   body.comentarios?.trim() || undefined,
    EnviarCorreo:  body.enviarCorreo ?? true,
  }

  const result = await crearCFDI(payload)

  // Marcar el pedido como facturado individualmente
  if (body.orderId && result.uid) {
    await prisma.order.update({
      where: { id: body.orderId },
      data:  { cfdiUid: result.uid },
    }).catch(() => {/* no bloquear si falla */})
  }

  return result
})
