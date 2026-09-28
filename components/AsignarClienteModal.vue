<template>
  <Teleport to="body">
    <div v-if="modelValue" class="ac-backdrop" @click.self="!guardando && cerrar()">
      <div class="ac-modal" role="dialog" aria-modal="true" aria-labelledby="ac-title">
        <h2 id="ac-title">{{ titulo }}</h2>
        <p class="ac-muted">{{ descripcion }}</p>
        <FilterCombo v-model="elegido" :options="opcionesSinActual" label="Cliente" buscar-al-escribir empty-label="Elegir…" count-label="pedido" placeholder="Buscar por nombre, empresa o número…" class="ac-combo" />
        <p v-if="error" class="ac-error">{{ error }}</p>
        <div class="ac-actions">
          <NuxtLink to="/clientes?nuevo=1" class="ac-link">+ Nuevo cliente</NuxtLink>
          <button type="button" class="ac-btn ac-ghost" :disabled="guardando" @click="cerrar">Cancelar</button>
          <button type="button" class="ac-btn ac-primary" :disabled="!elegido || guardando" @click="guardar">{{ guardando ? 'Asignando…' : 'Asignar' }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/* Elegir el cliente real de una cotización o pedido (p. ej. uno hecho a "Mostrador · Público en general"). */
const props = defineProps<{ modelValue: boolean; actual?: string; titulo: string; descripcion: string; asignar: (clientId: string) => Promise<void> }>()
const emit  = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const { opciones, cargar, clientes } = useClientes()
const elegido   = ref('')
const guardando = ref(false)
const error     = ref('')
const opcionesSinActual = computed(() => opciones.value.filter(o => o.value !== props.actual))

watch(() => props.modelValue, (v) => {
  if (!v) return
  elegido.value = ''; error.value = ''
  if (!clientes.value.length) cargar()
})

function cerrar() { emit('update:modelValue', false) }
async function guardar() {
  guardando.value = true; error.value = ''
  try { await props.asignar(elegido.value); cerrar() }
  catch (e: any) { error.value = e?.data?.message ?? 'No se pudo asignar' }
  finally { guardando.value = false }
}
</script>

<style scoped>
.ac-backdrop { position: fixed; inset: 0; z-index: 1100; background: rgba(11,27,51,0.45); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 16px; }
.ac-modal { width: 100%; max-width: 440px; background: #fff; border-radius: 20px; padding: 24px; box-shadow: 0 32px 80px rgba(11,27,51,0.2); font-family: 'Inter', system-ui, sans-serif; color: #0B1B33; }
.ac-modal h2 { margin: 0 0 6px; font-size: 18px; font-weight: 800; }
.ac-muted { margin: 0 0 16px; font-size: 13px; color: #5B6B82; line-height: 1.55; }
.ac-combo :deep(.fc-trigger) { width: 100%; max-width: none; }
.ac-error { margin: 12px 0 0; padding: 9px 11px; border-radius: 9px; background: #FEF2F2; color: #B91C1C; font-size: 12.5px; }
.ac-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-wrap: wrap; margin-top: 18px; }
.ac-link { margin-right: auto; font-size: 12.5px; font-weight: 600; color: #0B5BD3; }
.ac-btn { height: 38px; padding: 0 16px; border-radius: 10px; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
.ac-btn:disabled { opacity: .55; cursor: not-allowed; }
.ac-primary { background: #1570EF; color: #fff; border: none; }
.ac-ghost { background: #fff; color: #0B1B33; border: 1px solid #D5DEEA; }
</style>
