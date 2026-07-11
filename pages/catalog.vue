<template>
  <div class="catalog-root">

    <!-- ───── HEADER ───── -->
    <div class="catalog-header">
      <div>
        <div class="catalog-title-row">
          <h1 class="catalog-title">Catálogo</h1>
          <div v-if="loading && hasFilter" class="status-chip loading-chip">
            <Loader2 :size="11" class="spin" />
            <span>Buscando…</span>
          </div>
          <div v-else-if="hasFilter" class="status-chip results-chip">
            {{ cantidad.toLocaleString('es-MX') }} resultados
          </div>
        </div>
        <p class="catalog-subtitle">
          {{ categories.length > 0 ? `${categories.length} categorías disponibles` : 'Cargando catálogo…' }}
        </p>
      </div>
      <button v-if="hasFilter" @click="clearAll()" class="clear-all-btn">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Limpiar filtros
      </button>
    </div>

    <!-- ───── FILTER PANEL ───── -->
    <div class="filter-panel">

      <!-- Search — full width, protagonista -->
      <div class="search-wrapper">
        <svg class="search-icon" :class="{ active: searchFocused }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="search" placeholder="Buscar por nombre, modelo, marca o SKU…"
          @focus="searchFocused=true" @blur="searchFocused=false"
          class="search-input" :class="{ focused: searchFocused }" />
        <button v-if="search" @click="search=''" class="search-clear" title="Limpiar búsqueda">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <!-- Controls row: sort + brand + active chips -->
      <div class="controls-row">
        <div class="controls-left">

          <!-- Sort -->
          <div class="select-wrap">
            <svg class="select-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
            </svg>
            <select v-model="sortBy" @change="pagina=1" class="styled-select">
              <option v-for="o in SORT_OPTIONS" :key="o.value" :value="o.value" style="background:#0D1B35;">{{ o.label }}</option>
            </select>
            <ChevronDown :size="13" class="select-arrow" />
          </div>

          <!-- Brand filter -->
          <div style="position:relative;flex-shrink:0;">
            <button @click="openBrandDrop()" class="brand-btn" :class="{ active: activeBrandId }">
              <Tag :size="13" :stroke-width="1.8" style="flex-shrink:0;" />
              <span class="brand-label">{{ activeBrandId ? (brands.find(b=>b.id===activeBrandId)?.nombre ?? activeBrandId) : 'Marca' }}</span>
              <span v-if="activeBrandId" @click.stop="clearBrand()" class="brand-x">×</span>
              <ChevronDown v-else :size="12" style="flex-shrink:0;color:rgba(100,116,139,0.7);" />
            </button>
            <Transition name="dropdown">
              <div v-if="brandDropOpen" class="brand-dropdown">
                <div style="padding:8px 8px 4px;">
                  <input v-model="brandSearch" autofocus placeholder="Buscar marca…" class="brand-search-input" />
                </div>
                <div style="max-height:220px;overflow-y:auto;padding-bottom:6px;">
                  <div v-if="loadingBrands" style="padding:16px;text-align:center;font-size:12px;color:rgba(100,116,139,0.7);">Cargando marcas…</div>
                  <button v-else v-for="b in filteredBrands" :key="b.id" @click="selectBrand(b.id)"
                    class="brand-option" :class="{ active: activeBrandId===b.id }">
                    {{ b.nombre }}
                  </button>
                </div>
              </div>
            </Transition>
            <div v-if="brandDropOpen" style="position:fixed;inset:0;z-index:40;" @click="brandDropOpen=false" />
          </div>
        </div>

        <!-- Active filter chips (aligned right) -->
        <div class="active-chips">
          <span v-if="dSearch" class="filter-chip">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            "{{ dSearch.length > 18 ? dSearch.slice(0,18) + '…' : dSearch }}"
            <button @click="search=''" class="chip-x">×</button>
          </span>
          <span v-if="activeCategoryId" class="filter-chip">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            {{ categories.find(c=>c.id===activeCategoryId)?.nombre }}
            <button @click="selectCategory(null)" class="chip-x">×</button>
          </span>
          <span v-if="activeBrandId" class="filter-chip">
            <Tag :size="10" :stroke-width="1.8" />
            {{ brands.find(b=>b.id===activeBrandId)?.nombre ?? activeBrandId }}
            <button @click="clearBrand()" class="chip-x">×</button>
          </span>
        </div>
      </div>

      <!-- Category tabs -->
      <div class="cat-tabs-wrap no-scrollbar">
        <button @click="selectCategory(null)" class="cat-tab" :class="{ active: !activeCategoryId }">
          <LayoutGrid :size="12" :stroke-width="!activeCategoryId?2.2:1.8" />
          Todos
        </button>
        <template v-if="loadingCats">
          <div v-for="i in 8" :key="i" class="cat-tab-skel shimmer-bg" />
        </template>
        <button v-else v-for="cat in categories" :key="cat.id"
          @click="selectCategory(cat.id)" class="cat-tab" :class="{ active: activeCategoryId===cat.id }">
          <Package :size="12" :stroke-width="activeCategoryId===cat.id?2.2:1.8" />
          {{ cat.nombre }}
        </button>
      </div>
    </div>

    <!-- ───── ERROR ───── -->
    <div v-if="apiError" class="error-banner">
      <AlertCircle :size="15" style="flex-shrink:0;" />
      <span><strong>Error:</strong> {{ apiError }}</span>
    </div>

    <!-- ───── INITIAL LOAD ───── -->
    <div v-if="loadingCats || (loading && !products.length && !hasFilter)" class="empty-state">
      <div class="empty-icon">
        <Loader2 :size="22" color="#38bdf8" :stroke-width="1.8" class="spin" />
      </div>
      <div class="empty-title">Cargando inventario Sieeg…</div>
      <div class="empty-sub">Conectando con el catálogo, un momento.</div>
    </div>

    <!-- ───── SKELETON CARDS ───── -->
    <div v-else-if="loading && !products.length" class="product-grid">
      <div v-for="i in 12" :key="i" class="product-card">
        <div class="shimmer-bg" style="height:160px;" />
        <div class="card-body">
          <div class="shimmer-bg" style="height:10px;width:60px;border-radius:20px;" />
          <div class="shimmer-bg" style="height:14px;width:88%;border-radius:6px;margin-top:9px;" />
          <div class="shimmer-bg" style="height:14px;width:68%;border-radius:6px;margin-top:5px;" />
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;">
            <div class="shimmer-bg" style="height:20px;width:84px;border-radius:6px;" />
            <div class="shimmer-bg" style="height:36px;width:88px;border-radius:9px;" />
          </div>
        </div>
      </div>
    </div>

    <!-- ───── PRODUCT GRID ───── -->
    <div v-else-if="products.length">
      <div class="product-grid">
        <div v-for="product in products" :key="product.id"
          class="product-card"
          :class="{ hovered: hoveredId===product.id }"
          @mouseenter="hoveredId=product.id"
          @mouseleave="hoveredId=null">

          <!-- Image -->
          <div class="card-img-wrap">
            <img v-if="product.images[0]" :src="product.images[0]" :alt="product.name"
              class="card-img"
              @error="(e) => (e.currentTarget as HTMLImageElement).style.display='none'" />
            <div v-else class="card-img-placeholder">
              <Package :size="28" color="#38bdf8" :stroke-width="1.6" />
            </div>
            <!-- Hover overlay -->
            <div class="card-img-overlay" />
            <!-- Badges TL -->
            <div class="card-badges">
              <span v-if="product.featured" class="badge-feat">DESTACADO</span>
              <span v-if="product.discount" class="badge-disc">-{{ product.discount }}%</span>
            </div>
            <!-- Stock badge -->
            <span :style="stockBadgeStyle(product)" class="badge-stock">{{ stockLabel(product) }}</span>
          </div>

          <!-- Body -->
          <div class="card-body">
            <span class="card-cat">{{ product.category }}</span>
            <div class="card-name" :class="{ bright: hoveredId===product.id }">{{ product.name }}</div>
            <div v-if="product.sku" class="card-sku">{{ product.sku }}</div>
            <div class="card-supplier">{{ product.supplier }}</div>
            <div class="card-divider" />
            <div class="card-price-row">
              <template v-if="product.price > 0">
                <span class="card-price">{{ fmtCurrency(product.price) }}</span>
                <span v-if="product.discount" class="card-price-old">{{ fmtCurrency(Math.round(product.price / (1 - product.discount / 100))) }}</span>
              </template>
              <span v-else class="card-price-consult">Consultar precio</span>
            </div>
            <div class="card-actions">
              <button @click="handleAdd(product)" :disabled="product.stock===0"
                class="btn-add" :class="{ added: addedIds.has(product.id), out: product.stock===0 }">
                <span v-if="addedIds.has(product.id)" class="btn-inner">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  Agregado
                </span>
                <span v-else class="btn-inner">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Agregar
                </span>
              </button>
              <button @click="openDetail(product)" class="btn-detail" title="Ver detalle">
                <Eye :size="14" :stroke-width="1.8" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="paginas > 1" class="pagination">
        <button @click="pagina=Math.max(1,pagina-1)" :disabled="pagina===1" class="pag-btn pag-prev">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Anterior
        </button>
        <div class="pag-center">
          <span class="pag-cur">{{ pagina }}</span>
          <span class="pag-slash">/</span>
          <span class="pag-total">{{ paginas }}</span>
        </div>
        <button @click="pagina=Math.min(paginas,pagina+1)" :disabled="pagina===paginas" class="pag-btn pag-next">
          Siguiente
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>

    <!-- ───── NO RESULTS ───── -->
    <div v-else-if="hasFilter && !loading" class="empty-state">
      <div class="empty-icon">
        <Search :size="22" color="rgba(100,116,139,0.6)" />
      </div>
      <div class="empty-title">Sin resultados</div>
      <div class="empty-sub">Prueba con otra búsqueda o categoría</div>
      <button @click="clearAll()" class="clear-all-btn" style="margin-top:18px;">
        Limpiar filtros
      </button>
    </div>

  </div>

  <!-- Product detail modal -->
  <ProductModal v-if="detailProduct" :product="detailProduct" :show="!!detailProduct" @close="detailProduct=null" />
</template>

<script setup lang="ts">
import { Search, ChevronDown, Package, AlertCircle, Loader2, LayoutGrid, Eye, Tag } from '@lucide/vue'
import { fetchCategorias, fetchProductos, fetchMarcas } from '~/composables/useSyscom'
import type { Product, SyscomCategoria } from '~/types'

definePageMeta({ middleware: 'auth' })

const cart = useCartStore()

const search        = ref('')
const dSearch       = ref('')  // debounced
const searchFocused = ref(false)
const sortBy        = ref('relevancia')
const pagina        = ref(1)
const categories    = ref<SyscomCategoria[]>([])
const activeCategoryId = ref<string | null>(null)
const brands        = ref<Array<{ id: string; nombre: string }>>([])
const activeBrandId = ref<string | null>(null)
const brandSearch   = ref('')
const brandDropOpen = ref(false)
const loadingBrands = ref(false)
const products      = ref<Product[]>([])
const cantidad      = ref(0)
const paginas       = ref(1)
const loading       = ref(false)
const loadingCats   = ref(true)
const apiError      = ref<string | null>(null)
const hoveredId     = ref<string | null>(null)
const addedIds      = ref(new Set<string>())
const detailProduct = ref<Product | null>(null)

const SORT_OPTIONS = [
  { value:'relevancia',  label:'Relevancia'   },
  { value:'precio:asc',  label:'Precio: menor' },
  { value:'precio:desc', label:'Precio: mayor' },
  { value:'topseller',   label:'Más vendidos'  },
]

const hasFilter = computed(() => !!dSearch.value || !!activeCategoryId.value || !!activeBrandId.value)

const filteredBrands = computed(() => brands.value.filter(b => !brandSearch.value || b.nombre.toLowerCase().includes(brandSearch.value.toLowerCase())).slice(0, 40))

// Debounce search
let debounceTimer: ReturnType<typeof setTimeout>
watch(search, (v) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { dSearch.value = v; pagina.value = 1 }, 250)
})

// Cancel token — incremented to abort any in-progress load
let loadId = 0

// Load categories then kick off the initial full load
onMounted(async () => {
  const cats = await fetchCategorias()
  categories.value = cats
  loadingCats.value = false
  loadProducts()
})

// Reload whenever any filter changes
watch([dSearch, activeCategoryId, activeBrandId, pagina, sortBy], loadProducts)

async function loadAllCategories(myId: number) {
  const seen = new Set<string>()
  for (const cat of categories.value) {
    if (myId !== loadId) return
    const r = await fetchProductos({ categoria: cat.id })
    if (myId !== loadId) return
    const fresh = r.products.filter(p => !seen.has(p.id))
    fresh.forEach(p => seen.add(p.id))
    products.value = [...products.value, ...fresh]
    cantidad.value = products.value.length
    // Hide skeleton as soon as first batch arrives
    if (loading.value && products.value.length > 0) loading.value = false
  }
  if (myId === loadId) loading.value = false
}

async function loadProducts() {
  const myId = ++loadId
  loading.value = true
  apiError.value = null
  products.value = []   // limpia inmediatamente para mostrar skeleton, no datos viejos
  cantidad.value = 0

  if (!hasFilter.value) {
    paginas.value = 1
    loadAllCategories(myId)
    return
  }

  const r = await fetchProductos({
    busqueda:  dSearch.value || undefined,
    categoria: activeCategoryId.value ?? undefined,
    marca:     activeBrandId.value ?? undefined,
    pagina:    pagina.value,
    orden:     sortBy.value,
  })
  if (myId !== loadId) return
  products.value = r.products
  cantidad.value = r.cantidad
  paginas.value  = r.paginas
  if (r.error) apiError.value = r.error
  loading.value = false
}

async function openBrandDrop() {
  brandDropOpen.value = true
  if (brands.value.length || loadingBrands.value) return
  loadingBrands.value = true
  brands.value = await fetchMarcas()
  loadingBrands.value = false
}

function selectBrand(id: string) { activeBrandId.value = id; brandDropOpen.value = false; brandSearch.value = ''; pagina.value = 1 }
function clearBrand() { activeBrandId.value = null; brandSearch.value = ''; pagina.value = 1 }
function selectCategory(id: string | null) { activeCategoryId.value = id; pagina.value = 1 }
function clearAll() { search.value = ''; dSearch.value = ''; activeCategoryId.value = null; clearBrand() }

function handleAdd(product: Product) {
  if (product.stock === 0) return
  cart.addItem(product)
  addedIds.value = new Set([...addedIds.value, product.id])
  setTimeout(() => { addedIds.value.delete(product.id); addedIds.value = new Set(addedIds.value) }, 1600)
}

function openDetail(p: Product) { detailProduct.value = p }

const fmtCurrency = (n: number) => new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' }).format(n)
function stockLabel(p: Product) { return p.stock > 10 ? 'En stock' : p.stock > 0 ? `Solo ${p.stock}` : 'Agotado' }
function stockBadgeStyle(p: Product) { return p.stock > 10 ? { background:'rgba(16,185,129,0.12)', color:'#34d399' } : p.stock > 0 ? { background:'rgba(245,158,11,0.12)', color:'#fbbf24' } : { background:'rgba(244,63,94,0.12)', color:'#fb7185' } }
</script>

<style scoped>
/* ── Root ── */
.catalog-root { font-family: 'Inter', system-ui, sans-serif; display: flex; flex-direction: column; gap: 20px; }

/* ── Header ── */
.catalog-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.catalog-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; flex-wrap: wrap; }
.catalog-title { font-size: 22px; font-weight: 800; color: #F1F5F9; margin: 0; line-height: 1.2; }
.catalog-subtitle { font-size: 13px; color: rgba(100,116,139,0.8); margin: 0; }

.status-chip { display: inline-flex; align-items: center; gap: 6px; padding: 3px 11px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.results-chip { background: rgba(14,165,233,0.1); border: 1px solid rgba(14,165,233,0.2); color: #38bdf8; }
.loading-chip { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(148,163,184,0.7); }

.clear-all-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 9px; background: rgba(244,63,94,0.07); border: 1px solid rgba(244,63,94,0.18); color: #fb7185; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s, border-color 0.2s; }
.clear-all-btn:hover { background: rgba(244,63,94,0.13); border-color: rgba(244,63,94,0.28); }

/* ── Filter panel ── */
.filter-panel { border-radius: 16px; background: linear-gradient(160deg,#0D1B35,#091228); border: 1px solid rgba(255,255,255,0.07); padding: 18px; display: flex; flex-direction: column; gap: 14px; }

/* ── Search ── */
.search-wrapper { position: relative; }
.search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; color: rgba(100,116,139,0.65); transition: color 0.2s; }
.search-icon.active { color: #0EA5E9; }
.search-input { width: 100%; height: 48px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 13px; padding-left: 48px; padding-right: 48px; font-size: 14px; color: #E2E8F0; outline: none; font-family: inherit; box-sizing: border-box; transition: background 0.2s, border-color 0.2s, box-shadow 0.2s; }
.search-input::placeholder { color: rgba(71,85,105,0.75); }
.search-input.focused { background: rgba(14,165,233,0.06); border-color: rgba(14,165,233,0.45); box-shadow: 0 0 0 3px rgba(14,165,233,0.08); }
.search-clear { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.08); border: none; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(148,163,184,0.7); transition: background 0.15s, color 0.15s; }
.search-clear:hover { background: rgba(255,255,255,0.15); color: #E2E8F0; }

/* ── Controls row ── */
.controls-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-height: 38px; }
.controls-left { display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }

/* ── Sort select ── */
.select-wrap { position: relative; display: flex; align-items: center; flex-shrink: 0; }
.select-icon { position: absolute; left: 11px; pointer-events: none; color: rgba(100,116,139,0.7); }
.styled-select { height: 38px; padding-left: 32px; padding-right: 30px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; font-size: 13px; color: #CBD5E1; outline: none; appearance: none; cursor: pointer; font-family: inherit; min-width: 158px; transition: background 0.15s, border-color 0.15s; }
.styled-select:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); }
.styled-select:focus { border-color: rgba(14,165,233,0.4); box-shadow: 0 0 0 2px rgba(14,165,233,0.08); }
.select-arrow { position: absolute; right: 9px; pointer-events: none; color: rgba(100,116,139,0.75); }

/* ── Brand button ── */
.brand-btn { height: 38px; padding: 0 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #CBD5E1; font-size: 13px; font-weight: 400; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 7px; min-width: 138px; justify-content: space-between; transition: background 0.15s, border-color 0.15s, color 0.15s; }
.brand-btn:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); }
.brand-btn.active { border-color: rgba(14,165,233,0.4); background: rgba(14,165,233,0.1); color: #38bdf8; font-weight: 600; }
.brand-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 90px; flex: 1; text-align: left; }
.brand-x { font-size: 14px; line-height: 1; flex-shrink: 0; }

.brand-dropdown { position: absolute; top: 44px; left: 0; width: 240px; background: #0D1B35; border: 1px solid rgba(255,255,255,0.1); border-radius: 13px; overflow: hidden; z-index: 50; box-shadow: 0 16px 40px rgba(0,0,0,0.55); }
.brand-search-input { width: 100%; height: 34px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0 10px; font-size: 12px; color: #E2E8F0; outline: none; font-family: inherit; box-sizing: border-box; }
.brand-option { display: block; width: 100%; padding: 8px 14px; font-size: 12px; color: #CBD5E1; background: transparent; border: none; cursor: pointer; font-family: inherit; text-align: left; font-weight: 400; transition: background 0.12s; }
.brand-option:hover { background: rgba(255,255,255,0.04); }
.brand-option.active { color: #38bdf8; background: rgba(14,165,233,0.1); font-weight: 600; }

/* ── Active filter chips ── */
.active-chips { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-left: auto; }
.filter-chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; background: rgba(14,165,233,0.08); border: 1px solid rgba(14,165,233,0.2); font-size: 11px; font-weight: 500; color: #38bdf8; max-width: 180px; white-space: nowrap; }
.chip-x { background: none; border: none; cursor: pointer; color: rgba(56,189,248,0.65); font-size: 14px; line-height: 1; padding: 0 0 0 3px; margin: 0; transition: color 0.15s; }
.chip-x:hover { color: #fb7185; }

/* ── Category tabs ── */
.cat-tabs-wrap { display: flex; gap: 5px; overflow-x: auto; padding-bottom: 2px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 14px; }
.cat-tab { flex-shrink: 0; height: 32px; padding: 0 13px; border-radius: 8px; font-size: 12px; font-weight: 400; cursor: pointer; border: 1px solid rgba(255,255,255,0.07); font-family: inherit; background: rgba(255,255,255,0.03); color: rgba(100,116,139,0.8); display: flex; align-items: center; gap: 6px; white-space: nowrap; transition: background 0.15s, color 0.15s, border-color 0.15s; }
.cat-tab:hover { background: rgba(255,255,255,0.07); color: #CBD5E1; border-color: rgba(255,255,255,0.13); }
.cat-tab.active { background: rgba(14,165,233,0.13); color: #38bdf8; font-weight: 600; border-color: rgba(14,165,233,0.28); }
.cat-tab-skel { flex-shrink: 0; height: 32px; width: 100px; border-radius: 8px; }

/* ── Product grid ── */
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(256px, 1fr)); gap: 16px; }

/* ── Product card ── */
.product-card { border-radius: 16px; background: linear-gradient(160deg,#0D1B35,#091228); border: 1px solid rgba(255,255,255,0.07); overflow: hidden; transition: border-color 0.2s, box-shadow 0.22s, transform 0.22s; box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
.product-card.hovered { border-color: rgba(14,165,233,0.2); box-shadow: 0 14px 38px rgba(0,0,0,0.55), 0 0 0 1px rgba(14,165,233,0.1); transform: translateY(-4px); }

/* ── Card image ── */
.card-img-wrap { position: relative; height: 160px; background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card-img { width: 100%; height: 100%; object-fit: contain; padding: 12px; transition: transform 0.3s; }
.product-card.hovered .card-img { transform: scale(1.04); }
.card-img-placeholder { width: 60px; height: 60px; border-radius: 14px; background: rgba(14,165,233,0.08); border: 1px solid rgba(14,165,233,0.15); display: flex; align-items: center; justify-content: center; }
.card-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(9,18,40,0.45) 0%, transparent 55%); pointer-events: none; opacity: 0; transition: opacity 0.22s; }
.product-card.hovered .card-img-overlay { opacity: 1; }
.card-badges { position: absolute; top: 9px; left: 9px; display: flex; gap: 5px; }
.badge-feat { font-size: 9px; font-weight: 700; padding: 3px 7px; border-radius: 5px; background: linear-gradient(135deg,#0EA5E9,#22D3EE); color: white; letter-spacing: 0.3px; }
.badge-disc { font-size: 9px; font-weight: 700; padding: 3px 7px; border-radius: 20px; background: #10B981; color: white; }
.badge-stock { position: absolute; top: 9px; right: 9px; font-size: 9px; font-weight: 600; padding: 3px 8px; border-radius: 20px; }

/* ── Card body ── */
.card-body { padding: 13px 15px 15px; display: flex; flex-direction: column; }
.card-cat { display: inline-block; font-size: 10px; color: rgba(100,116,139,0.78); font-weight: 500; margin-bottom: 7px; background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 20px; align-self: flex-start; }
.card-name { font-size: 13px; font-weight: 600; color: #CBD5E1; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 36px; margin-bottom: 5px; transition: color 0.15s; }
.card-name.bright { color: #F1F5F9; }
.card-sku { font-size: 10px; color: rgba(100,116,139,0.55); margin-bottom: 7px; font-family: ui-monospace, 'JetBrains Mono', monospace; letter-spacing: 0.4px; }
.card-supplier { font-size: 11px; color: rgba(71,85,105,0.9); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 11px; }
.card-divider { height: 1px; background: rgba(255,255,255,0.05); margin-bottom: 11px; }
.card-price-row { margin-bottom: 12px; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.card-price { font-size: 17px; font-weight: 800; color: #F1F5F9; letter-spacing: -0.4px; line-height: 1; }
.card-price-old { font-size: 11px; color: rgba(100,116,139,0.5); text-decoration: line-through; }
.card-price-consult { font-size: 12px; color: rgba(100,116,139,0.6); font-style: italic; }

/* ── Card actions ── */
.card-actions { display: flex; gap: 7px; }
.btn-add { flex: 1; display: flex; align-items: center; justify-content: center; height: 36px; border-radius: 9px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid rgba(14,165,233,0.22); font-family: inherit; transition: background 0.18s, border-color 0.18s, box-shadow 0.18s; background: rgba(14,165,233,0.1); color: #38bdf8; }
.btn-add:hover:not(.out) { background: rgba(14,165,233,0.18); box-shadow: 0 4px 14px rgba(14,165,233,0.18); }
.btn-add.added { background: rgba(16,185,129,0.12); color: #34d399; border-color: rgba(52,211,153,0.22); }
.btn-add.out { opacity: 0.33; cursor: not-allowed; }
.btn-inner { display: flex; align-items: center; gap: 5px; }
.btn-detail { width: 36px; height: 36px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(100,116,139,0.7); flex-shrink: 0; transition: background 0.15s, color 0.15s, border-color 0.15s; }
.btn-detail:hover { background: rgba(255,255,255,0.09); color: #CBD5E1; border-color: rgba(255,255,255,0.18); }

/* ── Error ── */
.error-banner { padding: 12px 16px; border-radius: 12px; background: rgba(244,63,94,0.08); border: 1px solid rgba(244,63,94,0.2); color: #fb7185; font-size: 13px; display: flex; align-items: center; gap: 10px; }

/* ── Empty / loading state ── */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 72px 24px; border-radius: 16px; background: linear-gradient(160deg,#0D1B35,#091228); border: 1px solid rgba(255,255,255,0.07); text-align: center; }
.empty-icon { width: 56px; height: 56px; border-radius: 16px; background: rgba(14,165,233,0.08); border: 1px solid rgba(14,165,233,0.14); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.empty-title { font-size: 16px; font-weight: 700; color: #94a3b8; margin-bottom: 6px; }
.empty-sub { font-size: 13px; color: rgba(71,85,105,0.9); }

/* ── Pagination ── */
.pagination { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 32px; }
.pag-btn { display: inline-flex; align-items: center; gap: 7px; height: 38px; padding: 0 18px; border-radius: 10px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: background 0.15s, border-color 0.15s, box-shadow 0.15s; }
.pag-prev { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #CBD5E1; }
.pag-prev:hover:not([disabled]) { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.18); }
.pag-next { background: rgba(14,165,233,0.09); border: 1px solid rgba(14,165,233,0.22); color: #38bdf8; }
.pag-next:hover:not([disabled]) { background: rgba(14,165,233,0.16); box-shadow: 0 4px 14px rgba(14,165,233,0.15); }
.pag-btn:disabled { opacity: 0.33; cursor: not-allowed; }
.pag-center { display: flex; align-items: baseline; gap: 4px; padding: 0 6px; }
.pag-cur { font-size: 16px; font-weight: 800; color: #F1F5F9; }
.pag-slash { font-size: 14px; color: rgba(100,116,139,0.45); }
.pag-total { font-size: 13px; color: rgba(100,116,139,0.65); font-weight: 500; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .product-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
  .controls-row { flex-direction: column; align-items: stretch; }
  .controls-left { flex-wrap: wrap; }
  .active-chips { margin-left: 0; }
  .styled-select { min-width: unset; width: 100%; }
}
@media (max-width: 480px) {
  .product-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .catalog-title { font-size: 19px; }
  .filter-panel { padding: 14px; }
  .search-input { font-size: 13px; }
}

/* ── Dropdown transition ── */
.dropdown-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
