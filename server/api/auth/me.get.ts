import { getSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = getSession(event)
  if (!session) throw createError({ statusCode: 401, message: 'No autorizado' })

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id:true, name:true, email:true, role:true, status:true, createdAt:true, lastLogin:true, avatar:true,
      fiscalCompleted:true, fiscalRfc:true, fiscalRazonSocial:true, fiscalCodpos:true, fiscalEmail:true,
      fiscalUsocfdi:true, fiscalRegimen:true, fiscalPais:true, fiscalCalle:true, fiscalNumExt:true,
      fiscalNumInt:true, fiscalColonia:true, fiscalCiudad:true, fiscalDelegacion:true, fiscalLocalidad:true,
      fiscalEstado:true, fiscalNumregidtrib:true, fiscalNombre:true, fiscalApellidos:true, fiscalTelefono:true,
    },
  })

  if (!user) throw createError({ statusCode: 401, message: 'No autorizado' })

  return { user }
})
