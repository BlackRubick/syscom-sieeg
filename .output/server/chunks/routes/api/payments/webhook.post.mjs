import { d as defineEventHandler, a as readBody } from '../../../nitro/nitro.mjs';
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

const webhook_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  if ((body == null ? void 0 : body.type) === "verification") {
    return { verification_code: body.verification_code };
  }
  const transactionId = (_a = body == null ? void 0 : body.transaction) == null ? void 0 : _a.id;
  if (!transactionId) return { ok: true };
  let charge;
  try {
    charge = await getCharge(transactionId);
  } catch {
    return { ok: false };
  }
  const order = await prisma.order.findFirst({
    where: { paymentId: transactionId }
  });
  if (!order) return { ok: true };
  if (body.type === "charge.succeeded" && charge.status === "completed") {
    if (order.paymentStatus !== "paid") {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "paid" }
      });
    }
    if (order.status !== "approved") {
      await approveOrder(order.id);
    }
  } else if ((body.type === "charge.failed" || body.type === "charge.cancelled") && (charge.status === "failed" || charge.status === "cancelled")) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: charge.status }
    });
  }
  return { ok: true };
});

export { webhook_post as default };
//# sourceMappingURL=webhook.post.mjs.map
