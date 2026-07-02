import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { crearCliente, actualizarCliente, obtenerCliente } from '~/server/utils/factura'
import type { FacturaClientePayload } from '~/server/utils/factura'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)

  const body = await readBody<Record<string, string>>(event)

  const { rfc, razonSocial, codpos, email, regimen, pais } = body
  if (!rfc || !razonSocial || !codpos || !email || !regimen || !pais) {
    throw createError({ statusCode: 400, message: 'Faltan campos requeridos: RFC, Razón Social, Código Postal, Email, Régimen Fiscal y País' })
  }

  // #15 — Validar formato RFC SAT
  const rfcClean = rfc.trim().toUpperCase()
  const RFC_RE   = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/
  if (!RFC_RE.test(rfcClean)) {
    throw createError({ statusCode: 400, message: `RFC inválido: "${rfcClean}". Debe tener el formato SAT (ej: XAXX010101000 o GOME820101H25).` })
  }

  // Guardar datos fiscales en nuestra BD
  const user = await prisma.user.update({
    where: { id: session.userId },
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

  // Sincronizar con Factura.com (sin bloquear si falla)
  let facturaUid: string | null = user.facturaUid
  let facturaError: string | undefined

  try {
    const payload: FacturaClientePayload = {
      rfc:             rfc.toUpperCase(),
      razons:          razonSocial,
      codpos,
      email:           email.toLowerCase(),
      regimen,
      pais:            pais.toUpperCase(),
      usocfdi:         body.usocfdi        || undefined,
      calle:           body.calle          || undefined,
      numero_exterior: body.numeroExterior || undefined,
      numero_interior: body.numeroInterior || undefined,
      colonia:         body.colonia        || undefined,
      ciudad:          body.ciudad         || undefined,
      delegacion:      body.delegacion     || undefined,
      localidad:       body.localidad      || undefined,
      estado:          body.estado         || undefined,
      numregidtrib:    body.numregidtrib   || undefined,
      nombre:          body.nombre         || undefined,
      apellidos:       body.apellidos      || undefined,
      telefono:        body.telefono       || undefined,
    }

    let cliente
    if (facturaUid) {
      cliente = await actualizarCliente(facturaUid, payload)
    } else {
      const existente = await obtenerCliente(rfc.toUpperCase())
      if (existente?.UID) {
        facturaUid = existente.UID
        cliente    = await actualizarCliente(facturaUid, payload)
      } else {
        cliente    = await crearCliente(payload)
        facturaUid = cliente.UID
      }
    }

    // Persistir el UID si cambió
    if (facturaUid !== user.facturaUid) {
      await prisma.user.update({
        where: { id: session.userId },
        data:  { facturaUid },
      })
    }
  } catch (e) {
    facturaError = e instanceof Error ? e.message : 'Error al sincronizar con Factura.com'
  }

  return { user: { ...user, facturaUid }, facturaError }
})
