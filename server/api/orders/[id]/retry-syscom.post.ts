import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { generateSyscomOrder } from '~/server/utils/syscom'
import type { OrderItem } from '~/types'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin' && session.role !== 'approver') {
    throw createError({ statusCode: 403, message: 'Sin autorización' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order)              throw createError({ statusCode: 404, message: 'Orden no encontrada' })
  if (order.status !== 'approved') throw createError({ statusCode: 400, message: 'Solo se puede reintentar en órdenes aprobadas' })
  if (order.syscomFolio)   throw createError({ statusCode: 400, message: 'Esta orden ya tiene folio SYSCOM' })

  const user = await prisma.user.findUnique({
    where: { id: order.userId },
    select: {
      name: true, fiscalRazonSocial: true, fiscalCalle: true, fiscalNumExt: true,
      fiscalNumInt: true, fiscalColonia: true, fiscalCodpos: true, fiscalCiudad: true,
      fiscalEstado: true, fiscalPais: true, fiscalTelefono: true, fiscalUsocfdi: true,
    },
  })

  const result = await generateSyscomOrder({
    tipo_entrega: 'domicilio',
    direccion: {
      atencion_a:    user?.fiscalRazonSocial ?? user?.name ?? 'N/A',
      calle:         user?.fiscalCalle    ?? '',
      num_ext:       user?.fiscalNumExt   ?? 'S/N',
      num_int:       user?.fiscalNumInt   ?? '',
      colonia:       user?.fiscalColonia  ?? '',
      codigo_postal: user?.fiscalCodpos   ?? '',
      ciudad:        user?.fiscalCiudad   ?? '',
      estado:        user?.fiscalEstado   ?? '',
      pais:          user?.fiscalPais     ?? 'MEX',
      telefono:      user?.fiscalTelefono ?? '',
    },
    metodo_pago:  process.env.SYSCOM_METODO_PAGO ?? '03',
    productos:    (order.items as OrderItem[]).map(i => ({ id: Number(i.productId), tipo: 'nuevo', cantidad: i.quantity })),
    uso_cfdi:     user?.fiscalUsocfdi ?? 'G03',
    ordenar:      process.env.SYSCOM_ORDENAR === 'true',
  })

  if (result.error && !result.folio) {
    throw createError({ statusCode: 502, message: result.error })
  }

  const updated = await prisma.order.update({
    where: { id },
    data:  { syscomFolio: result.folio, syscomData: result.data ?? undefined },
  })

  return { folio: updated.syscomFolio, syscomError: result.error }
})
