<template>
  <div :style="wrapStyle">
    <!-- Fondos -->
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(14,165,233,0.20) 0%,transparent 65%)" />
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 50% 40% at 100% 100%,rgba(124,58,237,0.15) 0%,transparent 60%)" />
    <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:50px 50px" />

    <!-- Card -->
    <div style="position:relative;z-index:10;width:100%;max-width:440px;margin:0 16px;">
      <!-- Borde degradado -->
      <div style="position:absolute;inset:-1px;border-radius:24px;background:linear-gradient(135deg,rgba(14,165,233,0.50) 0%,rgba(124,58,237,0.30) 60%,rgba(14,165,233,0.15) 100%);z-index:0;" />

      <div style="position:relative;z-index:1;border-radius:24px;background:linear-gradient(160deg,#0D1B35 0%,#09122A 100%);padding:40px 36px 36px;box-shadow:0 32px 80px rgba(0,0,0,0.7),inset 0 0 0 1px rgba(255,255,255,0.04);">
        <!-- Línea top -->
        <div style="position:absolute;top:0;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,rgba(14,165,233,0.8),transparent);border-radius:999px;" />

        <!-- Logo -->
        <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:32px;">
          <div style="font-weight:800;font-size:22px;color:#FFFFFF;letter-spacing:-0.5px;line-height:1;">SIEEG SYSCOM</div>
          <div style="font-size:11px;color:rgba(100,116,139,0.9);margin-top:5px;letter-spacing:1.5px;">PLATAFORMA EMPRESARIAL</div>
        </div>

        <!-- Título -->
        <div style="margin-bottom:24px;">
          <div style="font-size:22px;font-weight:700;color:#F1F5F9;margin-bottom:5px;">Bienvenido de vuelta</div>
          <div style="font-size:13px;color:rgba(100,116,139,0.9);">Ingresa tus credenciales para continuar</div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" style="display:flex;flex-direction:column;gap:16px;">
          <!-- Email -->
          <div>
            <label style="display:block;font-size:12px;font-weight:500;color:rgba(148,163,184,0.9);margin-bottom:7px;">Correo electrónico</label>
            <div :style="fieldWrap(emailFocus)">
              <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);width:15px;height:15px;flex-shrink:0;" :color="emailFocus?'#0EA5E9':'rgba(100,116,139,0.7)'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>
              </svg>
              <input v-model="email" type="email" placeholder="usuario@empresa.com" required
                @focus="emailFocus=true" @blur="emailFocus=false"
                style="width:100%;height:48px;background:transparent;border:none;outline:none;padding-left:40px;padding-right:16px;font-size:14px;color:#F1F5F9;box-sizing:border-box;" />
            </div>
          </div>

          <!-- Contraseña -->
          <div>
            <label style="display:block;font-size:12px;font-weight:500;color:rgba(148,163,184,0.9);margin-bottom:7px;">Contraseña</label>
            <div :style="fieldWrap(passFocus)">
              <svg style="position:absolute;left:14px;top:50%;transform:translateY(-50%);width:15px;height:15px;flex-shrink:0;" :color="passFocus?'#0EA5E9':'rgba(100,116,139,0.7)'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input v-model="password" :type="showPass?'text':'password'" placeholder="••••••••" required
                @focus="passFocus=true" @blur="passFocus=false"
                style="width:100%;height:48px;background:transparent;border:none;outline:none;padding-left:40px;padding-right:48px;font-size:14px;color:#F1F5F9;box-sizing:border-box;" />
              <button type="button" @click="showPass=!showPass"
                style="position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(100,116,139,0.7);display:flex;align-items:center;padding:4px;">
                <EyeOff v-if="showPass" :size="15" />
                <Eye v-else :size="15" />
              </button>
            </div>
          </div>

          <!-- Error -->
          <Transition name="fade">
            <div v-if="error" style="padding:10px 14px;border-radius:10px;background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.25);font-size:13px;color:#fb7185;">
              {{ error }}
            </div>
          </Transition>

          <!-- Botón -->
          <button type="submit" :disabled="loading"
            style="margin-top:4px;position:relative;width:100%;height:50px;border-radius:12px;border:none;background:linear-gradient(135deg,#0EA5E9 0%,#0284C7 100%);color:white;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;overflow:hidden;box-shadow:0 4px 24px rgba(14,165,233,0.40);font-family:inherit;cursor:pointer;"
            :style="{ opacity: loading ? 0.8 : 1, cursor: loading ? 'not-allowed' : 'pointer' }">
            <div v-if="loading" style="display:flex;align-items:center;gap:10px;">
              <svg class="spin" style="width:16px;height:16px;" fill="none" viewBox="0 0 24 24">
                <circle style="opacity:0.3" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
                <path style="opacity:0.9" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Verificando...
            </div>
            <div v-else style="display:flex;align-items:center;gap:8px;">
              Iniciar sesión <ArrowRight :size="15" :stroke-width="2.5" />
            </div>
          </button>
        </form>

        <!-- Footer -->
        <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.07);display:flex;justify-content:center;gap:20px;">
          <a v-for="t in ['Privacidad','Términos','Soporte']" :key="t" href="#" style="font-size:11px;color:rgba(71,85,105,0.9);">{{ t }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Eye, EyeOff, ArrowRight } from '@lucide/vue'

definePageMeta({ layout: 'auth' })

const auth   = useAuthStore()
const router = useRouter()

const email     = ref('')
const password  = ref('')
const showPass  = ref(false)
const loading   = ref(false)
const error     = ref('')
const emailFocus = ref(false)
const passFocus  = ref(false)

const wrapStyle = { minHeight:'100vh', background:'#040C1A', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', fontFamily:"'Inter',system-ui,sans-serif" }

function fieldWrap(focus: boolean) {
  return { position:'relative', borderRadius:'12px', background: focus ? 'rgba(14,165,233,0.07)' : 'rgba(255,255,255,0.04)', border:`1px solid ${focus ? 'rgba(14,165,233,0.55)' : 'rgba(255,255,255,0.12)'}`, transition:'all 0.2s ease', boxShadow: focus ? '0 0 0 3px rgba(14,165,233,0.08)' : 'none' }
}

async function handleLogin() {
  loading.value = true
  error.value   = ''
  try {
    const data = await $fetch<{ user: unknown }>('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    auth.setUser(data.user as never)
    router.push('/dashboard')
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message
    error.value = msg ?? 'Error al iniciar sesión'
    loading.value = false
  }
}
</script>
