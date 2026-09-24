import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { actualizarEstadoSyscom, ESTADOS_FINALES } from '~/server/utils/syscomTracking'

/* Actualiza en lote el estado SYSCOM de los pedidos que lo necesitan
   (con folio, no finalizados y sin consultar en los últimos 10 minutos).
   La página de órdenes lo llama al abrirse, en segundo plano. */

const MAX_POR_LLAMADA = 20
const FRESCO_MS       = 10 * 60_000
let enCurso = false

export default defineEventHandler(async (event) => {
  const session   = requireSession(event)
  const isManager = session.role === 'admin' || session.role === 'approver'
  if (enCurso) return { actualizados: 0, enCurso: true }

  const candidatos = await prisma.order.findMany({
    where: {
      syscomFolio: { not: null },
      status:      { notIn: ['cancelled', 'rejected'] },
      ...(isManager ? {} : { userId: session.userId }),
      OR: [{ syscomStatusAt: null }, { syscomStatusAt: { lt: new Date(Date.now() - FRESCO_MS) } }],
    },
    select: { id: true, syscomFolio: true, status: true, syscomTracking: true },
    orderBy: { syscomStatusAt: { sort: 'asc', nulls: 'first' } },
    take: MAX_POR_LLAMADA * 2,
  })
  const pendientes = candidatos
    .filter(o => !ESTADOS_FINALES.includes((o.syscomTracking as { estado?: string } | null)?.estado as never))
    .slice(0, MAX_POR_LLAMADA)

  enCurso = true
  let actualizados = 0
  try {
    for (const o of pendientes) {
      try { await actualizarEstadoSyscom(o); actualizados++ } catch { /* se reintenta en la próxima llamada */ }
    }
  } finally {
    enCurso = false
  }
  return { actualizados }
})
