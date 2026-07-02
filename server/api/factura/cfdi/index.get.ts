import { requireSession } from '~/server/utils/session'
import { listarCFDIs } from '~/server/utils/factura'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores' })

  const query = getQuery(event)

  // #12 — Aumentar per_page máximo y exponer paginación real
  const page    = query.page     ? Number(query.page)     : 1
  const perPage = query.per_page ? Math.min(Number(query.per_page), 100) : 50

  const result = await listarCFDIs({
    month:    query.month ? String(query.month) : undefined,
    year:     query.year  ? String(query.year)  : undefined,
    rfc:      query.rfc   ? String(query.rfc)   : undefined,
    page,
    per_page: perPage,
  })

  return result
})
