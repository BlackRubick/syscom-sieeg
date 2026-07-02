<template>
  <div :style="{ fontFamily:`'Inter',system-ui,sans-serif`, display:'flex', flexDirection:'column', gap:'20px' }">

    <!-- Header -->
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <h1 style="font-size:22px;font-weight:800;color:#F1F5F9;margin:0;">{{ isManager ? 'Todas las órdenes' : 'Mis órdenes' }}</h1>
        <p style="font-size:13px;color:rgba(100,116,139,0.85);margin-top:4px;">
          {{ loading ? 'Cargando…' : `${orders.length} orden${orders.length!==1?'es':''}` }}
        </p>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <!-- #16 — CSV Export -->
        <button v-if="isManager && orders.length" @click="exportCSV"
          style="display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 14px;border-radius:9px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#94a3b8;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">
          <Download :size="13" /> CSV
        </button>
        <NuxtLink to="/cart" style="display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 16px;border-radius:9px;border:none;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-size:12px;font-weight:600;cursor:pointer;text-decoration:none;box-shadow:0 3px 12px rgba(14,165,233,0.3);">
          <ShoppingCart :size="13" /> Nueva orden
        </NuxtLink>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" style="display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:10px;background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.2);color:#fb7185;font-size:13px;">
      <AlertCircle :size="16" style="flex-shrink:0;" />
      <span>{{ error }}</span>
    </div>

    <!-- Filters -->
    <div style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:14px 16px;display:flex;flex-direction:column;gap:12px;">
      <div style="position:relative;max-width:380px;">
        <Search :size="14" style="position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;" :color="searchFocus?'#0EA5E9':'rgba(100,116,139,0.7)'" />
        <input v-model="search" placeholder="Buscar por ID o usuario…"
          @focus="searchFocus=true" @blur="searchFocus=false"
          :style="{ width:'100%', height:'40px', background:searchFocus?'rgba(14,165,233,0.06)':'rgba(255,255,255,0.04)', border:`1px solid ${searchFocus?'rgba(14,165,233,0.45)':'rgba(255,255,255,0.09)'}`, borderRadius:'10px', paddingLeft:'38px', paddingRight:'14px', fontSize:'13px', color:'#E2E8F0', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'all 0.2s' }" />
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab=tab.key"
          :style="{ display:'flex', alignItems:'center', gap:'5px', flexShrink:0, height:'30px', padding:'0 12px', borderRadius:'6px', fontSize:'12px', fontWeight:activeTab===tab.key?600:400, cursor:'pointer', border:'none', fontFamily:'inherit', background:activeTab===tab.key?'rgba(14,165,233,0.15)':'rgba(255,255,255,0.04)', color:activeTab===tab.key?'#38bdf8':'rgba(100,116,139,0.75)', outline:`1px solid ${activeTab===tab.key?'rgba(14,165,233,0.35)':'rgba(255,255,255,0.07)'}` }">
          {{ tab.label }}
          <span v-if="!loading" :style="{ fontSize:'10px', fontWeight:700, background:activeTab===tab.key?'rgba(14,165,233,0.2)':'rgba(255,255,255,0.07)', padding:'1px 5px', borderRadius:'4px', color:activeTab===tab.key?'#38bdf8':'rgba(100,116,139,0.8)' }">{{ tabCount(tab.key) }}</span>
        </button>
      </div>
    </div>

    <!-- List -->
    <div style="display:flex;flex-direction:column;gap:8px;">

      <!-- Skeletons -->
      <template v-if="loading">
        <div v-for="i in 5" :key="i" style="border-radius:14px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:16px 18px;display:flex;align-items:center;gap:14px;">
          <div class="shimmer-bg" style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.08);" />
          <div style="flex:1;display:flex;flex-direction:column;gap:7px;">
            <div class="shimmer-bg" style="height:13px;width:160px;border-radius:6px;background:rgba(255,255,255,0.07);" />
            <div class="shimmer-bg" style="height:11px;width:220px;border-radius:6px;background:rgba(255,255,255,0.04);" />
          </div>
          <div class="shimmer-bg" style="height:14px;width:80px;border-radius:6px;background:rgba(255,255,255,0.07);" />
        </div>
      </template>

      <template v-else>
        <div v-for="order in filtered" :key="order.id"
          @click="openDetail(order)"
          :style="{ borderRadius:'14px', background:'linear-gradient(160deg,#0D1B35,#091228)', border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden', boxShadow:'0 3px 14px rgba(0,0,0,0.3)', transition:'all 0.18s', cursor:'pointer' }"
          @mouseenter="e => { (e.currentTarget as HTMLElement).style.border='1px solid rgba(14,165,233,0.18)'; (e.currentTarget as HTMLElement).style.transform='translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 24px rgba(0,0,0,0.4)' }"
          @mouseleave="e => { (e.currentTarget as HTMLElement).style.border='1px solid rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform='translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow='0 3px 14px rgba(0,0,0,0.3)' }">

          <div style="display:flex;align-items:center;gap:14px;padding:14px 18px;">
            <!-- Indicador estado -->
            <div :style="{ width:'9px', height:'9px', borderRadius:'50%', background:statusCfg[order.status].dot, boxShadow:`0 0 7px ${statusCfg[order.status].dot}80`, flexShrink:0 }" />

            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
                <span style="font-size:12px;font-weight:700;color:#E2E8F0;font-family:monospace;">{{ order.id.slice(-8).toUpperCase() }}</span>
                <span :style="{ fontSize:'10px', fontWeight:600, padding:'2px 8px', borderRadius:'20px', background:statusCfg[order.status].bg, color:statusCfg[order.status].color }">{{ statusCfg[order.status].label }}</span>
                <span :style="{ fontSize:'10px', fontWeight:600, padding:'2px 8px', borderRadius:'20px', background:priCfg[order.priority]?.bg??priCfg.normal.bg, color:priCfg[order.priority]?.color??priCfg.normal.color }">{{ priCfg[order.priority]?.label??'Normal' }}</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <Clock :size="11" color="rgba(100,116,139,0.6)" />
                <span style="font-size:11px;color:rgba(100,116,139,0.8);">{{ fmtDate(order.createdAt) }}</span>
                <template v-if="isManager && order.userName">
                  <span style="color:rgba(71,85,105,0.5);font-size:11px;">·</span>
                  <User :size="11" color="rgba(100,116,139,0.5)" />
                  <span style="font-size:11px;color:rgba(100,116,139,0.8);">{{ order.userName }}</span>
                </template>
              </div>
            </div>

            <div style="text-align:center;flex-shrink:0;">
              <div style="font-size:13px;font-weight:700;color:#E2E8F0;">{{ order.items.length }}</div>
              <div style="font-size:10px;color:rgba(100,116,139,0.6);">producto{{ order.items.length!==1?'s':'' }}</div>
            </div>

            <div style="text-align:right;flex-shrink:0;">
              <div style="font-size:14px;font-weight:700;color:#F1F5F9;">{{ order.total > 0 ? fmtCurrency(order.total) : '—' }}</div>
              <div style="font-size:10px;color:rgba(100,116,139,0.6);margin-top:1px;">MXN</div>
            </div>

            <ChevronRight :size="15" color="rgba(100,116,139,0.5)" style="flex-shrink:0;" />
          </div>
        </div>
      </template>

      <div v-if="!loading && !error && !filtered.length" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);gap:12px;">
        <Package :size="36" color="rgba(100,116,139,0.5)" :stroke-width="1.5" />
        <div style="font-size:14px;font-weight:600;color:#94a3b8;">Sin órdenes</div>
        <div style="font-size:12px;color:rgba(100,116,139,0.7);">{{ activeTab==='all' ? 'Aún no tienes órdenes' : 'No hay órdenes con este estado' }}</div>
        <NuxtLink v-if="activeTab==='all'" to="/cart" style="margin-top:4px;display:inline-flex;align-items:center;gap:7px;height:38px;padding:0 18px;border-radius:9px;border:none;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-size:12px;font-weight:600;cursor:pointer;text-decoration:none;">
          <ShoppingCart :size="13" /> Crear una orden
        </NuxtLink>
      </div>
    </div>

    <!-- #9 — Paginación -->
    <div v-if="!loading && totalPages > 1" style="display:flex;align-items:center;justify-content:center;gap:10px;padding:4px 0;">
      <button @click="prevPage" :disabled="page===1"
        style="height:32px;padding:0 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#94a3b8;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;"
        :style="{ opacity: page===1 ? 0.4 : 1, cursor: page===1 ? 'not-allowed' : 'pointer' }">
        ← Anterior
      </button>
      <span style="font-size:12px;color:rgba(100,116,139,0.7);">Página {{ page }} de {{ totalPages }} · {{ totalCount }} total</span>
      <button @click="nextPage" :disabled="page===totalPages"
        style="height:32px;padding:0 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#94a3b8;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;"
        :style="{ opacity: page===totalPages ? 0.4 : 1, cursor: page===totalPages ? 'not-allowed' : 'pointer' }">
        Siguiente →
      </button>
    </div>
  </div>

  <!-- ══ MODAL DETALLE ══ -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="detail" style="position:fixed;inset:0;background:rgba(2,6,14,0.82);backdrop-filter:blur(7px);z-index:1050;" @click.self="detail=null" />
    </Transition>
    <Transition name="modal">
      <div v-if="detail" style="position:fixed;inset:0;z-index:1051;display:flex;align-items:center;justify-content:center;padding:16px;">
        <div style="width:100%;max-width:600px;max-height:92vh;display:flex;flex-direction:column;">
          <div style="position:relative;display:flex;flex-direction:column;min-height:0;">
            <div style="position:absolute;inset:-1px;border-radius:22px;background:linear-gradient(135deg,rgba(14,165,233,0.3),rgba(124,58,237,0.2),rgba(14,165,233,0.08));z-index:0;pointer-events:none;" />
            <div style="position:relative;z-index:1;border-radius:22px;background:linear-gradient(160deg,#0D1B35,#09122A);box-shadow:0 32px 80px rgba(0,0,0,0.75);display:flex;flex-direction:column;min-height:0;">

              <!-- ── Header ── -->
              <div style="padding:22px 24px 0;flex-shrink:0;">
                <div style="position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,rgba(14,165,233,0.6),transparent);border-radius:999px;" />

                <!-- Título + cerrar -->
                <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px;">
                  <div style="min-width:0;">
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                      <span style="font-size:16px;font-weight:800;color:#F1F5F9;font-family:monospace;letter-spacing:0.5px;">{{ detail.id.slice(-10).toUpperCase() }}</span>
                      <span :style="{ fontSize:'11px', fontWeight:700, padding:'3px 10px', borderRadius:'20px', background:statusCfg[detail.status].bg, color:statusCfg[detail.status].color }">{{ statusCfg[detail.status].label }}</span>
                      <span :style="{ fontSize:'11px', fontWeight:600, padding:'3px 9px', borderRadius:'20px', background:priCfg[detail.priority]?.bg??priCfg.normal.bg, color:priCfg[detail.priority]?.color??priCfg.normal.color }">{{ priCfg[detail.priority]?.label??'Normal' }}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:5px;margin-top:5px;flex-wrap:wrap;">
                      <Clock :size="11" color="rgba(100,116,139,0.6)" />
                      <span style="font-size:11px;color:rgba(100,116,139,0.7);">{{ fmtDateLong(detail.createdAt) }}</span>
                      <template v-if="isManager && detail.userName">
                        <span style="color:rgba(71,85,105,0.5);">·</span>
                        <User :size="11" color="rgba(100,116,139,0.5)" />
                        <span style="font-size:11px;color:rgba(100,116,139,0.7);">{{ detail.userName }}</span>
                      </template>
                    </div>
                  </div>
                  <button @click="detail=null" style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
                    <X :size="14" color="rgba(148,163,184,0.8)" />
                  </button>
                </div>

                <!-- Timeline: línea base + círculos encima -->
                <div style="position:relative;padding:0 14px;margin-bottom:20px;">
                  <!-- Línea de fondo -->
                  <div style="position:absolute;top:13px;left:14px;right:14px;height:2px;background:rgba(255,255,255,0.08);border-radius:2px;" />
                  <!-- Progreso coloreado -->
                  <div :style="{ position:'absolute', top:'13px', left:'14px', height:'2px', borderRadius:'2px', background:`linear-gradient(90deg,#fbbf24,#34d399,#38bdf8,#818cf8)`, width: timelineProgress + '%', transition:'width 0.4s ease' }" />
                  <!-- Pasos -->
                  <div style="display:flex;justify-content:space-between;position:relative;">
                    <div v-for="step in timeline" :key="step.key" style="display:flex;flex-direction:column;align-items:center;gap:6px;width:52px;">
                      <div :style="{ width:'26px', height:'26px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background: stepState(step.key,detail.status)==='done' ? step.color+'28' : stepState(step.key,detail.status)==='active' ? step.color+'38' : 'rgba(9,18,40,1)', border:`2px solid ${stepState(step.key,detail.status)!=='pending' ? step.color : 'rgba(255,255,255,0.12)'}`, boxShadow: stepState(step.key,detail.status)==='active' ? `0 0 12px ${step.color}60` : 'none', transition:'all 0.25s', zIndex:1 }">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" :stroke="stepState(step.key,detail.status)!=='pending' ? step.color : 'rgba(100,116,139,0.35)'" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" v-html="step.icon" />
                      </div>
                      <span :style="{ fontSize:'9px', fontWeight: stepState(step.key,detail.status)==='active'?700:500, color: stepState(step.key,detail.status)!=='pending' ? step.color : 'rgba(100,116,139,0.4)', textAlign:'center', lineHeight:1.2, whiteSpace:'nowrap' }">{{ step.label }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ── Cuerpo scrollable ── -->
              <div style="overflow-y:auto;flex:1;min-height:0;padding:0 24px 24px;display:flex;flex-direction:column;gap:14px;">

                <!-- Productos -->
                <div style="border-radius:14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
                  <div style="padding:11px 16px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:6px;">
                    <Package :size="12" color="rgba(100,116,139,0.6)" />
                    <span style="font-size:11px;font-weight:700;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.8px;">Productos · {{ detail.items.length }}</span>
                  </div>
                  <div style="display:flex;flex-direction:column;">
                    <div v-for="(item, idx) in detail.items" :key="item.productId"
                      :style="{ display:'flex', alignItems:'center', gap:'12px', padding:'11px 16px', borderBottom: idx < detail.items.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }">
                      <!-- Imagen -->
                      <div style="width:40px;height:40px;border-radius:10px;background:rgba(14,165,233,0.07);border:1px solid rgba(14,165,233,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">
                        <img v-if="item.images?.[0]" :src="item.images[0]" style="width:36px;height:36px;object-fit:contain;" @error="(e)=>(e.currentTarget as HTMLImageElement).style.display='none'" />
                        <Package v-else :size="16" color="#38bdf8" :stroke-width="1.5" />
                      </div>
                      <!-- Nombre + SKU -->
                      <div style="flex:1;min-width:0;">
                        <div style="font-size:13px;font-weight:500;color:#CBD5E1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ item.name }}</div>
                        <div style="font-size:10px;color:rgba(100,116,139,0.55);font-family:monospace;margin-top:2px;">{{ item.sku }}</div>
                      </div>
                      <!-- Qty + precio -->
                      <div style="flex-shrink:0;text-align:right;">
                        <div style="font-size:12px;font-weight:600;color:#94a3b8;">× {{ item.quantity }}</div>
                        <div v-if="item.price>0" style="font-size:11px;color:#64748b;margin-top:2px;">{{ fmtCurrency(item.price * item.quantity) }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Total -->
                <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-radius:14px;background:rgba(14,165,233,0.06);border:1px solid rgba(14,165,233,0.14);">
                  <span style="font-size:13px;font-weight:600;color:#94a3b8;">Total de la orden</span>
                  <span style="font-size:20px;font-weight:800;color:#F1F5F9;">{{ fmtCurrency(detail.total) }}</span>
                </div>

                <!-- Info de la orden -->
                <div style="border-radius:14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
                  <div style="padding:11px 16px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:11px;font-weight:700;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.8px;">Información</span>
                  </div>
                  <div style="padding:14px 16px;display:flex;flex-direction:column;gap:10px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
                      <span style="font-size:12px;color:rgba(100,116,139,0.65);flex-shrink:0;">ID</span>
                      <span style="font-size:11px;color:#64748b;font-family:monospace;text-align:right;word-break:break-all;">{{ detail.id }}</span>
                    </div>
                    <div style="height:1px;background:rgba(255,255,255,0.05);" />
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
                      <span style="font-size:12px;color:rgba(100,116,139,0.65);flex-shrink:0;">Creada</span>
                      <span style="font-size:12px;color:#94a3b8;">{{ fmtDateLong(detail.createdAt) }}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
                      <span style="font-size:12px;color:rgba(100,116,139,0.65);flex-shrink:0;">Actualizada</span>
                      <span style="font-size:12px;color:#94a3b8;">{{ fmtDateLong(detail.updatedAt) }}</span>
                    </div>
                    <template v-if="isManager && detail.userName">
                      <div style="height:1px;background:rgba(255,255,255,0.05);" />
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
                        <span style="font-size:12px;color:rgba(100,116,139,0.65);flex-shrink:0;">Solicitante</span>
                        <span style="font-size:12px;font-weight:600;color:#CBD5E1;">{{ detail.userName }}</span>
                      </div>
                      <div v-if="detail.userEmail" style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
                        <span style="font-size:12px;color:rgba(100,116,139,0.65);flex-shrink:0;">Email</span>
                        <span style="font-size:12px;color:#94a3b8;">{{ detail.userEmail }}</span>
                      </div>
                    </template>
                  </div>
                </div>

                <!-- Folio SYSCOM + rastreo -->
                <div v-if="detail.syscomFolio" style="border-radius:14px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);overflow:hidden;">
                  <div style="padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect width="14" height="17" x="5" y="2" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>
                      <div>
                        <div style="font-size:10px;font-weight:700;color:rgba(52,211,153,0.7);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;">Folio SYSCOM</div>
                        <div style="font-size:14px;font-weight:700;color:#6ee7b7;font-family:monospace;">{{ detail.syscomFolio }}</div>
                      </div>
                    </div>
                    <button @click="fetchTracking" :disabled="trackingLoading"
                      :style="{ height:'32px', padding:'0 14px', borderRadius:'8px', border:'1px solid rgba(52,211,153,0.3)', background:trackingLoading?'rgba(16,185,129,0.05)':'rgba(16,185,129,0.1)', color:'#34d399', fontSize:'11px', fontWeight:700, cursor:trackingLoading?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'6px', flexShrink:0, opacity:trackingLoading?0.7:1 }">
                      <svg v-if="trackingLoading" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                      {{ trackingLoading ? 'Consultando…' : 'Ver estado' }}
                    </button>
                  </div>

                  <!-- Panel de estado SYSCOM -->
                  <Transition name="slide-down">
                    <div v-if="tracking" style="border-top:1px solid rgba(16,185,129,0.15);padding:14px 16px;display:flex;flex-direction:column;gap:12px;">

                      <!-- Estatus principal -->
                      <div style="display:flex;align-items:center;gap:10px;">
                        <div :style="{ width:'8px', height:'8px', borderRadius:'50%', background: trackingStatusCfg.dot, boxShadow:`0 0 6px ${trackingStatusCfg.dot}80`, flexShrink:0 }" />
                        <div>
                          <div style="font-size:13px;font-weight:700;" :style="{ color: trackingStatusCfg.color }">{{ trackingStatusCfg.label }}</div>
                          <div v-if="tracking.fecha_creacion" style="font-size:10px;color:rgba(100,116,139,0.6);margin-top:2px;">Pedido creado: {{ tracking.fecha_creacion }}</div>
                        </div>
                        <div v-if="trackingJustUpdated" style="margin-left:auto;font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;background:rgba(16,185,129,0.15);color:#34d399;">
                          ✓ Estado actualizado
                        </div>
                      </div>

                      <!-- Fecha estimada de entrega -->
                      <div v-if="tracking.fecha_entrega" style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;background:rgba(99,102,241,0.07);border:1px solid rgba(99,102,241,0.15);">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                        <div>
                          <div style="font-size:10px;font-weight:600;color:rgba(129,140,248,0.7);text-transform:uppercase;letter-spacing:0.7px;">Entrega estimada</div>
                          <div style="font-size:13px;font-weight:700;color:#a5b4fc;margin-top:2px;">{{ tracking.fecha_entrega }}</div>
                        </div>
                      </div>

                      <!-- Dirección de entrega -->
                      <div v-if="tracking.datos_entrega" style="font-size:11px;color:rgba(100,116,139,0.7);line-height:1.6;">
                        <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:4px;">Enviar a</div>
                        <div v-if="tracking.datos_entrega.atencion_a" style="font-weight:600;color:#94a3b8;">{{ tracking.datos_entrega.atencion_a }}</div>
                        <div>{{ [tracking.datos_entrega.calle, tracking.datos_entrega.num_exterior].filter(Boolean).join(' ') }}</div>
                        <div>{{ [tracking.datos_entrega.colonia, tracking.datos_entrega.ciudad, tracking.datos_entrega.estado].filter(Boolean).join(', ') }}</div>
                      </div>

                      <!-- Error de rastreo -->
                      <div v-if="trackingError" style="font-size:11px;color:#fb7185;">{{ trackingError }}</div>
                    </div>
                  </Transition>

                  <!-- Error al consultar -->
                  <div v-if="trackingError && !tracking" style="padding:10px 16px;border-top:1px solid rgba(244,63,94,0.15);font-size:11px;color:#fb7185;">
                    {{ trackingError }}
                  </div>
                </div>

                <!-- Notas -->
                <div v-if="detail.notes" style="border-radius:14px;background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.18);padding:14px 16px;">
                  <div style="font-size:11px;font-weight:700;color:rgba(129,140,248,0.7);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Notas</div>
                  <p style="font-size:13px;color:#94a3b8;line-height:1.65;margin:0;">{{ detail.notes }}</p>
                </div>

                <!-- Acciones admin — solo órdenes pendientes -->
                <div v-if="isManager && detail.status === 'pending'" style="border-radius:14px;background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.2);padding:16px;">
                  <div style="font-size:11px;font-weight:700;color:rgba(251,191,36,0.7);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:12px;">Acción requerida</div>
                  <Transition name="fade">
                    <div v-if="actionError" style="padding:9px 12px;border-radius:8px;background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.25);font-size:12px;color:#fb7185;margin-bottom:10px;">{{ actionError }}</div>
                  </Transition>
                  <Transition name="fade">
                    <div v-if="actionSuccess" style="padding:9px 12px;border-radius:8px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);font-size:12px;color:#34d399;margin-bottom:10px;">{{ actionSuccess }}</div>
                  </Transition>
                  <div style="display:flex;gap:10px;">
                    <button @click="handleAction('reject')" :disabled="actionLoading"
                      style="flex:1;height:40px;border-radius:10px;border:1px solid rgba(244,63,94,0.35);background:rgba(244,63,94,0.08);color:#fb7185;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.15s;"
                      :style="{ opacity: actionLoading ? 0.5 : 1, cursor: actionLoading ? 'not-allowed' : 'pointer' }">
                      Rechazar
                    </button>
                    <button @click="handleAction('approve')" :disabled="actionLoading"
                      style="flex:2;height:40px;border-radius:10px;border:none;background:linear-gradient(135deg,#10B981,#059669);color:white;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px rgba(16,185,129,0.3);transition:all 0.15s;display:flex;align-items:center;justify-content:center;gap:7px;"
                      :style="{ opacity: actionLoading ? 0.6 : 1, cursor: actionLoading ? 'not-allowed' : 'pointer' }">
                      <svg v-if="!actionLoading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      {{ actionLoading ? 'Procesando…' : 'Aprobar y enviar a SYSCOM' }}
                    </button>
                  </div>
                </div>

                <!-- #6 — Retry SYSCOM: aprobada sin folio -->
                <div v-if="isManager && detail.status === 'approved' && !detail.syscomFolio" style="border-radius:14px;background:rgba(14,165,233,0.05);border:1px solid rgba(14,165,233,0.18);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
                  <div>
                    <div style="font-size:12px;font-weight:700;color:#38bdf8;">Sin folio SYSCOM</div>
                    <div style="font-size:11px;color:rgba(56,189,248,0.6);margin-top:2px;">El pedido fue aprobado pero no llegó a SYSCOM.</div>
                  </div>
                  <button @click="retrySyscom(detail)" :disabled="retrying===detail.id"
                    style="height:34px;padding:0 14px;border-radius:8px;border:1px solid rgba(14,165,233,0.35);background:rgba(14,165,233,0.1);color:#38bdf8;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px;flex-shrink:0;"
                    :style="{ opacity: retrying===detail.id ? 0.6 : 1 }">
                    <svg v-if="retrying===detail.id" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    <RefreshCw v-else :size="11" />
                    {{ retrying===detail.id ? 'Enviando…' : 'Reintentar SYSCOM' }}
                  </button>
                </div>

                <!-- #13 — Cancelar pedido (pending o approved) -->
                <div v-if="(detail.status==='pending' || detail.status==='approved') && !isManager" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:10px;">
                  <button @click="cancelOrder(detail)" :disabled="cancelling"
                    style="width:100%;height:36px;border-radius:9px;border:1px solid rgba(244,63,94,0.25);background:rgba(244,63,94,0.06);color:#fb7185;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;"
                    :style="{ opacity: cancelling ? 0.6 : 1, cursor: cancelling ? 'not-allowed' : 'pointer' }">
                    {{ cancelling ? 'Cancelando…' : 'Cancelar pedido' }}
                  </button>
                </div>
                <div v-if="isManager && (detail.status==='pending' || detail.status==='approved')" style="padding-top:4px;">
                  <button @click="cancelOrder(detail)" :disabled="cancelling"
                    style="width:100%;height:34px;border-radius:8px;border:1px solid rgba(148,163,184,0.15);background:transparent;color:rgba(148,163,184,0.5);font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;"
                    :style="{ opacity: cancelling ? 0.6 : 1, cursor: cancelling ? 'not-allowed' : 'pointer' }">
                    {{ cancelling ? 'Cancelando…' : 'Cancelar pedido' }}
                  </button>
                </div>

                <!-- #17 — Audit log -->
                <div v-if="isManager && Array.isArray(detail.auditLog) && detail.auditLog.length" style="border-radius:14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
                  <div style="padding:11px 16px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:11px;font-weight:700;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.8px;">Historial</span>
                  </div>
                  <div style="padding:12px 16px;display:flex;flex-direction:column;gap:8px;">
                    <div v-for="(entry, i) in (detail.auditLog as {status:string;byName:string;at:string}[])" :key="i" style="display:flex;align-items:center;gap:10px;">
                      <div :style="{ width:'7px', height:'7px', borderRadius:'50%', background:statusCfg[entry.status]?.dot??'#94a3b8', flexShrink:0 }" />
                      <span style="font-size:11px;color:#94a3b8;">{{ statusCfg[entry.status]?.label??entry.status }}</span>
                      <span style="font-size:10px;color:rgba(100,116,139,0.55);">por {{ entry.byName }}</span>
                      <span style="font-size:10px;color:rgba(100,116,139,0.4);margin-left:auto;flex-shrink:0;">{{ fmtDate(entry.at) }}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Search, ChevronRight, Clock, Package, AlertCircle, ShoppingCart, User, X, Download, RefreshCw } from '@lucide/vue'
import type { Order, SyscomFactura } from '~/types'

definePageMeta({ middleware: 'auth' })

const auth      = useAuthStore()
const isManager = computed(() => auth.user?.role === 'admin' || auth.user?.role === 'approver')

const orders        = ref<Order[]>([])
const loading       = ref(true)
const error         = ref<string | null>(null)
const detail        = ref<Order | null>(null)
const search        = ref('')
const searchFocus   = ref(false)
const activeTab     = ref('all')
const actionLoading = ref(false)
const actionError   = ref<string | null>(null)
const actionSuccess = ref<string | null>(null)

const statusCfg: Record<string, { label:string; dot:string; color:string; bg:string }> = {
  pending:    { label:'Pendiente',  dot:'#f59e0b', color:'#fbbf24', bg:'rgba(245,158,11,0.12)'  },
  approved:   { label:'Aprobada',   dot:'#10b981', color:'#34d399', bg:'rgba(16,185,129,0.12)'  },
  rejected:   { label:'Rechazada',  dot:'#f43f5e', color:'#fb7185', bg:'rgba(244,63,94,0.12)'   },
  cancelled:  { label:'Cancelada',  dot:'#94a3b8', color:'#94a3b8', bg:'rgba(148,163,184,0.1)'  },
  processing: { label:'En proceso', dot:'#0ea5e9', color:'#38bdf8', bg:'rgba(14,165,233,0.12)'  },
  shipped:    { label:'Enviada',    dot:'#6366f1', color:'#818cf8', bg:'rgba(99,102,241,0.12)'  },
  delivered:  { label:'Entregada',  dot:'#10b981', color:'#34d399', bg:'rgba(16,185,129,0.12)'  },
}

const priCfg: Record<string, { label:string; color:string; bg:string }> = {
  low:    { label:'Baja',    color:'#94a3b8', bg:'rgba(148,163,184,0.1)' },
  normal: { label:'Normal',  color:'#38bdf8', bg:'rgba(14,165,233,0.1)'  },
  high:   { label:'Alta',    color:'#fbbf24', bg:'rgba(245,158,11,0.1)'  },
  urgent: { label:'Urgente', color:'#fb7185', bg:'rgba(244,63,94,0.1)'   },
}

const tabs = [
  { key:'all',        label:'Todas'      },
  { key:'pending',    label:'Pendientes' },
  { key:'approved',   label:'Aprobadas'  },
  { key:'processing', label:'En proceso' },
  { key:'shipped',    label:'Enviadas'   },
  { key:'delivered',  label:'Entregadas' },
  { key:'rejected',   label:'Rechazadas' },
  { key:'cancelled',  label:'Canceladas' },
]

/* ── Timeline ── */
const timeline = [
  { key:'pending',    label:'Pendiente',  color:'#fbbf24', icon:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>' },
  { key:'approved',   label:'Aprobada',   color:'#34d399', icon:'<polyline points="20 6 9 17 4 12"/>' },
  { key:'processing', label:'En proceso', color:'#38bdf8', icon:'<path d="M12 22C6.5 22 2 17.5 2 12A10 10 0 0 1 12 2c5.5 0 10 4.5 10 10"/><polyline points="12 6 12 12 16 14"/>' },
  { key:'shipped',    label:'Enviada',    color:'#818cf8', icon:'<path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect width="13" height="13" x="9" y="9" rx="2"/>' },
  { key:'delivered',  label:'Entregada',  color:'#34d399', icon:'<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>' },
]

const ORDER_FLOW = ['pending', 'approved', 'processing', 'shipped', 'delivered']

function stepState(stepKey: string, currentStatus: string): 'done' | 'active' | 'pending' {
  if (currentStatus === 'rejected') return stepKey === 'pending' ? 'done' : 'pending'
  const currentIdx = ORDER_FLOW.indexOf(currentStatus)
  const stepIdx    = ORDER_FLOW.indexOf(stepKey)
  if (stepIdx < currentIdx)  return 'done'
  if (stepIdx === currentIdx) return 'active'
  return 'pending'
}

function timelineStepPassed(stepKey: string, currentStatus: string): boolean {
  if (currentStatus === 'rejected') return stepKey === 'pending'
  const currentIdx = ORDER_FLOW.indexOf(currentStatus)
  const stepIdx    = ORDER_FLOW.indexOf(stepKey)
  return stepIdx < currentIdx
}

const timelineProgress = computed(() => {
  if (!detail.value) return 0
  if (detail.value.status === 'rejected') return 0
  const idx = ORDER_FLOW.indexOf(detail.value.status)
  if (idx < 0) return 0
  return (idx / (ORDER_FLOW.length - 1)) * 100
})

// #9 — Paginación
const page      = ref(1)
const perPage   = ref(30)
const totalPages = ref(1)
const totalCount = ref(0)

async function load(resetPage = false) {
  if (resetPage) page.value = 1
  loading.value = true; error.value = null
  try {
    const data = await $fetch<{ orders: Order[]; pagination: { total: number; page: number; perPage: number; totalPages: number } }>('/api/orders', {
      query: { page: page.value, per_page: perPage.value },
    })
    orders.value    = data.orders
    totalPages.value = data.pagination.totalPages
    totalCount.value = data.pagination.total
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cargar órdenes'
  } finally { loading.value = false }
}

function prevPage() { if (page.value > 1) { page.value--; load() } }
function nextPage() { if (page.value < totalPages.value) { page.value++; load() } }

onMounted(() => load())

// #6 — Retry SYSCOM
const retrying = ref<string|null>(null)

async function retrySyscom(order: Order) {
  if (retrying.value) return
  retrying.value    = order.id
  actionError.value = null
  try {
    const res = await $fetch<{ folio: string | null; syscomError?: string }>(`/api/orders/${order.id}/retry-syscom`, { method: 'POST' })
    const updated = { ...order, syscomFolio: res.folio }
    orders.value = orders.value.map(o => o.id === order.id ? updated : o)
    if (detail.value?.id === order.id) detail.value = updated
    actionSuccess.value = res.syscomError
      ? `Reintento con advertencia: ${res.syscomError}`
      : `Pedido enviado a SYSCOM · Folio: ${res.folio}`
  } catch (e: unknown) {
    actionError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al reintentar con SYSCOM'
  } finally {
    retrying.value = null
  }
}

// #14 — Cancelar pedido
const cancelling = ref(false)

async function cancelOrder(order: Order) {
  if (!confirm('¿Cancelar este pedido? Esta acción no se puede deshacer.')) return
  cancelling.value  = true
  actionError.value = null
  try {
    const res = await $fetch<{ order: Order }>(`/api/orders/${order.id}`, {
      method: 'PATCH', body: { status: 'cancelled' },
    })
    orders.value = orders.value.map(o => o.id === res.order.id ? res.order : o)
    detail.value = res.order
    actionSuccess.value = 'Pedido cancelado.'
  } catch (e: unknown) {
    actionError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cancelar'
  } finally {
    cancelling.value = false
  }
}

// #16 — Exportar CSV
function exportCSV() {
  const headers = ['ID','Usuario','Email','Estado','Total','Artículos','Folio SYSCOM','Fecha']
  const rows = orders.value.map(o => [
    o.id,
    o.userName ?? '',
    o.userEmail ?? '',
    o.status,
    o.total.toFixed(2),
    (o.items as { quantity: number }[]).reduce((s, i) => s + i.quantity, 0),
    o.syscomFolio ?? '',
    o.createdAt,
  ])
  const csv  = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `ordenes-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function openDetail(order: Order) {
  detail.value        = order
  actionError.value   = null
  actionSuccess.value = null
}

async function handleAction(action: 'approve' | 'reject') {
  if (!detail.value || actionLoading.value) return
  actionLoading.value = true
  actionError.value   = null
  actionSuccess.value = null
  try {
    const res = await $fetch<{ order: Order; syscomError?: string }>(`/api/orders/${detail.value.id}`, {
      method: 'PATCH',
      body: { status: action === 'approve' ? 'approved' : 'rejected' },
    })
    const idx = orders.value.findIndex(o => o.id === res.order.id)
    if (idx >= 0) orders.value[idx] = res.order
    detail.value = res.order
    if (action === 'approve') {
      actionSuccess.value = res.syscomError
        ? `Orden aprobada — advertencia SYSCOM: ${res.syscomError}`
        : `Orden aprobada y enviada a SYSCOM${res.order.syscomFolio ? ` · Folio: ${res.order.syscomFolio}` : ''}`
    } else {
      actionSuccess.value = 'Orden rechazada.'
    }
  } catch (e: unknown) {
    actionError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al procesar la acción'
  } finally {
    actionLoading.value = false
  }
}

const filtered = computed(() => orders.value.filter(o => {
  if (activeTab.value !== 'all' && o.status !== activeTab.value) return false
  const q = search.value.toLowerCase()
  if (!q) return true
  return o.id.toLowerCase().includes(q) || (o.userName ?? '').toLowerCase().includes(q)
}))

function tabCount(key: string) {
  return key === 'all' ? orders.value.length : orders.value.filter(o => o.status === key).length
}

/* ════════════════════════════════
   RASTREO SYSCOM
════════════════════════════════ */
const tracking          = ref<SyscomFactura | null>(null)
const trackingLoading   = ref(false)
const trackingError     = ref('')
const trackingJustUpdated = ref(false)

// Limpiar rastreo al cambiar de pedido
watch(detail, () => {
  tracking.value          = null
  trackingError.value     = ''
  trackingJustUpdated.value = false
})

async function fetchTracking() {
  if (!detail.value?.syscomFolio || trackingLoading.value) return
  trackingLoading.value     = true
  trackingError.value       = ''
  trackingJustUpdated.value = false
  try {
    const res = await $fetch<{ tracking: SyscomFactura; statusUpdated: boolean }>(
      `/api/orders/${detail.value.id}/syscom-track`,
    )
    tracking.value = res.tracking

    if (res.statusUpdated) {
      // Actualizar el status a "delivered" localmente
      trackingJustUpdated.value = true
      const updated = { ...detail.value, status: 'delivered' as const }
      detail.value = updated
      const idx = orders.value.findIndex(o => o.id === updated.id)
      if (idx >= 0) orders.value[idx] = updated
    }
  } catch (e: unknown) {
    trackingError.value = (e as { data?: { message?: string } })?.data?.message ?? 'No se pudo consultar el estado en SYSCOM'
  } finally {
    trackingLoading.value = false
  }
}

const trackingStatusCfg = computed(() => {
  const s = (tracking.value?.estatus ?? tracking.value?.estado ?? '').toLowerCase()
  if (s.includes('entrega') || s.includes('recib'))
    return { dot:'#22c55e', color:'#4ade80', label: tracking.value?.estatus ?? 'Entregado' }
  if (s.includes('enviad') || s.includes('transit'))
    return { dot:'#06b6d4', color:'#22d3ee', label: tracking.value?.estatus ?? 'En tránsito' }
  if (s.includes('cancel'))
    return { dot:'#f43f5e', color:'#fb7185', label: tracking.value?.estatus ?? 'Cancelado' }
  return { dot:'#0ea5e9', color:'#38bdf8', label: tracking.value?.estatus ?? tracking.value?.estado ?? 'En proceso' }
})

const fmtCurrency = (n: number) => new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' }).format(n)
const fmtDate     = (d: string) => new Intl.DateTimeFormat('es-MX', { day:'2-digit', month:'short', year:'numeric' }).format(new Date(d))
const fmtDateLong = (d: string) => new Intl.DateTimeFormat('es-MX', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }).format(new Date(d))
</script>

<style scoped>
.spin { animation: spin 0.8s linear infinite; }
@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
.shimmer-bg { animation: shimmer 1.5s ease-in-out infinite; }
@keyframes shimmer { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
.fade-enter-active,.fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from,.fade-leave-to { opacity: 0; }
.modal-enter-active,.modal-leave-active { transition: opacity 0.22s, transform 0.22s; }
.modal-enter-from,.modal-leave-to { opacity:0; transform:scale(0.97) translateY(-6px); }
.slide-down-enter-active,.slide-down-leave-active { transition: opacity 0.25s, max-height 0.3s ease; overflow:hidden; max-height:400px; }
.slide-down-enter-from,.slide-down-leave-to { opacity:0; max-height:0; }
</style>
