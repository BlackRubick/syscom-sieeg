import { d as defineEventHandler, c as createError, r as readBody } from '../../../../nitro/nitro.mjs';
import { r as requireSession } from '../../../../_/session.mjs';
import { p as prisma } from '../../../../_/prisma.mjs';
import { b as buildCfdiConcepto, c as crearCFDI } from '../../../../_/factura.mjs';
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

const create_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const body = await readBody(event);
  const { userId, conceptos, formaPago, metodoPago } = body;
  if (!userId) throw createError({ statusCode: 400, message: "userId requerido" });
  if (!(conceptos == null ? void 0 : conceptos.length)) throw createError({ statusCode: 400, message: "Al menos un concepto es requerido" });
  if (!formaPago) throw createError({ statusCode: 400, message: "formaPago requerido" });
  if (!metodoPago) throw createError({ statusCode: 400, message: "metodoPago requerido" });
  const serieId = Number(process.env.FACTURA_SERIE_ID);
  if (!serieId) throw createError({ statusCode: 500, message: "FACTURA_SERIE_ID no est\xE1 configurado en .env \u2014 config\xFAralo con el ID num\xE9rico de tu serie en Factura.com" });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { facturaUid: true, fiscalUsocfdi: true, fiscalCompleted: true, fiscalEmail: true }
  });
  if (!user) throw createError({ statusCode: 404, message: "Usuario no encontrado" });
  if (!user.facturaUid) throw createError({ statusCode: 400, message: "El usuario no est\xE1 sincronizado con Factura.com \u2014 sincron\xEDzalo primero" });
  if (!user.fiscalUsocfdi) throw createError({ statusCode: 400, message: "El usuario no tiene Uso de CFDI configurado en sus datos fiscales" });
  for (const [i, c] of conceptos.entries()) {
    if (!((_a = c.descripcion) == null ? void 0 : _a.trim())) throw createError({ statusCode: 400, message: `Concepto ${i + 1}: descripci\xF3n requerida` });
    if (!((_b = c.claveProdServ) == null ? void 0 : _b.trim())) throw createError({ statusCode: 400, message: `Concepto ${i + 1}: clave de producto/servicio requerida` });
    if (!((_c = c.claveUnidad) == null ? void 0 : _c.trim())) throw createError({ statusCode: 400, message: `Concepto ${i + 1}: clave de unidad requerida` });
    if (!((_d = c.unidad) == null ? void 0 : _d.trim())) throw createError({ statusCode: 400, message: `Concepto ${i + 1}: unidad requerida` });
    if (!c.cantidad || c.cantidad <= 0) throw createError({ statusCode: 400, message: `Concepto ${i + 1}: cantidad debe ser mayor a 0` });
    if (!c.valorUnitario || c.valorUnitario <= 0) throw createError({ statusCode: 400, message: `Concepto ${i + 1}: valor unitario debe ser mayor a 0` });
  }
  const payload = {
    Receptor: { UID: user.facturaUid },
    TipoDocumento: "factura",
    Conceptos: conceptos.map(buildCfdiConcepto),
    UsoCFDI: user.fiscalUsocfdi,
    Serie: serieId,
    FormaPago: formaPago,
    MetodoPago: metodoPago,
    Moneda: (_e = body.moneda) != null ? _e : "MXN",
    Comentarios: ((_f = body.comentarios) == null ? void 0 : _f.trim()) || void 0,
    EnviarCorreo: (_g = body.enviarCorreo) != null ? _g : true
  };
  const result = await crearCFDI(payload);
  if (body.orderId && result.uid) {
    await prisma.order.update({
      where: { id: body.orderId },
      data: { cfdiUid: result.uid }
    }).catch(() => {
    });
  }
  return result;
});

export { create_post as default };
//# sourceMappingURL=create.post.mjs.map
