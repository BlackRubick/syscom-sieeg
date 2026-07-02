import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { r as requireSession } from '../../../_/session.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import { h as actualizarCliente, o as obtenerCliente, d as crearCliente } from '../../../_/factura.mjs';
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

const fiscalData_patch = defineEventHandler(async (event) => {
  const session = requireSession(event);
  const body = await readBody(event);
  const { rfc, razonSocial, codpos, email, regimen, pais } = body;
  if (!rfc || !razonSocial || !codpos || !email || !regimen || !pais) {
    throw createError({ statusCode: 400, message: "Faltan campos requeridos: RFC, Raz\xF3n Social, C\xF3digo Postal, Email, R\xE9gimen Fiscal y Pa\xEDs" });
  }
  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      fiscalCompleted: true,
      fiscalRfc: rfc.toUpperCase(),
      fiscalRazonSocial: razonSocial,
      fiscalCodpos: codpos,
      fiscalEmail: email.toLowerCase(),
      fiscalUsocfdi: body.usocfdi || null,
      fiscalRegimen: regimen,
      fiscalPais: pais.toUpperCase(),
      fiscalCalle: body.calle || null,
      fiscalNumExt: body.numeroExterior || null,
      fiscalNumInt: body.numeroInterior || null,
      fiscalColonia: body.colonia || null,
      fiscalCiudad: body.ciudad || null,
      fiscalDelegacion: body.delegacion || null,
      fiscalLocalidad: body.localidad || null,
      fiscalEstado: body.estado || null,
      fiscalNumregidtrib: body.numregidtrib || null,
      fiscalNombre: body.nombre || null,
      fiscalApellidos: body.apellidos || null,
      fiscalTelefono: body.telefono || null
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      lastLogin: true,
      avatar: true,
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
  let facturaUid = user.facturaUid;
  let facturaError;
  try {
    const payload = {
      rfc: rfc.toUpperCase(),
      razons: razonSocial,
      codpos,
      email: email.toLowerCase(),
      regimen,
      pais: pais.toUpperCase(),
      usocfdi: body.usocfdi || void 0,
      calle: body.calle || void 0,
      numero_exterior: body.numeroExterior || void 0,
      numero_interior: body.numeroInterior || void 0,
      colonia: body.colonia || void 0,
      ciudad: body.ciudad || void 0,
      delegacion: body.delegacion || void 0,
      localidad: body.localidad || void 0,
      estado: body.estado || void 0,
      numregidtrib: body.numregidtrib || void 0,
      nombre: body.nombre || void 0,
      apellidos: body.apellidos || void 0,
      telefono: body.telefono || void 0
    };
    let cliente;
    if (facturaUid) {
      cliente = await actualizarCliente(facturaUid, payload);
    } else {
      const existente = await obtenerCliente(rfc.toUpperCase());
      if (existente == null ? void 0 : existente.UID) {
        facturaUid = existente.UID;
        cliente = await actualizarCliente(facturaUid, payload);
      } else {
        cliente = await crearCliente(payload);
        facturaUid = cliente.UID;
      }
    }
    if (facturaUid !== user.facturaUid) {
      await prisma.user.update({
        where: { id: session.userId },
        data: { facturaUid }
      });
    }
  } catch (e) {
    facturaError = e instanceof Error ? e.message : "Error al sincronizar con Factura.com";
  }
  return { user: { ...user, facturaUid }, facturaError };
});

export { fiscalData_patch as default };
//# sourceMappingURL=fiscal-data.patch.mjs.map
