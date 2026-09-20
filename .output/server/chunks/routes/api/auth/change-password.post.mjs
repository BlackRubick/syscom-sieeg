import { d as defineEventHandler, r as requireSession, a as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';
import { p as prisma } from '../../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const changePassword_post = defineEventHandler(async (event) => {
  const session = requireSession(event);
  const body = await readBody(event);
  const currentPw = body.currentPassword;
  if (!currentPw || !body.newPassword) {
    throw createError({ statusCode: 400, message: "Contrase\xF1a actual y nueva son requeridas" });
  }
  if (body.newPassword.length < 8) {
    throw createError({ statusCode: 400, message: "La nueva contrase\xF1a debe tener al menos 8 caracteres" });
  }
  if (currentPw === body.newPassword) {
    throw createError({ statusCode: 400, message: "La nueva contrase\xF1a debe ser diferente a la actual" });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { password: true }
  });
  if (!user) throw createError({ statusCode: 404, message: "Usuario no encontrado" });
  let valid = false;
  if (user.password.startsWith("$2")) {
    valid = await bcrypt.compare(currentPw, user.password);
  } else {
    valid = createHash("sha256").update(currentPw).digest("hex") === user.password;
  }
  if (!valid) throw createError({ statusCode: 401, message: "La contrase\xF1a actual es incorrecta" });
  const newHash = await bcrypt.hash(body.newPassword, 12);
  await prisma.user.update({ where: { id: session.userId }, data: { password: newHash } });
  return { ok: true };
});

export { changePassword_post as default };
//# sourceMappingURL=change-password.post.mjs.map
