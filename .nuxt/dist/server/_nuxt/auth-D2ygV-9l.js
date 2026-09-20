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
export {
  auth as default
};
//# sourceMappingURL=auth-D2ygV-9l.js.map
