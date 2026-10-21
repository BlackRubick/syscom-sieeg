import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { comprasDelMes } from '~/server/utils/comprasMes'
import { metaMensual, mesEnCurso } from '~/utils/integrador'

/* Contador del integrador: cuánto lleva comprado este mes y cuánto le falta para conservar su descuento. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { discountPct: true } })
  const comprado = (await comprasDelMes([session.userId])).get(session.userId) ?? 0
  return { meta: metaMensual(user?.discountPct, comprado), finMes: mesEnCurso().fin.toISOString() }
})
