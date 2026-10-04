<template>
  <div class="rs">
    <div class="rs-card">
      <NuxtLink to="/" class="rs-logo" aria-label="SIEEG Integradores — inicio"><img src="/logosieeg.jpg" alt="SIEEG" /></NuxtLink>

      <!-- Con liga: crear contraseña -->
      <template v-if="token">
        <p v-if="validando" class="rs-muted">Revisando la liga…</p>
        <template v-else-if="ligaError">
          <h1>La liga ya no es válida</h1>
          <p class="rs-muted">{{ ligaError }}</p>
          <NuxtLink to="/restablecer" class="rs-btn">Pedir una liga nueva</NuxtLink>
        </template>
        <template v-else-if="listo">
          <h1>¡Listo!</h1>
          <p class="rs-muted">Tu contraseña quedó guardada. Ya puedes entrar con <b>{{ cuenta?.email }}</b>.</p>
          <NuxtLink to="/login" class="rs-btn">Iniciar sesión</NuxtLink>
        </template>
        <form v-else class="rs-form" @submit.prevent="guardar">
          <h1>Crea tu contraseña</h1>
          <p class="rs-muted">Hola {{ cuenta?.nombre }}. Usuario: <b>{{ cuenta?.email }}</b></p>
          <label>Nueva contraseña<input v-model="pw" type="password" autocomplete="new-password" minlength="8" required placeholder="Mínimo 8 caracteres" /></label>
          <label>Confírmala<input v-model="pw2" type="password" autocomplete="new-password" minlength="8" required placeholder="Repítela" /></label>
          <p v-if="error" class="rs-error" role="alert">{{ error }}</p>
          <button type="submit" class="rs-btn" :disabled="enviando">{{ enviando ? 'Guardando…' : 'Guardar contraseña' }}</button>
        </form>
      </template>

      <!-- Sin liga: pedirla por correo -->
      <template v-else>
        <template v-if="enviado">
          <h1>Revisa tu correo</h1>
          <p class="rs-muted">Si <b>{{ email }}</b> tiene una cuenta activa, te enviamos una liga para restablecer tu contraseña. Vence en 1 hora. Revisa también la carpeta de spam.</p>
          <NuxtLink to="/login" class="rs-btn rs-btn-ghost">Volver a iniciar sesión</NuxtLink>
        </template>
        <form v-else class="rs-form" @submit.prevent="pedir">
          <h1>¿Olvidaste tu contraseña?</h1>
          <p class="rs-muted">Escribe el correo con el que entras y te mandamos una liga para crear una nueva.</p>
          <label>Correo electrónico<input v-model="email" type="email" autocomplete="email" required placeholder="usuario@empresa.com" /></label>
          <p v-if="error" class="rs-error" role="alert">{{ error }}</p>
          <button type="submit" class="rs-btn" :disabled="enviando">{{ enviando ? 'Enviando…' : 'Enviarme la liga' }}</button>
          <NuxtLink to="/login" class="rs-link">Volver a iniciar sesión</NuxtLink>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
/* Restablecer contraseña: pedir la liga por correo o, con la liga, crear la contraseña nueva. */
definePageMeta({ layout: 'auth' })
useHead({ title: 'Restablecer contraseña — SIEEG' })

const route = useRoute()
const token = computed(() => typeof route.query.token === 'string' ? route.query.token : '')

const email    = ref('')
const pw       = ref('')
const pw2      = ref('')
const error    = ref('')
const enviando = ref(false)
const enviado  = ref(false)
const listo    = ref(false)
const validando = ref(false)
const ligaError = ref('')
const cuenta    = ref<{ nombre: string; email: string } | null>(null)

onMounted(async () => {
  if (!token.value) return
  validando.value = true
  try { cuenta.value = await $fetch<{ nombre: string; email: string }>(`/api/auth/reset?token=${encodeURIComponent(token.value)}`) }
  catch (e: any) { ligaError.value = e?.data?.message ?? 'La liga ya no es válida.' }
  finally { validando.value = false }
})

async function pedir() {
  enviando.value = true; error.value = ''
  try { await $fetch('/api/auth/forgot', { method: 'POST', body: { email: email.value } }); enviado.value = true }
  catch (e: any) { error.value = e?.data?.message ?? 'No se pudo enviar. Intenta de nuevo.' }
  finally { enviando.value = false }
}

async function guardar() {
  error.value = ''
  if (pw.value.length < 8) { error.value = 'La contraseña debe tener al menos 8 caracteres'; return }
  if (pw.value !== pw2.value) { error.value = 'Las contraseñas no coinciden'; return }
  enviando.value = true
  try { await $fetch('/api/auth/reset', { method: 'POST', body: { token: token.value, password: pw.value } }); listo.value = true }
  catch (e: any) { error.value = e?.data?.message ?? 'No se pudo guardar la contraseña' }
  finally { enviando.value = false }
}
</script>

<style scoped>
.rs { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px 16px; background: #F5F8FC; font-family: 'Inter', system-ui, sans-serif; color: #0B1B33; }
.rs-card { width: 100%; max-width: 420px; background: #fff; border: 1px solid #E4E9F1; border-radius: 20px; padding: 32px 28px; box-shadow: 0 24px 60px rgba(11,27,51,0.12); display: flex; flex-direction: column; gap: 14px; }
.rs-logo { align-self: center; }
.rs-logo img { height: 64px; }
.rs h1 { margin: 0; font-size: 21px; font-weight: 800; }
.rs-muted { margin: 0; font-size: 13.5px; color: #5B6B82; line-height: 1.55; }
.rs-form { display: flex; flex-direction: column; gap: 14px; }
.rs-form label { display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; font-weight: 600; color: #5B6B82; }
.rs-form input { height: 46px; padding: 0 14px; border-radius: 12px; border: 1px solid #D5DEEA; background: #F8FAFD; font-size: 14px; font-family: inherit; color: #0B1B33; outline: none; }
.rs-form input:focus { border-color: #1570EF; background: #fff; box-shadow: 0 0 0 3px rgba(21,112,239,0.1); }
.rs-btn { height: 46px; border-radius: 12px; border: none; background: #1570EF; color: #fff; font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; text-decoration: none; }
.rs-btn:hover:not(:disabled) { background: #0B5BD3; }
.rs-btn:disabled { opacity: .6; cursor: not-allowed; }
.rs-btn-ghost { background: #fff; color: #0B1B33; border: 1px solid #D5DEEA; }
.rs-link { align-self: center; font-size: 13px; color: #0B5BD3; font-weight: 600; }
.rs-error { margin: 0; padding: 10px 12px; border-radius: 10px; background: #FEF2F2; color: #B91C1C; font-size: 13px; }
</style>
