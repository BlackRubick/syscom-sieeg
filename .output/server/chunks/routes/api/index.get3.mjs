import { d as defineEventHandler, r as requireSession, h as getQuery } from '../../nitro/nitro.mjs';
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
  var _a, _b;
  const session = requireSession(event);
  const isManager = session.role === "admin" || session.role === "approver";
  const q = getQuery(event);
  const page = Math.max(1, Number((_a = q.page) != null ? _a : 1));
  const perPage = Math.min(100, Math.max(1, Number((_b = q.per_page) != null ? _b : 30)));
  const status = q.status ? String(q.status) : void 0;
  const search = q.search ? String(q.search) : void 0;
  const where = {
    ...isManager ? {} : { userId: session.userId },
    ...status ? { status } : {},
    ...search ? {
      OR: [
        { id: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
        { syscomFolio: { contains: search } }
      ]
    } : {}
  };
  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { user: { select: { id: true, name: true, email: true } } }
    }),
    prisma.order.count({ where })
  ]);
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
      cfdiUid: o.cfdiUid,
      auditLog: o.auditLog,
      paymentId: o.paymentId,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      paymentData: o.paymentData,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString()
    })),
    pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
  };
});

export { index_get as default };
//# sourceMappingURL=index.get3.mjs.map
