import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import type { UserRole, UserStatus } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores' })

  const id   = getRouterParam(event, 'id')!
  const body = await readBody<Record<string, unknown>>(event)

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })

  if (body.email && typeof body.email === 'string') {
    const dup = await prisma.user.findFirst({ where: { email: body.email.toLowerCase(), NOT: { id } } })
    if (dup) throw createError({ statusCode: 409, message: 'Ya existe un usuario con ese correo' })
  }

  const data: Record<string, unknown> = {}
  if (body.name)                   data.name        = body.name
  if (body.email)                  data.email       = (body.email as string).toLowerCase()
  if (body.role)                   data.role        = body.role as UserRole
  if (body.status)                 data.status      = body.status as UserStatus
  if (body.discountPct !== undefined) data.discountPct = Math.max(0, Math.min(100, Number(body.discountPct)))

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id:true, name:true, email:true, role:true, status:true, createdAt:true, lastLogin:true, avatar:true, discountPct:true },
  })

  return { user }
})
