import { d as defineEventHandler, r as requireSession } from '../../nitro/nitro.mjs';
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
  var _a;
  const session = requireSession(event);
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { cartItems: true }
  });
  const raw = (_a = user == null ? void 0 : user.cartItems) != null ? _a : [];
  return { items: JSON.parse(JSON.stringify(raw)) };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
