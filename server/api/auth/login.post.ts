import { createHash } from 'crypto'
import bcrypt from 'bcryptjs'
import prisma from '~/server/utils/prisma'
import { rateLimit, limpiarLimite } from '~/server/utils/rateLimit'
import { createToken, passwordVersion, SESSION_COOKIE, SESSION_COOKIE_OPTS } from '~/server/utils/session'

const HASH_FICTICIO = '$2b$12$DGEfWW32xeZfA2ed2dg2wuvLt9deDVk51LBjNFCYFhyl24EITdz8S'

export default defineEventHandler(async (event) => {
  // 10 intentos fallidos por IP cada 15 min (un login correcto reinicia la cuenta)
  rateLimit(event, 'auth-login', 10, 15 * 60_000)

  const body = await readBody<{ email?: string; password?: string }>(event)
  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, message: 'Correo y contraseña son requeridos' })
  }

  const user = await prisma.user.findFirst({
    where: { email: body.email.toLowerCase() },
    select: {
      id: true, name: true, email: true, role: true,
      status: true, createdAt: true, lastLogin: true,
      avatar: true, fiscalCompleted: true, password: true,
    },
  })

  if (!user) {
    // Mismo tiempo de respuesta que con un correo existente (no revela qué cuentas existen)
    await bcrypt.compare(body.password, HASH_FICTICIO)
    throw createError({ statusCode: 401, message: 'Correo o contraseña incorrectos' })
  }

  // #3 — Validar contraseña: soporta bcrypt (nuevo) y SHA-256 (legado)
  let passwordValid = false
  let needsRehash   = false

  if (user.password.startsWith('$2')) {
    // bcrypt
    passwordValid = await bcrypt.compare(body.password, user.password)
  } else {
    // SHA-256 legacy — validar y marcar para re-hashear
    const sha = createHash('sha256').update(body.password).digest('hex')
    passwordValid = sha === user.password
    needsRehash   = passwordValid
  }

  if (!passwordValid) {
    throw createError({ statusCode: 401, message: 'Correo o contraseña incorrectos' })
  }
  // El estado se informa solo con la contraseña correcta: así no se revela qué correos tienen cuenta
  if (user.status === 'inactive') {
    throw createError({ statusCode: 403, message: 'Esta cuenta está desactivada. Contacta al administrador.' })
  }
  if (user.status === 'pending') {
    throw createError({ statusCode: 403, message: 'Esta cuenta está pendiente de activación. Te avisaremos por correo cuando esté lista.' })
  }

  limpiarLimite(event, 'auth-login')

  // #3 — Migrar a bcrypt si venía de SHA-256
  if (needsRehash) {
    const newHash = await bcrypt.hash(body.password, 12)
    await prisma.user.update({ where: { id: user.id }, data: { password: newHash } })
  }

  const token = createToken({
    userId: user.id,
    role:   user.role,
    name:   user.name,
    email:  user.email,
    pv:     passwordVersion(needsRehash ? (await prisma.user.findUniqueOrThrow({ where: { id: user.id }, select: { password: true } })).password : user.password),
  })

  setCookie(event, SESSION_COOKIE, token, SESSION_COOKIE_OPTS)

  await prisma.user.update({
    where: { id: user.id },
    data:  { lastLogin: new Date().toISOString().split('T')[0] },
  })

  const { password: _, ...userWithoutPassword } = user
  return { user: userWithoutPassword }
})
