import { d as defineEventHandler, c as createError, r as readBody } from '../../../../nitro/nitro.mjs';
import { r as requireSession } from '../../../../_/session.mjs';
import { p as prisma } from '../../../../_/prisma.mjs';
import { h as actualizarCliente, o as obtenerCliente, d as crearCliente } from '../../../../_/factura.mjs';
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

const sync_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const { userId } = await readBody(event);
  if (!userId) throw createError({ statusCode: 400, message: "userId requerido" });
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      facturaUid: true,
      fiscalCompleted: true,
      fiscalRfc: true,
      fiscalRazonSocial: true,
      fiscalCodpos: true,
      fiscalEmail: true,
      fiscalUsocfdi: true,
      fiscalRegimen: true,
      fiscalPais: true,
      fiscalCalle: true,
      fiscalNumExt: true,
      fiscalNumInt: true,
      fiscalColonia: true,
      fiscalCiudad: true,
      fiscalDelegacion: true,
      fiscalLocalidad: true,
      fiscalEstado: true,
      fiscalNumregidtrib: true,
      fiscalNombre: true,
      fiscalApellidos: true,
      fiscalTelefono: true
    }
  });
  if (!user) throw createError({ statusCode: 404, message: "Usuario no encontrado" });
  if (!user.fiscalCompleted || !user.fiscalRfc || !user.fiscalRazonSocial || !user.fiscalCodpos || !user.fiscalEmail || !user.fiscalRegimen || !user.fiscalPais) {
    throw createError({ statusCode: 422, message: "El usuario no tiene datos fiscales completos" });
  }
  const payload = {
    rfc: user.fiscalRfc,
    razons: user.fiscalRazonSocial,
    codpos: user.fiscalCodpos,
    email: user.fiscalEmail,
    regimen: user.fiscalRegimen,
    pais: user.fiscalPais,
    usocfdi: (_a = user.fiscalUsocfdi) != null ? _a : void 0,
    calle: (_b = user.fiscalCalle) != null ? _b : void 0,
    numero_exterior: (_c = user.fiscalNumExt) != null ? _c : void 0,
    numero_interior: (_d = user.fiscalNumInt) != null ? _d : void 0,
    colonia: (_e = user.fiscalColonia) != null ? _e : void 0,
    ciudad: (_f = user.fiscalCiudad) != null ? _f : void 0,
    delegacion: (_g = user.fiscalDelegacion) != null ? _g : void 0,
    localidad: (_h = user.fiscalLocalidad) != null ? _h : void 0,
    estado: (_i = user.fiscalEstado) != null ? _i : void 0,
    numregidtrib: (_j = user.fiscalNumregidtrib) != null ? _j : void 0,
    nombre: (_k = user.fiscalNombre) != null ? _k : void 0,
    apellidos: (_l = user.fiscalApellidos) != null ? _l : void 0,
    telefono: (_m = user.fiscalTelefono) != null ? _m : void 0
  };
  let facturaUid = user.facturaUid;
  let cliente;
  if (facturaUid) {
    cliente = await actualizarCliente(facturaUid, payload);
  } else {
    const existente = await obtenerCliente(user.fiscalRfc);
    if (existente == null ? void 0 : existente.UID) {
      facturaUid = existente.UID;
      cliente = await actualizarCliente(facturaUid, payload);
    } else {
      cliente = await crearCliente(payload);
      facturaUid = cliente.UID;
    }
  }
  await prisma.user.update({
    where: { id: userId },
    data: { facturaUid }
  });
  return { cliente, facturaUid, action: user.facturaUid ? "updated" : "created" };
});

export { sync_post as default };
//# sourceMappingURL=sync.post.mjs.map
