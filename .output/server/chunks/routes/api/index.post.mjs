import { d as defineEventHandler, r as requireSession, a as readBody, c as createError } from '../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const session = requireSession(event);
  const body = await readBody(event);
  if (!((_a = body.items) == null ? void 0 : _a.length)) {
    throw createError({ statusCode: 400, message: "El carrito est\xE1 vac\xEDo" });
  }
  for (const item of body.items) {
    if (!item.productId || !item.name) throw createError({ statusCode: 400, message: "\xCDtem inv\xE1lido en el carrito" });
    if (!item.quantity || item.quantity <= 0) throw createError({ statusCode: 400, message: `Cantidad inv\xE1lida para "${item.name}"` });
    if (item.price === void 0 || item.price < 0) throw createError({ statusCode: 400, message: `Precio inv\xE1lido para "${item.name}"` });
  }
  const serverTotal = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.round(serverTotal * 100) / 100;
  const order = await prisma.order.create({
    data: {
      userId: session.userId,
      items: body.items,
      total,
      priority: (_b = body.priority) != null ? _b : "normal",
      notes: (_c = body.notes) != null ? _c : null
    },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
  const admins = await prisma.user.findMany({
    where: { role: "admin", status: "active" },
    select: { id: true }
  });
  if (admins.length) {
    await prisma.notification.createMany({
      data: admins.map((a) => ({
        userId: a.id,
        type: "order",
        title: "Nuevo pedido recibido",
        message: `${order.user.name} realiz\xF3 un pedido por ${total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} (${body.items.length} art.)`,
        orderId: order.id
      }))
    });
  }
  return {
    order: {
      id: order.id,
      userId: order.userId,
      userName: order.user.name,
      userEmail: order.user.email,
      status: order.status,
      items: order.items,
      total: order.total,
      priority: order.priority,
      notes: order.notes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }
  };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
