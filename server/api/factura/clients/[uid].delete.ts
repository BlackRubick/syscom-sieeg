import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { eliminarCliente } from '~/server/utils/factura'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores' })

  const uid = getRouterParam(event, 'uid')
  if (!uid) throw createError({ statusCode: 400, message: 'UID requerido' })

  const result = await eliminarCliente(uid)

  // Si se eliminó correctamente, limpiar el UID en nuestra BD
  if (result.response === 'success') {
    await prisma.user.updateMany({
      where: { facturaUid: uid },
      data:  { facturaUid: null },
    })
  }

  return result
})
