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

const redirectAuthenticated = defineNuxtRouteMiddleware(async () => {
  let __temp, __restore;
  const auth = useAuthStore();
  if (!auth.loaded) {
    const reqFetch = useRequestFetch();
    try {
      const data = ([__temp, __restore] = executeAsync(() => reqFetch("/api/auth/me")), __temp = await __temp, __restore(), __temp);
      auth.setUser(data.user);
    } catch {
      auth.clear();
    }
  }
  if (auth.user) return navigateTo("/dashboard");
});

export { redirectAuthenticated as default };
//# sourceMappingURL=redirect-authenticated-Des8s9e3.mjs.map
