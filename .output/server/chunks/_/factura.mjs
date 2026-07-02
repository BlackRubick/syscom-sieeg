import { c as createError } from '../nitro/nitro.mjs';

const HOSTS = {
  sandbox: "https://sandbox.factura.com/api",
  production: "https://api.factura.com"
};
const F_PLUGIN = "9d4095c8f7ed5785cb14c0e3b033eeb8252416ed";
function getFacturaEnv() {
  var _a;
  const env = (_a = process.env.FACTURA_ENV) != null ? _a : "sandbox";
  return env === "production" ? "production" : "sandbox";
}
function getFacturaHost() {
  return HOSTS[getFacturaEnv()];
}
function getFacturaHeaders() {
  var _a, _b;
  const apiKey = (_a = process.env.FACTURA_API_KEY) != null ? _a : "";
  const secretKey = (_b = process.env.FACTURA_SECRET_KEY) != null ? _b : "";
  if (!apiKey || !secretKey) {
    throw createError({ statusCode: 500, message: "Credenciales de Factura.com no configuradas" });
  }
  return {
    "F-PLUGIN": F_PLUGIN,
    "F-Api-Key": apiKey,
    "F-Secret-Key": secretKey,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
}
async function facturaFetch(version, endpoint, options = {}) {
  var _a, _b, _c, _d;
  const host = getFacturaHost();
  const url = `${host}/${version}/${endpoint.replace(/^\//, "")}`;
  const method = (_a = options.method) != null ? _a : "GET";
  const headers = getFacturaHeaders();
  const res = await fetch(url, {
    method,
    headers,
    body: options.body != null ? JSON.stringify(options.body) : void 0
  });
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  const body = data;
  if (!res.ok) {
    const rawMsg = (_b = body == null ? void 0 : body.message) != null ? _b : `Factura.com error ${res.status}`;
    const msg = typeof rawMsg === "string" ? rawMsg : JSON.stringify(rawMsg);
    console.error("[Factura.com HTTP error]", res.status, url, JSON.stringify(body));
    throw createError({ statusCode: res.status, message: msg });
  }
  if ((body == null ? void 0 : body.status) === "error" || (body == null ? void 0 : body.response) === "error") {
    const rawMsg = (_d = (_c = body == null ? void 0 : body.message) != null ? _c : body == null ? void 0 : body.msg) != null ? _d : "Error en Factura.com";
    const msg = typeof rawMsg === "string" ? rawMsg : JSON.stringify(rawMsg);
    console.error("[Factura.com error]", url, JSON.stringify(body));
    throw createError({ statusCode: 422, message: msg });
  }
  return data;
}
async function listarClientes(opts = {}) {
  var _a;
  const params = new URLSearchParams();
  if (opts.razon_social) params.set("razon_social", opts.razon_social);
  if (opts.rfc) params.set("rfc", opts.rfc);
  if (opts.page) params.set("page", String(opts.page));
  if (opts.per_page) params.set("per_page", String(opts.per_page));
  const qs = params.toString();
  const res = await facturaFetch(
    "v1",
    `clients${qs ? `?${qs}` : ""}`
  );
  return { data: (_a = res.data) != null ? _a : [], pagination: res.pagination };
}
async function obtenerCliente(rfc) {
  var _a;
  try {
    const res = await facturaFetch("v1", `clients/${rfc}`);
    return (_a = res.Data) != null ? _a : null;
  } catch {
    return null;
  }
}
async function crearCliente(payload) {
  const res = await facturaFetch(
    "v1",
    "clients/create",
    { method: "POST", body: payload }
  );
  return res.Data;
}
async function actualizarCliente(uid, payload) {
  const res = await facturaFetch(
    "v1",
    `clients/${uid}/update`,
    { method: "POST", body: { UID: uid, ...payload } }
  );
  return res.Data;
}
async function eliminarCliente(uid) {
  return facturaFetch("v1", `clients/destroy/${uid}`, { method: "POST" });
}
function buildCfdiConcepto(item) {
  const base = parseFloat((item.cantidad * item.valorUnitario).toFixed(6));
  const iva = parseFloat((base * 0.16).toFixed(6));
  return {
    ClaveProdServ: item.claveProdServ,
    NoIdentificacion: item.noIdentificacion || void 0,
    Cantidad: item.cantidad.toFixed(6),
    ClaveUnidad: item.claveUnidad,
    Unidad: item.unidad,
    ValorUnitario: item.valorUnitario.toFixed(6),
    Descripcion: item.descripcion,
    ObjetoImp: "02",
    Impuestos: {
      Traslados: [{
        Base: base.toFixed(6),
        Impuesto: "002",
        TipoFactor: "Tasa",
        TasaOCuota: "0.160000",
        Importe: iva.toFixed(6)
      }],
      Retenidos: [],
      Locales: []
    }
  };
}
async function crearCFDI(payload) {
  return facturaFetch("v4", "cfdi40/create", { method: "POST", body: payload });
}
async function listarCFDIs(opts = {}) {
  const body = {};
  if (opts.month) body.month = opts.month;
  if (opts.year) body.year = opts.year;
  if (opts.rfc) body.rfc = opts.rfc;
  if (opts.page) body.page = opts.page;
  if (opts.per_page) body.per_page = opts.per_page;
  return facturaFetch("v4", "cfdi/list", { method: "POST", body });
}

export { getFacturaHeaders as a, buildCfdiConcepto as b, crearCFDI as c, crearCliente as d, eliminarCliente as e, listarClientes as f, getFacturaHost as g, actualizarCliente as h, listarCFDIs as l, obtenerCliente as o };
//# sourceMappingURL=factura.mjs.map
