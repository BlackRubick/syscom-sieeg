import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'crypto';

const webhook_get = defineEventHandler(() => {
  return { ok: true };
});

export { webhook_get as default };
//# sourceMappingURL=webhook.get.mjs.map
