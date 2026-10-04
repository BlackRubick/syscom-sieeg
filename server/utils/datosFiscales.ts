import prisma from '~/server/utils/prisma'
import { crearCliente, actualizarCliente, obtenerCliente } from '~/server/utils/factura'
import type { FacturaClientePayload } from '~/server/utils/factura'

/* Datos fiscales: una sola validación y un solo guardado para el propio cliente y para el personal
   (antes el personal podía guardar un RFC inválido y no se sincronizaba con Factura.com). */

const RFC_RE   = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const txt = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? v.trim().replace(/\s+/g, ' ').slice(0, max) : null)

export function validarDatosFiscales(body: Record<string, unknown>) {
  const rfc         = (txt(body.rfc, 13) ?? '').toUpperCase()
  const razonSocial = txt(body.razonSocial, 300)
  const codpos      = txt(body.codpos, 5)
  const email       = (txt(body.email, 160) ?? '').toLowerCase()
  const regimen     = txt(body.regimen, 3)
  const pais        = (txt(body.pais, 3) ?? '').toUpperCase()
  if (!rfc || !razonSocial || !codpos || !email || !regimen || !pais) {
    throw createError({ statusCode: 400, message: 'Faltan campos requeridos: RFC, Razón Social, Código Postal, Email, Régimen Fiscal y País' })
  }
  if (!RFC_RE.test(rfc)) throw createError({ statusCode: 400, message: `RFC inválido: "${rfc}". Debe tener el formato del SAT (ej. XAXX010101000 o GOME820101H25).` })
  if (pais === 'MEX' && !/^\d{5}$/.test(codpos)) throw createError({ statusCode: 400, message: 'El código postal debe tener 5 dígitos' })
  if (!EMAIL_RE.test(email)) throw createError({ statusCode: 400, message: 'El correo de facturación no es válido' })
  const telefono = txt(body.telefono, 20)
  if (telefono && !/^[\d\s()+-]{7,20}$/.test(telefono)) throw createError({ statusCode: 400, message: 'El teléfono solo puede tener números' })

  return {
    fiscalCompleted:    true,
    fiscalRfc:          rfc,
    fiscalRazonSocial:  razonSocial,
    fiscalCodpos:       codpos,
    fiscalEmail:        email,
    fiscalUsocfdi:      txt(body.usocfdi, 4),
    fiscalRegimen:      regimen,
    fiscalPais:         pais,
    fiscalCalle:        txt(body.calle, 100),
    fiscalNumExt:       txt(body.numeroExterior, 20),
    fiscalNumInt:       txt(body.numeroInterior, 20),
    fiscalColonia:      txt(body.colonia, 100),
    fiscalCiudad:       txt(body.ciudad, 100),
    fiscalDelegacion:   txt(body.delegacion, 100),
    fiscalLocalidad:    txt(body.localidad, 100),
    fiscalEstado:       txt(body.estado, 60),
    fiscalNumregidtrib: txt(body.numregidtrib, 40),
    fiscalNombre:       txt(body.nombre, 100),
    fiscalApellidos:    txt(body.apellidos, 100),
    fiscalTelefono:     telefono,
  }
}

export const FISCAL_SELECT = {
  id: true, name: true, email: true, role: true, status: true, createdAt: true,
  lastLogin: true, avatar: true, facturaUid: true,
  fiscalCompleted: true, fiscalRfc: true, fiscalRazonSocial: true, fiscalCodpos: true,
  fiscalEmail: true, fiscalUsocfdi: true, fiscalRegimen: true, fiscalPais: true,
  fiscalCalle: true, fiscalNumExt: true, fiscalNumInt: true, fiscalColonia: true,
  fiscalCiudad: true, fiscalDelegacion: true, fiscalLocalidad: true, fiscalEstado: true,
  fiscalNumregidtrib: true, fiscalNombre: true, fiscalApellidos: true, fiscalTelefono: true,
} as const

/** Guarda los datos y los sincroniza con Factura.com (si Factura.com falla, se guardan igual y se avisa). */
export async function guardarDatosFiscales(userId: string, body: Record<string, unknown>) {
  const datos = validarDatosFiscales(body)
  const user  = await prisma.user.update({ where: { id: userId }, data: datos, select: FISCAL_SELECT })

  let facturaUid: string | null = user.facturaUid
  let facturaError: string | undefined
  try {
    const payload: FacturaClientePayload = {
      rfc: datos.fiscalRfc, razons: datos.fiscalRazonSocial!, codpos: datos.fiscalCodpos!, email: datos.fiscalEmail,
      regimen: datos.fiscalRegimen!, pais: datos.fiscalPais,
      usocfdi:         datos.fiscalUsocfdi      ?? undefined,
      calle:           datos.fiscalCalle        ?? undefined,
      numero_exterior: datos.fiscalNumExt       ?? undefined,
      numero_interior: datos.fiscalNumInt       ?? undefined,
      colonia:         datos.fiscalColonia      ?? undefined,
      ciudad:          datos.fiscalCiudad       ?? undefined,
      delegacion:      datos.fiscalDelegacion   ?? undefined,
      localidad:       datos.fiscalLocalidad    ?? undefined,
      estado:          datos.fiscalEstado       ?? undefined,
      numregidtrib:    datos.fiscalNumregidtrib ?? undefined,
      nombre:          datos.fiscalNombre       ?? undefined,
      apellidos:       datos.fiscalApellidos    ?? undefined,
      telefono:        datos.fiscalTelefono     ?? undefined,
    }
    if (facturaUid) {
      await actualizarCliente(facturaUid, payload)
    } else {
      const existente = await obtenerCliente(datos.fiscalRfc)
      if (existente?.UID) {
        facturaUid = existente.UID
        await actualizarCliente(facturaUid, payload)
      } else {
        facturaUid = (await crearCliente(payload)).UID
      }
    }
    if (facturaUid !== user.facturaUid) await prisma.user.update({ where: { id: userId }, data: { facturaUid } })
  } catch (e) {
    facturaError = e instanceof Error ? e.message : 'Error al sincronizar con Factura.com'
  }
  return { user: { ...user, facturaUid }, facturaError }
}
