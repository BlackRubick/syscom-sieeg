import { requireSession } from '~/server/utils/session'
import { getFacturaHost, getFacturaHeaders } from '~/server/utils/factura'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores' })

  const uid    = getRouterParam(event, 'uid')
  const format = getRouterParam(event, 'format')

  if (!uid) throw createError({ statusCode: 400, message: 'uid requerido' })
  if (format !== 'pdf' && format !== 'xml') throw createError({ statusCode: 400, message: 'Formato inválido. Usa pdf o xml' })

  const url = `${getFacturaHost()}/v4/cfdi40/${uid}/${format}`

  const res = await fetch(url, { method: 'GET', headers: getFacturaHeaders() })

  if (!res.ok) {
    const text = await res.text()
    throw createError({ statusCode: res.status, message: `Factura.com error ${res.status}: ${text.slice(0, 200)}` })
  }

  const contentType = format === 'pdf' ? 'application/pdf' : 'application/xml'
  const disposition = `attachment; filename="cfdi-${uid}.${format}"`

  setResponseHeader(event, 'Content-Type', contentType)
  setResponseHeader(event, 'Content-Disposition', disposition)

  return sendStream(event, res.body!)
})
