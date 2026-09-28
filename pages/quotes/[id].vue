<template>
  <div class="qd">
    <NuxtLink to="/quotes" class="qd-back no-print"><ArrowLeft :size="14" /> Cotizaciones</NuxtLink>

    <div v-if="error" class="qd-card qd-empty">{{ error }}</div>
    <div v-else-if="!quote" class="qd-card qd-empty">Cargando cotización…</div>

    <template v-else>
      <!-- Encabezado (también sale en el PDF) -->
      <header class="qd-card qd-header">
        <div class="qd-brand">
          <img src="/logosieeg.jpg" alt="SIEEG" />
          <div class="qd-brand-data">
            <strong>SIEEG Integradores</strong>
            <span>Boulevard Belisario Domínguez #4213 L5, Tuxtla Gutiérrez, Chiapas</span>
            <span>961 333 6529 · contacto@sieeg.com.mx</span>
          </div>
        </div>
        <div class="qd-folio-box">
          <span class="qd-doc">Cotización</span>
          <span class="qd-folio">{{ quote.folio }}</span>
          <span v-if="quote.name && !editandoNombre" class="qd-name">{{ quote.name }}</span>
          <button v-if="!editandoNombre && puedeCotizar" type="button" class="qd-rename no-print" @click="editarNombre">{{ quote.name ? 'Cambiar nombre' : '+ Ponerle nombre' }}</button>
          <form v-if="editandoNombre" class="qd-rename-form no-print" @submit.prevent="guardarNombre">
            <input ref="nombreInput" v-model="nombre" maxlength="120" placeholder="Ej. Casa de Fulanito" aria-label="Nombre de la cotización" />
            <button type="submit" :disabled="guardandoNombre">{{ guardandoNombre ? '…' : 'Guardar' }}</button>
            <button type="button" class="ghost" @click="editandoNombre = false">Cancelar</button>
          </form>
          <span class="qd-pill no-print" :class="quote.status">{{ ESTADOS[quote.status] }}</span>
          <span class="qd-date">{{ fechaLarga(quote.createdAt) }}</span>
        </div>
      </header>

      <div class="qd-grid">
        <section class="qd-card qd-box">
          <h3>Cliente</h3>
          <div class="qd-kv"><span>Nombre</span><b>{{ quote.cliente.name }}<span v-if="quote.cliente.clientNumber" class="qd-cl">{{ formatClientNumber(quote.cliente.clientNumber) }}</span></b></div>
          <div v-if="quote.cliente.razonSocial" class="qd-kv"><span>Empresa</span><b>{{ quote.cliente.razonSocial }}</b></div>
          <div v-if="quote.cliente.rfc" class="qd-kv"><span>RFC</span><b>{{ quote.cliente.rfc }}</b></div>
          <div class="qd-kv"><span>Correo</span><b>{{ quote.cliente.email }}</b></div>
          <div v-if="quote.cliente.telefono" class="qd-kv"><span>Teléfono</span><b>{{ quote.cliente.telefono }}</b></div>
        </section>
        <section class="qd-card qd-box">
          <h3>Atiende</h3>
          <div class="qd-kv"><span>Vendedor</span><b>{{ quote.vendedor?.name ?? 'Compra directa' }}</b></div>
          <div v-if="quote.vendedor" class="qd-kv"><span>Correo</span><b>{{ quote.vendedor.email }}</b></div>
          <div class="qd-kv"><span>Precios</span><b>{{ quote.status === 'open' ? `Del día (${fechaCorta(hoy)})` : 'Al momento de cotizar' }}</b></div>
          <div v-if="quote.orderId" class="qd-kv no-print"><span>Pedido</span><b><NuxtLink :to="`/orders?pedido=${quote.orderId}`">#{{ quote.orderId.slice(-8).toUpperCase() }}</NuxtLink></b></div>
        </section>
      </div>

      <!-- Productos -->
      <section class="qd-card qd-items">
        <table>
          <thead>
            <tr><th>Producto</th><th class="c">Cant.</th><th class="r">Precio u.</th><th class="r">Importe</th></tr>
          </thead>
          <tbody>
            <tr v-for="it in filas" :key="it.productId" :class="{ off: !it.disponible }">
              <td>
                <div class="qd-prod">
                  <img v-if="it.images?.[0]" :src="it.images[0]" alt="" />
                  <div>
                    <div class="qd-prod-name">{{ it.name }}</div>
                    <div class="qd-prod-sku">{{ it.sku }}<span v-if="!it.disponible" class="qd-off">No disponible hoy</span></div>
                  </div>
                </div>
              </td>
              <td class="c">{{ it.quantity }}</td>
              <td class="r">{{ it.disponible ? fmt(it.price) : '—' }}</td>
              <td class="r"><b>{{ it.disponible ? fmt(it.price * it.quantity) : '—' }}</b></td>
            </tr>
          </tbody>
        </table>

        <div class="qd-totals">
          <div v-if="precios?.noDisponibles" class="qd-warn no-print">{{ precios.noDisponibles }} producto{{ precios.noDisponibles !== 1 ? 's' : '' }} ya no {{ precios.noDisponibles !== 1 ? 'tienen' : 'tiene' }} precio en SYSCOM y no se incluiría{{ precios.noDisponibles !== 1 ? 'n' : '' }} en el pedido.</div>
          <div class="qd-trow"><span>Subtotal (sin IVA)</span><span>{{ fmt(desglose.subtotal) }}</span></div>
          <div class="qd-trow"><span>IVA (16%)</span><span>{{ fmt(desglose.iva) }}</span></div>
          <div class="qd-trow"><span>Envío</span><span>{{ envio > 0 ? fmt(envio) : 'Sin costo' }}</span></div>
          <div class="qd-trow qd-total"><span>Total (IVA incluido)</span><span>{{ fmt(total) }}</span></div>
          <div v-if="quote.status === 'open' && Math.abs(total - quote.total) >= 0.01" class="qd-note no-print">
            Al cotizar el total era {{ fmt(quote.total) }}; SYSCOM actualizó precios desde entonces.
          </div>
        </div>
      </section>

      <section v-if="quote.notes" class="qd-card qd-box">
        <h3>Notas</h3>
        <p class="qd-notes">{{ quote.notes }}</p>
      </section>

      <p class="qd-legal">Precios en pesos mexicanos con IVA incluido, sujetos a existencias y a cambio sin previo aviso. Al confirmar el pedido se aplica el precio del día.</p>

      <!-- Acciones -->
      <div class="qd-actions no-print">
        <div v-if="accionError" class="qd-error">{{ accionError }}</div>
        <button v-if="quote.status === 'open' && puedeConvertir" class="qd-btn qd-btn-primary" :disabled="!!accion || !precios || precios.noDisponibles === filas.length" @click="convertir">
          <CheckCircle :size="16" /> {{ accion === 'convertir' ? 'Generando pedido…' : esCliente ? 'Aceptar y generar pedido' : 'Convertir en pedido' }}
        </button>
        <button class="qd-btn qd-btn-ghost" @click="imprimir"><Download :size="16" /> Descargar PDF</button>
        <button v-if="puedeCotizar" class="qd-btn qd-btn-ghost" :disabled="!!accion" @click="alCarrito"><ShoppingCart :size="16" /> {{ quote.status === 'open' ? 'Editar en el carrito' : 'Volver a cotizar' }}</button>
        <button v-if="quote.status === 'open' && puedeCotizar" class="qd-btn qd-btn-danger" :disabled="!!accion" @click="cancelar">{{ accion === 'cancelar' ? 'Cancelando…' : 'Cancelar cotización' }}</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, CheckCircle, Download, ShoppingCart } from '@lucide/vue'
import type { OrderItem, Product } from '~/types'

definePageMeta({ middleware: 'auth' })

interface ItemPrecio extends OrderItem { disponible: boolean }
interface Quote {
  id: string; folio: string; name: string | null; status: 'open' | 'converted' | 'cancelled'; items: OrderItem[]; total: number; notes: string | null
  orderId: string | null; createdAt: string
  cliente: { id: string; name: string; email: string; clientNumber: number | null; razonSocial: string | null; rfc: string | null; telefono: string | null }
  vendedor: { id: string; name: string; email: string } | null
}
interface Precios { items: ItemPrecio[]; subtotal: number; envio: number; total: number; noDisponibles: number }

const route = useRoute()
const auth  = useAuthStore()
const cart  = useCartStore()
const clienteCarrito = useClienteCarrito()

const quote   = ref<Quote | null>(null)
const precios = ref<Precios | null>(null)
const error   = ref('')
const hoy     = new Date().toISOString()

const ESTADOS = { open: 'Abierta', converted: 'Convertida en pedido', cancelled: 'Cancelada' } as const

async function cargar() {
  try {
    const r = await $fetch<{ quote: Quote; precios: Precios | null }>(`/api/quotes/${route.params.id}`)
    quote.value = r.quote; precios.value = r.precios
  } catch (e: any) {
    error.value = e?.data?.message ?? 'No se pudo cargar la cotización'
  }
}
onMounted(cargar)

const esCliente      = computed(() => quote.value?.cliente.id === auth.user?.id)
const puedeCotizar   = computed(() => auth.user?.role !== 'viewer')
const puedeConvertir = computed(() => esCliente.value || ['admin', 'seller'].includes(auth.user?.role ?? ''))

// Abiertas: precio del día; convertidas/canceladas: lo que se guardó
const filas = computed<ItemPrecio[]>(() => precios.value?.items ?? (quote.value?.items ?? []).map(i => ({ ...i, disponible: true })))
const envio = computed(() => precios.value?.envio ?? Math.max(0, (quote.value?.total ?? 0) - totalDe(quote.value?.items ?? [])))
const total = computed(() => precios.value?.total ?? quote.value?.total ?? 0)
const desglose = computed(() => desgloseTotales(total.value))

const accion      = ref<'' | 'convertir' | 'cancelar'>('')
const accionError = ref('')

async function convertir() {
  if (!quote.value) return
  const msg = esCliente.value
    ? `¿Aceptar ${quote.value.folio} y generar el pedido por ${fmt(total.value)}?`
    : `¿Convertir ${quote.value.folio} en pedido para ${quote.value.cliente.name} por ${fmt(total.value)}?`
  if (!confirm(msg)) return
  accion.value = 'convertir'; accionError.value = ''
  try {
    await $fetch(`/api/quotes/${quote.value.id}/convert`, { method: 'POST', body: {} })
    await navigateTo('/orders')
  } catch (e: any) {
    accionError.value = e?.data?.message ?? 'No se pudo generar el pedido'
  } finally { accion.value = '' }
}

async function cancelar() {
  if (!quote.value || !confirm(`¿Cancelar la cotización ${quote.value.folio}?`)) return
  accion.value = 'cancelar'; accionError.value = ''
  try {
    const r = await $fetch<{ quote: Quote }>(`/api/quotes/${quote.value.id}`, { method: 'PATCH', body: { status: 'cancelled' } })
    quote.value = r.quote; precios.value = null
  } catch (e: any) {
    accionError.value = e?.data?.message ?? 'No se pudo cancelar'
  } finally { accion.value = '' }
}

// Carga los productos al carrito (y el cliente, si es vendedor/admin) para editar y guardar de nuevo
async function alCarrito() {
  if (!quote.value) return
  if (cart.items.length && !confirm('Tu carrito tiene productos. ¿Reemplazarlos por los de esta cotización?')) return
  await cart.clearCart()
  for (const it of filas.value) {
    const producto: Product = {
      id: it.productId, name: it.name, sku: it.sku, price: it.price, images: it.images ?? [], satKey: it.satKey,
      description: '', currency: 'MXN', category: '', supplier: '', supplierId: '', stock: 0, unit: 'pieza',
      tags: [], rating: 0, reviewCount: 0, leadTime: 0, featured: false,
    }
    await cart.addItem(producto, it.quantity)
  }
  if (!esCliente.value) clienteCarrito.value = quote.value.cliente.id
  await navigateTo('/cart')
}

function imprimir() { window.print() }

// ── Nombre de la cotización ──
const editandoNombre  = ref(false)
const guardandoNombre = ref(false)
const nombre          = ref('')
const nombreInput     = ref<HTMLInputElement | null>(null)
function editarNombre() {
  nombre.value = quote.value?.name ?? ''
  editandoNombre.value = true
  nextTick(() => nombreInput.value?.focus())
}
async function guardarNombre() {
  if (!quote.value) return
  guardandoNombre.value = true; accionError.value = ''
  try {
    const r = await $fetch<{ quote: Quote }>(`/api/quotes/${quote.value.id}`, { method: 'PATCH', body: { name: nombre.value } })
    quote.value = { ...quote.value, name: r.quote.name }
    editandoNombre.value = false
  } catch (e: any) {
    accionError.value = e?.data?.message ?? 'No se pudo guardar el nombre'
  } finally { guardandoNombre.value = false }
}

const fmt        = (n: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
const fechaLarga = (iso: string) => new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
const fechaCorta = (iso: string) => new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })

useHead(() => ({ title: quote.value ? `${quote.value.name ?? quote.value.folio} — ${quote.value.cliente.name}` : 'Cotización' }))
</script>

<style scoped>
.qd { display: flex; flex-direction: column; gap: 16px; max-width: 980px; margin: 0 auto; width: 100%; font-family: 'Inter', system-ui, sans-serif; color: #0B1B33; }
.qd-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #0B5BD3; width: fit-content; }
.qd-card { background: #fff; border: 1px solid #E4E9F1; border-radius: 16px; }
.qd-empty { padding: 48px 16px; text-align: center; color: #5B6B82; }

.qd-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap; padding: 22px 24px; }
.qd-brand { display: flex; align-items: center; gap: 16px; min-width: 0; }
.qd-brand img { height: 54px; width: auto; }
.qd-brand-data { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: #5B6B82; }
.qd-brand-data strong { font-size: 15px; color: #0B1B33; }
.qd-folio-box { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.qd-doc { font-size: 11px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: #1570EF; }
.qd-folio { font-size: 26px; font-weight: 800; font-family: ui-monospace, 'SF Mono', Menlo, monospace; letter-spacing: .5px; }
.qd-date { font-size: 12.5px; color: #5B6B82; }
.qd-name { font-size: 15px; font-weight: 700; color: #13294B; text-align: right; max-width: 320px; }
.qd-rename { border: none; background: none; padding: 0; color: #0B5BD3; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit; }
.qd-rename-form { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.qd-rename-form input { height: 34px; width: 220px; max-width: 100%; padding: 0 10px; border-radius: 8px; border: 1px solid #1570EF; font-size: 13px; font-family: inherit; outline: none; }
.qd-rename-form button { height: 34px; padding: 0 12px; border-radius: 8px; border: none; background: #1570EF; color: #fff; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit; }
.qd-rename-form button.ghost { background: #fff; color: #5B6B82; border: 1px solid #D5DEEA; }
.qd-pill { font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 999px; }
.qd-pill.open { background: #EAF2FF; color: #0B5BD3; }
.qd-pill.converted { background: #ECFDF3; color: #15803D; }
.qd-pill.cancelled { background: #F1F3F6; color: #5B6B82; }

.qd-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.qd-box { padding: 18px 20px; }
.qd-box h3 { margin: 0 0 12px; font-size: 12px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #5B6B82; }
.qd-kv { display: flex; justify-content: space-between; gap: 16px; padding: 6px 0; font-size: 13px; border-bottom: 1px dashed #EEF1F6; }
.qd-kv:last-child { border-bottom: none; }
.qd-kv span { color: #5B6B82; flex-shrink: 0; }
.qd-kv b { font-weight: 600; text-align: right; overflow-wrap: anywhere; }
.qd-kv a { color: #0B5BD3; }
.qd-cl { margin-left: 6px; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 5px; background: #F1F5FB; color: #0B5BD3; font-family: ui-monospace, Menlo, monospace; }

.qd-items { overflow: hidden; }
.qd-items table { width: 100%; border-collapse: collapse; font-size: 13px; }
.qd-items th { text-align: left; padding: 12px 18px; font-size: 11px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #5B6B82; background: #F5F8FC; border-bottom: 1px solid #E4E9F1; }
.qd-items td { padding: 12px 18px; border-bottom: 1px solid #EEF1F6; vertical-align: middle; }
.qd-items .c { text-align: center; }
.qd-items .r { text-align: right; white-space: nowrap; }
.qd-items tr.off td { color: #7A889C; }
.qd-prod { display: flex; align-items: center; gap: 12px; }
.qd-prod img { width: 44px; height: 44px; object-fit: contain; border-radius: 8px; border: 1px solid #EEF1F6; background: #fff; flex-shrink: 0; }
.qd-prod-name { font-weight: 600; line-height: 1.35; }
.qd-prod-sku { margin-top: 2px; font-size: 11.5px; color: #5B6B82; font-family: ui-monospace, Menlo, monospace; }
.qd-off { margin-left: 8px; font-family: 'Inter', sans-serif; font-weight: 700; color: #DC2626; }

.qd-totals { display: flex; flex-direction: column; gap: 6px; margin-left: auto; width: min(360px, 100%); padding: 16px 18px 18px; }
.qd-trow { display: flex; justify-content: space-between; font-size: 13px; color: #5B6B82; }
.qd-total { margin-top: 6px; padding-top: 10px; border-top: 1px solid #E4E9F1; font-size: 16px; font-weight: 800; color: #0B1B33; }
.qd-note { font-size: 11.5px; color: #B45309; }
.qd-warn { padding: 8px 10px; border-radius: 8px; background: #FEF2F2; color: #B91C1C; font-size: 12px; }
.qd-notes { margin: 0; font-size: 13.5px; line-height: 1.6; white-space: pre-line; }
.qd-legal { margin: 0; font-size: 11.5px; color: #7A889C; text-align: center; }

.qd-actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; }
.qd-btn { display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: 0 18px; border-radius: 11px; font-size: 13.5px; font-weight: 700; font-family: inherit; cursor: pointer; }
.qd-btn:disabled { opacity: .55; cursor: not-allowed; }
.qd-btn-primary { background: #1570EF; color: #fff; border: none; box-shadow: 0 4px 16px rgba(21,112,239,0.3); }
.qd-btn-primary:hover:not(:disabled) { background: #0B5BD3; }
.qd-btn-ghost { background: #fff; color: #0B1B33; border: 1px solid #D5DEEA; }
.qd-btn-ghost:hover:not(:disabled) { background: #F5F8FC; }
.qd-btn-danger { background: #fff; color: #DC2626; border: 1px solid rgba(220,38,38,0.3); }
.qd-error { width: 100%; padding: 10px 12px; border-radius: 10px; background: #FEF2F2; color: #B91C1C; font-size: 13px; }

@media (max-width: 700px) {
  .qd-grid { grid-template-columns: minmax(0, 1fr); }
  .qd-folio-box { align-items: flex-start; }
  .qd-items th:nth-child(3), .qd-items td:nth-child(3) { display: none; }
  .qd-items th, .qd-items td { padding: 10px 12px; }
  .qd-prod img { display: none; }
  .qd-btn { flex: 1 1 100%; justify-content: center; }
}
</style>

<style>
/* PDF / impresión: solo la cotización, sin menú ni botones */
@media print {
  @page { size: letter; margin: 14mm; }
  body, .app-shell { background: #fff !important; }
  .sn-topbar, .sn-header, .no-print, .wa, .app-shell > .app-wrap:not(.app-main) { display: none !important; }
  .app-main { padding: 0 !important; max-width: none !important; }
  .qd { max-width: none !important; }
  .qd-card { border-color: #D5DEEA !important; box-shadow: none !important; break-inside: avoid; }
  .qd-items tr { break-inside: avoid; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
