<template>
  <div style="min-height:100vh;background:#040C1A;font-family:'Inter',system-ui,sans-serif;color:#F1F5F9;overflow-x:hidden;">

    <!-- Fondo -->
    <div style="position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 60% 40% at 10% 0%,rgba(14,165,233,0.05) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 90% 100%,rgba(124,58,237,0.04) 0%,transparent 60%)" />

    <!-- NAVBAR -->
    <nav style="position:sticky;top:0;z-index:100;height:64px;display:flex;align-items:center;background:rgba(4,12,26,0.88);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.06);padding:0 24px;">
      <div style="width:100%;max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;">
        <NuxtLink to="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
          <img src="/logosieeg.jpg" alt="SIEEG" style="height:28px;width:28px;object-fit:contain;border-radius:6px;" />
          <span style="font-size:15px;font-weight:700;color:#F1F5F9;letter-spacing:-0.3px;">SIEEG <span style="color:#0EA5E9;">INTEGRADORES</span></span>
        </NuxtLink>
        <NuxtLink to="/" style="display:flex;align-items:center;gap:6px;font-size:13px;color:rgba(148,163,184,0.75);text-decoration:none;transition:color 0.2s;"
          @mouseenter="e => (e.currentTarget as HTMLElement).style.color='#F1F5F9'"
          @mouseleave="e => (e.currentTarget as HTMLElement).style.color='rgba(148,163,184,0.75)'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Volver al inicio
        </NuxtLink>
      </div>
    </nav>

    <!-- CONTENIDO -->
    <main style="position:relative;z-index:1;max-width:800px;margin:0 auto;padding:64px 24px 100px;">

      <!-- Encabezado -->
      <div style="margin-bottom:48px;">
        <div style="font-size:12px;font-weight:600;color:#38bdf8;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;">Legal</div>
        <h1 style="font-size:clamp(28px,4vw,42px);font-weight:800;color:#F1F5F9;letter-spacing:-1px;margin-bottom:14px;">Políticas de Privacidad</h1>
        <p style="font-size:14px;color:rgba(100,116,139,0.8);">Última actualización: próximamente</p>
      </div>

      <!-- Divisor -->
      <div style="height:1px;background:linear-gradient(90deg,rgba(14,165,233,0.3),rgba(124,58,237,0.2),transparent);margin-bottom:48px;" />

      <!-- Contenido vacío -->
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:80px 0;text-align:center;">
        <div style="width:56px;height:56px;border-radius:14px;background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.18);display:flex;align-items:center;justify-content:center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <p style="font-size:14px;color:rgba(100,116,139,0.7);max-width:360px;line-height:1.7;">
          El contenido de esta sección estará disponible próximamente.
        </p>
      </div>

    </main>

    <!-- FOOTER -->
    <footer style="border-top:1px solid rgba(255,255,255,0.06);padding:28px 24px;">
      <div style="max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
        <span style="font-size:12px;color:rgba(71,85,105,0.6);">© {{ new Date().getFullYear() }} SIEEG INTEGRADORES. Todos los derechos reservados.</span>
        <div style="display:flex;gap:16px;">
          <NuxtLink to="/terminos" style="font-size:12px;color:rgba(71,85,105,0.7);text-decoration:none;transition:color 0.2s;"
            @mouseenter="e => (e.currentTarget as HTMLElement).style.color='rgba(148,163,184,0.9)'"
            @mouseleave="e => (e.currentTarget as HTMLElement).style.color='rgba(71,85,105,0.7)'">
            Términos y Condiciones
          </NuxtLink>
          <NuxtLink to="/privacidad" style="font-size:12px;color:#a78bfa;text-decoration:none;">Políticas de Privacidad</NuxtLink>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'landing' })
</script>
