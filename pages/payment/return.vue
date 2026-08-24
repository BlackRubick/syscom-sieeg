<template>
  <div style="font-family:'Inter',system-ui,sans-serif;min-height:80vh;display:flex;align-items:center;justify-content:center;padding:24px;">

    <!-- Cargando -->
    <div v-if="status === 'loading'" style="display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center;">
      <div style="width:56px;height:56px;border-radius:50%;border:3px solid rgba(14,165,233,0.15);border-top-color:#0EA5E9;animation:spin 0.8s linear infinite;"></div>
      <div style="font-size:15px;font-weight:600;color:#94a3b8;">Verificando tu pago…</div>
    </div>

    <!-- Éxito -->
    <div v-else-if="status === 'success'" style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;">
      <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#10B981,#34D399);display:flex;align-items:center;justify-content:center;margin-bottom:16px;box-shadow:0 0 40px rgba(16,185,129,0.3);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style="font-size:22px;font-weight:800;color:#F1F5F9;margin-bottom:8px;">¡Transacción exitosa!</div>
      <div style="font-size:14px;color:#34d399;font-weight:600;margin-bottom:6px;">Recibimos tu pago. ¡Gracias por tu compra!</div>
      <div style="font-size:12px;color:rgba(100,116,139,0.75);max-width:300px;line-height:1.6;margin-bottom:6px;">El administrador procesará tu pedido a la brevedad.</div>
      <div v-if="authorization" style="font-size:11px;font-family:monospace;color:rgba(100,116,139,0.45);margin-bottom:22px;">Autorización: {{ authorization }}</div>
      <a href="/orders" style="height:42px;padding:0 24px;border-radius:11px;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;box-shadow:0 4px 16px rgba(14,165,233,0.3);">
        Ver mis órdenes
      </a>
    </div>

    <!-- Error / fallida -->
    <div v-else-if="status === 'failed'" style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;">
      <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#ef4444,#f87171);display:flex;align-items:center;justify-content:center;margin-bottom:16px;box-shadow:0 0 40px rgba(239,68,68,0.3);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <div style="font-size:22px;font-weight:800;color:#F1F5F9;margin-bottom:8px;">Pago no realizado</div>
      <div style="font-size:14px;color:#fb7185;font-weight:600;margin-bottom:6px;">Tu pago no pudo ser realizado, intenta de nuevo.</div>
      <div v-if="errorMsg" style="font-size:12px;color:rgba(100,116,139,0.65);max-width:300px;line-height:1.6;margin-bottom:22px;">{{ errorMsg }}</div>
      <a href="/cart" style="height:42px;padding:0 24px;border-radius:11px;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;box-shadow:0 4px 16px rgba(14,165,233,0.3);">
        Volver al carrito
      </a>
    </div>

    <!-- Sin parámetros / error inesperado -->
    <div v-else style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;">
      <div style="font-size:18px;font-weight:700;color:#E2E8F0;margin-bottom:6px;">No se encontró información del pago</div>
      <div style="font-size:13px;color:rgba(100,116,139,0.65);margin-bottom:22px;">Si realizaste un pago, revisa el estado de tu orden.</div>
      <a href="/orders" style="height:42px;padding:0 24px;border-radius:11px;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;">
        Ver mis órdenes
      </a>
    </div>

  </div>
</template>

<style>
@keyframes spin { to { transform: rotate(360deg) } }
</style>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route       = useRoute()
const status      = ref<'loading' | 'success' | 'failed' | 'unknown'>('loading')
const authorization = ref('')
const errorMsg    = ref('')

onMounted(async () => {
  const chargeId = route.query.id as string | undefined
  if (!chargeId) { status.value = 'unknown'; return }

  try {
    const result = await $fetch<any>('/api/payments/verify', { query: { id: chargeId } })
    if (result.paymentStatus === 'paid') {
      authorization.value = result.authorization ?? ''
      status.value = 'success'
    } else if (result.paymentStatus === 'failed') {
      errorMsg.value = 'Ocurrió un error, intenta de nuevo o comunícate con tu banco.'
      status.value = 'failed'
    } else {
      errorMsg.value = 'El pago quedó en estado pendiente. Si se realizó el cobro, contacta soporte.'
      status.value = 'failed'
    }
  } catch {
    errorMsg.value = 'No se pudo verificar el estado del pago.'
    status.value = 'failed'
  }
})
</script>
