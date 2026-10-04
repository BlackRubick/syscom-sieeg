import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores' })

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    // Los más recientes; con más volumen conviene paginar
    take: 1000,
    include: {
      user: {
        select: {
          id: true, name: true, email: true, clientNumber: true,
          facturaUid:        true,
          fiscalCompleted:   true,
          fiscalRfc:         true,
          fiscalRazonSocial: true,
          fiscalUsocfdi:     true,
          fiscalRegimen:     true,
        },
      },
    },
  })

  return {
    orders: orders.map(o => ({
      id:                    o.id,
      userId:                o.userId,
      userName:              o.user.name,
      userEmail:             o.user.email,
      clientNumber:          o.user.clientNumber,
      userFacturaUid:        o.user.facturaUid,
      userFiscalCompleted:   o.user.fiscalCompleted,
      userFiscalRfc:         o.user.fiscalRfc,
      userFiscalRazonSocial: o.user.fiscalRazonSocial,
      userFiscalUsocfdi:     o.user.fiscalUsocfdi,
      userFiscalRegimen:     o.user.fiscalRegimen,
      status:                o.status,
      paymentStatus:         o.paymentStatus,
      items:                 o.items,
      total:                 o.total,
      shippingFee:           o.shippingFee,
      priority:              o.priority,
      notes:                 o.notes,
      syscomFolio:           o.syscomFolio,
      cfdiUid:               o.cfdiUid,
      createdAt:             o.createdAt.toISOString(),
      updatedAt:             o.updatedAt.toISOString(),
    })),
  }
})
