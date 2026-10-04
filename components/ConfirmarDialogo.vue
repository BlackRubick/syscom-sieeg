<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="estado.abierto" class="cf-backdrop" @click.self="responder(false)">
        <div class="cf-modal" role="alertdialog" aria-modal="true" aria-labelledby="cf-title" :aria-describedby="estado.mensaje ? 'cf-msg' : undefined" @keydown.esc="responder(false)">
          <h2 id="cf-title">{{ estado.titulo }}</h2>
          <p v-if="estado.mensaje" id="cf-msg">{{ estado.mensaje }}</p>
          <label v-if="estado.pedirMotivo" class="cf-motivo">
            <span>{{ estado.pedirMotivo }}</span>
            <textarea v-model="estado.motivo" rows="3" maxlength="300" />
          </label>
          <div class="cf-actions">
            <button ref="btnCancelar" type="button" class="cf-btn cf-ghost" @click="responder(false)">{{ estado.cancelar ?? 'Cancelar' }}</button>
            <button type="button" :class="['cf-btn', estado.peligro ? 'cf-danger' : 'cf-primary']" @click="responder(estado.pedirMotivo ? estado.motivo.trim() : true)">{{ estado.aceptar ?? 'Aceptar' }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/* Diálogo único de confirmación (lo abre useConfirmar). Va una sola vez en cada layout. */
const estado = useConfirmarEstado()
const btnCancelar = ref<HTMLButtonElement | null>(null)

watch(() => estado.value.abierto, (v) => { if (v) nextTick(() => btnCancelar.value?.focus()) })

function responder(v: boolean | string) {
  const r = estado.value.resolver
  estado.value = { ...estado.value, abierto: false, resolver: undefined }
  r?.(v)
}
</script>

<style scoped>
.cf-backdrop { position: fixed; inset: 0; z-index: 3000; background: rgba(11,27,51,0.45); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 16px; }
.cf-modal { width: 100%; max-width: 420px; background: #fff; border-radius: 18px; padding: 22px; box-shadow: 0 32px 80px rgba(11,27,51,0.22); font-family: 'Inter', system-ui, sans-serif; color: #0B1B33; }
.cf-modal h2 { margin: 0 0 8px; font-size: 17px; font-weight: 800; }
.cf-modal p { margin: 0 0 14px; font-size: 13.5px; color: #5B6B82; line-height: 1.55; white-space: pre-line; }
.cf-motivo { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; font-size: 12.5px; font-weight: 600; color: #5B6B82; }
.cf-motivo textarea { border: 1px solid #D5DEEA; border-radius: 10px; padding: 9px 11px; font-size: 13.5px; font-family: inherit; color: #0B1B33; resize: vertical; outline: none; }
.cf-motivo textarea:focus { border-color: #1570EF; }
.cf-actions { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }
.cf-btn { height: 40px; padding: 0 16px; border-radius: 10px; font-size: 13.5px; font-weight: 700; font-family: inherit; cursor: pointer; }
.cf-btn:focus-visible { outline: 2px solid #1570EF; outline-offset: 2px; }
.cf-ghost { background: #fff; color: #0B1B33; border: 1px solid #D5DEEA; }
.cf-primary { background: #1570EF; color: #fff; border: none; }
.cf-danger { background: #DC2626; color: #fff; border: none; }
</style>
