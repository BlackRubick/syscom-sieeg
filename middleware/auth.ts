import type { User } from '~/types'

const BUYER_ALLOWED  = ['/catalog', '/cart', '/orders', '/perfil', '/fiscal']
const VIEWER_ALLOWED = ['/catalog', '/orders', '/perfil', '/dashboard']

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return

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

  if (!auth.user) return navigateTo('/login')

  // #8 — Viewer solo puede ver catálogo, órdenes y perfil (sin crear ni administrar)
  if (auth.user.role === 'viewer') {
    const allowed = VIEWER_ALLOWED.some(p => to.path === p || to.path.startsWith(p + '/'))
    if (!allowed) return navigateTo('/catalog')
  }

  if (auth.user.role === 'buyer') {
    const allowed = BUYER_ALLOWED.some(p => to.path === p || to.path.startsWith(p + '/'))
    if (!allowed) return navigateTo('/catalog')
  }
})
