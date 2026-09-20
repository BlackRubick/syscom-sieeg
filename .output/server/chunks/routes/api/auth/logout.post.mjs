import { d as defineEventHandler, e as deleteCookie, S as SESSION_COOKIE } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'crypto';

const logout_post = defineEventHandler((event) => {
  deleteCookie(event, SESSION_COOKIE);
  return { ok: true };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
