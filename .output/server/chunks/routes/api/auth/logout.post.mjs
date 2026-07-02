import { d as defineEventHandler, a as deleteCookie } from '../../../nitro/nitro.mjs';
import { S as SESSION_COOKIE } from '../../../_/session.mjs';
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
