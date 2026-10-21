import { requireSession } from '~/server/utils/session'
import { refrescarEstadosSyscom } from '~/server/utils/syscomTracking'

/* Actualiza en lote el estado SYSCOM de los pedidos que lo necesitan
   (con folio, no finalizados y sin consultar en los últimos 10 minutos).
   La página de órdenes lo llama al abrirse, en segundo plano; además el servidor lo hace solo cada 10 min. */

const MAX_POR_LLAMADA = 20
let enCurso = false

export default defineEventHandler(async (event) => {
  const session   = requireSession(event)
  const isManager = session.role === 'admin' || session.role === 'approver'
  if (enCurso) return { actualizados: 0, enCurso: true }

  enCurso = true
  try {
    return { actualizados: await refrescarEstadosSyscom({ userId: isManager ? undefined : session.userId, max: MAX_POR_LLAMADA }) }
  } finally {
    enCurso = false
  }
})
