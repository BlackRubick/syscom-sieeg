<template>
  <div :style="{ fontFamily:`'Inter',system-ui,sans-serif`, display:'flex', flexDirection:'column', gap:'22px' }">

    <!-- Header -->
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <h1 style="font-size:22px;font-weight:800;color:#F1F5F9;margin:0;line-height:1.2;">Catálogo</h1>
        <p style="font-size:13px;color:rgba(100,116,139,0.85);margin:5px 0 0;">
          {{ categories.length > 0 ? `${categories.length} categorías disponibles` : 'Cargando catálogo…' }}
        </p>
      </div>
      <div v-if="hasFilter" style="display:flex;align-items:center;gap:8px;padding:6px 14px;border-radius:20px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.2);">
        <div style="width:7px;height:7px;border-radius:50%;background:#0EA5E9;" />
        <span style="font-size:12px;font-weight:600;color:#38bdf8;">{{ loading ? '…' : `${cantidad.toLocaleString('es-MX')} resultados` }}</span>
      </div>
    </div>

    <!-- Filters -->
    <div style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:16px;display:flex;flex-direction:column;gap:14px;">
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <!-- Search -->
        <div style="flex:1;min-width:200px;position:relative;">
          <Search :size="15" style="position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;" :color="searchFocused?'#0EA5E9':'rgba(100,116,139,0.7)'" />
          <input v-model="search" placeholder="Buscar por nombre, modelo, marca…"
            @focus="searchFocused=true" @blur="searchFocused=false"
            :style="{ width:'100%', height:'42px', background:searchFocused?'rgba(14,165,233,0.06)':'rgba(255,255,255,0.04)', border:`1px solid ${searchFocused?'rgba(14,165,233,0.5)':'rgba(255,255,255,0.1)'}`, borderRadius:'11px', paddingLeft:'40px', paddingRight:search?'36px':'14px', fontSize:'13px', color:'#E2E8F0', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'all 0.2s' }" />
          <button v-if="search" @click="search=''" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.08);border:none;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(148,163,184,0.8);font-size:12px;">×</button>
        </div>
        <!-- Sort -->
        <div style="position:relative;flex-shrink:0;">
          <select v-model="sortBy" @change="pagina=1"
            style="height:42px;padding-left:14px;padding-right:36px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:11px;font-size:13px;color:#CBD5E1;outline:none;appearance:none;cursor:pointer;font-family:inherit;min-width:160px;">
            <option v-for="o in SORT_OPTIONS" :key="o.value" :value="o.value" style="background:#0D1B35;">{{ o.label }}</option>
          </select>
          <ChevronDown :size="14" color="rgba(100,116,139,0.8)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none;" />
        </div>
        <!-- Brand filter -->
        <div style="position:relative;flex-shrink:0;">
          <button @click="openBrandDrop()"
            :style="{ height:'42px', padding:'0 14px', borderRadius:'11px', border:`1px solid ${activeBrandId?'rgba(14,165,233,0.4)':'rgba(255,255,255,0.1)'}`, background:activeBrandId?'rgba(14,165,233,0.1)':'rgba(255,255,255,0.04)', color:activeBrandId?'#38bdf8':'#CBD5E1', fontSize:'13px', fontWeight:activeBrandId?600:400, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'7px', minWidth:'150px', justifyContent:'space-between' }">
            <div style="display:flex;align-items:center;gap:6px;overflow:hidden;">
              <Tag :size="13" :stroke-width="1.8" />
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100px;">{{ activeBrandId ? (brands.find(b=>b.id===activeBrandId)?.nombre ?? activeBrandId) : 'Marca' }}</span>
            </div>
            <span v-if="activeBrandId" @click.stop="clearBrand()" style="font-size:14px;line-height:1;cursor:pointer;">×</span>
            <ChevronDown v-else :size="13" color="rgba(100,116,139,0.7)" />
          </button>
          <Transition name="dropdown">
            <div v-if="brandDropOpen" style="position:absolute;right:0;top:48px;width:240px;background:#0D1B35;border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;z-index:50;box-shadow:0 16px 40px rgba(0,0,0,0.5);">
              <div style="padding:8px;">
                <input v-model="brandSearch" autofocus placeholder="Buscar marca..." style="width:100%;height:34px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0 10px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;" />
              </div>
              <div style="max-height:220px;overflow-y:auto;padding-bottom:6px;">
                <div v-if="loadingBrands" style="padding:16px;text-align:center;font-size:12px;color:rgba(100,116,139,0.7);">Cargando marcas…</div>
                <button v-else v-for="b in filteredBrands" :key="b.id" @click="selectBrand(b.id)"
                  :style="{ display:'block', width:'100%', padding:'8px 14px', fontSize:'12px', color:activeBrandId===b.id?'#38bdf8':'#CBD5E1', background:activeBrandId===b.id?'rgba(14,165,233,0.1)':'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', textAlign:'left', fontWeight:activeBrandId===b.id?600:400 }"
                  @mouseenter="e => { if(activeBrandId!==b.id)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)' }"
                  @mouseleave="e => { if(activeBrandId!==b.id)(e.currentTarget as HTMLElement).style.background='transparent' }">
                  {{ b.nombre }}
                </button>
              </div>
            </div>
          </Transition>
          <div v-if="brandDropOpen" style="position:fixed;inset:0;z-index:40;" @click="brandDropOpen=false" />
        </div>
      </div>

      <!-- Category tabs -->
      <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;" class="no-scrollbar">
        <button @click="selectCategory(null)"
          :style="{ flexShrink:0, height:'30px', padding:'0 12px', borderRadius:'6px', fontSize:'12px', fontWeight:!activeCategoryId?600:400, cursor:'pointer', border:'none', fontFamily:'inherit', background:!activeCategoryId?'rgba(14,165,233,0.15)':'rgba(255,255,255,0.04)', color:!activeCategoryId?'#38bdf8':'rgba(100,116,139,0.75)', outline:`1px solid ${!activeCategoryId?'rgba(14,165,233,0.35)':'rgba(255,255,255,0.07)'}`, display:'flex', alignItems:'center', gap:'6px' }">
          <LayoutGrid :size="12" :stroke-width="!activeCategoryId?2.2:1.8" /> Todos
        </button>
        <template v-if="loadingCats">
          <div v-for="i in 6" :key="i" class="shimmer-bg" style="flex-shrink:0;height:30px;width:100px;border-radius:6px;background:rgba(255,255,255,0.04);" />
        </template>
        <button v-else v-for="cat in categories" :key="cat.id" @click="selectCategory(cat.id)"
          :style="{ flexShrink:0, height:'30px', padding:'0 12px', borderRadius:'6px', fontSize:'12px', fontWeight:activeCategoryId===cat.id?600:400, cursor:'pointer', border:'none', fontFamily:'inherit', background:activeCategoryId===cat.id?'rgba(14,165,233,0.15)':'rgba(255,255,255,0.04)', color:activeCategoryId===cat.id?'#38bdf8':'rgba(100,116,139,0.75)', outline:`1px solid ${activeCategoryId===cat.id?'rgba(14,165,233,0.35)':'rgba(255,255,255,0.07)'}`, display:'flex', alignItems:'center', gap:'6px', whiteSpace:'nowrap' }">
          <Package :size="12" :stroke-width="activeCategoryId===cat.id?2.2:1.8" /> {{ cat.nombre }}
        </button>
      </div>
    </div>

    <!-- Error -->
    <div v-if="apiError" style="padding:12px 16px;border-radius:10px;background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.2);color:#fb7185;font-size:13px;display:flex;align-items:center;gap:10px;">
      <AlertCircle :size="16" style="flex-shrink:0;" />
      <span><strong>Error SYSCOM:</strong> {{ apiError }}</span>
    </div>

    <!-- Connecting / initial load state -->
    <div v-if="loadingCats || (loading && !products.length && !hasFilter)" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:72px 0;border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);">
      <div style="width:56px;height:56px;border-radius:16px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.18);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <Loader2 :size="24" color="#38bdf8" :stroke-width="1.8" class="spin" />
      </div>
      <div style="font-size:16px;font-weight:700;color:#94a3b8;">Cargando inventario Sieeg…</div>
    </div>

    <!-- Skeletons (only for filtered searches) -->
    <div v-else-if="loading && !products.length" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;">
      <div v-for="i in 12" :key="i" style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
        <div class="shimmer-bg" style="height:148px;background:rgba(255,255,255,0.03);" />
        <div style="padding:14px 16px 16px;display:flex;flex-direction:column;gap:10px;">
          <div class="shimmer-bg" style="height:10px;width:60px;border-radius:20px;background:rgba(255,255,255,0.06);" />
          <div class="shimmer-bg" style="height:13px;width:90%;border-radius:6px;background:rgba(255,255,255,0.06);" />
          <div class="shimmer-bg" style="height:13px;width:70%;border-radius:6px;background:rgba(255,255,255,0.04);" />
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div class="shimmer-bg" style="height:18px;width:80px;border-radius:6px;background:rgba(255,255,255,0.06);" />
            <div class="shimmer-bg" style="height:32px;width:90px;border-radius:9px;background:rgba(14,165,233,0.07);" />
          </div>
        </div>
      </div>
    </div>

    <!-- Product grid -->
    <div v-else-if="products.length">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;">
        <div v-for="product in products" :key="product.id"
          :style="{ borderRadius:'16px', background:'linear-gradient(160deg,#0D1B35,#091228)', border:`1px solid ${hoveredId===product.id?'rgba(14,165,233,0.22)':'rgba(255,255,255,0.07)'}`, overflow:'hidden', transition:'border-color 0.2s,box-shadow 0.2s,transform 0.2s', boxShadow:hoveredId===product.id?'0 12px 32px rgba(0,0,0,0.5),0 0 0 1px rgba(14,165,233,0.12)':'0 4px 16px rgba(0,0,0,0.35)', transform:hoveredId===product.id?'translateY(-4px)':'translateY(0)' }"
          @mouseenter="hoveredId=product.id" @mouseleave="hoveredId=null">
          <!-- Image -->
          <div style="position:relative;height:148px;background:rgba(255,255,255,0.02);display:flex;align-items:center;justify-content:center;overflow:hidden;">
            <img v-if="product.images[0]" :src="product.images[0]" :alt="product.name" style="width:100%;height:100%;object-fit:contain;padding:10px;" @error="(e) => (e.currentTarget as HTMLImageElement).style.display='none'" />
            <div v-else style="width:64px;height:64px;border-radius:16px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.18);display:flex;align-items:center;justify-content:center;">
              <Package :size="26" color="#38bdf8" :stroke-width="1.8" />
            </div>
            <!-- Badges -->
            <div style="position:absolute;top:10px;left:10px;display:flex;gap:5px;">
              <span v-if="product.featured" style="font-size:9px;font-weight:700;padding:3px 7px;border-radius:4px;background:linear-gradient(135deg,#0EA5E9,#22D3EE);color:white;">DESTACADO</span>
              <span v-if="product.discount" style="font-size:9px;font-weight:700;padding:3px 7px;border-radius:20px;background:#10B981;color:white;">-{{ product.discount }}%</span>
            </div>
            <span :style="stockBadgeStyle(product)" style="position:absolute;top:10px;right:10px;font-size:9px;font-weight:600;padding:3px 7px;border-radius:20px;">{{ stockLabel(product) }}</span>
          </div>
          <!-- Content -->
          <div style="padding:14px 16px 16px;">
            <div style="font-size:10px;color:rgba(100,116,139,0.8);font-weight:500;margin-bottom:6px;">
              <span style="background:rgba(255,255,255,0.04);padding:2px 7px;border-radius:20px;">{{ product.category }}</span>
            </div>
            <div :style="{ fontSize:'13px', fontWeight:600, color:hoveredId===product.id?'#F1F5F9':'#CBD5E1', marginBottom:'5px', lineHeight:'1.35', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', minHeight:'36px', transition:'color 0.15s' }">{{ product.name }}</div>
            <div v-if="product.sku" style="font-size:10px;color:rgba(100,116,139,0.6);margin-bottom:10px;font-family:monospace;">{{ product.sku }}</div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
              <span style="font-size:11px;color:rgba(71,85,105,0.9);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px;">{{ product.supplier }}</span>
            </div>
            <div style="height:1px;background:rgba(255,255,255,0.05);margin-bottom:14px;" />
            <div style="margin-bottom:10px;">
              <div v-if="product.price > 0" style="display:flex;align-items:baseline;gap:8px;">
                <div style="font-size:16px;font-weight:800;color:#F1F5F9;letter-spacing:-0.3px;">{{ fmtCurrency(product.price) }}</div>
                <div v-if="product.discount" style="font-size:10px;color:rgba(100,116,139,0.6);text-decoration:line-through;">{{ fmtCurrency(Math.round(product.price / (1 - product.discount / 100))) }}</div>
              </div>
              <div v-else style="font-size:12px;color:rgba(100,116,139,0.6);font-style:italic;">Consultar precio</div>
            </div>
            <div style="display:flex;gap:6px;">
              <button @click="handleAdd(product)"
                :disabled="product.stock===0"
                :style="{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', height:'32px', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:product.stock===0?'not-allowed':'pointer', border:'none', fontFamily:'inherit', transition:'all 0.2s', background:addedIds.has(product.id)?'rgba(16,185,129,0.15)':'rgba(14,165,233,0.12)', color:addedIds.has(product.id)?'#34d399':'#38bdf8', outline:`1px solid ${addedIds.has(product.id)?'rgba(52,211,153,0.25)':'rgba(14,165,233,0.22)'}`, opacity:product.stock===0?0.4:1 }">
                {{ addedIds.has(product.id) ? '✓ Agregado' : '+ Agregar' }}
              </button>
              <button @click="openDetail(product)" title="Ver detalle"
                style="width:32px;height:32px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(100,116,139,0.7);flex-shrink:0;">
                <Eye :size="13" :stroke-width="1.8" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="paginas > 1" style="display:flex;align-items:center;justify-content:center;gap:10px;margin-top:28px;">
        <button @click="pagina=Math.max(1,pagina-1)" :disabled="pagina===1"
          :style="{ height:'36px', padding:'0 16px', borderRadius:'9px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#CBD5E1', fontSize:'13px', cursor:pagina===1?'not-allowed':'pointer', opacity:pagina===1?0.4:1, fontFamily:'inherit' }">← Anterior</button>
        <span style="font-size:13px;color:rgba(100,116,139,0.9);">Página <strong style="color:#E2E8F0;">{{ pagina }}</strong> de <strong style="color:#E2E8F0;">{{ paginas }}</strong></span>
        <button @click="pagina=Math.min(paginas,pagina+1)" :disabled="pagina===paginas"
          :style="{ height:'36px', padding:'0 16px', borderRadius:'9px', background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.2)', color:'#38bdf8', fontSize:'13px', cursor:pagina===paginas?'not-allowed':'pointer', opacity:pagina===paginas?0.4:1, fontFamily:'inherit' }">Siguiente →</button>
      </div>
    </div>

    <!-- No results -->
    <div v-else-if="hasFilter && !loading" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 0;border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);">
      <div style="width:52px;height:52px;border-radius:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;margin-bottom:14px;">
        <Search :size="22" color="rgba(100,116,139,0.6)" />
      </div>
      <div style="font-size:15px;font-weight:600;color:#94a3b8;margin-bottom:5px;">Sin resultados</div>
      <div style="font-size:13px;color:rgba(71,85,105,0.9);">Prueba con otra búsqueda o categoría</div>
      <button @click="clearAll()" style="margin-top:16px;padding:8px 18px;border-radius:9px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.2);color:#38bdf8;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">Limpiar filtros</button>
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
