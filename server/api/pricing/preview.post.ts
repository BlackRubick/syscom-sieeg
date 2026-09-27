import { requireSession } from '~/server/utils/session'
import { resolverCliente } from '~/server/utils/roles'
import { normalizarItems, preciosDelDia } from '~/server/utils/cotizacion'

/* Precios del carrito para un cliente (el vendedor ve lo que pagará ese cliente con su descuento). */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const body = await readBody<{ items?: unknown; clientId?: string }>(event)
  const { clientId } = await resolverCliente(session, body.clientId)
  return preciosDelDia(clientId, normalizarItems(body.items))
})
