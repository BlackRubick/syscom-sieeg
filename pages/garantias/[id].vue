<template>
  <div class="rd">
    <NuxtLink to="/garantias" class="rd-back"><ArrowLeft :size="14" /> Garantías</NuxtLink>

    <div v-if="error" class="rd-card rd-empty">{{ error }}</div>
    <div v-else-if="!rma" class="rd-card rd-empty">Cargando garantía…</div>

    <template v-else>
      <header class="rd-card rd-header">
        <div>
          <span class="rd-doc">Garantía</span>
          <div class="rd-folio">{{ rma.folio }}</div>
          <span class="rd-date">Recibida el {{ fechaLarga(rma.createdAt) }}</span>
        </div>
        <div class="rd-header-right">
          <span class="rd-pill" :style="{ background: RMA_ESTADOS[rma.status].bg, color: RMA_ESTADOS[rma.status].color }">{{ RMA_ESTADOS[rma.status].label }}</span>
          <NuxtLink :to="`/imprimir/rma/${rma.id}`" class="rd-btn rd-btn-ghost"><Download :size="15" /> Descargar comprobante</NuxtLink>
        </div>
      </header>

      <div class="rd-grid">
        <section class="rd-card rd-box">
          <h3>Producto</h3>
          <div class="rd-kv"><span>Descripción</span><b>{{ rma.productName }}</b></div>
          <div class="rd-kv"><span>Modelo</span><b class="rd-mono">{{ rma.sku }}</b></div>
          <div class="rd-kv"><span>Número de serie</span><b class="rd-mono">{{ rma.serie || '—' }}</b></div>
          <div class="rd-kv"><span>Cantidad</span><b>{{ rma.quantity }}</b></div>
          <div v-if="rma.accesorios" class="rd-kv"><span>Accesorios</span><b>{{ rma.accesorios }}</b></div>
          <div v-if="rma.orderId" class="rd-kv"><span>Pedido</span><b><NuxtLink :to="`/orders?pedido=${rma.orderId}`">PED-{{ rma.orderId.slice(-8).toUpperCase() }}</NuxtLink></b></div>
        </section>
        <section class="rd-card rd-box">
          <h3>Cliente</h3>
          <div class="rd-kv"><span>Nombre</span><b>{{ rma.cliente.name }}<span v-if="rma.cliente.clientNumber && !rma.cliente.mostrador" class="rd-cl">{{ formatClientNumber(rma.cliente.clientNumber) }}</span></b></div>
          <div v-if="rma.cliente.razonSocial" class="rd-kv"><span>Empresa</span><b>{{ rma.cliente.razonSocial }}</b></div>
          <div v-if="rma.cliente.telefono" class="rd-kv"><span>Teléfono</span><b>{{ rma.cliente.telefono }}</b></div>
          <div v-if="!rma.cliente.mostrador" class="rd-kv"><span>Correo</span><b>{{ rma.cliente.email }}</b></div>
          <div class="rd-kv"><span>Atiende</span><b>{{ rma.atiende?.name ?? 'SIEEG Integradores' }}</b></div>
          <div v-if="rma.folioProveedor" class="rd-kv"><span>Folio RMA proveedor</span><b class="rd-mono">{{ rma.folioProveedor }}</b></div>
        </section>
      </div>

      <section class="rd-card rd-box">
        <h3>Falla reportada</h3>
        <p class="rd-text">{{ rma.falla }}</p>
        <template v-if="rma.resolucion">
          <h3 style="margin-top:14px;">Resolución</h3>
          <p class="rd-text">{{ rma.resolucion }}</p>
        </template>
      </section>

      <!-- Seguimiento (personal) -->
      <section v-if="personal" class="rd-card rd-box">
        <h3>Actualizar seguimiento</h3>
        <div class="rd-form">
          <label class="rd-field"><span>Estado</span>
            <select v-model="upd.status" class="rd-input">
              <option v-for="(e, k) in RMA_ESTADOS" :key="k" :value="k">{{ e.label }}</option>
            </select>
          </label>
          <label class="rd-field"><span>Folio RMA del proveedor (SYSCOM)</span><input v-model="upd.folioProveedor" class="rd-input" maxlength="60" /></label>
          <label class="rd-field"><span>Número de serie</span><input v-model="upd.serie" class="rd-input" maxlength="120" /></label>
          <label class="rd-field rd-wide"><span>Nota para el cliente (se le envía como aviso)</span><input v-model="upd.nota" class="rd-input" maxlength="500" placeholder="Ej. Enviamos tu equipo a SYSCOM para su revisión" /></label>
          <label class="rd-field rd-wide"><span>Resolución (sale en el comprobante)</span><textarea v-model="upd.resolucion" class="rd-input rd-area" rows="2" maxlength="2000" placeholder="Ej. Se reemplazó por un equipo nuevo, serie …" /></label>
        </div>
        <p v-if="updError" class="rd-error">{{ updError }}</p>
        <div class="rd-actions">
          <span v-if="updOk" class="rd-ok">✓ Guardado</span>
          <button class="rd-btn rd-btn-primary" :disabled="guardando" @click="guardar">{{ guardando ? 'Guardando…' : 'Guardar seguimiento' }}</button>
        </div>
      </section>

      <section v-if="rma.historial.length" class="rd-card rd-box">
        <h3>Historial</h3>
        <ol class="rd-log">
          <li v-for="(h, i) in [...rma.historial].reverse()" :key="i">
            <span class="rd-dot" :style="{ background: RMA_ESTADOS[h.status as RmaEstado]?.color ?? '#5B6B82' }" />
            <div>
              <div><b>{{ RMA_ESTADOS[h.status as RmaEstado]?.label ?? h.status }}</b> <span class="rd-muted">· {{ fechaHora(h.at) }}<template v-if="personal"> · {{ h.byName }}</template></span></div>
              <div v-if="h.nota" class="rd-text">{{ h.nota }}</div>
            </div>
          </li>
        </ol>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Download } from '@lucide/vue'
import type { RmaEstado, Rma } from '~/utils/rma'

definePageMeta({ middleware: 'auth' })


const route    = useRoute()
const auth     = useAuthStore()
const personal = computed(() => ['admin', 'seller', 'approver'].includes(auth.user?.role ?? ''))

const rma   = ref<Rma | null>(null)
const error = ref('')
const upd   = reactive({ status: 'recibido' as RmaEstado, folioProveedor: '', serie: '', nota: '', resolucion: '' })

function aplicar(r: Rma) {
  rma.value = r
  Object.assign(upd, { status: r.status, folioProveedor: r.folioProveedor ?? '', serie: r.serie ?? '', nota: '', resolucion: r.resolucion ?? '' })
}
onMounted(async () => {
  try { aplicar((await $fetch<{ rma: Rma }>(`/api/rma/${route.params.id}`)).rma) }
  catch (e: any) { error.value = e?.data?.message ?? 'No se pudo cargar la garantía' }
})

const guardando = ref(false)
const updError  = ref('')
const updOk     = ref(false)
async function guardar() {
  guardando.value = true; updError.value = ''; updOk.value = false
  try {
    aplicar((await $fetch<{ rma: Rma }>(`/api/rma/${rma.value!.id}`, { method: 'PATCH', body: { ...upd } })).rma)
    updOk.value = true
    setTimeout(() => (updOk.value = false), 2500)
  } catch (e: any) {
    updError.value = e?.data?.message ?? 'No se pudo guardar'
  } finally { guardando.value = false }
}

const fechaLarga = (iso: string) => new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
const fechaHora  = (iso: string) => new Date(iso).toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

useHead(() => ({ title: rma.value ? `${rma.value.folio} — Garantía` : 'Garantía' }))
</script>

<style scoped>
.rd { display: flex; flex-direction: column; gap: 16px; font-family: 'Inter', system-ui, sans-serif; color: #0B1B33; max-width: 980px; }
.rd-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #5B6B82; text-decoration: none; }
.rd-card { background: #fff; border: 1px solid #E4E9F1; border-radius: 16px; }
.rd-empty { padding: 48px 16px; text-align: center; color: #5B6B82; }
.rd-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; padding: 20px 22px; }
.rd-doc { font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #1570EF; }
.rd-folio { font-size: 26px; font-weight: 800; font-family: ui-monospace, 'SF Mono', Menlo, monospace; margin: 2px 0 4px; }
.rd-date { font-size: 13px; color: #5B6B82; }
.rd-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
.rd-pill { font-size: 12px; font-weight: 700; padding: 4px 11px; border-radius: 999px; }
.rd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.rd-box { padding: 18px 20px; min-width: 0; }
.rd-box h3 { margin: 0 0 10px; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #5B6B82; }
.rd-kv { display: flex; justify-content: space-between; gap: 16px; padding: 6px 0; font-size: 13px; border-bottom: 1px dashed #EEF1F6; }
.rd-kv span { color: #5B6B82; flex-shrink: 0; }
.rd-kv b { font-weight: 600; text-align: right; overflow-wrap: anywhere; }
.rd-mono { font-family: ui-monospace, Menlo, monospace; }
.rd-cl { margin-left: 6px; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 5px; background: #F1F5FB; color: #0B5BD3; font-family: ui-monospace, Menlo, monospace; }
.rd-text { margin: 0; font-size: 13.5px; line-height: 1.55; white-space: pre-line; color: #13294B; }
.rd-muted { color: #5B6B82; font-size: 12px; }
.rd-form { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.rd-wide { grid-column: 1 / -1; }
.rd-field { display: flex; flex-direction: column; gap: 6px; font-size: 12px; font-weight: 600; color: #5B6B82; }
.rd-input { width: 100%; height: 40px; padding: 0 12px; border-radius: 10px; border: 1px solid #D5DEEA; background: #fff; font-size: 13.5px; color: #0B1B33; font-family: inherit; outline: none; box-sizing: border-box; }
.rd-input:focus { border-color: rgba(21,112,239,0.5); }
.rd-area { height: auto; padding: 10px 12px; resize: vertical; line-height: 1.5; }
.rd-actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 14px; }
.rd-ok { font-size: 13px; font-weight: 600; color: #15803D; }
.rd-error { margin: 12px 0 0; padding: 9px 11px; border-radius: 9px; background: #FEF2F2; color: #B91C1C; font-size: 12.5px; }
.rd-btn { display: inline-flex; align-items: center; gap: 7px; height: 40px; padding: 0 16px; border-radius: 10px; font-size: 13.5px; font-weight: 600; font-family: inherit; cursor: pointer; text-decoration: none; }
.rd-btn:disabled { opacity: .55; cursor: not-allowed; }
.rd-btn-primary { background: #1570EF; color: #fff; border: none; }
.rd-btn-ghost { background: #fff; color: #0B1B33; border: 1px solid #D5DEEA; }
.rd-log { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; font-size: 13px; }
.rd-log li { display: flex; gap: 10px; }
.rd-dot { width: 9px; height: 9px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }

@media (max-width: 760px) {
  .rd-grid, .rd-form { grid-template-columns: 1fr; }
  .rd-header-right { align-items: flex-start; }
}
</style>
