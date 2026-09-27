import { defineStore } from 'pinia'
import type { Product, CartItem } from '~/types'

/** Cotización que el cliente cargó en su carrito para comprarla. */
export interface CotizacionEnCarrito { id: string; folio: string; name: string | null; vendedor: string | null }

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] as CartItem[], quote: null as CotizacionEnCarrito | null, ready: false }),
  getters: {
    count:     (s) => s.items.reduce((acc, i) => acc + i.quantity, 0),
    total:     (s) => s.items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    itemCount: (s) => s.items.length,
  },
  actions: {
    async init() {
      if (this.ready) return
      try {
        const data = await $fetch<{ items: CartItem[]; quote?: CotizacionEnCarrito | null }>('/api/cart')
        this.items = JSON.parse(JSON.stringify(data.items ?? []))
        this.quote = data.quote ?? null
      } catch {}
      this.ready = true
    },
    async _save() {
      if (!this.items.length) this.quote = null
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
      this.quote = null
      await this._save()
    },
    /** Reemplaza el carrito por los productos de una cotización propia (el pedido quedará ligado a ella). */
    async cargarCotizacion(quote: CotizacionEnCarrito, items: CartItem[]) {
      this.items = items
      this.quote = quote
      await $fetch('/api/cart', { method: 'PATCH', body: { items: this.items, quoteId: quote.id } })
    },
    async quitarCotizacion() {
      this.quote = null
      try { await $fetch('/api/cart', { method: 'PATCH', body: { items: this.items, quoteId: null } }) } catch {}
    },
  },
})
