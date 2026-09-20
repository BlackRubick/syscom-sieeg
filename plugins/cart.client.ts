export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  if (!auth.loaded) await auth.init()
  if (auth.user) {
    const cart = useCartStore()
    await cart.init()
  }
})
