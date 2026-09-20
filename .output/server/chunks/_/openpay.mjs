var _a, _b;
const isSandbox = process.env.OPENPAY_IS_SANDBOX !== "false";
const BASE_URL = isSandbox ? "https://sandbox-api.openpay.mx/v1" : "https://api.openpay.mx/v1";
const merchantId = (_a = process.env.OPENPAY_MERCHANT_ID) != null ? _a : "";
const privateKey = (_b = process.env.OPENPAY_PRIVATE_KEY) != null ? _b : "";
function authHeader() {
  return "Basic " + Buffer.from(`${privateKey}:`).toString("base64");
}
function openpayErrorMessage(e) {
  var _a2, _b2, _c, _d, _e, _f, _g;
  const code = (_d = (_a2 = e == null ? void 0 : e.data) == null ? void 0 : _a2.error_code) != null ? _d : (_c = (_b2 = e == null ? void 0 : e.data) == null ? void 0 : _b2.data) == null ? void 0 : _c.error_code;
  switch (code) {
    case 3001:
      return "El pago no pudo ser realizado, intenta de nuevo.";
    case 3002:
      return "Tu pago no pudo ser completado. Intenta con otra tarjeta o elige otra forma de pago.";
    case 3003:
      return "Tu pago no pudo ser realizado. Intenta con otra tarjeta.";
    case 3004:
      return "El pago no pudo ser realizado, intenta de nuevo.";
    case 3005:
      return "El pago no pudo ser realizado, intenta de nuevo.";
    case 3006:
      return "El pago no pudo ser realizado, intenta de nuevo o comun\xEDcate con tu banco.";
    case 3007:
      return "La tarjeta ha expirado. Intenta con otra tarjeta.";
    case 3008:
      return "La tarjeta no es compatible con compras. Intenta con otra tarjeta.";
    case 3009:
      return "Tu pago fue declinado. Comun\xEDcate con tu banco o intenta con otra tarjeta.";
    case 3010:
      return "Tu banco ha restringido el uso de la tarjeta. Comun\xEDcate con tu banco.";
    case 3011:
      return "Tu banco ha declinado el pago. Comun\xEDcate con tu banco y autoriza el pago.";
    case 3012:
      return "Se requiere autorizaci\xF3n de tu banco para este pago. Comun\xEDcate con tu banco.";
    case 2004:
      return "El n\xFAmero de tarjeta es inv\xE1lido.";
    case 2005:
      return "La tarjeta ha expirado.";
    case 2009:
      return "El c\xF3digo de seguridad (CVV) es inv\xE1lido.";
  }
  return (_g = (_f = (_e = e == null ? void 0 : e.data) == null ? void 0 : _e.description) != null ? _f : e == null ? void 0 : e.message) != null ? _g : "Ocurri\xF3 un error, intenta de nuevo o comun\xEDcate con tu banco.";
}
async function createCardCharge(payload) {
  var _a2;
  if (!merchantId || !privateKey) {
    throw new Error("OpenPay no est\xE1 configurado (OPENPAY_MERCHANT_ID / OPENPAY_PRIVATE_KEY)");
  }
  return await $fetch(`${BASE_URL}/${merchantId}/charges`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "X-Forwarded-For": payload.clientIp
    },
    body: {
      method: "card",
      source_id: payload.sourceId,
      amount: Math.round(payload.amount * 100) / 100,
      currency: "MXN",
      description: payload.description,
      device_session_id: payload.deviceSessionId,
      capture: true,
      use_3d_secure: !!payload.redirectUrl,
      redirect_url: (_a2 = payload.redirectUrl) != null ? _a2 : void 0,
      customer: {
        name: payload.customer.name,
        last_name: payload.customer.lastName,
        email: payload.customer.email,
        phone_number: payload.customer.phoneNumber
      }
    }
  });
}
async function createSpeiCharge(payload) {
  if (!merchantId || !privateKey) {
    throw new Error("OpenPay no est\xE1 configurado");
  }
  return await $fetch(`${BASE_URL}/${merchantId}/charges`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "X-Forwarded-For": payload.clientIp
    },
    body: {
      method: "bank_account",
      amount: Math.round(payload.amount * 100) / 100,
      currency: "MXN",
      description: payload.description,
      customer: {
        name: payload.customer.name,
        last_name: payload.customer.lastName,
        email: payload.customer.email,
        phone_number: payload.customer.phoneNumber
      }
    }
  });
}
async function getCharge(chargeId) {
  if (!merchantId || !privateKey) throw new Error("OpenPay no est\xE1 configurado");
  return await $fetch(`${BASE_URL}/${merchantId}/charges/${chargeId}`, {
    headers: { Authorization: authHeader() }
  });
}

export { createSpeiCharge as a, createCardCharge as c, getCharge as g, openpayErrorMessage as o };
//# sourceMappingURL=openpay.mjs.map
