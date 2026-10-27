<template>
  <div v-if="meta" :class="['im', { ok: meta.cumplida, compacto }]">
    <div class="im-head">
      <component :is="meta.cumplida ? BadgeCheck : Target" :size="16" />
      <span v-if="meta.cumplida"><b>¡Descuento del {{ meta.nivel }}% asegurado este mes!</b></span>
      <span v-else>{{ deCliente ? 'Realice' : 'Realiza' }} una compra de <b>{{ mxn(meta.falta) }}</b> y {{ deCliente ? 'obtenga' : 'obtén' }} <template v-if="meta.nivel >= 25">el mayor descuento (<b>{{ meta.nivel }}%</b>)</template><template v-else>{{ deCliente ? 'su' : 'tu' }} <b>{{ meta.nivel }}%</b> de descuento</template></span>
    </div>
    <div class="im-bar" role="progressbar" :aria-valuenow="meta.avance" aria-valuemin="0" aria-valuemax="100">
      <div class="im-fill" :style="{ width: `${meta.avance}%` }" />
    </div>
    <div class="im-foot">
      <span>Compras acumuladas del mes: {{ mxn(meta.comprado) }} de {{ mxn(meta.minimo) }}</span>
      <span v-if="dias !== null">{{ dias === 1 ? 'Queda 1 día' : `Quedan ${dias} días` }}</span>
    </div>
    <p v-if="!compacto && !meta.cumplida && meta.bajaA < meta.nivel" class="im-note">Si no {{ deCliente ? 'llega' : 'llegas' }} al mínimo, el 1 del próximo mes {{ deCliente ? 'su' : 'tu' }} descuento baja a {{ meta.bajaA }}%.</p>
    <p v-if="meta.sube && meta.sube.falta > 0" class="im-note sube">Con {{ mxn(meta.sube.falta) }} más este mes {{ deCliente ? 'sube' : 'subes' }} a <b>{{ meta.sube.nivel }}%</b>.</p>
  </div>
</template>

<script setup lang="ts">
import { BadgeCheck, Target } from '@lucide/vue'
import type { MetaMensual } from '~/utils/integrador'

/* Contador de compra mínima mensual del integrador (25 % → $5,000 · 20 % → $2,800 · 10 % → $1,000). */
const props = defineProps<{ meta: MetaMensual | null; finMes?: string; compacto?: boolean; deCliente?: boolean }>()
const dias = computed(() => props.finMes ? Math.max(1, Math.ceil((new Date(props.finMes).getTime() - Date.now()) / 86_400_000)) : null)
const mxn = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
</script>

<style scoped>
.im { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 12px; border: 1px solid #F5D9A8; background: #FFFAF0; font-family: 'Inter', system-ui, sans-serif; }
.im.ok { border-color: #BBE5C8; background: #F1FBF4; }
.im-head { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #33445C; }
.im-head svg { color: #B45309; flex-shrink: 0; }
.im.ok .im-head svg { color: #16A34A; }
.im-bar { height: 8px; border-radius: 99px; background: rgba(11,27,51,0.08); overflow: hidden; }
.im-fill { height: 100%; border-radius: 99px; background: #F59E0B; transition: width .4s ease; }
.im.ok .im-fill { background: #16A34A; }
.im-foot { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; font-size: 11.5px; color: #5B6B82; }
.im-note { margin: 0; font-size: 12px; color: #92400E; }
.im-note.sube { color: #0B5BD3; }
.im.compacto { padding: 8px 10px; gap: 6px; }
.im.compacto .im-head { font-size: 12px; }
</style>
