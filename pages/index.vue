<template>
  <div class="lp">

    <SiteNavbar />

    <!-- ───────────── HERO ───────────── -->
    <section class="lp-hero">
      <div class="lp-wrap lp-hero-grid">
        <div class="lp-hero-text">
          <span class="lp-eyebrow"><span class="lp-dot" /> Distribuidor B2B en Chiapas</span>
          <h1>Equipa tu proyecto con <em>tecnología profesional</em></h1>
          <p>Videovigilancia, redes, control de acceso y energía de las mejores marcas. Precios de distribuidor para integradores y empresas, con factura CFDI en cada compra.</p>
          <div class="lp-hero-ctas">
            <a href="#contacto" class="lp-btn lp-btn-primary" @click.prevent="scrollTo('contacto')">
              Solicitar acceso
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <NuxtLink to="/productos" class="lp-btn lp-btn-ghost">Explorar catálogo</NuxtLink>
          </div>
          <dl class="lp-hero-stats">
            <div><dt>{{ categorias.length }}</dt><dd>categorías</dd></div>
            <div v-if="marcas.length"><dt>{{ marcas.length }}+</dt><dd>marcas líderes</dd></div>
            <div><dt>CFDI 4.0</dt><dd>factura inmediata</dd></div>
          </dl>
        </div>

        <div v-if="heroFotos.length === 4" class="lp-hero-visual" aria-hidden="true">
          <div class="lp-hero-blob" />
          <div class="lp-hero-mosaic">
            <div v-for="(c, i) in heroFotos" :key="c.id" :class="['lp-hero-tile', `t${i}`]">
              <img :src="c.imagen2 || c.imagen" alt="" />
              <span>{{ c.nombre }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Beneficios -->
      <div class="lp-wrap">
        <ul class="lp-perks">
          <li v-for="b in beneficios" :key="b.titulo">
            <span class="lp-perk-ico" v-html="b.icon" />
            <div><strong>{{ b.titulo }}</strong><span>{{ b.texto }}</span></div>
          </li>
        </ul>
      </div>
    </section>

    <!-- ───────────── CATEGORÍAS ───────────── -->
    <section id="categorias" class="lp-wrap lp-section">
      <div class="lp-section-head">
        <div>
          <span class="lp-kicker">Catálogo</span>
          <h2>Explora por categoría</h2>
        </div>
        <NuxtLink to="/productos" class="lp-more">Ver todo el catálogo →</NuxtLink>
      </div>

      <div class="lp-cats">
        <NuxtLink v-for="(c, i) in categorias" :key="c.id" :to="`/productos?categoria=${c.id}`" class="lp-cat" :style="{ '--tint': tintes[i % tintes.length] }">
          <div class="lp-cat-photo">
            <img v-if="c.imagen" :src="c.imagen" :alt="c.nombre" loading="lazy" @error="(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')" />
          </div>
          <div class="lp-cat-foot">
            <span>{{ c.nombre }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </NuxtLink>
        <NuxtLink to="/productos" class="lp-cat lp-cat-all">
          <div class="lp-cat-photo">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/></svg>
          </div>
          <div class="lp-cat-foot">
            <span>Ver todo el catálogo</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ───────────── PRODUCTOS DESTACADOS ───────────── -->
    <section v-if="todos.length" id="productos" class="lp-section lp-products-band">
      <div class="lp-wrap">
        <div class="lp-section-head">
          <div>
            <span class="lp-kicker">En existencia</span>
            <h2>Productos destacados</h2>
          </div>
          <div class="lp-tabs" role="tablist" aria-label="Filtrar productos">
            <button v-for="t in tabs" :key="t.id" type="button" role="tab" :aria-selected="tab === t.id" :class="{ active: tab === t.id }" @click="tab = t.id">{{ t.nombre }}</button>
          </div>
        </div>

        <div class="lp-grid">
          <article v-for="p in visibles" :key="p.id" class="lp-card">
            <div class="lp-card-img">
              <img :src="p.imagen" :alt="p.nombre" loading="lazy" @error="(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')" />
              <span class="lp-card-stock"><i /> Disponible</span>
            </div>
            <div class="lp-card-body">
              <span class="lp-card-brand">{{ p.marca }}</span>
              <h3 class="lp-card-name" :title="p.nombre">{{ p.nombre }}</h3>
              <button type="button" class="lp-card-model" :title="copiado === p.id ? '¡Copiado!' : 'Copiar modelo'" @click="copiar(p)">
                <span>{{ p.modelo }}</span>
                <svg v-if="copiado !== p.id" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </button>
              <div class="lp-card-foot">
                <span class="lp-card-lock">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Precio para clientes
                </span>
                <NuxtLink to="/login" class="lp-card-go" :aria-label="`Ver precio de ${p.modelo}`">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ───────────── MARCAS ───────────── -->
    <section v-if="marcas.length" class="lp-wrap lp-section lp-brands-section">
      <p class="lp-brands-title">Distribuimos las marcas que usan los integradores</p>
      <div class="lp-brands" aria-label="Marcas que manejamos">
        <div class="lp-brands-track" :style="{ animationDuration: `${marcas.length * 3.5}s` }">
          <img v-for="(m, i) in [...marcas, ...marcas]" :key="`${m.nombre}-${i}`" :src="m.logo" :alt="i < marcas.length ? m.nombre : ''" :aria-hidden="i >= marcas.length"
            @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')" />
        </div>
      </div>
    </section>

    <!-- ───────────── CONTACTO ───────────── -->
    <section id="contacto" class="lp-wrap lp-section lp-contact-section">
      <div class="lp-contact">
        <div class="lp-contact-text">
          <span class="lp-kicker lp-kicker-light">Quiero ser cliente</span>
          <h2>Obtén tus precios de distribuidor</h2>
          <p>Déjanos tus datos y un ejecutivo te contacta en menos de 24 horas para activar tu cuenta.</p>
          <ul>
            <li>Precios preferenciales según tu volumen</li>
            <li>Factura CFDI de cada pedido</li>
            <li>Envío a tu empresa o a tu obra</li>
            <li>Seguimiento de pedidos en línea</li>
          </ul>
        </div>

        <div class="lp-contact-card">
          <div v-if="requestSent" class="lp-contact-done">
            <div class="lp-done-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h3>¡Mensaje recibido!</h3>
            <p>Gracias por tu interés. Nos pondremos en contacto contigo a la brevedad.</p>
            <button type="button" class="lp-btn lp-btn-ghost" @click="requestSent = false; resetForm()">Enviar otra solicitud</button>
          </div>

          <form v-else class="lp-form" @submit.prevent="handleRequest">
            <label>Nombre completo *<input v-model="form.name" type="text" placeholder="Juan García" required /></label>
            <label>Correo electrónico *<input v-model="form.email" type="email" placeholder="juan@miempresa.com" required /></label>
            <div class="lp-form-row">
              <label>Empresa<input v-model="form.company" type="text" placeholder="Mi Empresa S.A. de C.V." /></label>
              <label>Teléfono<input v-model="form.phone" type="tel" placeholder="961 000 0000" /></label>
            </div>
            <p v-if="reqError" class="lp-form-error">{{ reqError }}</p>
            <button type="submit" class="lp-btn lp-btn-primary lp-btn-block" :disabled="reqLoading">{{ reqLoading ? 'Enviando…' : 'Solicitar acceso' }}</button>
          </form>
        </div>
      </div>
    </section>

    <!-- ───────────── FOOTER ───────────── -->
    <footer class="lp-footer">
      <div class="lp-wrap lp-footer-grid">
        <div class="lp-footer-brand">
          <img src="/logosieeg.jpg" alt="SIEEG" />
          <p>Distribuidores especializados en tecnología para empresas e integradores, con precios preferenciales y facturación CFDI inmediata.</p>
        </div>
        <div>
          <h3>Categorías</h3>
          <ul>
            <li v-for="c in categorias.slice(0, 6)" :key="c.id"><NuxtLink :to="`/productos?categoria=${c.id}`">{{ c.nombre }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3>SIEEG</h3>
          <ul>
            <li><NuxtLink to="/productos">Catálogo de productos</NuxtLink></li>
            <li><NuxtLink to="/login">Iniciar sesión</NuxtLink></li>
            <li><a href="#contacto" @click.prevent="scrollTo('contacto')">Quiero ser cliente</a></li>
            <li><NuxtLink to="/terminos">Términos y Condiciones</NuxtLink></li>
            <li><NuxtLink to="/privacidad">Políticas de Privacidad</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h3>Contacto</h3>
          <ul class="lp-footer-contact">
            <li>Boulevard Belisario Domínguez #4213 L5, Tuxtla Gutiérrez, Chiapas</li>
            <li><a href="tel:9611180157">961 118 0157</a></li>
            <li><a href="mailto:contacto@sieeg.com.mx">contacto@sieeg.com.mx</a></li>
            <li>Lun – Vie 07:00 – 20:00<br />Sáb 07:00 – 17:00</li>
          </ul>
        </div>
      </div>
      <div class="lp-wrap">
        <div class="lp-footer-bottom">© {{ new Date().getFullYear() }} SIEEG Integradores. Todos los derechos reservados.</div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'landing', middleware: 'redirect-authenticated' })

// Catálogo público (sin precios). Si SYSCOM falla, las secciones se ocultan.
interface ProductoPublico { id: string; nombre: string; modelo: string; marca: string; marcaLogo: string; imagen: string; disponible: boolean }
interface CategoriaPortada { id: string; nombre: string; imagen: string; imagen2?: string }

const TABS = [
  { id: '22', nombre: 'Videovigilancia' },
  { id: '26', nombre: 'Redes e IT' },
  { id: '37', nombre: 'Control de Acceso' },
  { id: '30', nombre: 'Energía' },
]
const POR_PESTANA = 8

const { data: catalogo } = await useAsyncData('landing-catalogo', async () => {
  const [portadas, ...listas] = await Promise.all([
    $fetch<CategoriaPortada[]>('/api/public/categorias-portada').catch(() => [] as CategoriaPortada[]),
    ...TABS.map(t =>
      $fetch<{ productos: ProductoPublico[] }>('/api/public/catalogo', { query: { categoria: t.id } })
        .then(r => r.productos)
        .catch(() => [] as ProductoPublico[]),
    ),
  ])
  // SYSCOM repite productos y variantes con el mismo modelo: sin duplicados, solo con existencia
  const porCategoria: Record<string, ProductoPublico[]> = {}
  TABS.forEach((t, i) => {
    const vistos = new Set<string>()
    porCategoria[t.id] = listas[i].filter(p => {
      if (!p.disponible || vistos.has(p.modelo)) return false
      vistos.add(p.modelo)
      return true
    }).slice(0, POR_PESTANA)
  })
  // Marcas con logotipo, una por marca base ("LINKEDPRO BY EPCOM" y "LINKEDPRO" son la misma)
  const marcas: { nombre: string; logo: string }[] = []
  const vistas = new Set<string>()
  for (const p of listas.flat()) {
    const base = p.marca.split(/\s+by\s+/i)[0].trim().toUpperCase()
    if (!p.marcaLogo || vistas.has(base)) continue
    vistas.add(base); marcas.push({ nombre: p.marca, logo: p.marcaLogo })
  }
  return { portadas, porCategoria, marcas }
})

// Nombres fijos por si SYSCOM no responde; las fotos llegan de /api/public/categorias-portada
const CATEGORIAS_BASE: CategoriaPortada[] = [
  { id: '22', nombre: 'Videovigilancia', imagen: '' },
  { id: '26', nombre: 'Redes e IT', imagen: '' },
  { id: '37', nombre: 'Control de Acceso', imagen: '' },
  { id: '30', nombre: 'Energía y Climatización', imagen: '' },
  { id: '65811', nombre: 'Cableado Estructurado', imagen: '' },
  { id: '32', nombre: 'Automatización e Intrusión', imagen: '' },
  { id: '38', nombre: 'Detección de Fuego', imagen: '' },
  { id: '25', nombre: 'Radiocomunicación', imagen: '' },
  { id: '27', nombre: 'GPS y Equipamiento Vehicular', imagen: '' },
  { id: '66523', nombre: 'Audio y Video Profesional', imagen: '' },
  { id: '42', nombre: 'Herramientas y Material Eléctrico', imagen: '' },
  { id: '66630', nombre: 'Industria, BMS y Robots', imagen: '' },
  { id: '67040', nombre: 'Retail y Punto de Venta', imagen: '' },
]
const categorias = computed(() => catalogo.value?.portadas?.length ? catalogo.value.portadas : CATEGORIAS_BASE)
const heroFotos  = computed(() => categorias.value.filter(c => c.imagen).slice(0, 4))
const marcas     = computed(() => catalogo.value?.marcas ?? [])
const tintes     = ['#EAF2FF', '#E8F7F4', '#F1EDFF', '#FFF4E5', '#E9F5FB', '#FDEEEF', '#F2F7E8']

// ── Pestañas de productos ──
const tabs = computed(() => [{ id: 'todos', nombre: 'Todos' }, ...TABS.filter(t => catalogo.value?.porCategoria[t.id]?.length)])
const tab  = ref('todos')
const todos = computed(() => {
  // Intercala categorías para que "Todos" se vea variado
  // (un mismo producto puede estar en dos categorías: se muestra una vez)
  const listas = TABS.map(t => catalogo.value?.porCategoria[t.id] ?? [])
  const out: ProductoPublico[] = []
  const vistos = new Set<string>()
  for (let i = 0; out.length < POR_PESTANA && listas.some(l => i < l.length); i++) {
    for (const l of listas) {
      const p = l[i]
      if (!p || out.length >= POR_PESTANA || vistos.has(p.modelo)) continue
      vistos.add(p.modelo); out.push(p)
    }
  }
  return out
})
const visibles = computed(() => tab.value === 'todos' ? todos.value : (catalogo.value?.porCategoria[tab.value] ?? []))

// ── Copiar modelo ──
const copiado = ref('')
async function copiar(p: ProductoPublico) {
  try {
    await navigator.clipboard.writeText(p.modelo)
    copiado.value = p.id
    setTimeout(() => { if (copiado.value === p.id) copiado.value = '' }, 1500)
  } catch { /* portapapeles no disponible */ }
}

const ico = (paths: string) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
const beneficios = [
  { titulo: 'Precios de distribuidor', texto: 'Tarifas preferenciales para tu empresa', icon: ico('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>') },
  { titulo: 'Factura CFDI',            texto: 'Al momento, 100% digital',               icon: ico('<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/>') },
  { titulo: 'Envío a domicilio',       texto: 'A tu empresa, sucursal u obra',          icon: ico('<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>') },
  { titulo: 'Ejecutivo dedicado',      texto: 'Cotizaciones y soporte personalizado',   icon: ico('<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>') },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ── Formulario "Quiero ser cliente" ──
const form = reactive({ name: '', email: '', company: '', phone: '' })
const reqLoading  = ref(false)
const reqError    = ref('')
const requestSent = ref(false)

function resetForm() {
  form.name = ''; form.email = ''; form.company = ''; form.phone = ''
  reqError.value = ''
}

async function handleRequest() {
  reqLoading.value = true
  reqError.value = ''
  try {
    await $fetch('/api/contact/request', {
      method: 'POST',
      body: { name: form.name, email: form.email, company: form.company, phone: form.phone },
    })
    requestSent.value = true
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message
    reqError.value = msg ?? 'Ocurrió un error. Por favor intenta de nuevo.'
  } finally {
    reqLoading.value = false
  }
}
</script>

<style scoped>
.lp {
  --brand: #1570EF;
  --brand-d: #0B5BD3;
  --brand-soft: #EAF2FF;
  --ink: #0B1B33;
  --ink-2: #13294B;
  --muted: #5B6B82;
  --line: #E4E9F1;
  --bg-soft: #F5F8FC;
  --gutter: 32px;
  min-height: 100vh;
  background: #fff;
  color: var(--ink);
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  overflow-x: hidden;
}
.lp *, .lp *::before, .lp *::after { box-sizing: border-box; }
.lp img { max-width: 100%; }
.lp-wrap { width: 100%; max-width: calc(1280px + 2 * var(--gutter)); margin: 0 auto; padding-left: var(--gutter); padding-right: var(--gutter); }

/* ── Botones ── */
.lp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 48px; padding: 0 22px; border-radius: 12px; font-size: 15px; font-weight: 600; text-decoration: none; border: 1px solid transparent; cursor: pointer; font-family: inherit; transition: background .2s, border-color .2s, transform .2s, box-shadow .2s; white-space: nowrap; }
.lp-btn-sm { height: 40px; padding: 0 16px; font-size: 14px; border-radius: 10px; }
.lp-btn-block { width: 100%; }
.lp-btn-primary { background: var(--brand); color: #fff; box-shadow: 0 6px 18px rgba(21,112,239,0.28); }
.lp-btn-primary:hover:not(:disabled) { background: var(--brand-d); transform: translateY(-1px); }
.lp-btn-primary:disabled { opacity: .75; cursor: not-allowed; }
.lp-btn-ghost { background: #fff; color: var(--ink); border-color: var(--line); }
.lp-btn-ghost:hover { border-color: #C5D2E4; background: var(--bg-soft); }

/* ── Hero ── */
.lp-hero { background: radial-gradient(900px 480px at 85% 10%, #DCEBFF 0%, transparent 60%), linear-gradient(180deg, #F3F8FF 0%, #fff 100%); padding-top: 56px; }
.lp-hero-grid { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 48px; align-items: center; }
.lp-eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 999px; background: #fff; border: 1px solid var(--line); font-size: 13px; font-weight: 600; color: var(--ink-2); box-shadow: 0 2px 8px rgba(11,27,51,0.05); }
.lp-dot { width: 8px; height: 8px; border-radius: 50%; background: #22C55E; box-shadow: 0 0 0 4px rgba(34,197,94,0.18); }
.lp-hero h1 { font-size: clamp(32px, 4.4vw, 58px); line-height: 1.08; letter-spacing: -1.5px; font-weight: 800; margin: 20px 0 18px; color: var(--ink); overflow-wrap: break-word; }
.lp-hero h1 em { font-style: normal; color: var(--brand); background: linear-gradient(transparent 68%, #CFE2FF 68%); }
.lp-hero-text > p { font-size: clamp(16px, 1.3vw, 18px); line-height: 1.7; color: var(--muted); max-width: 560px; margin: 0 0 30px; }
.lp-hero-ctas { display: flex; flex-wrap: wrap; gap: 12px; }
.lp-hero-stats { display: flex; flex-wrap: wrap; gap: 20px 36px; margin: 40px 0 0; padding: 0; }
.lp-hero-stats div { display: flex; flex-direction: column-reverse; }
.lp-hero-stats dt { font-size: 26px; font-weight: 800; color: var(--ink); letter-spacing: -0.5px; }
.lp-hero-stats dd { margin: 0; font-size: 13.5px; color: var(--muted); }

.lp-hero-visual { position: relative; }
.lp-hero-blob { position: absolute; inset: 30px 20px; border-radius: 40% 60% 55% 45% / 50% 40% 60% 50%; background: linear-gradient(135deg, #1570EF 0%, #06B6D4 100%); opacity: 0.12; }
.lp-hero-mosaic { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: 10px 10px 30px; max-width: 560px; margin-left: auto; }
.lp-hero-tile { position: relative; min-width: 0; background: #fff; border-radius: 22px; border: 1px solid var(--line); box-shadow: 0 20px 44px rgba(11,27,51,0.10); padding: 18px 18px 44px; display: flex; align-items: center; justify-content: center; aspect-ratio: 1 / 0.95; }
.lp-hero-tile img { width: 100%; height: 100%; object-fit: contain; }
.lp-hero-tile span { position: absolute; left: 16px; right: 12px; bottom: 14px; font-size: 13px; font-weight: 600; color: var(--ink-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lp-hero-tile.t1, .lp-hero-tile.t3 { transform: translateY(28px); }

.lp-perks { list-style: none; margin: 48px 0 0; padding: 22px 8px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); background: #fff; border: 1px solid var(--line); border-radius: 18px; box-shadow: 0 14px 36px rgba(11,27,51,0.06); position: relative; top: 36px; }
.lp-perks li { display: flex; align-items: center; gap: 14px; padding: 4px 20px; min-width: 0; }
.lp-perks li + li { border-left: 1px solid var(--line); }
.lp-perk-ico { width: 46px; height: 46px; border-radius: 12px; background: var(--brand-soft); color: var(--brand); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.lp-perks strong { display: block; font-size: 15px; color: var(--ink); }
.lp-perks li span:not(.lp-perk-ico) { font-size: 13px; color: var(--muted); }

/* ── Secciones ── */
.lp-section { padding-top: 96px; }
.lp-section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px 20px; flex-wrap: wrap; margin-bottom: 28px; }
.lp-section-head > div:first-child { min-width: 0; }
.lp-kicker { display: block; font-size: 13px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: var(--brand); margin-bottom: 8px; }
.lp-kicker-light { color: #7CB6FF; }
.lp-section h2 { font-size: clamp(26px, 3vw, 40px); font-weight: 800; letter-spacing: -0.8px; margin: 0; color: var(--ink); }
.lp-more { font-size: 14.5px; font-weight: 600; color: var(--brand-d); text-decoration: none; }
.lp-more:hover { text-decoration: underline; }

/* ── Categorías con foto ── */
.lp-section#categorias { padding-top: 128px; }
.lp-cats { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 16px; }
.lp-cat { display: flex; flex-direction: column; min-width: 0; border-radius: 18px; background: var(--tint); text-decoration: none; color: var(--ink); overflow: hidden; border: 1px solid transparent; transition: transform .25s, box-shadow .25s, border-color .25s; }
.lp-cat:hover { transform: translateY(-4px); box-shadow: 0 18px 36px rgba(11,27,51,0.12); border-color: rgba(21,112,239,0.25); }
.lp-cat-photo { aspect-ratio: 1 / 0.82; display: flex; align-items: center; justify-content: center; padding: 18px 18px 6px; }
.lp-cat-photo img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; transition: transform .35s; }
.lp-cat:hover .lp-cat-photo img { transform: scale(1.07); }
.lp-cat-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 16px 16px; font-size: 14.5px; font-weight: 700; line-height: 1.3; min-height: 3.6em; }
.lp-cat-all { background: var(--ink); color: #fff; }
.lp-cat-all .lp-cat-photo { color: #7CB6FF; }
.lp-cat-all .lp-cat-foot svg { color: #7CB6FF; opacity: 1; transform: none; }
.lp-cat-foot svg { flex-shrink: 0; color: var(--brand); opacity: 0; transform: translateX(-4px); transition: opacity .2s, transform .2s; }
.lp-cat:hover .lp-cat-foot svg { opacity: 1; transform: translateX(0); }

/* ── Productos ── */
.lp-products-band { margin-top: 96px; padding-top: 72px; padding-bottom: 80px; background: var(--bg-soft); }
.lp-tabs { display: flex; gap: 6px; padding: 5px; background: #fff; border: 1px solid var(--line); border-radius: 12px; overflow-x: auto; scrollbar-width: none; max-width: 100%; }
.lp-tabs::-webkit-scrollbar { display: none; }
.lp-tabs button { flex-shrink: 0; height: 36px; padding: 0 14px; border: none; border-radius: 8px; background: transparent; color: var(--muted); font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
.lp-tabs button:hover { color: var(--ink); }
.lp-tabs button.active { background: var(--ink); color: #fff; }
.lp-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
.lp-card { display: flex; flex-direction: column; min-width: 0; background: #fff; border-radius: 18px; border: 1px solid var(--line); overflow: hidden; transition: transform .2s, box-shadow .2s; }
.lp-card:hover { transform: translateY(-3px); box-shadow: 0 16px 34px rgba(11,27,51,0.09); }
.lp-card-img { position: relative; aspect-ratio: 1 / 0.85; display: flex; align-items: center; justify-content: center; padding: 22px; background: #fff; border-bottom: 1px solid var(--line); }
.lp-card-img img { width: 100%; height: 100%; object-fit: contain; }
.lp-card-stock { position: absolute; top: 12px; left: 12px; display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; background: #ECFDF3; color: #15803D; font-size: 12px; font-weight: 700; }
.lp-card-stock i { width: 6px; height: 6px; border-radius: 50%; background: #22C55E; }
.lp-card-body { flex: 1; display: flex; flex-direction: column; padding: 16px 18px 18px; min-width: 0; }
.lp-card-brand { font-size: 12px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lp-card-name { margin: 6px 0 8px; font-size: 15px; font-weight: 600; line-height: 1.4; color: var(--ink); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.8em; }
.lp-card-model { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 3px 8px; border-radius: 6px; border: none; background: var(--bg-soft); color: var(--ink-2); font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 12px; cursor: pointer; }
.lp-card-model span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lp-card-model svg { flex-shrink: 0; }
.lp-card-model:hover { background: var(--brand-soft); color: var(--brand-d); }
.lp-card-foot { margin-top: auto; padding-top: 16px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.lp-card-lock { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); min-width: 0; }
.lp-card-lock svg { flex-shrink: 0; }
.lp-card-go { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--ink); color: #fff; flex-shrink: 0; transition: background .2s, transform .2s; }
.lp-card-go:hover { background: var(--brand); transform: translateX(2px); }

/* ── Marcas ── */
.lp-brands-section { padding-top: 72px; }
.lp-brands-title { text-align: center; font-size: 15px; font-weight: 600; color: var(--muted); margin: 0 0 28px; }
.lp-brands { overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.lp-brands-track { display: flex; align-items: center; gap: 64px; width: max-content; animation: lp-marquee linear infinite; }
.lp-brands:hover .lp-brands-track { animation-play-state: paused; }
.lp-brands-track img { height: 40px; width: auto; max-width: 150px; object-fit: contain; filter: grayscale(1); opacity: .6; transition: filter .25s, opacity .25s; }
.lp-brands-track img:hover { filter: none; opacity: 1; }
@keyframes lp-marquee { from { transform: translateX(0); } to { transform: translateX(calc(-50% - 32px)); } }
@media (prefers-reduced-motion: reduce) { .lp-brands-track { animation: none; } .lp-brands { overflow-x: auto; } }

/* ── Contacto ── */
.lp-contact-section { padding-bottom: 96px; scroll-margin-top: 140px; }
.lp-contact { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 48px; align-items: center; padding: 56px; border-radius: 28px; overflow: hidden; color: #fff; background: radial-gradient(600px 360px at 0% 0%, rgba(21,112,239,0.45), transparent 60%), radial-gradient(500px 320px at 100% 100%, rgba(6,182,212,0.30), transparent 60%), var(--ink); }
.lp-contact-text h2 { color: #fff; margin-bottom: 14px; }
.lp-contact-text p { font-size: 16.5px; line-height: 1.7; color: rgba(255,255,255,0.78); margin: 0 0 22px; max-width: 460px; }
.lp-contact-text ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
.lp-contact-text li { display: flex; align-items: center; gap: 12px; font-size: 15.5px; color: rgba(255,255,255,0.92); }
.lp-contact-text li::before { content: ''; width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; background: rgba(34,197,94,0.2) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234ADE80' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E") center / 12px no-repeat; }
.lp-contact-card { background: #fff; color: var(--ink); border-radius: 20px; padding: 32px; box-shadow: 0 30px 60px rgba(0,0,0,0.3); min-width: 0; }
.lp-form { display: flex; flex-direction: column; gap: 14px; }
.lp-form label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; color: var(--ink-2); min-width: 0; }
.lp-form input { width: 100%; height: 46px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--line); background: var(--bg-soft); font-size: 15px; color: var(--ink); font-family: inherit; outline: none; transition: border-color .2s, box-shadow .2s, background .2s; min-width: 0; }
.lp-form input:focus { background: #fff; border-color: var(--brand); box-shadow: 0 0 0 4px rgba(21,112,239,0.12); }
.lp-form-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; }
.lp-form-error { margin: 0; padding: 10px 12px; border-radius: 10px; background: #FEF2F2; color: #B91C1C; font-size: 13.5px; }
.lp-form .lp-btn { margin-top: 6px; }
.lp-contact-done { text-align: center; padding: 16px 0; }
.lp-done-ico { width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; background: #ECFDF3; color: #16A34A; }
.lp-contact-done h3 { margin: 0 0 8px; font-size: 21px; }
.lp-contact-done p { margin: 0 0 20px; color: var(--muted); line-height: 1.6; }

/* ── Footer ── */
.lp-footer { background: var(--ink); color: rgba(255,255,255,0.72); padding-top: 64px; }
.lp-footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.2fr; gap: 40px; padding-bottom: 48px; }
.lp-footer-grid > div { min-width: 0; }
.lp-footer-brand img { height: 52px; width: auto; background: #fff; border-radius: 10px; padding: 6px 10px; }
.lp-footer-brand p { margin: 18px 0 0; font-size: 14.5px; line-height: 1.75; max-width: 320px; }
.lp-footer h3 { font-size: 13px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #fff; margin: 6px 0 18px; }
.lp-footer ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 11px; font-size: 14.5px; }
.lp-footer a { color: inherit; text-decoration: none; overflow-wrap: anywhere; }
.lp-footer a:hover { color: #fff; }
.lp-footer-contact li { line-height: 1.55; }
.lp-footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 22px; padding-bottom: 28px; font-size: 13.5px; color: rgba(255,255,255,0.5); }

/* ── Responsive ── */

/* Pantallas grandes (2K / 4K): contenedor más ancho y todo un poco más grande */
@media (min-width: 1680px) {
  .lp { --gutter: 48px; }
  .lp-wrap { max-width: calc(1520px + 2 * var(--gutter)); }
  .lp-hero { padding-top: 72px; }
  .lp-hero-mosaic { max-width: 640px; }
  .lp-cats { gap: 20px; }
  .lp-grid { gap: 24px; }
}
@media (min-width: 2200px) {
  .lp { zoom: 1.2; }
}

/* Laptops chicas */
@media (max-width: 1180px) {
  .lp-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lp-cats { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .lp-perks { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 18px; }
  .lp-perks li:nth-child(3) { border-left: none; }
  .lp-footer-grid { grid-template-columns: 1fr 1fr; }
  .lp-contact { padding: 44px; gap: 36px; }
}

/* Tablets */
@media (max-width: 900px) {
  .lp { --gutter: 20px; }
  .lp-hero-grid { grid-template-columns: minmax(0, 1fr); gap: 32px; }
  .lp-hero-mosaic { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; padding: 0; max-width: none; margin: 0; }
  .lp-hero-blob { display: none; }
  .lp-hero-tile { padding: 10px 10px 32px; border-radius: 16px; }
  .lp-hero-tile span { font-size: 11.5px; left: 10px; right: 8px; bottom: 10px; }
  .lp-hero-tile.t1, .lp-hero-tile.t3 { transform: none; }
  .lp-contact { grid-template-columns: minmax(0, 1fr); padding: 36px 28px; gap: 28px; border-radius: 22px; }
  .lp-section-head { align-items: flex-start; flex-direction: column; }
  .lp-cats { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
}

/* Celulares */
@media (max-width: 640px) {
  .lp { --gutter: 16px; }
  .lp-hero { padding-top: 32px; }
  .lp-hero h1 { letter-spacing: -1px; }
  .lp-hero-ctas .lp-btn { flex: 1 1 200px; }
  .lp-hero-stats { gap: 16px 28px; margin-top: 28px; }
  .lp-hero-stats dt { font-size: 21px; }
  .lp-hero-mosaic { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .lp-perks { grid-template-columns: minmax(0, 1fr); top: 24px; padding: 16px 4px; margin-top: 36px; }
  .lp-perks li { padding: 4px 14px; }
  .lp-perks li + li { border-left: none; }
  .lp-section { padding-top: 64px; }
  .lp-section#categorias { padding-top: 88px; }
  .lp-cats { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .lp-cat { border-radius: 14px; }
  .lp-cat-photo { padding: 14px 14px 4px; }
  .lp-cat-foot { font-size: 13.5px; padding: 8px 12px 12px; }
  .lp-cat-foot svg { display: none; }
  .lp-products-band { margin-top: 64px; padding-top: 52px; padding-bottom: 60px; }
  .lp-tabs { width: 100%; }
  .lp-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .lp-card { border-radius: 14px; }
  .lp-card-img { padding: 12px; }
  .lp-card-body { padding: 12px; }
  .lp-card-name { font-size: 13.5px; }
  .lp-card-lock { font-size: 11.5px; }
  .lp-card-go { width: 32px; height: 32px; }
  .lp-brands-section { padding-top: 56px; }
  .lp-brands-track { gap: 40px; }
  .lp-brands-track img { height: 30px; }
  .lp-contact-section { padding-bottom: 64px; }
  .lp-contact { padding: 28px 18px; border-radius: 18px; }
  .lp-contact-card { padding: 22px 16px; border-radius: 16px; }
  .lp-form-row { grid-template-columns: minmax(0, 1fr); }
  .lp-footer { padding-top: 48px; }
  .lp-footer-grid { grid-template-columns: minmax(0, 1fr); gap: 30px; padding-bottom: 36px; }
}

/* Celulares muy angostos (320–380 px) */
@media (max-width: 380px) {
  .lp-grid { grid-template-columns: minmax(0, 1fr); }
  .lp-card-img { aspect-ratio: 1 / 0.7; }
  .lp-card-lock { font-size: 13px; }
  .lp-cat-foot { font-size: 12.5px; }
}
</style>
