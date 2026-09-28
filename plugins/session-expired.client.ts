/* Si la sesión expira mientras la página sigue abierta, cualquier llamada a la API responde 401:
   en lugar de fallar en silencio (ej. "no me deja crear el usuario"), se manda al login con aviso
   y, al volver a entrar, regresa a la misma página. */
export default defineNuxtPlugin(() => {
  let redirigiendo = false
  globalThis.$fetch = globalThis.$fetch.create({
    onResponseError({ request, response }) {
      if (response.status !== 401 || redirigiendo) return
      const url = typeof request === 'string' ? request : (request as Request).url
      if (!url.includes('/api/') || url.includes('/api/auth/')) return
      const route = useRouter().currentRoute.value
      if (route.path === '/login') return
      redirigiendo = true
      useAuthStore().clear()
      navigateTo({ path: '/login', query: { expirada: '1', volver: route.fullPath } }).finally(() => { redirigiendo = false })
    },
  }) as typeof globalThis.$fetch
})
