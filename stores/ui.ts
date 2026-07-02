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
    sidebarCollapsed: false,
    notifications:    [] as AppNotification[],
    notifsLoaded:     false,
  }),
  getters: {
    unreadCount: (s) => s.notifications.filter(n => !n.read).length,
  },
  actions: {
    toggleSidebar() { this.sidebarCollapsed = !this.sidebarCollapsed },

    async fetchNotifications() {
      try {
        const res = await $fetch<{ notifications: AppNotification[]; unreadCount: number }>(
          '/api/notifications',
        )
        this.notifications = res.notifications
        this.notifsLoaded  = true
      } catch { /* silencioso */ }
    },

    async markRead(id: string) {
      const n = this.notifications.find(n => n.id === id)
      if (n) n.read = true
      try { await $fetch(`/api/notifications/${id}/read`, { method: 'POST' }) } catch { /* ok */ }
    },

    async markAllRead() {
      this.notifications.forEach(n => { n.read = true })
      try { await $fetch('/api/notifications/read-all', { method: 'POST' }) } catch { /* ok */ }
    },
  },
})
