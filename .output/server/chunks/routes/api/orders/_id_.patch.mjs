import { d as defineEventHandler, c as createError, g as getRouterParam, r as readBody } from '../../../nitro/nitro.mjs';
import { r as requireSession } from '../../../_/session.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import { g as generateSyscomOrder } from '../../../_/syscom.mjs';
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

const ALLOWED = ["approved", "rejected", "processing", "shipped", "delivered"];
const _id__patch = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
  const session = requireSession(event);
  if (session.role !== "admin" && session.role !== "approver") {
    throw createError({ statusCode: 403, message: "Sin autorizaci\xF3n" });
  }
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "ID requerido" });
  const body = await readBody(event);
  if (!ALLOWED.includes(body.status)) {
    throw createError({ statusCode: 400, message: "Estado inv\xE1lido" });
  }
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) throw createError({ statusCode: 404, message: "Orden no encontrada" });
  let syscomFolio = (_a = existing.syscomFolio) != null ? _a : null;
  let syscomData = (_b = existing.syscomData) != null ? _b : void 0;
  let syscomError;
  if (body.status === "approved" && !existing.syscomFolio) {
    const user = await prisma.user.findUnique({
      where: { id: existing.userId },
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
    const direccion = {
      atencion_a: (_d = (_c = user == null ? void 0 : user.fiscalRazonSocial) != null ? _c : user == null ? void 0 : user.name) != null ? _d : "N/A",
      calle: (_e = user == null ? void 0 : user.fiscalCalle) != null ? _e : "",
      num_ext: (_f = user == null ? void 0 : user.fiscalNumExt) != null ? _f : "S/N",
      num_int: (_g = user == null ? void 0 : user.fiscalNumInt) != null ? _g : "",
      colonia: (_h = user == null ? void 0 : user.fiscalColonia) != null ? _h : "",
      codigo_postal: (_i = user == null ? void 0 : user.fiscalCodpos) != null ? _i : "",
      ciudad: (_j = user == null ? void 0 : user.fiscalCiudad) != null ? _j : "",
      estado: (_k = user == null ? void 0 : user.fiscalEstado) != null ? _k : "",
      pais: (_l = user == null ? void 0 : user.fiscalPais) != null ? _l : "MEX",
      telefono: (_m = user == null ? void 0 : user.fiscalTelefono) != null ? _m : ""
    };
    const productos = existing.items.map((item) => ({
      id: Number(item.productId),
      tipo: "nuevo",
      cantidad: item.quantity
    }));
    try {
      const result = await generateSyscomOrder({
        tipo_entrega: "domicilio",
        direccion,
        metodo_pago: (_n = process.env.SYSCOM_METODO_PAGO) != null ? _n : "03",
        productos,
        uso_cfdi: (_o = user == null ? void 0 : user.fiscalUsocfdi) != null ? _o : "G03",
        ordenar: process.env.SYSCOM_ORDENAR === "true"
      });
      syscomFolio = result.folio;
      syscomData = (_p = result.data) != null ? _p : void 0;
      syscomError = result.error;
    } catch (e) {
      syscomError = e instanceof Error ? e.message : "Error al conectar con SYSCOM";
    }
  }
  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: body.status,
      ...body.status === "approved" ? { syscomFolio, syscomData } : {}
    },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
  return {
    order: {
      id: updated.id,
      userId: updated.userId,
      userName: updated.user.name,
      userEmail: updated.user.email,
      status: updated.status,
      items: updated.items,
      total: updated.total,
      priority: updated.priority,
      notes: updated.notes,
      syscomFolio: updated.syscomFolio,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString()
    },
    syscomError
  };
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
