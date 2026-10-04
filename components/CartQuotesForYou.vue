<template>
  <section v-if="pendientes.length" class="cq">
    <div class="cq-head">
      <FileText :size="16" />
      <strong>Cotizaciones para ti</strong>
      <span>{{ pendientes.length }}</span>
    </div>
    <div v-for="q in pendientes" :key="q.id" class="cq-row">
      <div class="cq-info">
        <div class="cq-title">{{ q.name || `Cotización ${q.folio}` }}<span v-if="q.name" class="cq-folio">{{ q.folio }}</span></div>
        <div class="cq-sub">
          <template v-if="q.vendedor">Preparada por {{ q.vendedor.name }} · </template>{{ fecha(q.createdAt) }} · {{ q.items.length }} producto{{ q.items.length !== 1 ? 's' : '' }}
        </div>
      </div>
      <div class="cq-total">{{ fmt(q.total) }}<span>al cotizar</span></div>
      <div class="cq-actions">
        <NuxtLink :to="`/quotes/${q.id}`" class="cq-btn cq-btn-ghost">Ver</NuxtLink>
        <button type="button" class="cq-btn cq-btn-primary" :disabled="cargando === q.id" @click="pasarAlCarrito(q)">
          {{ cargando === q.id ? 'Cargando…' : 'Pasar al carrito' }}
        </button>
      </div>
    </div>
    <p v-if="error" class="cq-error">{{ error }}</p>
  </section>
</template>

<script setup lang="ts">
import { FileText } from '@lucide/vue'
import type { OrderItem, CartItem } from '~/types'

/* Cotizaciones abiertas a nombre del usuario (p. ej. las que le preparó su vendedor):
   las puede pasar a su carrito y pagarlas o confirmarlas desde ahí. */
const { confirmar } = useConfirmar()
interface QuoteRow {
  id: string; folio: string; name: string | null; total: number; items: OrderItem[]; createdAt: string
  cliente: { id: string }; vendedor: { name: string } | null
}

const auth = useAuthStore()
const cart = useCartStore()
const quotes   = ref<QuoteRow[]>([])
const cargando = ref('')
const error    = ref('')

const pendientes = computed(() => quotes.value.filter(q => q.cliente.id === auth.user?.id && q.id !== cart.quote?.id))

onMounted(async () => {
  if (!auth.user || auth.user.role === 'viewer') return
  try { quotes.value = (await $fetch<{ quotes: QuoteRow[] }>('/api/quotes', { query: { status: 'open' } })).quotes } catch { /* opcional */ }
})

async function pasarAlCarrito(q: QuoteRow) {
  if (cart.items.length && !await confirmar({ titulo: 'Tu carrito ya tiene productos', mensaje: '¿Cambiarlos por los de esta cotización?', aceptar: 'Sí, cambiarlos' })) return
  cargando.value = q.id; error.value = ''
  try {
    // Precios del día para el cliente; los que ya no tienen precio no se cargan
    const r = await $fetch<{ precios: { items: Array<OrderItem & { disponible: boolean }> } | null }>(`/api/quotes/${q.id}`)
    const items: CartItem[] = (r.precios?.items ?? []).filter(i => i.disponible).map(i => ({
      quantity: i.quantity,
      product: {
        id: i.productId, name: i.name, sku: i.sku, price: i.price, images: i.images ?? [], satKey: i.satKey,
        description: '', currency: 'MXN', category: '', supplier: '', supplierId: '', stock: 0, unit: 'pieza',
        tags: [], rating: 0, reviewCount: 0, leadTime: 0, featured: false,
      },
    }))
    if (!items.length) { error.value = 'Los productos de esta cotización ya no están disponibles. Pide una nueva a tu vendedor.'; return }
    await cart.cargarCotizacion({ id: q.id, folio: q.folio, name: q.name, vendedor: q.vendedor?.name ?? null }, items)
  } catch (e: any) {
    error.value = e?.data?.message ?? 'No se pudo cargar la cotización'
  } finally { cargando.value = '' }
}

const fmt   = (n: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
const fecha = (iso: string) => new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
</script>

<style scoped>
.cq { margin-bottom: 16px; padding: 14px 16px; border-radius: 16px; background: #fff; border: 1px solid rgba(21,112,239,0.25); box-shadow: 0 6px 18px rgba(21,112,239,0.07); text-align: left; width: 100%; box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; }
.cq-head { display: flex; align-items: center; gap: 8px; color: #0B5BD3; margin-bottom: 8px; }
.cq-head strong { font-size: 14px; color: #0B1B33; }
.cq-head span { min-width: 20px; height: 20px; padding: 0 6px; border-radius: 10px; background: #1570EF; color: #fff; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }
.cq-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding: 10px 0; border-top: 1px solid #EEF1F6; }
.cq-info { flex: 1; min-width: 200px; }
.cq-title { font-size: 14px; font-weight: 700; color: #0B1B33; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.cq-folio { font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 5px; background: #F1F5FB; color: #0B5BD3; font-family: ui-monospace, Menlo, monospace; }
.cq-sub { margin-top: 2px; font-size: 12px; color: #5B6B82; }
.cq-total { display: flex; flex-direction: column; align-items: flex-end; font-size: 14px; font-weight: 700; color: #0B1B33; }
.cq-total span { font-size: 10.5px; font-weight: 500; color: #5F6E84; }
.cq-actions { display: flex; gap: 8px; }
.cq-btn { display: inline-flex; align-items: center; height: 36px; padding: 0 14px; border-radius: 9px; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; text-decoration: none; white-space: nowrap; }
.cq-btn:disabled { opacity: .6; cursor: not-allowed; }
.cq-btn-primary { background: #1570EF; color: #fff; border: none; }
.cq-btn-primary:hover:not(:disabled) { background: #0B5BD3; }
.cq-btn-ghost { background: #fff; color: #0B1B33; border: 1px solid #D5DEEA; }
.cq-error { margin: 8px 0 0; padding: 8px 10px; border-radius: 8px; background: #FEF2F2; color: #B91C1C; font-size: 12.5px; }
@media (max-width: 560px) {
  .cq-total { align-items: flex-start; }
  .cq-actions { width: 100%; }
  .cq-btn { flex: 1; justify-content: center; }
}
</style>
