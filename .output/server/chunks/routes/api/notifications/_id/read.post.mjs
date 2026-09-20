import { d as defineEventHandler, r as requireSession, i as getRouterParam, c as createError } from '../../../../nitro/nitro.mjs';
import { p as prisma } from '../../../../_/prisma.mjs';
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

const read_post = defineEventHandler(async (event) => {
  const session = requireSession(event);
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "ID requerido" });
  await prisma.notification.updateMany({
    where: { id, userId: session.userId },
    data: { read: true }
  });
  return { ok: true };
});

export { read_post as default };
//# sourceMappingURL=read.post.mjs.map
