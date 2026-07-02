import { d as defineEventHandler, c as createError, f as getQuery } from '../../../nitro/nitro.mjs';
import { r as requireSession } from '../../../_/session.mjs';
import { l as listarCFDIs } from '../../../_/factura.mjs';
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
  const query = getQuery(event);
  const result = await listarCFDIs({
    month: query.month ? String(query.month) : void 0,
    year: query.year ? String(query.year) : void 0,
    rfc: query.rfc ? String(query.rfc) : void 0,
    page: query.page ? Number(query.page) : 1,
    per_page: query.per_page ? Number(query.per_page) : 50
  });
  return result;
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
