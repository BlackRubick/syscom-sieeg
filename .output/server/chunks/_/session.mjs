import { j as getCookie, c as createError } from '../nitro/nitro.mjs';
import { createHmac } from 'crypto';

const SESSION_COOKIE = "sieeg_sess";
const TTL_MS = 8 * 60 * 60 * 1e3;
function secret() {
  var _a;
  return (_a = process.env.SESSION_SECRET) != null ? _a : "dev-secret";
}
function sign(data) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}
function createToken(payload) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + TTL_MS })).toString("base64url");
  return `${body}.${sign(body)}`;
}
function verifyToken(token) {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (sign(body) !== sig) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    if (!p.exp || p.exp < Date.now()) return null;
    return p;
  } catch {
    return null;
  }
}
function getSession(event) {
  const token = getCookie(event, SESSION_COOKIE);
  if (!token) return null;
  return verifyToken(token);
}
function requireSession(event) {
  const session = getSession(event);
  if (!session) throw createError({ statusCode: 401, message: "No autorizado" });
  return session;
}

export { SESSION_COOKIE as S, createToken as c, getSession as g, requireSession as r };
//# sourceMappingURL=session.mjs.map
