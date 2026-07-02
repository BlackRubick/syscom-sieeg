import { c as createError } from '../nitro/nitro.mjs';

let cache = null;
async function getSyscomToken() {
  var _a, _b;
  if (cache && cache.expiresAt > Date.now() + 6e4) return cache.token;
  const clientId = (_a = process.env.SYSCOM_CLIENT_ID) != null ? _a : "";
  const clientSecret = (_b = process.env.SYSCOM_CLIENT_SECRET) != null ? _b : "";
  const res = await fetch("https://developers.syscom.mx/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret
    })
  });
  if (!res.ok) throw createError({ statusCode: 502, message: "No se pudo autenticar con SYSCOM" });
  const data = await res.json();
  cache = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1e3 };
  return cache.token;
}
async function generateSyscomOrder(opts) {
  var _a, _b, _c, _d, _e;
  const token = await getSyscomToken();
  const url = new URL("https://developers.syscom.mx/api/v1/carrito/generar");
  url.searchParams.set("tipo_entrega", opts.tipo_entrega);
  url.searchParams.set("metodo_pago", opts.metodo_pago);
  url.searchParams.set("moneda", (_a = opts.moneda) != null ? _a : "mxn");
  url.searchParams.set("uso_cfdi", opts.uso_cfdi);
  url.searchParams.set("ordenar", String((_b = opts.ordenar) != null ? _b : false));
  url.searchParams.set("productos", JSON.stringify(opts.productos));
  url.searchParams.set("direccion", JSON.stringify(opts.direccion));
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
  });
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const msg = (_c = data == null ? void 0 : data.message) != null ? _c : `SYSCOM ${res.status}`;
    return { folio: null, data, error: msg };
  }
  const resumen = data == null ? void 0 : data.resumen;
  const folio = (_e = (_d = resumen == null ? void 0 : resumen.folio) != null ? _d : resumen == null ? void 0 : resumen.folio_pedido) != null ? _e : null;
  return { folio, data };
}

export { getSyscomToken as a, generateSyscomOrder as g };
//# sourceMappingURL=syscom.mjs.map
