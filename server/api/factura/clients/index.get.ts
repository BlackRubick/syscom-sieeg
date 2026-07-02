import { requireSession } from '~/server/utils/session'
import { listarClientes } from '~/server/utils/factura'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores' })

  const { razon_social, rfc, page, per_page } = getQuery(event)

  const result = await listarClientes({
    razon_social: razon_social as string | undefined,
    rfc:          rfc          as string | undefined,
    page:         page         ? Number(page)     : undefined,
    per_page:     per_page     ? Number(per_page) : undefined,
  })

  return result
})
