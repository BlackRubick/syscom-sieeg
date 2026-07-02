import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { crearCliente, actualizarCliente, obtenerCliente } from '~/server/utils/factura'
import type { FacturaClientePayload } from '~/server/utils/factura'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores' })

  const { userId } = await readBody<{ userId: string }>(event)
  if (!userId) throw createError({ statusCode: 400, message: 'userId requerido' })

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, name: true, email: true, facturaUid: true,
      fiscalCompleted: true, fiscalRfc: true, fiscalRazonSocial: true, fiscalCodpos: true,
      fiscalEmail: true, fiscalUsocfdi: true, fiscalRegimen: true, fiscalPais: true,
      fiscalCalle: true, fiscalNumExt: true, fiscalNumInt: true, fiscalColonia: true,
      fiscalCiudad: true, fiscalDelegacion: true, fiscalLocalidad: true, fiscalEstado: true,
      fiscalNumregidtrib: true, fiscalNombre: true, fiscalApellidos: true, fiscalTelefono: true,
    },
  })

  if (!user) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })
  if (!user.fiscalCompleted || !user.fiscalRfc || !user.fiscalRazonSocial || !user.fiscalCodpos || !user.fiscalEmail || !user.fiscalRegimen || !user.fiscalPais) {
    throw createError({ statusCode: 422, message: 'El usuario no tiene datos fiscales completos' })
  }

  const payload: FacturaClientePayload = {
    rfc:              user.fiscalRfc,
    razons:           user.fiscalRazonSocial,
    codpos:           user.fiscalCodpos,
    email:            user.fiscalEmail,
    regimen:          user.fiscalRegimen,
    pais:             user.fiscalPais,
    usocfdi:          user.fiscalUsocfdi     ?? undefined,
    calle:            user.fiscalCalle        ?? undefined,
    numero_exterior:  user.fiscalNumExt       ?? undefined,
    numero_interior:  user.fiscalNumInt       ?? undefined,
    colonia:          user.fiscalColonia      ?? undefined,
    ciudad:           user.fiscalCiudad       ?? undefined,
    delegacion:       user.fiscalDelegacion   ?? undefined,
    localidad:        user.fiscalLocalidad    ?? undefined,
    estado:           user.fiscalEstado       ?? undefined,
    numregidtrib:     user.fiscalNumregidtrib ?? undefined,
    nombre:           user.fiscalNombre       ?? undefined,
    apellidos:        user.fiscalApellidos    ?? undefined,
    telefono:         user.fiscalTelefono     ?? undefined,
  }

  let facturaUid = user.facturaUid
  let cliente

  if (facturaUid) {
    // Ya existe en Factura.com → actualizar
    cliente = await actualizarCliente(facturaUid, payload)
  } else {
    // Verificar si ya existe por RFC (puede haberse creado manualmente)
    const existente = await obtenerCliente(user.fiscalRfc)
    if (existente?.UID) {
      facturaUid = existente.UID
      cliente    = await actualizarCliente(facturaUid, payload)
    } else {
      // Crear nuevo cliente
      cliente    = await crearCliente(payload)
      facturaUid = cliente.UID
    }
  }

  // Guardar el UID en nuestra BD
  await prisma.user.update({
    where: { id: userId },
    data:  { facturaUid },
  })

  return { cliente, facturaUid, action: user.facturaUid ? 'updated' : 'created' }
})
