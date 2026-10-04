<template>
  <div class="app-shell">
    <SiteNavbar app />
    <WhatsAppButton v-if="esCliente" />

    <!-- Alerta datos fiscales pendientes -->
      <Transition name="slide-down">
        <div v-if="showFiscalBanner" :style="{ flexShrink:0 }" class="app-wrap">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 16px;border-radius:12px;background:linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.06));border:1px solid rgba(245,158,11,0.3);margin-top:12px;flex-wrap:wrap;gap:10px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:32px;height:32px;border-radius:9px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <AlertTriangle :size="15" color="#B45309" />
              </div>
              <div>
                <div style="font-size:13px;font-weight:600;color:#B45309;">Datos fiscales incompletos</div>
                <div style="font-size:12px;color:#92400E;margin-top:1px;">Completa tu información fiscal para poder recibir facturas (CFDI).</div>
              </div>
            </div>
            <button @click="showFiscalModal=true"
              style="height:34px;padding:0 16px;border-radius:9px;border:none;background:linear-gradient(135deg,#F59E0B,#D97706);color:white;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;">
              Completar ahora
            </button>
          </div>
        </div>
      </Transition>

    <main class="app-wrap app-main">
      <slot />
    </main>
  </div>

  <!-- Modal datos fiscales -->
  <FiscalDataModal v-model="showFiscalModal" :required="fiscalModalRequired" />
  <ConfirmarDialogo />
</template>

<script setup lang="ts">
import { AlertTriangle } from '@lucide/vue'

const auth = useAuthStore()
const ui   = useUIStore()

// Admin y vendedor no compran a su nombre: no se les piden datos fiscales propios
const needsFiscal = (user: typeof auth.user) => !!user && user.role !== 'admin' && user.role !== 'seller' && !user.fiscalCompleted

onMounted(async () => {
  if (!auth.loaded) await auth.init()
  if (needsFiscal(auth.user)) showFiscalModal.value = true
  ui.fetchNotifications()
  // Avisos nuevos sin recargar: cada minuto mientras la pestaña está a la vista
  avisosTimer = setInterval(() => { if (document.visibilityState === 'visible') ui.fetchNotifications() }, 60_000)
})
let avisosTimer: ReturnType<typeof setInterval> | undefined
onUnmounted(() => clearInterval(avisosTimer))

const showFiscalModal     = ref(false)
// El botón de WhatsApp es para clientes; admin y vendedores son parte del equipo
const esCliente = computed(() => !!auth.user && !['admin', 'seller'].includes(auth.user.role))

const fiscalModalRequired = computed(() => needsFiscal(auth.user))
const showFiscalBanner    = computed(() => auth.loaded && needsFiscal(auth.user) && !showFiscalModal.value)
</script>

<style>
.app-shell { min-height: 100vh; background: #F5F8FC; }
.app-wrap { width: 100%; max-width: calc(1280px + 64px); margin: 0 auto; padding-left: 32px; padding-right: 32px; box-sizing: border-box; }
.app-main { padding-top: 28px; padding-bottom: 96px; }
@media (min-width: 1680px) { .app-wrap { max-width: calc(1520px + 96px); padding-left: 48px; padding-right: 48px; } }
@media (max-width: 900px)  { .app-wrap { padding-left: 20px; padding-right: 20px; } }
@media (max-width: 640px)  { .app-wrap { padding-left: 16px; padding-right: 16px; } .app-main { padding-top: 18px; padding-bottom: 90px; } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
