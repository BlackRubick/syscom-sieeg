import { d as defineEventHandler, r as requireSession, a as readBody } from '../../nitro/nitro.mjs';
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

const index_patch = defineEventHandler(async (event) => {
  const session = requireSession(event);
  const { items } = await readBody(event);
  await prisma.user.update({
    where: { id: session.userId },
    data: { cartItems: items != null ? items : [] }
  });
  return { ok: true };
});

export { index_patch as default };
//# sourceMappingURL=index.patch.mjs.map
