import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { generateSyscomOrder } from '~/server/utils/syscom'
import type { OrderItem } from '~/types'

const ALLOWED = ['approved', 'rejected', 'cancelled', 'processing', 'shipped', 'delivered'] as const
type AllowedStatus = typeof ALLOWED[number]

// RFC regex SAT
const RFC_RE = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i

export default defineEventHandler(async (event) => {
  const session   = requireSession(event)
  const isManager = session.role === 'admin' || session.role === 'approver'

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const body = await readBody<{ status: AllowedStatus }>(event)
  if (!ALLOWED.includes(body.status)) {
    throw createError({ statusCode: 400, message: 'Estado inválido' })
  }

  const existing = await prisma.order.findUnique({
    where:   { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  })
  if (!existing) throw createError({ statusCode: 404, message: 'Orden no encontrada' })

  // Compradores solo pueden cancelar sus propios pedidos en estado pendiente/aprobado
  if (!isManager) {
    if (existing.userId !== session.userId) {
      throw createError({ statusCode: 403, message: 'Sin autorización' })
    }
    if (body.status !== 'cancelled') {
      throw createError({ statusCode: 403, message: 'Solo puedes cancelar tus propios pedidos' })
    }
    if (!['pending', 'approved'].includes(existing.status)) {
      throw createError({ statusCode: 400, message: `No se puede cancelar un pedido en estado "${existing.status}"` })
    }
  }

  let syscomFolio: string | null = existing.syscomFolio ?? null
  let syscomData:  unknown        = existing.syscomData  ?? undefined
  let syscomError: string | undefined

  if (body.status === 'approved' && !existing.syscomFolio) {
    const user = await prisma.user.findUnique({
      where: { id: existing.userId },
      select: {
        name: true, fiscalRazonSocial: true, fiscalCalle: true, fiscalNumExt: true,
        fiscalNumInt: true, fiscalColonia: true, fiscalCodpos: true, fiscalCiudad: true,
        fiscalEstado: true, fiscalPais: true, fiscalTelefono: true, fiscalUsocfdi: true,
        fiscalRfc: true,
      },
    })

    // #15 — Validar RFC antes de enviar a SYSCOM
    if (user?.fiscalRfc && !RFC_RE.test(user.fiscalRfc.replace(/\s/g, ''))) {
      syscomError = `RFC inválido: ${user.fiscalRfc}. Verifica los datos fiscales del usuario.`
    } else {
      const direccion: Record<string, string> = {
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
      }

      const productos = (existing.items as OrderItem[]).map(item => ({
        id:       Number(item.productId),
        tipo:     'nuevo',
        cantidad: item.quantity,
      }))

      try {
        const result = await generateSyscomOrder({
          tipo_entrega: 'domicilio',
          direccion,
          metodo_pago:  process.env.SYSCOM_METODO_PAGO ?? '03',
          productos,
          uso_cfdi:     user?.fiscalUsocfdi ?? 'G03',
          ordenar:      process.env.SYSCOM_ORDENAR === 'true',
        })
        syscomFolio = result.folio
        syscomData  = result.data ?? undefined
        syscomError = result.error

        // #20 — Mejorar mensaje de error de stock
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

  // #17 — Audit log: registrar el cambio de estado
  const auditEntry = {
    status:    body.status,
    by:        session.userId,
    byName:    session.name,
    at:        new Date().toISOString(),
    ...(syscomFolio ? { syscomFolio } : {}),
    ...(syscomError ? { syscomError } : {}),
  }
  const prevLog = (existing.auditLog ?? []) as unknown[]
  const newLog  = [...prevLog, auditEntry]

  const updated = await prisma.order.update({
    where: { id },
    data: {
      status:   body.status,
      auditLog: newLog,
      ...(body.status === 'approved' ? { syscomFolio, syscomData } : {}),
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  })

  // #7 — Notificar al comprador cuando se aprueba o rechaza su pedido
  if (body.status === 'approved' || body.status === 'rejected' || body.status === 'cancelled') {
    const titles: Record<string, string> = {
      approved:  '✅ Pedido aprobado',
      rejected:  '❌ Pedido rechazado',
      cancelled: '🚫 Pedido cancelado',
    }
    const messages: Record<string, string> = {
      approved:  `Tu pedido por ${updated.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} fue aprobado${syscomFolio ? ` · Folio SYSCOM: ${syscomFolio}` : ''}.`,
      rejected:  `Tu pedido por ${updated.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} fue rechazado.`,
      cancelled: `Tu pedido por ${updated.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} fue cancelado.`,
    }
    await prisma.notification.create({
      data: {
        userId:  existing.userId,
        type:    'order',
        title:   titles[body.status],
        message: messages[body.status],
        orderId: id,
      },
    })
  }

  return {
    order: {
      id:            updated.id,
      userId:        updated.userId,
      userName:      updated.user.name,
      userEmail:     updated.user.email,
      status:        updated.status,
      items:         updated.items,
      total:         updated.total,
      priority:      updated.priority,
      notes:         updated.notes,
      syscomFolio:   updated.syscomFolio,
      cfdiUid:       updated.cfdiUid,
      auditLog:      updated.auditLog,
      paymentId:     updated.paymentId,
      paymentStatus: updated.paymentStatus,
      paymentMethod: updated.paymentMethod,
      paymentData:   updated.paymentData,
      createdAt:     updated.createdAt.toISOString(),
      updatedAt:     updated.updatedAt.toISOString(),
    },
    syscomError,
  }
})
