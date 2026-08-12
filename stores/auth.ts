import { defineStore } from 'pinia'
import type { User } from '~/types'

// Strips null-prototype objects from Prisma results so Pinia SSR serialization works
function sanitize<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null as User | null, loaded: false }),
  actions: {
    async init(fetchFn?: (url: string) => Promise<{ user: User }>) {
      try {
        const data = fetchFn
          ? await fetchFn('/api/auth/me')
          : await $fetch<{ user: User }>('/api/auth/me')
        this.user = sanitize(data.user)
      } catch {
        this.user = null
      } finally {
        this.loaded = true
      }
    },
    setUser(user: User) { this.user = sanitize(user); this.loaded = true },
    clear() { this.user = null; this.loaded = true },
    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST' })
      this.user = null
    },
  },
})
