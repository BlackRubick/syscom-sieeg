<template>
  <Transition name="fade">
    <div v-if="show" style="position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);z-index:200;" @click.self="$emit('close')" />
  </Transition>

  <Transition name="modal">
    <div v-if="show"
      style="position:fixed;inset:5%;max-width:900px;margin:0 auto;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.1);border-radius:20px;box-shadow:0 32px 80px rgba(0,0,0,0.7);overflow-y:auto;z-index:201;font-family:'Inter',system-ui,sans-serif;">

      <!-- Close -->
      <button @click="$emit('close')"
        style="position:absolute;top:16px;right:16px;width:34px;height:34px;border-radius:9px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;color:rgba(148,163,184,0.8);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>

      <!-- Skeleton -->
      <div v-if="loading" style="padding:28px;display:grid;grid-template-columns:1fr 1fr;gap:28px;">
        <div class="shimmer-bg" style="aspect-ratio:1;border-radius:14px;" />
        <div style="display:flex;flex-direction:column;gap:14px;padding-top:8px;">
          <div class="shimmer-bg" style="width:60%;height:11px;border-radius:8px;" />
          <div class="shimmer-bg" style="width:90%;height:22px;border-radius:8px;" />
          <div class="shimmer-bg" style="width:50%;height:14px;border-radius:8px;" />
          <div class="shimmer-bg" style="width:40%;height:28px;border-radius:8px;" />
          <div class="shimmer-bg" style="width:100%;height:60px;border-radius:10px;" />
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" style="padding:40px;display:flex;flex-direction:column;align-items:center;gap:12px;color:#fb7185;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div style="font-size:14px;font-weight:600;">No se pudo cargar el producto</div>
        <div style="font-size:12px;color:rgba(100,116,139,0.8);">{{ error }}</div>
      </div>

      <!-- Content -->
      <div v-else-if="displayProduct">
        <!-- Top: image + info -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;padding:28px 28px 20px;">

          <!-- Images -->
          <div>
            <div style="position:relative;border-radius:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);overflow:hidden;aspect-ratio:1;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
              <img v-if="images.length" :src="images[imgIdx]" :alt="displayProduct.name"
                style="width:90%;height:90%;object-fit:contain;transition:opacity 0.2s;" />
              <div v-else style="width:72px;height:72px;border-radius:18px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.18);display:flex;align-items:center;justify-content:center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              </div>
              <template v-if="images.length > 1">
                <button @click="imgIdx = (imgIdx - 1 + images.length) % images.length"
                  style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:32px;height:32px;border-radius:8px;background:rgba(0,0,0,0.5);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#CBD5E1;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button @click="imgIdx = (imgIdx + 1) % images.length"
                  style="position:absolute;right:8px;top:50%;transform:translateY(-50%);width:32px;height:32px;border-radius:8px;background:rgba(0,0,0,0.5);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#CBD5E1;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </template>
            </div>
            <!-- Thumbnails -->
            <div v-if="images.length > 1" style="display:flex;gap:6px;justify-content:center;">
              <button v-for="(url, i) in images.slice(0,6)" :key="i" @click="imgIdx=i"
                :style="{ width:'48px', height:'48px', borderRadius:'8px', overflow:'hidden', border:`2px solid ${imgIdx===i?'#0EA5E9':'rgba(255,255,255,0.07)'}`, padding:0, cursor:'pointer', background:'rgba(255,255,255,0.03)' }">
                <img :src="url" style="width:100%;height:100%;object-fit:contain;" />
              </button>
            </div>
          </div>

          <!-- Info -->
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <span style="font-size:11px;padding:3px 9px;border-radius:5px;background:rgba(255,255,255,0.05);color:rgba(100,116,139,0.8);font-weight:500;">{{ displayProduct.category }}</span>
              <span style="font-size:11px;padding:3px 9px;border-radius:5px;background:rgba(14,165,233,0.1);color:#38bdf8;font-weight:600;">{{ displayProduct.supplier }}</span>
            </div>

            <h2 style="font-size:18px;font-weight:800;color:#F1F5F9;margin:0;line-height:1.3;">{{ displayProduct.name }}</h2>

            <div style="display:flex;align-items:center;gap:6px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(100,116,139,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
              <span style="font-size:12px;font-family:monospace;color:rgba(100,116,139,0.8);">{{ displayProduct.sku }}</span>
            </div>

            <div>
              <div style="font-size:28px;font-weight:800;color:#F1F5F9;letter-spacing:-0.5px;line-height:1;">
                {{ displayProduct.price > 0 ? fmtCurrency(displayProduct.price) : 'Consultar precio' }}
              </div>
              <div v-if="displayProduct.discount" style="display:flex;align-items:center;gap:8px;margin-top:4px;">
                <span style="font-size:13px;color:rgba(100,116,139,0.6);text-decoration:line-through;">{{ fmtCurrency(Math.round(displayProduct.price / (1 - displayProduct.discount / 100))) }}</span>
                <span style="font-size:11px;font-weight:700;color:#34d399;background:rgba(52,211,153,0.1);padding:2px 7px;border-radius:4px;">-{{ displayProduct.discount }}%</span>
              </div>
            </div>

            <div style="display:flex;align-items:center;gap:8px;">
              <span :style="{ fontSize:'13px', fontWeight:600, color:stockTotal>10?'#34d399':stockTotal>0?'#fbbf24':'#fb7185' }">
                {{ stockTotal > 10 ? `${stockTotal} en stock` : stockTotal > 0 ? `Solo ${stockTotal} disponibles` : 'Agotado' }}
              </span>
            </div>

            <!-- Stock por sucursal -->
            <div v-if="existencia && Object.keys(existencia).length" style="background:rgba(255,255,255,0.03);border-radius:10px;padding:10px 12px;">
              <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Stock por sucursal</div>
              <div style="display:flex;flex-direction:column;gap:5px;">
                <div v-for="[suc, raw] in Object.entries(existencia).slice(0,6)" :key="suc" style="display:flex;justify-content:space-between;font-size:12px;">
                  <span style="color:rgba(100,116,139,0.8);text-transform:capitalize;">{{ suc.replace(/_/g,' ') }}</span>
                  <span :style="{ fontWeight:600, color:extractQty(raw)>0?'#E2E8F0':'rgba(100,116,139,0.4)' }">{{ extractQty(raw) }}</span>
                </div>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:8px;margin-top:auto;">
              <button @click="handleAdd" :disabled="stockTotal === 0"
                :style="{ height:'44px', borderRadius:'11px', border:'none', cursor:stockTotal===0?'not-allowed':'pointer', background:added?'rgba(16,185,129,0.15)':'linear-gradient(135deg,#0EA5E9,#0284C7)', color:added?'#34d399':'white', fontSize:'13px', fontWeight:700, fontFamily:'inherit', opacity:stockTotal===0?0.4:1, boxShadow:added?'none':'0 4px 16px rgba(14,165,233,0.3)', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'7px' }">
                <svg v-if="!added" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ added ? 'Agregado al carrito' : 'Agregar al carrito' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom sections -->
        <div style="padding:0 28px 28px;display:flex;flex-direction:column;gap:20px;">

          <!-- Descripción -->
          <div v-if="description">
            <div style="font-size:11px;font-weight:600;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:12px;">Descripción</div>
            <div v-if="isHTML(description)" v-html="description" style="font-size:13px;color:#94a3b8;line-height:1.7;" />
            <p v-else style="font-size:13px;color:#94a3b8;line-height:1.7;margin:0;">{{ description }}</p>
          </div>

          <!-- Características -->
          <div v-if="caracteristicas.length">
            <div style="font-size:11px;font-weight:600;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">Características</div>
            <ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;">
              <li v-for="(c, i) in caracteristicas" :key="i" style="display:flex;gap:8px;font-size:13px;color:#94a3b8;">
                <span style="color:#0EA5E9;flex-shrink:0;margin-top:2px;">—</span>{{ toDisplayString(c) }}
              </li>
            </ul>
          </div>

          <!-- Recursos -->
          <div v-if="recursos.length">
            <div style="font-size:11px;font-weight:600;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">Recursos y manuales</div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              <a v-for="(r, i) in recursos.filter(r => r.path)" :key="i" :href="r.path" target="_blank" rel="noopener noreferrer"
                style="display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:7px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);font-size:12px;color:#38bdf8;text-decoration:none;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                {{ r.recurso ?? 'Recurso' }}
              </a>
            </div>
          </div>

          <MiniProductGrid v-if="related.length"   title="Productos relacionados" :products="related" />
          <MiniProductGrid v-if="accesorios.length" title="Accesorios"             :products="accesorios" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { adaptProduct } from '~/composables/useSyscom'
import type { Product } from '~/types'

const props = defineProps<{ product: Product; show: boolean }>()
const emit  = defineEmits<{ (e: 'close'): void }>()

const cart = useCartStore()

const loading     = ref(true)
const error       = ref<string | null>(null)
const detail      = ref<Record<string, unknown> | null>(null)
const related     = ref<Product[]>([])
const accesorios  = ref<Product[]>([])
const imgIdx      = ref(0)
const added       = ref(false)

const displayProduct = computed(() => {
  if (!detail.value) return props.product
  try { return adaptProduct(detail.value as never) } catch { return props.product }
})

const images = computed(() => {
  const imgs: string[] = []
  const raw = detail.value?.imagenes as Array<{ orden?: number; url?: string }> | undefined
  if (raw?.length) {
    [...raw].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)).forEach(i => { if (i.url) imgs.push(i.url) })
  }
  if (!imgs.length && props.product.images[0]) imgs.push(props.product.images[0])
  return imgs
})

const stockTotal      = computed(() => detail.value ? Number(detail.value.total_existencia) : props.product.stock)
const description     = computed(() => (detail.value?.descripcion as string) ?? '')
const caracteristicas = computed(() => (detail.value?.caracteristicas as unknown[]) ?? [])
const recursos        = computed(() => (detail.value?.recursos as Array<{ recurso?: string; path?: string }>) ?? [])
const existencia      = computed(() => detail.value?.existencia as Record<string, unknown> | undefined)

function extractQty(v: unknown): number {
  if (typeof v === 'number') return v
  if (typeof v === 'string') return parseInt(v, 10) || 0
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>
    const n = o.cantidad ?? o.total ?? o.existencia ?? o.stock
    return typeof n === 'number' ? n : parseInt(String(n ?? '0'), 10) || 0
  }
  return 0
}

function toDisplayString(v: unknown): string {
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>
    return String(o.descripcion ?? o.nombre ?? o.valor ?? o.text ?? JSON.stringify(v))
  }
  return String(v ?? '')
}

function isHTML(v: unknown): v is string {
  return typeof v === 'string' && /<[a-z][\s\S]*>/i.test(v)
}

const fmtCurrency = (n: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)

function handleAdd() {
  if (!displayProduct.value || stockTotal.value === 0) return
  cart.addItem(displayProduct.value)
  added.value = true
  setTimeout(() => { added.value = false }, 1800)
}

// ESC to close
function onKey(e: KeyboardEvent) { if (e.key === 'Escape') emit('close') }
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

async function loadDetail() {
  loading.value = true; error.value = null; detail.value = null
  related.value = []; accesorios.value = []; imgIdx.value = 0

  const id = props.product.id
  const [det, rel, acc] = await Promise.all([
    $fetch<Record<string, unknown>>(`/api/syscom/productos/${id}`).catch(() => null),
    $fetch<unknown[]>(`/api/syscom/productos/${id}/relacionados`).catch(() => []),
    $fetch<unknown[]>(`/api/syscom/productos/${id}/accesorios`).catch(() => []),
  ])

  if (!det || (det as Record<string,unknown>).error) {
    error.value = String((det as Record<string,unknown>)?.error ?? 'No se pudo cargar el producto')
  } else {
    detail.value = det
  }

  const toProducts = (arr: unknown[]) =>
    arr.slice(0, 6).map(p => { try { return adaptProduct(p as never) } catch { return null } }).filter(Boolean) as Product[]

  related.value    = Array.isArray(rel) ? toProducts(rel) : []
  accesorios.value = Array.isArray(acc) ? toProducts(acc) : []
  loading.value    = false
}

watch(() => props.show, (open) => { if (open) loadDetail() })
onMounted(() => { if (props.show) loadDetail() })
</script>
