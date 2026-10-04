import { defineStore } from 'pinia'

interface AppNotification {
  id:        string
  type:      string
  title:     string
  message:   string
  read:      boolean
  orderId?:  string | null
  createdAt: string
}

export const useUIStore = defineStore('ui', {
  state: () => ({
    notifications:      [] as AppNotification[],
    notifsLoaded:       false,
    // El servidor cuenta todas las no leídas (la lista solo trae las últimas 50)
    unreadTotal:        0,
  }),
  getters: {
    unreadCount: (s) => s.unreadTotal,
  },
  actions: {
    async fetchNotifications() {
      try {
        const res = await $fetch<{ notifications: AppNotification[]; unreadCount: number }>(
          '/api/notifications',
        )
        this.notifications = res.notifications
        this.unreadTotal   = res.unreadCount
        this.notifsLoaded  = true
      } catch { /* silencioso */ }
    },

    async markRead(id: string) {
      const n = this.notifications.find(n => n.id === id)
      if (n && !n.read) { n.read = true; this.unreadTotal = Math.max(0, this.unreadTotal - 1) }
      try { await $fetch(`/api/notifications/${id}/read`, { method: 'POST' }) } catch { /* ok */ }
    },

    async markAllRead() {
      this.notifications.forEach(n => { n.read = true })
      this.unreadTotal = 0
      try { await $fetch('/api/notifications/read-all', { method: 'POST' }) } catch { /* ok */ }
    },
  },
})
