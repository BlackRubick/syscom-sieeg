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
  const session = requireSession(event);
  const q = getQuery(event);
  const onlyUnread = q.unread === "true";
  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.userId,
      ...onlyUnread ? { read: false } : {}
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  const unreadCount = await prisma.notification.count({
    where: { userId: session.userId, read: false }
  });
  return { notifications, unreadCount };
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
