import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { RMA_INCLUDE, serializeRma, atiendeGarantias } from '~/server/utils/rma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const rma = await prisma.rma.findUnique({ where: { id: getRouterParam(event, 'id')! }, include: RMA_INCLUDE })
  if (!rma || (!atiendeGarantias(session.role) && rma.userId !== session.userId)) {
    throw createError({ statusCode: 404, message: 'Garantía no encontrada' })
  }
  return { rma: serializeRma(rma) }
})
