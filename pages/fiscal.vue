<template>
  <div :style="{ fontFamily:`'Inter',system-ui,sans-serif` }">

    <!-- Header -->
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
      <div>
        <h1 style="font-size:22px;font-weight:800;color:#F1F5F9;margin:0;">Datos Fiscales</h1>
        <p style="font-size:13px;color:rgba(100,116,139,0.85);margin-top:4px;">
          <span v-if="loading">Cargando...</span>
          <span v-else-if="apiError" style="color:#fb7185;">{{ apiError }}</span>
          <span v-else>{{ users.length }} usuarios registrados</span>
        </p>
      </div>
    </div>

    <!-- KPIs -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;">
      <div v-for="k in kpis" :key="k.label" style="border-radius:14px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:16px 18px;">
        <div :style="{ fontSize:'26px', fontWeight:800, background:k.grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }">
          {{ loading ? '—' : k.value }}
        </div>
        <div style="font-size:11px;color:rgba(100,116,139,0.8);margin-top:4px;font-weight:500;">{{ k.label }}</div>
      </div>
    </div>

    <!-- Filtros -->
    <div style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:14px 16px;margin-bottom:20px;display:flex;flex-direction:column;gap:12px;">
      <div style="position:relative;max-width:380px;">
        <Search :size="14" style="position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;" :color="searchFocus?'#0EA5E9':'rgba(100,116,139,0.7)'" />
        <input v-model="search" placeholder="Buscar por nombre, RFC o razón social..."
          @focus="searchFocus=true" @blur="searchFocus=false"
          :style="{ width:'100%', height:'40px', background: searchFocus?'rgba(14,165,233,0.06)':'rgba(255,255,255,0.04)', border:`1px solid ${searchFocus?'rgba(14,165,233,0.45)':'rgba(255,255,255,0.09)'}`, borderRadius:'10px', paddingLeft:'38px', paddingRight:'14px', fontSize:'13px', color:'#E2E8F0', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'all 0.2s' }" />
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button v-for="f in statusFilters" :key="f.key" @click="statusFilter=f.key"
          :style="{ height:'30px', padding:'0 12px', borderRadius:'20px', fontSize:'11px', fontWeight: statusFilter===f.key ? 600:500, cursor:'pointer', border:'none', fontFamily:'inherit', background: statusFilter===f.key ? 'linear-gradient(135deg,#0EA5E9,#0284C7)':'rgba(255,255,255,0.05)', color: statusFilter===f.key ? '#fff':'rgba(100,116,139,0.9)', boxShadow: statusFilter===f.key ? '0 3px 10px rgba(14,165,233,0.25)':'none' }">
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Skeletons -->
    <div v-if="loading" style="display:flex;flex-direction:column;gap:3px;">
      <div v-for="i in 6" :key="i" class="pulse" style="border-radius:12px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);height:60px;" />
    </div>

    <!-- Tabla -->
    <div v-else-if="filtered.length > 0" style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);overflow:hidden;">

      <!-- Cabecera -->
      <div style="display:grid;grid-template-columns:2fr 1.5fr 1.5fr 1fr 1fr 1fr 44px;gap:0;padding:10px 18px;border-bottom:1px solid rgba(255,255,255,0.07);">
        <span v-for="h in headers" :key="h" style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);text-transform:uppercase;letter-spacing:0.8px;">{{ h }}</span>
      </div>

      <!-- Filas -->
      <div v-for="(u, idx) in filtered" :key="u.id"
        :style="{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1.5fr 1fr 1fr 1fr 44px', gap:0, padding:'13px 18px', borderBottom: idx < filtered.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems:'center', cursor:'pointer', transition:'background 0.15s', background: hoveredRow===u.id ? 'rgba(14,165,233,0.04)' : 'transparent' }"
        @mouseenter="hoveredRow=u.id" @mouseleave="hoveredRow=null" @click="openDetail(u)">

        <!-- Nombre -->
        <div style="display:flex;align-items:center;gap:10px;min-width:0;">
          <div :style="{ width:'34px', height:'34px', borderRadius:'10px', flexShrink:0, background:`linear-gradient(135deg,${avatarGrad(u.name)[0]},${avatarGrad(u.name)[1]})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:700, color:'white' }">
            {{ u.name.split(' ').slice(0,2).map((n:string)=>n[0]).join('') }}
          </div>
          <div style="min-width:0;">
            <div style="font-size:13px;font-weight:600;color:#E2E8F0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ u.name }}</div>
            <div style="font-size:11px;color:rgba(100,116,139,0.7);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ u.email }}</div>
          </div>
        </div>

        <!-- RFC -->
        <div style="min-width:0;">
          <span v-if="u.fiscalRfc" style="font-size:12px;font-weight:600;color:#38bdf8;font-family:monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;">{{ u.fiscalRfc }}</span>
          <span v-else style="font-size:12px;color:rgba(100,116,139,0.45);">—</span>
        </div>

        <!-- Razón social -->
        <div style="min-width:0;">
          <span v-if="u.fiscalRazonSocial" style="font-size:12px;color:#CBD5E1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;">{{ u.fiscalRazonSocial }}</span>
          <span v-else style="font-size:12px;color:rgba(100,116,139,0.45);">—</span>
        </div>

        <!-- Régimen -->
        <div style="min-width:0;">
          <span v-if="u.fiscalRegimen" style="font-size:11px;font-weight:600;padding:2px 8px;border-radius:20px;background:rgba(99,102,241,0.12);color:#a5b4fc;white-space:nowrap;">{{ u.fiscalRegimen }}</span>
          <span v-else style="font-size:12px;color:rgba(100,116,139,0.45);">—</span>
        </div>

        <!-- Estado fiscal -->
        <div>
          <span :style="{ fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'20px', display:'flex', alignItems:'center', gap:'5px', width:'fit-content', background: u.fiscalCompleted ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: u.fiscalCompleted ? '#34d399' : '#fbbf24' }">
            <span :style="{ width:'5px', height:'5px', borderRadius:'50%', background: u.fiscalCompleted ? '#10b981' : '#f59e0b', display:'inline-block', flexShrink:0 }" />
            {{ u.fiscalCompleted ? 'Completo' : 'Pendiente' }}
          </span>
        </div>

        <!-- Factura.com -->
        <div>
          <span :style="{ fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'20px', display:'flex', alignItems:'center', gap:'5px', width:'fit-content', background: u.facturaUid ? 'rgba(99,102,241,0.12)' : 'rgba(100,116,139,0.08)', color: u.facturaUid ? '#818cf8' : 'rgba(100,116,139,0.5)' }">
            <span :style="{ width:'5px', height:'5px', borderRadius:'50%', background: u.facturaUid ? '#6366f1' : 'rgba(100,116,139,0.4)', display:'inline-block', flexShrink:0 }" />
            {{ u.facturaUid ? 'Sincronizado' : 'No sincronizado' }}
          </span>
        </div>

        <!-- Ver detalle -->
        <div style="display:flex;justify-content:center;">
          <div style="width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;">
            <ChevronRight :size="13" color="rgba(100,116,139,0.7)" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading && !apiError" style="display:flex;align-items:center;justify-content:center;padding:60px 0;border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);font-size:14px;font-weight:600;color:#94a3b8;">
      No se encontraron resultados
    </div>
  </div>

  <!-- ══ Modal detalle ══ -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="detail" style="position:fixed;inset:0;background:rgba(2,6,14,0.78);backdrop-filter:blur(6px);z-index:1050;" @click.self="detail=null" />
    </Transition>
    <Transition name="modal">
      <div v-if="detail" style="position:fixed;inset:0;z-index:1051;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div style="width:100%;max-width:620px;max-height:90vh;display:flex;flex-direction:column;">
          <div style="position:relative;">
            <div style="position:absolute;inset:-1px;border-radius:22px;background:linear-gradient(135deg,rgba(14,165,233,0.35),rgba(124,58,237,0.2));z-index:0;pointer-events:none;" />
            <div style="position:relative;z-index:1;border-radius:22px;background:linear-gradient(160deg,#0D1B35,#09122A);box-shadow:0 32px 80px rgba(0,0,0,0.75);display:flex;flex-direction:column;max-height:90vh;">

              <!-- Header modal -->
              <div style="padding:24px 26px 0;flex-shrink:0;">
                <div style="position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,rgba(14,165,233,0.6),transparent);border-radius:999px;" />
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    <div :style="{ width:'42px', height:'42px', borderRadius:'12px', flexShrink:0, background:`linear-gradient(135deg,${avatarGrad(detail.name)[0]},${avatarGrad(detail.name)[1]})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:700, color:'white' }">
                      {{ detail.name.split(' ').slice(0,2).map((n:string)=>n[0]).join('') }}
                    </div>
                    <div>
                      <div style="font-size:15px;font-weight:700;color:#F1F5F9;">{{ detail.name }}</div>
                      <div style="font-size:12px;color:rgba(100,116,139,0.75);margin-top:2px;">{{ detail.email }}</div>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span :style="{ fontSize:'11px', fontWeight:600, padding:'4px 12px', borderRadius:'20px', display:'flex', alignItems:'center', gap:'5px', background: detail.fiscalCompleted ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: detail.fiscalCompleted ? '#34d399' : '#fbbf24', border: `1px solid ${detail.fiscalCompleted ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}` }">
                      <span :style="{ width:'5px', height:'5px', borderRadius:'50%', background: detail.fiscalCompleted ? '#10b981':'#f59e0b', display:'inline-block' }" />
                      {{ detail.fiscalCompleted ? 'Datos completos' : 'Datos pendientes' }}
                    </span>
                    <button v-if="!editing" @click="startEdit()"
                      style="display:flex;align-items:center;gap:5px;height:30px;padding:0 12px;border-radius:8px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);color:#38bdf8;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;">
                      <Pencil :size="11" /> Editar
                    </button>
                    <button @click="editing ? (editing=false) : (detail=null)"
                      style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(100,116,139,0.8);">
                      <X :size="14" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Contenido scrollable -->
              <div style="overflow-y:auto;padding:0 26px 24px;flex:1;min-height:0;">

                <!-- ══ MODO VISTA ══ -->
                <template v-if="!editing">
                  <div v-if="!detail.fiscalCompleted" style="padding:14px 16px;border-radius:12px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);font-size:13px;color:rgba(245,158,11,0.9);display:flex;align-items:center;gap:10px;margin-bottom:18px;">
                    <AlertTriangle :size="15" color="#fbbf24" style="flex-shrink:0;" />
                    Este usuario aún no ha completado sus datos fiscales.
                  </div>

                  <!-- Estado Factura.com -->
                  <div style="padding:14px 16px;border-radius:12px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:12px;"
                    :style="detail.facturaUid ? 'background:rgba(99,102,241,0.07);border:1px solid rgba(99,102,241,0.2)' : 'background:rgba(100,116,139,0.06);border:1px solid rgba(100,116,139,0.15)'">
                    <div style="display:flex;align-items:center;gap:10px;min-width:0;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="detail.facturaUid ? '#818cf8' : 'rgba(100,116,139,0.5)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect width="14" height="17" x="5" y="2" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>
                      <div style="min-width:0;">
                        <div :style="{ fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'2px', color: detail.facturaUid ? 'rgba(129,140,248,0.7)' : 'rgba(100,116,139,0.5)' }">Factura.com</div>
                        <div v-if="detail.facturaUid" style="font-size:12px;font-weight:600;color:#a5b4fc;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">UID: {{ detail.facturaUid }}</div>
                        <div v-else style="font-size:12px;color:rgba(100,116,139,0.6);">No sincronizado</div>
                      </div>
                    </div>
                    <button v-if="detail.fiscalCompleted" @click.stop="syncToFactura(detail)"
                      :disabled="syncing===detail.id"
                      :style="{ flexShrink:0, height:'32px', padding:'0 14px', borderRadius:'8px', border:'1px solid rgba(99,102,241,0.35)', background:'rgba(99,102,241,0.12)', color:'#818cf8', fontSize:'11px', fontWeight:600, cursor: syncing===detail.id ? 'not-allowed':'pointer', fontFamily:'inherit', opacity: syncing===detail.id ? 0.6 : 1 }">
                      {{ syncing === detail.id ? 'Sincronizando…' : detail.facturaUid ? 'Re-sincronizar' : 'Sincronizar' }}
                    </button>
                  </div>
                  <div v-if="syncError" style="font-size:11px;color:#fb7185;margin-bottom:12px;padding:8px 12px;border-radius:8px;background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.2);">{{ syncError }}</div>

                  <!-- Generar CFDI -->
                  <button v-if="detail.facturaUid && detail.fiscalCompleted && detail.fiscalUsocfdi"
                    @click="openCfdi(detail)"
                    style="width:100%;height:38px;border-radius:10px;background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(79,70,229,0.1));border:1px solid rgba(99,102,241,0.3);color:#818cf8;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:18px;transition:all 0.2s;"
                    @mouseenter="e => (e.currentTarget as HTMLButtonElement).style.background='linear-gradient(135deg,rgba(99,102,241,0.25),rgba(79,70,229,0.18))'"
                    @mouseleave="e => (e.currentTarget as HTMLButtonElement).style.background='linear-gradient(135deg,rgba(99,102,241,0.15),rgba(79,70,229,0.1))'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="17" x="5" y="2" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/><circle cx="17" cy="17" r="5"/><path d="m15.5 17.5 1 1 2-2"/></svg>
                    Generar CFDI 4.0
                  </button>

                  <!-- Datos fiscales -->
                  <div style="margin-bottom:20px;">
                    <div style="font-size:10px;font-weight:700;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Datos fiscales</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                      <DetailField label="RFC" :value="detail.fiscalRfc" mono />
                      <DetailField label="País" :value="detail.fiscalPais" />
                      <DetailField label="Razón Social" :value="detail.fiscalRazonSocial" full />
                      <DetailField label="Código Postal" :value="detail.fiscalCodpos" />
                      <DetailField label="Régimen Fiscal" :value="detail.fiscalRegimen ? `${detail.fiscalRegimen} – ${regimenNombre(detail.fiscalRegimen)}` : undefined" />
                      <DetailField label="Uso de CFDI" :value="detail.fiscalUsocfdi ? `${detail.fiscalUsocfdi} – ${cfdiNombre(detail.fiscalUsocfdi)}` : undefined" />
                      <DetailField label="Email fiscal" :value="detail.fiscalEmail" full />
                    </div>
                  </div>

                  <!-- Domicilio -->
                  <div style="margin-bottom:20px;">
                    <div style="font-size:10px;font-weight:700;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Domicilio fiscal</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                      <DetailField label="Calle" :value="detail.fiscalCalle" />
                      <DetailField label="Número exterior" :value="detail.fiscalNumExt" />
                      <DetailField label="Número interior" :value="detail.fiscalNumInt" />
                      <DetailField label="Colonia" :value="detail.fiscalColonia" />
                      <DetailField label="Ciudad" :value="detail.fiscalCiudad" />
                      <DetailField label="Delegación / Municipio" :value="detail.fiscalDelegacion" />
                      <DetailField label="Localidad" :value="detail.fiscalLocalidad" />
                      <DetailField label="Estado" :value="detail.fiscalEstado" />
                    </div>
                  </div>

                  <!-- Contacto -->
                  <div>
                    <div style="font-size:10px;font-weight:700;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Contacto adicional</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                      <DetailField label="Nombre" :value="detail.fiscalNombre" />
                      <DetailField label="Apellidos" :value="detail.fiscalApellidos" />
                      <DetailField label="Teléfono" :value="detail.fiscalTelefono" />
                      <DetailField label="Núm. Reg. ID Tributario" :value="detail.fiscalNumregidtrib" />
                    </div>
                  </div>
                </template>

                <!-- ══ MODO EDICIÓN ══ -->
                <template v-else>
                  <!-- Datos fiscales -->
                  <div style="margin-bottom:18px;">
                    <div style="font-size:10px;font-weight:700;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Datos fiscales <span style="color:#fb7185;">*requeridos</span></div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                      <div>
                        <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:4px;">RFC *</div>
                        <input v-model="editForm.rfc" placeholder="XAXX010101000" style="width:100%;height:36px;padding:0 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-size:12px;color:#E2E8F0;outline:none;font-family:monospace;box-sizing:border-box;" />
                      </div>
                      <div>
                        <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:4px;">País *</div>
                        <input v-model="editForm.pais" placeholder="MEX" style="width:100%;height:36px;padding:0 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;" />
                      </div>
                      <div style="grid-column:1/-1;">
                        <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:4px;">Razón Social *</div>
                        <input v-model="editForm.razonSocial" placeholder="Nombre o razón social completa" style="width:100%;height:36px;padding:0 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;" />
                      </div>
                      <div>
                        <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:4px;">Código Postal *</div>
                        <input v-model="editForm.codpos" placeholder="31000" style="width:100%;height:36px;padding:0 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;" />
                      </div>
                      <div>
                        <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:4px;">Email fiscal *</div>
                        <input v-model="editForm.email" type="email" placeholder="facturacion@empresa.com" style="width:100%;height:36px;padding:0 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;" />
                      </div>
                      <div>
                        <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:4px;">Régimen Fiscal *</div>
                        <select v-model="editForm.regimen" style="width:100%;height:36px;padding:0 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;cursor:pointer;">
                          <option value="" style="background:#0D1B35;">Seleccionar…</option>
                          <option v-for="(nombre, clave) in REGIMENES" :key="clave" :value="clave" style="background:#0D1B35;">{{ clave }} – {{ nombre }}</option>
                        </select>
                      </div>
                      <div>
                        <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:4px;">Uso de CFDI</div>
                        <select v-model="editForm.usocfdi" style="width:100%;height:36px;padding:0 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;cursor:pointer;">
                          <option value="" style="background:#0D1B35;">Seleccionar…</option>
                          <option v-for="(nombre, clave) in USOS_CFDI" :key="clave" :value="clave" style="background:#0D1B35;">{{ clave }} – {{ nombre }}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Domicilio -->
                  <div style="margin-bottom:18px;">
                    <div style="font-size:10px;font-weight:700;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Domicilio fiscal</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                      <template v-for="f in domicilioFields" :key="f.key">
                        <div>
                          <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:4px;">{{ f.label }}</div>
                          <input v-model="editForm[f.key]" :placeholder="f.placeholder" style="width:100%;height:36px;padding:0 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;" />
                        </div>
                      </template>
                    </div>
                  </div>

                  <!-- Contacto -->
                  <div style="margin-bottom:18px;">
                    <div style="font-size:10px;font-weight:700;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Contacto adicional</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                      <template v-for="f in contactoFields" :key="f.key">
                        <div>
                          <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);margin-bottom:4px;">{{ f.label }}</div>
                          <input v-model="editForm[f.key]" :placeholder="f.placeholder" style="width:100%;height:36px;padding:0 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;" />
                        </div>
                      </template>
                    </div>
                  </div>

                  <!-- Error + botones -->
                  <div v-if="editError" style="padding:9px 12px;border-radius:8px;background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.25);font-size:12px;color:#fb7185;margin-bottom:12px;">{{ editError }}</div>
                  <div style="display:flex;gap:10px;">
                    <button @click="editing=false" :disabled="editSaving"
                      style="flex:1;height:40px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#94a3b8;font-size:13px;cursor:pointer;font-family:inherit;">
                      Cancelar
                    </button>
                    <button @click="saveEdit()" :disabled="editSaving"
                      :style="{ flex:2, height:'40px', borderRadius:'10px', border:'none', background: editSaving ? 'rgba(14,165,233,0.5)' : 'linear-gradient(135deg,#0EA5E9,#0284C7)', color:'white', fontSize:'13px', fontWeight:700, cursor: editSaving ? 'not-allowed' : 'pointer', fontFamily:'inherit', boxShadow: editSaving ? 'none' : '0 4px 16px rgba(14,165,233,0.3)' }">
                      {{ editSaving ? 'Guardando…' : 'Guardar cambios' }}
                    </button>
                  </div>
                </template>

              </div>

            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ══ Modal CFDI ══ -->
  <CfdiModal v-if="cfdiUser" :user="cfdiUser" :open="cfdiOpen" @close="cfdiOpen=false" @created="onCfdiCreated" />
</template>

<script setup lang="ts">
import { Search, ChevronRight, X, AlertTriangle, Pencil } from '@lucide/vue'

definePageMeta({ middleware: 'auth' })

/* ── tipos ── */
interface FiscalUser {
  id: string; name: string; email: string; role: string; status: string; createdAt: string
  fiscalCompleted: boolean
  fiscalRfc?: string | null; fiscalRazonSocial?: string | null; fiscalCodpos?: string | null
  fiscalEmail?: string | null; fiscalUsocfdi?: string | null; fiscalRegimen?: string | null
  fiscalPais?: string | null; fiscalCalle?: string | null; fiscalNumExt?: string | null
  fiscalNumInt?: string | null; fiscalColonia?: string | null; fiscalCiudad?: string | null
  fiscalDelegacion?: string | null; fiscalLocalidad?: string | null; fiscalEstado?: string | null
  fiscalNumregidtrib?: string | null; fiscalNombre?: string | null; fiscalApellidos?: string | null
  fiscalTelefono?: string | null; facturaUid?: string | null
}

const auth = useAuthStore()
if (auth.user?.role !== 'admin') navigateTo('/catalog')

const users    = ref<FiscalUser[]>([])
const loading  = ref(true)
const apiError = ref('')

onMounted(async () => {
  try {
    const data = await $fetch<{ users: FiscalUser[] }>('/api/users/fiscal')
    users.value = data.users
  } catch (e: unknown) {
    apiError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cargar datos'
  } finally { loading.value = false }
})

/* ── filtros ── */
const search       = ref('')
const statusFilter = ref<'all' | 'complete' | 'pending'>('all')
const searchFocus  = ref(false)
const hoveredRow   = ref<string | null>(null)

const statusFilters = [
  { key: 'all',      label: 'Todos' },
  { key: 'complete', label: 'Completos' },
  { key: 'pending',  label: 'Pendientes' },
] as const

const filtered = computed(() => users.value.filter(u => {
  if (statusFilter.value === 'complete' && !u.fiscalCompleted)  return false
  if (statusFilter.value === 'pending'  &&  u.fiscalCompleted)  return false
  const q = search.value.toLowerCase()
  return !q || u.name.toLowerCase().includes(q)
    || (u.fiscalRfc         ?? '').toLowerCase().includes(q)
    || (u.fiscalRazonSocial ?? '').toLowerCase().includes(q)
    || u.email.toLowerCase().includes(q)
}))

const kpis = computed(() => [
  { label: 'Total usuarios',    value: users.value.length,                                  grad: 'linear-gradient(135deg,#0EA5E9,#22D3EE)' },
  { label: 'Datos completos',   value: users.value.filter(u =>  u.fiscalCompleted).length,  grad: 'linear-gradient(135deg,#10B981,#34D399)' },
  { label: 'Datos pendientes',  value: users.value.filter(u => !u.fiscalCompleted).length,  grad: 'linear-gradient(135deg,#F59E0B,#FCD34D)' },
  { label: '% completado',      value: users.value.length ? `${Math.round(users.value.filter(u => u.fiscalCompleted).length / users.value.length * 100)}%` : '—', grad: 'linear-gradient(135deg,#7C3AED,#A78BFA)' },
])

const headers = ['Usuario', 'RFC', 'Razón Social', 'Régimen', 'Estado fiscal', 'Factura.com', '']

/* ── detalle ── */
const detail    = ref<FiscalUser | null>(null)
const syncing   = ref<string | null>(null)
const syncError = ref('')

function openDetail(u: FiscalUser) { detail.value = u; syncError.value = ''; editing.value = false }

/* ── edición de datos fiscales ── */
const editing    = ref(false)
const editForm   = ref<Record<string, string>>({})
const editSaving = ref(false)
const editError  = ref('')

const domicilioFields = [
  { key: 'calle',          label: 'Calle',                 placeholder: 'Av. Principal' },
  { key: 'numeroExterior', label: 'Número exterior',       placeholder: '123' },
  { key: 'numeroInterior', label: 'Número interior',       placeholder: 'A' },
  { key: 'colonia',        label: 'Colonia',               placeholder: 'Centro' },
  { key: 'ciudad',         label: 'Ciudad',                placeholder: 'Chihuahua' },
  { key: 'delegacion',     label: 'Delegación / Municipio',placeholder: 'Municipio' },
  { key: 'localidad',      label: 'Localidad',             placeholder: 'Localidad' },
  { key: 'estado',         label: 'Estado',                placeholder: 'CHIH' },
]
const contactoFields = [
  { key: 'nombre',       label: 'Nombre',                  placeholder: 'Juan' },
  { key: 'apellidos',    label: 'Apellidos',               placeholder: 'Pérez García' },
  { key: 'telefono',     label: 'Teléfono',                placeholder: '6141234567' },
  { key: 'numregidtrib', label: 'Núm. Reg. ID Tributario', placeholder: '' },
]

function startEdit() {
  if (!detail.value) return
  editForm.value = {
    rfc:            detail.value.fiscalRfc          ?? '',
    razonSocial:    detail.value.fiscalRazonSocial  ?? '',
    codpos:         detail.value.fiscalCodpos       ?? '',
    email:          detail.value.fiscalEmail        ?? '',
    usocfdi:        detail.value.fiscalUsocfdi      ?? '',
    regimen:        detail.value.fiscalRegimen      ?? '',
    pais:           detail.value.fiscalPais         ?? 'MEX',
    calle:          detail.value.fiscalCalle        ?? '',
    numeroExterior: detail.value.fiscalNumExt       ?? '',
    numeroInterior: detail.value.fiscalNumInt       ?? '',
    colonia:        detail.value.fiscalColonia      ?? '',
    ciudad:         detail.value.fiscalCiudad       ?? '',
    delegacion:     detail.value.fiscalDelegacion   ?? '',
    localidad:      detail.value.fiscalLocalidad    ?? '',
    estado:         detail.value.fiscalEstado       ?? '',
    numregidtrib:   detail.value.fiscalNumregidtrib ?? '',
    nombre:         detail.value.fiscalNombre       ?? '',
    apellidos:      detail.value.fiscalApellidos    ?? '',
    telefono:       detail.value.fiscalTelefono     ?? '',
  }
  editError.value = ''
  editing.value   = true
}

async function saveEdit() {
  if (!detail.value || editSaving.value) return
  editSaving.value = true
  editError.value  = ''
  try {
    const res = await $fetch<{ user: FiscalUser }>(`/api/users/${detail.value.id}/fiscal`, {
      method: 'PATCH',
      body:   editForm.value,
    })
    const idx = users.value.findIndex(u => u.id === res.user.id)
    if (idx >= 0) users.value[idx] = res.user
    detail.value  = res.user
    editing.value = false
  } catch (e: unknown) {
    editError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al guardar'
  } finally {
    editSaving.value = false
  }
}

/* ── CFDI ── */
const cfdiOpen = ref(false)
const cfdiUser = ref<FiscalUser | null>(null)

function openCfdi(u: FiscalUser) {
  cfdiUser.value = u
  cfdiOpen.value = true
}

function onCfdiCreated() {
  // El modal muestra el resultado internamente; cerramos el detalle también si el admin quiere
}

async function syncToFactura(u: FiscalUser) {
  syncing.value   = u.id
  syncError.value = ''
  try {
    const res = await $fetch<{ facturaUid: string }>('/api/factura/clients/sync', {
      method: 'POST',
      body:   { userId: u.id },
    })
    // Actualizar en la lista local
    const idx = users.value.findIndex(x => x.id === u.id)
    if (idx >= 0) users.value[idx] = { ...users.value[idx], facturaUid: res.facturaUid }
    if (detail.value?.id === u.id) detail.value = { ...detail.value, facturaUid: res.facturaUid }
  } catch (e: unknown) {
    syncError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al sincronizar'
  } finally {
    syncing.value = null
  }
}

/* ── helpers visuales ── */
const palette = [['#0EA5E9','#22D3EE'],['#7C3AED','#A78BFA'],['#10B981','#34D399'],['#F59E0B','#FCD34D'],['#F43F5E','#FB7185'],['#6366F1','#818CF8']]
const avatarGrad = (name: string) => palette[name.charCodeAt(0) % palette.length]

const REGIMENES: Record<string, string> = {
  '601':'General de Ley Personas Morales','603':'Personas Morales con Fines no Lucrativos',
  '605':'Sueldos y Salarios','606':'Arrendamiento','607':'Enajenación o Adquisición de Bienes',
  '608':'Demás ingresos','610':'Residentes en el Extranjero','611':'Ingresos por Dividendos',
  '612':'Actividades Empresariales y Profesionales','614':'Ingresos por intereses',
  '615':'Ingresos por premios','616':'Sin obligaciones fiscales','620':'Sociedades Cooperativas',
  '621':'Incorporación Fiscal','622':'Agrícolas, Ganaderas, Silvícolas y Pesqueras',
  '623':'Grupos de Sociedades','624':'Coordinados',
  '625':'Actividades con Plataformas Tecnológicas','626':'RESICO',
}
const USOS_CFDI: Record<string, string> = {
  'G01':'Adquisición de mercancias','G02':'Devoluciones/descuentos','G03':'Gastos en general',
  'I01':'Construcciones','I02':'Mobiliario y equipo de oficina','I03':'Equipo de transporte',
  'I04':'Equipo de computo','I05':'Dados, troqueles y herramental','I06':'Comunicaciones telefónicas',
  'I07':'Comunicaciones satelitales','I08':'Otra maquinaria y equipo',
  'D01':'Honorarios médicos y hospitalarios','D02':'Gastos médicos por discapacidad',
  'D03':'Gastos funerales','D04':'Donativos','D05':'Intereses hipotecarios',
  'D06':'Aportaciones al SAR','D07':'Seguros de gastos médicos',
  'D08':'Transportación escolar','D09':'Ahorro y planes de pensiones',
  'D10':'Servicios educativos','S01':'Sin efectos fiscales','CP01':'Pagos','CN01':'Nómina',
}

const regimenNombre = (clave: string) => REGIMENES[clave] ?? clave
const cfdiNombre    = (clave: string) => USOS_CFDI[clave]  ?? clave
</script>
