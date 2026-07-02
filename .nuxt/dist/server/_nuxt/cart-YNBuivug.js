import { defineStore } from "pinia";
const useCartStore = defineStore("cart", {
  state: () => ({ items: [] }),
  getters: {
    count: (s) => s.items.reduce((acc, i) => acc + i.quantity, 0),
    total: (s) => s.items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    itemCount: (s) => s.items.length
  },
  actions: {
    addItem(product, qty = 1) {
      const existing = this.items.find((i) => i.product.id === product.id);
      if (existing) existing.quantity += qty;
      else this.items.push({ product, quantity: qty });
    },
    removeItem(productId) {
      this.items = this.items.filter((i) => i.product.id !== productId);
    },
    updateQuantity(productId, qty) {
      const item = this.items.find((i) => i.product.id === productId);
      if (item) item.quantity = Math.max(1, qty);
    },
    clearCart() {
      this.items = [];
    }
  }
});
export {
  useCartStore as u
};
//# sourceMappingURL=cart-YNBuivug.js.map
