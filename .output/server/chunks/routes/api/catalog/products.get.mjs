import { d as defineEventHandler, r as requireSession, h as getQuery, g as getHeader } from '../../../nitro/nitro.mjs';
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

const syscomCache = /* @__PURE__ */ new Map();
const SYSCOM_TTL = 5 * 6e4;
function parsePrice(v) {
  return v ? Math.max(0, parseFloat(v) || 0) : 0;
}
function adaptWithDiscount(p, markupPct, discountPct) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const especial = parsePrice((_a = p.precios) == null ? void 0 : _a.precio_especial);
  const lista = parsePrice((_b = p.precios) == null ? void 0 : _b.precio_lista);
  const base = especial > 0 ? especial : lista;
  const markedUp = base * (1 + markupPct / 100);
  const price = Math.round(markedUp * (1 - discountPct / 100) * 100) / 100;
  const cats = (_d = (_c = p["categor\xEDas"]) != null ? _c : p.categorias) != null ? _d : [];
  const discount = discountPct > 0 ? discountPct : void 0;
  return {
    id: String(p.producto_id),
    name: (_e = p.titulo) != null ? _e : "",
    description: "",
    price,
    currency: "MXN",
    category: (_g = (_f = cats[0]) == null ? void 0 : _f.nombre) != null ? _g : "General",
    supplier: (_h = p.marca) != null ? _h : "",
    supplierId: (_j = (_i = p.marca) == null ? void 0 : _i.toLowerCase().replace(/\s+/g, "_")) != null ? _j : String(p.producto_id),
    sku: (_k = p.modelo) != null ? _k : "",
    stock: Number(p.total_existencia) || 0,
    unit: "pieza",
    images: p.img_portada ? [p.img_portada] : [],
    tags: [],
    rating: 0,
    reviewCount: 0,
    leadTime: 0,
    featured: false,
    discount,
    satKey: p.sat_key || void 0
  };
}
const products_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const session = requireSession(event);
  const [user, siteConfig] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId }, select: { discountPct: true } }),
    prisma.siteConfig.findUnique({ where: { id: 1 } })
  ]);
  const markupPct = (_a = siteConfig == null ? void 0 : siteConfig.markupPct) != null ? _a : 0;
  const discountPct = (_b = user == null ? void 0 : user.discountPct) != null ? _b : 0;
  const qs = getQuery(event);
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(qs)) {
    if (v != null) params.set(k, String(v));
  }
  if (!params.has("moneda")) params.set("moneda", "MXN");
  if (!params.has("por_pagina")) params.set("por_pagina", "50");
  const cacheKey = params.toString();
  const now = Date.now();
  const cached = syscomCache.get(cacheKey);
  let rawData;
  if (cached && cached.exp > now) {
    rawData = cached.data;
  } else {
    const cookie = (_c = getHeader(event, "cookie")) != null ? _c : "";
    rawData = await $fetch(`/api/syscom/productos?${params}`, {
      headers: { cookie }
    });
    syscomCache.set(cacheKey, { data: rawData, exp: now + SYSCOM_TTL });
  }
  return {
    products: ((_d = rawData.productos) != null ? _d : []).map((p) => adaptWithDiscount(p, markupPct, discountPct)),
    cantidad: (_e = rawData.cantidad) != null ? _e : 0,
    pagina: (_f = rawData.pagina) != null ? _f : 1,
    paginas: (_g = rawData.paginas) != null ? _g : 1
  };
});

export { products_get as default };
//# sourceMappingURL=products.get.mjs.map
