import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import { g as getSession } from '../../../_/session.mjs';
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

const me_get = defineEventHandler(async (event) => {
  const session = getSession(event);
  if (!session) throw createError({ statusCode: 401, message: "No autorizado" });
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      lastLogin: true,
      avatar: true,
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
  if (!user) throw createError({ statusCode: 401, message: "No autorizado" });
  return { user };
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
