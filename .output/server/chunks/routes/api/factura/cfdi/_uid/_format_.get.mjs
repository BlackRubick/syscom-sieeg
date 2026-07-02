import { d as defineEventHandler, c as createError, g as getRouterParam, b as setResponseHeader, e as sendStream } from '../../../../../nitro/nitro.mjs';
import { r as requireSession } from '../../../../../_/session.mjs';
import { g as getFacturaHost, a as getFacturaHeaders } from '../../../../../_/factura.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'crypto';

const _format__get = defineEventHandler(async (event) => {
  const session = requireSession(event);
  if (session.role !== "admin") throw createError({ statusCode: 403, message: "Solo administradores" });
  const uid = getRouterParam(event, "uid");
  const format = getRouterParam(event, "format");
  if (!uid) throw createError({ statusCode: 400, message: "uid requerido" });
  if (format !== "pdf" && format !== "xml") throw createError({ statusCode: 400, message: "Formato inv\xE1lido. Usa pdf o xml" });
  const url = `${getFacturaHost()}/v4/cfdi40/${uid}/${format}`;
  const res = await fetch(url, { method: "GET", headers: getFacturaHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw createError({ statusCode: res.status, message: `Factura.com error ${res.status}: ${text.slice(0, 200)}` });
  }
  const contentType = format === "pdf" ? "application/pdf" : "application/xml";
  const disposition = `attachment; filename="cfdi-${uid}.${format}"`;
  setResponseHeader(event, "Content-Type", contentType);
  setResponseHeader(event, "Content-Disposition", disposition);
  return sendStream(event, res.body);
});

export { _format__get as default };
//# sourceMappingURL=_format_.get.mjs.map
