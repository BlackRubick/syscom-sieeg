<template>
  <div class="sn">
    <!-- ── Barra superior ── -->
    <div class="sn-topbar">
      <div class="sn-wrap sn-topbar-row">
        <span class="sn-topbar-item sn-hide-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          Tuxtla Gutiérrez, Chiapas
        </span>
        <span class="sn-topbar-item sn-hide-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Lun – Vie 07:00 – 20:00 · Sáb 07:00 – 17:00
        </span>
        <a href="tel:9611180157" class="sn-topbar-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          961 118 0157
        </a>
        <a href="mailto:contacto@sieeg.com.mx" class="sn-topbar-item sn-hide-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
          contacto@sieeg.com.mx
        </a>
      </div>
    </div>

    <!-- ── Header ── -->
    <header class="sn-header">
      <div class="sn-wrap sn-header-row">
        <NuxtLink :to="app ? inicioApp : '/'" class="sn-logo" aria-label="SIEEG Integradores — inicio">
          <img src="/logosieeg.jpg" alt="SIEEG" />
        </NuxtLink>

        <form class="sn-search" role="search" @submit.prevent="buscar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input v-model="texto" type="search" :placeholder="app ? 'Buscar en el catálogo: producto, marca o modelo…' : '¿Qué necesitas? Cámaras, switches, cable…'" aria-label="Buscar productos" maxlength="80" />
          <button type="submit">Buscar</button>
        </form>

        <!-- Acciones: visitante -->
        <nav v-if="!app" class="sn-actions">
          <NuxtLink to="/productos" class="sn-link sn-hide-md">Catálogo</NuxtLink>
          <NuxtLink to="/#contacto" class="sn-link sn-hide-md" @click="irAContacto">Quiero ser cliente</NuxtLink>
          <NuxtLink to="/login" class="sn-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Iniciar sesión
          </NuxtLink>
        </nav>

        <!-- Acciones: sesión iniciada -->
        <div v-else class="sn-actions">
          <NuxtLink to="/cart" class="sn-icon-btn" aria-label="Carrito">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span v-if="cart.count > 0" class="sn-badge">{{ cart.count }}</span>
          </NuxtLink>

          <div class="sn-drop-wrap">
            <button type="button" class="sn-icon-btn" :class="{ open: notifOpen }" aria-label="Notificaciones" @click="notifOpen = !notifOpen; userOpen = false">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span v-if="ui.unreadCount > 0" class="sn-badge">{{ ui.unreadCount }}</span>
            </button>
            <Transition name="dropdown">
              <div v-if="notifOpen" class="sn-drop sn-drop-notif">
                <div class="sn-drop-head">
                  <span>Notificaciones</span>
                  <button v-if="ui.unreadCount > 0" type="button" @click="ui.markAllRead()">Marcar leídas</button>
                </div>
                <div class="sn-notif-list">
                  <div v-if="!ui.notifications.length" class="sn-notif-empty">No tienes notificaciones</div>
                  <button v-for="n in ui.notifications" :key="n.id" type="button" :class="['sn-notif', { unread: !n.read }]" @click="ui.markRead(n.id)">
                    <span class="sn-notif-ico" :style="{ color: notifColor(n.type), background: `${notifColor(n.type)}18` }">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="notifIcon(n.type)" />
                    </span>
                    <span class="sn-notif-text">
                      <strong>{{ n.title }}</strong>
                      <span>{{ n.message }}</span>
                    </span>
                    <i v-if="!n.read" />
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <div class="sn-drop-wrap">
            <button type="button" class="sn-user" :class="{ open: userOpen }" @click="userOpen = !userOpen; notifOpen = false">
              <span class="sn-avatar">{{ initials }}</span>
              <span class="sn-user-text sn-hide-md">
                <strong>{{ firstName }}</strong>
                <span>{{ roleLabel }}</span>
              </span>
              <svg class="sn-hide-md" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <Transition name="dropdown">
              <div v-if="userOpen" class="sn-drop sn-drop-user">
                <div class="sn-drop-head sn-drop-head-col">
                  <strong>{{ auth.user?.name }}</strong>
                  <span>{{ auth.user?.email }}</span>
                </div>
                <NuxtLink v-if="auth.user?.role !== 'admin'" to="/perfil" class="sn-drop-item" @click="userOpen = false">Mi perfil</NuxtLink>
                <button type="button" class="sn-drop-item danger" @click="salir">Cerrar sesión</button>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- ── Fila de navegación ── -->
      <div class="sn-nav">
        <div class="sn-wrap sn-nav-row">
          <template v-if="!app">
            <NuxtLink to="/productos" class="sn-nav-main">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
              Todas las categorías
            </NuxtLink>
            <NuxtLink v-for="c in CATEGORIAS" :key="c.id" :to="`/productos?categoria=${c.id}`" :class="{ active: categoriaActiva === c.id }">{{ c.nombre }}</NuxtLink>
          </template>
          <template v-else>
            <NuxtLink v-for="item in navItems" :key="item.href" :to="item.href" :class="{ active: activo(item.href) }">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="item.svg" />
              {{ item.label }}
              <span v-if="item.cart && cart.count > 0" class="sn-nav-badge">{{ cart.count }}</span>
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <div v-if="notifOpen || userOpen" class="sn-overlay" @click="notifOpen = false; userOpen = false" />
  </div>
</template>

<script setup lang="ts">
/* Navbar único del sitio (misma estructura que la landing).
   Visitante: categorías + acceso.  Sesión iniciada (app): secciones del panel + carrito, avisos y usuario. */
const props = withDefaults(defineProps<{ app?: boolean }>(), { app: false })

const route  = useRoute()
const router = useRouter()
const auth   = useAuthStore()
const ui     = useUIStore()
const cart   = useCartStore()

const CATEGORIAS = [
  { id: '22', nombre: 'Videovigilancia' },
  { id: '26', nombre: 'Redes e IT' },
  { id: '37', nombre: 'Control de Acceso' },
  { id: '30', nombre: 'Energía y Climatización' },
  { id: '65811', nombre: 'Cableado Estructurado' },
  { id: '32', nombre: 'Automatización e Intrusión' },
  { id: '38', nombre: 'Detección de Fuego' },
  { id: '25', nombre: 'Radiocomunicación' },
]

const ALL_NAV = [
  { href: '/dashboard', label: 'Dashboard',      roles: ['admin', 'approver', 'viewer'], svg: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>' },
  { href: '/catalog',   label: 'Catálogo',       roles: null, svg: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/>' },
  { href: '/cart',      label: 'Carrito',        roles: null, cart: true, svg: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>' },
  { href: '/orders',    label: 'Órdenes',        roles: null, svg: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>' },
  { href: '/users',     label: 'Usuarios',       roles: ['admin'], svg: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { href: '/admin',     label: 'Precios',        roles: ['admin'], svg: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>' },
  { href: '/fiscal',    label: 'Datos Fiscales', roles: ['admin'], svg: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 10h8"/><path d="M8 14h5"/><path d="M8 6h8"/>' },
  { href: '/facturas',  label: 'Facturación',    roles: ['admin'], svg: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M12 16H8"/>' },
  { href: '/perfil',    label: 'Mi Perfil',      roles: ['buyer', 'approver', 'viewer'], svg: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>' },
]
const navItems = computed(() => {
  const role = auth.user?.role ?? ''
  return ALL_NAV.filter(i => !i.roles || i.roles.includes(role))
})
// En /productos sin filtro se muestra Videovigilancia (22); con búsqueda no hay categoría activa
const categoriaActiva = computed(() => {
  if (route.path !== '/productos' || route.query.q) return ''
  return typeof route.query.categoria === 'string' ? route.query.categoria : '22'
})
const inicioApp = computed(() => navItems.value[0]?.href ?? '/catalog')
const activo = (href: string) => href === '/dashboard' ? route.path === href : route.path.startsWith(href)

// ── Búsqueda: visitante → catálogo público, sesión → catálogo interno ──
const texto = ref(typeof route.query.q === 'string' ? route.query.q : '')
watch(() => route.query.q, q => { texto.value = typeof q === 'string' ? q : '' })
function buscar() {
  const q = texto.value.trim()
  const path = props.app ? '/catalog' : '/productos'
  router.push(q ? { path, query: { q } } : path)
}

function irAContacto(e: MouseEvent) {
  if (route.path !== '/') return
  e.preventDefault()
  document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ── Usuario y notificaciones ──
const notifOpen = ref(false)
const userOpen  = ref(false)
watch(() => route.fullPath, () => { notifOpen.value = false; userOpen.value = false })

const roleLabels: Record<string, string> = { admin: 'Administrador', buyer: 'Comprador', approver: 'Aprobador', viewer: 'Visor' }
const initials  = computed(() => auth.user?.name.split(' ').slice(0, 2).map(n => n[0]).join('') ?? '..')
const firstName = computed(() => auth.user?.name.split(' ').slice(0, 2).join(' ') ?? '...')
const roleLabel = computed(() => auth.user ? (roleLabels[auth.user.role] ?? auth.user.role) : '...')

const notifColors: Record<string, string> = { order: '#0B5BD3', approval: '#16A34A', delivery: '#1570EF', system: '#5B6B82', alert: '#D97706' }
function notifColor(type: string) { return notifColors[type] ?? '#5B6B82' }
function notifIcon(type: string): string {
  if (type === 'order')    return '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>'
  if (type === 'approval') return '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
  if (type === 'delivery') return '<rect width="16" height="13" x="1" y="5" rx="1"/><path d="M1 10h16"/><path d="M17 5h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/>'
  if (type === 'alert')    return '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>'
  return '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>'
}

async function salir() {
  userOpen.value = false
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.sn {
  --brand: #1570EF; --brand-d: #0B5BD3; --brand-soft: #EAF2FF;
  --ink: #0B1B33; --ink-2: #13294B; --muted: #5B6B82; --line: #E4E9F1; --bg-soft: #F5F8FC;
  --gutter: 32px;
  display: contents;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
}
.sn *, .sn *::before, .sn *::after { box-sizing: border-box; }
.sn-wrap { width: 100%; max-width: calc(1280px + 2 * var(--gutter)); margin: 0 auto; padding-left: var(--gutter); padding-right: var(--gutter); }

/* Barra superior */
.sn-topbar { background: var(--ink); color: rgba(255,255,255,0.78); font-size: 13px; font-family: 'Inter', system-ui, sans-serif; }
.sn-topbar-row { height: 38px; display: flex; align-items: center; gap: 24px; justify-content: flex-end; }
.sn-topbar-item { display: inline-flex; align-items: center; gap: 7px; color: inherit; text-decoration: none; white-space: nowrap; }
.sn-topbar-item:first-child { margin-right: auto; }
a.sn-topbar-item:hover { color: #fff; }

/* Header */
.sn-header { position: sticky; top: 0; z-index: 60; background: rgba(255,255,255,0.97); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); font-family: 'Inter', system-ui, sans-serif; color: var(--ink); }
.sn-header-row { height: 76px; display: flex; align-items: center; gap: 28px; }
.sn-logo { flex-shrink: 0; display: flex; }
.sn-logo img { height: 50px; width: auto; }
.sn-search { flex: 1; min-width: 0; max-width: 560px; height: 48px; display: flex; align-items: center; gap: 10px; padding: 0 5px 0 16px; border-radius: 12px; background: var(--bg-soft); border: 1px solid var(--line); color: #8A97AB; transition: border-color .2s, box-shadow .2s, background .2s; }
.sn-search svg { flex-shrink: 0; }
.sn-search:focus-within { background: #fff; border-color: var(--brand); box-shadow: 0 0 0 4px rgba(21,112,239,0.12); }
.sn-search input { flex: 1; min-width: 0; height: 100%; border: none; outline: none; background: transparent; font-size: 15px; color: var(--ink); font-family: inherit; text-overflow: ellipsis; }
.sn-search button { flex-shrink: 0; height: 38px; padding: 0 18px; border: none; border-radius: 9px; background: var(--ink); color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; }
.sn-search button:hover { background: var(--ink-2); }

.sn-actions { margin-left: auto; display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.sn-link { padding: 9px 12px; border-radius: 9px; color: var(--ink); font-size: 14.5px; font-weight: 500; text-decoration: none; white-space: nowrap; }
.sn-link:hover { background: var(--bg-soft); color: var(--brand-d); }
.sn-btn { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px; border-radius: 10px; background: var(--brand); color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; white-space: nowrap; box-shadow: 0 6px 18px rgba(21,112,239,0.28); transition: background .2s, transform .2s; }
.sn-btn:hover { background: var(--brand-d); transform: translateY(-1px); }

.sn-icon-btn { position: relative; width: 42px; height: 42px; border-radius: 11px; display: flex; align-items: center; justify-content: center; color: var(--ink-2); background: transparent; border: 1px solid transparent; cursor: pointer; text-decoration: none; }
.sn-icon-btn:hover, .sn-icon-btn.open { background: var(--bg-soft); border-color: var(--line); }
.sn-badge { position: absolute; top: 4px; right: 3px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: var(--brand); color: #fff; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }
.sn-user { display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 10px 0 5px; border-radius: 12px; background: transparent; border: 1px solid transparent; cursor: pointer; color: var(--muted); font-family: inherit; }
.sn-user:hover, .sn-user.open { background: var(--bg-soft); border-color: var(--line); }
.sn-avatar { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, var(--brand), var(--brand-d)); color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sn-user-text { display: flex; flex-direction: column; text-align: left; line-height: 1.2; }
.sn-user-text strong { font-size: 13.5px; color: var(--ink); }
.sn-user-text span { font-size: 11.5px; color: var(--muted); }

.sn-drop-wrap { position: relative; }
.sn-drop { position: absolute; right: 0; top: 52px; z-index: 70; background: #fff; border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 18px 48px rgba(11,27,51,0.16); overflow: hidden; }
.sn-drop-notif { width: 320px; max-width: calc(100vw - 24px); }
.sn-drop-user { width: 230px; }
.sn-drop-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--line); font-size: 13.5px; font-weight: 600; color: var(--ink); }
.sn-drop-head button { border: none; background: none; color: var(--brand-d); font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
.sn-drop-head-col { flex-direction: column; align-items: flex-start; gap: 2px; }
.sn-drop-head-col span { font-size: 12px; font-weight: 400; color: var(--muted); overflow-wrap: anywhere; }
.sn-drop-item { display: block; width: 100%; padding: 11px 14px; border: none; background: none; text-align: left; font-size: 13.5px; color: var(--ink); text-decoration: none; cursor: pointer; font-family: inherit; }
.sn-drop-item:hover { background: var(--bg-soft); }
.sn-drop-item.danger { color: #DC2626; border-top: 1px solid var(--line); }
.sn-drop-item.danger:hover { background: #FEF2F2; }
.sn-notif-list { max-height: 320px; overflow-y: auto; }
.sn-notif-empty { padding: 22px 14px; text-align: center; font-size: 13px; color: var(--muted); }
.sn-notif { width: 100%; display: flex; gap: 10px; align-items: flex-start; padding: 11px 14px; border: none; border-bottom: 1px solid var(--line); background: #fff; text-align: left; cursor: pointer; font-family: inherit; }
.sn-notif.unread { background: #F5F9FF; }
.sn-notif:hover { background: var(--bg-soft); }
.sn-notif-ico { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sn-notif-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.sn-notif-text strong { font-size: 12.5px; color: var(--ink); }
.sn-notif-text span { font-size: 12px; color: var(--muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.sn-notif i { width: 7px; height: 7px; border-radius: 50%; background: var(--brand); flex-shrink: 0; margin-top: 5px; }
.sn-overlay { position: fixed; inset: 0; z-index: 55; }

/* Fila de navegación */
.sn-nav { border-top: 1px solid var(--line); }
.sn-nav-row { height: 48px; display: flex; align-items: center; gap: 4px; overflow-x: auto; scrollbar-width: none; }
.sn-nav-row::-webkit-scrollbar { display: none; }
.sn-nav-row a { flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border-radius: 8px; font-size: 13.5px; font-weight: 500; color: var(--muted); text-decoration: none; white-space: nowrap; transition: background .15s, color .15s; }
.sn-nav-row a:hover { color: var(--brand-d); background: var(--brand-soft); }
.sn-nav-row a.active { color: var(--brand-d); background: var(--brand-soft); font-weight: 600; }
.sn-nav-row .sn-nav-main { color: var(--brand-d); font-weight: 600; background: var(--brand-soft); margin-right: 8px; }
.sn-nav-badge { min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: var(--brand); color: #fff; font-size: 10px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }

/* Responsive */
@media (min-width: 1680px) {
  .sn { --gutter: 48px; }
  .sn-wrap { max-width: calc(1520px + 2 * var(--gutter)); }
}
@media (max-width: 1180px) { .sn-hide-md { display: none !important; } }
@media (max-width: 900px) {
  .sn { --gutter: 20px; }
  .sn-hide-sm { display: none; }
  .sn-topbar-row { justify-content: center; }
  .sn-topbar-item:first-child { margin-right: 0; }
  .sn-header-row { gap: 16px; }
}
@media (max-width: 640px) {
  .sn { --gutter: 16px; }
  .sn-hide-xs { display: none; }
  .sn-header-row { flex-wrap: wrap; height: auto; padding-top: 10px; padding-bottom: 12px; gap: 10px; }
  .sn-logo img { height: 40px; }
  .sn-search { order: 3; flex: none; width: 100%; max-width: none; height: 46px; }
  .sn-search button { padding: 0 14px; }
  .sn-nav-row { height: 44px; }
  .sn-actions { gap: 2px; }
}
@media (max-width: 380px) {
  .sn-btn { padding: 0 12px; font-size: 13px; }
  .sn-logo img { height: 36px; }
  .sn-search input { font-size: 14px; }
}
</style>
