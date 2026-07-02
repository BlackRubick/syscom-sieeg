import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import { r as requireSession } from '../../../_/session.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'crypto';
import '@prisma/client';

const orders_get = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          facturaUid: true,
          fiscalCompleted: true,
          fiscalRfc: true,
          fiscalRazonSocial: true,
          fiscalUsocfdi: true,
          fiscalRegimen: true
        }
      }
    }
  });
  return {
    orders: orders.map((o) => ({
      id: o.id,
      userId: o.userId,
      userName: o.user.name,
      userEmail: o.user.email,
      userFacturaUid: o.user.facturaUid,
      userFiscalCompleted: o.user.fiscalCompleted,
      userFiscalRfc: o.user.fiscalRfc,
      userFiscalRazonSocial: o.user.fiscalRazonSocial,
      userFiscalUsocfdi: o.user.fiscalUsocfdi,
      userFiscalRegimen: o.user.fiscalRegimen,
      status: o.status,
      items: o.items,
      total: o.total,
      priority: o.priority,
      notes: o.notes,
      syscomFolio: o.syscomFolio,
      cfdiUid: o.cfdiUid,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString()
    }))
  };
});

export { orders_get as default };
//# sourceMappingURL=orders.get.mjs.map
