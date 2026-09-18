import { defineStore } from 'pinia'
import type { Product, CartItem } from '~/types'

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] as CartItem[], ready: false }),
  getters: {
    count:     (s) => s.items.reduce((acc, i) => acc + i.quantity, 0),
    total:     (s) => s.items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    itemCount: (s) => s.items.length,
  },
  actions: {
    async init() {
      if (this.ready) return
      try {
        const data = await $fetch<{ items: CartItem[] }>('/api/cart')
        this.items = JSON.parse(JSON.stringify(data.items ?? []))
      } catch {}
      this.ready = true
    },
    async _save() {
      try { await $fetch('/api/cart', { method: 'PATCH', body: { items: this.items } }) } catch {}
    },
    async addItem(product: Product, qty = 1) {
      const existing = this.items.find(i => i.product.id === product.id)
      if (existing) existing.quantity += qty
      else this.items.push({ product, quantity: qty })
      await this._save()
    },
    async removeItem(productId: string) {
      this.items = this.items.filter(i => i.product.id !== productId)
      await this._save()
    },
    async updateQuantity(productId: string, qty: number) {
      const item = this.items.find(i => i.product.id === productId)
      if (item) item.quantity = Math.max(1, qty)
      await this._save()
    },
    async clearCart() {
      this.items = []
      await this._save()
    },
  },
})
