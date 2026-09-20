import { d as defineEventHandler, r as requireSession } from '../../../nitro/nitro.mjs';
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

const readAll_post = defineEventHandler(async (event) => {
  const session = requireSession(event);
  await prisma.notification.updateMany({
    where: { userId: session.userId, read: false },
    data: { read: true }
  });
  return { ok: true };
});

export { readAll_post as default };
//# sourceMappingURL=read-all.post.mjs.map
