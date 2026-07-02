import { createHash } from 'crypto'
import bcrypt from 'bcryptjs'
import prisma from '~/server/utils/prisma'
import { createToken, SESSION_COOKIE } from '~/server/utils/session'

// #4 — Rate limiting en memoria (por IP)
interface RateBucket { count: number; resetAt: number }
const rateBuckets = new Map<string, RateBucket>()
const WINDOW_MS  = 15 * 60 * 1000  // 15 min
const MAX_TRIES  = 10

function checkRateLimit(ip: string) {
  const now    = Date.now()
  const bucket = rateBuckets.get(ip)
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return
  }
  bucket.count++
  if (bucket.count > MAX_TRIES) {
    const waitMin = Math.ceil((bucket.resetAt - now) / 60_000)
    throw createError({ statusCode: 429, message: `Demasiados intentos. Espera ${waitMin} minuto${waitMin !== 1 ? 's' : ''} e intenta de nuevo.` })
  }
}

function clearRateLimit(ip: string) {
  rateBuckets.delete(ip)
}

export default defineEventHandler(async (event) => {
  const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    ?? getHeader(event, 'x-real-ip')
    ?? 'unknown'

  checkRateLimit(ip)

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

  // #1 — Verificar que el usuario exista y esté activo ANTES de validar contraseña
  if (!user) {
    throw createError({ statusCode: 401, message: 'Correo o contraseña incorrectos' })
  }
  if (user.status === 'inactive') {
    throw createError({ statusCode: 403, message: 'Esta cuenta está desactivada. Contacta al administrador.' })
  }
  if (user.status === 'pending') {
    throw createError({ statusCode: 403, message: 'Esta cuenta está pendiente de activación.' })
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

  clearRateLimit(ip)

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
  })

  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   8 * 60 * 60,
    path:     '/',
  })

  await prisma.user.update({
    where: { id: user.id },
    data:  { lastLogin: new Date().toISOString().split('T')[0] },
  })

  const { password: _, ...userWithoutPassword } = user
  return { user: userWithoutPassword }
})
