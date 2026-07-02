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
  requireSession(event);
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLogin: true, avatar: true }
  });
  return { users };
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
