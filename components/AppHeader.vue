<template>
  <header style="height:60px;display:flex;align-items:center;padding:0 24px;border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(8,16,32,0.9);backdrop-filter:blur(12px);flex-shrink:0;gap:16px;position:sticky;top:0;z-index:10;font-family:'Inter',system-ui,sans-serif;">

    <!-- Buscador -->
    <div style="flex:1;max-width:400px;position:relative;">
      <svg style="position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;" :width="14" :height="14" viewBox="0 0 24 24" fill="none" :stroke="searchFocus?'#0EA5E9':'rgba(100,116,139,0.7)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input v-model="search" placeholder="Buscar productos, órdenes..."
        @focus="searchFocus=true" @blur="searchFocus=false"
        :style="{ width:'100%', height:'36px', background:searchFocus?'rgba(14,165,233,0.06)':'rgba(255,255,255,0.04)', border:`1px solid ${searchFocus?'rgba(14,165,233,0.4)':'rgba(255,255,255,0.08)'}`, borderRadius:'10px', paddingLeft:'36px', paddingRight:'12px', fontSize:'13px', color:'#E2E8F0', outline:'none', transition:'all 0.2s', fontFamily:'inherit', boxSizing:'border-box' }" />
    </div>

    <div style="margin-left:auto;display:flex;align-items:center;gap:4px;">

      <!-- Notificaciones -->
      <div style="position:relative;">
        <button @click="notifOpen=!notifOpen; userOpen=false"
          :style="{ width:'36px', height:'36px', borderRadius:'10px', background:notifOpen?'rgba(255,255,255,0.08)':'transparent', border:'1px solid transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative' }"
          @mouseenter="e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.06)'"
          @mouseleave="e => { if(!notifOpen)(e.currentTarget as HTMLElement).style.background='transparent' }">
          <!-- Bell icon -->
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.9)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <div v-if="ui.unreadCount > 0" style="position:absolute;top:5px;right:5px;width:16px;height:16px;border-radius:50%;background:#0EA5E9;font-size:9px;font-weight:700;color:white;display:flex;align-items:center;justify-content:center;">
            {{ ui.unreadCount }}
          </div>
        </button>

        <Transition name="dropdown">
          <div v-if="notifOpen" style="position:absolute;right:0;top:44px;width:300px;background:#0D1B35;border:1px solid rgba(255,255,255,0.1);border-radius:14px;box-shadow:0 16px 48px rgba(0,0,0,0.6);overflow:hidden;z-index:50;">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,0.07);">
              <span style="font-size:13px;font-weight:600;color:#E2E8F0;">Notificaciones</span>
              <button v-if="ui.unreadCount > 0" @click="ui.markAllRead()" style="font-size:11px;color:#38bdf8;background:none;border:none;cursor:pointer;font-weight:500;">Marcar leídas</button>
            </div>
            <div style="max-height:280px;overflow-y:auto;">
              <div v-for="n in ui.notifications" :key="n.id" @click="ui.markRead(n.id)"
                :style="{ display:'flex', gap:'10px', padding:'11px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer', background:!n.read?'rgba(14,165,233,0.04)':'transparent' }"
                @mouseenter="e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.03)'"
                @mouseleave="e => (e.currentTarget as HTMLElement).style.background=!n.read?'rgba(14,165,233,0.04)':'transparent'">
                <div :style="{ width:'30px', height:'30px', borderRadius:'8px', background:`${notifColor(n.type)}18`, border:`1px solid ${notifColor(n.type)}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:notifColor(n.type) }">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="notifColor(n.type)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="notifIcon(n.type)" />
                </div>
                <div style="flex:1;min-width:0;">
                  <div style="font-size:12px;font-weight:600;color:#CBD5E1;">{{ n.title }}</div>
                  <div style="font-size:11px;color:rgba(100,116,139,0.8);margin-top:2px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">{{ n.message }}</div>
                </div>
                <div v-if="!n.read" style="width:6px;height:6px;border-radius:50%;background:#0EA5E9;flex-shrink:0;margin-top:4px;" />
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div style="width:1px;height:20px;background:rgba(255,255,255,0.07);margin:0 6px;" />

      <!-- Usuario -->
      <div style="position:relative;">
        <button @click="userOpen=!userOpen; notifOpen=false"
          :style="{ display:'flex', alignItems:'center', gap:'8px', height:'36px', padding:'0 10px 0 6px', borderRadius:'10px', background:userOpen?'rgba(255,255,255,0.08)':'transparent', border:'1px solid transparent', cursor:'pointer' }"
          @mouseenter="e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.05)'"
          @mouseleave="e => { if(!userOpen)(e.currentTarget as HTMLElement).style.background='transparent' }">
          <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#0EA5E9,#22D3EE);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;flex-shrink:0;">
            {{ initials }}
          </div>
          <div style="text-align:left;">
            <div style="font-size:12px;font-weight:600;color:#E2E8F0;line-height:1;">{{ firstName }}</div>
            <div style="font-size:10px;color:rgba(100,116,139,0.8);margin-top:2px;">{{ roleLabel }}</div>
          </div>
          <!-- ChevronDown -->
          <svg :width="12" :height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(100,116,139,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ transition:'transform 0.2s', transform:userOpen?'rotate(180deg)':'rotate(0deg)', marginLeft:'2px' }">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <Transition name="dropdown">
          <div v-if="userOpen" style="position:absolute;right:0;top:44px;width:200px;background:#0D1B35;border:1px solid rgba(255,255,255,0.1);border-radius:14px;box-shadow:0 16px 48px rgba(0,0,0,0.6);overflow:hidden;z-index:50;">
            <div style="padding:12px 14px;border-bottom:1px solid rgba(255,255,255,0.07);">
              <div style="font-size:12px;font-weight:600;color:#E2E8F0;">{{ auth.user?.name }}</div>
              <div style="font-size:11px;color:rgba(100,116,139,0.8);margin-top:2px;">{{ auth.user?.email }}</div>
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.07);">
              <button @click="handleLogout"
                style="width:100%;display:flex;align-items:center;gap:8px;padding:10px 14px;font-size:12px;color:#fb7185;background:none;border:none;cursor:pointer;text-align:left;font-family:inherit;"
                @mouseenter="e => (e.currentTarget as HTMLElement).style.background='rgba(244,63,94,0.06)'"
                @mouseleave="e => (e.currentTarget as HTMLElement).style.background='transparent'">
                <!-- LogOut icon -->
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <div v-if="notifOpen || userOpen" style="position:fixed;inset:0;z-index:40;" @click="notifOpen=false; userOpen=false" />
  </header>
</template>

<script setup lang="ts">
const auth   = useAuthStore()
const ui     = useUIStore()
const router = useRouter()

const search      = ref('')
const searchFocus = ref(false)
const notifOpen   = ref(false)
const userOpen    = ref(false)

const roleLabels: Record<string, string> = { admin:'Administrador', buyer:'Comprador', approver:'Aprobador', viewer:'Visor' }

const initials  = computed(() => auth.user?.name.split(' ').slice(0,2).map(n=>n[0]).join('') ?? '..')
const firstName = computed(() => auth.user?.name.split(' ').slice(0,2).join(' ') ?? '...')
const roleLabel = computed(() => auth.user ? (roleLabels[auth.user.role] ?? auth.user.role) : '...')

const notifColors: Record<string, string> = { order:'#38bdf8', approval:'#34d399', delivery:'#0EA5E9', system:'#94a3b8', alert:'#f59e0b' }
function notifColor(type: string) { return notifColors[type] ?? '#94a3b8' }
function notifIcon(type: string): string {
  if (type === 'order')    return '<path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>'
  if (type === 'approval') return '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
  if (type === 'delivery') return '<rect width="16" height="13" x="1" y="5" rx="1"/><path d="M1 10h16"/><path d="M17 5h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/>'
  if (type === 'alert')    return '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>'
  return '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>'
}

async function handleLogout() {
  userOpen.value = false
  await auth.logout()
  router.push('/login')
}
</script>
