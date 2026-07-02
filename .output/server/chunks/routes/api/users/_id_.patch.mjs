import { d as defineEventHandler, c as createError, g as getRouterParam, r as readBody } from '../../../nitro/nitro.mjs';
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

const _id__patch = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw createError({ statusCode: 404, message: "Usuario no encontrado" });
  if (body.email && typeof body.email === "string") {
    const dup = await prisma.user.findFirst({ where: { email: body.email.toLowerCase(), NOT: { id } } });
    if (dup) throw createError({ statusCode: 409, message: "Ya existe un usuario con ese correo" });
  }
  const data = {};
  if (body.name) data.name = body.name;
  if (body.email) data.email = body.email.toLowerCase();
  if (body.role) data.role = body.role;
  if (body.status) data.status = body.status;
  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLogin: true, avatar: true }
  });
  return { user };
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
