import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import { r as requireSession } from '../../_/session.mjs';
import { p as prisma } from '../../_/prisma.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const session = requireSession(event);
  const isManager = session.role === "admin" || session.role === "approver";
  const orders = await prisma.order.findMany({
    where: isManager ? {} : { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
  return {
    orders: orders.map((o) => ({
      id: o.id,
      userId: o.userId,
      userName: o.user.name,
      userEmail: o.user.email,
      status: o.status,
      items: o.items,
      total: o.total,
      priority: o.priority,
      notes: o.notes,
      syscomFolio: o.syscomFolio,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString()
    }))
  };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
