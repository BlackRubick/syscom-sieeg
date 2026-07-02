import { d as defineEventHandler, c as createError, r as readBody } from '../../../../nitro/nitro.mjs';
import { r as requireSession } from '../../../../_/session.mjs';
import { p as prisma } from '../../../../_/prisma.mjs';
import { b as buildCfdiConcepto, c as crearCFDI, o as obtenerCliente, d as crearCliente } from '../../../../_/factura.mjs';
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

const RFC_PUBLICO = "XAXX010101000";
async function getOrCreatePublicoUid() {
  var _a, _b;
  const existente = await obtenerCliente(RFC_PUBLICO);
  if (existente == null ? void 0 : existente.UID) return existente.UID;
  const nuevo = await crearCliente({
    rfc: RFC_PUBLICO,
    razons: "PUBLICO EN GENERAL",
    codpos: "00000",
    email: (_b = (_a = process.env.FACTURA_ADMIN_EMAIL) != null ? _a : process.env.NUXT_ADMIN_EMAIL) != null ? _b : "admin@empresa.com",
    regimen: "616",
    pais: "MEX"
  });
  return nuevo.UID;
}
const global_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const body = await readBody(event);
  const { periodicidad, meses, a\u00F1o, formaPago, metodoPago, usoCfdi } = body;
  if (!periodicidad) throw createError({ statusCode: 400, message: "Periodicidad requerida" });
  if (!meses) throw createError({ statusCode: 400, message: "Mes requerido" });
  if (!a\u00F1o) throw createError({ statusCode: 400, message: "A\xF1o requerido" });
  if (!formaPago) throw createError({ statusCode: 400, message: "Forma de pago requerida" });
  if (!metodoPago) throw createError({ statusCode: 400, message: "M\xE9todo de pago requerido" });
  if (!usoCfdi) throw createError({ statusCode: 400, message: "Uso de CFDI requerido" });
  const serieId = Number(process.env.FACTURA_SERIE_ID);
  if (!serieId) throw createError({ statusCode: 500, message: "FACTURA_SERIE_ID no configurado en .env" });
  const where = {
    status: { in: ["approved", "processing", "shipped", "delivered"] },
    cfdiUid: null,
    ...((_a = body.orderIds) == null ? void 0 : _a.length) ? { id: { in: body.orderIds } } : {}
  };
  const orders = await prisma.order.findMany({ where });
  if (!orders.length) {
    throw createError({ statusCode: 400, message: "No hay pedidos aprobados pendientes de facturar" });
  }
  const conceptos = [];
  for (const order of orders) {
    const items = order.items;
    for (const item of items) {
      conceptos.push({
        descripcion: item.sku ? `${item.name} (${item.sku})` : item.name,
        claveProdServ: (_b = item.satKey) != null ? _b : "43211500",
        claveUnidad: "H87",
        unidad: "Pieza",
        cantidad: item.quantity,
        valorUnitario: item.price
      });
    }
  }
  const receptorUid = await getOrCreatePublicoUid();
  const payload = {
    Receptor: { UID: receptorUid },
    TipoDocumento: "factura",
    Conceptos: conceptos.map(buildCfdiConcepto),
    UsoCFDI: usoCfdi,
    Serie: serieId,
    FormaPago: formaPago,
    MetodoPago: metodoPago,
    Moneda: (_c = body.moneda) != null ? _c : "MXN",
    EnviarCorreo: false,
    InformacionGlobal: {
      Periodicidad: periodicidad,
      Meses: meses,
      A\u00F1o: a\u00F1o
    }
  };
  const result = await crearCFDI(payload);
  await prisma.order.updateMany({
    where: { id: { in: orders.map((o) => o.id) } },
    data: { cfdiUid: result.uid }
  });
  return { ...result, ordersIncluded: orders.length };
});

export { global_post as default };
//# sourceMappingURL=global.post.mjs.map
