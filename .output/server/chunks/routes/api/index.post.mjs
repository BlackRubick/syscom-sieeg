import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const session = requireSession(event);
  const body = await readBody(event);
  if (!((_a = body.items) == null ? void 0 : _a.length)) {
    throw createError({ statusCode: 400, message: "El carrito est\xE1 vac\xEDo" });
  }
  const order = await prisma.order.create({
    data: {
      userId: session.userId,
      items: body.items,
      total: body.total,
      priority: (_b = body.priority) != null ? _b : "normal",
      notes: (_c = body.notes) != null ? _c : null
    },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
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
