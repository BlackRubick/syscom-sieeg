<template>
  <div class="qt">
    <div class="qt-head">
      <div>
        <h1>{{ veTodas ? 'Cotizaciones' : 'Mis cotizaciones' }}</h1>
        <p>{{ loading ? 'Cargando…' : `${quotes.length} cotizaci${quotes.length !== 1 ? 'ones' : 'ón'}` }}</p>
      </div>
      <NuxtLink v-if="puedeCotizar" to="/catalog" class="qt-btn qt-btn-primary">
        <Plus :size="15" /> Nueva cotización
      </NuxtLink>
    </div>

    <div class="qt-card qt-filters">
      <div class="qt-search">
        <Search :size="15" />
        <input v-model="search" :placeholder="veTodas ? 'Buscar por nombre, folio, cliente o vendedor…' : 'Buscar por nombre o folio…'" />
      </div>
      <div class="qt-tabs">
        <button v-for="t in TABS" :key="t.key" type="button" :class="{ active: estado === t.key }" @click="estado = t.key">{{ t.label }}</button>
      </div>
    </div>

    <div v-if="error" class="qt-card qt-empty">
      <AlertCircle :size="22" /> {{ error }}
      <button class="qt-btn qt-btn-ghost" @click="cargar">Reintentar</button>
    </div>
    <div v-else-if="loading" class="qt-card qt-empty">Cargando cotizaciones…</div>
    <div v-else-if="!quotes.length" class="qt-card qt-empty">
      <FileText :size="26" />
      <strong>Sin cotizaciones</strong>
      <span v-if="puedeCotizar">Arma un carrito en el catálogo y usa <b>Guardar como cotización</b>.</span>
    </div>

    <div v-else class="qt-list">
      <NuxtLink v-for="q in quotes" :key="q.id" :to="`/quotes/${q.id}`" class="qt-row">
        <div class="qt-row-main">
          <div class="qt-row-top">
            <span v-if="q.name" class="qt-name">{{ q.name }}</span>
            <span :class="q.name ? 'qt-cl' : 'qt-folio'">{{ q.folio }}</span>
            <span class="qt-pill" :class="q.status">{{ ESTADOS[q.status] }}</span>
          </div>
          <div class="qt-row-sub">
            <template v-if="veTodas">
              <User :size="12" /> {{ q.cliente.name }}
              <span v-if="q.cliente.clientNumber" class="qt-cl">{{ formatClientNumber(q.cliente.clientNumber) }}</span>
              <span v-if="q.cliente.razonSocial" class="qt-muted">· {{ q.cliente.razonSocial }}</span>
            </template>
            <span v-if="q.vendedor" class="qt-muted">{{ veTodas ? '· ' : '' }}Vendedor: {{ q.vendedor.name }}</span>
          </div>
        </div>
        <div class="qt-row-meta">
          <span>{{ fecha(q.createdAt) }}</span>
          <span>{{ q.items.length }} producto{{ q.items.length !== 1 ? 's' : '' }}</span>
        </div>
        <div class="qt-row-total">
          <b>{{ fmt(q.total) }}</b>
          <span>al cotizar · IVA incl.</span>
        </div>
        <ChevronRight :size="16" class="qt-chev" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Search, FileText, User, ChevronRight, AlertCircle } from '@lucide/vue'
import type { OrderItem } from '~/types'

definePageMeta({ middleware: 'auth' })

interface QuoteRow {
  id: string; folio: string; name: string | null; status: 'open' | 'converted' | 'cancelled'; total: number; items: OrderItem[]; createdAt: string
  cliente: { name: string; clientNumber: number | null; razonSocial: string | null }
  vendedor: { name: string } | null
}

const auth  = useAuthStore()
const route = useRoute()
const veTodas      = computed(() => ['admin', 'approver', 'seller'].includes(auth.user?.role ?? ''))
const puedeCotizar = computed(() => auth.user?.role !== 'viewer')

const ESTADOS = { open: 'Abierta', converted: 'Convertida en pedido', cancelled: 'Cancelada' } as const
const TABS = [
  { key: 'open', label: 'Abiertas' }, { key: 'converted', label: 'Convertidas' },
  { key: 'cancelled', label: 'Canceladas' }, { key: '', label: 'Todas' },
]

const quotes  = ref<QuoteRow[]>([])
const loading = ref(true)
const error   = ref('')
const search  = ref(typeof route.query.search === 'string' ? route.query.search : '')
const estado  = ref(search.value ? '' : 'open')

let reqId = 0
async function cargar() {
  const id = ++reqId
  loading.value = true; error.value = ''
  try {
    const r = await $fetch<{ quotes: QuoteRow[] }>('/api/quotes', {
      query: { status: estado.value || undefined, search: search.value.trim() || undefined },
    })
    if (id === reqId) quotes.value = r.quotes
  } catch (e: any) {
    if (id === reqId) error.value = e?.data?.message ?? 'No se pudieron cargar las cotizaciones'
  } finally {
    if (id === reqId) loading.value = false
  }
}
let t: ReturnType<typeof setTimeout>
watch(search, () => { clearTimeout(t); t = setTimeout(cargar, 350) })
watch(estado, cargar)
onMounted(cargar)

const fmt   = (n: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
const fecha = (iso: string) => new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
</script>

<style scoped>
.qt { display: flex; flex-direction: column; gap: 18px; font-family: 'Inter', system-ui, sans-serif; color: #0B1B33; }
.qt-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.qt-head h1 { font-size: 22px; font-weight: 800; margin: 0; }
.qt-head p { font-size: 13px; color: #5B6B82; margin: 4px 0 0; }
.qt-card { background: #fff; border: 1px solid #E4E9F1; border-radius: 16px; }
.qt-btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 40px; padding: 0 16px; border-radius: 10px; font-size: 13.5px; font-weight: 600; font-family: inherit; cursor: pointer; text-decoration: none; white-space: nowrap; }
.qt-btn-primary { background: #1570EF; color: #fff; border: none; box-shadow: 0 4px 14px rgba(21,112,239,0.28); }
.qt-btn-primary:hover { background: #0B5BD3; }
.qt-btn-ghost { background: #fff; color: #0B1B33; border: 1px solid #E4E9F1; }

.qt-filters { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 14px 16px; }
.qt-search { flex: 1; min-width: 220px; display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 12px; border-radius: 10px; background: #F5F8FC; border: 1px solid #E4E9F1; color: #7A889C; }
.qt-search:focus-within { border-color: #1570EF; background: #fff; }
.qt-search input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font-size: 13.5px; color: #0B1B33; font-family: inherit; }
.qt-tabs { display: flex; gap: 4px; padding: 4px; background: #F5F8FC; border: 1px solid #E4E9F1; border-radius: 10px; overflow-x: auto; max-width: 100%; }
.qt-tabs button { flex-shrink: 0; height: 32px; padding: 0 12px; border: none; border-radius: 7px; background: transparent; color: #5B6B82; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.qt-tabs button.active { background: #0B1B33; color: #fff; }

.qt-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 48px 16px; text-align: center; color: #5B6B82; font-size: 13.5px; }
.qt-empty strong { color: #0B1B33; font-size: 15px; }

.qt-list { display: flex; flex-direction: column; gap: 10px; }
.qt-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto 18px; align-items: center; gap: 20px; padding: 16px 18px; background: #fff; border: 1px solid #E4E9F1; border-radius: 14px; text-decoration: none; color: inherit; transition: border-color .2s, box-shadow .2s; }
.qt-row:hover { border-color: rgba(21,112,239,0.35); box-shadow: 0 8px 22px rgba(11,27,51,0.07); }
.qt-row-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.qt-folio { font-size: 15px; font-weight: 800; font-family: ui-monospace, 'SF Mono', Menlo, monospace; letter-spacing: .3px; }
.qt-name { font-size: 15px; font-weight: 800; }
.qt-pill { font-size: 11.5px; font-weight: 700; padding: 3px 9px; border-radius: 999px; }
.qt-pill.open { background: #EAF2FF; color: #0B5BD3; }
.qt-pill.converted { background: #ECFDF3; color: #15803D; }
.qt-pill.cancelled { background: #F1F3F6; color: #5B6B82; }
.qt-row-sub { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 6px; font-size: 12.5px; color: #13294B; }
.qt-cl { font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 5px; background: #F1F5FB; color: #0B5BD3; font-family: ui-monospace, Menlo, monospace; }
.qt-muted { color: #5B6B82; }
.qt-row-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; font-size: 12px; color: #5B6B82; white-space: nowrap; }
.qt-row-total { display: flex; flex-direction: column; align-items: flex-end; white-space: nowrap; }
.qt-row-total b { font-size: 15px; }
.qt-row-total span { font-size: 11px; color: #7A889C; }
.qt-chev { color: #7A889C; }

@media (max-width: 640px) {
  .qt-row { grid-template-columns: minmax(0, 1fr) auto; gap: 8px 12px; padding: 14px; }
  .qt-row-meta { grid-column: 1; grid-row: 2; flex-direction: row; gap: 10px; align-items: center; }
  .qt-row-total { grid-column: 2; grid-row: 1 / span 2; }
  .qt-chev { display: none; }
}
</style>
