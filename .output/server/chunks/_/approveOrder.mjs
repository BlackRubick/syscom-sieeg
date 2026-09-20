import { p as prisma } from './prisma.mjs';
import { g as generateSyscomOrder } from './syscom.mjs';

const RFC_RE = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;
async function approveOrder(orderId, byUserId = "system", byName = "Sistema (pago autom\xE1tico)") {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
  const existing = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
  if (!existing) throw new Error(`Orden ${orderId} no encontrada`);
  if (existing.status === "approved") return { order: existing, syscomError: void 0 };
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
      fiscalUsocfdi: true,
      fiscalRfc: true
    }
  });
  let syscomFolio = (_a = existing.syscomFolio) != null ? _a : null;
  let syscomData = (_b = existing.syscomData) != null ? _b : void 0;
  let syscomError;
  if (!existing.syscomFolio) {
    if ((user == null ? void 0 : user.fiscalRfc) && !RFC_RE.test(user.fiscalRfc.replace(/\s/g, ""))) {
      syscomError = `RFC inv\xE1lido: ${user.fiscalRfc}. Verifica los datos fiscales del usuario.`;
    } else {
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
        if (result.error) {
          const errLow = result.error.toLowerCase();
          if (errLow.includes("existencia") || errLow.includes("stock") || errLow.includes("disponible")) {
            syscomError = `Sin existencia suficiente en SYSCOM: ${result.error}`;
          }
        }
      } catch (e) {
        syscomError = e instanceof Error ? e.message : "Error al conectar con SYSCOM";
      }
    }
  }
  const auditEntry = {
    status: "approved",
    by: byUserId,
    byName,
    at: (/* @__PURE__ */ new Date()).toISOString(),
    auto: byUserId === "system",
    ...syscomFolio ? { syscomFolio } : {},
    ...syscomError ? { syscomError } : {}
  };
  const newLog = [...(_q = existing.auditLog) != null ? _q : [], auditEntry];
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "approved",
      auditLog: newLog,
      syscomFolio,
      syscomData
    },
    include: { user: { select: { id: true, name: true, email: true } } }
  });
  await prisma.notification.create({
    data: {
      userId: existing.userId,
      type: "order",
      title: "\u2705 Pedido aprobado",
      message: `Tu pedido por ${updated.total.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} fue aprobado${syscomFolio ? ` \xB7 Folio SYSCOM: ${syscomFolio}` : ""}.`,
      orderId
    }
  });
  return { order: updated, syscomError };
}

export { approveOrder as a };
//# sourceMappingURL=approveOrder.mjs.map
