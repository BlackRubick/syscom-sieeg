import prisma from '~/server/utils/prisma'
import type { ShippingConfig } from '~/utils/orderTotals'

export async function getShippingConfig(): Promise<ShippingConfig> {
  const c = await prisma.siteConfig.findUnique({ where: { id: 1 }, select: { freeShippingMin: true, shippingFee: true } })
  return { freeShippingMin: c?.freeShippingMin ?? 1000, shippingFee: c?.shippingFee ?? 200 }
}
