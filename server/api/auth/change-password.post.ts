import { createHash } from 'crypto'
import bcrypt from 'bcryptjs'
import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)

  const body = await readBody<{ currentPassword?: string; newPassword?: string }>(event)
  const currentPw = body.currentPassword
  if (!currentPw || !body.newPassword) {
    throw createError({ statusCode: 400, message: 'Contraseña actual y nueva son requeridas' })
  }
  if (body.newPassword.length < 8) {
    throw createError({ statusCode: 400, message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  }
  if (currentPw === body.newPassword) {
    throw createError({ statusCode: 400, message: 'La nueva contraseña debe ser diferente a la actual' })
  }

  const user = await prisma.user.findUnique({
    where:  { id: session.userId },
    select: { password: true },
  })
  if (!user) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })

  // Soportar bcrypt y SHA-256 legacy
  let valid = false
  if (user.password.startsWith('$2')) {
    valid = await bcrypt.compare(currentPw, user.password)
  } else {
    valid = createHash('sha256').update(currentPw).digest('hex') === user.password
  }
  if (!valid) throw createError({ statusCode: 401, message: 'La contraseña actual es incorrecta' })

  const newHash = await bcrypt.hash(body.newPassword, 12)
  await prisma.user.update({ where: { id: session.userId }, data: { password: newHash } })

  return { ok: true }
})
