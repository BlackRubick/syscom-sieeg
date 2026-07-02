import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import { r as requireSession } from '../../../_/session.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
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

const fiscal_get = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const users = await prisma.user.findMany({
    where: { role: { not: "admin" } },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
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
      fiscalTelefono: true,
      facturaUid: true
    }
  });
  return { users };
});

export { fiscal_get as default };
//# sourceMappingURL=fiscal.get.mjs.map
