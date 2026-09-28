<template>
  <a :href="enlace" class="wa" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="currentColor" d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75A12.94 12.94 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.62c-1.98 0-3.92-.53-5.61-1.54l-.4-.24-3.97 1.04 1.06-3.87-.26-.4A10.6 10.6 0 0 1 5.4 16c0-5.86 4.77-10.63 10.64-10.63 5.86 0 10.6 4.77 10.6 10.63 0 5.87-4.76 10.62-10.6 10.62Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.1-.5-.16-.72.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66 0 1.57 1.14 3.08 1.3 3.3.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.2 2 .12.61-.09 1.89-.77 2.15-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z"/>
    </svg>
    <span class="wa-label">¿Te ayudamos?</span>
  </a>
</template>

<script setup lang="ts">
/* Botón flotante de WhatsApp: siempre visible abajo a la derecha, abre el chat con un mensaje inicial. */
const NUMERO  = '529613336529' // 961 333 6529 con lada de México
const MENSAJE = 'Hola, me interesa información sobre sus productos.'
const enlace  = `https://wa.me/${NUMERO}?text=${encodeURIComponent(MENSAJE)}`
</script>

<style scoped>
.wa {
  position: fixed; right: 24px; bottom: 24px; z-index: 80;
  display: flex; align-items: center; gap: 10px;
  height: 60px; padding: 0 15px; border-radius: 999px;
  background: #25D366; color: #fff; text-decoration: none;
  font-family: 'Inter', system-ui, sans-serif; font-size: 15px; font-weight: 700;
  box-shadow: 0 10px 28px rgba(37, 211, 102, 0.45), 0 4px 10px rgba(11, 27, 51, 0.15);
  transition: transform .2s, box-shadow .2s, background .2s;
  animation: wa-in .5s ease-out both;
}
.wa:hover { background: #1EBE5B; transform: translateY(-2px); box-shadow: 0 14px 34px rgba(37, 211, 102, 0.55), 0 4px 10px rgba(11, 27, 51, 0.15); }
.wa:focus-visible { outline: 3px solid #0B1B33; outline-offset: 3px; }
.wa svg { flex-shrink: 0; }
.wa-label { padding-right: 5px; white-space: nowrap; }
/* Pulso suave para llamar la atención sin estorbar */
.wa::after { content: ''; position: absolute; inset: 0; border-radius: inherit; box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); animation: wa-pulse 2.6s ease-out 1.5s infinite; pointer-events: none; }
@keyframes wa-in { from { opacity: 0; transform: translateY(16px) scale(.9); } to { opacity: 1; transform: none; } }
@keyframes wa-pulse { 0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.45); } 70%, 100% { box-shadow: 0 0 0 16px rgba(37, 211, 102, 0); } }
@media (prefers-reduced-motion: reduce) { .wa, .wa::after { animation: none; } }
/* En celular solo el ícono, para no tapar contenido */
@media (max-width: 640px) {
  .wa { right: 16px; bottom: 16px; width: 58px; height: 58px; padding: 0; justify-content: center; }
  .wa-label { display: none; }
}
</style>
