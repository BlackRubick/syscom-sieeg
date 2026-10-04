import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { RMA_INCLUDE, serializeRma, atiendeGarantias } from '~/server/utils/rma'
import { parseRmaNumber, RMA_ESTADO_KEYS } from '~/utils/rma'
import { parseClientNumber } from '~/utils/clientNumber'

/* Garantías: el personal ve todas; el cliente, solo las suyas. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const q       = getQuery(event)
  const search  = typeof q.search === 'string' ? q.search.trim().slice(0, 80) : ''
  const status  = typeof q.status === 'string' && RMA_ESTADO_KEYS.includes(q.status as never) ? q.status : undefined
  const folio   = search ? parseRmaNumber(search) : null
  const cl      = search ? parseClientNumber(search) : null

  const rmas = await prisma.rma.findMany({
    where: {
      ...(atiendeGarantias(session.role) ? {} : { userId: session.userId }),
      ...(status ? { status: status as never } : {}),
      ...(search ? {
        OR: [
          ...(folio ? [{ number: folio }] : []),
          ...(cl ? [{ user: { clientNumber: cl } }] : []),
          { sku:            { contains: search } },
          { productName:    { contains: search } },
          { serie:          { contains: search } },
          { folioProveedor: { contains: search } },
          { user: { name:   { contains: search } } },
          { user: { fiscalRazonSocial: { contains: search } } },
        ],
      } : {}),
    },
    orderBy: { number: 'desc' },
    take: 300,
    include: RMA_INCLUDE,
  })
  return { rmas: rmas.map(serializeRma) }
})
