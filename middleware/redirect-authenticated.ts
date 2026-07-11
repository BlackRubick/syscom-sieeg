import type { User } from '~/types'

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (!auth.loaded) {
    const reqFetch = useRequestFetch()
    try {
      const data = await reqFetch<{ user: User }>('/api/auth/me')
      auth.setUser(data.user)
    } catch {
      auth.clear()
    }
  }
  if (auth.user) return navigateTo('/dashboard')
})
