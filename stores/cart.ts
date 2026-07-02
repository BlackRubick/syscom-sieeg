import { defineStore } from 'pinia'
import type { Product, CartItem } from '~/types'

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] as CartItem[] }),
  getters: {
    count:     (s) => s.items.reduce((acc, i) => acc + i.quantity, 0),
    total:     (s) => s.items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    itemCount: (s) => s.items.length,
  },
  actions: {
    addItem(product: Product, qty = 1) {
      const existing = this.items.find(i => i.product.id === product.id)
      if (existing) existing.quantity += qty
      else this.items.push({ product, quantity: qty })
    },
    removeItem(productId: string) {
      this.items = this.items.filter(i => i.product.id !== productId)
    },
    updateQuantity(productId: string, qty: number) {
      const item = this.items.find(i => i.product.id === productId)
      if (item) item.quantity = Math.max(1, qty)
    },
    clearCart() { this.items = [] },
  },
})
