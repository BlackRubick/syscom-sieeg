import bcrypt from 'bcryptjs'
import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import type { UserRole, UserStatus } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores' })

  const body = await readBody<{
    name?: string; email?: string; password?: string
    role?: string; status?: string
  }>(event)

  const { name, email, password, role, status } = body

  if (!name || !email || !password || !role || !status) {
    throw createError({ statusCode: 400, message: 'Faltan campos requeridos' })
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, message: 'La contraseña debe tener al menos 8 caracteres' })
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (existing) throw createError({ statusCode: 409, message: 'Ya existe un usuario con ese correo' })

  const avatar = name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()
  const today  = new Date().toISOString().split('T')[0]
  const hash   = await bcrypt.hash(password, 12)  // #3 — bcrypt

  const user = await prisma.user.create({
    data: {
      name,
      email:     email.toLowerCase(),
      password:  hash,
      role:      role as UserRole,
      status:    status as UserStatus,
      createdAt: today,
      avatar,
    },
    select: { id:true, name:true, email:true, role:true, status:true, createdAt:true, lastLogin:true, avatar:true },
  })

  return { user }
})
