<template>
  <div :style="{ fontFamily:`'Inter',system-ui,sans-serif` }">

    <!-- Header -->
    <div style="margin-bottom:28px;text-align:center;">
      <h1 style="font-size:22px;font-weight:800;color:#E2EAF4;margin:0;">Control de Precios</h1>
      <p style="font-size:13px;color:rgba(100,118,142,0.85);margin-top:4px;">
        Ajusta el incremento global que se aplica al catálogo SYSCOM.
      </p>
    </div>

    <!-- Card principal -->
    <div style="max-width:520px;margin:0 auto;">
      <div style="border-radius:18px;background:linear-gradient(160deg,#0C1A2E,#06101E);border:1px solid rgba(255,255,255,0.07);padding:28px;">

        <!-- Ícono + título -->
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;">
          <div style="width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,rgba(14,165,233,0.18),rgba(14,165,233,0.08));border:1px solid rgba(14,165,233,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div style="font-size:15px;font-weight:700;color:#E2EAF4;">Incremento global de precios</div>
            <div style="font-size:12px;color:rgba(100,118,142,0.8);margin-top:2px;">Se aplica a todos los productos del catálogo</div>
          </div>
        </div>

        <!-- Input de porcentaje -->
        <div style="margin-bottom:20px;">
          <label style="display:block;font-size:12px;font-weight:600;color:rgba(123,146,176,0.9);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">
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
                fontSize:'18px', fontWeight:700, color:'#E2EAF4', outline:'none',
                fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.2s',
                MozAppearance:'textfield',
              }"
              @focus="focused=true"
              @blur="focused=false"
            />
            <span style="position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:18px;font-weight:700;color:rgba(100,118,142,0.6);">%</span>
          </div>
        </div>

        <!-- Preview de efecto -->
        <div v-if="inputPct > 0" style="border-radius:12px;background:rgba(14,165,233,0.06);border:1px solid rgba(14,165,233,0.15);padding:14px 16px;margin-bottom:20px;">
          <div style="font-size:11px;font-weight:600;color:rgba(14,165,233,0.8);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">Vista previa</div>
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <div style="text-align:center;">
              <div style="font-size:11px;color:rgba(100,118,142,0.7);margin-bottom:3px;">Costo SYSCOM (sin IVA)</div>
              <div style="font-size:16px;font-weight:700;color:rgba(123,146,176,0.6);">$1,000</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(14,165,233,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
            <div style="text-align:center;">
              <div style="font-size:11px;color:rgba(100,118,142,0.7);margin-bottom:3px;">Precio al cliente (IVA incluido)</div>
              <div style="font-size:16px;font-weight:700;color:#7DD3FC;">${{ previewPrice }}</div>
            </div>
          </div>
        </div>

        <!-- Estado actual -->
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
          <div :style="{
            width:'8px', height:'8px', borderRadius:'50%',
            background: currentPct > 0 ? '#22C55E' : 'rgba(100,118,142,0.4)',
            boxShadow: currentPct > 0 ? '0 0 8px rgba(34,197,94,0.6)' : 'none',
            flexShrink:0
          }"/>
          <span style="font-size:12px;color:rgba(100,118,142,0.8);">
            <span v-if="loading">Cargando configuración...</span>
            <span v-else-if="currentPct > 0">Incremento activo: <strong style="color:#22C55E;">{{ currentPct }}%</strong></span>
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
            color: saving || inputPct === currentPct ? 'rgba(100,118,142,0.6)' : 'white',
            fontSize:'14px', fontWeight:600, cursor: saving || inputPct === currentPct ? 'not-allowed' : 'pointer',
            fontFamily:'inherit', transition:'all 0.2s',
            boxShadow: saving || inputPct === currentPct ? 'none' : '0 4px 16px rgba(14,165,233,0.3)',
          }"
        >
          <span v-if="saving">Guardando...</span>
          <span v-else-if="saved">✓ Guardado</span>
          <span v-else>Aplicar incremento</span>
        </button>

        <p v-if="error" style="font-size:12px;color:#EF4444;margin-top:10px;text-align:center;">{{ error }}</p>
      </div>

      <!-- Envío -->
      <div style="margin-top:20px;border-radius:18px;background:linear-gradient(160deg,#0C1A2E,#06101E);border:1px solid rgba(255,255,255,0.07);padding:28px;">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
          <div style="width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,rgba(245,158,11,0.18),rgba(245,158,11,0.08));border:1px solid rgba(245,158,11,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>
            </svg>
          </div>
          <div>
            <div style="font-size:15px;font-weight:700;color:#E2EAF4;">Envío</div>
            <div style="font-size:12px;color:rgba(100,118,142,0.8);margin-top:2px;">Compras menores al mínimo pagan el cargo de envío. El pedido a SYSCOM se envía igual.</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:16px;">
          <label style="display:block;">
            <span style="display:block;font-size:12px;font-weight:600;color:rgba(123,146,176,0.9);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Envío sin costo desde ($, sin IVA)</span>
            <input v-model.number="inputMin" type="number" min="0" step="50" class="adm-input" />
          </label>
          <label style="display:block;">
            <span style="display:block;font-size:12px;font-weight:600;color:rgba(123,146,176,0.9);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Cargo de envío ($, IVA incl.)</span>
            <input v-model.number="inputFee" type="number" min="0" step="10" class="adm-input" />
          </label>
        </div>

        <div style="font-size:12px;color:rgba(100,118,142,0.8);margin-bottom:16px;line-height:1.6;">
          Compras menores a <strong style="color:#E2EAF4;">{{ money(inputMin) }} + IVA</strong> ({{ money(inputMin * 1.16) }} con IVA) pagan <strong style="color:#fbbf24;">{{ money(inputFee) }}</strong> de envío; desde ahí el envío es sin costo.
        </div>

        <button
          @click="saveShipping"
          :disabled="savingShip || !shipDirty"
          :style="{
            width:'100%', height:'44px', borderRadius:'12px', border:'none',
            background: savingShip || !shipDirty ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#0EA5E9,#0284C7)',
            color: savingShip || !shipDirty ? 'rgba(100,118,142,0.6)' : 'white',
            fontSize:'14px', fontWeight:600, cursor: savingShip || !shipDirty ? 'not-allowed' : 'pointer',
            fontFamily:'inherit', transition:'all 0.2s',
          }"
        >
          <span v-if="savingShip">Guardando...</span>
          <span v-else-if="savedShip">✓ Guardado</span>
          <span v-else>Guardar envío</span>
        </button>
        <p v-if="shipError" style="font-size:12px;color:#EF4444;margin-top:10px;text-align:center;">{{ shipError }}</p>
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
  (1000 * (1 + inputPct.value / 100) * 1.16).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
)

// Envío
const currentMin = ref(1000)
const currentFee = ref(200)
const inputMin   = ref(1000)
const inputFee   = ref(200)
const savingShip = ref(false)
const savedShip  = ref(false)
const shipError  = ref('')
const shipDirty  = computed(() => inputMin.value !== currentMin.value || inputFee.value !== currentFee.value)
const money = (n: number) => (Number(n) || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

type SiteCfg = { markupPct: number; freeShippingMin: number; shippingFee: number }
function applyShipping(d: SiteCfg) {
  currentMin.value = inputMin.value = d.freeShippingMin
  currentFee.value = inputFee.value = d.shippingFee
}

async function saveShipping() {
  savingShip.value = true
  shipError.value  = ''
  savedShip.value  = false
  try {
    applyShipping(await $fetch<SiteCfg>('/api/admin/config', {
      method: 'PATCH',
      body: { freeShippingMin: inputMin.value, shippingFee: inputFee.value },
    }))
    savedShip.value = true
    setTimeout(() => { savedShip.value = false }, 3000)
  } catch (e: any) {
    shipError.value = e?.data?.message ?? 'Error al guardar'
  }
  savingShip.value = false
}

onMounted(async () => {
  try {
    const data = await $fetch<SiteCfg>('/api/admin/config')
    currentPct.value = data.markupPct
    inputPct.value   = data.markupPct
    applyShipping(data)
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

<style scoped>
.adm-input {
  width: 100%; height: 44px; background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 0 14px;
  font-size: 16px; font-weight: 700; color: #E2EAF4; outline: none;
  font-family: inherit; box-sizing: border-box; transition: border-color 0.2s;
}
.adm-input:focus { border-color: rgba(14,165,233,0.5); }
</style>
