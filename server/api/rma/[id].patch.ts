import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { RMA_INCLUDE, serializeRma, atiendeGarantias, texto, type RmaEvento } from '~/server/utils/rma'
import { esMostrador } from '~/server/utils/mostrador'
import { RMA_ESTADOS, RMA_ESTADO_KEYS, formatRmaNumber, type RmaEstado } from '~/utils/rma'

/* Seguimiento de la garantía: cambio de estado (con nota), folio del proveedor y resolución. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (!atiendeGarantias(session.role)) throw createError({ statusCode: 403, message: 'Sin autorización' })
  const id   = getRouterParam(event, 'id')!
  const body = await readBody<{ status?: string; nota?: string; folioProveedor?: string; resolucion?: string; serie?: string }>(event)

  const rma = await prisma.rma.findUnique({ where: { id } })
  if (!rma) throw createError({ statusCode: 404, message: 'Garantía no encontrada' })

  const data: Record<string, unknown> = {}
  if ('folioProveedor' in body) data.folioProveedor = texto(body.folioProveedor, 60)
  if ('resolucion' in body)     data.resolucion     = texto(body.resolucion, 2000)
  if ('serie' in body)          data.serie          = texto(body.serie, 120)

  const nota = texto(body.nota, 500)
  const cambiaEstado = !!body.status && body.status !== rma.status
  if (body.status && !RMA_ESTADO_KEYS.includes(body.status as RmaEstado)) throw createError({ statusCode: 400, message: 'Estado inválido' })
  if (cambiaEstado || nota) {
    const evento: RmaEvento = { status: body.status ?? rma.status, byName: session.name, at: new Date().toISOString(), ...(nota ? { nota } : {}) }
    data.historial = [...((rma.historial ?? []) as unknown as RmaEvento[]), evento]
  }
  if (cambiaEstado) data.status = body.status

  const actualizada = await prisma.rma.update({ where: { id }, data, include: RMA_INCLUDE })

  if (cambiaEstado && !esMostrador(actualizada.user.email)) {
    const estado = RMA_ESTADOS[actualizada.status as RmaEstado].label
    await prisma.notification.create({
      data: {
        userId:  actualizada.userId,
        type:    'system',
        title:   `Garantía ${formatRmaNumber(actualizada.number)}: ${estado}`,
        message: nota ?? `Tu garantía de ${actualizada.productName.slice(0, 80)} cambió a «${estado}».`,
      },
    })
  }
  return { rma: serializeRma(actualizada) }
})
