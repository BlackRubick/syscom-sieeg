import { defineStore } from "pinia";
const useAuthStore = defineStore("auth", {
  state: () => ({ user: null, loaded: false }),
  actions: {
    async init(fetchFn) {
      try {
        const data = fetchFn ? await fetchFn("/api/auth/me") : await $fetch("/api/auth/me");
        this.user = data.user;
      } catch {
        this.user = null;
      } finally {
        this.loaded = true;
      }
    },
    setUser(user) {
      this.user = user;
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
//# sourceMappingURL=auth-De5_qdGe.js.map
