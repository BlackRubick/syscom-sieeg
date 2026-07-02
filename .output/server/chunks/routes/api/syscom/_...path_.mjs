import { d as defineEventHandler, g as getRouterParam, c as createError, h as getMethod, f as getQuery, r as readBody, i as setResponseStatus } from '../../../nitro/nitro.mjs';
import { a as getSyscomToken } from '../../../_/syscom.mjs';
import { r as requireSession } from '../../../_/session.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'crypto';

const SAFE = /^[a-zA-Z0-9_\-]+$/;
const serverCache = /* @__PURE__ */ new Map();
function ttlFor(path) {
  if (path === "/categorias" || path === "/marcas" || path === "/tipocambio") return 30 * 6e4;
  if (/^\/productos\/\d+/.test(path)) return 5 * 6e4;
  return 2 * 6e4;
}
const ____path_ = defineEventHandler(async (event) => {
  var _a, _b;
  requireSession(event);
  const segments = ((_a = getRouterParam(event, "path")) != null ? _a : "").split("/").filter(Boolean);
  if (!segments.length || segments.length > 8 || !segments.every((s) => s.length > 0 && s.length < 120 && SAFE.test(s))) {
    throw createError({ statusCode: 400, message: "Ruta inv\xE1lida" });
  }
  const path = "/" + segments.join("/");
  const method = getMethod(event);
  const qs = getQuery(event);
  const url = new URL(`https://developers.syscom.mx/api/v1${path}`);
  Object.entries(qs).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const cacheKey = url.toString();
  if (method === "GET") {
    const hit = serverCache.get(cacheKey);
    if (hit && hit.exp > Date.now()) return hit.data;
  }
  const token = await getSyscomToken();
  let reqBody;
  if (method !== "GET" && method !== "HEAD") {
    const raw = await readBody(event).catch(() => null);
    if (raw != null) reqBody = JSON.stringify(raw);
  }
  const upstream = await fetch(cacheKey, {
    method,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: reqBody
  });
  const text = await upstream.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  setResponseStatus(event, upstream.status);
  if (!upstream.ok) {
    throw createError({ statusCode: upstream.status, data, message: (_b = data == null ? void 0 : data.message) != null ? _b : `SYSCOM ${upstream.status}` });
  }
  if (method === "GET") {
    if (serverCache.size > 600) {
      const now = Date.now();
      for (const [k, v] of serverCache) if (v.exp < now) serverCache.delete(k);
    }
    serverCache.set(cacheKey, { data, exp: Date.now() + ttlFor(path) });
  }
  return data;
});

export { ____path_ as default };
//# sourceMappingURL=_...path_.mjs.map
