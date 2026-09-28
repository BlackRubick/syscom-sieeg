<template>
  <div class="pc">
    <SiteNavbar />
    <WhatsAppButton />

    <!-- ── Encabezado ── -->
    <header class="pc-hero">
      <div class="pc-container">
        <div class="pc-eyebrow">Catálogo</div>
        <h1>Cámaras, redes, energía y mucho más</h1>
        <p>Miles de productos de las marcas que conoces. <b>Regístrate como cliente</b> para ver tus precios y comprar en línea.</p>

        <form class="pc-search" role="search" @submit.prevent="buscar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input v-model="texto" type="search" placeholder="Buscar por producto, marca o modelo…" aria-label="Buscar productos" maxlength="80" />
          <button type="submit" class="pc-btn pc-btn-primary">Buscar</button>
        </form>

        <div class="pc-chips" role="tablist" aria-label="Categorías">
          <button v-for="c in categorias" :key="c.id" type="button" role="tab"
            :aria-selected="!busqueda && categoria === c.id" :class="['pc-chip', { active: !busqueda && categoria === c.id }]"
            @click="elegirCategoria(c.id)">
            {{ c.nombre }}
          </button>
        </div>
      </div>
    </header>

    <!-- ── Resultados ── -->
    <main class="pc-container pc-main">
      <div class="pc-results-head">
        <div>
          <h2>{{ busqueda ? `Resultados para “${busqueda}”` : nombreCategoria }}</h2>
          <p v-if="!pending && cantidad">{{ cantidad.toLocaleString('es-MX') }} producto{{ cantidad !== 1 ? 's' : '' }}</p>
        </div>
        <button v-if="busqueda" type="button" class="pc-link" @click="limpiarBusqueda">Quitar búsqueda</button>
      </div>

      <div v-if="error" class="pc-state">
        <p>{{ error }}</p>
        <button type="button" class="pc-btn pc-btn-ghost" @click="cargar(true)">Reintentar</button>
      </div>

      <div v-else-if="pending && !productos.length" class="pc-grid">
        <div v-for="i in 8" :key="i" class="pc-card pc-skeleton"><div class="pc-card-img" /><div class="pc-sk-line" /><div class="pc-sk-line short" /></div>
      </div>

      <div v-else-if="!productos.length" class="pc-state">
        <p>No encontramos productos{{ busqueda ? ` para “${busqueda}”` : '' }}.</p>
        <button type="button" class="pc-btn pc-btn-ghost" @click="limpiarBusqueda">Ver todo el catálogo</button>
      </div>

      <template v-else>
        <div class="pc-grid">
          <article v-for="p in productos" :key="p.id" class="pc-card">
            <div class="pc-card-img">
              <img :src="p.imagen" :alt="p.nombre" loading="lazy" @error="(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')" />
              <span :class="['pc-stock', p.disponible ? 'ok' : 'soon']">{{ p.disponible ? 'Disponible' : 'Bajo pedido' }}</span>
            </div>
            <div class="pc-card-body">
              <div class="pc-brandline">
                <img v-if="p.marcaLogo" :src="p.marcaLogo" :alt="p.marca" class="pc-brandlogo" loading="lazy" @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')" />
                <span v-else class="pc-marca">{{ p.marca }}</span>
              </div>
              <h3 class="pc-name" :title="p.nombre">{{ p.nombre }}</h3>
              <div class="pc-model">{{ p.modelo }}</div>
              <div class="pc-card-foot">
                <span class="pc-price-lock">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Precio al registrarte
                </span>
                <NuxtLink to="/#contacto" class="pc-btn pc-btn-small">Cotizar</NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <div v-if="pagina < paginas" class="pc-more">
          <button type="button" class="pc-btn pc-btn-ghost" :disabled="pending" @click="cargarMas">
            {{ pending ? 'Cargando…' : 'Ver más productos' }}
          </button>
        </div>
      </template>

      <!-- CTA -->
      <section class="pc-cta">
        <div>
          <h2>¿Quieres ver precios y comprar en línea?</h2>
          <p>Hazte cliente y obtén precios especiales, haz tus pedidos en línea y recibe factura en cada compra.</p>
        </div>
        <div class="pc-cta-actions">
          <NuxtLink to="/#contacto" class="pc-btn pc-btn-primary">Quiero ser cliente</NuxtLink>
          <NuxtLink to="/login" class="pc-btn pc-btn-ghost">Ya soy cliente</NuxtLink>
        </div>
      </section>
    </main>

    <footer class="pc-footer">
      <div class="pc-container">
        © {{ new Date().getFullYear() }} SIEEG Integradores ·
        <NuxtLink to="/terminos">Términos</NuxtLink> ·
        <NuxtLink to="/privacidad">Privacidad</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'landing', middleware: 'redirect-authenticated' })

useSeoMeta({
  title:       'Catálogo de productos · SIEEG Integradores',
  description: 'Cámaras de seguridad, redes, control de acceso, energía y más en Chiapas. Precios especiales para negocios y factura en cada compra.',
})

interface ProductoPublico {
  id: string; nombre: string; modelo: string; marca: string; marcaLogo: string
  imagen: string; categoria: string; disponible: boolean
}
interface CatalogoResp { productos: ProductoPublico[]; cantidad: number; pagina: number; paginas: number }

const route  = useRoute()
const router = useRouter()

const categoria = ref(typeof route.query.categoria === 'string' ? route.query.categoria : '22')
const busqueda  = ref(typeof route.query.q === 'string' ? route.query.q : '')
const texto     = ref(busqueda.value)

const { data: cats } = await useFetch<Array<{ id: string; nombre: string }>>('/api/public/categorias', { key: 'pub-cats' })
const categorias = computed(() => cats.value ?? [])
const nombreCategoria = computed(() => categorias.value.find(c => c.id === categoria.value)?.nombre ?? 'Productos')

const productos = ref<ProductoPublico[]>([])
const cantidad  = ref(0)
const pagina    = ref(1)
const paginas   = ref(1)
const pending   = ref(false)
const error     = ref('')

function query(p: number) {
  return busqueda.value ? { busqueda: busqueda.value, pagina: p } : { categoria: categoria.value, pagina: p }
}

// Primera página en SSR (indexable)
const { data: inicial, error: errInicial } = await useFetch<CatalogoResp>('/api/public/catalogo', {
  key: `pub-cat-${busqueda.value || categoria.value}`,
  query: query(1),
})
if (inicial.value) {
  productos.value = inicial.value.productos
  cantidad.value  = inicial.value.cantidad
  paginas.value   = inicial.value.paginas
}
if (errInicial.value) error.value = 'No pudimos cargar el catálogo. Intenta de nuevo.'

async function cargar(reset: boolean) {
  pending.value = true
  error.value   = ''
  const p = reset ? 1 : pagina.value + 1
  try {
    const r = await $fetch<CatalogoResp>('/api/public/catalogo', { query: query(p) })
    productos.value = reset ? r.productos : [...productos.value, ...r.productos]
    cantidad.value  = r.cantidad
    paginas.value   = r.paginas
    pagina.value    = p
  } catch (e: unknown) {
    const status = (e as { statusCode?: number })?.statusCode
    error.value = status === 429 ? 'Demasiadas búsquedas seguidas. Espera un momento.' : 'No pudimos cargar el catálogo. Intenta de nuevo.'
  } finally {
    pending.value = false
  }
}

// El buscador y las categorías del navbar cambian la URL sin salir de la página
watch(() => [route.query.q, route.query.categoria], ([q, cat]) => {
  const nuevaBusqueda  = typeof q === 'string' ? q : ''
  const nuevaCategoria = typeof cat === 'string' ? cat : categoria.value
  if (nuevaBusqueda === busqueda.value && nuevaCategoria === categoria.value) return
  busqueda.value = nuevaBusqueda; texto.value = nuevaBusqueda; categoria.value = nuevaCategoria
  cargar(true)
})

function syncUrl() {
  router.replace({ query: busqueda.value ? { q: busqueda.value } : { categoria: categoria.value } })
}
function elegirCategoria(id: string) {
  categoria.value = id; busqueda.value = ''; texto.value = ''
  syncUrl(); cargar(true)
}
function buscar() {
  const t = texto.value.trim()
  if (!t) return limpiarBusqueda()
  busqueda.value = t
  syncUrl(); cargar(true)
}
function limpiarBusqueda() {
  busqueda.value = ''; texto.value = ''
  syncUrl(); cargar(true)
}
const cargarMas = () => cargar(false)
</script>

<style scoped>
.pc { --bg:#F5F8FC; --card:#FFFFFF; --line:rgba(11,27,51,0.08); --text:#0B1B33; --muted:#5B6B82; --accent:#1570EF; --accent-2:#0B5BD3;
  min-height:100vh; background:var(--bg); color:var(--text); font-family:'Inter',system-ui,sans-serif; overflow-x:hidden; }
.pc-container { width:100%; max-width:1200px; margin:0 auto; padding:0 24px; box-sizing:border-box; }

.pc-brand { font-size:15px; font-weight:700; color:var(--text); text-decoration:none; letter-spacing:-0.3px; white-space:nowrap; }
.pc-brand span { color:var(--accent); }

.pc-btn { display:inline-flex; align-items:center; justify-content:center; gap:7px; height:40px; padding:0 18px; border-radius:10px; font-size:13px; font-weight:600; font-family:inherit; text-decoration:none; cursor:pointer; border:1px solid transparent; transition:all .2s; white-space:nowrap; }
.pc-btn:disabled { opacity:.6; cursor:not-allowed; }
.pc-btn-primary { color:#fff; background:linear-gradient(135deg,#1570EF,#0B5BD3); box-shadow:0 3px 14px rgba(21,112,239,0.3); }
.pc-btn-primary:hover { box-shadow:0 6px 20px rgba(21,112,239,0.45); }
.pc-btn-ghost { color:var(--text); background:rgba(11,27,51,0.04); border-color:rgba(11,27,51,0.12); }
.pc-btn-ghost:hover:not(:disabled) { background:rgba(11,27,51,0.08); }
.pc-btn-small { height:32px; padding:0 14px; font-size:12px; color:var(--accent-2); background:rgba(21,112,239,0.1); border-color:rgba(21,112,239,0.3); }
.pc-btn-small:hover { background:rgba(21,112,239,0.18); }
.pc-link { background:none; border:none; color:var(--accent-2); font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; }

.pc-hero { padding:56px 0 28px; background:radial-gradient(ellipse at 50% -20%, rgba(21,112,239,0.16), transparent 60%); }
.pc-eyebrow { font-size:12px; font-weight:600; color:var(--accent-2); letter-spacing:1px; text-transform:uppercase; margin-bottom:10px; }
.pc-hero h1 { font-size:clamp(26px,4vw,40px); font-weight:800; letter-spacing:-0.6px; margin:0 0 10px; }
.pc-hero p { font-size:15px; color:var(--muted); max-width:620px; line-height:1.6; margin:0; }
.pc-hero p b { color:var(--text); }

.pc-search { display:flex; align-items:center; gap:10px; margin-top:26px; max-width:620px; padding:6px 6px 6px 16px; border-radius:14px; background:rgba(11,27,51,0.04); border:1px solid rgba(11,27,51,0.12); color:var(--muted); transition:border-color .2s; }
.pc-search:focus-within { border-color:rgba(21,112,239,0.5); background:rgba(21,112,239,0.05); }
.pc-search input { flex:1; min-width:0; height:40px; background:none; border:none; outline:none; color:var(--text); font-size:14px; font-family:inherit; }
.pc-search input::placeholder { color:#7A889C; }

.pc-chips { display:flex; gap:8px; margin-top:18px; overflow-x:auto; padding-bottom:8px; scrollbar-width:thin; scrollbar-color:rgba(11,27,51,0.14) transparent; }
.pc-chips::-webkit-scrollbar { height:6px; }
.pc-chips::-webkit-scrollbar-track { background:transparent; }
.pc-chips::-webkit-scrollbar-thumb { background:rgba(11,27,51,0.14); border-radius:6px; }
.pc-chip { flex-shrink:0; height:34px; padding:0 14px; border-radius:20px; font-size:12.5px; font-weight:500; font-family:inherit; cursor:pointer; color:var(--muted); background:rgba(11,27,51,0.04); border:1px solid rgba(11,27,51,0.09); transition:all .2s; white-space:nowrap; }
.pc-chip:hover { color:var(--text); border-color:rgba(11,27,51,0.2); }
.pc-chip.active { color:#fff; background:var(--accent); border-color:var(--accent); }

.pc-main { padding-top:24px; padding-bottom:60px; }
.pc-results-head { display:flex; align-items:flex-end; justify-content:space-between; gap:12px; margin-bottom:18px; }
.pc-results-head h2 { font-size:20px; font-weight:700; margin:0; }
.pc-results-head p { font-size:13px; color:var(--muted); margin:4px 0 0; }

.pc-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:16px; }
.pc-card { display:flex; flex-direction:column; border-radius:16px; overflow:hidden; background:linear-gradient(160deg,var(--card),#FFFFFF); border:1px solid var(--line); transition:transform .2s, border-color .2s, box-shadow .2s; }
.pc-card:hover { transform:translateY(-3px); border-color:rgba(21,112,239,0.3); box-shadow:0 12px 32px rgba(11,27,51,0.122); }
.pc-card-img { position:relative; aspect-ratio:4/3; background:#fff; display:flex; align-items:center; justify-content:center; }
.pc-card-img img { width:82%; height:82%; object-fit:contain; }
.pc-stock { position:absolute; top:10px; left:10px; font-size:10.5px; font-weight:700; padding:3px 9px; border-radius:20px; }
.pc-stock.ok { background:#dcfce7; color:#166534; }
.pc-stock.soon { background:#fef3c7; color:#92400e; }
.pc-card-body { flex:1; display:flex; flex-direction:column; padding:14px 16px 16px; }
.pc-brandline { height:20px; display:flex; align-items:center; margin-bottom:8px; }
.pc-brandlogo { max-height:18px; max-width:90px; object-fit:contain; background:#fff; border-radius:4px; padding:1px 4px; }
.pc-marca { font-size:11px; font-weight:700; letter-spacing:0.6px; text-transform:uppercase; color:var(--accent-2); }
.pc-name { font-size:13.5px; font-weight:600; line-height:1.4; margin:0; color:var(--text); display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; min-height:calc(1.4em * 3); }
.pc-model { margin-top:6px; font-size:11.5px; color:var(--muted); font-family:ui-monospace,'SF Mono',Menlo,monospace; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pc-card-foot { margin-top:auto; padding-top:14px; display:flex; align-items:center; justify-content:space-between; gap:8px; }
.pc-price-lock { display:inline-flex; align-items:center; gap:5px; font-size:11.5px; color:var(--muted); }

.pc-skeleton .pc-card-img { background:rgba(11,27,51,0.05); animation:pc-pulse 1.4s ease-in-out infinite; }
.pc-sk-line { height:12px; margin:14px 16px 0; border-radius:6px; background:rgba(11,27,51,0.06); animation:pc-pulse 1.4s ease-in-out infinite; }
.pc-sk-line.short { width:50%; margin-bottom:18px; }
@keyframes pc-pulse { 0%,100% { opacity:.5 } 50% { opacity:1 } }

.pc-state { text-align:center; padding:60px 20px; border-radius:16px; border:1px dashed rgba(11,27,51,0.12); color:var(--muted); }
.pc-state p { margin:0 0 14px; font-size:14px; }
.pc-more { display:flex; justify-content:center; margin-top:28px; }

.pc-cta { margin-top:56px; padding:28px 32px; border-radius:18px; display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap;
  background:linear-gradient(135deg,rgba(21,112,239,0.14),rgba(11,91,211,0.06)); border:1px solid rgba(21,112,239,0.25); }
.pc-cta h2 { font-size:20px; margin:0 0 6px; }
.pc-cta p { margin:0; font-size:14px; color:var(--muted); max-width:560px; }
.pc-cta-actions { display:flex; gap:10px; flex-wrap:wrap; }

.pc-footer { padding:28px 0; border-top:1px solid var(--line); font-size:12px; color:#5B6B82; text-align:center; }
.pc-footer a { color:inherit; }

@media (max-width: 720px) {
  .pc-container { padding:0 16px; }
    .pc-hero { padding-top:36px; }
  .pc-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
  .pc-card-body { padding:10px 12px 12px; }
  .pc-name { font-size:12.5px; }
  .pc-card-foot { flex-direction:column; align-items:stretch; }
  .pc-btn-small { width:100%; }
  .pc-cta { padding:22px 18px; }
  .pc-cta-actions, .pc-cta-actions .pc-btn { width:100%; }
}
</style>
