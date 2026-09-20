import { executeAsync } from "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/unctx/dist/index.mjs";
import { d as defineNuxtRouteMiddleware, n as navigateTo } from "../server.mjs";
import { u as useAuthStore } from "./auth-DdQ94-v7.js";
import { u as useRequestFetch } from "./ssr-BBwuAdRU.js";
import "vue";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/hookable/dist/index.mjs";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/h3/dist/index.mjs";
import "pinia";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/ufo/dist/index.mjs";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/klona/dist/index.mjs";
import "vue/server-renderer";
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
export {
  redirectAuthenticated as default
};
//# sourceMappingURL=redirect-authenticated-Des8s9e3.js.map
