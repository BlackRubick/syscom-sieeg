const MEM = /* @__PURE__ */ new Map();
function get(key) {
  const e = MEM.get(key);
  return e && e.exp > Date.now() ? e.data : null;
}
function set(key, data, ttl) {
  MEM.set(key, { data, exp: Date.now() + ttl });
}
function parsePrice(v) {
  return v ? Math.max(0, parseFloat(v) || 0) : 0;
}
function adaptProduct(p) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const especial = parsePrice((_a = p.precios) == null ? void 0 : _a.precio_especial);
  const lista = parsePrice((_b = p.precios) == null ? void 0 : _b.precio_lista);
  const price = especial > 0 ? especial : lista;
  let discount;
  if (lista > especial && especial > 0) {
    const pct = Math.round((1 - especial / lista) * 100);
    if (pct > 0 && pct < 90) discount = pct;
  }
  const cats = (_d = (_c = p["categor\xEDas"]) != null ? _c : p.categorias) != null ? _d : [];
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
async function fetchProductos(opts) {
  var _a, _b, _c, _d;
  const empty = (error) => ({ products: [], cantidad: 0, pagina: 1, paginas: 1, error });
  if (!opts.busqueda && !opts.categoria && !opts.marca) return empty();
  const params = new URLSearchParams();
  if (opts.busqueda) params.set("busqueda", opts.busqueda.trim().split(/\s+/).join("+"));
  if (opts.categoria) params.set("categoria", opts.categoria);
  if (opts.marca) params.set("marca", opts.marca);
  if (opts.pagina && opts.pagina > 1) params.set("pagina", String(opts.pagina));
  if (opts.orden && opts.orden !== "relevancia") params.set("orden", opts.orden);
  const url = `/api/syscom/productos?${params}`;
  const cached = get(url);
  if (cached) return cached;
  try {
    const data = await $fetch(url);
    const result = {
      products: ((_a = data.productos) != null ? _a : []).map(adaptProduct),
      cantidad: (_b = data.cantidad) != null ? _b : 0,
      pagina: (_c = data.pagina) != null ? _c : 1,
      paginas: (_d = data.paginas) != null ? _d : 1
    };
    set(url, result, 5 * 6e4);
    return result;
  } catch (e) {
    return empty(e instanceof Error ? e.message : "Error de conexi\xF3n");
  }
}
function parseTotal(t) {
  if (t === void 0 || t === null) return 0;
  return parseFloat(String(t).replace(/,/g, "")) || 0;
}
function fmtCompact(n) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}
function fmtDate(s) {
  if (!s) return "\u2014";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}
function facturaStatusStyle(estatus) {
  const s = (estatus != null ? estatus : "").toLowerCase();
  if (s.includes("cancel")) return { color: "#fb7185", dot: "#f43f5e", bg: "rgba(244,63,94,0.12)", label: estatus != null ? estatus : "Cancelada" };
  if (s.includes("entrega") || s.includes("recib")) return { color: "#4ade80", dot: "#22c55e", bg: "rgba(34,197,94,0.12)", label: estatus != null ? estatus : "Entregada" };
  if (s.includes("enviad") || s.includes("transit")) return { color: "#22d3ee", dot: "#06b6d4", bg: "rgba(6,182,212,0.12)", label: estatus != null ? estatus : "Enviada" };
  if (s.includes("aprob")) return { color: "#34d399", dot: "#10b981", bg: "rgba(16,185,129,0.12)", label: estatus != null ? estatus : "Aprobada" };
  return { color: "#38bdf8", dot: "#0ea5e9", bg: "rgba(14,165,233,0.12)", label: estatus != null ? estatus : "En proceso" };
}

export { adaptProduct as a, facturaStatusStyle as b, fmtCompact as c, fmtDate as d, fetchProductos as f, parseTotal as p };
//# sourceMappingURL=useSyscom-Bu-iKqE2.mjs.map
