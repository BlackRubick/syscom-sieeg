import { d as defineEventHandler, c as createError, g as getRouterParam } from '../../../nitro/nitro.mjs';
import { r as requireSession } from '../../../_/session.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores pueden eliminar usuarios" });
  const id = getRouterParam(event, "id");
  if (id === session.userId) {
    throw createError({ statusCode: 400, message: "No puedes eliminar tu propia cuenta" });
  }
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw createError({ statusCode: 404, message: "Usuario no encontrado" });
  await prisma.user.delete({ where: { id } });
  return { ok: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
