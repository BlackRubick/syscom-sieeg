import { requireSession } from '~/server/utils/session'
import { guardarDatosFiscales } from '~/server/utils/datosFiscales'

/* El usuario captura o corrige sus propios datos fiscales. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  return guardarDatosFiscales(session.userId, await readBody<Record<string, unknown>>(event))
})
