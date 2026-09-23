<template>
  <div class="cat-wrap">

    <!-- ══════════ HEADER ══════════ -->
    <div class="cat-header">
      <div class="cat-header-left">
        <div>
          <div style="display:flex;align-items:center;gap:10px;">
            <h1 class="cat-title">Catálogo</h1>
            <span class="cat-badge">SIEEG</span>
          </div>
          <p class="cat-subtitle">
            {{ categories.length > 0 ? `${categories.length} categorías disponibles` : 'Cargando catálogo…' }}
          </p>
        </div>
        <div v-if="hasFilter" class="cat-results-chip">
          <Loader2 v-if="loading" :size="11" color="#7DD3FC" class="spin" />
          <div v-else class="cat-results-dot" />
          <span>{{ loading ? 'Buscando…' : `${cantidad.toLocaleString('es-MX')} resultados` }}</span>
        </div>
      </div>
      <button v-if="hasFilter" @click="clearAll()" class="btn-clear">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Limpiar todo
      </button>
    </div>

    <!-- ══════════ FILTER PANEL ══════════ -->
    <div class="filter-panel">
      <div class="filter-accent-bar" />

      <div class="filter-body">

        <!-- Buscador -->
        <div style="position:relative;">
          <svg class="search-icon" :style="{color:searchFocused?'#0EA5E9':'rgba(100,118,142,0.55)'}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            v-model="search"
            placeholder="Buscar por nombre, modelo, marca o SKU…"
            class="search-input"
            :class="{ focused: searchFocused }"
            @focus="searchFocused=true"
            @blur="searchFocused=false"
          />
          <button v-if="search" @click="search=''" class="search-clear">×</button>
        </div>

        <!-- Controles -->
        <div class="filter-controls">

          <!-- Sort -->
          <div style="position:relative;display:flex;align-items:center;flex-shrink:0;">
            <svg style="position:absolute;left:11px;pointer-events:none;color:rgba(100,118,142,0.6);" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/></svg>
            <select v-model="sortBy" @change="pagina=1" class="filter-select">
              <option v-for="o in SORT_OPTIONS" :key="o.value" :value="o.value" style="background:#0C1A2E;">{{ o.label }}</option>
            </select>
            <ChevronDown :size="12" color="rgba(100,118,142,0.65)" style="position:absolute;right:9px;pointer-events:none;" />
          </div>

          <!-- Marca -->
          <div style="position:relative;flex-shrink:0;">
            <button @click="openBrandDrop()" class="filter-btn" :class="{ active: activeBrandId }">
              <div style="display:flex;align-items:center;gap:6px;overflow:hidden;">
                <Tag :size="13" :stroke-width="1.8" />
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:85px;">
                  {{ activeBrandId ? (brands.find(b=>b.id===activeBrandId)?.nombre ?? activeBrandId) : 'Marca' }}
                </span>
              </div>
              <span v-if="activeBrandId" @click.stop="clearBrand()" class="filter-btn-x">×</span>
              <ChevronDown v-else :size="12" color="rgba(100,118,142,0.65)" />
            </button>
            <Transition name="dropdown">
              <div v-if="brandDropOpen" class="brand-dropdown">
                <div style="padding:9px 9px 4px;">
                  <input v-model="brandSearch" autofocus placeholder="Buscar marca…" class="brand-search" />
                </div>
                <div style="max-height:220px;overflow-y:auto;padding-bottom:6px;">
                  <div v-if="loadingBrands" style="padding:16px;text-align:center;font-size:12px;color:rgba(100,118,142,0.7);">Cargando marcas…</div>
                  <button v-else v-for="b in filteredBrands" :key="b.id" @click="selectBrand(b.id)"
                    class="brand-option" :class="{ selected: activeBrandId===b.id }">
                    {{ b.nombre }}
                  </button>
                </div>
              </div>
            </Transition>
            <div v-if="brandDropOpen" style="position:fixed;inset:0;z-index:40;" @click="brandDropOpen=false" />
          </div>

          <!-- ══ CATEGORÍAS ══ -->
          <div style="position:relative;flex-shrink:0;">
            <button @click="catPanelOpen=!catPanelOpen" class="filter-btn cat-btn" :class="{ active: activeCategoryId }">
              <div style="display:flex;align-items:center;gap:7px;overflow:hidden;">
                <LayoutGrid :size="13" :stroke-width="1.8" />
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:110px;">
                  {{ activeCategoryId ? (categories.find(c=>c.id===activeCategoryId)?.nombre ?? 'Categoría') : 'Categorías' }}
                </span>
              </div>
              <span v-if="activeCategoryId" @click.stop="selectCategory(null)" class="filter-btn-x">×</span>
              <ChevronDown v-else :size="12" color="rgba(100,118,142,0.65)" :style="{ transition:'transform 0.2s', transform: catPanelOpen ? 'rotate(180deg)' : 'rotate(0)' }" />
            </button>

            <!-- Panel desktop (dropdown) -->
            <Transition name="cat-drop">
              <div v-if="catPanelOpen && !isMobile" class="cat-dropdown">
                <!-- Header del panel -->
                <div class="cat-drop-head">
                  <span class="cat-drop-title">Categorías</span>
                  <span class="cat-drop-count">{{ categories.length }}</span>
                </div>

                <!-- Buscador interno -->
                <div style="padding:0 12px 10px;">
                  <div style="position:relative;">
                    <svg style="position:absolute;left:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:rgba(100,118,142,0.5);" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <input v-model="catSearch" placeholder="Buscar categoría…" class="cat-drop-search" />
                  </div>
                </div>

                <!-- Opción "Todos" -->
                <div style="padding:0 12px 8px;">
                  <button @click="selectCategory(null); catPanelOpen=false" class="cat-drop-all" :class="{ active: !activeCategoryId }">
                    <LayoutGrid :size="13" :stroke-width="!activeCategoryId?2.2:1.7" />
                    Todos los productos
                    <span v-if="!activeCategoryId" class="cat-drop-check">✓</span>
                  </button>
                </div>

                <div class="cat-drop-divider" />

                <!-- Grid de categorías -->
                <div class="cat-drop-grid no-scrollbar">
                  <div v-if="loadingCats" v-for="i in 12" :key="i" class="shimmer-bg" style="height:36px;border-radius:9px;" />
                  <button
                    v-else
                    v-for="cat in filteredCats" :key="cat.id"
                    @click="selectCategory(cat.id); catPanelOpen=false; catSearch=''"
                    class="cat-drop-item"
                    :class="{ active: activeCategoryId===cat.id }"
                  >
                    <span class="cat-drop-item-dot" :class="{ active: activeCategoryId===cat.id }" />
                    <span>{{ cat.nombre }}</span>
                    <span v-if="activeCategoryId===cat.id" class="cat-drop-check">✓</span>
                  </button>
                  <div v-if="!loadingCats && filteredCats.length===0" style="grid-column:1/-1;padding:20px;text-align:center;font-size:12px;color:rgba(100,118,142,0.6);">
                    Sin resultados
                  </div>
                </div>
              </div>
            </Transition>

            <div v-if="catPanelOpen && !isMobile" style="position:fixed;inset:0;z-index:48;" @click="catPanelOpen=false" />
          </div>

          <!-- Chips activos -->
          <div class="active-chips">
            <div v-if="dSearch" class="chip">
              <Search :size="10" />
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">"{{ dSearch.length>18?dSearch.slice(0,18)+'…':dSearch }}"</span>
              <button @click="search=''" class="chip-x">×</button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ══ BOTTOM SHEET mobile ══ -->
    <Transition name="sheet-bg">
      <div v-if="catPanelOpen && isMobile" style="position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:200;backdrop-filter:blur(3px);" @click="catPanelOpen=false" />
    </Transition>
    <Transition name="sheet-up">
      <div v-if="catPanelOpen && isMobile" class="cat-sheet">
        <!-- Handle -->
        <div style="display:flex;justify-content:center;padding:10px 0 4px;">
          <div style="width:36px;height:4px;border-radius:99px;background:rgba(255,255,255,0.15);" />
        </div>

        <!-- Header -->
        <div class="cat-drop-head" style="padding:8px 18px 12px;">
          <span class="cat-drop-title">Categorías</span>
          <span class="cat-drop-count">{{ categories.length }}</span>
          <button @click="catPanelOpen=false" style="margin-left:auto;width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,0.06);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(123,146,176,0.8)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Buscador -->
        <div style="padding:0 16px 12px;">
          <div style="position:relative;">
            <svg style="position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:rgba(100,118,142,0.5);" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input v-model="catSearch" placeholder="Buscar categoría…" class="cat-drop-search" style="height:40px;font-size:13px;" />
          </div>
        </div>

        <!-- Opción "Todos" -->
        <div style="padding:0 16px 8px;">
          <button @click="selectCategory(null); catPanelOpen=false" class="cat-drop-all" :class="{ active: !activeCategoryId }">
            <LayoutGrid :size="14" :stroke-width="!activeCategoryId?2.2:1.7" />
            Todos los productos
            <span v-if="!activeCategoryId" class="cat-drop-check">✓</span>
          </button>
        </div>

        <div class="cat-drop-divider" />

        <!-- Lista de categorías (scroll) -->
        <div class="cat-sheet-list no-scrollbar">
          <div v-if="loadingCats" v-for="i in 8" :key="i" class="shimmer-bg" style="height:44px;border-radius:10px;margin-bottom:4px;" />
          <button
            v-else
            v-for="cat in filteredCats" :key="cat.id"
            @click="selectCategory(cat.id); catPanelOpen=false; catSearch=''"
            class="cat-sheet-item"
            :class="{ active: activeCategoryId===cat.id }"
          >
            <span class="cat-drop-item-dot" :class="{ active: activeCategoryId===cat.id }" />
            <span style="flex:1;text-align:left;">{{ cat.nombre }}</span>
            <span v-if="activeCategoryId===cat.id" style="font-size:13px;color:#7DD3FC;">✓</span>
          </button>
          <div v-if="!loadingCats && filteredCats.length===0" style="padding:24px;text-align:center;font-size:13px;color:rgba(100,118,142,0.6);">
            Sin resultados
          </div>
        </div>
      </div>
    </Transition>

    <!-- Error -->
    <div v-if="apiError" class="error-bar">
      <AlertCircle :size="15" style="flex-shrink:0;" />
      <span><strong>Error:</strong> {{ apiError }}</span>
    </div>

    <!-- Cargando categorías -->
    <div v-if="loadingCats" class="state-box">
      <div class="state-icon">
        <Loader2 :size="24" color="#7DD3FC" :stroke-width="1.8" class="spin" />
      </div>
      <div class="state-title">Cargando catálogo…</div>
      <div class="state-sub">Conectando con el catálogo SIEEG</div>
    </div>

    <!-- Estado inicial (sin filtro) -->
    <div v-else-if="!hasFilter && !loading" class="state-box">
      <div class="state-icon">
        <Search :size="26" color="#7DD3FC" :stroke-width="1.6" />
      </div>
      <div class="state-title">Busca o elige una categoría</div>
      <div class="state-sub">Escribe en el buscador o selecciona una categoría para ver los productos disponibles.</div>
    </div>

    <!-- Skeletons -->
    <div v-else-if="loading && !products.length && hasFilter" class="products-grid">
      <div v-for="i in 12" :key="i" class="product-card-skeleton">
        <div class="shimmer-bg" style="height:180px;border-radius:0;" />
        <div style="padding:14px 16px;display:flex;flex-direction:column;gap:9px;">
          <div class="shimmer-bg" style="height:10px;width:52px;border-radius:20px;" />
          <div class="shimmer-bg" style="height:13px;width:88%;border-radius:6px;" />
          <div class="shimmer-bg" style="height:13px;width:64%;border-radius:6px;" />
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
            <div class="shimmer-bg" style="height:22px;width:84px;border-radius:6px;" />
            <div class="shimmer-bg" style="height:36px;width:90px;border-radius:10px;" />
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de productos -->
    <div v-else-if="products.length">
      <div class="products-grid">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card"
          @mouseenter="hoveredId=product.id"
          @mouseleave="hoveredId=null"
          @click="openDetail(product)"
        >
          <!-- Imagen -->
          <div class="product-img-wrap">
            <img
              v-if="product.images[0]"
              :src="product.images[0]"
              :alt="product.name"
              class="product-img"
              :class="{ zoomed: hoveredId===product.id }"
              @error="(e) => (e.currentTarget as HTMLImageElement).style.display='none'"
            />
            <div v-else class="product-img-placeholder">
              <Package :size="28" color="#7DD3FC" :stroke-width="1.6" />
            </div>

            <div class="product-hover-overlay" :class="{ visible: hoveredId===product.id }">
              <div class="product-detail-hint">
                <Eye :size="14" :stroke-width="2" />
                Ver detalles
              </div>
            </div>

            <div style="position:absolute;top:10px;left:10px;display:flex;gap:5px;z-index:2;">
              <span v-if="product.featured" class="badge-featured">DEST.</span>
              <span v-if="product.discount" class="badge-discount">-{{ product.discount }}%</span>
            </div>
            <span class="badge-stock" :class="stockClass(product)">{{ stockLabel(product) }}</span>
          </div>

          <!-- Info -->
          <div class="product-info">
            <span class="product-cat-label">{{ product.category }}</span>
            <div class="product-name" :class="{ highlighted: hoveredId===product.id }">{{ product.name }}</div>
            <div v-if="product.sku" class="product-sku">{{ product.sku }}</div>
            <div class="product-brand">{{ product.supplier }}</div>

            <div class="product-divider" />

            <div class="product-price-row">
              <div>
                <div v-if="product.price > 0" class="product-price">{{ fmtCurrency(product.price) }}</div>
                <div v-else class="product-no-price">Consultar precio</div>
                <div v-if="product.discount" class="product-old-price">{{ fmtCurrency(Math.round(product.price / (1 - product.discount / 100))) }}</div>
              </div>
              <button
                @click.stop="handleAdd(product)"
                :disabled="product.stock===0"
                class="btn-add"
                :class="{ added: addedIds.has(product.id), disabled: product.stock===0 }"
              >
                <svg v-if="addedIds.has(product.id)" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                {{ addedIds.has(product.id) ? 'Agregado' : 'Agregar' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="paginas > 1" class="pagination">
        <button @click="pagina=Math.max(1,pagina-1)" :disabled="pagina===1" class="page-btn prev" :class="{ disabled: pagina===1 }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Anterior
        </button>
        <div class="page-info">
          <span class="page-current">{{ pagina }}</span>
          <span class="page-sep">/</span>
          <span class="page-total">{{ paginas }}</span>
        </div>
        <button @click="pagina=Math.min(paginas,pagina+1)" :disabled="pagina===paginas" class="page-btn next" :class="{ disabled: pagina===paginas }">
          Siguiente
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="hasFilter && !loading" class="state-box">
      <div class="state-icon" style="background:rgba(100,118,142,0.06);border-color:rgba(100,118,142,0.15);">
        <Search :size="22" color="rgba(100,118,142,0.45)" />
      </div>
      <div class="state-title">Sin resultados</div>
      <div class="state-sub" style="margin-bottom:20px;">Prueba con otra búsqueda o categoría</div>
      <button @click="clearAll()" class="btn-clear">Limpiar filtros</button>
    </div>

  </div>

  <!-- Modal de detalle -->
  <ProductModal v-if="detailProduct" :product="detailProduct" :show="!!detailProduct" @close="detailProduct=null" />
</template>

<script setup lang="ts">
import { Search, ChevronDown, Package, AlertCircle, Loader2, LayoutGrid, Eye, Tag } from '@lucide/vue'
import { fetchCategorias, fetchProductos, fetchMarcas } from '~/composables/useSyscom'
import type { Product, SyscomCategoria } from '~/types'

definePageMeta({ middleware: 'auth' })

const cart = useCartStore()
const { isMobile } = useBreakpoint()

const search           = ref('')
const dSearch          = ref('')
const searchFocused    = ref(false)
const sortBy           = ref('relevancia')
const pagina           = ref(1)
const categories       = ref<SyscomCategoria[]>([])
const activeCategoryId = ref<string | null>(null)
const brands           = ref<Array<{ id: string; nombre: string }>>([])
const activeBrandId    = ref<string | null>(null)
const brandSearch      = ref('')
const brandDropOpen    = ref(false)
const loadingBrands    = ref(false)
const catPanelOpen     = ref(false)
const catSearch        = ref('')
const products         = ref<Product[]>([])
const cantidad         = ref(0)
const paginas          = ref(1)
const loading          = ref(false)
const loadingCats      = ref(true)
const apiError         = ref<string | null>(null)
const hoveredId        = ref<string | null>(null)
const addedIds         = ref(new Set<string>())
const detailProduct    = ref<Product | null>(null)

const SORT_OPTIONS = [
  { value: 'relevancia', label: 'Relevancia'    },
  { value: 'precio:asc', label: 'Precio: menor' },
  { value: 'precio:desc',label: 'Precio: mayor' },
  { value: 'topseller',  label: 'Más vendidos'  },
]

const hasFilter      = computed(() => !!dSearch.value || !!activeCategoryId.value || !!activeBrandId.value)
const filteredBrands = computed(() =>
  brands.value
    .filter(b => !brandSearch.value || b.nombre.toLowerCase().includes(brandSearch.value.toLowerCase()))
    .slice(0, 40)
)
const filteredCats = computed(() =>
  catSearch.value
    ? categories.value.filter(c => c.nombre.toLowerCase().includes(catSearch.value.toLowerCase()))
    : categories.value
)

let debounceTimer: ReturnType<typeof setTimeout>
watch(search, (v) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { dSearch.value = v; pagina.value = 1 }, 400)
})

let loadId = 0

onMounted(async () => {
  const cats = await fetchCategorias()
  categories.value = cats
  loadingCats.value = false
})

watch([dSearch, activeCategoryId, activeBrandId, pagina, sortBy], loadProducts)

async function loadProducts() {
  if (!hasFilter.value) {
    products.value = []; cantidad.value = 0; paginas.value = 1; loading.value = false
    return
  }
  const myId = ++loadId
  loading.value = true; apiError.value = null; products.value = []; cantidad.value = 0
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

function selectBrand(id: string)         { activeBrandId.value = id; brandDropOpen.value = false; brandSearch.value = ''; pagina.value = 1 }
function clearBrand()                    { activeBrandId.value = null; brandSearch.value = ''; pagina.value = 1 }
function selectCategory(id: string|null) { activeCategoryId.value = id; pagina.value = 1 }
function clearAll()                      { search.value = ''; dSearch.value = ''; activeCategoryId.value = null; clearBrand() }
function openDetail(p: Product)          { detailProduct.value = p }

function handleAdd(product: Product) {
  if (product.stock === 0) return
  cart.addItem(product)
  addedIds.value = new Set([...addedIds.value, product.id])
  setTimeout(() => { addedIds.value.delete(product.id); addedIds.value = new Set(addedIds.value) }, 1600)
}

const fmtCurrency = (n: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
function stockLabel(p: Product) { return p.stock > 10 ? 'En stock' : p.stock > 0 ? `Solo ${p.stock}` : 'Agotado' }
function stockClass(p: Product) { return p.stock > 10 ? 'stock-ok' : p.stock > 0 ? 'stock-low' : 'stock-out' }
</script>

<style scoped>
/* ── Layout ── */
.cat-wrap { display:flex;flex-direction:column;gap:22px;font-family:'Inter',system-ui,sans-serif; }

/* ── Header ── */
.cat-header { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px; }
.cat-header-left { display:flex;align-items:center;gap:14px;flex-wrap:wrap; }
.cat-title { font-size:24px;font-weight:900;color:#E2EAF4;margin:0;letter-spacing:-0.5px; }
.cat-badge { font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;background:linear-gradient(135deg,#0EA5E9,#7DD3FC);color:white;letter-spacing:0.5px; }
.cat-subtitle { font-size:12px;color:rgba(100,118,142,0.75);margin:4px 0 0; }
.cat-results-chip { display:flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);font-size:12px;font-weight:700;color:#7DD3FC; }
.cat-results-dot { width:6px;height:6px;border-radius:50%;background:#0EA5E9; }

/* ── Filter panel ── */
.filter-panel { border-radius:16px;background:linear-gradient(160deg,#0C1A2E,#06101E);border:1px solid rgba(255,255,255,0.08);overflow:visible; }
.filter-accent-bar { height:3px;background:linear-gradient(90deg,#0EA5E9,#7DD3FC,#F59E0B);border-radius:16px 16px 0 0; }
.filter-body { padding:18px;display:flex;flex-direction:column;gap:14px; }

/* ── Search ── */
.search-icon { position:absolute;left:17px;top:50%;transform:translateY(-50%);pointer-events:none;transition:color 0.2s; }
.search-input {
  width:100%;height:52px;
  background:rgba(255,255,255,0.04);
  border:1.5px solid rgba(255,255,255,0.1);
  border-radius:13px;padding-left:50px;padding-right:46px;
  font-size:14px;color:#E2EAF4;outline:none;font-family:inherit;
  box-sizing:border-box;transition:all 0.2s;
}
.search-input.focused { background:rgba(14,165,233,0.06);border-color:#0EA5E9;box-shadow:0 0 0 4px rgba(14,165,233,0.08); }
.search-input::placeholder { color:rgba(100,118,142,0.55); }
.search-clear { position:absolute;right:13px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.08);border:none;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#94a3b8;font-size:15px;transition:background 0.15s; }
.search-clear:hover { background:rgba(255,255,255,0.16); }

/* ── Controls row ── */
.filter-controls { display:flex;align-items:center;gap:8px;flex-wrap:wrap; }
.filter-select {
  height:38px;padding-left:30px;padding-right:28px;
  background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.11);
  border-radius:10px;font-size:12.5px;color:#7B92B0;
  outline:none;appearance:none;cursor:pointer;font-family:inherit;min-width:152px;transition:border-color 0.15s;
}
.filter-select:focus { border-color:rgba(14,165,233,0.4); }
.filter-btn {
  height:38px;padding:0 11px;border-radius:10px;
  border:1px solid rgba(255,255,255,0.11);
  background:rgba(255,255,255,0.04);
  color:#7B92B0;font-size:12.5px;font-weight:400;
  cursor:pointer;font-family:inherit;
  display:flex;align-items:center;gap:7px;
  min-width:135px;justify-content:space-between;transition:all 0.15s;
}
.filter-btn.active { border-color:rgba(14,165,233,0.4);background:rgba(14,165,233,0.1);color:#7DD3FC;font-weight:600; }
.filter-btn.cat-btn { min-width:155px; }
.filter-btn-x { font-size:16px;line-height:1;cursor:pointer;opacity:0.65;margin-left:2px; }
.brand-dropdown { position:absolute;left:0;top:44px;width:248px;background:#0C1A2E;border:1px solid rgba(255,255,255,0.1);border-radius:13px;overflow:hidden;z-index:50;box-shadow:0 16px 40px rgba(0,0,0,0.6); }
.brand-search { width:100%;height:34px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0 10px;font-size:12px;color:#E2EAF4;outline:none;font-family:inherit;box-sizing:border-box; }
.brand-option { display:block;width:100%;padding:7px 14px;font-size:12px;color:#7B92B0;background:transparent;border:none;cursor:pointer;font-family:inherit;text-align:left;transition:background 0.1s; }
.brand-option:hover { background:rgba(255,255,255,0.04); }
.brand-option.selected { color:#7DD3FC;background:rgba(14,165,233,0.1);font-weight:600; }

/* ── Category dropdown panel (desktop) ── */
.cat-dropdown {
  position:absolute;left:0;top:46px;
  width:480px;max-width:calc(100vw - 32px);
  background:linear-gradient(160deg,#0C1A2E,#06101E);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:16px;overflow:hidden;
  z-index:50;box-shadow:0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(14,165,233,0.06);
}
.cat-drop-head {
  display:flex;align-items:center;gap:8px;
  padding:14px 14px 10px;
  border-bottom:1px solid rgba(255,255,255,0.07);
}
.cat-drop-title { font-size:13px;font-weight:700;color:#E2EAF4; }
.cat-drop-count { font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;background:rgba(14,165,233,0.12);border:1px solid rgba(14,165,233,0.2);color:#7DD3FC; }
.cat-drop-search {
  width:100%;height:32px;padding-left:30px;padding-right:10px;
  background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);
  border-radius:8px;font-size:12px;color:#E2EAF4;outline:none;font-family:inherit;
  box-sizing:border-box;transition:border-color 0.15s;
}
.cat-drop-search:focus { border-color:rgba(14,165,233,0.4); }
.cat-drop-search::placeholder { color:rgba(100,118,142,0.5); }
.cat-drop-all {
  width:100%;display:flex;align-items:center;gap:8px;
  height:36px;padding:0 12px;border-radius:9px;
  font-size:12.5px;font-weight:500;color:rgba(100,118,142,0.8);
  background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);
  cursor:pointer;font-family:inherit;transition:all 0.15s;
}
.cat-drop-all:hover { background:rgba(255,255,255,0.06);color:#7B92B0; }
.cat-drop-all.active { background:rgba(14,165,233,0.12);border-color:rgba(14,165,233,0.3);color:#7DD3FC;font-weight:600; }
.cat-drop-check { margin-left:auto;font-size:12px;color:#7DD3FC;font-weight:700; }
.cat-drop-divider { height:1px;background:rgba(255,255,255,0.07);margin:2px 0; }
.cat-drop-grid {
  display:grid;grid-template-columns:1fr 1fr;
  gap:3px;padding:10px 12px 12px;
  max-height:280px;overflow-y:auto;
}
.cat-drop-item {
  display:flex;align-items:center;gap:8px;
  height:34px;padding:0 10px;border-radius:8px;
  font-size:12px;font-weight:400;color:rgba(100,118,142,0.8);
  background:transparent;border:1px solid transparent;
  cursor:pointer;font-family:inherit;text-align:left;transition:all 0.12s;
  overflow:hidden;
}
.cat-drop-item:hover { background:rgba(255,255,255,0.05);color:#7B92B0; }
.cat-drop-item.active { background:rgba(14,165,233,0.1);border-color:rgba(14,165,233,0.25);color:#7DD3FC;font-weight:600; }
.cat-drop-item span:nth-child(2) { overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1; }
.cat-drop-item-dot { width:5px;height:5px;border-radius:50%;background:rgba(100,118,142,0.35);flex-shrink:0;transition:background 0.15s; }
.cat-drop-item-dot.active { background:#0EA5E9;box-shadow:0 0 6px rgba(14,165,233,0.6); }

/* ── Bottom sheet (mobile) ── */
.cat-sheet {
  position:fixed;bottom:0;left:0;right:0;
  background:linear-gradient(180deg,#0C1A2E,#081020);
  border-top:1px solid rgba(255,255,255,0.1);
  border-radius:20px 20px 0 0;
  z-index:201;
  box-shadow:0 -20px 60px rgba(0,0,0,0.6);
  max-height:82vh;
  display:flex;flex-direction:column;
}
.cat-sheet-list {
  flex:1;overflow-y:auto;
  padding:4px 16px 32px;
  display:flex;flex-direction:column;gap:3px;
}
.cat-sheet-item {
  display:flex;align-items:center;gap:10px;
  height:44px;padding:0 12px;border-radius:10px;
  font-size:13px;font-weight:400;color:rgba(100,118,142,0.85);
  background:transparent;border:1px solid transparent;
  cursor:pointer;font-family:inherit;transition:all 0.12s;
}
.cat-sheet-item:hover { background:rgba(255,255,255,0.04); }
.cat-sheet-item.active { background:rgba(14,165,233,0.1);border-color:rgba(14,165,233,0.22);color:#7DD3FC;font-weight:600; }

/* ── Active chips ── */
.active-chips { display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-left:auto; }
.chip { display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:20px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);font-size:11px;font-weight:600;color:#7DD3FC;max-width:190px; }
.chip-x { background:none;border:none;cursor:pointer;color:rgba(56,189,248,0.55);font-size:14px;padding:0 0 0 1px;line-height:1;transition:color 0.15s; }
.chip-x:hover { color:#EF4444; }

/* ── Errors / states ── */
.error-bar { padding:12px 15px;border-radius:12px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.22);color:#EF4444;font-size:13px;display:flex;align-items:center;gap:10px; }
.state-box { display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 24px;border-radius:16px;background:linear-gradient(160deg,#0C1A2E,#06101E);border:1px solid rgba(255,255,255,0.07);text-align:center; }
.state-icon { width:64px;height:64px;border-radius:18px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.18);display:flex;align-items:center;justify-content:center;margin-bottom:18px; }
.state-title { font-size:17px;font-weight:700;color:#94a3b8;margin-bottom:8px; }
.state-sub { font-size:13px;color:rgba(100,118,142,0.9);max-width:320px;line-height:1.6; }

/* ── Product grid ── */
.products-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(248px,1fr));gap:16px; }

/* ── Skeleton ── */
.product-card-skeleton { border-radius:16px;background:linear-gradient(160deg,#0C1A2E,#06101E);border:1px solid rgba(255,255,255,0.07);overflow:hidden; }

/* ── Product card ── */
.product-card {
  border-radius:16px;
  background:linear-gradient(160deg,#122238,#080F20);
  border:1px solid rgba(255,255,255,0.07);
  overflow:hidden;cursor:pointer;
  transition:border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  box-shadow:0 2px 12px rgba(0,0,0,0.3);
  display:flex;flex-direction:column;
}
.product-card:hover {
  border-color:rgba(14,165,233,0.35);
  box-shadow:0 12px 36px rgba(0,0,0,0.55), 0 0 0 1px rgba(14,165,233,0.1);
  transform:translateY(-4px);
}

/* ── Product image ── */
.product-img-wrap { position:relative;height:180px;background:rgba(255,255,255,0.025);display:flex;align-items:center;justify-content:center;overflow:hidden; }
.product-img { width:100%;height:100%;object-fit:contain;padding:14px;transition:transform 0.3s; }
.product-img.zoomed { transform:scale(1.06); }
.product-img-placeholder { width:64px;height:64px;border-radius:16px;background:rgba(14,165,233,0.07);border:1px solid rgba(14,165,233,0.18);display:flex;align-items:center;justify-content:center; }
.product-hover-overlay {
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(8,15,32,0.72) 0%,rgba(8,15,32,0.1) 60%);
  display:flex;align-items:flex-end;justify-content:center;padding-bottom:14px;
  opacity:0;transition:opacity 0.2s;pointer-events:none;
}
.product-hover-overlay.visible { opacity:1; }
.product-detail-hint { display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.9);background:rgba(14,165,233,0.25);backdrop-filter:blur(6px);padding:5px 14px;border-radius:20px;border:1px solid rgba(14,165,233,0.3); }

/* ── Badges ── */
.badge-featured { font-size:9px;font-weight:700;padding:3px 7px;border-radius:5px;background:linear-gradient(135deg,#0EA5E9,#7DD3FC);color:white;letter-spacing:0.3px; }
.badge-discount { font-size:9px;font-weight:700;padding:3px 7px;border-radius:20px;background:#22C55E;color:white; }
.badge-stock { position:absolute;top:10px;right:10px;font-size:9px;font-weight:600;padding:3px 9px;border-radius:20px;z-index:2; }
.badge-stock.stock-ok  { background:rgba(34,197,94,0.14);color:#22C55E; }
.badge-stock.stock-low { background:rgba(245,158,11,0.14);color:#fbbf24; }
.badge-stock.stock-out { background:rgba(239,68,68,0.14);color:#EF4444; }

/* ── Product info ── */
.product-info { padding:14px 15px 15px;display:flex;flex-direction:column;flex:1; }
.product-cat-label { display:inline-block;font-size:10px;color:rgba(100,118,142,0.7);font-weight:500;background:rgba(255,255,255,0.05);padding:2px 8px;border-radius:20px;align-self:flex-start;margin-bottom:7px; }
.product-name { font-size:13px;font-weight:600;color:#7B92B0;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:38px;margin-bottom:5px;transition:color 0.15s; }
.product-name.highlighted { color:#E2EAF4; }
.product-sku { font-size:10px;color:rgba(100,118,142,0.45);margin-bottom:5px;font-family:ui-monospace,monospace;letter-spacing:0.4px; }
.product-brand { font-size:11px;color:rgba(100,118,142,0.85);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:11px; }
.product-divider { height:1px;background:rgba(255,255,255,0.06);margin-bottom:11px;margin-top:auto; }
.product-price-row { display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:0; }
.product-price { font-size:17px;font-weight:800;color:#E2EAF4;letter-spacing:-0.5px;line-height:1; }
.product-no-price { font-size:12px;color:rgba(100,118,142,0.6);font-style:italic; }
.product-old-price { font-size:10px;color:rgba(100,118,142,0.45);text-decoration:line-through;margin-top:2px; }

/* ── Add button ── */
.btn-add {
  height:36px;padding:0 13px;
  display:flex;align-items:center;gap:5px;
  border-radius:9px;font-size:12px;font-weight:600;
  cursor:pointer;font-family:inherit;flex-shrink:0;
  border:1px solid rgba(14,165,233,0.25);
  background:rgba(14,165,233,0.1);color:#7DD3FC;
  transition:all 0.2s;
}
.btn-add:hover:not(.disabled):not(.added) { background:rgba(14,165,233,0.2);border-color:rgba(14,165,233,0.4); }
.btn-add.added { background:rgba(34,197,94,0.12);border-color:rgba(34,197,94,0.25);color:#22C55E; }
.btn-add.disabled { opacity:0.35;cursor:not-allowed; }

/* ── Clear button ── */
.btn-clear { display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:9px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#EF4444;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.15s; }
.btn-clear:hover { background:rgba(239,68,68,0.14);border-color:rgba(239,68,68,0.3); }

/* ── Pagination ── */
.pagination { display:flex;align-items:center;justify-content:center;gap:12px;margin-top:36px; }
.page-btn { display:inline-flex;align-items:center;gap:7px;height:40px;padding:0 20px;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;transition:background 0.15s; }
.page-btn.prev { background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#7B92B0; }
.page-btn.prev:hover:not(.disabled) { background:rgba(255,255,255,0.09); }
.page-btn.next { background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);color:#7DD3FC;font-weight:600; }
.page-btn.next:hover:not(.disabled) { background:rgba(14,165,233,0.18); }
.page-btn.disabled { opacity:0.35;cursor:not-allowed; }
.page-info { display:flex;align-items:baseline;gap:4px;padding:0 6px; }
.page-current { font-size:18px;font-weight:800;color:#E2EAF4; }
.page-sep { font-size:14px;color:rgba(100,118,142,0.4); }
.page-total { font-size:13px;color:rgba(100,118,142,0.6);font-weight:500; }

/* ── Transitions ── */
.dropdown-enter-active { transition:opacity 0.15s ease,transform 0.15s ease; }
.dropdown-leave-active { transition:opacity 0.1s ease; }
.dropdown-enter-from,.dropdown-leave-to { opacity:0;transform:translateY(-6px); }

.cat-drop-enter-active { transition:opacity 0.18s ease,transform 0.18s cubic-bezier(0.34,1.56,0.64,1); }
.cat-drop-leave-active { transition:opacity 0.12s ease,transform 0.12s ease; }
.cat-drop-enter-from,.cat-drop-leave-to { opacity:0;transform:translateY(-8px) scale(0.97); }

.sheet-bg-enter-active,.sheet-bg-leave-active { transition:opacity 0.25s; }
.sheet-bg-enter-from,.sheet-bg-leave-to { opacity:0; }

.sheet-up-enter-active { transition:transform 0.32s cubic-bezier(0.32,0.72,0,1); }
.sheet-up-leave-active { transition:transform 0.22s ease-in; }
.sheet-up-enter-from,.sheet-up-leave-to { transform:translateY(100%); }

/* ── Utils ── */
.spin { animation:spin 1.2s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
</style>
