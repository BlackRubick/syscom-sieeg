import { d as defineEventHandler, r as requireSession, c as createError, i as getRouterParam } from '../../../../nitro/nitro.mjs';
import { p as prisma } from '../../../../_/prisma.mjs';
import { g as generateSyscomOrder } from '../../../../_/syscom.mjs';
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

const retrySyscom_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const session = requireSession(event);
  if (session.role !== "admin" && session.role !== "approver") {
    throw createError({ statusCode: 403, message: "Sin autorizaci\xF3n" });
  }
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "ID requerido" });
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw createError({ statusCode: 404, message: "Orden no encontrada" });
  if (order.status !== "approved") throw createError({ statusCode: 400, message: "Solo se puede reintentar en \xF3rdenes aprobadas" });
  if (order.syscomFolio) throw createError({ statusCode: 400, message: "Esta orden ya tiene folio SYSCOM" });
  const user = await prisma.user.findUnique({
    where: { id: order.userId },
    select: {
      name: true,
      fiscalRazonSocial: true,
      fiscalCalle: true,
      fiscalNumExt: true,
      fiscalNumInt: true,
      fiscalColonia: true,
      fiscalCodpos: true,
      fiscalCiudad: true,
      fiscalEstado: true,
      fiscalPais: true,
      fiscalTelefono: true,
      fiscalUsocfdi: true
    }
  });
  const result = await generateSyscomOrder({
    tipo_entrega: "domicilio",
    direccion: {
      atencion_a: (_b = (_a = user == null ? void 0 : user.fiscalRazonSocial) != null ? _a : user == null ? void 0 : user.name) != null ? _b : "N/A",
      calle: (_c = user == null ? void 0 : user.fiscalCalle) != null ? _c : "",
      num_ext: (_d = user == null ? void 0 : user.fiscalNumExt) != null ? _d : "S/N",
      num_int: (_e = user == null ? void 0 : user.fiscalNumInt) != null ? _e : "",
      colonia: (_f = user == null ? void 0 : user.fiscalColonia) != null ? _f : "",
      codigo_postal: (_g = user == null ? void 0 : user.fiscalCodpos) != null ? _g : "",
      ciudad: (_h = user == null ? void 0 : user.fiscalCiudad) != null ? _h : "",
      estado: (_i = user == null ? void 0 : user.fiscalEstado) != null ? _i : "",
      pais: (_j = user == null ? void 0 : user.fiscalPais) != null ? _j : "MEX",
      telefono: (_k = user == null ? void 0 : user.fiscalTelefono) != null ? _k : ""
    },
    metodo_pago: (_l = process.env.SYSCOM_METODO_PAGO) != null ? _l : "03",
    productos: order.items.map((i) => ({ id: Number(i.productId), tipo: "nuevo", cantidad: i.quantity })),
    uso_cfdi: (_m = user == null ? void 0 : user.fiscalUsocfdi) != null ? _m : "G03",
    ordenar: process.env.SYSCOM_ORDENAR === "true"
  });
  if (result.error && !result.folio) {
    throw createError({ statusCode: 502, message: result.error });
  }
  const updated = await prisma.order.update({
    where: { id },
    data: { syscomFolio: result.folio, syscomData: (_n = result.data) != null ? _n : void 0 }
  });
  return { folio: updated.syscomFolio, syscomError: result.error };
});

export { retrySyscom_post as default };
//# sourceMappingURL=retry-syscom.post.mjs.map
