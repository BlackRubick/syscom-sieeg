import { executeAsync } from "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/unctx/dist/index.mjs";
import { a as useNuxtApp, d as defineNuxtRouteMiddleware, n as navigateTo } from "../server.mjs";
import { u as useAuthStore } from "./auth-De5_qdGe.js";
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
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function useRequestFetch() {
  return useRequestEvent()?.$fetch || globalThis.$fetch;
}
const BUYER_ALLOWED = ["/catalog", "/cart", "/orders", "/perfil"];
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
  if (auth2.user.role === "buyer") {
    const allowed = BUYER_ALLOWED.some((p) => to.path === p || to.path.startsWith(p + "/"));
    if (!allowed) return navigateTo("/catalog");
  }
});
export {
  auth as default
};
//# sourceMappingURL=auth-DvAgt1fG.js.map
