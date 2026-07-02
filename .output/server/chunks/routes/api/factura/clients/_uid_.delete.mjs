import { d as defineEventHandler, c as createError, g as getRouterParam } from '../../../../nitro/nitro.mjs';
import { r as requireSession } from '../../../../_/session.mjs';
import { p as prisma } from '../../../../_/prisma.mjs';
import { e as eliminarCliente } from '../../../../_/factura.mjs';
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

const _uid__delete = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const uid = getRouterParam(event, "uid");
  if (!uid) throw createError({ statusCode: 400, message: "UID requerido" });
  const result = await eliminarCliente(uid);
  if (result.response === "success") {
    await prisma.user.updateMany({
      where: { facturaUid: uid },
      data: { facturaUid: null }
    });
  }
  return result;
});

export { _uid__delete as default };
//# sourceMappingURL=_uid_.delete.mjs.map
