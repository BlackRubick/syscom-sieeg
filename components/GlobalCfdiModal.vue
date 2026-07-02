<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" style="position:fixed;inset:0;background:rgba(2,6,14,0.85);backdrop-filter:blur(6px);z-index:1060;" @click.self="emit('close')" />
    </Transition>
    <Transition name="modal">
      <div v-if="open" style="position:fixed;inset:0;z-index:1061;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div style="width:100%;max-width:640px;border-radius:22px;background:linear-gradient(160deg,#0D1B35,#09122A);border:1px solid rgba(245,158,11,0.2);box-shadow:0 32px 80px rgba(0,0,0,0.75);display:flex;flex-direction:column;max-height:90vh;">

          <!-- Header -->
          <div style="padding:22px 26px 16px;border-bottom:1px solid rgba(255,255,255,0.07);flex-shrink:0;">
            <div style="position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,rgba(245,158,11,0.5),transparent);border-radius:999px;" />
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
              <div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M12 16H8"/></svg>
                  <span style="font-size:15px;font-weight:700;color:#F1F5F9;">Factura Global CFDI 4.0</span>
                </div>
                <div style="font-size:12px;color:rgba(100,116,139,0.7);">
                  Receptor: <span style="color:#fbbf24;font-weight:600;font-family:monospace;">XAXX010101000</span>
                  <span style="margin:0 6px;opacity:0.4;">·</span>PUBLICO EN GENERAL
                </div>
              </div>
              <button v-if="!result" @click="emit('close')" style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(100,116,139,0.8);">
                <X :size="14" />
              </button>
            </div>
          </div>

          <!-- Éxito -->
          <div v-if="result" style="padding:32px 26px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:16px;">
            <div style="width:56px;height:56px;border-radius:16px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);display:flex;align-items:center;justify-content:center;">
              <CheckCircle :size="26" color="#fbbf24" />
            </div>
            <div>
              <div style="font-size:16px;font-weight:700;color:#F1F5F9;margin-bottom:4px;">Factura Global Timbrada</div>
              <div style="font-size:12px;color:rgba(100,116,139,0.7);">{{ result.ordersIncluded }} pedido{{ result.ordersIncluded!==1?'s':'' }} incluido{{ result.ordersIncluded!==1?'s':'' }}</div>
            </div>
            <div style="width:100%;border-radius:14px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15);padding:16px 20px;text-align:left;display:flex;flex-direction:column;gap:10px;">
              <div v-for="row in resultRows" :key="row.label" style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
                <span style="font-size:11px;font-weight:600;color:rgba(100,116,139,0.6);white-space:nowrap;">{{ row.label }}</span>
                <span :style="{ fontSize:'11px', color:'#94a3b8', fontFamily:row.mono?'monospace':'inherit', textAlign:'right', wordBreak:'break-all' }">{{ row.value }}</span>
              </div>
            </div>
            <div style="display:flex;gap:10px;">
              <button @click="downloadResult('pdf')" :disabled="downloading==='pdf'"
                :style="{ height:'40px', padding:'0 20px', borderRadius:'10px', background:downloading==='pdf'?'rgba(239,68,68,0.3)':'linear-gradient(135deg,#ef4444,#dc2626)', border:'none', color:'#fff', fontSize:'13px', fontWeight:600, cursor:downloading==='pdf'?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'7px', opacity:downloading==='pdf'?0.7:1 }">
                <FileDown :size="13" />{{ downloading==='pdf'?'Descargando…':'PDF' }}
              </button>
              <button @click="downloadResult('xml')" :disabled="downloading==='xml'"
                :style="{ height:'40px', padding:'0 20px', borderRadius:'10px', background:downloading==='xml'?'rgba(16,185,129,0.3)':'linear-gradient(135deg,#10b981,#059669)', border:'none', color:'#fff', fontSize:'13px', fontWeight:600, cursor:downloading==='xml'?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'7px', opacity:downloading==='xml'?0.7:1 }">
                <FileDown :size="13" />{{ downloading==='xml'?'Descargando…':'XML' }}
              </button>
              <button @click="emit('close'); emit('created')" style="height:40px;padding:0 20px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">
                Cerrar
              </button>
            </div>
          </div>

          <!-- Formulario -->
          <template v-else>
            <div style="overflow-y:auto;flex:1;min-height:0;padding:20px 26px;">

              <!-- Resumen de pedidos -->
              <div style="padding:14px 16px;border-radius:12px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15);margin-bottom:20px;display:flex;align-items:center;gap:12px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
                <div>
                  <div style="font-size:13px;font-weight:700;color:#fbbf24;">{{ pendingOrders.length }} pedido{{ pendingOrders.length!==1?'s':'' }} sin facturar individualmente</div>
                  <div style="font-size:11px;color:rgba(100,116,139,0.7);margin-top:2px;">Total: <span style="color:#E2E8F0;font-weight:600;">{{ fmtMXN(pendingTotal) }}</span></div>
                </div>
              </div>

              <!-- InformacionGlobal -->
              <div style="margin-bottom:18px;">
                <div style="font-size:10px;font-weight:700;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Período</div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
                  <div>
                    <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:5px;">Periodicidad *</div>
                    <select v-model="form.periodicidad" v-bind="sel">
                      <option value="">Seleccionar…</option>
                      <option value="01">01 – Diario</option>
                      <option value="02">02 – Semanal</option>
                      <option value="03">03 – Quincenal</option>
                      <option value="04">04 – Mensual</option>
                      <option value="05">05 – Bimestral</option>
                    </select>
                  </div>
                  <div>
                    <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:5px;">Mes *</div>
                    <select v-model="form.meses" v-bind="sel">
                      <option value="">Seleccionar…</option>
                      <template v-if="form.periodicidad !== '05'">
                        <option v-for="m in MESES" :key="m.v" :value="m.v">{{ m.v }} – {{ m.l }}</option>
                      </template>
                      <template v-else>
                        <option v-for="m in BIMESTRES" :key="m.v" :value="m.v">{{ m.v }} – {{ m.l }}</option>
                      </template>
                    </select>
                  </div>
                  <div>
                    <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:5px;">Año *</div>
                    <input v-model="form.año" placeholder="2025" maxlength="4" v-bind="inp" />
                  </div>
                </div>
              </div>

              <!-- Configuración de pago -->
              <div style="margin-bottom:18px;">
                <div style="font-size:10px;font-weight:700;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Configuración</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                  <div>
                    <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:5px;">Uso CFDI *</div>
                    <select v-model="form.usoCfdi" v-bind="sel">
                      <option value="">Seleccionar…</option>
                      <option v-for="(nombre, clave) in USOS_CFDI" :key="clave" :value="clave">{{ clave }} – {{ nombre }}</option>
                    </select>
                  </div>
                  <div>
                    <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:5px;">Moneda</div>
                    <select v-model="form.moneda" v-bind="sel">
                      <option value="MXN">MXN – Peso mexicano</option>
                      <option value="USD">USD – Dólar</option>
                    </select>
                  </div>
                  <div>
                    <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:5px;">Forma de pago *</div>
                    <select v-model="form.formaPago" v-bind="sel">
                      <option value="">Seleccionar…</option>
                      <option v-for="f in FORMAS_PAGO" :key="f.c" :value="f.c">{{ f.c }} – {{ f.n }}</option>
                    </select>
                  </div>
                  <div>
                    <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:5px;">Método de pago *</div>
                    <select v-model="form.metodoPago" v-bind="sel">
                      <option value="PUE">PUE – Una sola exhibición</option>
                      <option value="PPD">PPD – Parcialidades o diferido</option>
                    </select>
                  </div>
                </div>
              </div>

              <div v-if="error" style="padding:10px 14px;border-radius:10px;background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.2);font-size:12px;color:#fb7185;">{{ error }}</div>
            </div>

            <!-- Footer -->
            <div style="padding:16px 26px;border-top:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
              <div style="font-size:11px;color:rgba(100,116,139,0.5);">{{ pendingOrders.length }} pedido{{ pendingOrders.length!==1?'s':'' }} · {{ fmtMXN(pendingTotal) }}</div>
              <div style="display:flex;gap:10px;">
                <button @click="emit('close')" style="height:38px;padding:0 18px;border-radius:9px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;font-size:13px;cursor:pointer;font-family:inherit;">
                  Cancelar
                </button>
                <button @click="submit" :disabled="loading || !pendingOrders.length"
                  :style="{ height:'38px', padding:'0 22px', borderRadius:'9px', border:'none', fontSize:'13px', fontWeight:700, cursor:loading||!pendingOrders.length?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'7px', opacity:!pendingOrders.length?0.4:1,
                    background: loading?'rgba(245,158,11,0.4)':'linear-gradient(135deg,#F59E0B,#D97706)',
                    color: '#000', boxShadow: loading?'none':'0 4px 14px rgba(245,158,11,0.3)' }">
                  <svg v-if="loading" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M12 16H8"/></svg>
                  {{ loading ? 'Timbrando…' : 'Timbrar Factura Global' }}
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X, CheckCircle, FileDown } from '@lucide/vue'

interface PendingOrder { id: string; total: number }
interface GlobalResult {
  response: string; UUID: string; uid: string
  SAT: { UUID: string; FechaTimbrado: string }
  INV: { Serie: string; Folio: string | number }
  ordersIncluded: number
}

const props = defineProps<{ open: boolean; pendingOrders: PendingOrder[] }>()
const emit  = defineEmits<{ (e: 'close'): void; (e: 'created'): void }>()

const now = new Date()
const form = ref({
  periodicidad: '04',
  meses:        String(now.getMonth() + 1).padStart(2, '0'),
  año:          String(now.getFullYear()),
  usoCfdi:      'S01',
  moneda:       'MXN',
  formaPago:    '99',
  metodoPago:   'PPD',
})

const loading    = ref(false)
const error      = ref('')
const result     = ref<GlobalResult | null>(null)
const downloading = ref<'pdf'|'xml'|null>(null)

const pendingTotal = computed(() => props.pendingOrders.reduce((s, o) => s + o.total, 0))

watch(() => props.open, (v) => {
  if (v) { error.value = ''; result.value = null }
})

// Reset meses cuando cambia periodicidad
watch(() => form.value.periodicidad, () => { form.value.meses = '' })

async function submit() {
  error.value = ''
  const { periodicidad, meses, año, formaPago, metodoPago, usoCfdi } = form.value
  if (!periodicidad) { error.value = 'Selecciona la periodicidad'; return }
  if (!meses)        { error.value = 'Selecciona el mes'; return }
  if (!año || año.length !== 4) { error.value = 'Ingresa el año en 4 dígitos'; return }
  if (!formaPago)    { error.value = 'Selecciona la forma de pago'; return }
  if (!metodoPago)   { error.value = 'Selecciona el método de pago'; return }
  if (!usoCfdi)      { error.value = 'Selecciona el uso de CFDI'; return }

  loading.value = true
  try {
    const res = await $fetch<GlobalResult>('/api/factura/cfdi/global', {
      method: 'POST',
      body: {
        periodicidad, meses, año,
        formaPago, metodoPago,
        usoCfdi,
        moneda:   form.value.moneda,
        orderIds: props.pendingOrders.map(o => o.id),
      },
    })
    result.value = res
    emit('created')
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al timbrar la factura global'
  } finally {
    loading.value = false
  }
}

async function downloadResult(format: 'pdf'|'xml') {
  if (!result.value?.uid) return
  downloading.value = format
  try {
    const res  = await fetch(`/api/factura/cfdi/${result.value.uid}/${format}`)
    if (!res.ok) throw new Error()
    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `global-${result.value.INV.Serie}-${result.value.INV.Folio}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  } catch { error.value = `No se pudo descargar el ${format.toUpperCase()}` }
  finally  { downloading.value = null }
}

const resultRows = computed(() => result.value ? [
  { label: 'UUID SAT',        value: result.value.UUID,                              mono: true  },
  { label: 'Serie / Folio',   value: `${result.value.INV.Serie}-${result.value.INV.Folio}`, mono: false },
  { label: 'Fecha timbrado',  value: new Date(result.value.SAT.FechaTimbrado).toLocaleString('es-MX'), mono: false },
  { label: 'Pedidos cubiertos', value: String(result.value.ordersIncluded),          mono: false },
] : [])

const fmtMXN = (n: number) => n.toLocaleString('es-MX', { style:'currency', currency:'MXN' })

const sel = { style:'width:100%;height:34px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0 10px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;cursor:pointer;' }
const inp = { style:'width:100%;height:34px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0 10px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;' }

const MESES = [
  { v:'01',l:'Enero' },{ v:'02',l:'Febrero' },{ v:'03',l:'Marzo' },{ v:'04',l:'Abril' },
  { v:'05',l:'Mayo' },{ v:'06',l:'Junio' },{ v:'07',l:'Julio' },{ v:'08',l:'Agosto' },
  { v:'09',l:'Septiembre' },{ v:'10',l:'Octubre' },{ v:'11',l:'Noviembre' },{ v:'12',l:'Diciembre' },
]
const BIMESTRES = [
  { v:'13',l:'Enero – Febrero' },{ v:'14',l:'Marzo – Abril' },{ v:'15',l:'Mayo – Junio' },
  { v:'16',l:'Julio – Agosto' },{ v:'17',l:'Septiembre – Octubre' },{ v:'18',l:'Noviembre – Diciembre' },
]
const FORMAS_PAGO = [
  { c:'01',n:'Efectivo' },{ c:'02',n:'Cheque nominativo' },{ c:'03',n:'Transferencia electrónica' },
  { c:'04',n:'Tarjeta de crédito' },{ c:'28',n:'Tarjeta de débito' },{ c:'99',n:'Por definir' },
]
const USOS_CFDI: Record<string,string> = {
  G01:'Adquisición de mercancias', G03:'Gastos en general', I01:'Construcciones',
  I02:'Mobilario y equipo de oficina por inversiones', I04:'Equipo de computo y accesorios',
  I06:'Comunicaciones telefónicas', I08:'Otra maquinaria y equipo',
  S01:'Sin efectos fiscales', CP01:'Pagos', CN01:'Nómina',
}
</script>

<style scoped>
.spin { animation: spin 0.8s linear infinite; }
@keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
.fade-enter-active,.fade-leave-active{transition:opacity 0.2s}
.fade-enter-from,.fade-leave-to{opacity:0}
.modal-enter-active,.modal-leave-active{transition:opacity 0.2s,transform 0.2s}
.modal-enter-from,.modal-leave-to{opacity:0;transform:scale(0.97) translateY(-6px)}
</style>
