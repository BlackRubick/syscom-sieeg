import type { Prisma } from '@prisma/client'
import prisma from '~/server/utils/prisma'
import { enviarPedidoSyscom } from '~/server/utils/syscom'
import type { OrderItem } from '~/types'
import { ORDER_INCLUDE } from '~/server/utils/orderDto'
import { trackingInicial } from '~/server/utils/syscomTracking'
import { actualizarPreciosPendiente } from '~/server/utils/actualizarPrecios'

const RFC_RE = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i
const ESTADO_TEXTO: Record<string, string> = { rejected: 'rechazado', cancelled: 'cancelado', processing: 'en proceso', shipped: 'enviado', delivered: 'entregado' }

export async function approveOrder(
  orderId: string,
  byUserId: string = 'system',
  byName:   string = 'Sistema (pago automático)',
) {
  const existing = await prisma.order.findUnique({
    where:   { id: orderId },
    include: { user: { select: { id: true, name: true, email: true } } },
  })
  if (!existing) throw createError({ statusCode: 404, message: 'Pedido no encontrado' })
  if (existing.status === 'approved') {
    const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId }, include: ORDER_INCLUDE })
    return { order, syscomError: undefined }
  }
  // Solo un pedido pendiente se aprueba: uno cancelado o rechazado no debe llegar a SYSCOM
  if (existing.status !== 'pending') {
    throw createError({ statusCode: 400, message: `No se puede aprobar un pedido ${ESTADO_TEXTO[existing.status] ?? existing.status}` })
  }
  // Aún sin pagar: se aprueba con el precio del día (si SYSCOM subió el precio, se cobra el nuevo)
  if (await actualizarPreciosPendiente(orderId).catch(() => false)) {
    Object.assign(existing, await prisma.order.findUniqueOrThrow({ where: { id: orderId }, select: { items: true, total: true, shippingFee: true, auditLog: true } }))
  }

  // Se "aparta" el pedido de forma atómica: si dos personas aprueban a la vez, solo una lo manda a SYSCOM
  const apartado = await prisma.order.updateMany({ where: { id: orderId, status: 'pending' }, data: { status: 'approved' } })
  if (!apartado.count) {
    const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId }, include: ORDER_INCLUDE })
    return { order, syscomError: order.status === 'approved' ? 'Otra persona ya lo estaba aprobando; revisa el folio SYSCOM.' : undefined }
  }

  const user = await prisma.user.findUnique({
    where:  { id: existing.userId },
    select: {
      name: true, fiscalRazonSocial: true, fiscalCalle: true, fiscalNumExt: true,
      fiscalNumInt: true, fiscalColonia: true, fiscalCodpos: true, fiscalCiudad: true,
      fiscalEstado: true, fiscalPais: true, fiscalTelefono: true, fiscalUsocfdi: true,
      fiscalRfc: true,
    },
  })

  let syscomFolio: string | null = existing.syscomFolio ?? null
  let syscomData:  unknown        = existing.syscomData  ?? undefined
  let syscomError: string | undefined

  if (!existing.syscomFolio) {
    if (user?.fiscalRfc && !RFC_RE.test(user.fiscalRfc.replace(/\s/g, ''))) {
      syscomError = `RFC inválido: ${user.fiscalRfc}. Verifica los datos fiscales del usuario.`
    } else {
      try {
        const result = await enviarPedidoSyscom(existing.userId, existing.items as unknown as OrderItem[], existing.id.slice(-8).toUpperCase())
        syscomFolio = result.folio
        syscomData  = result.data ?? undefined
        syscomError = result.error

        if (result.error) {
          const errLow = result.error.toLowerCase()
          if (errLow.includes('existencia') || errLow.includes('stock') || errLow.includes('disponible')) {
            syscomError = `Sin existencia suficiente en SYSCOM: ${result.error}`
          }
        }
      } catch (e) {
        syscomError = e instanceof Error ? e.message : 'Error al conectar con SYSCOM'
      }
    }
  }

  const auditEntry = {
    status:  'approved',
    by:      byUserId,
    byName,
    at:      new Date().toISOString(),
    auto:    byUserId === 'system',
    ...(syscomFolio ? { syscomFolio } : {}),
    ...(syscomError ? { syscomError } : {}),
  }
  const newLog = [...((existing.auditLog ?? []) as Prisma.InputJsonValue[]), auditEntry as Prisma.InputJsonValue]

  const updated = await prisma.order.update({
    where: { id: orderId },
    data:  {
      status:    'approved',
      auditLog:  newLog,
      syscomFolio,
      syscomData: syscomData as Prisma.InputJsonValue | undefined,
      ...(syscomFolio && !existing.syscomFolio ? { syscomTracking: trackingInicial() as object, syscomStatusAt: new Date() } : {}),
    },
    include: ORDER_INCLUDE,
  })

  await prisma.notification.create({
    data: {
      userId:  existing.userId,
      type:    'order',
      title:   '✅ Pedido aprobado',
      message: `Tu pedido por ${updated.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} IVA incl. fue aprobado${syscomFolio ? ` · Folio SYSCOM: ${syscomFolio}` : ''}.`,
      orderId,
    },
  })

  return { order: updated, syscomError }
}
