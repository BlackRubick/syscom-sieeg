<template>
  <div class="ip">
    <div class="ip-head">
      <BadgePercent :size="16" />
      <span><b>Integrador</b> · descuento sobre el precio SYSCOM, después se suma el IVA</span>
    </div>
    <div class="ip-opts" role="radiogroup" aria-label="Descuento de integrador">
      <button v-for="o in opciones" :key="o.v" type="button" role="radio" :aria-checked="modelValue === o.v"
        :class="['ip-opt', { on: modelValue === o.v }]" @click="emit('update:modelValue', o.v)">{{ o.label }}</button>
    </div>
    <p v-if="otro" class="ip-note">Tiene {{ modelValue }}% de descuento personalizado; elige un nivel para cambiarlo.</p>
  </div>
</template>

<script setup lang="ts">
// Importación explícita: el auto-import de Nuxt no registra esIntegrador
import { esIntegrador, NIVELES_INTEGRADOR } from '~/utils/integrador'
import { BadgePercent } from '@lucide/vue'

/* Selector de nivel de integrador: sin descuento, 10, 20 o 30 %. */
const props = defineProps<{ modelValue: number }>()
const emit  = defineEmits<{ (e: 'update:modelValue', v: number): void }>()
const opciones = [{ v: 0, label: 'No' }, ...[...NIVELES_INTEGRADOR].reverse().map(v => ({ v, label: `${v}%` }))]
const otro = computed(() => props.modelValue > 0 && !esIntegrador(props.modelValue))
</script>

<style scoped>
.ip { display: flex; flex-direction: column; gap: 10px; padding: 12px; border-radius: 12px; border: 1px solid #D5DEEA; background: #F8FAFD; font-family: 'Inter', system-ui, sans-serif; }
.ip-head { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #33445C; }
.ip-head svg { color: #0B5BD3; flex-shrink: 0; }
.ip-opts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
.ip-opt { height: 36px; border-radius: 9px; border: 1px solid #D5DEEA; background: #fff; color: #33445C; font-size: 13px; font-weight: 700; font-family: inherit; cursor: pointer; }
.ip-opt.on { border-color: #1570EF; background: #1570EF; color: #fff; }
.ip-opt:focus-visible { outline: 2px solid #1570EF; outline-offset: 2px; }
.ip-note { margin: 0; font-size: 12px; color: #B45309; }
</style>
