import { defineStore } from "pinia";
function sanitize(v) {
  return JSON.parse(JSON.stringify(v));
}
const useAuthStore = defineStore("auth", {
  state: () => ({ user: null, loaded: false }),
  actions: {
    async init(fetchFn) {
      try {
        const data = fetchFn ? await fetchFn("/api/auth/me") : await $fetch("/api/auth/me");
        this.user = sanitize(data.user);
      } catch {
        this.user = null;
      } finally {
        this.loaded = true;
      }
    },
    setUser(user) {
      this.user = sanitize(user);
      this.loaded = true;
    },
    clear() {
      this.user = null;
      this.loaded = true;
    },
    async logout() {
      await $fetch("/api/auth/logout", { method: "POST" });
      this.user = null;
    }
  }
});
export {
  useAuthStore as u
};
//# sourceMappingURL=auth-DdQ94-v7.js.map
