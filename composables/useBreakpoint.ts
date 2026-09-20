export function useBreakpoint() {
  const isMobile = ref(false)

  function check() {
    isMobile.value = window.innerWidth < 768
  }

  onMounted(() => {
    check()
    window.addEventListener('resize', check, { passive: true })
  })
  onUnmounted(() => {
    window.removeEventListener('resize', check)
  })

  return { isMobile }
}
