import { d as defineEventHandler, r as requireSession, c as createError, a as readBody } from '../../nitro/nitro.mjs';
import bcrypt from 'bcryptjs';
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
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const body = await readBody(event);
  const { name, email, password, role, status } = body;
  if (!name || !email || !password || !role || !status) {
    throw createError({ statusCode: 400, message: "Faltan campos requeridos" });
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, message: "La contrase\xF1a debe tener al menos 8 caracteres" });
  }
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) throw createError({ statusCode: 409, message: "Ya existe un usuario con ese correo" });
  const avatar = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hash,
      role,
      status,
      createdAt: today,
      avatar
    },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLogin: true, avatar: true }
  });
  return { user };
});

export { index_post as default };
//# sourceMappingURL=index.post2.mjs.map
