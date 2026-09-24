<template>
  <div class="pcar" @mouseenter="pausado = true" @mouseleave="pausado = false" @focusin="pausado = true" @focusout="pausado = false">
    <button type="button" class="pcar-arrow prev" aria-label="Productos anteriores" :disabled="!puedeAtras" @click="mover(-1)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>

    <div ref="track" class="pcar-track" role="region" aria-roledescription="carrusel" aria-label="Productos destacados"
      @scroll.passive="onScroll" @touchstart.passive="pausado = true" @touchend.passive="reanudarLuego">
      <article v-for="p in productos" :key="p.id" class="pcar-card">
        <div class="pcar-img">
          <img :src="p.imagen" :alt="p.nombre" loading="lazy" draggable="false" />
          <span :class="['pcar-stock', p.disponible ? 'ok' : 'soon']">{{ p.disponible ? 'Disponible' : 'Bajo pedido' }}</span>
        </div>
        <div class="pcar-body">
          <div class="pcar-brandline">
            <img v-if="p.marcaLogo" :src="p.marcaLogo" :alt="p.marca" class="pcar-logo" loading="lazy" @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')" />
            <span v-else class="pcar-marca">{{ p.marca }}</span>
          </div>
          <h3 class="pcar-name" :title="p.nombre">{{ p.nombre }}</h3>
          <div class="pcar-model">{{ p.modelo }}</div>
          <div class="pcar-foot">
            <span class="pcar-lock">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Precio para clientes
            </span>
            <a href="#contacto" class="pcar-btn" @click.prevent="emit('cotizar')">Cotizar</a>
          </div>
        </div>
      </article>
    </div>

    <button type="button" class="pcar-arrow next" aria-label="Más productos" @click="mover(1)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>

    <div v-if="paginas > 1 && paginas <= 8" class="pcar-dots" role="tablist" aria-label="Páginas del carrusel">
      <button v-for="i in paginas" :key="i" type="button" role="tab" :aria-selected="pagina === i - 1" :aria-label="`Página ${i}`"
        :class="['pcar-dot', { active: pagina === i - 1 }]" @click="irA(i - 1)" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Producto { id: string; nombre: string; modelo: string; marca: string; marcaLogo: string; imagen: string; disponible: boolean }

const props = withDefaults(defineProps<{ productos: Producto[]; intervalo?: number }>(), { intervalo: 4000 })
const emit  = defineEmits<{ (e: 'cotizar'): void }>()

const track      = ref<HTMLElement | null>(null)
const pagina     = ref(0)
const paginas    = ref(1)
const puedeAtras = ref(false)
const pausado    = ref(false)

// Una "página" = las tarjetas completas que caben en el carril (1 en celular, 4 en escritorio)
function metricas() {
  const el = track.value!
  const card = el.querySelector<HTMLElement>('.pcar-card')
  const gap  = parseFloat(getComputedStyle(el).columnGap) || 0
  const unidad   = card ? card.offsetWidth + gap : el.clientWidth
  const visibles = Math.max(1, Math.floor((el.clientWidth + gap) / unidad))
  const max      = Math.max(0, el.scrollWidth - el.clientWidth)
  return { el, paso: unidad * visibles, max }
}

function medir() {
  if (!track.value) return
  const { el, paso, max } = metricas()
  paginas.value    = max > 4 ? Math.ceil(max / paso - 0.05) + 1 : 1
  pagina.value     = el.scrollLeft >= max - 4 ? paginas.value - 1 : Math.min(paginas.value - 1, Math.round(el.scrollLeft / paso))
  puedeAtras.value = el.scrollLeft > 4
}
const onScroll = () => medir()

function irA(p: number) {
  if (!track.value) return
  const { el, paso, max } = metricas()
  el.scrollTo({ left: Math.min(p * paso, max), behavior: 'smooth' })
}

function mover(dir: 1 | -1) {
  if (!track.value) return
  const { el, paso, max } = metricas()
  if (dir === 1 && el.scrollLeft >= max - 4) return irA(0) // al final vuelve al inicio
  el.scrollBy({ left: dir * paso, behavior: 'smooth' })
}

let timer: ReturnType<typeof setInterval> | undefined
let reanudar: ReturnType<typeof setTimeout> | undefined
function reanudarLuego() {
  clearTimeout(reanudar)
  reanudar = setTimeout(() => { pausado.value = false }, 5000)
}

onMounted(() => {
  medir()
  window.addEventListener('resize', medir)
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reducido) {
    timer = setInterval(() => {
      if (!pausado.value && document.visibilityState === 'visible') mover(1)
    }, props.intervalo)
  }
})
onUnmounted(() => {
  window.removeEventListener('resize', medir)
  clearInterval(timer)
  clearTimeout(reanudar)
})
watch(() => props.productos.length, () => nextTick(medir))
</script>

<style scoped>
.pcar { position:relative; }
.pcar-track { display:grid; grid-auto-flow:column; grid-auto-columns:calc((100% - 3 * 14px) / 4); gap:14px;
  overflow-x:auto; scroll-snap-type:x mandatory; scroll-behavior:smooth; scrollbar-width:none; padding:4px 2px 8px; }
.pcar-track::-webkit-scrollbar { display:none; }

.pcar-card { scroll-snap-align:start; display:flex; flex-direction:column; border-radius:16px; overflow:hidden;
  background:linear-gradient(160deg,#0C1A2E,#081426); border:1px solid rgba(255,255,255,0.08); transition:transform .2s, border-color .2s, box-shadow .2s; }
.pcar-card:hover { transform:translateY(-3px); border-color:rgba(14,165,233,0.3); box-shadow:0 12px 32px rgba(0,0,0,0.35); }
.pcar-img { position:relative; aspect-ratio:4/3; background:#fff; display:flex; align-items:center; justify-content:center; }
.pcar-img img { width:82%; height:82%; object-fit:contain; user-select:none; }
.pcar-stock { position:absolute; top:10px; left:10px; font-size:10.5px; font-weight:700; padding:3px 9px; border-radius:20px; }
.pcar-stock.ok { background:#dcfce7; color:#166534; }
.pcar-stock.soon { background:#fef3c7; color:#92400e; }
.pcar-body { flex:1; display:flex; flex-direction:column; padding:14px 16px 16px; }
.pcar-brandline { height:20px; display:flex; align-items:center; margin-bottom:8px; }
.pcar-logo { max-height:18px; max-width:90px; object-fit:contain; background:#fff; border-radius:4px; padding:1px 4px; }
.pcar-marca { font-size:11px; font-weight:700; letter-spacing:.6px; text-transform:uppercase; color:#7DD3FC; }
.pcar-name { margin:0; font-size:13.5px; font-weight:600; line-height:1.4; color:#E2EAF4; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; min-height:calc(1.4em * 3); }
.pcar-model { margin-top:6px; font-size:11.5px; color:rgba(123,146,176,0.9); font-family:ui-monospace,'SF Mono',Menlo,monospace; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pcar-foot { margin-top:auto; padding-top:14px; display:flex; align-items:center; justify-content:space-between; gap:8px; }
.pcar-lock { display:inline-flex; align-items:center; gap:5px; font-size:11.5px; color:rgba(123,146,176,0.9); }
.pcar-btn { height:32px; padding:0 14px; border-radius:10px; display:inline-flex; align-items:center; font-size:12px; font-weight:600; text-decoration:none;
  color:#7DD3FC; background:rgba(14,165,233,0.1); border:1px solid rgba(14,165,233,0.3); transition:background .2s; white-space:nowrap; }
.pcar-btn:hover { background:rgba(14,165,233,0.18); }

.pcar-arrow { position:absolute; top:calc(50% - 30px); z-index:2; width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center;
  color:#E2EAF4; background:rgba(12,26,46,0.92); border:1px solid rgba(255,255,255,0.14); box-shadow:0 6px 20px rgba(0,0,0,0.45); cursor:pointer; transition:all .2s; }
.pcar-arrow:hover:not(:disabled) { background:#0EA5E9; border-color:#0EA5E9; }
.pcar-arrow:disabled { opacity:0; pointer-events:none; }
.pcar-arrow.prev { left:-20px; }
.pcar-arrow.next { right:-20px; }

.pcar-dots { display:flex; justify-content:center; gap:8px; margin-top:14px; }
.pcar-dot { width:8px; height:8px; padding:0; border-radius:8px; border:none; background:rgba(255,255,255,0.18); cursor:pointer; transition:all .25s; }
.pcar-dot.active { width:24px; background:#0EA5E9; }

@media (max-width: 1100px) { .pcar-track { grid-auto-columns:calc((100% - 2 * 14px) / 3); } }
@media (max-width: 860px)  { .pcar-track { grid-auto-columns:calc((100% - 14px) / 2); } .pcar-arrow.prev { left:-8px; } .pcar-arrow.next { right:-8px; } }
@media (max-width: 520px)  {
  .pcar-track { grid-auto-columns:78%; gap:12px; }
  .pcar-arrow { display:none; }
  .pcar-body { padding:12px 14px 14px; }
}
</style>
