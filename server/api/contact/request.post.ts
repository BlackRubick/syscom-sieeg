import { createHash } from 'crypto'
import prisma from '~/server/utils/prisma'
import { sendAccessRequestEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    name?: string
    email?: string
    company?: string
    phone?: string
  }>(event)

  const { name, email, company, phone } = body

  if (!name?.trim() || !email?.trim()) {
    throw createError({ statusCode: 400, message: 'Nombre y correo son requeridos' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    throw createError({ statusCode: 400, message: 'El correo no tiene un formato válido' })
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (existing) {
    if (existing.status === 'pending') {
      throw createError({ statusCode: 409, message: 'Ya existe una solicitud de acceso con este correo. Te contactaremos pronto.' })
    }
    throw createError({ statusCode: 409, message: 'Ya existe una cuenta asociada a este correo.' })
  }

  const tempPassword = createHash('sha256')
    .update(`pending-${email}-${Date.now()}-${Math.random()}`)
    .digest('hex')

  const today = new Date().toISOString().split('T')[0]

  await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: tempPassword,
      role: 'buyer',
      status: 'pending',
      createdAt: today,
      avatar: name.trim().split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase(),
      fiscalRazonSocial: company?.trim() || null,
      fiscalTelefono: phone?.trim() || null,
    },
  })

  // Notificar a todos los admins en la app
  const admins = await prisma.user.findMany({
    where: { role: 'admin', status: 'active' },
    select: { id: true },
  })

  if (admins.length > 0) {
    const companyPart = company?.trim() ? ` (${company.trim()})` : ''
    const phonePart   = phone?.trim()   ? ` · Tel: ${phone.trim()}` : ''

    await prisma.notification.createMany({
      data: admins.map(admin => ({
        userId:  admin.id,
        type:    'alert',
        title:   '🙋 Nueva solicitud de acceso',
        message: `${name.trim()}${companyPart} quiere ser cliente. Correo: ${email.toLowerCase().trim()}${phonePart}. Ve a Usuarios para activarlo.`,
        read:    false,
      })),
    })
  }

  // Enviar email al admin (sin bloquear la respuesta si falla)
  sendAccessRequestEmail({
    name:    name.trim(),
    email:   email.toLowerCase().trim(),
    company: company?.trim() ?? '',
    phone:   phone?.trim()   ?? '',
  }).catch(() => {})

  return { success: true }
})
