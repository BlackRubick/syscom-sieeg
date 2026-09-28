import prisma from '~/server/utils/prisma'
import { ENVIO_BASICO, type ShippingConfig } from '~/utils/orderTotals'

export async function getShippingConfig(): Promise<ShippingConfig> {
  const c = await prisma.siteConfig.findUnique({ where: { id: 1 }, select: { freeShippingMin: true, shippingFee: true, basicShippingFee: true } })
  return { freeShippingMin: c?.freeShippingMin ?? 1000, shippingFee: c?.shippingFee ?? 200, basicShippingFee: c?.basicShippingFee ?? ENVIO_BASICO }
}
