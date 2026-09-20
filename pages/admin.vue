<template>
  <div :style="{ fontFamily:`'Inter',system-ui,sans-serif` }">

    <!-- Header -->
    <div style="margin-bottom:28px;text-align:center;">
      <h1 style="font-size:22px;font-weight:800;color:#F1F5F9;margin:0;">Control de Precios</h1>
      <p style="font-size:13px;color:rgba(100,116,139,0.85);margin-top:4px;">
        Ajusta el incremento global que se aplica al catálogo SYSCOM.
      </p>
    </div>

    <!-- Card principal -->
    <div style="max-width:520px;margin:0 auto;">
      <div style="border-radius:18px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:28px;">

        <!-- Ícono + título -->
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;">
          <div style="width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,rgba(14,165,233,0.18),rgba(14,165,233,0.08));border:1px solid rgba(14,165,233,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div style="font-size:15px;font-weight:700;color:#F1F5F9;">Incremento global de precios</div>
            <div style="font-size:12px;color:rgba(100,116,139,0.8);margin-top:2px;">Se aplica a todos los productos del catálogo</div>
          </div>
        </div>

        <!-- Input de porcentaje -->
        <div style="margin-bottom:20px;">
          <label style="display:block;font-size:12px;font-weight:600;color:rgba(148,163,184,0.9);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">
            Porcentaje de incremento (%)
          </label>
          <div style="position:relative;">
            <input
              v-model.number="inputPct"
              type="number"
              min="0"
              max="500"
              step="0.5"
              placeholder="0"
              :style="{
                width:'100%', height:'48px', background:'rgba(255,255,255,0.04)',
                border:`1px solid ${focused ? 'rgba(14,165,233,0.5)' : 'rgba(255,255,255,0.09)'}`,
                borderRadius:'12px', paddingLeft:'16px', paddingRight:'52px',
                fontSize:'18px', fontWeight:700, color:'#E2E8F0', outline:'none',
                fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.2s',
                MozAppearance:'textfield',
              }"
              @focus="focused=true"
              @blur="focused=false"
            />
            <span style="position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:18px;font-weight:700;color:rgba(100,116,139,0.6);">%</span>
          </div>
        </div>

        <!-- Preview de efecto -->
        <div v-if="inputPct > 0" style="border-radius:12px;background:rgba(14,165,233,0.06);border:1px solid rgba(14,165,233,0.15);padding:14px 16px;margin-bottom:20px;">
          <div style="font-size:11px;font-weight:600;color:rgba(14,165,233,0.8);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">Vista previa</div>
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <div style="text-align:center;">
              <div style="font-size:11px;color:rgba(100,116,139,0.7);margin-bottom:3px;">Precio SYSCOM</div>
              <div style="font-size:16px;font-weight:700;color:rgba(148,163,184,0.6);">$1,000</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(14,165,233,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
            <div style="text-align:center;">
              <div style="font-size:11px;color:rgba(100,116,139,0.7);margin-bottom:3px;">Precio al cliente</div>
              <div style="font-size:16px;font-weight:700;color:#38bdf8;">${{ previewPrice }}</div>
            </div>
          </div>
        </div>

        <!-- Estado actual -->
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
          <div :style="{
            width:'8px', height:'8px', borderRadius:'50%',
            background: currentPct > 0 ? '#34d399' : 'rgba(100,116,139,0.4)',
            boxShadow: currentPct > 0 ? '0 0 8px rgba(52,211,153,0.6)' : 'none',
            flexShrink:0
          }"/>
          <span style="font-size:12px;color:rgba(100,116,139,0.8);">
            <span v-if="loading">Cargando configuración...</span>
            <span v-else-if="currentPct > 0">Incremento activo: <strong style="color:#34d399;">{{ currentPct }}%</strong></span>
            <span v-else>Sin incremento activo — precios originales de SYSCOM</span>
          </span>
        </div>

        <!-- Botón guardar -->
        <button
          @click="save"
          :disabled="saving || inputPct === currentPct"
          :style="{
            width:'100%', height:'44px', borderRadius:'12px', border:'none',
            background: saving || inputPct === currentPct
              ? 'rgba(255,255,255,0.06)'
              : 'linear-gradient(135deg,#0EA5E9,#0284C7)',
            color: saving || inputPct === currentPct ? 'rgba(100,116,139,0.6)' : 'white',
            fontSize:'14px', fontWeight:600, cursor: saving || inputPct === currentPct ? 'not-allowed' : 'pointer',
            fontFamily:'inherit', transition:'all 0.2s',
            boxShadow: saving || inputPct === currentPct ? 'none' : '0 4px 16px rgba(14,165,233,0.3)',
          }"
        >
          <span v-if="saving">Guardando...</span>
          <span v-else-if="saved">✓ Guardado</span>
          <span v-else>Aplicar incremento</span>
        </button>

        <p v-if="error" style="font-size:12px;color:#fb7185;margin-top:10px;text-align:center;">{{ error }}</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
if (auth.user?.role !== 'admin') navigateTo('/dashboard')

const loading   = ref(true)
const saving    = ref(false)
const saved     = ref(false)
const focused   = ref(false)
const error     = ref('')
const currentPct = ref(0)
const inputPct   = ref(0)

const previewPrice = computed(() =>
  (1000 * (1 + inputPct.value / 100)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
)

onMounted(async () => {
  try {
    const data = await $fetch<{ markupPct: number }>('/api/admin/config')
    currentPct.value = data.markupPct
    inputPct.value   = data.markupPct
  } catch { /* sin config previa */ }
  loading.value = false
})

async function save() {
  saving.value = true
  error.value  = ''
  saved.value  = false
  try {
    const data = await $fetch<{ markupPct: number }>('/api/admin/config', {
      method: 'PATCH',
      body: { markupPct: inputPct.value },
    })
    currentPct.value = data.markupPct
    inputPct.value   = data.markupPct
    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Error al guardar'
  }
  saving.value = false
}
</script>
