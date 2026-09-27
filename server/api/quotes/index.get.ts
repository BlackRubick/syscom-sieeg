import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { QUOTE_INCLUDE, serializeQuote } from '~/server/utils/cotizacion'
import { parseQuoteNumber } from '~/utils/quoteNumber'
import { parseClientNumber } from '~/utils/clientNumber'
import type { Prisma } from '@prisma/client'

/* Cotizaciones: el cliente ve las suyas; vendedores y administración ven todas. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  const veTodas = ['admin', 'approver', 'seller'].includes(session.role)

  const q      = getQuery(event)
  const status = typeof q.status === 'string' && ['open', 'converted', 'cancelled'].includes(q.status) ? q.status : undefined
  const search = typeof q.search === 'string' ? q.search.trim().slice(0, 80) : ''
  const mias   = q.mias === '1' && session.role === 'seller'

  const folio = search ? parseQuoteNumber(search) : null
  const cl    = search ? parseClientNumber(search) : null
  const where: Prisma.QuoteWhereInput = {
    ...(veTodas ? {} : { userId: session.userId }),
    ...(mias ? { sellerId: session.userId } : {}),
    ...(status ? { status: status as Prisma.QuoteWhereInput['status'] } : {}),
    ...(search ? {
      OR: [
        ...(folio ? [{ number: folio }] : []),
        ...(cl ? [{ user: { clientNumber: cl } }] : []),
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
        { user: { fiscalRazonSocial: { contains: search } } },
        { seller: { name: { contains: search } } },
      ],
    } : {}),
  }

  const quotes = await prisma.quote.findMany({ where, orderBy: { createdAt: 'desc' }, take: 200, include: QUOTE_INCLUDE })
  return { quotes: quotes.map(serializeQuote) }
})
