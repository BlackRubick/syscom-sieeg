import bcrypt from 'bcryptjs'
import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { createUserWithClientNumber } from '~/server/utils/clientNumber'
import { vendeAClientes } from '~/server/utils/roles'
import { DESCUENTO_INTEGRADOR } from '~/utils/integrador'
import type { UserRole, UserStatus } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (!vendeAClientes(session.role)) throw createError({ statusCode: 403, message: 'Sin autorización' })

  const body = await readBody<{
    name?: string; email?: string; password?: string
    role?: string; status?: string; discountPct?: number; integrador?: boolean
  }>(event)

  const { name, email, password } = body
  // Un vendedor solo da de alta clientes (compradores) y quedan activos de inmediato
  const esVendedor = session.role === 'seller'
  const role   = esVendedor ? 'buyer'  : body.role
  const status = esVendedor ? 'active' : body.status

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

  const user = await createUserWithClientNumber({
    name,
    email:     email.toLowerCase(),
    password:  hash,
    role:      role as UserRole,
    status:    status as UserStatus,
    createdAt: today,
    avatar,
    // Integrador: descuento fijo (lo puede marcar el vendedor); cualquier otro % solo lo asigna administración
    discountPct: body.integrador ? DESCUENTO_INTEGRADOR : esVendedor ? 0 : Math.max(0, Math.min(100, Number(body.discountPct) || 0)),
  }, { id:true, name:true, email:true, role:true, status:true, createdAt:true, lastLogin:true, avatar:true, clientNumber:true, discountPct:true })

  return { user }
})
