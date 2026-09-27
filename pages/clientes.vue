<template>
  <div class="cl">
    <div class="cl-head">
      <div>
        <h1>Clientes</h1>
        <p>{{ loading ? 'Cargando…' : `${clientes.length} cliente${clientes.length !== 1 ? 's' : ''}` }}</p>
      </div>
      <button class="cl-btn cl-btn-primary" @click="abrirNuevo"><UserPlus :size="15" /> Nuevo cliente</button>
    </div>

    <div class="cl-card cl-filters">
      <div class="cl-search">
        <Search :size="15" />
        <input v-model="search" placeholder="Buscar por nombre, correo, empresa, RFC o CL-…" />
      </div>
    </div>

    <div v-if="error" class="cl-card cl-empty">{{ error }}</div>
    <div v-else-if="loading" class="cl-card cl-empty">Cargando clientes…</div>
    <div v-else-if="!filtrados.length" class="cl-card cl-empty">
      <strong>Sin clientes</strong>
      <span>Da de alta a tu primer cliente con <b>Nuevo cliente</b>.</span>
    </div>

    <div v-else class="cl-grid">
      <article v-for="c in filtrados" :key="c.id" class="cl-item">
        <div class="cl-item-top">
          <span class="cl-avatar">{{ iniciales(c.name) }}</span>
          <div class="cl-item-id">
            <strong>{{ c.name }}</strong>
            <span>{{ c.email }}</span>
          </div>
          <span v-if="c.clientNumber" class="cl-num">{{ formatClientNumber(c.clientNumber) }}</span>
        </div>
        <div class="cl-item-data">
          <div><span>Empresa</span><b>{{ c.razonSocial || '—' }}</b></div>
          <div><span>RFC</span><b>{{ c.rfc || '—' }}</b></div>
          <div><span>Pedidos</span><b>{{ c.pedidos }}</b></div>
          <div><span>Cotizaciones</span><b>{{ c.cotizaciones }}</b></div>
        </div>
        <div class="cl-item-badges">
          <span :class="['cl-badge', c.status === 'active' ? 'ok' : 'off']">{{ c.status === 'active' ? 'Activo' : c.status === 'pending' ? 'Pendiente' : 'Inactivo' }}</span>
          <NuxtLink v-if="!c.fiscalCompleted" :to="`/fiscal?buscar=${encodeURIComponent(c.email)}`" class="cl-badge warn">Faltan datos fiscales →</NuxtLink>
          <span v-else class="cl-badge ok">Datos fiscales completos</span>
        </div>
        <div class="cl-item-actions">
          <button class="cl-btn cl-btn-primary" :disabled="c.status !== 'active'" @click="venderA(c)"><ShoppingCart :size="14" /> Cotizar / pedir</button>
          <NuxtLink :to="`/quotes?search=${encodeURIComponent(c.email)}`" class="cl-btn cl-btn-ghost">Cotizaciones</NuxtLink>
          <NuxtLink :to="`/orders?cliente=${c.id}`" class="cl-btn cl-btn-ghost">Pedidos</NuxtLink>
        </div>
      </article>
    </div>

    <!-- Alta de cliente -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modal" class="cl-backdrop" @click.self="!guardando && cerrar()">
          <div class="cl-modal" role="dialog" aria-modal="true" aria-labelledby="cl-modal-title">
            <template v-if="!creado">
              <h2 id="cl-modal-title">Nuevo cliente</h2>
              <p class="cl-muted">La cuenta queda activa de inmediato. Después captura sus datos fiscales para poder enviar y facturar sus pedidos.</p>
              <form class="cl-form" @submit.prevent="crear">
                <FormField label="Nombre completo" v-model="form.name" placeholder="Juan Pérez García" :required="true" />
                <FormField label="Correo electrónico" type="email" v-model="form.email" placeholder="compras@empresa.com" :required="true" />
                <div class="cl-pass">
                  <FormField label="Contraseña inicial" v-model="form.password" placeholder="Mínimo 8 caracteres" :required="true" />
                  <button type="button" class="cl-btn cl-btn-ghost" @click="generarPassword">Generar</button>
                </div>
                <p v-if="formError" class="cl-error">{{ formError }}</p>
                <div class="cl-modal-actions">
                  <button type="button" class="cl-btn cl-btn-ghost" :disabled="guardando" @click="cerrar">Cancelar</button>
                  <button type="submit" class="cl-btn cl-btn-primary" :disabled="guardando">{{ guardando ? 'Creando…' : 'Crear cliente' }}</button>
                </div>
              </form>
            </template>
            <template v-else>
              <h2 id="cl-modal-title">Cliente creado</h2>
              <p class="cl-muted">Comparte estos datos de acceso con tu cliente para que pueda ver y aceptar sus cotizaciones:</p>
              <div class="cl-cred">
                <div><span>Número</span><b>{{ formatClientNumber(creado.clientNumber) }}</b></div>
                <div><span>Usuario</span><b>{{ creado.email }}</b></div>
                <div><span>Contraseña</span><b>{{ creado.password }}</b></div>
                <div><span>Acceso</span><b>{{ origen }}/login</b></div>
              </div>
              <div class="cl-modal-actions">
                <button type="button" class="cl-btn cl-btn-ghost" @click="copiarCredenciales">{{ copiado ? '¡Copiado!' : 'Copiar datos' }}</button>
                <NuxtLink :to="`/fiscal?buscar=${encodeURIComponent(creado.email)}`" class="cl-btn cl-btn-ghost">Capturar datos fiscales</NuxtLink>
                <button type="button" class="cl-btn cl-btn-primary" @click="venderA(creado); cerrar()">Cotizar para él</button>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Search, UserPlus, ShoppingCart } from '@lucide/vue'

definePageMeta({ middleware: 'auth' })

interface Cliente {
  id: string; name: string; email: string; clientNumber: number | null; status: string
  fiscalCompleted: boolean; razonSocial: string | null; rfc: string | null; pedidos: number; cotizaciones: number
}

const route  = useRoute()
const auth   = useAuthStore()
const clientes = ref<Cliente[]>([])
const loading  = ref(true)
const error    = ref('')
const search   = ref('')

async function cargar() {
  loading.value = true; error.value = ''
  try { clientes.value = (await $fetch<{ clientes: Cliente[] }>('/api/clients')).clientes }
  catch (e: any) { error.value = e?.data?.message ?? 'No se pudieron cargar los clientes' }
  finally { loading.value = false }
}
onMounted(() => {
  if (auth.user && !['admin', 'seller'].includes(auth.user.role)) return navigateTo('/catalog')
  cargar()
  if (route.query.nuevo) abrirNuevo()
})

const filtrados = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return clientes.value
  const num = parseClientNumber(q)
  return clientes.value.filter(c =>
    c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) ||
    (c.razonSocial ?? '').toLowerCase().includes(q) || (c.rfc ?? '').toLowerCase().includes(q) ||
    (num !== null && c.clientNumber === num))
})

// Deja elegido al cliente en el carrito y lleva al catálogo para armar la cotización o el pedido
const clienteCarrito = useClienteCarrito()
function venderA(c: { id: string }) {
  clienteCarrito.value = c.id
  navigateTo('/catalog')
}

// ── Alta ──
const modal     = ref(false)
const guardando = ref(false)
const formError = ref('')
const form      = reactive({ name: '', email: '', password: '' })
const creado    = ref<(Cliente & { password: string }) | null>(null)
const copiado   = ref(false)
const origen    = computed(() => (import.meta.client ? window.location.origin : ''))

function abrirNuevo() {
  form.name = ''; form.email = ''; form.password = ''; formError.value = ''; creado.value = null
  modal.value = true
}
function cerrar() { modal.value = false }

function generarPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  const rnd = crypto.getRandomValues(new Uint32Array(10))
  form.password = Array.from(rnd, n => chars[n % chars.length]).join('')
}

async function crear() {
  guardando.value = true; formError.value = ''
  try {
    const r = await $fetch<{ user: Cliente }>('/api/users', {
      method: 'POST', body: { name: form.name.trim(), email: form.email.trim(), password: form.password, role: 'buyer', status: 'active' },
    })
    creado.value = { ...r.user, fiscalCompleted: false, razonSocial: null, rfc: null, pedidos: 0, cotizaciones: 0, password: form.password }
    await cargar()
  } catch (e: any) {
    formError.value = e?.data?.message ?? 'No se pudo crear el cliente'
  } finally { guardando.value = false }
}

async function copiarCredenciales() {
  if (!creado.value) return
  const texto = `Acceso a SIEEG Integradores\n${origen.value}/login\nUsuario: ${creado.value.email}\nContraseña: ${creado.value.password}`
  try { await navigator.clipboard.writeText(texto); copiado.value = true; setTimeout(() => (copiado.value = false), 1500) } catch { /* sin portapapeles */ }
}

const iniciales = (n: string) => n.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
</script>

<style scoped>
.cl { display: flex; flex-direction: column; gap: 18px; font-family: 'Inter', system-ui, sans-serif; color: #0B1B33; }
.cl-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.cl-head h1 { font-size: 22px; font-weight: 800; margin: 0; }
.cl-head p { font-size: 13px; color: #5B6B82; margin: 4px 0 0; }
.cl-card { background: #fff; border: 1px solid #E4E9F1; border-radius: 16px; }
.cl-filters { padding: 14px 16px; }
.cl-search { display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 12px; border-radius: 10px; background: #F5F8FC; border: 1px solid #E4E9F1; color: #7A889C; max-width: 520px; }
.cl-search:focus-within { border-color: #1570EF; background: #fff; }
.cl-search input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font-size: 13.5px; color: #0B1B33; font-family: inherit; }
.cl-empty { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 48px 16px; text-align: center; color: #5B6B82; font-size: 13.5px; }
.cl-empty strong { color: #0B1B33; font-size: 15px; }

.cl-btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 38px; padding: 0 14px; border-radius: 10px; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; text-decoration: none; white-space: nowrap; }
.cl-btn:disabled { opacity: .55; cursor: not-allowed; }
.cl-btn-primary { background: #1570EF; color: #fff; border: none; }
.cl-btn-primary:hover:not(:disabled) { background: #0B5BD3; }
.cl-btn-ghost { background: #fff; color: #0B1B33; border: 1px solid #D5DEEA; }
.cl-btn-ghost:hover:not(:disabled) { background: #F5F8FC; }

.cl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }
.cl-item { display: flex; flex-direction: column; gap: 12px; padding: 16px; background: #fff; border: 1px solid #E4E9F1; border-radius: 16px; min-width: 0; }
.cl-item-top { display: flex; align-items: center; gap: 12px; min-width: 0; }
.cl-avatar { width: 40px; height: 40px; border-radius: 11px; background: linear-gradient(135deg, #1570EF, #0B5BD3); color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cl-item-id { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.cl-item-id strong { font-size: 14.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cl-item-id span { font-size: 12.5px; color: #5B6B82; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cl-num { font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 6px; background: #F1F5FB; color: #0B5BD3; font-family: ui-monospace, Menlo, monospace; flex-shrink: 0; }
.cl-item-data { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 14px; font-size: 12.5px; }
.cl-item-data div { display: flex; flex-direction: column; min-width: 0; }
.cl-item-data span { color: #7A889C; font-size: 11.5px; }
.cl-item-data b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cl-item-badges { display: flex; gap: 6px; flex-wrap: wrap; }
.cl-badge { font-size: 11.5px; font-weight: 700; padding: 3px 9px; border-radius: 999px; text-decoration: none; }
.cl-badge.ok { background: #ECFDF3; color: #15803D; }
.cl-badge.off { background: #F1F3F6; color: #5B6B82; }
.cl-badge.warn { background: #FFF7E6; color: #B45309; }
.cl-item-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; }
.cl-item-actions .cl-btn-primary { flex: 1; }

.cl-backdrop { position: fixed; inset: 0; z-index: 1050; background: rgba(11,27,51,0.45); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 16px; }
.cl-modal { width: 100%; max-width: 460px; background: #fff; border-radius: 20px; padding: 26px 24px 22px; box-shadow: 0 32px 80px rgba(11,27,51,0.2); font-family: 'Inter', system-ui, sans-serif; color: #0B1B33; }
.cl-modal h2 { margin: 0 0 6px; font-size: 19px; font-weight: 800; }
.cl-muted { margin: 0 0 18px; font-size: 13px; color: #5B6B82; line-height: 1.55; }
.cl-form { display: flex; flex-direction: column; gap: 14px; }
.cl-pass { display: flex; align-items: flex-end; gap: 8px; }
.cl-pass > :first-child { flex: 1; }
.cl-error { margin: 0; padding: 9px 11px; border-radius: 9px; background: #FEF2F2; color: #B91C1C; font-size: 12.5px; }
.cl-modal-actions { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
.cl-cred { display: flex; flex-direction: column; gap: 8px; padding: 14px; border-radius: 12px; background: #F5F8FC; border: 1px solid #E4E9F1; margin-bottom: 16px; }
.cl-cred div { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; }
.cl-cred span { color: #5B6B82; }
.cl-cred b { font-family: ui-monospace, Menlo, monospace; overflow-wrap: anywhere; text-align: right; }

@media (max-width: 480px) {
  .cl-grid { grid-template-columns: minmax(0, 1fr); }
}
</style>
