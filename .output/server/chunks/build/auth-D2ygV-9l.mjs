import { J as executeAsync } from '../nitro/nitro.mjs';
import { d as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import { u as useAuthStore } from './auth-DdQ94-v7.mjs';
import { u as useRequestFetch } from './ssr-BBwuAdRU.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'crypto';
import 'vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';

const BUYER_ALLOWED = ["/catalog", "/cart", "/orders", "/perfil", "/fiscal"];
const VIEWER_ALLOWED = ["/catalog", "/orders", "/perfil", "/dashboard"];
const auth = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  if (to.path === "/login") return;
  const auth2 = useAuthStore();
  if (!auth2.loaded) {
    const reqFetch = useRequestFetch();
    try {
      const data = ([__temp, __restore] = executeAsync(() => reqFetch("/api/auth/me")), __temp = await __temp, __restore(), __temp);
      auth2.setUser(data.user);
    } catch {
      auth2.clear();
    }
  }
  if (!auth2.user) return navigateTo("/login");
  if (auth2.user.role === "viewer") {
    const allowed = VIEWER_ALLOWED.some((p) => to.path === p || to.path.startsWith(p + "/"));
    if (!allowed) return navigateTo("/catalog");
  }
  if (auth2.user.role === "buyer") {
    const allowed = BUYER_ALLOWED.some((p) => to.path === p || to.path.startsWith(p + "/"));
    if (!allowed) return navigateTo("/catalog");
  }
});

export { auth as default };
//# sourceMappingURL=auth-D2ygV-9l.mjs.map
