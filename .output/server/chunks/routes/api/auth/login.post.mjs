import { d as defineEventHandler, r as readBody, c as createError, s as setCookie } from '../../../nitro/nitro.mjs';
import { createHash } from 'crypto';
import { p as prisma } from '../../../_/prisma.mjs';
import { c as createToken, S as SESSION_COOKIE } from '../../../_/session.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, message: "Correo y contrase\xF1a son requeridos" });
  }
  const hash = createHash("sha256").update(body.password).digest("hex");
  const user = await prisma.user.findFirst({
    where: { email: body.email.toLowerCase(), password: hash },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLogin: true, avatar: true, fiscalCompleted: true }
  });
  if (!user) {
    throw createError({ statusCode: 401, message: "Correo o contrase\xF1a incorrectos" });
  }
  const token = createToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email
  });
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 8 * 60 * 60,
    path: "/"
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] }
  });
  return { user };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
