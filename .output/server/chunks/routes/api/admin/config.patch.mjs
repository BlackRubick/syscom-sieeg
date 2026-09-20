import { d as defineEventHandler, r as requireSession, c as createError, a as readBody } from '../../../nitro/nitro.mjs';
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

const config_patch = defineEventHandler(async (event) => {
  const session = requireSession(event);
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true } });
  if ((user == null ? void 0 : user.role) !== "admin") throw createError({ statusCode: 403, message: "Forbidden" });
  const body = await readBody(event);
  const markupPct = Math.max(0, Math.min(500, parseFloat(body.markupPct) || 0));
  return prisma.siteConfig.upsert({
    where: { id: 1 },
    create: { id: 1, markupPct },
    update: { markupPct }
  });
});

export { config_patch as default };
//# sourceMappingURL=config.patch.mjs.map
