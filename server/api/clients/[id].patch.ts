import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { vendeAClientes } from '~/server/utils/roles'
import { getMostradorId } from '~/server/utils/mostrador'
import { nivelIntegrador } from '~/utils/integrador'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Editar un cliente desde la página Clientes: nombre, correo, teléfono e integrador (10, 20 o 30 %).
   El vendedor solo edita clientes (compradores); administración, a cualquiera y también el % de descuento libre. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (!vendeAClientes(session.role)) throw createError({ statusCode: 403, message: 'Sin autorización' })
  const id   = getRouterParam(event, 'id')!
  const body = await readBody<{ name?: string; email?: string; telefono?: string; integrador?: number | boolean; discountPct?: number }>(event)

  const existing = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true, email: true } })
  if (!existing) throw createError({ statusCode: 404, message: 'Cliente no encontrado' })
  if (session.role === 'seller' && existing.role !== 'buyer') throw createError({ statusCode: 403, message: 'Solo puedes editar clientes' })
  const esMostrador = id === await getMostradorId()

  const data: { name?: string; email?: string; fiscalTelefono?: string | null; discountPct?: number } = {}
  if (typeof body.name === 'string') {
    const name = body.name.trim().replace(/\s+/g, ' ')
    if (name.length < 2 || name.length > 120) throw createError({ statusCode: 400, message: 'Escribe el nombre del cliente' })
    data.name = name
  }
  if (typeof body.email === 'string' && !esMostrador) {
    const email = body.email.trim().toLowerCase()
    if (!EMAIL_RE.test(email) || email.length > 160) throw createError({ statusCode: 400, message: 'Escribe un correo válido' })
    if (email !== existing.email) {
      const dup = await prisma.user.findFirst({ where: { email, NOT: { id } }, select: { id: true } })
      if (dup) throw createError({ statusCode: 409, message: 'Ya existe un usuario con ese correo' })
      data.email = email
    }
  }
  if (typeof body.telefono === 'string') data.fiscalTelefono = body.telefono.trim().slice(0, 30) || null
  if (!esMostrador) {
    if (session.role === 'admin' && body.discountPct !== undefined && Number.isFinite(Number(body.discountPct))) {
      data.discountPct = Math.max(0, Math.min(100, Number(body.discountPct)))
    } else if (body.integrador !== undefined) {
      const nivel = nivelIntegrador(body.integrador)
      if (nivel === null) throw createError({ statusCode: 400, message: 'Nivel de integrador inválido' })
      data.discountPct = nivel
    }
  }

  await prisma.user.update({ where: { id }, data })
  return { ok: true }
})
