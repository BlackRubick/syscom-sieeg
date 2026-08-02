<template>
  <div :style="{ fontFamily:`'Inter',system-ui,sans-serif` }">

    <!-- Header -->
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
      <div>
        <h1 style="font-size:22px;font-weight:800;color:#F1F5F9;margin:0;">Gestión de Usuarios</h1>
        <p style="font-size:13px;color:rgba(100,116,139,0.85);margin-top:4px;">
          <span v-if="loading">Cargando...</span>
          <span v-else-if="apiError" style="color:#fb7185;">{{ apiError }}</span>
          <span v-else>{{ users.length }} usuarios en el sistema</span>
        </p>
      </div>
      <button v-if="isAdmin" @click="openCreate()"
        style="display:flex;align-items:center;gap:7px;height:38px;padding:0 18px;border-radius:10px;border:none;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;box-shadow:0 4px 16px rgba(14,165,233,0.3);">
        <UserPlus :size="14" /> Nuevo usuario
      </button>
    </div>

    <!-- KPIs -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;">
      <div v-for="k in kpis" :key="k.label" style="border-radius:14px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:16px 18px;">
        <div :style="{ fontSize:'26px', fontWeight:800, background:k.grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }">
          {{ loading ? '—' : k.value }}
        </div>
        <div style="font-size:11px;color:rgba(100,116,139,0.8);margin-top:4px;font-weight:500;">{{ k.label }}</div>
      </div>
    </div>

    <!-- Buscador + filtros -->
    <div style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:14px 16px;margin-bottom:20px;display:flex;flex-direction:column;gap:12px;">
      <div style="position:relative;max-width:380px;">
        <Search :size="14" style="position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;" :color="searchFocus?'#0EA5E9':'rgba(100,116,139,0.7)'" />
        <input v-model="search" placeholder="Buscar por nombre, email o área..."
          @focus="searchFocus=true" @blur="searchFocus=false"
          :style="{ width:'100%', height:'40px', background: searchFocus?'rgba(14,165,233,0.06)':'rgba(255,255,255,0.04)', border:`1px solid ${searchFocus?'rgba(14,165,233,0.45)':'rgba(255,255,255,0.09)'}`, borderRadius:'10px', paddingLeft:'38px', paddingRight:'14px', fontSize:'13px', color:'#E2E8F0', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'all 0.2s' }" />
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button v-for="f in roleFilters" :key="f.key" @click="roleFilter=f.key"
          :style="{ height:'30px', padding:'0 12px', borderRadius:'20px', fontSize:'11px', fontWeight: roleFilter===f.key ? 600:500, cursor:'pointer', border:'none', fontFamily:'inherit', background: roleFilter===f.key ? 'linear-gradient(135deg,#0EA5E9,#0284C7)':'rgba(255,255,255,0.05)', color: roleFilter===f.key ? '#fff':'rgba(100,116,139,0.9)', boxShadow: roleFilter===f.key ? '0 3px 10px rgba(14,165,233,0.25)':'none' }">
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Skeletons -->
    <div v-if="loading" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;">
      <div v-for="i in 6" :key="i" class="pulse" style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);height:180px;" />
    </div>

    <!-- Cards -->
    <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;">
      <div v-for="user in filtered" :key="user.id"
        style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:18px;position:relative;box-shadow:0 3px 14px rgba(0,0,0,0.3);transition:box-shadow 0.25s,transform 0.2s;"
        @mouseenter="e => { (e.currentTarget as HTMLElement).style.boxShadow='0 10px 30px rgba(0,0,0,0.45),0 0 0 1px rgba(14,165,233,0.12)'; (e.currentTarget as HTMLElement).style.transform='translateY(-3px)' }"
        @mouseleave="e => { (e.currentTarget as HTMLElement).style.boxShadow='0 3px 14px rgba(0,0,0,0.3)'; (e.currentTarget as HTMLElement).style.transform='translateY(0)' }">

        <!-- Menú ⋮ -->
        <div v-if="isAdmin" style="position:absolute;top:14px;right:14px;">
          <button @click.stop="openMenu===user.id ? openMenu=null : openMenu=user.id"
            style="width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(100,116,139,0.7);">
            <MoreVertical :size="13" />
          </button>
          <Transition name="dropdown">
            <div v-if="openMenu===user.id" @click.stop style="position:absolute;right:0;top:34px;width:140px;background:#0D1B35;border:1px solid rgba(255,255,255,0.1);border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,0.5);overflow:hidden;z-index:20;">
              <button @click="openEdit(user)"
                style="width:100%;display:flex;align-items:center;gap:8px;padding:9px 12px;background:none;border:none;cursor:pointer;font-size:12px;color:#CBD5E1;font-family:inherit;"
                @mouseenter="e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)'"
                @mouseleave="e => (e.currentTarget as HTMLElement).style.background='transparent'">
                <Pencil :size="13" /> Editar
              </button>
              <button @click="startDelete(user.id)"
                style="width:100%;display:flex;align-items:center;gap:8px;padding:9px 12px;background:none;border:none;cursor:pointer;font-size:12px;color:#fb7185;font-family:inherit;"
                @mouseenter="e => (e.currentTarget as HTMLElement).style.background='rgba(244,63,94,0.06)'"
                @mouseleave="e => (e.currentTarget as HTMLElement).style.background='transparent'">
                <Trash2 :size="13" /> Eliminar
              </button>
            </div>
          </Transition>
        </div>

        <!-- Avatar + nombre -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
          <div :style="{ width:'46px', height:'46px', borderRadius:'13px', background:`linear-gradient(135deg,${avatarGrad(user.name)[0]},${avatarGrad(user.name)[1]})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px', fontWeight:700, color:'white', flexShrink:0 }">
            {{ user.name.split(' ').slice(0,2).map((n:string)=>n[0]).join('') }}
          </div>
          <div style="min-width:0;flex:1;">
            <div style="font-size:13px;font-weight:700;color:#E2E8F0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:36px;">{{ user.name }}</div>
            <div style="font-size:11px;color:rgba(100,116,139,0.8);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ user.email }}</div>
          </div>
        </div>

        <!-- Badges -->
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">
          <span :style="{ fontSize:'10px', fontWeight:600, padding:'3px 9px', borderRadius:'20px', background:roleCfg[user.role].bg, color:roleCfg[user.role].color, border:`1px solid ${roleCfg[user.role].border}` }">{{ roleCfg[user.role].label }}</span>
          <span :style="{ fontSize:'10px', fontWeight:600, padding:'3px 9px', borderRadius:'20px', background:statusCfg[user.status]?.bg, color:statusCfg[user.status]?.color, display:'flex', alignItems:'center', gap:'4px' }">
            <span :style="{ width:'5px', height:'5px', borderRadius:'50%', background:statusCfg[user.status]?.dot, display:'inline-block' }" />
            {{ statusCfg[user.status]?.label }}
          </span>
          <span v-if="user.discountPct && user.discountPct > 0" style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;background:rgba(16,185,129,0.12);color:#34d399;border:1px solid rgba(16,185,129,0.25);">
            -{{ user.discountPct }}%
          </span>
        </div>

        <!-- Detalles -->
        <div v-if="user.lastLogin" style="display:flex;flex-direction:column;gap:7px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);">
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:11px;color:rgba(100,116,139,0.75);">Último acceso</span>
            <span style="font-size:11px;font-weight:500;color:#94a3b8;">{{ formatDate(user.lastLogin) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && filtered.length===0 && !apiError" style="display:flex;align-items:center;justify-content:center;padding:60px 0;border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);font-size:14px;font-weight:600;color:#94a3b8;margin-top:4px;">
      No se encontraron usuarios
    </div>
  </div>

  <!-- ══ Modal Crear / Editar ══ -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modal" style="position:fixed;inset:0;background:rgba(2,6,14,0.75);backdrop-filter:blur(6px);z-index:1050;" @click.self="!saving && (modal=null)" />
    </Transition>
    <Transition name="modal">
      <div v-if="modal" style="position:fixed;inset:0;z-index:1051;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div style="width:100%;max-width:480px;">
        <!-- Borde degradado -->
        <div style="position:relative;">
          <div style="position:absolute;inset:-1px;border-radius:20px;background:linear-gradient(135deg,rgba(14,165,233,0.4),rgba(124,58,237,0.25),rgba(14,165,233,0.1));z-index:0;pointer-events:none;" />
          <div style="position:relative;z-index:1;border-radius:20px;background:linear-gradient(160deg,#0D1B35,#09122A);padding:28px 28px 24px;box-shadow:0 32px 80px rgba(0,0,0,0.7);">
            <div style="position:absolute;top:0;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,rgba(14,165,233,0.7),transparent);border-radius:999px;" />

            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;">
              <div>
                <div style="font-size:16px;font-weight:700;color:#F1F5F9;">{{ modal==='create' ? 'Nuevo usuario' : 'Editar usuario' }}</div>
                <div style="font-size:12px;color:rgba(100,116,139,0.8);margin-top:3px;">{{ modal==='create' ? 'Completa los datos para agregar un usuario' : `Modificando a ${editTarget?.name.split(' ')[0]}` }}</div>
              </div>
              <button @click="!saving && (modal=null)" style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(100,116,139,0.8);">
                <X :size="14" />
              </button>
            </div>

            <form @submit.prevent="handleSave" style="display:flex;flex-direction:column;gap:14px;">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div style="grid-column:1/-1;"><FormField label="Nombre completo" v-model="form.name" placeholder="Juan Pérez García" :required="true" /></div>
                <div style="grid-column:1/-1;"><FormField label="Correo electrónico" type="email" v-model="form.email" placeholder="juan@empresa.com" :required="true" /></div>
                <div v-if="modal==='create'" style="grid-column:1/-1;"><FormField label="Contraseña" type="password" v-model="form.password" placeholder="Mínimo 6 caracteres" :required="true" /></div>
                <FormSelect label="Rol" v-model="form.role" :options="ROLES.map(r=>({value:r,label:roleCfg[r].label}))" />
                <FormSelect label="Estado" v-model="form.status" :options="STATUSES.map(s=>({value:s,label:statusCfg[s].label}))" />
                <div style="grid-column:1/-1;">
                  <div style="font-size:11px;font-weight:600;color:rgba(100,116,139,0.9);margin-bottom:6px;letter-spacing:0.3px;">Descuento en catálogo (%)</div>
                  <div style="position:relative;">
                    <input v-model.number="form.discountPct" type="number" min="0" max="100" step="0.5" placeholder="0"
                      style="width:100%;height:40px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:0 40px 0 14px;font-size:13px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;transition:border-color 0.2s;"
                      @focus="e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(14,165,233,0.45)'"
                      @blur="e=>(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.1)'" />
                    <span style="position:absolute;right:13px;top:50%;transform:translateY(-50%);font-size:13px;color:rgba(100,116,139,0.6);pointer-events:none;">%</span>
                  </div>
                  <div style="font-size:11px;color:rgba(100,116,139,0.5);margin-top:5px;">0 = precio normal · 10 = 10% de descuento sobre precios SYSCOM</div>
                </div>
              </div>

              <Transition name="fade">
                <div v-if="formError" style="padding:9px 12px;border-radius:8px;background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.25);font-size:12px;color:#fb7185;">{{ formError }}</div>
              </Transition>

              <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:4px;">
                <button type="button" @click="!saving && (modal=null)" style="height:38px;padding:0 18px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#94a3b8;font-size:13px;cursor:pointer;font-family:inherit;">Cancelar</button>
                <button type="submit" :disabled="saving" :style="{ height:'38px', padding:'0 22px', borderRadius:'10px', border:'none', background: saving?'rgba(14,165,233,0.5)':'linear-gradient(135deg,#0EA5E9,#0284C7)', color:'white', fontSize:'13px', fontWeight:600, cursor:saving?'not-allowed':'pointer', fontFamily:'inherit' }">
                  {{ saving ? 'Guardando...' : modal==='create' ? 'Crear usuario' : 'Guardar cambios' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  </Teleport>

  <!-- ══ Modal Confirmar Borrado ══ -->
  <Teleport to="body">
  <Transition name="fade">
    <div v-if="confirmDeleteId" style="position:fixed;inset:0;background:rgba(2,6,14,0.75);backdrop-filter:blur(6px);z-index:1060;" @click.self="!deleting && closeDeleteModal()" />
  </Transition>
  <Transition name="modal">
    <div v-if="confirmDeleteId" style="position:fixed;inset:0;z-index:1061;display:flex;align-items:center;justify-content:center;padding:16px;pointer-events:none;">
      <div style="width:100%;max-width:360px;pointer-events:auto;">
        <div style="border-radius:20px;background:linear-gradient(160deg,#0D1B35,#09122A);border:1px solid rgba(244,63,94,0.3);padding:28px 24px 24px;box-shadow:0 32px 80px rgba(0,0,0,0.7);display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;">
          <div style="width:48px;height:48px;border-radius:14px;background:rgba(244,63,94,0.12);border:1px solid rgba(244,63,94,0.25);display:flex;align-items:center;justify-content:center;margin-bottom:4px;">
            <Trash2 :size="22" color="#fb7185" />
          </div>
          <div style="font-size:16px;font-weight:700;color:#F1F5F9;">¿Eliminar a {{ deleteTarget?.name.split(' ')[0] }}?</div>
          <div style="font-size:13px;color:rgba(100,116,139,0.85);line-height:1.5;">
            Se eliminará <strong style="color:#CBD5E1;">{{ deleteTarget?.name }}</strong> del sistema.<br>Esta acción no se puede deshacer.
          </div>
          <div v-if="isSelf" style="padding:9px 12px;border-radius:8px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);font-size:12px;color:#fbbf24;width:100%;box-sizing:border-box;">
            No puedes eliminar tu propia cuenta.
          </div>
          <div v-else-if="deleteError" style="padding:9px 12px;border-radius:8px;background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.25);font-size:12px;color:#fb7185;width:100%;box-sizing:border-box;">
            {{ deleteError }}
          </div>
          <div style="display:flex;gap:10px;margin-top:10px;width:100%;">
            <button @click="closeDeleteModal()" :disabled="deleting" style="flex:1;height:40px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:#94a3b8;font-size:13px;cursor:pointer;font-family:inherit;">Cancelar</button>
            <button @click="handleDelete()" :disabled="deleting || isSelf" :style="{ flex:1, height:'40px', borderRadius:'10px', border:'none', background: (deleting||isSelf)?'rgba(244,63,94,0.35)':'linear-gradient(135deg,#f43f5e,#e11d48)', color:'white', fontSize:'13px', fontWeight:600, cursor:(deleting||isSelf)?'not-allowed':'pointer', fontFamily:'inherit', boxShadow:(deleting||isSelf)?'none':'0 4px 16px rgba(244,63,94,0.35)' }">
              {{ deleting ? 'Eliminando...' : 'Sí, eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Search, UserPlus, MoreVertical, Pencil, Trash2, X } from '@lucide/vue'
import type { User } from '~/types'

definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const isAdmin = computed(() => auth.user?.role === 'admin')

/* ── datos ── */
const users    = ref<User[]>([])
const loading  = ref(true)
const apiError = ref('')

onMounted(async () => {
  try {
    const data = await $fetch<{ users: User[] }>('/api/users')
    users.value = data.users
  } catch (e: unknown) {
    apiError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cargar usuarios'
  } finally { loading.value = false }
})

/* ── filtros ── */
const search      = ref('')
const roleFilter  = ref('all')
const searchFocus = ref(false)
const openMenu    = ref<string | null>(null)
const _closeMenu  = () => { openMenu.value = null }
onMounted(() => document.addEventListener('click', _closeMenu))
onUnmounted(() => document.removeEventListener('click', _closeMenu))

const roleFilters = [
  { key:'all', label:'Todos' }, { key:'admin', label:'Admin' },
  { key:'approver', label:'Aprobador' }, { key:'buyer', label:'Comprador' }, { key:'viewer', label:'Visor' },
]
const ROLES    = ['admin','approver','buyer','viewer'] as const
const STATUSES = ['active','inactive','pending']       as const

const filtered = computed(() => users.value.filter(u => {
  if (roleFilter.value !== 'all' && u.role !== roleFilter.value) return false
  const q = search.value.toLowerCase()
  return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
}))

const kpis = computed(() => [
  { label:'Total',           value:users.value.length,                                   grad:'linear-gradient(135deg,#0EA5E9,#22D3EE)' },
  { label:'Activos',         value:users.value.filter(u=>u.status==='active').length,    grad:'linear-gradient(135deg,#10B981,#34D399)' },
  { label:'Administradores', value:users.value.filter(u=>u.role==='admin').length,       grad:'linear-gradient(135deg,#7C3AED,#A78BFA)' },
  { label:'Pendientes',      value:users.value.filter(u=>u.status==='pending').length,   grad:'linear-gradient(135deg,#F59E0B,#FCD34D)' },
])

/* ── config visual ── */
const roleCfg: Record<string, { label:string; color:string; bg:string; border:string }> = {
  admin:    { label:'Admin',     color:'#a78bfa', bg:'rgba(124,58,237,0.12)', border:'rgba(124,58,237,0.25)' },
  approver: { label:'Aprobador', color:'#fbbf24', bg:'rgba(245,158,11,0.12)', border:'rgba(245,158,11,0.25)' },
  buyer:    { label:'Comprador', color:'#38bdf8', bg:'rgba(14,165,233,0.12)', border:'rgba(14,165,233,0.25)' },
  viewer:   { label:'Visor',     color:'#94a3b8', bg:'rgba(148,163,184,0.1)', border:'rgba(148,163,184,0.2)' },
}
const statusCfg: Record<string, { label:string; color:string; bg:string; dot:string }> = {
  active:   { label:'Activo',    color:'#34d399', bg:'rgba(16,185,129,0.12)', dot:'#10b981' },
  inactive: { label:'Inactivo',  color:'#fb7185', bg:'rgba(244,63,94,0.12)',  dot:'#f43f5e' },
  pending:  { label:'Pendiente', color:'#fbbf24', bg:'rgba(245,158,11,0.12)', dot:'#f59e0b' },
}
const palette = [['#0EA5E9','#22D3EE'],['#7C3AED','#A78BFA'],['#10B981','#34D399'],['#F59E0B','#FCD34D'],['#F43F5E','#FB7185'],['#6366F1','#818CF8']]
const avatarGrad = (name: string) => palette[name.charCodeAt(0) % palette.length]

const formatDate     = (d: string) => new Intl.DateTimeFormat('es-MX',{ day:'2-digit', month:'short', year:'numeric' }).format(new Date(d))

/* ── modal crear / editar ── */
interface Form { name:string; email:string; password:string; role:string; status:string; discountPct:number }
const modal      = ref<'create'|'edit'|null>(null)
const editTarget = ref<User|null>(null)
const form       = ref<Form>({ name:'', email:'', password:'', role:'buyer', status:'active', discountPct:0 })
const saving     = ref(false)
const formError  = ref('')

function openCreate() {
  form.value = { name:'', email:'', password:'', role:'buyer', status:'active', discountPct:0 }
  formError.value = ''
  modal.value = 'create'
}
function openEdit(u: User) {
  editTarget.value = u
  form.value = { name:u.name, email:u.email, password:'', role:u.role, status:u.status, discountPct:u.discountPct ?? 0 }
  formError.value = ''
  openMenu.value = null
  modal.value = 'edit'
}

async function handleSave() {
  saving.value = true; formError.value = ''
  try {
    const body: Record<string,unknown> = { name:form.value.name, email:form.value.email, role:form.value.role, status:form.value.status, discountPct:form.value.discountPct }
    if (modal.value === 'create') {
      if (!form.value.password) { formError.value = 'La contraseña es requerida'; saving.value=false; return }
      body.password = form.value.password
      const data = await $fetch<{ user:User }>('/api/users', { method:'POST', body })
      users.value.push(data.user)
    } else {
      const data = await $fetch<{ user:User }>(`/api/users/${editTarget.value!.id}`, { method:'PATCH', body })
      const idx  = users.value.findIndex(u => u.id === data.user.id)
      if (idx >= 0) users.value[idx] = data.user
    }
    modal.value = null
  } catch (e: unknown) {
    formError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al guardar'
  } finally { saving.value = false }
}

/* ── eliminar ── */
function startDelete(id: string) {
  openMenu.value = null
  deleteError.value = ''
  confirmDeleteId.value = id
}

const confirmDeleteId = ref<string|null>(null)
const deleting        = ref(false)
const deleteError     = ref('')
const deleteTarget    = computed(() => users.value.find(u => u.id === confirmDeleteId.value))
const isSelf          = computed(() => !!confirmDeleteId.value && confirmDeleteId.value === auth.user?.id)

function closeDeleteModal() {
  confirmDeleteId.value = null
  deleteError.value = ''
}

async function handleDelete() {
  if (!confirmDeleteId.value || isSelf.value) return
  deleting.value = true; deleteError.value = ''
  try {
    await $fetch(`/api/users/${confirmDeleteId.value}`, { method:'DELETE' })
    users.value = users.value.filter(u => u.id !== confirmDeleteId.value)
    closeDeleteModal()
  } catch (e: unknown) {
    deleteError.value = (e as { data?: { message?: string } })?.data?.message ?? 'No se pudo eliminar el usuario'
  } finally { deleting.value = false }
}
</script>
