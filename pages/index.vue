<template>
  <div class="lp">

    <!-- ───────────── HEADER ───────────── -->
    <header class="lp-header">
      <div class="lp-wrap lp-header-row">
        <NuxtLink to="/" class="lp-logo" aria-label="SIEEG Integradores — inicio">
          <img src="/logosieeg.jpg" alt="SIEEG" />
          <span class="lp-logo-text">SIEEG<small>INTEGRADORES</small></span>
        </NuxtLink>

        <div class="lp-menu-wrap">
          <button type="button" class="lp-icon-btn" aria-label="Categorías" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
          </button>
          <Transition name="lp-drop">
            <nav v-if="menuOpen" class="lp-menu" aria-label="Categorías">
              <div class="lp-menu-title">Categorías</div>
              <NuxtLink v-for="c in categorias" :key="c.id" :to="`/productos?categoria=${c.id}`" @click="menuOpen = false">{{ c.nombre }}</NuxtLink>
              <div class="lp-menu-sep" />
              <a href="#contacto" @click.prevent="menuOpen = false; scrollTo('contacto')">Contacto</a>
            </nav>
          </Transition>
        </div>

        <form class="lp-search" role="search" @submit.prevent="buscar">
          <input v-model="texto" type="search" placeholder="Busca productos..." aria-label="Buscar productos" maxlength="80" />
          <svg class="lp-search-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <button type="submit">Buscar</button>
        </form>

        <div class="lp-header-actions">
          <a href="tel:9611180157" class="lp-hdr-link lp-hide-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            961 118 0157
          </a>
          <NuxtLink to="/login" class="lp-hdr-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
            Entrar
          </NuxtLink>
          <a href="#contacto" class="lp-hdr-cta" @click.prevent="scrollTo('contacto')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            Registro
          </a>
        </div>
      </div>
    </header>

    <!-- ───────────── PROMOCIONES (slider) ───────────── -->
    <section class="lp-wrap lp-promos">
      <h1 class="lp-promos-title">PROMOCIONES Y EVENTOS</h1>
      <p class="lp-promos-sub">Tecnología para tu empresa con precios de distribuidor</p>

      <div class="lp-slider" @mouseenter="sliderPausado = true" @mouseleave="sliderPausado = false">
        <TransitionGroup name="lp-fade">
          <div v-for="(s, i) in slides" v-show="i === slide" :key="s.titulo" class="lp-slide" :style="{ background: s.fondo }">
            <div class="lp-slide-text">
              <span class="lp-slide-badge">{{ s.badge }}</span>
              <h2>{{ s.titulo }}</h2>
              <p>{{ s.texto }}</p>
              <NuxtLink v-if="s.to" :to="s.to" class="lp-slide-btn">{{ s.cta }}</NuxtLink>
              <a v-else href="#contacto" class="lp-slide-btn" @click.prevent="scrollTo('contacto')">{{ s.cta }}</a>
            </div>

            <!-- Visual del slide: productos reales o logotipos de marcas -->
            <div class="lp-slide-visual" aria-hidden="true">
              <div v-if="s.visual === 'productos'" class="lp-slide-prods">
                <div v-for="p in destacados.slice(0, 3)" :key="p.id" class="lp-slide-prod"><img :src="p.imagen" alt="" /></div>
              </div>
              <div v-else-if="s.visual === 'marcas'" class="lp-slide-brands">
                <div v-for="m in marcas.slice(0, 6)" :key="m.nombre" class="lp-slide-brand"><img :src="m.logo" alt="" /></div>
              </div>
              <div v-else class="lp-slide-cfdi">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>
                <span>CFDI 4.0</span>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <button type="button" class="lp-slider-arrow prev" aria-label="Anterior" @click="moverSlide(-1)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <button type="button" class="lp-slider-arrow next" aria-label="Siguiente" @click="moverSlide(1)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
        <div class="lp-slider-dots">
          <button v-for="(s, i) in slides" :key="s.titulo" type="button" :aria-label="`Ir al anuncio ${i + 1}`" :class="{ active: i === slide }" @click="slide = i" />
        </div>
      </div>
    </section>

    <!-- ───────────── DESTACADOS ───────────── -->
    <section v-if="destacados.length" id="productos" class="lp-wrap lp-section">
      <div class="lp-section-head">
        <h2 class="lp-h2">Destacados</h2>
        <NuxtLink to="/productos" class="lp-see-all">Ver catálogo completo →</NuxtLink>
      </div>

      <div class="lp-grid">
        <article v-for="p in destacados" :key="p.id" class="lp-card">
          <div class="lp-card-img">
            <img :src="p.imagen" :alt="p.nombre" loading="lazy" @error="(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')" />
            <span :class="['lp-card-stock', p.disponible ? 'ok' : 'soon']">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              {{ p.disponible ? 'Disponible' : 'Bajo pedido' }}
            </span>
          </div>
          <div class="lp-card-body">
            <div class="lp-card-brand">{{ p.marca }}</div>
            <div class="lp-card-model">
              <span>{{ p.modelo }}</span>
              <button type="button" :aria-label="`Copiar modelo ${p.modelo}`" :title="copiado === p.id ? '¡Copiado!' : 'Copiar modelo'" @click="copiar(p)">
                <svg v-if="copiado !== p.id" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </button>
            </div>
            <h3 class="lp-card-name" :title="p.nombre">{{ p.nombre }}</h3>
            <NuxtLink to="/login" class="lp-card-btn">Iniciar sesión</NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <!-- ───────────── CATEGORÍAS ───────────── -->
    <section class="lp-band">
      <div class="lp-wrap lp-section">
        <h2 class="lp-h2">Categorías Interesantes</h2>
        <div class="lp-cats">
          <NuxtLink v-for="c in categorias" :key="c.id" :to="`/productos?categoria=${c.id}`" class="lp-cat">
            <div class="lp-cat-img" :style="{ '--glow': c.glow }">
              <span v-html="c.icon" />
            </div>
            <div class="lp-cat-name">{{ c.nombre }}</div>
            <div class="lp-cat-line" />
          </NuxtLink>
          <NuxtLink to="/productos" class="lp-cat">
            <div class="lp-cat-img" style="--glow:#3B82F6">
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </div>
            <div class="lp-cat-name">Ver todo el catálogo</div>
            <div class="lp-cat-line" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ───────────── MARCAS ───────────── -->
    <section v-if="marcas.length" class="lp-wrap lp-section">
      <h2 class="lp-h2 lp-h2-underline">Principales Marcas</h2>
      <div class="lp-brands" aria-label="Marcas que manejamos">
        <div class="lp-brands-track" :style="{ animationDuration: `${marcas.length * 3}s` }">
          <div v-for="(m, i) in [...marcas, ...marcas]" :key="`${m.nombre}-${i}`" class="lp-brand" :aria-hidden="i >= marcas.length">
            <img :src="m.logo" :alt="m.nombre" @error="(e) => ((e.target as HTMLImageElement).closest('.lp-brand') as HTMLElement).style.display = 'none'" />
          </div>
        </div>
      </div>
    </section>

    <!-- ───────────── CONTACTO (banda verde) ───────────── -->
    <section id="contacto" class="lp-wrap lp-cta-section">
      <div class="lp-cta">
        <div class="lp-cta-left">
          <h2>¡Obtén precios de distribuidor!</h2>
          <div class="lp-cta-row">
            <div class="lp-cta-bubble">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            </div>
            <ul>
              <li>Precios preferenciales</li>
              <li>Factura CFDI al momento</li>
              <li>Entrega a domicilio</li>
              <li>Ejecutivo dedicado</li>
            </ul>
          </div>
        </div>

        <div class="lp-cta-right">
          <div v-if="requestSent" class="lp-cta-done">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <div>
              <strong>¡Mensaje recibido!</strong>
              <p>Gracias por tu interés. Nos pondremos en contacto contigo a la brevedad.</p>
              <button type="button" @click="requestSent = false; resetForm()">Enviar otra solicitud</button>
            </div>
          </div>

          <form v-else class="lp-cta-form" @submit.prevent="handleRequest">
            <input v-model="form.name" type="text" placeholder="Nombre completo *" aria-label="Nombre completo" required />
            <input v-model="form.email" type="email" placeholder="Correo electrónico *" aria-label="Correo electrónico" required />
            <input v-model="form.company" type="text" placeholder="Empresa" aria-label="Empresa" />
            <input v-model="form.phone" type="tel" placeholder="Teléfono" aria-label="Teléfono" />
            <button type="submit" :disabled="reqLoading">{{ reqLoading ? 'Enviando…' : 'Quiero ser cliente' }}</button>
            <p v-if="reqError" class="lp-cta-error">{{ reqError }}</p>
            <p v-else class="lp-cta-note">Déjanos tus datos y te contactamos en menos de 24 horas para darte acceso.</p>
          </form>
        </div>
      </div>
    </section>

    <!-- ───────────── FOOTER ───────────── -->
    <footer class="lp-footer">
      <div class="lp-wrap lp-footer-grid">
        <div>
          <h3>SIEEG Integradores</h3>
          <p class="lp-footer-desc">Distribuidores especializados en tecnología para empresas: videovigilancia, redes, control de acceso, energía y más, con precios preferenciales y facturación CFDI inmediata.</p>
          <ul class="lp-footer-contact">
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Boulevard Belisario Domínguez #4213 L5, Tuxtla Gutiérrez, Chiapas
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <a href="tel:9611180157">961 118 0157</a>
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
              <a href="mailto:contacto@sieeg.com.mx">contacto@sieeg.com.mx</a>
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Lun – Vie 07:00 – 20:00 · Sáb 07:00 – 17:00
            </li>
          </ul>
        </div>

        <div>
          <h3>Nuestras Políticas</h3>
          <ul class="lp-footer-links">
            <li><NuxtLink to="/terminos">Términos y Condiciones</NuxtLink></li>
            <li><NuxtLink to="/privacidad">Políticas de Privacidad</NuxtLink></li>
          </ul>
          <h3 style="margin-top:28px;">Accesos</h3>
          <ul class="lp-footer-links">
            <li><NuxtLink to="/productos">Catálogo de productos</NuxtLink></li>
            <li><NuxtLink to="/login">Iniciar sesión</NuxtLink></li>
            <li><a href="#contacto" @click.prevent="scrollTo('contacto')">Quiero ser cliente</a></li>
          </ul>
        </div>

        <div>
          <h3>Nuestros Beneficios</h3>
          <div class="lp-benefits">
            <div v-for="b in beneficios" :key="b.titulo" class="lp-benefit">
              <span v-html="b.icon" />
              <span>{{ b.titulo }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="lp-wrap lp-footer-bottom">© {{ new Date().getFullYear() }} SIEEG Integradores. Todos los derechos reservados.</div>
    </footer>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'landing', middleware: 'redirect-authenticated' })

// Catálogo público (sin precios). Mezcla varias categorías; si falla, las secciones se ocultan.
interface ProductoPublico { id: string; nombre: string; modelo: string; marca: string; marcaLogo: string; imagen: string; disponible: boolean }
const CATEGORIAS_DESTACADOS = ['22', '26', '37', '30'] // Videovigilancia, Redes e IT, Control de Acceso, Energía
const { data: catPreview } = await useAsyncData('landing-destacados', async () => {
  const listas = await Promise.all(CATEGORIAS_DESTACADOS.map(categoria =>
    $fetch<{ productos: ProductoPublico[] }>('/api/public/catalogo', { query: { categoria } })
      .then(r => r.productos)
      .catch(() => [] as ProductoPublico[]),
  ))
  // Intercalar categorías para que la cuadrícula se vea variada
  // SYSCOM repite productos entre categorías (y variantes con el mismo modelo): sin duplicados
  const destacados: ProductoPublico[] = []
  const vistos = new Set<string>()
  const disponibles = listas.map(l => l.filter(p => p.disponible))
  for (let i = 0; destacados.length < 15 && disponibles.some(l => i < l.length); i++) {
    for (const l of disponibles) {
      const p = l[i]
      if (!p || destacados.length >= 15 || vistos.has(p.id) || vistos.has(p.modelo)) continue
      vistos.add(p.id); vistos.add(p.modelo); destacados.push(p)
    }
  }
  // Marcas con logotipo, una por marca base ("LINKEDPRO BY EPCOM" y "LINKEDPRO" son la misma)
  const marcas: { nombre: string; logo: string }[] = []
  const vistas = new Set<string>()
  for (const p of listas.flat()) {
    const base = p.marca.split(/\s+by\s+/i)[0].trim().toUpperCase()
    if (!p.marcaLogo || vistas.has(base)) continue
    vistas.add(base); marcas.push({ nombre: p.marca, logo: p.marcaLogo })
  }
  return { destacados, marcas }
})
const destacados = computed(() => catPreview.value?.destacados ?? [])
const marcas     = computed(() => catPreview.value?.marcas ?? [])

// ── Categorías de SYSCOM (ids reales de /api/public/categorias) ──
const ico = (paths: string) => `<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
const categorias = [
  { id: '22',    nombre: 'Videovigilancia',            glow: '#8B5CF6', icon: ico('<path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/>') },
  { id: '26',    nombre: 'Redes e IT',                 glow: '#0EA5E9', icon: ico('<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/>') },
  { id: '37',    nombre: 'Control de Acceso',          glow: '#6366F1', icon: ico('<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>') },
  { id: '30',    nombre: 'Energía y Climatización',    glow: '#F59E0B', icon: ico('<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>') },
  { id: '65811', nombre: 'Cableado Estructurado',      glow: '#14B8A6', icon: ico('<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>') },
  { id: '32',    nombre: 'Automatización e Intrusión', glow: '#EF4444', icon: ico('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>') },
  { id: '38',    nombre: 'Detección de Fuego',         glow: '#F97316', icon: ico('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>') },
  { id: '25',    nombre: 'Radiocomunicación',          glow: '#22C55E', icon: ico('<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>') },
  { id: '27',    nombre: 'GPS y Equipamiento Vehicular', glow: '#3B82F6', icon: ico('<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>') },
  { id: '66523', nombre: 'Audio y Video Profesional',  glow: '#EC4899', icon: ico('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>') },
  { id: '42',    nombre: 'Herramientas y Material Eléctrico', glow: '#EAB308', icon: ico('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>') },
  { id: '66630', nombre: 'Industria, BMS y Robots',    glow: '#06B6D4', icon: ico('<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>') },
  { id: '67040', nombre: 'Retail y Punto de Venta',    glow: '#A855F7', icon: ico('<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>') },
]

// ── Slider de promociones ──
const slides = [
  { badge: 'DISTRIBUCIÓN B2B · MÉXICO', titulo: '¡Tecnología para tu empresa!', texto: 'Videovigilancia, redes, control de acceso y energía de las mejores marcas, con precios preferenciales para empresas e integradores.', cta: 'Quiero ser cliente', to: '', visual: 'productos', fondo: 'linear-gradient(120deg,#5B1C8C 0%,#3B2A9E 45%,#1E4FD1 100%)' },
  { badge: 'CATÁLOGO COMPLETO',          titulo: 'Las mejores marcas en un solo lugar', texto: 'Miles de productos disponibles con existencias al día. Consulta el catálogo y regístrate para ver tus precios de distribuidor.', cta: 'Ver catálogo', to: '/productos', visual: 'marcas', fondo: 'linear-gradient(120deg,#0B2A6B 0%,#1D4ED8 55%,#0EA5E9 100%)' },
  { badge: 'FACTURACIÓN',                titulo: 'Factura CFDI de cada compra', texto: 'Genera la factura de tu pedido al momento, 100% digital y sin trámites adicionales. Da seguimiento a tus pedidos desde tu cuenta.', cta: 'Iniciar sesión', to: '/login', visual: 'cfdi', fondo: 'linear-gradient(120deg,#12306E 0%,#4C1D95 55%,#7C3AED 100%)' },
]
const slide = ref(0)
const sliderPausado = ref(false)
function moverSlide(dir: 1 | -1) { slide.value = (slide.value + dir + slides.length) % slides.length }
let sliderTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  sliderTimer = setInterval(() => { if (!sliderPausado.value && document.visibilityState === 'visible') moverSlide(1) }, 6000)
})

// ── Menú de categorías ──
const menuOpen = ref(false)
function cerrarMenu(e: MouseEvent) {
  if (menuOpen.value && !(e.target as HTMLElement).closest('.lp-menu-wrap')) menuOpen.value = false
}
onMounted(() => document.addEventListener('click', cerrarMenu))
onUnmounted(() => {
  document.removeEventListener('click', cerrarMenu)
  clearInterval(sliderTimer)
})

// ── Búsqueda → catálogo público ──
const texto = ref('')
function buscar() {
  const q = texto.value.trim()
  navigateTo(q ? { path: '/productos', query: { q } } : '/productos')
}

// ── Copiar modelo ──
const copiado = ref('')
async function copiar(p: ProductoPublico) {
  try {
    await navigator.clipboard.writeText(p.modelo)
    copiado.value = p.id
    setTimeout(() => { if (copiado.value === p.id) copiado.value = '' }, 1500)
  } catch { /* portapapeles no disponible */ }
}

const bIco = (paths: string) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
const beneficios = [
  { titulo: 'Precios Preferenciales',  icon: bIco('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>') },
  { titulo: 'Factura CFDI',            icon: bIco('<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/>') },
  { titulo: 'Entrega a Domicilio',     icon: bIco('<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>') },
  { titulo: 'Marcas Líderes',          icon: bIco('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>') },
  { titulo: 'Atención Personalizada',  icon: bIco('<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>') },
  { titulo: 'Seguimiento de Pedidos',  icon: bIco('<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>') },
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
  --navy: #133A86;
  --navy-2: #0F2F6E;
  --blue: #3B82F6;
  --blue-d: #2563EB;
  --ink: #0B1B33;
  --muted: #5B6B82;
  --line: #E3EAF5;
  --soft: #F6F9FE;
  min-height: 100vh;
  background: #fff;
  color: var(--ink);
  font-family: 'Noto Sans', 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
}
.lp-wrap { max-width: 1376px; margin: 0 auto; padding: 0 32px; }

/* ── Header ── */
.lp-header { position: sticky; top: 0; z-index: 50; background: var(--navy); box-shadow: 0 2px 12px rgba(10,30,70,0.25); }
.lp-header-row { height: 80px; display: flex; align-items: center; gap: 24px; }
.lp-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; flex-shrink: 0; }
.lp-logo img { height: 48px; width: auto; background: #fff; border-radius: 10px; padding: 4px 8px; }
.lp-logo-text { color: #fff; font-weight: 800; font-size: 20px; letter-spacing: 1px; line-height: 1; display: flex; flex-direction: column; }
.lp-logo-text small { font-size: 9.5px; font-weight: 600; letter-spacing: 3.2px; margin-top: 4px; opacity: 0.85; }
.lp-menu-wrap { position: relative; }
.lp-icon-btn { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; background: transparent; border: none; cursor: pointer; }
.lp-icon-btn:hover { background: rgba(255,255,255,0.1); }
.lp-menu { position: absolute; top: 52px; left: 0; width: 280px; max-height: 70vh; overflow-y: auto; background: #fff; border-radius: 14px; box-shadow: 0 18px 48px rgba(10,30,70,0.25); padding: 10px; display: flex; flex-direction: column; }
.lp-menu-title { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); padding: 8px 12px; }
.lp-menu a { padding: 9px 12px; border-radius: 8px; font-size: 14px; color: var(--ink); text-decoration: none; }
.lp-menu a:hover { background: var(--soft); color: var(--blue-d); }
.lp-menu-sep { height: 1px; background: var(--line); margin: 6px 4px; }
.lp-drop-enter-active, .lp-drop-leave-active { transition: opacity .15s, transform .15s; }
.lp-drop-enter-from, .lp-drop-leave-to { opacity: 0; transform: translateY(-6px); }

.lp-search { box-sizing: border-box; position: relative; flex: 1; max-width: 380px; height: 56px; background: #fff; border-radius: 999px; display: flex; align-items: center; padding: 6px; box-shadow: 0 0 0 3px rgba(255,255,255,0.25); }
.lp-search input { flex: 1; min-width: 0; height: 100%; border: none; outline: none; background: transparent; padding: 0 44px 0 18px; font-size: 14.5px; color: var(--ink); font-family: inherit; }
.lp-search input::placeholder { color: #8A97AB; }
.lp-search-ico { position: absolute; right: 120px; color: #0EA5E9; pointer-events: none; }
.lp-search button { height: 100%; padding: 0 24px; border-radius: 999px; border: none; background: var(--blue); color: #fff; font-size: 14.5px; font-weight: 600; cursor: pointer; font-family: inherit; }
.lp-search button:hover { background: var(--blue-d); }

.lp-header-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.lp-hdr-link { display: inline-flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 10px; color: #fff; font-size: 14.5px; font-weight: 500; text-decoration: none; white-space: nowrap; }
.lp-hdr-link:hover { background: rgba(255,255,255,0.1); }
.lp-hdr-cta { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; background: #fff; color: var(--navy); font-size: 14.5px; font-weight: 700; text-decoration: none; white-space: nowrap; }
.lp-hdr-cta:hover { background: #EAF1FF; }

/* ── Promociones ── */
.lp-promos { padding-top: 28px; }
.lp-promos-title { text-align: center; font-size: clamp(26px, 3vw, 38px); font-weight: 800; letter-spacing: 0.5px; color: #4A8FE7; margin: 0; }
.lp-promos-sub { text-align: center; color: var(--muted); font-size: 16px; margin: 8px 0 24px; }
.lp-slider { position: relative; height: 500px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(30,60,140,0.18); }
.lp-slide { position: absolute; inset: 0; display: grid; grid-template-columns: 1.05fr 1fr; align-items: center; gap: 32px; padding: 48px 96px; color: #fff; }
.lp-slide::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 80% 90%, rgba(56,189,248,0.35), transparent 70%), radial-gradient(ellipse 50% 60% at 10% 0%, rgba(236,72,153,0.18), transparent 70%); pointer-events: none; }
.lp-slide-text { position: relative; z-index: 1; max-width: 520px; }
.lp-slide-badge { display: inline-block; padding: 5px 12px; border-radius: 999px; border: 1px solid rgba(147,197,253,0.6); background: rgba(59,130,246,0.18); color: #93C5FD; font-size: 13px; font-weight: 700; letter-spacing: 1.2px; }
.lp-slide h2 { font-size: clamp(28px, 3.2vw, 38px); font-weight: 800; line-height: 1.15; margin: 14px 0 12px; }
.lp-slide p { font-size: 18px; line-height: 1.6; color: rgba(255,255,255,0.88); margin: 0 0 28px; }
.lp-slide-btn { display: inline-block; padding: 13px 30px; border-radius: 6px; background: var(--blue); color: #fff; font-size: 18px; font-weight: 500; text-decoration: none; box-shadow: 0 6px 18px rgba(0,0,0,0.2); transition: background .2s, transform .2s; }
.lp-slide-btn:hover { background: var(--blue-d); transform: translateY(-1px); }
.lp-slide-visual { position: relative; z-index: 1; display: flex; justify-content: center; }
.lp-slide-prods { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; width: 100%; max-width: 560px; }
.lp-slide-prod { aspect-ratio: 3/4; background: #fff; border-radius: 16px; display: flex; align-items: center; justify-content: center; padding: 14px; box-shadow: 0 16px 40px rgba(0,0,0,0.3); }
.lp-slide-prod:nth-child(2) { transform: translateY(-22px); }
.lp-slide-prod img { width: 100%; height: 100%; object-fit: contain; }
.lp-slide-brands { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; width: 100%; max-width: 520px; }
.lp-slide-brand { height: 86px; background: rgba(255,255,255,0.95); border-radius: 14px; display: flex; align-items: center; justify-content: center; padding: 16px; box-shadow: 0 10px 28px rgba(0,0,0,0.25); }
.lp-slide-brand img { max-width: 100%; max-height: 100%; object-fit: contain; }
.lp-slide-cfdi { display: flex; flex-direction: column; align-items: center; gap: 10px; font-size: 44px; font-weight: 800; letter-spacing: 2px; text-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.lp-fade-enter-active, .lp-fade-leave-active { transition: opacity .6s ease; }
.lp-fade-enter-from, .lp-fade-leave-to { opacity: 0; }
.lp-slider-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 3; width: 32px; height: 32px; border-radius: 50%; border: none; background: #fff; color: var(--ink); display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.lp-slider-arrow.prev { left: 32px; }
.lp-slider-arrow.next { right: 32px; }
.lp-slider-arrow:hover { background: #EAF1FF; }
.lp-slider-dots { position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%); z-index: 3; display: flex; gap: 8px; }
.lp-slider-dots button { width: 8px; height: 8px; border-radius: 8px; border: none; padding: 0; background: rgba(255,255,255,0.45); cursor: pointer; transition: all .25s; }
.lp-slider-dots button.active { width: 26px; background: #fff; }

/* ── Secciones ── */
.lp-section { padding-top: 72px; padding-bottom: 8px; }
.lp-section-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
.lp-h2 { font-size: clamp(26px, 3vw, 38px); font-weight: 800; color: var(--ink); margin: 0 0 28px; letter-spacing: -0.3px; }
.lp-section-head .lp-h2 { margin: 0; }
.lp-h2-underline { position: relative; padding-bottom: 14px; }
.lp-h2-underline::after { content: ''; position: absolute; left: 0; bottom: 0; width: 96px; height: 4px; border-radius: 4px; background: var(--blue); }
.lp-see-all { font-size: 14px; font-weight: 600; color: var(--blue-d); text-decoration: none; padding: 9px 16px; border: 1px solid var(--line); border-radius: 8px; white-space: nowrap; }
.lp-see-all:hover { background: var(--soft); }

/* ── Destacados ── */
.lp-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; }
.lp-card { display: flex; flex-direction: column; border: 2px solid var(--line); border-radius: 14px; background: linear-gradient(180deg,#fff 0%,#F8FBFF 100%); padding: 16px; transition: border-color .2s, box-shadow .2s, transform .2s; }
.lp-card:hover { border-color: #BFD4F6; box-shadow: 0 12px 28px rgba(30,70,150,0.1); transform: translateY(-2px); }
.lp-card-img { position: relative; aspect-ratio: 1; background: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
.lp-card-img img { width: 92%; height: 92%; object-fit: contain; }
.lp-card-stock { position: absolute; left: -4px; bottom: -6px; display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px; background: #fff; font-size: 13.5px; font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.lp-card-stock svg { color: var(--ink); }
.lp-card-stock.ok { color: #16A34A; }
.lp-card-stock.soon { color: #B45309; }
.lp-card-body { flex: 1; display: flex; flex-direction: column; padding-top: 8px; }
.lp-card-brand { font-size: 12.5px; font-weight: 600; text-transform: uppercase; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lp-card-model { display: flex; align-items: center; gap: 8px; margin-top: 4px; font-size: 12.5px; color: var(--blue); font-weight: 500; }
.lp-card-model span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lp-card-model button { flex-shrink: 0; border: none; background: transparent; color: var(--ink); padding: 2px; cursor: pointer; display: flex; }
.lp-card-name { margin: 14px 0 16px; font-size: 14.5px; font-weight: 600; line-height: 1.4; color: var(--ink); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.8em; }
.lp-card-btn { margin-top: auto; height: 36px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--blue); border-radius: 4px; color: var(--blue); font-size: 14.5px; font-weight: 500; text-decoration: none; transition: background .2s, color .2s; }
.lp-card-btn:hover { background: var(--blue); color: #fff; }

/* ── Categorías ── */
.lp-band { margin-top: 72px; background: linear-gradient(180deg,#F6F9FE 0%,#fff 100%); padding-bottom: 32px; }
.lp-band .lp-section { padding-top: 64px; }
.lp-cats { display: grid; grid-template-columns: repeat(7, 1fr); gap: 20px; }
.lp-cat { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 24px 16px 22px; background: #fff; border: 2px solid var(--line); border-radius: 8px; text-decoration: none; color: var(--ink); transition: border-color .2s, box-shadow .2s, transform .2s; }
.lp-cat:hover { border-color: #BFD4F6; box-shadow: 0 12px 28px rgba(30,70,150,0.1); transform: translateY(-2px); }
.lp-cat-img { width: 112px; height: 112px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 110%, var(--glow) 0%, transparent 65%), linear-gradient(160deg, #1A1446 0%, #0B1030 100%); box-shadow: inset 0 -20px 40px -20px var(--glow); }
.lp-cat-img :deep(svg) { filter: drop-shadow(0 0 10px var(--glow)); }
.lp-cat-name { margin-top: 16px; font-size: 16px; font-weight: 600; line-height: 1.45; min-height: 2.9em; display: flex; align-items: center; }
.lp-cat-line { margin-top: 10px; width: 75%; height: 4px; border-radius: 4px; background: linear-gradient(90deg,#DBEAFE,#FEF3C7); }

/* ── Marcas ── */
.lp-brands { overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); padding: 4px 0; }
.lp-brands-track { display: flex; gap: 16px; width: max-content; animation: lp-marquee linear infinite; }
.lp-brands:hover .lp-brands-track { animation-play-state: paused; }
.lp-brand { width: 146px; height: 128px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; padding: 20px; background: #fff; border: 1px solid var(--line); border-radius: 8px; }
.lp-brand img { max-width: 100%; max-height: 60px; object-fit: contain; }
@keyframes lp-marquee { from { transform: translateX(0); } to { transform: translateX(calc(-50% - 8px)); } }
@media (prefers-reduced-motion: reduce) { .lp-brands-track { animation: none; } .lp-brands { overflow-x: auto; } }

/* ── Banda verde de contacto ── */
.lp-cta-section { padding-top: 80px; padding-bottom: 96px; scroll-margin-top: 96px; }
.lp-cta { display: grid; grid-template-columns: 1fr 1fr; border-radius: 10px; overflow: hidden; background: linear-gradient(100deg,#1DB954 0%,#16B981 45%,#34D17A 100%); box-shadow: 0 24px 48px rgba(34,197,94,0.18); color: #fff; }
.lp-cta-left { padding: 32px; }
.lp-cta-left h2 { font-size: clamp(26px, 2.8vw, 36px); font-weight: 800; line-height: 1.15; margin: 0 0 20px; }
.lp-cta-row { display: flex; align-items: center; gap: 20px; }
.lp-cta-bubble { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.lp-cta-row ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 32px; font-size: 16px; }
.lp-cta-row li { display: flex; align-items: center; gap: 10px; }
.lp-cta-row li::before { content: ''; width: 9px; height: 9px; border-radius: 50%; background: #FDE047; flex-shrink: 0; }
.lp-cta-right { padding: 32px; border-left: 1px solid rgba(255,255,255,0.18); display: flex; flex-direction: column; justify-content: center; }
.lp-cta-form { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.lp-cta-form input { height: 46px; border: none; border-radius: 8px; padding: 0 14px; font-size: 14.5px; color: var(--ink); background: #fff; outline: none; font-family: inherit; }
.lp-cta-form input:focus { box-shadow: 0 0 0 3px rgba(255,255,255,0.5); }
.lp-cta-form button { grid-column: 1 / -1; height: 48px; border: none; border-radius: 8px; background: #157A3A; color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; font-family: inherit; }
.lp-cta-form button:hover:not(:disabled) { background: #0F6630; }
.lp-cta-form button:disabled { opacity: .75; cursor: not-allowed; }
.lp-cta-note, .lp-cta-error { grid-column: 1 / -1; margin: 2px 0 0; font-size: 13.5px; line-height: 1.5; color: rgba(255,255,255,0.92); }
.lp-cta-error { color: #fff; background: rgba(185,28,28,0.55); padding: 8px 12px; border-radius: 8px; }
.lp-cta-done { display: flex; gap: 16px; align-items: flex-start; }
.lp-cta-done strong { font-size: 20px; }
.lp-cta-done p { margin: 6px 0 14px; font-size: 15px; }
.lp-cta-done button { padding: 9px 18px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.7); background: transparent; color: #fff; font-weight: 600; cursor: pointer; font-family: inherit; }

/* ── Footer ── */
.lp-footer { background: var(--navy); color: #fff; padding-top: 56px; }
.lp-footer-grid { display: grid; grid-template-columns: 1.15fr 0.85fr 1.3fr; gap: 48px; padding-bottom: 32px; }
.lp-footer h3 { font-size: 19px; font-weight: 700; margin: 0 0 18px; }
.lp-footer-desc { font-size: 14.5px; line-height: 1.9; color: rgba(255,255,255,0.85); margin: 0 0 18px; }
.lp-footer-contact { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; font-size: 14.5px; color: rgba(255,255,255,0.9); }
.lp-footer-contact li { display: flex; gap: 10px; align-items: flex-start; line-height: 1.45; }
.lp-footer-contact svg { flex-shrink: 0; margin-top: 2px; opacity: 0.85; }
.lp-footer-contact a { color: inherit; text-decoration: none; }
.lp-footer-contact a:hover { text-decoration: underline; }
.lp-footer-links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.lp-footer-links li { display: flex; align-items: center; gap: 10px; font-size: 14.5px; }
.lp-footer-links li::before { content: ''; width: 12px; height: 7px; border-left: 2px solid #4ADE80; border-bottom: 2px solid #4ADE80; transform: rotate(-45deg) translateY(-2px); flex-shrink: 0; }
.lp-footer-links a { color: rgba(255,255,255,0.9); text-decoration: none; }
.lp-footer-links a:hover { color: #fff; text-decoration: underline; }
.lp-benefits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.lp-benefit { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center; min-height: 118px; padding: 16px 10px; border-radius: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.14); font-size: 13.5px; font-weight: 600; line-height: 1.5; }
.lp-footer-bottom { border-top: 1px solid rgba(255,255,255,0.18); padding-top: 32px; padding-bottom: 40px; text-align: center; font-size: 14.5px; color: rgba(255,255,255,0.72); }

/* ── Responsive ── */
@media (max-width: 1280px) {
  .lp-grid { grid-template-columns: repeat(4, 1fr); }
  .lp-cats { grid-template-columns: repeat(5, 1fr); }
  .lp-hide-md { display: none; }
}
@media (max-width: 1024px) {
  .lp-wrap { padding-left: 20px; padding-right: 20px; }
  .lp-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .lp-cats { grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .lp-slide { grid-template-columns: 1fr; padding: 40px 56px; }
  .lp-slide-visual { display: none; }
  .lp-cta { grid-template-columns: 1fr; }
  .lp-cta-right { border-left: none; border-top: 1px solid rgba(255,255,255,0.18); }
  .lp-footer-grid { grid-template-columns: 1fr 1fr; }
  .lp-footer-grid > :last-child { grid-column: 1 / -1; }
}
@media (max-width: 760px) {
  .lp-header-row { flex-wrap: wrap; height: auto; padding-top: 12px; padding-bottom: 12px; gap: 10px 12px; }
  .lp-logo img { height: 38px; }
  .lp-logo-text { display: none; }
  .lp-search { order: 3; flex: none; width: 100%; max-width: none; height: 48px; }
  .lp-search-ico { right: 108px; }
  .lp-hdr-link, .lp-hdr-cta { padding: 8px 12px; font-size: 13.5px; }
  .lp-slider { height: 460px; }
  .lp-slide { padding: 32px 28px 48px; }
  .lp-slide p { font-size: 16px; }
  .lp-slider-arrow { display: none; }
  .lp-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .lp-card { padding: 12px; }
  .lp-cats { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .lp-cat-img { width: 88px; height: 88px; }
  .lp-cat-name { font-size: 14.5px; }
  .lp-section-head { flex-wrap: wrap; }
  .lp-cta-left, .lp-cta-right { padding: 24px 20px; }
  .lp-cta-row { align-items: flex-start; }
  .lp-cta-row ul, .lp-cta-form { grid-template-columns: 1fr; }
  .lp-footer-grid { grid-template-columns: 1fr; gap: 32px; }
  .lp-benefits { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 420px) {
  .lp-hdr-link { display: none; }
  .lp-card-name { font-size: 13.5px; }
}
</style>
