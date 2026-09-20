import { d as defineEventHandler, r as requireSession, i as getRouterParam, c as createError, a as readBody } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import { a as approveOrder } from '../../../_/approveOrder.mjs';
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
import '../../../_/syscom.mjs';

const ALLOWED = ["approved", "rejected", "cancelled", "processing", "shipped", "delivered"];
const _id__patch = defineEventHandler(async (event) => {
  var _a;
  const session = requireSession(event);
  const isManager = session.role === "admin" || session.role === "approver";
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "ID requerido" });
  const body = await readBody(event);
  if (!ALLOWED.includes(body.status)) {
    throw createError({ statusCode: 400, message: "Estado inv\xE1lido" });
  }
  const existing = await prisma.order.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
  if (!existing) throw createError({ statusCode: 404, message: "Orden no encontrada" });
  if (!isManager) {
    if (existing.userId !== session.userId) {
      throw createError({ statusCode: 403, message: "Sin autorizaci\xF3n" });
    }
    if (body.status !== "cancelled") {
      throw createError({ statusCode: 403, message: "Solo puedes cancelar tus propios pedidos" });
    }
    if (!["pending", "approved"].includes(existing.status)) {
      throw createError({ statusCode: 400, message: `No se puede cancelar un pedido en estado "${existing.status}"` });
    }
  }
  let syscomError;
  if (body.status === "approved") {
    const result = await approveOrder(existing.id, session.userId, session.name);
    syscomError = result.syscomError;
    const updated2 = result.order;
    return {
      order: {
        id: updated2.id,
        userId: updated2.userId,
        userName: updated2.user.name,
        userEmail: updated2.user.email,
        status: updated2.status,
        items: updated2.items,
        total: updated2.total,
        priority: updated2.priority,
        notes: updated2.notes,
        syscomFolio: updated2.syscomFolio,
        cfdiUid: updated2.cfdiUid,
        auditLog: updated2.auditLog,
        paymentId: updated2.paymentId,
        paymentStatus: updated2.paymentStatus,
        paymentMethod: updated2.paymentMethod,
        paymentData: updated2.paymentData,
        createdAt: updated2.createdAt.toISOString(),
        updatedAt: updated2.updatedAt.toISOString()
      },
      syscomError
    };
  }
  const auditEntry = {
    status: body.status,
    by: session.userId,
    byName: session.name,
    at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const newLog = [...(_a = existing.auditLog) != null ? _a : [], auditEntry];
  const updated = await prisma.order.update({
    where: { id },
    data: { status: body.status, auditLog: newLog },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
  if (body.status === "rejected" || body.status === "cancelled") {
    const titles = {
      rejected: "\u274C Pedido rechazado",
      cancelled: "\u{1F6AB} Pedido cancelado"
    };
    const messages = {
      rejected: `Tu pedido por ${updated.total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} fue rechazado.`,
      cancelled: `Tu pedido por ${updated.total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} fue cancelado.`
    };
    await prisma.notification.create({
      data: {
        userId: existing.userId,
        type: "order",
        title: titles[body.status],
        message: messages[body.status],
        orderId: id
      }
    });
  }
  return {
    order: {
      id: updated.id,
      userId: updated.userId,
      userName: updated.user.name,
      userEmail: updated.user.email,
      status: updated.status,
      items: updated.items,
      total: updated.total,
      priority: updated.priority,
      notes: updated.notes,
      syscomFolio: updated.syscomFolio,
      cfdiUid: updated.cfdiUid,
      auditLog: updated.auditLog,
      paymentId: updated.paymentId,
      paymentStatus: updated.paymentStatus,
      paymentMethod: updated.paymentMethod,
      paymentData: updated.paymentData,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString()
    },
    syscomError
  };
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
