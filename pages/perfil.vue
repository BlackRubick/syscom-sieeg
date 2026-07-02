<template>
  <div :style="{ fontFamily:`'Inter',system-ui,sans-serif`, maxWidth:'860px', margin:'0 auto' }">

    <!-- ══ HERO ══ -->
    <div style="position:relative;border-radius:20px;overflow:hidden;margin-bottom:20px;box-shadow:0 8px 32px rgba(0,0,0,0.4);">
      <!-- Fondo con gradiente dinámico según avatar -->
      <div :style="{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${avatarColors[0]}22 0%, ${avatarColors[1]}18 50%, rgba(9,18,40,0.95) 100%)`, zIndex:0 }" />
      <div style="position:absolute;inset:0;background:linear-gradient(160deg,#0D1B35,#091228);z-index:0;opacity:0.7;" />
      <!-- Línea superior decorativa -->
      <div :style="{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg, transparent, ${avatarColors[0]}, ${avatarColors[1]}, transparent)`, zIndex:2 }" />
      <!-- Círculos decorativos -->
      <div :style="{ position:'absolute', top:'-40px', right:'-40px', width:'200px', height:'200px', borderRadius:'50%', background:`radial-gradient(circle, ${avatarColors[0]}18, transparent 70%)`, zIndex:1 }" />
      <div :style="{ position:'absolute', bottom:'-20px', left:'20%', width:'150px', height:'150px', borderRadius:'50%', background:`radial-gradient(circle, ${avatarColors[1]}12, transparent 70%)`, zIndex:1 }" />

      <div style="position:relative;z-index:2;padding:32px 32px 28px;display:flex;align-items:flex-end;gap:24px;flex-wrap:wrap;">
        <!-- Avatar grande -->
        <div style="position:relative;flex-shrink:0;">
          <div :style="{ width:'80px', height:'80px', borderRadius:'22px', background:`linear-gradient(135deg,${avatarColors[0]},${avatarColors[1]})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', fontWeight:800, color:'white', boxShadow:`0 8px 24px ${avatarColors[0]}55, 0 0 0 3px rgba(255,255,255,0.06)` }">
            {{ initials }}
          </div>
          <!-- Indicador de estado -->
          <div :style="{ position:'absolute', bottom:'-3px', right:'-3px', width:'18px', height:'18px', borderRadius:'50%', background: auth.user?.status==='active' ? '#10b981':'#f43f5e', border:'2px solid #091228', boxShadow:`0 0 8px ${auth.user?.status==='active'?'#10b981':'#f43f5e'}99` }" />
        </div>

        <!-- Nombre y datos -->
        <div style="flex:1;min-width:0;">
          <div style="font-size:24px;font-weight:800;color:#F1F5F9;letter-spacing:-0.5px;line-height:1.1;">{{ auth.user?.name }}</div>
          <div style="font-size:13px;color:rgba(148,163,184,0.75);margin-top:5px;display:flex;align-items:center;gap:6px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            {{ auth.user?.email }}
          </div>
          <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <span :style="{ ...roleBadgeStyle, padding:'4px 12px', fontSize:'11px' }">{{ roleLabel }}</span>
            <span :style="{ fontSize:'11px', fontWeight:600, padding:'4px 12px', borderRadius:'20px', background: auth.user?.status==='active'?'rgba(16,185,129,0.15)':'rgba(244,63,94,0.15)', color: auth.user?.status==='active'?'#34d399':'#fb7185', border:`1px solid ${auth.user?.status==='active'?'rgba(16,185,129,0.25)':'rgba(244,63,94,0.25)'}`, display:'flex', alignItems:'center', gap:'5px' }">
              <span :style="{ width:'5px', height:'5px', borderRadius:'50%', background: auth.user?.status==='active'?'#10b981':'#f43f5e', display:'inline-block' }" />
              {{ auth.user?.status === 'active' ? 'Activo' : 'Inactivo' }}
            </span>
            <!-- #5 — Cambiar contraseña -->
            <button @click="pwOpen=true" style="height:26px;padding:0 10px;border-radius:20px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(148,163,184,0.8);font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:5px;">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Cambiar contraseña
            </button>
          </div>
        </div>

        <!-- Estadísticas rápidas -->
        <div style="display:flex;gap:2px;background:rgba(0,0,0,0.25);border-radius:14px;border:1px solid rgba(255,255,255,0.07);overflow:hidden;flex-shrink:0;">
          <div v-for="(stat, i) in quickStats" :key="stat.label"
            :style="{ padding:'12px 18px', textAlign:'center', borderRight: i < quickStats.length-1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }">
            <div style="font-size:13px;font-weight:700;color:#E2E8F0;white-space:nowrap;">{{ stat.value }}</div>
            <div style="font-size:10px;color:rgba(100,116,139,0.7);margin-top:2px;white-space:nowrap;">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ GRID PRINCIPAL ══ -->
    <div style="display:grid;grid-template-columns:1fr 2fr;gap:16px;align-items:start;">

      <!-- Columna izquierda: resumen fiscal -->
      <div style="display:flex;flex-direction:column;gap:16px;">

        <!-- Estado fiscal -->
        <div style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:20px;text-align:center;">
          <div :style="{ width:'52px', height:'52px', borderRadius:'16px', margin:'0 auto 12px', display:'flex', alignItems:'center', justifyContent:'center', background: auth.user?.fiscalCompleted ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.1)', border: `1px solid ${auth.user?.fiscalCompleted ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.2)'}` }">
            <svg v-if="auth.user?.fiscalCompleted" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <div style="font-size:14px;font-weight:700;color:#E2E8F0;margin-bottom:4px;">
            {{ auth.user?.fiscalCompleted ? 'Datos completos' : 'Datos pendientes' }}
          </div>
          <div style="font-size:12px;color:rgba(100,116,139,0.7);line-height:1.5;margin-bottom:16px;">
            {{ auth.user?.fiscalCompleted ? 'Tu información fiscal está lista para facturación.' : 'Completa tu información fiscal para recibir CFDI.' }}
          </div>
          <button @click="showModal=true"
            :style="{ width:'100%', height:'38px', borderRadius:'10px', border:'none', background: auth.user?.fiscalCompleted ? 'rgba(14,165,233,0.1)' : 'linear-gradient(135deg,#F59E0B,#D97706)', color: auth.user?.fiscalCompleted ? '#38bdf8' : 'white', fontSize:'12px', fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', border: auth.user?.fiscalCompleted ? '1px solid rgba(14,165,233,0.2)' : 'none' }">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" :stroke="auth.user?.fiscalCompleted?'#38bdf8':'white'" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            {{ auth.user?.fiscalCompleted ? 'Actualizar datos' : 'Completar ahora' }}
          </button>
        </div>

        <!-- RFC chip (solo si tiene datos) -->
        <div v-if="auth.user?.fiscalRfc" style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:18px;">
          <div style="font-size:10px;font-weight:700;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">RFC</div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <span style="font-size:15px;font-weight:700;color:#38bdf8;font-family:monospace;letter-spacing:1px;">{{ auth.user.fiscalRfc }}</span>
            <button @click="copyRFC" :title="copied?'¡Copiado!':'Copiar RFC'"
              :style="{ width:'30px', height:'30px', borderRadius:'8px', border:'none', background: copied?'rgba(16,185,129,0.15)':'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, transition:'all 0.2s' }">
              <svg v-if="!copied" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          </div>
          <div v-if="auth.user.fiscalRazonSocial" style="font-size:11px;color:rgba(100,116,139,0.6);margin-top:8px;line-height:1.4;">{{ auth.user.fiscalRazonSocial }}</div>
        </div>

        <!-- Régimen fiscal chip -->
        <div v-if="auth.user?.fiscalRegimen" style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:18px;">
          <div style="font-size:10px;font-weight:700;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Régimen Fiscal</div>
          <span style="font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px;background:rgba(99,102,241,0.12);color:#a5b4fc;display:inline-block;margin-bottom:6px;">{{ auth.user.fiscalRegimen }}</span>
          <div style="font-size:12px;color:rgba(148,163,184,0.75);line-height:1.4;">{{ regimenNombre(auth.user.fiscalRegimen) }}</div>
        </div>

      </div>

      <!-- Columna derecha: datos completos -->
      <div style="display:flex;flex-direction:column;gap:16px;">

        <!-- Sin datos fiscal -->
        <div v-if="!auth.user?.fiscalCompleted" style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(245,158,11,0.2);overflow:hidden;">
          <div style="padding:32px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px;">
            <div style="width:64px;height:64px;border-radius:20px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);display:flex;align-items:center;justify-content:center;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 10h8"/><path d="M8 14h5"/><path d="M8 6h8"/></svg>
            </div>
            <div>
              <div style="font-size:15px;font-weight:700;color:#fcd34d;margin-bottom:6px;">Sin datos fiscales registrados</div>
              <div style="font-size:13px;color:rgba(100,116,139,0.75);line-height:1.6;max-width:320px;margin:0 auto;">
                Para poder recibir facturas electrónicas (CFDI), necesitas registrar tu información fiscal ante el SAT.
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;width:100%;max-width:280px;">
              <div v-for="item in pendingItems" :key="item" style="display:flex;align-items:center;gap:8px;text-align:left;">
                <div style="width:18px;height:18px;border-radius:50%;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                </div>
                <span style="font-size:12px;color:rgba(148,163,184,0.7);">{{ item }}</span>
              </div>
            </div>
            <button @click="showModal=true"
              style="height:40px;padding:0 28px;border-radius:10px;border:none;background:linear-gradient(135deg,#F59E0B,#D97706);color:white;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px rgba(245,158,11,0.3);">
              Registrar datos fiscales
            </button>
          </div>
        </div>

        <!-- Con datos fiscales -->
        <template v-else>

          <!-- Datos fiscales principales -->
          <div style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
            <div style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:8px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 10h8"/><path d="M8 14h5"/><path d="M8 6h8"/></svg>
              <span style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;">Datos fiscales</span>
            </div>
            <div style="padding:18px 20px;display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <FiscalFieldItem label="Razón Social" :value="auth.user.fiscalRazonSocial" full />
              <FiscalFieldItem label="Código Postal" :value="auth.user.fiscalCodpos" />
              <FiscalFieldItem label="País" :value="auth.user.fiscalPais" />
              <FiscalFieldItem label="Email fiscal" :value="auth.user.fiscalEmail" full />
              <FiscalFieldItem v-if="auth.user.fiscalUsocfdi" label="Uso de CFDI" :value="`${auth.user.fiscalUsocfdi} – ${cfdiNombre(auth.user.fiscalUsocfdi)}`" full />
            </div>
          </div>

          <!-- Domicilio fiscal -->
          <div v-if="hasDomicilio" style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
            <div style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:8px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;">Domicilio fiscal</span>
            </div>
            <div style="padding:18px 20px;">
              <!-- Dirección formateada -->
              <div v-if="direccionFormateada" style="font-size:13px;color:#CBD5E1;line-height:1.7;margin-bottom:14px;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
                {{ direccionFormateada }}
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                <FiscalFieldItem v-if="auth.user.fiscalNumExt" label="Núm. exterior" :value="auth.user.fiscalNumExt" />
                <FiscalFieldItem v-if="auth.user.fiscalNumInt" label="Núm. interior" :value="auth.user.fiscalNumInt" />
                <FiscalFieldItem v-if="auth.user.fiscalLocalidad" label="Localidad" :value="auth.user.fiscalLocalidad" />
                <FiscalFieldItem v-if="auth.user.fiscalDelegacion" label="Delegación / Municipio" :value="auth.user.fiscalDelegacion" />
              </div>
            </div>
          </div>

          <!-- Contacto adicional -->
          <div v-if="hasContacto" style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
            <div style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:8px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5a19.36 19.36 0 0 1-3-8.59A2 2 0 0 1 3.64 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;">Contacto adicional</span>
            </div>
            <div style="padding:18px 20px;display:grid;grid-template-columns:1fr 1fr;gap:14px;">
              <FiscalFieldItem v-if="auth.user.fiscalNombre || auth.user.fiscalApellidos" label="Nombre completo" :value="`${auth.user.fiscalNombre??''} ${auth.user.fiscalApellidos??''}`.trim()" full />
              <FiscalFieldItem v-if="auth.user.fiscalTelefono" label="Teléfono" :value="auth.user.fiscalTelefono" />
              <FiscalFieldItem v-if="auth.user.fiscalNumregidtrib" label="Núm. Reg. ID Tributario" :value="auth.user.fiscalNumregidtrib" />
            </div>
          </div>

        </template>
      </div>
    </div>
  </div>

  <FiscalDataModal v-model="showModal" />

  <!-- #5 — Cambio de contraseña -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="pwOpen" style="position:fixed;inset:0;background:rgba(2,6,14,0.8);backdrop-filter:blur(6px);z-index:1040;" @click.self="closePw" />
    </Transition>
    <Transition name="modal">
      <div v-if="pwOpen" style="position:fixed;inset:0;z-index:1041;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div style="width:100%;max-width:420px;border-radius:20px;background:linear-gradient(160deg,#0D1B35,#09122A);border:1px solid rgba(255,255,255,0.1);box-shadow:0 32px 80px rgba(0,0,0,0.7);overflow:hidden;">
          <div style="padding:20px 22px;border-bottom:1px solid rgba(255,255,255,0.07);">
            <div style="font-size:16px;font-weight:800;color:#F1F5F9;">Cambiar contraseña</div>
          </div>
          <div style="padding:20px 22px;display:flex;flex-direction:column;gap:14px;">
            <div v-if="pwError" style="padding:9px 12px;border-radius:8px;background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.2);font-size:12px;color:#fb7185;">{{ pwError }}</div>
            <div v-if="pwSuccess" style="padding:9px 12px;border-radius:8px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);font-size:12px;color:#34d399;">{{ pwSuccess }}</div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <label style="font-size:11px;font-weight:600;color:rgba(100,116,139,0.8);">Contraseña actual</label>
              <input v-model="pwCurrent" type="password" placeholder="••••••••"
                style="height:38px;border-radius:9px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#E2E8F0;font-size:13px;padding:0 12px;outline:none;font-family:inherit;" />
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <label style="font-size:11px;font-weight:600;color:rgba(100,116,139,0.8);">Nueva contraseña</label>
              <input v-model="pwNew" type="password" placeholder="Mínimo 8 caracteres"
                style="height:38px;border-radius:9px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#E2E8F0;font-size:13px;padding:0 12px;outline:none;font-family:inherit;" />
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <label style="font-size:11px;font-weight:600;color:rgba(100,116,139,0.8);">Confirmar nueva contraseña</label>
              <input v-model="pwConfirm" type="password" placeholder="Repetir contraseña"
                style="height:38px;border-radius:9px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#E2E8F0;font-size:13px;padding:0 12px;outline:none;font-family:inherit;" />
            </div>
            <div style="display:flex;gap:10px;margin-top:4px;">
              <button @click="closePw" style="flex:1;height:38px;border-radius:9px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#94a3b8;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">Cancelar</button>
              <button @click="submitPw" :disabled="pwLoading" style="flex:2;height:38px;border-radius:9px;border:none;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;"
                :style="{ opacity: pwLoading ? 0.6 : 1, cursor: pwLoading ? 'not-allowed' : 'pointer' }">
                {{ pwLoading ? 'Guardando…' : 'Cambiar contraseña' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth      = useAuthStore()
const showModal = ref(false)
const copied    = ref(false)

const palette = [['#0EA5E9','#22D3EE'],['#7C3AED','#A78BFA'],['#10B981','#34D399'],['#F59E0B','#FCD34D'],['#F43F5E','#FB7185'],['#6366F1','#818CF8']]
const avatarColors = computed(() => palette[(auth.user?.name ?? '').charCodeAt(0) % palette.length])

const initials = computed(() =>
  (auth.user?.name ?? '').split(' ').slice(0, 2).map((n: string) => n[0]).join('')
)

const roleMap: Record<string, { label: string; color: string; bg: string; border: string }> = {
  admin:    { label: 'Admin',     color: '#a78bfa', bg: 'rgba(124,58,237,0.12)',  border: 'rgba(124,58,237,0.25)' },
  approver: { label: 'Aprobador', color: '#fbbf24', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)' },
  buyer:    { label: 'Comprador', color: '#38bdf8', bg: 'rgba(14,165,233,0.12)',  border: 'rgba(14,165,233,0.25)' },
  viewer:   { label: 'Visor',     color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.2)' },
}
const roleLabel    = computed(() => roleMap[auth.user?.role ?? '']?.label ?? auth.user?.role ?? '')
const roleBadgeStyle = computed(() => {
  const cfg = roleMap[auth.user?.role ?? ''] ?? roleMap.viewer
  return { fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }
})

const formatDate = (d?: string) => d ? new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d)) : '—'

const quickStats = computed(() => [
  { label: 'Miembro desde', value: formatDate(auth.user?.createdAt) },
  { label: 'Último acceso', value: auth.user?.lastLogin ? formatDate(auth.user.lastLogin) : 'Hoy' },
  { label: 'Facturas',      value: auth.user?.fiscalCompleted ? 'Activo' : 'Pendiente' },
])

const pendingItems = ['RFC y razón social', 'Régimen fiscal', 'Código postal y país', 'Email para facturas']

const hasDomicilio = computed(() => {
  const u = auth.user
  return u && (u.fiscalCalle || u.fiscalColonia || u.fiscalCiudad || u.fiscalEstado)
})
const hasContacto = computed(() => {
  const u = auth.user
  return u && (u.fiscalNombre || u.fiscalApellidos || u.fiscalTelefono || u.fiscalNumregidtrib)
})

const direccionFormateada = computed(() => {
  const u = auth.user
  if (!u) return ''
  const partes = [
    u.fiscalCalle,
    u.fiscalNumExt ? `#${u.fiscalNumExt}` : null,
    u.fiscalColonia,
    u.fiscalCiudad,
    u.fiscalEstado,
    u.fiscalCodpos ? `C.P. ${u.fiscalCodpos}` : null,
  ].filter(Boolean)
  return partes.join(', ')
})

async function copyRFC() {
  if (!auth.user?.fiscalRfc) return
  await navigator.clipboard.writeText(auth.user.fiscalRfc)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const REGIMENES: Record<string, string> = {
  '601': 'General de Ley Personas Morales', '603': 'Personas Morales con Fines no Lucrativos',
  '605': 'Sueldos y Salarios', '606': 'Arrendamiento', '607': 'Enajenación o Adquisición de Bienes',
  '608': 'Demás ingresos', '610': 'Residentes en el Extranjero', '611': 'Ingresos por Dividendos',
  '612': 'Actividades Empresariales y Profesionales', '614': 'Ingresos por intereses',
  '615': 'Ingresos por premios', '616': 'Sin obligaciones fiscales', '620': 'Sociedades Cooperativas',
  '621': 'Incorporación Fiscal', '622': 'Agrícolas, Ganaderas, Silvícolas y Pesqueras',
  '623': 'Grupos de Sociedades', '624': 'Coordinados',
  '625': 'Actividades con Plataformas Tecnológicas', '626': 'RESICO',
}
const USOS_CFDI: Record<string, string> = {
  'G01': 'Adquisición de mercancias', 'G02': 'Devoluciones/descuentos', 'G03': 'Gastos en general',
  'I01': 'Construcciones', 'I02': 'Mobiliario y equipo de oficina', 'I03': 'Equipo de transporte',
  'I04': 'Equipo de computo', 'I05': 'Dados, troqueles y herramental', 'I06': 'Comunicaciones telefónicas',
  'I07': 'Comunicaciones satelitales', 'I08': 'Otra maquinaria y equipo',
  'D01': 'Honorarios médicos y hospitalarios', 'D02': 'Gastos médicos por discapacidad',
  'D03': 'Gastos funerales', 'D04': 'Donativos', 'D05': 'Intereses hipotecarios',
  'D06': 'Aportaciones al SAR', 'D07': 'Seguros de gastos médicos',
  'D08': 'Transportación escolar', 'D09': 'Ahorro y planes de pensiones',
  'D10': 'Servicios educativos', 'S01': 'Sin efectos fiscales', 'CP01': 'Pagos', 'CN01': 'Nómina',
}
const regimenNombre = (c: string) => REGIMENES[c] ?? c
const cfdiNombre    = (c: string) => USOS_CFDI[c]  ?? c

/* ── #5 — Cambio de contraseña ── */
const pwOpen    = ref(false)
const pwCurrent = ref('')
const pwNew     = ref('')
const pwConfirm = ref('')
const pwLoading = ref(false)
const pwError   = ref('')
const pwSuccess = ref('')

function closePw() {
  pwOpen.value    = false
  pwCurrent.value = ''
  pwNew.value     = ''
  pwConfirm.value = ''
  pwError.value   = ''
  pwSuccess.value = ''
}

async function submitPw() {
  pwError.value   = ''
  pwSuccess.value = ''
  if (!pwCurrent.value) { pwError.value = 'Ingresa tu contraseña actual.'; return }
  if (pwNew.value.length < 8) { pwError.value = 'La nueva contraseña debe tener al menos 8 caracteres.'; return }
  if (pwNew.value !== pwConfirm.value) { pwError.value = 'Las contraseñas nuevas no coinciden.'; return }
  pwLoading.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      body: { currentPassword: pwCurrent.value, newPassword: pwNew.value },
    })
    pwSuccess.value = 'Contraseña actualizada correctamente.'
    pwCurrent.value = ''
    pwNew.value     = ''
    pwConfirm.value = ''
    setTimeout(() => { closePw() }, 2000)
  } catch (e: unknown) {
    pwError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cambiar contraseña.'
  } finally {
    pwLoading.value = false
  }
}
</script>
