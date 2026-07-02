import { d as defineEventHandler, c as createError, f as getQuery } from '../../../nitro/nitro.mjs';
import { r as requireSession } from '../../../_/session.mjs';
import { f as listarClientes } from '../../../_/factura.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'crypto';

const index_get = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const { razon_social, rfc, page, per_page } = getQuery(event);
  const result = await listarClientes({
    razon_social,
    rfc,
    page: page ? Number(page) : void 0,
    per_page: per_page ? Number(per_page) : void 0
  });
  return result;
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
