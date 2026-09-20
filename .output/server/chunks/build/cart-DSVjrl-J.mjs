import { defineStore } from 'pinia';

const useCartStore = defineStore("cart", {
  state: () => ({ items: [], ready: false }),
  getters: {
    count: (s) => s.items.reduce((acc, i) => acc + i.quantity, 0),
    total: (s) => s.items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    itemCount: (s) => s.items.length
  },
  actions: {
    async init() {
      var _a;
      if (this.ready) return;
      try {
        const data = await $fetch("/api/cart");
        this.items = JSON.parse(JSON.stringify((_a = data.items) != null ? _a : []));
      } catch {
      }
      this.ready = true;
    },
    async _save() {
      try {
        await $fetch("/api/cart", { method: "PATCH", body: { items: this.items } });
      } catch {
      }
    },
    async addItem(product, qty = 1) {
      const existing = this.items.find((i) => i.product.id === product.id);
      if (existing) existing.quantity += qty;
      else this.items.push({ product, quantity: qty });
      await this._save();
    },
    async removeItem(productId) {
      this.items = this.items.filter((i) => i.product.id !== productId);
      await this._save();
    },
    async updateQuantity(productId, qty) {
      const item = this.items.find((i) => i.product.id === productId);
      if (item) item.quantity = Math.max(1, qty);
      await this._save();
    },
    async clearCart() {
      this.items = [];
      await this._save();
    }
  }
});

export { useCartStore as u };
//# sourceMappingURL=cart-DSVjrl-J.mjs.map
