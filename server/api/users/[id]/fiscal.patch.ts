import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Solo administradores pueden editar datos fiscales de otros usuarios' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

  const body = await readBody<Record<string, string>>(event)

  const { rfc, razonSocial, codpos, email, regimen, pais } = body
  if (!rfc || !razonSocial || !codpos || !email || !regimen || !pais) {
    throw createError({ statusCode: 400, message: 'Faltan campos requeridos: RFC, Razón Social, Código Postal, Email, Régimen y País' })
  }

  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })

  const user = await prisma.user.update({
    where: { id },
    data: {
      fiscalCompleted:    true,
      fiscalRfc:          rfc.toUpperCase(),
      fiscalRazonSocial:  razonSocial,
      fiscalCodpos:       codpos,
      fiscalEmail:        email.toLowerCase(),
      fiscalUsocfdi:      body.usocfdi        || null,
      fiscalRegimen:      regimen,
      fiscalPais:         pais.toUpperCase(),
      fiscalCalle:        body.calle          || null,
      fiscalNumExt:       body.numeroExterior || null,
      fiscalNumInt:       body.numeroInterior || null,
      fiscalColonia:      body.colonia        || null,
      fiscalCiudad:       body.ciudad         || null,
      fiscalDelegacion:   body.delegacion     || null,
      fiscalLocalidad:    body.localidad      || null,
      fiscalEstado:       body.estado         || null,
      fiscalNumregidtrib: body.numregidtrib   || null,
      fiscalNombre:       body.nombre         || null,
      fiscalApellidos:    body.apellidos      || null,
      fiscalTelefono:     body.telefono       || null,
    },
    select: {
      id: true, name: true, email: true, role: true, status: true, createdAt: true,
      lastLogin: true, avatar: true, facturaUid: true,
      fiscalCompleted: true, fiscalRfc: true, fiscalRazonSocial: true, fiscalCodpos: true,
      fiscalEmail: true, fiscalUsocfdi: true, fiscalRegimen: true, fiscalPais: true,
      fiscalCalle: true, fiscalNumExt: true, fiscalNumInt: true, fiscalColonia: true,
      fiscalCiudad: true, fiscalDelegacion: true, fiscalLocalidad: true, fiscalEstado: true,
      fiscalNumregidtrib: true, fiscalNombre: true, fiscalApellidos: true, fiscalTelefono: true,
    },
  })

  return { user }
})
