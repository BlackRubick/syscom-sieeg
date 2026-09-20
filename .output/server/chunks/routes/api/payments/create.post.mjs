import { d as defineEventHandler, r as requireSession, a as readBody, c as createError, l as getRequestHeader } from '../../../nitro/nitro.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import { c as createCardCharge, o as openpayErrorMessage, a as createSpeiCharge } from '../../../_/openpay.mjs';
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

const create_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const session = requireSession(event);
  const body = await readBody(event);
  if (!body.method || !["card", "spei"].includes(body.method)) {
    throw createError({ statusCode: 400, message: "M\xE9todo de pago inv\xE1lido" });
  }
  if (body.method === "card" && (!body.token || !body.deviceSessionId)) {
    throw createError({ statusCode: 400, message: "Token de pago requerido" });
  }
  if (!((_a = body.items) == null ? void 0 : _a.length)) {
    throw createError({ statusCode: 400, message: "El carrito est\xE1 vac\xEDo" });
  }
  for (const item of body.items) {
    if (!item.productId || !item.name) throw createError({ statusCode: 400, message: "\xCDtem inv\xE1lido" });
    if (!item.quantity || item.quantity <= 0) throw createError({ statusCode: 400, message: `Cantidad inv\xE1lida para "${item.name}"` });
    if (item.price === void 0 || item.price < 0) throw createError({ statusCode: 400, message: `Precio inv\xE1lido para "${item.name}"` });
  }
  const clientIp = (_f = (_e = (_c = (_b = getRequestHeader(event, "x-forwarded-for")) == null ? void 0 : _b.split(",")[0].trim()) != null ? _c : getRequestHeader(event, "x-real-ip")) != null ? _e : (_d = event.node.req.socket) == null ? void 0 : _d.remoteAddress) != null ? _f : "127.0.0.1";
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.userId } });
  const serverSubtotal = body.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = Math.round(serverSubtotal * 1.16 * 100) / 100;
  const nameParts = user.name.trim().split(" ");
  const firstName = (_g = user.fiscalNombre) != null ? _g : nameParts[0];
  const lastName = (_h = user.fiscalApellidos) != null ? _h : nameParts.slice(1).join(" ") || "N/A";
  const customer = {
    name: firstName,
    lastName,
    email: user.email,
    phoneNumber: (_i = user.fiscalTelefono) != null ? _i : void 0
  };
  const description = `Pedido SIEEG (${body.items.length} art.)`;
  let paymentId;
  let paymentStatus;
  let paymentData = null;
  let authorization;
  let threeDSUrl;
  if (body.method === "card") {
    try {
      const charge = await createCardCharge({
        sourceId: body.token,
        amount: total,
        description,
        deviceSessionId: body.deviceSessionId,
        clientIp,
        redirectUrl: body.redirectUrl,
        customer
      });
      paymentId = charge.id;
      if (charge.status === "completed") {
        paymentStatus = "paid";
        authorization = charge.authorization;
      } else if (charge.status === "charge_pending" && ((_j = charge.payment_method) == null ? void 0 : _j.url)) {
        paymentStatus = "pending_3ds";
        threeDSUrl = charge.payment_method.url;
      } else {
        paymentStatus = charge.status;
      }
    } catch (e) {
      throw createError({ statusCode: 402, message: openpayErrorMessage(e) });
    }
  } else {
    try {
      const charge = await createSpeiCharge({ amount: total, description, clientIp, customer });
      paymentId = charge.id;
      paymentStatus = "pending_spei";
      paymentData = {
        clabe: charge.payment_method.clabe,
        bank: charge.payment_method.bank,
        agreement: charge.payment_method.agreement,
        beneficiary: charge.payment_method.name,
        reference: (_k = charge.payment_method.reference) != null ? _k : "",
        dueDate: (_l = charge.due_date) != null ? _l : "",
        createdAt: charge.creation_date
      };
    } catch (e) {
      throw createError({ statusCode: 402, message: openpayErrorMessage(e) });
    }
  }
  const order = await prisma.order.create({
    data: {
      userId: session.userId,
      items: body.items,
      total,
      priority: (_m = body.priority) != null ? _m : "normal",
      notes: (_n = body.notes) != null ? _n : null,
      paymentId,
      paymentStatus,
      paymentMethod: body.method,
      paymentData
    },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
  if (paymentStatus === "paid") {
    try {
      await approveOrder(order.id);
    } catch {
    }
  }
  const admins = await prisma.user.findMany({
    where: { role: "admin", status: "active" },
    select: { id: true }
  });
  if (admins.length) {
    const titleMap = {
      card: paymentStatus === "paid" ? "Nuevo pedido aprobado (tarjeta)" : "Nuevo pedido (3DS pendiente)",
      spei: "Nuevo pedido (SPEI pendiente)"
    };
    const msgMap = {
      card: paymentStatus === "paid" ? `${order.user.name} pag\xF3 ${total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} con tarjeta \u2014 aprobado autom\xE1ticamente` : `${order.user.name} inici\xF3 pago con 3DS \u2014 cargo ${paymentId}`,
      spei: `${order.user.name} gener\xF3 un pedido por ${total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} v\xEDa SPEI \u2014 pendiente de recibir transferencia`
    };
    await prisma.notification.createMany({
      data: admins.map((a) => ({
        userId: a.id,
        type: "order",
        title: titleMap[body.method],
        message: msgMap[body.method],
        orderId: order.id
      }))
    });
  }
  return {
    order: {
      id: order.id,
      total: order.total,
      paymentId,
      paymentStatus: order.paymentStatus,
      authorization,
      spei: paymentData
    },
    threeDSUrl
  };
});

export { create_post as default };
//# sourceMappingURL=create.post.mjs.map
