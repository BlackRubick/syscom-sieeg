<template>
  <div ref="root" class="fc" :class="{ open, active: !!modelValue }">
    <button type="button" class="fc-trigger" :aria-expanded="open" aria-haspopup="listbox" @click="toggle">
      <span class="fc-label">{{ label }}</span>
      <span class="fc-value">{{ seleccionado?.label ?? 'Todos' }}</span>
      <span v-if="modelValue" class="fc-clear" role="button" :aria-label="`Quitar filtro de ${label.toLowerCase()}`" @click.stop="elegir('')">×</span>
      <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
    </button>

    <div v-if="open" class="fc-pop">
      <input ref="input" v-model="texto" class="fc-search" :placeholder="placeholder"
        @keydown.down.prevent="mover(1)" @keydown.up.prevent="mover(-1)" @keydown.enter.prevent="elegirActivo" @keydown.esc="open = false" />
      <ul class="fc-list" role="listbox">
        <li v-for="(o, i) in filtradas" :key="o.value" role="option" :aria-selected="o.value === modelValue"
          :class="['fc-opt', { hl: i === activo, sel: o.value === modelValue }]" @mouseenter="activo = i" @mousedown.prevent="elegir(o.value)">
          <div class="fc-opt-main">
            <span class="fc-opt-label">{{ o.label }}</span>
            <span v-if="o.badge" class="fc-badge">{{ o.badge }}</span>
          </div>
          <div v-if="o.sub || o.count != null" class="fc-opt-sub">
            <span>{{ o.sub }}</span>
            <span v-if="o.count != null">{{ o.count }} pedido{{ o.count !== 1 ? 's' : '' }}</span>
          </div>
        </li>
        <li v-if="!filtradas.length" class="fc-empty">Sin resultados</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ComboOption { value: string; label: string; sub?: string; badge?: string; count?: number; search?: string }

const props = defineProps<{ modelValue: string; options: ComboOption[]; label: string; placeholder?: string }>()
const emit  = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const open   = ref(false)
const texto  = ref('')
const activo = ref(0)
const root   = ref<HTMLElement | null>(null)
const input  = ref<HTMLInputElement | null>(null)

const seleccionado = computed(() => props.options.find(o => o.value === props.modelValue))

const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const filtradas = computed(() => {
  const q = normalizar(texto.value.trim())
  const lista = q ? props.options.filter(o => normalizar(`${o.label} ${o.sub ?? ''} ${o.badge ?? ''} ${o.search ?? ''}`).includes(q)) : props.options
  return lista.slice(0, 80)
})
watch(texto, () => { activo.value = 0 })

function toggle() {
  open.value = !open.value
  if (open.value) { texto.value = ''; nextTick(() => input.value?.focus()) }
}
function elegir(v: string) {
  emit('update:modelValue', v)
  open.value = false
}
function mover(d: number) {
  const n = filtradas.value.length
  if (n) activo.value = (activo.value + d + n) % n
}
function elegirActivo() {
  const o = filtradas.value[activo.value]
  if (o) elegir(o.value)
}

function fuera(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('mousedown', fuera))
onUnmounted(() => document.removeEventListener('mousedown', fuera))
</script>

<style scoped>
.fc { position:relative; }
.fc-trigger { display:flex; align-items:center; gap:8px; height:40px; min-width:210px; max-width:320px; padding:0 12px; border-radius:10px; cursor:pointer; font-family:inherit;
  background:rgba(11,27,51,0.04); border:1px solid rgba(11,27,51,0.09); color:#5B6B82; transition:all .2s; }
.fc-trigger:hover { border-color:rgba(11,27,51,0.18); }
.fc.open .fc-trigger, .fc.active .fc-trigger { border-color:rgba(21,112,239,0.45); background:rgba(21,112,239,0.06); }
.fc-label { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.6px; color:#5B6B82; flex-shrink:0; }
.fc-value { flex:1; min-width:0; text-align:left; font-size:13px; color:#0B1B33; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.fc:not(.active) .fc-value { color:#5B6B82; }
.fc-clear { width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; line-height:1; color:#0B1B33; background:rgba(11,27,51,0.12); flex-shrink:0; }
.fc-clear:hover { background:rgba(239,68,68,0.5); }

.fc-pop { position:absolute; top:calc(100% + 6px); left:0; z-index:40; width:340px; max-width:calc(100vw - 32px); border-radius:12px; overflow:hidden;
  background:#FFFFFF; border:1px solid rgba(21,112,239,0.25); box-shadow:0 18px 50px rgba(11,27,51,0.16); }
.fc-search { width:100%; box-sizing:border-box; height:40px; padding:0 14px; border:none; border-bottom:1px solid rgba(11,27,51,0.08); background:rgba(11,27,51,0.03); color:#0B1B33; font-size:13px; font-family:inherit; outline:none; }
.fc-search::placeholder { color:#7A889C; }
.fc-list { list-style:none; margin:0; padding:4px; max-height:300px; overflow-y:auto; scrollbar-width:thin; scrollbar-color:rgba(11,27,51,0.15) transparent; }
.fc-opt { padding:8px 10px; border-radius:8px; cursor:pointer; }
.fc-opt.hl { background:rgba(21,112,239,0.12); }
.fc-opt.sel .fc-opt-label { color:#0B5BD3; font-weight:700; }
.fc-opt-main { display:flex; align-items:center; gap:8px; }
.fc-opt-label { font-size:13px; color:#0B1B33; flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.fc-badge { font-size:10px; font-weight:700; font-family:ui-monospace,monospace; padding:1px 6px; border-radius:6px; color:#0B5BD3; background:rgba(21,112,239,0.1); flex-shrink:0; }
.fc-opt-sub { display:flex; justify-content:space-between; gap:8px; margin-top:2px; font-size:11px; color:#5B6B82; }
.fc-opt-sub span:first-child { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.fc-opt-sub span:last-child { flex-shrink:0; }
.fc-empty { padding:14px; text-align:center; font-size:12px; color:#7A889C; }

@media (max-width: 640px) { .fc, .fc-trigger { width:100%; max-width:none; } .fc-pop { width:100%; } }
</style>
