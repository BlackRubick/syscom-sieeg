<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" style="position:fixed;inset:0;background:rgba(2,6,14,0.82);backdrop-filter:blur(6px);z-index:1060;" @click.self="emit('close')" />
    </Transition>
    <Transition name="modal">
      <div v-if="open" style="position:fixed;inset:0;z-index:1061;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div style="width:100%;max-width:860px;max-height:92vh;display:flex;flex-direction:column;">
          <div style="position:relative;flex:1;min-height:0;display:flex;flex-direction:column;">
            <div style="position:absolute;inset:-1px;border-radius:22px;background:linear-gradient(135deg,rgba(99,102,241,0.4),rgba(14,165,233,0.2));z-index:0;pointer-events:none;" />
            <div style="position:relative;z-index:1;border-radius:22px;background:linear-gradient(160deg,#0D1B35,#09122A);box-shadow:0 32px 80px rgba(0,0,0,0.75);display:flex;flex-direction:column;max-height:92vh;">

              <!-- ── Header ── -->
              <div style="padding:22px 26px 16px;flex-shrink:0;border-bottom:1px solid rgba(255,255,255,0.07);">
                <div style="position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,rgba(99,102,241,0.6),transparent);border-radius:999px;" />
                <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
                  <div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="17" x="5" y="2" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>
                      <span style="font-size:15px;font-weight:700;color:#F1F5F9;">Generar CFDI 4.0</span>
                    </div>
                    <div style="font-size:12px;color:rgba(100,116,139,0.75);">
                      <span style="font-weight:600;color:#a5b4fc;">{{ user.fiscalRfc }}</span>
                      <span style="margin:0 6px;opacity:0.4;">·</span>
                      {{ user.fiscalRazonSocial }}
                      <span style="margin:0 6px;opacity:0.4;">·</span>
                      Uso CFDI: <span style="font-weight:600;">{{ user.fiscalUsocfdi }}</span>
                    </div>
                  </div>
                  <button v-if="!result" @click="emit('close')" style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(100,116,139,0.8);flex-shrink:0;">
                    <X :size="14" />
                  </button>
                </div>
              </div>

              <!-- ── Success state ── -->
              <div v-if="result" style="padding:32px 26px;text-align:center;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;">
                <div style="width:56px;height:56px;border-radius:16px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);display:flex;align-items:center;justify-content:center;">
                  <CheckCircle :size="26" color="#34d399" />
                </div>
                <div>
                  <div style="font-size:16px;font-weight:700;color:#F1F5F9;margin-bottom:4px;">CFDI Timbrado exitosamente</div>
                  <div style="font-size:12px;color:rgba(100,116,139,0.7);">El comprobante fue sellado por el SAT</div>
                </div>
                <div style="width:100%;max-width:520px;border-radius:14px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);padding:16px 20px;text-align:left;display:flex;flex-direction:column;gap:10px;">
                  <div v-for="row in resultRows" :key="row.label" style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
                    <span style="font-size:11px;font-weight:600;color:rgba(100,116,139,0.6);white-space:nowrap;">{{ row.label }}</span>
                    <span :style="{ fontSize:'11px', color:'#94a3b8', fontFamily: row.mono ? 'monospace':'inherit', textAlign:'right', wordBreak:'break-all' }">{{ row.value }}</span>
                  </div>
                </div>
                <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
                  <button @click="downloadCfdi('pdf')" :disabled="downloading==='pdf'"
                    :style="{ height:'40px', padding:'0 20px', borderRadius:'10px', background: downloading==='pdf' ? 'rgba(239,68,68,0.3)' : 'linear-gradient(135deg,#ef4444,#dc2626)', border:'none', color:'#fff', fontSize:'13px', fontWeight:600, cursor: downloading==='pdf' ? 'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'7px', opacity: downloading==='pdf' ? 0.7:1 }">
                    <svg v-if="downloading==='pdf'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    <FileDown v-else :size="13" />
                    {{ downloading==='pdf' ? 'Descargando…' : 'Descargar PDF' }}
                  </button>
                  <button @click="downloadCfdi('xml')" :disabled="downloading==='xml'"
                    :style="{ height:'40px', padding:'0 20px', borderRadius:'10px', background: downloading==='xml' ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg,#10b981,#059669)', border:'none', color:'#fff', fontSize:'13px', fontWeight:600, cursor: downloading==='xml' ? 'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'7px', opacity: downloading==='xml' ? 0.7:1 }">
                    <svg v-if="downloading==='xml'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    <FileDown v-else :size="13" />
                    {{ downloading==='xml' ? 'Descargando…' : 'Descargar XML' }}
                  </button>
                  <button @click="emit('close')" style="height:40px;padding:0 20px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">
                    Cerrar
                  </button>
                </div>
              </div>

              <!-- ── Formulario ── -->
              <template v-else>
                <div style="overflow-y:auto;flex:1;min-height:0;padding:20px 26px;">

                  <!-- Conceptos -->
                  <div style="margin-bottom:20px;">
                    <div style="font-size:10px;font-weight:700;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Conceptos</div>

                    <!-- Cabecera de tabla -->
                    <div style="display:grid;grid-template-columns:1.8fr 0.9fr 0.6fr 0.7fr 0.65fr 0.9fr 28px;gap:6px;padding:0 2px 6px;border-bottom:1px solid rgba(255,255,255,0.06);">
                      <span v-for="h in ['Descripción','Clave SAT','Cl. Und.','Unidad','Cant.','P. Unit. (s/IVA)','']" :key="h"
                        style="font-size:9px;font-weight:600;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:0.7px;">{{ h }}</span>
                    </div>

                    <!-- Filas -->
                    <div v-for="(c, i) in conceptos" :key="c._id" style="display:grid;grid-template-columns:1.8fr 0.9fr 0.6fr 0.7fr 0.65fr 0.9fr 28px;gap:6px;padding:6px 2px;border-bottom:1px solid rgba(255,255,255,0.04);align-items:center;">
                      <input v-model="c.descripcion"   placeholder="Descripción del producto" v-bind="inputStyle" />
                      <input v-model="c.claveProdServ" placeholder="43211500"                 v-bind="inputStyle" />
                      <input v-model="c.claveUnidad"   placeholder="H87"                      v-bind="inputStyle" />
                      <input v-model="c.unidad"        placeholder="Pieza"                    v-bind="inputStyle" />
                      <input v-model.number="c.cantidad"      type="number" min="0.000001" step="1" placeholder="1"     v-bind="inputStyle" style="text-align:right;" />
                      <input v-model.number="c.valorUnitario" type="number" min="0.000001" step="0.01" placeholder="0.00" v-bind="inputStyle" style="text-align:right;" />
                      <button @click="removeConcepto(i)" :disabled="conceptos.length === 1"
                        style="width:28px;height:28px;border-radius:7px;background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.15);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#f87171;"
                        :style="conceptos.length === 1 ? 'opacity:0.3;cursor:not-allowed' : ''">
                        <X :size="11" />
                      </button>
                    </div>

                    <button @click="addConcepto" style="margin-top:10px;height:32px;padding:0 14px;border-radius:8px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);color:#818cf8;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px;">
                      <Plus :size="12" />
                      Agregar concepto
                    </button>
                  </div>

                  <!-- Configuración de pago -->
                  <div style="margin-bottom:20px;">
                    <div style="font-size:10px;font-weight:700;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Configuración</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px;">

                      <div>
                        <label style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);text-transform:uppercase;letter-spacing:0.7px;display:block;margin-bottom:6px;">Forma de pago</label>
                        <select v-model="formaPago" v-bind="selectStyle">
                          <option value="">Seleccionar...</option>
                          <option v-for="f in FORMAS_PAGO" :key="f.clave" :value="f.clave">{{ f.clave }} — {{ f.nombre }}</option>
                        </select>
                      </div>

                      <div>
                        <label style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);text-transform:uppercase;letter-spacing:0.7px;display:block;margin-bottom:6px;">Método de pago</label>
                        <select v-model="metodoPago" v-bind="selectStyle">
                          <option value="PUE">PUE — Pago en una sola exhibición</option>
                          <option value="PPD">PPD — Pago en parcialidades o diferido</option>
                        </select>
                      </div>

                      <div>
                        <label style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);text-transform:uppercase;letter-spacing:0.7px;display:block;margin-bottom:6px;">Moneda</label>
                        <select v-model="moneda" v-bind="selectStyle">
                          <option value="MXN">MXN — Peso mexicano</option>
                          <option value="USD">USD — Dólar estadounidense</option>
                        </select>
                      </div>

                    </div>

                    <div>
                      <label style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);text-transform:uppercase;letter-spacing:0.7px;display:block;margin-bottom:6px;">Comentarios (opcional)</label>
                      <textarea v-model="comentarios" placeholder="Observaciones o referencia interna..."
                        :style="{ width:'100%', minHeight:'60px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:'8px', padding:'9px 12px', fontSize:'12px', color:'#E2E8F0', outline:'none', fontFamily:'inherit', resize:'vertical', boxSizing:'border-box' }" />
                    </div>

                    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-top:10px;width:fit-content;">
                      <div @click="enviarCorreo=!enviarCorreo"
                        :style="{ width:'36px', height:'20px', borderRadius:'999px', background: enviarCorreo ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'rgba(255,255,255,0.08)', border:`1px solid ${enviarCorreo ? 'transparent' : 'rgba(255,255,255,0.12)'}`, position:'relative', cursor:'pointer', transition:'all 0.2s', flexShrink:0 }">
                        <div :style="{ position:'absolute', top:'2px', left: enviarCorreo ? '17px' : '2px', width:'14px', height:'14px', borderRadius:'50%', background:'white', transition:'left 0.2s' }" />
                      </div>
                      <span style="font-size:12px;color:rgba(148,163,184,0.85);font-weight:500;">Enviar CFDI por correo al receptor</span>
                    </label>
                  </div>

                  <!-- Totales -->
                  <div style="border-radius:12px;background:rgba(99,102,241,0.05);border:1px solid rgba(99,102,241,0.12);padding:14px 18px;">
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;text-align:center;">
                      <div style="border-right:1px solid rgba(255,255,255,0.07);padding-right:16px;">
                        <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Subtotal</div>
                        <div style="font-size:18px;font-weight:700;color:#E2E8F0;">{{ fmtCurrency(subtotal) }}</div>
                      </div>
                      <div style="border-right:1px solid rgba(255,255,255,0.07);padding:0 16px;">
                        <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">IVA 16%</div>
                        <div style="font-size:18px;font-weight:700;color:#94a3b8;">{{ fmtCurrency(totalIva) }}</div>
                      </div>
                      <div style="padding-left:16px;">
                        <div style="font-size:10px;font-weight:600;color:rgba(99,102,241,0.7);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Total</div>
                        <div style="font-size:18px;font-weight:700;background:linear-gradient(135deg,#818cf8,#a5b4fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">{{ fmtCurrency(total) }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Error -->
                  <div v-if="error" style="margin-top:14px;padding:10px 14px;border-radius:10px;background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.2);font-size:12px;color:#fb7185;">
                    {{ error }}
                  </div>

                </div>

                <!-- ── Footer actions ── -->
                <div style="padding:16px 26px;border-top:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
                  <div style="font-size:11px;color:rgba(100,116,139,0.5);">{{ conceptos.length }} concepto{{ conceptos.length !== 1 ? 's' : '' }}</div>
                  <div style="display:flex;gap:10px;">
                    <button @click="emit('close')" style="height:38px;padding:0 18px;border-radius:9px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;">
                      Cancelar
                    </button>
                    <button @click="submit" :disabled="loading"
                      :style="{ height:'38px', padding:'0 22px', borderRadius:'9px', background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#4f46e5)', border:'none', color:'#fff', fontSize:'13px', fontWeight:700, cursor: loading ? 'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'7px', opacity: loading ? 0.8 : 1 }">
                      <svg v-if="loading" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                      <FileCheck v-else :size="13" />
                      {{ loading ? 'Timbrando CFDI…' : 'Timbrar CFDI' }}
                    </button>
                  </div>
                </div>
              </template>

            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Plus, CheckCircle, FileCheck, FileDown } from '@lucide/vue'

interface FiscalUser {
  id:               string
  fiscalRfc?:       string | null
  fiscalRazonSocial?: string | null
  fiscalUsocfdi?:   string | null
  fiscalRegimen?:   string | null
  facturaUid?:      string | null
}

interface ConceptoRow {
  _id:             number
  descripcion:     string
  claveProdServ:   string
  claveUnidad:     string
  unidad:          string
  cantidad:        number
  valorUnitario:   number
}

interface CfdiResult {
  response: string
  UUID:     string
  uid:      string
  SAT: { UUID: string; FechaTimbrado: string }
  INV: { Serie: string; Folio: string | number }
}

interface InitialConcepto {
  descripcion:   string
  claveProdServ: string
  claveUnidad:   string
  unidad:        string
  cantidad:      number
  valorUnitario: number
}

const props = defineProps<{
  user:               FiscalUser
  open:               boolean
  initialConceptos?:  InitialConcepto[]
  orderId?:           string
}>()
const emit  = defineEmits<{
  (e: 'close'): void
  (e: 'created', r: CfdiResult): void
}>()

/* ── Estado del formulario ── */
let _nextId = 1

const makeRow = (): ConceptoRow => ({
  _id: _nextId++, descripcion: '', claveProdServ: '43211500',
  claveUnidad: 'H87', unidad: 'Pieza', cantidad: 1, valorUnitario: 0,
})

const conceptos    = ref<ConceptoRow[]>([makeRow()])
const formaPago    = ref('03')
const metodoPago   = ref('PUE')
const moneda       = ref('MXN')
const comentarios  = ref('')
const enviarCorreo = ref(true)
const loading      = ref(false)
const error        = ref('')
const result       = ref<CfdiResult | null>(null)
const downloading  = ref<'pdf' | 'xml' | null>(null)

/* Resetear cuando se abre */
watch(() => props.open, (open) => {
  if (open) {
    conceptos.value = props.initialConceptos?.length
      ? props.initialConceptos.map(c => ({ ...c, _id: _nextId++ }))
      : [makeRow()]
    formaPago.value    = '03'
    metodoPago.value   = 'PUE'
    moneda.value       = 'MXN'
    comentarios.value  = props.orderId ? `Pedido ${props.orderId}` : ''
    enviarCorreo.value = true
    error.value        = ''
    result.value       = null
  }
})

/* ── Gestión de conceptos ── */
function addConcepto()       { conceptos.value.push(makeRow()) }
function removeConcepto(i: number) { if (conceptos.value.length > 1) conceptos.value.splice(i, 1) }

/* ── Totales ── */
const subtotal = computed(() =>
  conceptos.value.reduce((s, c) => s + (c.cantidad || 0) * (c.valorUnitario || 0), 0)
)
const totalIva = computed(() => subtotal.value * 0.16)
const total    = computed(() => subtotal.value + totalIva.value)

/* ── Submit ── */
async function submit() {
  error.value = ''
  if (!formaPago.value) { error.value = 'Selecciona la forma de pago'; return }

  for (const [i, c] of conceptos.value.entries()) {
    if (!c.descripcion.trim())    { error.value = `Concepto ${i + 1}: escribe una descripción`; return }
    if (!c.claveProdServ.trim())  { error.value = `Concepto ${i + 1}: escribe la clave SAT`; return }
    if ((c.cantidad || 0) <= 0)   { error.value = `Concepto ${i + 1}: cantidad debe ser mayor a 0`; return }
    if ((c.valorUnitario || 0) <= 0) { error.value = `Concepto ${i + 1}: precio debe ser mayor a 0`; return }
  }

  loading.value = true
  try {
    const res = await $fetch<CfdiResult>('/api/factura/cfdi/create', {
      method: 'POST',
      body: {
        userId:      props.user.id,
        orderId:     props.orderId,
        conceptos:   conceptos.value.map(c => ({
          descripcion:    c.descripcion.trim(),
          claveProdServ:  c.claveProdServ.trim(),
          claveUnidad:    c.claveUnidad.trim(),
          unidad:         c.unidad.trim(),
          cantidad:       c.cantidad,
          valorUnitario:  c.valorUnitario,
        })),
        formaPago:    formaPago.value,
        metodoPago:   metodoPago.value,
        moneda:       moneda.value,
        comentarios:  comentarios.value.trim() || undefined,
        enviarCorreo: enviarCorreo.value,
      },
    })
    result.value = res
    emit('created', res)
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al timbrar el CFDI'
  } finally {
    loading.value = false
  }
}

/* ── Descargar CFDI ── */
async function downloadCfdi(format: 'pdf' | 'xml') {
  if (!result.value?.uid) return
  downloading.value = format
  try {
    const res = await fetch(`/api/factura/cfdi/${result.value.uid}/${format}`)
    if (!res.ok) throw new Error(`Error ${res.status}`)
    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `cfdi-${result.value.INV.Serie}-${result.value.INV.Folio}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    error.value = `No se pudo descargar el ${format.toUpperCase()}`
  } finally {
    downloading.value = null
  }
}

/* ── Helpers UI ── */
const fmtCurrency = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: moneda.value === 'USD' ? 'USD' : 'MXN' })

const formatFecha = (iso: string) =>
  new Date(iso).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })

const resultRows = computed(() => result.value ? [
  { label: 'UUID SAT',          value: result.value.UUID,                            mono: true  },
  { label: 'Serie / Folio',     value: `${result.value.INV.Serie}-${result.value.INV.Folio}`, mono: false },
  { label: 'Fecha de timbrado', value: formatFecha(result.value.SAT.FechaTimbrado), mono: false },
  { label: 'UID Factura.com',   value: result.value.uid,                             mono: true  },
] : [])

const inputStyle = {
  style: 'width:100%;height:30px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:7px;padding:0 8px;font-size:11px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;',
}
const selectStyle = {
  style: 'width:100%;height:34px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:8px;padding:0 10px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;cursor:pointer;',
}

const FORMAS_PAGO = [
  { clave: '01', nombre: 'Efectivo' },
  { clave: '02', nombre: 'Cheque nominativo' },
  { clave: '03', nombre: 'Transferencia electrónica' },
  { clave: '04', nombre: 'Tarjeta de crédito' },
  { clave: '05', nombre: 'Monedero electrónico' },
  { clave: '06', nombre: 'Dinero electrónico' },
  { clave: '28', nombre: 'Tarjeta de débito' },
  { clave: '29', nombre: 'Tarjeta de servicios' },
  { clave: '99', nombre: 'Por definir' },
]
</script>

<style scoped>
.spin { animation: spin 0.8s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
