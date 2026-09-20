import "vue";
import { c as useNuxtApp } from "../server.mjs";
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function useRequestFetch() {
  return useRequestEvent()?.$fetch || globalThis.$fetch;
}
export {
  useRequestFetch as u
};
//# sourceMappingURL=ssr-BBwuAdRU.js.map
