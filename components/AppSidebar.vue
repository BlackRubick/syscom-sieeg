<template>
  <aside :style="sidebarStyle" class="no-scrollbar">

    <!-- Logo -->
    <div style="height:60px;display:flex;align-items:center;padding:0 16px;border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0;gap:10px;overflow:hidden;">
      <div style="width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#0EA5E9,#22D3EE);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 14px rgba(14,165,233,0.35);">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
      <div v-if="!collapsed" style="overflow:hidden;white-space:nowrap;transition:opacity 0.2s;" >
        <div style="font-size:13px;font-weight:800;color:#F1F5F9;line-height:1;letter-spacing:-0.3px;">SIEEG</div>
        <div style="font-size:9px;color:rgba(100,116,139,0.7);font-weight:500;letter-spacing:0.8px;margin-top:2px;">SYSCOM</div>
      </div>
    </div>

    <!-- Nav -->
    <nav style="flex:1;padding:8px 6px;overflow-y:auto;overflow-x:hidden;" class="no-scrollbar">
      <div v-if="!collapsed" style="font-size:9px;font-weight:600;color:rgba(71,85,105,0.8);text-transform:uppercase;letter-spacing:1.2px;padding:4px 10px 8px;user-select:none;">
        Navegación
      </div>

      <NuxtLink v-for="item in navItems" :key="item.href" :to="item.href" style="text-decoration:none;display:block;margin-bottom:1px;">
        <div :style="linkStyle(item.href)" :title="collapsed ? item.label : undefined"
          @mouseenter="e => onHover(e, item.href, true)"
          @mouseleave="e => onHover(e, item.href, false)">

          <!-- Indicador activo -->
          <div v-if="isActive(item.href)" style="position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:18px;border-radius:0 3px 3px 0;background:#0EA5E9;box-shadow:0 0 8px rgba(14,165,233,0.7);" />

          <!-- Icono SVG inline -->
          <svg :width="15" :height="15" viewBox="0 0 24 24" fill="none"
            :stroke="isActive(item.href) ? '#38bdf8' : 'rgba(100,116,139,0.75)'"
            :stroke-width="isActive(item.href) ? 2.2 : 1.8"
            stroke-linecap="round" stroke-linejoin="round"
            style="flex-shrink:0;" v-html="item.svg" />

          <!-- Label -->
          <span v-if="!collapsed" :style="{ fontSize:'12.5px', fontWeight:isActive(item.href)?600:500, color:isActive(item.href)?'#E2E8F0':'rgba(100,116,139,0.8)', whiteSpace:'nowrap', flex:1, overflow:'hidden', textOverflow:'ellipsis', transition:'opacity 0.15s' }">
            {{ item.label }}
          </span>

          <!-- Badge carrito -->
          <div v-if="item.cart && cartCount > 0" :style="badgeStyle">
            {{ cartCount }}
          </div>
        </div>
      </NuxtLink>
    </nav>

    <!-- Botón colapsar -->
    <button @click="ui.toggleSidebar()"
      style="position:absolute;right:-11px;top:72px;width:22px;height:22px;border-radius:50%;background:#0D1B35;border:1px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:30;box-shadow:0 2px 8px rgba(0,0,0,0.4);padding:0;">
      <!-- ChevronLeft / ChevronRight -->
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.8)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path v-if="!collapsed" d="m15 18-6-6 6-6"/>
        <path v-else            d="m9 18 6-6-6-6"/>
      </svg>
    </button>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()
const ui    = useUIStore()
const cart  = useCartStore()
const auth  = useAuthStore()

const collapsed  = computed(() => ui.sidebarCollapsed)
const cartCount  = computed(() => cart.count)

const ALL_NAV = [
  {
    href: '/dashboard', label: 'Dashboard', roles: ['admin', 'approver', 'viewer'],
    svg: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  },
  {
    href: '/catalog', label: 'Catálogo', roles: null,
    svg: '<path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/>',
  },
  {
    href: '/cart', label: 'Carrito', cart: true, roles: null,
    svg: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  },
  {
    href: '/orders', label: 'Órdenes', roles: null,
    svg: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  },
  {
    href: '/users', label: 'Usuarios', roles: ['admin'],
    svg: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  },
  {
    href: '/fiscal', label: 'Datos Fiscales', roles: ['admin'],
    svg: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 10h8"/><path d="M8 14h5"/><path d="M8 6h8"/>',
  },
  {
    href: '/facturas', label: 'Facturación', roles: ['admin'],
    svg: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M12 16H8"/>',
  },
  {
    href: '/perfil', label: 'Mi Perfil', roles: ['buyer', 'approver', 'viewer'],
    svg: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>',
  },
]

const navItems = computed(() => {
  const role = auth.user?.role ?? ''
  return ALL_NAV.filter(item => !item.roles || item.roles.includes(role))
})

const sidebarStyle = computed(() => ({
  width: collapsed.value ? '64px' : '220px',
  transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)',
  flexShrink: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(6,12,26,0.98)',
  borderRight: '1px solid rgba(255,255,255,0.07)',
  position: 'relative',
  zIndex: 20,
  overflow: 'visible',
}))

function isActive(href: string) {
  return href === '/dashboard' ? route.path === href : route.path.startsWith(href)
}

function linkStyle(href: string) {
  const active = isActive(href)
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    height: '36px',
    padding: collapsed.value ? '0' : '0 10px',
    justifyContent: collapsed.value ? 'center' : 'flex-start',
    borderRadius: '9px',
    position: 'relative',
    cursor: 'pointer',
    background: active ? 'rgba(14,165,233,0.10)' : 'transparent',
    border: `1px solid ${active ? 'rgba(14,165,233,0.18)' : 'transparent'}`,
    transition: 'background 0.15s, border-color 0.15s',
    overflow: 'hidden',
  }
}

function onHover(e: MouseEvent, href: string, entering: boolean) {
  if (!isActive(href)) {
    (e.currentTarget as HTMLElement).style.background = entering ? 'rgba(255,255,255,0.04)' : 'transparent'
  }
}

const badgeStyle = computed(() => ({
  position: collapsed.value ? 'absolute' : 'static',
  top:   collapsed.value ? '3px'  : undefined,
  right: collapsed.value ? '3px'  : undefined,
  minWidth: '17px', height: '17px', borderRadius: '9px',
  background: '#0EA5E9', display: 'flex', alignItems: 'center',
  justifyContent: 'center', fontSize: '9px', fontWeight: 700,
  color: 'white', padding: '0 4px', flexShrink: 0,
}))
</script>
