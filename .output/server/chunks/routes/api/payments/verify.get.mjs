import { d as defineEventHandler, r as requireSession, h as getQuery, c as createError } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import { g as getCharge } from '../../../_/openpay.mjs';
import { a as approveOrder } from '../../../_/approveOrder.mjs';
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
import '../../../_/syscom.mjs';

const verify_get = defineEventHandler(async (event) => {
  const session = requireSession(event);
  const { id } = getQuery(event);
  if (!id) throw createError({ statusCode: 400, message: "chargeId requerido" });
  const order = await prisma.order.findFirst({
    where: { paymentId: id, userId: session.userId }
  });
  if (!order) throw createError({ statusCode: 404, message: "Orden no encontrada" });
  const charge = await getCharge(id);
  let paymentStatus = order.paymentStatus;
  if (charge.status === "completed" && order.paymentStatus !== "paid") {
    paymentStatus = "paid";
    await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "paid" } });
    if (order.status !== "approved") {
      try {
        await approveOrder(order.id);
      } catch {
      }
    }
  } else if (charge.status === "failed" && order.paymentStatus !== "failed") {
    paymentStatus = "failed";
    await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "failed" } });
  }
  return {
    orderId: order.id,
    paymentStatus,
    authorization: charge.authorization,
    chargeStatus: charge.status
  };
});

export { verify_get as default };
//# sourceMappingURL=verify.get.mjs.map
