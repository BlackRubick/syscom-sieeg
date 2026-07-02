<template>
  <div style="display:flex; height:100vh; background:#040C1A; position:relative; overflow:hidden;">
    <!-- Fondo -->
    <div style="position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 60% 40% at 10% 0%,rgba(14,165,233,0.07) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 90% 100%,rgba(124,58,237,0.06) 0%,transparent 60%)" />
    <div style="position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);background-size:60px 60px" />

    <AppSidebar />

    <div style="flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;position:relative;z-index:1;">
      <AppHeader />

      <!-- Alerta datos fiscales pendientes -->
      <Transition name="slide-down">
        <div v-if="showFiscalBanner" style="flex-shrink:0;padding:0 28px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 16px;border-radius:12px;background:linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.06));border:1px solid rgba(245,158,11,0.3);margin-top:12px;flex-wrap:wrap;gap:10px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:32px;height:32px;border-radius:9px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <AlertTriangle :size="15" color="#fbbf24" />
              </div>
              <div>
                <div style="font-size:13px;font-weight:600;color:#fcd34d;">Datos fiscales incompletos</div>
                <div style="font-size:12px;color:rgba(245,158,11,0.8);margin-top:1px;">Completa tu información fiscal para poder recibir facturas (CFDI).</div>
              </div>
            </div>
            <button @click="showFiscalModal=true"
              style="height:34px;padding:0 16px;border-radius:9px;border:none;background:linear-gradient(135deg,#F59E0B,#D97706);color:white;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;">
              Completar ahora
            </button>
          </div>
        </div>
      </Transition>

      <main style="flex:1;overflow-y:auto;padding:28px 28px 40px;">
        <slot />
      </main>
    </div>
  </div>

  <!-- Modal datos fiscales -->
  <FiscalDataModal v-model="showFiscalModal" :required="fiscalModalRequired" />
</template>

<script setup lang="ts">
import { AlertTriangle } from '@lucide/vue'

const auth = useAuthStore()

const needsFiscal = (user: typeof auth.user) => !!user && user.role !== 'admin' && !user.fiscalCompleted

const ui = useUIStore()

onMounted(async () => {
  if (!auth.loaded) await auth.init()
  if (needsFiscal(auth.user)) showFiscalModal.value = true
  // #7 — Cargar notificaciones al montar
  ui.fetchNotifications()
})

const showFiscalModal     = ref(false)
const fiscalModalRequired = computed(() => needsFiscal(auth.user))
const showFiscalBanner    = computed(() => auth.loaded && needsFiscal(auth.user) && !showFiscalModal.value)
</script>
