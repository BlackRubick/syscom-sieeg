import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import prisma from '~/server/utils/prisma'
import { createUserWithClientNumber } from '~/server/utils/clientNumber'

/* Cliente "Mostrador · Público en general": las cotizaciones y pedidos se levantan a su nombre
   y después se asignan al cliente real. No puede iniciar sesión (contraseña aleatoria que nadie conoce). */
export const MOSTRADOR_EMAIL = 'mostrador@publico-en-general.sieeg'

let cacheId: string | null = null

export async function getMostradorId(): Promise<string> {
  if (cacheId) return cacheId
  const existente = await prisma.user.findUnique({ where: { email: MOSTRADOR_EMAIL }, select: { id: true } })
  if (existente) return (cacheId = existente.id)
  try {
    const user = await createUserWithClientNumber({
      name:              'Mostrador · Público en general',
      email:             MOSTRADOR_EMAIL,
      password:          await bcrypt.hash(randomBytes(24).toString('hex'), 12),
      role:              'buyer',
      status:            'active',
      createdAt:         new Date().toISOString().split('T')[0],
      avatar:            'PG',
      // RFC genérico del SAT para ventas al público en general
      fiscalRfc:         'XAXX010101000',
      fiscalRazonSocial: 'PUBLICO EN GENERAL',
      fiscalRegimen:     '616',
      fiscalUsocfdi:     'S01',
      fiscalPais:        'MEX',
    }, { id: true })
    return (cacheId = user.id)
  } catch {
    // Otra petición lo creó al mismo tiempo
    const u = await prisma.user.findUniqueOrThrow({ where: { email: MOSTRADOR_EMAIL }, select: { id: true } })
    return (cacheId = u.id)
  }
}

export const esMostrador = (email?: string | null) => email === MOSTRADOR_EMAIL
