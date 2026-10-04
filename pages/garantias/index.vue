<template>
  <div class="rm">
    <div class="rm-head">
      <div>
        <h1>{{ personal ? 'Garantías (RMA)' : 'Mis garantías' }}</h1>
        <p>{{ loading ? 'Cargando…' : `${rmas.length} garantía${rmas.length !== 1 ? 's' : ''}` }}</p>
      </div>
      <button v-if="registra" class="rm-btn rm-btn-primary" @click="abrirNueva"><Plus :size="15" /> Nueva garantía</button>
    </div>

    <div class="rm-card rm-filters">
      <div class="rm-search">
        <Search :size="15" />
        <input v-model="search" :placeholder="personal ? 'Buscar por folio RMA-, cliente, modelo o número de serie…' : 'Buscar por folio RMA-, modelo o serie…'" />
      </div>
      <div class="rm-tabs">
        <button type="button" :class="{ active: estado === '' }" @click="estado = ''">Todas</button>
        <button v-for="(e, k) in RMA_ESTADOS" :key="k" type="button" :class="{ active: estado === k }" @click="estado = k">{{ e.label }}</button>
      </div>
    </div>

    <div v-if="error" class="rm-card rm-empty">{{ error }}</div>
    <div v-else-if="loading" class="rm-card rm-empty">Cargando garantías…</div>
    <div v-else-if="!rmas.length" class="rm-card rm-empty">
      <ShieldCheck :size="26" />
      <strong>Sin garantías</strong>
      <span v-if="registra">Cuando un cliente entregue un producto para garantía, regístralo con <b>Nueva garantía</b>: se le asigna un folio RMA y se imprime su comprobante.</span>
      <span v-else>Si un producto que compraste falla, escríbenos por WhatsApp y te ayudamos con la garantía.</span>
    </div>

    <div v-else class="rm-list">
      <NuxtLink v-for="r in rmas" :key="r.id" :to="`/garantias/${r.id}`" class="rm-row">
        <div class="rm-row-main">
          <div class="rm-row-top">
            <span class="rm-folio">{{ r.folio }}</span>
            <span class="rm-pill" :style="{ background: RMA_ESTADOS[r.status].bg, color: RMA_ESTADOS[r.status].color }">{{ RMA_ESTADOS[r.status].label }}</span>
          </div>
          <div class="rm-prod">{{ r.productName }}</div>
          <div class="rm-row-sub">
            <span class="rm-mono">{{ r.sku }}</span>
            <span v-if="r.serie">· Serie {{ r.serie }}</span>
            <template v-if="personal"><span>·</span><User :size="12" /> {{ r.cliente.name }}</template>
          </div>
        </div>
        <div class="rm-row-meta">
          <span>{{ fecha(r.createdAt) }}</span>
          <span v-if="r.folioProveedor">Proveedor: {{ r.folioProveedor }}</span>
        </div>
        <ChevronRight :size="16" class="rm-chev" />
      </NuxtLink>
    </div>

    <!-- Alta de garantía -->
    <Teleport to="body">
      <div v-if="modal" class="rm-backdrop" @click.self="!guardando && (modal = false)">
        <form class="rm-modal" @submit.prevent="guardar">
          <h2>Nueva garantía</h2>
          <p class="rm-muted">Registra el producto que entrega el cliente. Se genera un folio RMA y su comprobante de recepción.</p>

          <div class="rm-field">
            <span>Cliente</span>
            <FilterCombo v-model="form.clientId" :options="opcionesClientes" label="Cliente" buscar-al-escribir empty-label="Elegir…" count-label="pedido" placeholder="Buscar por nombre, empresa o número…" class="rm-combo" />
          </div>

          <div v-if="form.clientId" class="rm-field">
            <span>Producto</span>
            <select v-model="form.producto" class="rm-input">
              <option value="">Otro producto (capturar a mano)</option>
              <optgroup v-for="o in pedidosCliente" :key="o.id" :label="`Pedido PED-${o.id.slice(-8).toUpperCase()} · ${fecha(o.createdAt)}`">
                <option v-for="it in o.items" :key="`${o.id}|${it.productId}`" :value="`${o.id}|${it.productId}`">{{ it.sku }} — {{ it.name.slice(0, 70) }}</option>
              </optgroup>
            </select>
            <small v-if="cargandoPedidos">Cargando pedidos del cliente…</small>
            <small v-else-if="vigencia" :class="['rm-vig', vigencia.vencida ? 'off' : 'ok']">
              Comprado el {{ vigencia.compra }} · Garantía {{ vigencia.garantia ?? 'no indicada' }}<template v-if="vigencia.vence"> · {{ vigencia.vencida ? 'venció' : 'vigente hasta' }} el {{ vigencia.vence }}</template>
            </small>
          </div>

          <div v-if="!form.producto" class="rm-grid">
            <label class="rm-field"><span>Modelo</span><input v-model="form.sku" class="rm-input" maxlength="80" required /></label>
            <label class="rm-field"><span>Descripción</span><input v-model="form.productName" class="rm-input" maxlength="300" required /></label>
          </div>

          <div class="rm-grid">
            <label class="rm-field"><span>Número de serie</span><input v-model="form.serie" class="rm-input" maxlength="120" /></label>
            <label class="rm-field"><span>Cantidad</span><input v-model.number="form.quantity" type="number" min="1" max="999" class="rm-input" required /></label>
          </div>
          <label class="rm-field"><span>Falla que reporta el cliente</span><textarea v-model="form.falla" class="rm-input rm-area" rows="3" maxlength="2000" required placeholder="Ej. No enciende, se reinicia, no graba…" /></label>
          <label class="rm-field"><span>Accesorios que entrega (opcional)</span><input v-model="form.accesorios" class="rm-input" maxlength="300" placeholder="Ej. Eliminador, caja, cable" /></label>

          <p v-if="formError" class="rm-error">{{ formError }}</p>
          <div class="rm-actions">
            <button type="button" class="rm-btn rm-btn-ghost" :disabled="guardando" @click="modal = false">Cancelar</button>
            <button type="submit" class="rm-btn rm-btn-primary" :disabled="guardando || !form.clientId">{{ guardando ? 'Guardando…' : 'Registrar garantía' }}</button>
          </div>
        </form>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Plus, Search, ShieldCheck, User, ChevronRight } from '@lucide/vue'
import type { Order } from '~/types'
import type { RmaEstado } from '~/utils/rma'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Garantías — SIEEG' })

interface RmaRow {
  id: string; folio: string; status: RmaEstado; sku: string; productName: string; serie: string | null; folioProveedor: string | null; createdAt: string
  cliente: { name: string }
}

const auth     = useAuthStore()
const personal = computed(() => ['admin', 'seller', 'approver'].includes(auth.user?.role ?? ''))
const registra = computed(() => ['admin', 'seller'].includes(auth.user?.role ?? ''))

const rmas    = ref<RmaRow[]>([])
const loading = ref(true)
const error   = ref('')
const search  = ref('')
const estado  = ref('')

let reqId = 0
async function cargar() {
  const id = ++reqId
  loading.value = true; error.value = ''
  try {
    const r = await $fetch<{ rmas: RmaRow[] }>('/api/rma', { query: { status: estado.value || undefined, search: search.value.trim() || undefined } })
    if (id === reqId) rmas.value = r.rmas
  } catch (e: any) {
    if (id === reqId) error.value = e?.data?.message ?? 'No se pudieron cargar las garantías'
  } finally { if (id === reqId) loading.value = false }
}
let t: ReturnType<typeof setTimeout>
watch(search, () => { clearTimeout(t); t = setTimeout(cargar, 350) })
watch(estado, cargar)
onMounted(cargar)

// ── Alta ──
const { opciones: opcionesClientes, cargar: cargarClientes, clientes } = useClientes()
const modal     = ref(false)
const guardando = ref(false)
const formError = ref('')
const form = reactive({ clientId: '', producto: '', sku: '', productName: '', serie: '', quantity: 1, falla: '', accesorios: '' })
const pedidosCliente  = ref<Order[]>([])
const cargandoPedidos = ref(false)

function abrirNueva() {
  Object.assign(form, { clientId: '', producto: '', sku: '', productName: '', serie: '', quantity: 1, falla: '', accesorios: '' })
  formError.value = ''
  modal.value = true
  if (!clientes.value.length) cargarClientes()
}

watch(() => form.clientId, async (id) => {
  form.producto = ''; pedidosCliente.value = []
  if (!id) return
  cargandoPedidos.value = true
  try {
    const r = await $fetch<{ orders: Order[] }>('/api/orders', { query: { cliente: id, per_page: 50 } })
    pedidosCliente.value = r.orders.filter(o => !['rejected', 'cancelled'].includes(o.status))
  } catch { /* sin pedidos: captura manual */ } finally { cargandoPedidos.value = false }
})

// Si el producto viene de un pedido: ¿sigue en garantía? (fecha de compra + garantía del fabricante)
const vigencia = computed(() => {
  if (!form.producto) return null
  const [orderId, productId] = form.producto.split('|')
  const o = pedidosCliente.value.find(x => x.id === orderId)
  const it = o?.items.find(i => i.productId === productId)
  if (!o || !it) return null
  const compra = new Date(o.createdAt)
  const m = /^(\d+)\s*(año|mes)/i.exec(it.garantia ?? '')
  let vence: Date | null = null
  if (m) { vence = new Date(compra); if (/año/i.test(m[2])) vence.setFullYear(vence.getFullYear() + Number(m[1])); else vence.setMonth(vence.getMonth() + Number(m[1])) }
  return { compra: fecha(o.createdAt), garantia: it.garantia ?? null, vence: vence ? fecha(vence.toISOString()) : null, vencida: !!vence && vence.getTime() < Date.now() }
})

async function guardar() {
  guardando.value = true; formError.value = ''
  const [orderId, productId] = form.producto ? form.producto.split('|') : [undefined, undefined]
  try {
    const r = await $fetch<{ rma: { id: string } }>('/api/rma', {
      method: 'POST',
      body: {
        clientId: form.clientId, orderId, productId, sku: form.sku, productName: form.productName,
        serie: form.serie, quantity: form.quantity, falla: form.falla, accesorios: form.accesorios,
      },
    })
    modal.value = false
    await navigateTo(`/garantias/${r.rma.id}`)
  } catch (e: any) {
    formError.value = e?.data?.message ?? 'No se pudo registrar la garantía'
  } finally { guardando.value = false }
}

const fecha = (iso: string) => new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
</script>

<style scoped>
.rm { display: flex; flex-direction: column; gap: 18px; font-family: 'Inter', system-ui, sans-serif; color: #0B1B33; }
.rm-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.rm-head h1 { font-size: 22px; font-weight: 800; margin: 0; }
.rm-head p { font-size: 13px; color: #5B6B82; margin: 4px 0 0; }
.rm-card { background: #fff; border: 1px solid #E4E9F1; border-radius: 16px; }
.rm-btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 40px; padding: 0 16px; border-radius: 10px; font-size: 13.5px; font-weight: 600; font-family: inherit; cursor: pointer; text-decoration: none; white-space: nowrap; }
.rm-btn:disabled { opacity: .55; cursor: not-allowed; }
.rm-btn-primary { background: #1570EF; color: #fff; border: none; box-shadow: 0 4px 14px rgba(21,112,239,0.28); }
.rm-btn-primary:hover:not(:disabled) { background: #0B5BD3; }
.rm-btn-ghost { background: #fff; color: #0B1B33; border: 1px solid #D5DEEA; }

.rm-filters { display: flex; flex-direction: column; gap: 12px; padding: 14px 16px; }
.rm-search { display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 12px; border-radius: 10px; background: #F5F8FC; border: 1px solid #E4E9F1; color: #5F6E84; max-width: 560px; }
.rm-search:focus-within { border-color: #1570EF; background: #fff; }
.rm-search input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font-size: 13.5px; color: #0B1B33; font-family: inherit; }
.rm-tabs { display: flex; gap: 4px; padding: 4px; background: #F5F8FC; border: 1px solid #E4E9F1; border-radius: 10px; overflow-x: auto; max-width: 100%; }
.rm-tabs button { flex-shrink: 0; height: 32px; padding: 0 12px; border: none; border-radius: 7px; background: transparent; color: #5B6B82; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.rm-tabs button.active { background: #0B1B33; color: #fff; }

.rm-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 48px 16px; text-align: center; color: #5B6B82; font-size: 13.5px; }
.rm-empty strong { color: #0B1B33; font-size: 15px; }
.rm-empty span { max-width: 520px; line-height: 1.55; }

.rm-list { display: flex; flex-direction: column; gap: 10px; }
.rm-row { display: grid; grid-template-columns: minmax(0, 1fr) auto 18px; align-items: center; gap: 20px; padding: 16px 18px; background: #fff; border: 1px solid #E4E9F1; border-radius: 14px; text-decoration: none; color: inherit; transition: border-color .2s, box-shadow .2s; }
.rm-row:hover { border-color: rgba(21,112,239,0.35); box-shadow: 0 8px 22px rgba(11,27,51,0.07); }
.rm-row-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.rm-folio { font-size: 15px; font-weight: 800; font-family: ui-monospace, 'SF Mono', Menlo, monospace; letter-spacing: .3px; }
.rm-pill { font-size: 11.5px; font-weight: 700; padding: 3px 9px; border-radius: 999px; }
.rm-prod { margin-top: 6px; font-size: 13.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rm-row-sub { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 4px; font-size: 12.5px; color: #5B6B82; }
.rm-mono { font-family: ui-monospace, Menlo, monospace; color: #0B5BD3; font-weight: 600; }
.rm-row-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; font-size: 12px; color: #5B6B82; white-space: nowrap; }
.rm-chev { color: #5F6E84; }

.rm-backdrop { position: fixed; inset: 0; z-index: 1050; background: rgba(11,27,51,0.45); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 16px; }
.rm-modal { width: 100%; max-width: 560px; max-height: calc(100vh - 32px); overflow-y: auto; background: #fff; border-radius: 20px; padding: 24px; box-shadow: 0 32px 80px rgba(11,27,51,0.2); display: flex; flex-direction: column; gap: 14px; }
.rm-modal h2 { margin: 0; font-size: 19px; font-weight: 800; }
.rm-muted { margin: -8px 0 0; font-size: 13px; color: #5B6B82; line-height: 1.55; }
.rm-field { display: flex; flex-direction: column; gap: 6px; font-size: 12px; font-weight: 600; color: #5B6B82; min-width: 0; }
.rm-field small { font-weight: 500; color: #5F6E84; }
.rm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.rm-input { width: 100%; height: 40px; padding: 0 12px; border-radius: 10px; border: 1px solid #D5DEEA; background: #fff; font-size: 13.5px; color: #0B1B33; font-family: inherit; outline: none; box-sizing: border-box; }
.rm-input:focus { border-color: rgba(21,112,239,0.5); }
.rm-area { height: auto; padding: 10px 12px; resize: vertical; line-height: 1.5; }
.rm-combo :deep(.fc-trigger) { width: 100%; max-width: none; }
.rm-error { margin: 0; padding: 9px 11px; border-radius: 9px; background: #FEF2F2; color: #B91C1C; font-size: 12.5px; }
.rm-actions { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }

@media (max-width: 640px) {
  .rm-row { grid-template-columns: minmax(0, 1fr); gap: 8px; padding: 14px; }
  .rm-row-meta { flex-direction: row; gap: 10px; align-items: center; }
  .rm-chev { display: none; }
  .rm-grid { grid-template-columns: 1fr; }
}
.rm-vig { display: block; margin-top: 6px; font-size: 12px; font-weight: 600; }
.rm-vig.ok { color: #15803D; }
.rm-vig.off { color: #B91C1C; }
</style>
