import { d as defineEventHandler, g as getRouterParam, c as createError } from '../../../../nitro/nitro.mjs';
import { r as requireSession } from '../../../../_/session.mjs';
import { p as prisma } from '../../../../_/prisma.mjs';
import { a as getSyscomToken } from '../../../../_/syscom.mjs';
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

function isDelivered(estatus) {
  const s = (estatus != null ? estatus : "").toLowerCase();
  return s.includes("entrega") || s.includes("recib");
}
const syscomTrack_get = defineEventHandler(async (event) => {
  var _a;
  const session = requireSession(event);
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "ID requerido" });
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw createError({ statusCode: 404, message: "Orden no encontrada" });
  if (order.userId !== session.userId && session.role !== "admin" && session.role !== "approver") {
    throw createError({ statusCode: 403, message: "Sin autorizaci\xF3n" });
  }
  if (!order.syscomFolio) {
    throw createError({ statusCode: 400, message: "Este pedido no tiene folio SYSCOM" });
  }
  const token = await getSyscomToken();
  const res = await fetch(
    `https://developers.syscom.mx/api/v1/pedidos/${encodeURIComponent(order.syscomFolio)}`,
    { headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" } }
  );
  if (!res.ok) {
    const msg = res.status === 404 ? "Folio no encontrado en SYSCOM" : `SYSCOM respondi\xF3 con error ${res.status}`;
    throw createError({ statusCode: res.status === 404 ? 404 : 502, message: msg });
  }
  const tracking = await res.json();
  let statusUpdated = false;
  if (isDelivered((_a = tracking.estatus) != null ? _a : tracking.estado) && order.status !== "delivered") {
    await prisma.order.update({
      where: { id },
      data: { status: "delivered" }
    });
    statusUpdated = true;
  }
  return { tracking, statusUpdated };
});

export { syscomTrack_get as default };
//# sourceMappingURL=syscom-track.get.mjs.map
