import prisma from '~/server/utils/prisma'
import { comprasDelMes } from '~/server/utils/comprasMes'
import { NIVELES_INTEGRADOR, MINIMO_MENSUAL, mesEnCurso, nivelAlSubir, nivelAlCerrarMes } from '~/utils/integrador'

const mxn = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

async function cambiarNivel(userId: string, nivel: number, title: string, message: string) {
  await prisma.user.update({ where: { id: userId }, data: { discountPct: nivel } })
  await prisma.notification.create({ data: { userId, type: 'alert', title, message } })
}

async function integradores(userId?: string) {
  return prisma.user.findMany({
    where: { role: 'buyer', status: { not: 'inactive' }, discountPct: { in: [...NIVELES_INTEGRADOR] }, ...(userId ? { id: userId } : {}) },
    select: { id: true, discountPct: true },
  })
}

/** Sube de nivel en el momento a quien ya compró este mes (sumando todos sus pedidos) el mínimo
    de un nivel más alto. Con userId revisa solo a ese cliente (al aprobarse su pedido). */
export async function subirNiveles(userId?: string): Promise<number> {
  const users   = await integradores(userId)
  const compras = await comprasDelMes(users.map(u => u.id))
  let cambios = 0
  for (const u of users) {
    const nuevo = nivelAlSubir(u.discountPct, compras.get(u.id) ?? 0)
    if (nuevo === u.discountPct) continue
    await cambiarNivel(u.id, nuevo, `¡Subiste a ${nuevo}% de descuento!`,
      `Tus compras de este mes llegaron a ${mxn(MINIMO_MENSUAL[nuevo]!)}: desde ahora tienes ${nuevo}% de descuento.`)
    cambios++
  }
  return cambios
}

/** Una vez por mes: quien no llegó a su mínimo del mes anterior baja un nivel (25 → 20 → 10). */
export async function cerrarMesAnterior(ahora = new Date()): Promise<number> {
  const anterior = mesEnCurso(ahora, -1)
  const cfg = await prisma.siteConfig.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } })
  if (cfg.integradorMesCerrado && cfg.integradorMesCerrado >= anterior.clave) return 0
  // Se marca primero: si algo falla a medias no se vuelve a bajar a nadie dos veces
  const marcado = await prisma.siteConfig.updateMany({
    where: { id: 1, integradorMesCerrado: cfg.integradorMesCerrado },
    data:  { integradorMesCerrado: anterior.clave },
  })
  if (!marcado.count) return 0
  // Primera vez (recién se activó la regla): se marca el mes sin bajar a nadie
  if (!cfg.integradorMesCerrado) return 0

  const users   = await integradores()
  const compras = await comprasDelMes(users.map(u => u.id), anterior)
  let cambios = 0
  for (const u of users) {
    const comprado = compras.get(u.id) ?? 0
    const nuevo = nivelAlCerrarMes(u.discountPct, comprado)
    if (nuevo === u.discountPct) continue
    await cambiarNivel(u.id, nuevo, `Tu descuento cambió a ${nuevo}%`,
      nuevo < u.discountPct
        ? `El mes pasado compraste ${mxn(comprado)} y el mínimo para conservar tu ${u.discountPct}% era ${mxn(MINIMO_MENSUAL[u.discountPct]!)}. Compra ${mxn(MINIMO_MENSUAL[u.discountPct]!)} en un mes y vuelves a subir.`
        : `Tus compras del mes pasado te dan ${nuevo}% de descuento.`)
    cambios++
  }
  console.log(`[integrador] mes ${anterior.clave} cerrado: ${cambios} cambios de nivel`)
  return cambios
}
