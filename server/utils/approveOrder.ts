import prisma from '~/server/utils/prisma'
import { generateSyscomOrder } from '~/server/utils/syscom'
import type { OrderItem } from '~/types'

const RFC_RE = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i

export async function approveOrder(
  orderId: string,
  byUserId: string = 'system',
  byName:   string = 'Sistema (pago automático)',
) {
  const existing = await prisma.order.findUnique({
    where:   { id: orderId },
    include: { user: { select: { id: true, name: true, email: true } } },
  })
  if (!existing) throw new Error(`Orden ${orderId} no encontrada`)
  if (existing.status === 'approved') return { order: existing, syscomError: undefined }

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
  const newLog = [...((existing.auditLog ?? []) as unknown[]), auditEntry]

  const updated = await prisma.order.update({
    where: { id: orderId },
    data:  {
      status:    'approved',
      auditLog:  newLog,
      syscomFolio,
      syscomData,
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  })

  await prisma.notification.create({
    data: {
      userId:  existing.userId,
      type:    'order',
      title:   '✅ Pedido aprobado',
      message: `Tu pedido por ${updated.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} fue aprobado${syscomFolio ? ` · Folio SYSCOM: ${syscomFolio}` : ''}.`,
      orderId,
    },
  })

  return { order: updated, syscomError }
}
