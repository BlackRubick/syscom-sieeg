import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { olvidarUsuarioEnCache } from '~/server/middleware/refresh-session'
import { guardarPassword, crearTokenReset, urlSitio } from '~/server/utils/resetPassword'
import { sendPasswordEmail } from '~/server/utils/email'
import type { UserRole, UserStatus } from '@prisma/client'

const ROLES:    UserRole[]   = ['admin', 'buyer', 'approver', 'viewer', 'seller']
const STATUSES: UserStatus[] = ['active', 'inactive', 'pending']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores' })

  const id   = getRouterParam(event, 'id')!
  const body = await readBody<Record<string, unknown>>(event)

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })

  const data: { name?: string; email?: string; role?: UserRole; status?: UserStatus; discountPct?: number } = {}
  if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim().replace(/\s+/g, ' ').slice(0, 120)
  if (typeof body.email === 'string' && body.email.trim()) {
    const email = body.email.trim().toLowerCase()
    if (!EMAIL_RE.test(email) || email.length > 160) throw createError({ statusCode: 400, message: 'Escribe un correo válido' })
    const dup = await prisma.user.findFirst({ where: { email, NOT: { id } } })
    if (dup) throw createError({ statusCode: 409, message: 'Ya existe un usuario con ese correo' })
    data.email = email
  }
  if (body.role !== undefined) {
    if (!ROLES.includes(body.role as UserRole)) throw createError({ statusCode: 400, message: 'Rol inválido' })
    data.role = body.role as UserRole
  }
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as UserStatus)) throw createError({ statusCode: 400, message: 'Estado inválido' })
    data.status = body.status as UserStatus
  }
  if (body.discountPct !== undefined && Number.isFinite(Number(body.discountPct))) data.discountPct = Math.max(0, Math.min(100, Number(body.discountPct)))

  // Que nunca se quede el sistema sin un administrador activo (ni uno mismo se quite el acceso)
  const dejaDeSerAdmin = existing.role === 'admin' && existing.status === 'active'
    && ((data.role && data.role !== 'admin') || (data.status && data.status !== 'active'))
  if (dejaDeSerAdmin) {
    if (id === session.userId) throw createError({ statusCode: 400, message: 'No puedes quitarte el rol de administrador ni desactivar tu propia cuenta' })
    const otros = await prisma.user.count({ where: { role: 'admin', status: 'active', NOT: { id } } })
    if (!otros) throw createError({ statusCode: 400, message: 'Debe quedar al menos un administrador activo' })
  }

  // Contraseña nueva que fija el administrador (p. ej. el cliente la olvidó)
  if (typeof body.password === 'string' && body.password) await guardarPassword(id, body.password)

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id:true, name:true, email:true, role:true, status:true, createdAt:true, lastLogin:true, avatar:true, clientNumber:true, discountPct:true, password:true },
  })
  olvidarUsuarioEnCache(id)

  // Se activó una solicitud de "Quiero ser cliente": se le manda la liga para crear su contraseña (72 h)
  let bienvenida: 'enviada' | 'fallo' | null = null
  if (existing.status === 'pending' && user.status === 'active' && typeof body.password !== 'string') {
    const link = `${urlSitio(event)}/restablecer?token=${encodeURIComponent(crearTokenReset(user, 72))}`
    bienvenida = await sendPasswordEmail({ to: user.email, nombre: user.name, link, bienvenida: true, horas: 72 })
      .then(() => 'enviada' as const).catch(() => 'fallo' as const)
  }

  const { password: _pw, ...publico } = user
  return { user: publico, bienvenida }
})
