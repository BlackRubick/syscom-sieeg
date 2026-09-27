import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin' && session.role !== 'seller') throw createError({ statusCode: 403, message: 'Sin autorización' })

  const users = await prisma.user.findMany({
    where: session.role === 'seller' ? { role: 'buyer' } : { role: { not: 'admin' } },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true, name: true, email: true, role: true, status: true, createdAt: true,
      fiscalCompleted: true, fiscalRfc: true, fiscalRazonSocial: true, fiscalCodpos: true,
      fiscalEmail: true, fiscalUsocfdi: true, fiscalRegimen: true, fiscalPais: true,
      fiscalCalle: true, fiscalNumExt: true, fiscalNumInt: true, fiscalColonia: true,
      fiscalCiudad: true, fiscalDelegacion: true, fiscalLocalidad: true, fiscalEstado: true,
      fiscalNumregidtrib: true, fiscalNombre: true, fiscalApellidos: true, fiscalTelefono: true,
      facturaUid: true,
    },
  })

  return { users }
})
