import prisma from '~/server/utils/prisma'
import { mesEnCurso } from '~/utils/integrador'

// Pedidos que cuentan como compra: aprobados en adelante (no pendientes, rechazados ni cancelados)
const SURTIDOS = ['approved', 'processing', 'shipped', 'delivered'] as const

/** Lo que cada cliente compró en el mes (el actual o, con mes, otro) con IVA incluido y sin el cargo de envío. */
export async function comprasDelMes(userIds: string[], mes = mesEnCurso()): Promise<Map<string, number>> {
  const res = new Map<string, number>()
  if (!userIds.length) return res
  const { inicio, fin } = mes
  const pedidos = await prisma.order.findMany({
    where: { userId: { in: userIds }, status: { in: [...SURTIDOS] }, createdAt: { gte: inicio, lt: fin } },
    select: { userId: true, total: true, shippingFee: true },
  })
  for (const p of pedidos) res.set(p.userId, (res.get(p.userId) ?? 0) + p.total - p.shippingFee)
  return res
}
