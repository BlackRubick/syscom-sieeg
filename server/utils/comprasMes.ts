import prisma from '~/server/utils/prisma'
import { mesEnCurso } from '~/utils/integrador'

// Pedidos que cuentan como compra: aprobados en adelante (no pendientes, rechazados ni cancelados)
const SURTIDOS = ['approved', 'processing', 'shipped', 'delivered'] as const

/** Lo que cada cliente lleva comprado en el mes en curso (IVA incluido, sin el cargo de envío). */
export async function comprasDelMes(userIds: string[]): Promise<Map<string, number>> {
  const res = new Map<string, number>()
  if (!userIds.length) return res
  const { inicio, fin } = mesEnCurso()
  const pedidos = await prisma.order.findMany({
    where: { userId: { in: userIds }, status: { in: [...SURTIDOS] }, createdAt: { gte: inicio, lt: fin } },
    select: { userId: true, total: true, shippingFee: true },
  })
  for (const p of pedidos) res.set(p.userId, (res.get(p.userId) ?? 0) + p.total - p.shippingFee)
  return res
}
