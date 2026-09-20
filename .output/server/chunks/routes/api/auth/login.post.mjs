import { d as defineEventHandler, g as getHeader, a as readBody, c as createError, b as createToken, s as setCookie, C as COOKIE_MAX_AGE, S as SESSION_COOKIE } from '../../../nitro/nitro.mjs';
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

const rateBuckets = /* @__PURE__ */ new Map();
const WINDOW_MS = 15 * 60 * 1e3;
const MAX_TRIES = 10;
function checkRateLimit(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  bucket.count++;
  if (bucket.count > MAX_TRIES) {
    const waitMin = Math.ceil((bucket.resetAt - now) / 6e4);
    throw createError({ statusCode: 429, message: `Demasiados intentos. Espera ${waitMin} minuto${waitMin !== 1 ? "s" : ""} e intenta de nuevo.` });
  }
}
function clearRateLimit(ip) {
  rateBuckets.delete(ip);
}
const login_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const ip = (_d = (_c = (_b = (_a = getHeader(event, "x-forwarded-for")) == null ? void 0 : _a.split(",")[0]) == null ? void 0 : _b.trim()) != null ? _c : getHeader(event, "x-real-ip")) != null ? _d : "unknown";
  checkRateLimit(ip);
  const body = await readBody(event);
  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, message: "Correo y contrase\xF1a son requeridos" });
  }
  const user = await prisma.user.findFirst({
    where: { email: body.email.toLowerCase() },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      lastLogin: true,
      avatar: true,
      fiscalCompleted: true,
      password: true
    }
  });
  if (!user) {
    throw createError({ statusCode: 401, message: "Correo o contrase\xF1a incorrectos" });
  }
  if (user.status === "inactive") {
    throw createError({ statusCode: 403, message: "Esta cuenta est\xE1 desactivada. Contacta al administrador." });
  }
  if (user.status === "pending") {
    throw createError({ statusCode: 403, message: "Esta cuenta est\xE1 pendiente de activaci\xF3n." });
  }
  let passwordValid = false;
  let needsRehash = false;
  if (user.password.startsWith("$2")) {
    passwordValid = await bcrypt.compare(body.password, user.password);
  } else {
    const sha = createHash("sha256").update(body.password).digest("hex");
    passwordValid = sha === user.password;
    needsRehash = passwordValid;
  }
  if (!passwordValid) {
    throw createError({ statusCode: 401, message: "Correo o contrase\xF1a incorrectos" });
  }
  clearRateLimit(ip);
  if (needsRehash) {
    const newHash = await bcrypt.hash(body.password, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: newHash } });
  }
  const token = createToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email
  });
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/"
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] }
  });
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
