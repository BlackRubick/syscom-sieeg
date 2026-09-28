<template>
  <div class="dt no-print">
    <button type="button" class="dt-btn dt-ghost" @click="volver">← Volver</button>
    <span class="dt-hint">En el diálogo elige <b>“Guardar como PDF”</b> para descargarlo.</span>
    <button type="button" class="dt-btn dt-primary" :disabled="!listo" @click="imprimir">Descargar PDF</button>
  </div>
</template>

<script setup lang="ts">
/* Barra de la vista de impresión: imprime/guarda como PDF en cuanto el documento está listo. */
const props = defineProps<{ listo: boolean; volverA: string }>()

function imprimir() { window.print() }
function volver() {
  if (window.history.length > 1) window.history.back()
  else navigateTo(props.volverA)
}

// Abre el diálogo una sola vez, cuando ya cargaron datos e imágenes
let abierto = false
watch(() => props.listo, async (ok) => {
  if (!ok || abierto) return
  abierto = true
  await nextTick()
  const imgs = [...document.querySelectorAll<HTMLImageElement>('.doc img')]
  await Promise.all(imgs.map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 4000) })))
  imprimir()
})
</script>

<style scoped>
.dt { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #0B1B33; color: #fff; font-family: 'Inter', system-ui, sans-serif; }
.dt-hint { flex: 1; font-size: 13px; color: rgba(255,255,255,0.75); text-align: center; }
.dt-btn { height: 38px; padding: 0 16px; border-radius: 9px; font-size: 13.5px; font-weight: 700; cursor: pointer; font-family: inherit; }
.dt-btn:disabled { opacity: .5; cursor: wait; }
.dt-primary { background: #1570EF; color: #fff; border: none; }
.dt-ghost { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.3); }
@media (max-width: 640px) { .dt-hint { display: none; } .dt { justify-content: space-between; } }
</style>

<style>
/* Vista de impresión (cotización y pedido): hoja carta sobre fondo gris; al imprimir solo queda el documento */
.pv { min-height: 100vh; background: #E9EDF3; }
.pv-sheet { max-width: 816px; margin: 24px auto 48px; background: #fff; box-shadow: 0 10px 40px rgba(11,27,51,0.15); border-radius: 4px; }
.pv-msg { text-align: center; padding: 60px 16px; font-family: 'Inter', system-ui, sans-serif; color: #5B6B82; }
@media (max-width: 860px) { .pv-sheet { margin: 12px; } }
@media print {
  @page { size: letter; margin: 12mm 12mm 14mm; }
  html, body, .pv { background: #fff !important; min-height: 0 !important; height: auto !important; }
  .no-print, .wa { display: none !important; }
  .pv-sheet { margin: 0 !important; box-shadow: none; max-width: none; border-radius: 0; }
}
</style>
