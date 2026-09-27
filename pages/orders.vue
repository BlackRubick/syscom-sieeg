<template>
  <div :style="{ fontFamily:`'Inter',system-ui,sans-serif`, display:'flex', flexDirection:'column', gap:'20px' }">

    <!-- Header -->
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <h1 style="font-size:22px;font-weight:800;color:#E2EAF4;margin:0;">{{ isManager ? 'Todas las órdenes' : 'Mis órdenes' }}</h1>
        <p style="font-size:13px;color:rgba(100,118,142,0.85);margin-top:4px;">
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
    <div v-if="error" style="display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:10px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#EF4444;font-size:13px;">
      <AlertCircle :size="16" style="flex-shrink:0;" />
      <span>{{ error }}</span>
    </div>

    <!-- Filters -->
    <div style="border-radius:16px;background:linear-gradient(160deg,#0C1A2E,#06101E);border:1px solid rgba(255,255,255,0.07);padding:14px 16px;display:flex;flex-direction:column;gap:12px;">
      <div class="of-row">
      <div style="position:relative;flex:1;min-width:220px;max-width:380px;">
        <Search :size="14" style="position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;" :color="searchFocus?'#0EA5E9':'rgba(100,118,142,0.7)'" />
        <input v-model="search" :placeholder="isManager ? 'Buscar por pedido, cliente o número CL-…' : 'Buscar por número de pedido…'"
          @focus="searchFocus=true" @blur="searchFocus=false"
          :style="{ width:'100%', height:'40px', background:searchFocus?'rgba(14,165,233,0.06)':'rgba(255,255,255,0.04)', border:`1px solid ${searchFocus?'rgba(14,165,233,0.45)':'rgba(255,255,255,0.09)'}`, borderRadius:'10px', paddingLeft:'38px', paddingRight:'14px', fontSize:'13px', color:'#E2EAF4', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'all 0.2s' }" />
      </div>
      <template v-if="isManager">
        <FilterCombo v-model="filtroCliente" label="Cliente" placeholder="Nombre, CL-…, correo o empresa" :options="opcionesClientes" />
        <FilterCombo v-model="filtroEmpresa" label="Empresa" placeholder="Razón social o RFC" :options="opcionesEmpresas" />
        <button v-if="filtroCliente || filtroEmpresa" type="button" class="of-clear" @click="filtroCliente = ''; filtroEmpresa = ''">Quitar filtros</button>
      </template>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab=tab.key"
          :style="{ display:'flex', alignItems:'center', gap:'5px', flexShrink:0, height:'30px', padding:'0 12px', borderRadius:'6px', fontSize:'12px', fontWeight:activeTab===tab.key?600:400, cursor:'pointer', border:'none', fontFamily:'inherit', background:activeTab===tab.key?'rgba(14,165,233,0.15)':'rgba(255,255,255,0.04)', color:activeTab===tab.key?'#7DD3FC':'rgba(100,118,142,0.75)', outline:`1px solid ${activeTab===tab.key?'rgba(14,165,233,0.35)':'rgba(255,255,255,0.07)'}` }">
          {{ tab.label }}
          <span v-if="!loading" :style="{ fontSize:'10px', fontWeight:700, background:activeTab===tab.key?'rgba(14,165,233,0.2)':'rgba(255,255,255,0.07)', padding:'1px 5px', borderRadius:'4px', color:activeTab===tab.key?'#7DD3FC':'rgba(100,118,142,0.8)' }">{{ tabCount(tab.key) }}</span>
        </button>
      </div>
    </div>

    <!-- List -->
    <div style="display:flex;flex-direction:column;gap:8px;">

      <!-- Skeletons -->
      <template v-if="loading">
        <div v-for="i in 5" :key="i" style="border-radius:14px;background:linear-gradient(160deg,#0C1A2E,#06101E);border:1px solid rgba(255,255,255,0.07);padding:16px 18px;display:flex;align-items:center;gap:14px;">
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
          :style="{ borderRadius:'14px', background:'linear-gradient(160deg,#0C1A2E,#06101E)', border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden', boxShadow:'0 3px 14px rgba(0,0,0,0.3)', transition:'all 0.18s', cursor:'pointer' }"
          @mouseenter="e => { (e.currentTarget as HTMLElement).style.border='1px solid rgba(14,165,233,0.18)'; (e.currentTarget as HTMLElement).style.transform='translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 24px rgba(0,0,0,0.4)' }"
          @mouseleave="e => { (e.currentTarget as HTMLElement).style.border='1px solid rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform='translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow='0 3px 14px rgba(0,0,0,0.3)' }">

          <div style="display:flex;align-items:center;gap:14px;padding:14px 18px;">
            <!-- Indicador estado -->
            <div :style="{ width:'9px', height:'9px', borderRadius:'50%', background:statusCfg[order.status].dot, boxShadow:`0 0 7px ${statusCfg[order.status].dot}80`, flexShrink:0 }" />

            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
                <span style="font-size:12px;font-weight:700;color:#E2EAF4;font-family:monospace;">{{ order.id.slice(-8).toUpperCase() }}</span>
                <span :style="{ fontSize:'10px', fontWeight:600, padding:'2px 8px', borderRadius:'20px', background:statusCfg[order.status].bg, color:statusCfg[order.status].color }">{{ statusCfg[order.status].label }}</span>
                <span :style="{ fontSize:'10px', fontWeight:600, padding:'2px 8px', borderRadius:'20px', background:priCfg[order.priority]?.bg??priCfg.normal.bg, color:priCfg[order.priority]?.color??priCfg.normal.color }">{{ priCfg[order.priority]?.label??'Normal' }}</span>
                <!-- Pago -->
                <template v-if="order.paymentId">
                  <span :style="{ fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'20px', background: order.paymentStatus==='paid' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.12)', color: order.paymentStatus==='paid' ? '#22C55E' : '#fbbf24' }">
                    {{ order.paymentStatus === 'paid' ? '✓ Pagado' : 'Pago pendiente' }}
                  </span>
                  <span style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;background:rgba(99,102,241,0.12);color:#a5b4fc;">
                    {{ order.paymentMethod === 'spei' ? 'SPEI' : 'Tarjeta' }}
                  </span>
                </template>
              </div>
              <div v-if="order.syscomFolio" class="sy-row">
                <span class="sy-folio" title="Folio del pedido en SYSCOM">SYSCOM {{ order.syscomFolio }}</span>
                <span v-if="order.syscomEstado" class="sy-pill" :style="syscomStyle(order.syscomEstado.estado)" :title="order.syscomEstado.detalle">
                  <span class="sy-dot" :style="{ background: syscomStyle(order.syscomEstado.estado).color }" />{{ order.syscomEstado.label }}
                </span>
                <span v-else class="sy-pill sy-pill-muted">Consultando estado…</span>
                <span v-if="order.syscomEstado?.guia" class="sy-guia">Guía {{ order.syscomEstado.guia }}</span>
              </div>
              <div v-else-if="isManager && order.status === 'approved'" class="sy-row">
                <span class="sy-pill" style="background:rgba(239,68,68,0.12);color:#f87171;">Sin folio SYSCOM</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <Clock :size="11" color="rgba(100,118,142,0.6)" />
                <span style="font-size:11px;color:rgba(100,118,142,0.8);">{{ fmtDate(order.createdAt) }}</span>
                <template v-if="isManager && order.userName">
                  <span style="color:rgba(100,118,142,0.5);font-size:11px;">·</span>
                  <User :size="11" color="rgba(100,118,142,0.5)" />
                  <span style="font-size:11px;color:rgba(100,118,142,0.8);">{{ order.userName }}</span>
                  <span v-if="order.clientNumber" class="cl-num">{{ formatClientNumber(order.clientNumber) }}</span>
                </template>
              </div>
            </div>

            <div style="text-align:center;flex-shrink:0;">
              <div style="font-size:13px;font-weight:700;color:#E2EAF4;">{{ order.items.length }}</div>
              <div style="font-size:10px;color:rgba(100,118,142,0.6);">producto{{ order.items.length!==1?'s':'' }}</div>
            </div>

            <div style="text-align:right;flex-shrink:0;">
              <div style="font-size:14px;font-weight:700;color:#E2EAF4;">{{ order.total > 0 ? fmtCurrency(order.total) : '—' }}</div>
              <div style="font-size:10px;color:rgba(100,118,142,0.6);margin-top:1px;">MXN · IVA incl.</div>
            </div>

            <ChevronRight :size="15" color="rgba(100,118,142,0.5)" style="flex-shrink:0;" />
          </div>
        </div>
      </template>

      <div v-if="!loading && !error && !filtered.length" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;border-radius:16px;background:linear-gradient(160deg,#0C1A2E,#06101E);border:1px solid rgba(255,255,255,0.07);gap:12px;">
        <Package :size="36" color="rgba(100,118,142,0.5)" :stroke-width="1.5" />
        <div style="font-size:14px;font-weight:600;color:#94a3b8;">Sin órdenes</div>
        <div style="font-size:12px;color:rgba(100,118,142,0.7);">{{ activeTab==='all' ? 'Aún no tienes órdenes' : 'No hay órdenes con este estado' }}</div>
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
      <span style="font-size:12px;color:rgba(100,118,142,0.7);">Página {{ page }} de {{ totalPages }} · {{ totalCount }} total</span>
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
      <div v-if="detail" class="od-backdrop" @click="detail=null" />
    </Transition>
    <Transition name="modal">
      <div v-if="detail" class="od-wrap" @click.self="detail=null">
        <div class="od-modal" role="dialog" aria-modal="true">

          <!-- ── Header ── -->
          <header class="od-head">
            <div class="od-head-row">
              <div style="min-width:0;">
                <div class="od-title-row">
                  <span class="od-id">#{{ detail.id.slice(-8).toUpperCase() }}</span>
                  <span class="od-pill" :style="{ background:statusCfg[detail.status].bg, color:statusCfg[detail.status].color }">{{ statusCfg[detail.status].label }}</span>
                  <span class="od-pill" :style="{ background:priCfg[detail.priority]?.bg??priCfg.normal.bg, color:priCfg[detail.priority]?.color??priCfg.normal.color }">Prioridad {{ (priCfg[detail.priority]?.label??'Normal').toLowerCase() }}</span>
                </div>
                <div class="od-sub">
                  <Clock :size="12" /> {{ fmtDateLong(detail.createdAt) }}
                  <template v-if="isManager && detail.userName"><span class="od-dot">·</span><User :size="12" /> {{ detail.userName }}<span v-if="detail.clientNumber" class="cl-num">{{ formatClientNumber(detail.clientNumber) }}</span></template>
                </div>
              </div>
              <div class="od-head-right">
                <div class="od-head-total">
                  <div class="od-label">Total (IVA incluido)</div>
                  <div class="od-total">{{ fmtCurrency(detailTotals.total) }}</div>
                </div>
                <button class="od-close" aria-label="Cerrar" @click="detail=null"><X :size="15" /></button>
              </div>
            </div>

            <!-- Timeline -->
            <div v-if="detail.status==='rejected' || detail.status==='cancelled'" class="od-ended" :style="{ color:statusCfg[detail.status].color, background:statusCfg[detail.status].bg }">
              Este pedido fue {{ detail.status==='rejected' ? 'rechazado' : 'cancelado' }}.
            </div>
            <div v-else class="od-timeline">
              <div class="od-tl-base" />
              <div class="od-tl-progress" :style="{ width: `calc((100% - 52px) * ${timelineProgress / 100})` }" />
              <div v-for="step in timeline" :key="step.key" class="od-tl-step">
                <div class="od-tl-dot" :style="{ background: stepState(step.key,detail.status)==='pending' ? '#091228' : step.color+'30', borderColor: stepState(step.key,detail.status)!=='pending' ? step.color : 'rgba(255,255,255,0.12)', boxShadow: stepState(step.key,detail.status)==='active' ? `0 0 12px ${step.color}70` : 'none' }">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" :stroke="stepState(step.key,detail.status)!=='pending' ? step.color : 'rgba(100,118,142,0.4)'" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" v-html="step.icon" />
                </div>
                <span class="od-tl-label" :style="{ color: stepState(step.key,detail.status)!=='pending' ? step.color : 'rgba(100,118,142,0.5)', fontWeight: stepState(step.key,detail.status)==='active' ? 700 : 500 }">{{ step.label }}</span>
              </div>
            </div>
          </header>

          <!-- ── Cuerpo (scroll) ── -->
          <div class="od-body">

            <Transition name="fade"><div v-if="actionError" class="od-alert od-alert-err">{{ actionError }}</div></Transition>
            <Transition name="fade"><div v-if="actionSuccess" class="od-alert od-alert-ok">{{ actionSuccess }}</div></Transition>

            <!-- Acciones admin (pendiente) — arriba para que se vean sin hacer scroll -->
            <section v-if="isManager && detail.status === 'pending'" class="od-card od-card-warn">
              <div class="od-card-title" style="color:rgba(251,191,36,0.85);">Acción requerida</div>
              <p class="od-muted" style="margin:0 0 12px;">Al aprobar se genera el pedido real en SYSCOM con cargo a tu cuenta.</p>
              <div v-if="!detail.entrega" class="od-alert od-alert-err" style="margin-bottom:12px;">Este cliente no tiene dirección de entrega: SYSCOM rechazará el pedido. Captura sus datos en <b>Datos Fiscales</b> antes de aprobar.</div>
              <div class="od-actions">
                <button class="od-btn od-btn-danger" :disabled="actionLoading" @click="handleAction('reject')">Rechazar</button>
                <button class="od-btn od-btn-ok" :disabled="actionLoading" @click="handleAction('approve')">
                  <svg v-if="actionLoading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ actionLoading ? 'Procesando…' : 'Aprobar y enviar a SYSCOM' }}
                </button>
              </div>
            </section>

            <!-- Aprobada sin folio: reintento -->
            <section v-if="isManager && detail.status === 'approved' && !detail.syscomFolio" class="od-card od-card-err">
              <div class="od-row-between">
                <div style="min-width:0;">
                  <div class="od-card-title" style="color:#fca5a5;margin-bottom:4px;">No llegó a SYSCOM</div>
                  <div class="od-muted">El pedido está aprobado pero SYSCOM no lo registró.</div>
                  <div v-if="lastSyscomError" class="od-reason">Motivo: {{ lastSyscomError }}</div>
                </div>
                <button class="od-btn od-btn-sky" :disabled="retrying===detail.id" @click="retrySyscom(detail)">
                  <svg v-if="retrying===detail.id" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  <RefreshCw v-else :size="12" />
                  {{ retrying===detail.id ? 'Enviando…' : 'Reintentar' }}
                </button>
              </div>
            </section>

            <!-- Productos + totales -->
            <section class="od-card od-card-flush">
              <div class="od-card-head">
                <span class="od-card-title"><Package :size="13" /> Productos</span>
                <span class="od-muted">{{ detail.items.length }} producto{{ detail.items.length!==1?'s':'' }} · {{ totalPiezas }} pieza{{ totalPiezas!==1?'s':'' }}</span>
              </div>
              <div v-for="item in detail.items" :key="item.productId" class="od-item">
                <div class="od-item-img">
                  <img v-if="item.images?.[0]" :src="item.images[0]" alt="" @error="(e)=>(e.currentTarget as HTMLImageElement).style.display='none'" />
                  <Package v-else :size="18" color="#7DD3FC" :stroke-width="1.5" />
                </div>
                <div class="od-item-info">
                  <div class="od-item-name" :title="item.name">{{ item.name }}</div>
                  <div class="od-item-meta">
                    <span v-if="item.sku" class="od-mono">{{ item.sku }}</span>
                    <span v-if="almacenesDe(item.productId)" class="od-tag">{{ almacenesDe(item.productId) }}</span>
                  </div>
                </div>
                <div class="od-item-price">
                  <div class="od-muted">{{ item.quantity }} × {{ fmtCurrency(item.price) }}</div>
                  <div class="od-strong">{{ fmtCurrency(item.price * item.quantity) }}</div>
                </div>
              </div>
              <div class="od-totals">
                <div v-if="detail.shippingFee" class="od-kv"><span>Envío (IVA incluido)</span><span>{{ fmtCurrency(detail.shippingFee) }}</span></div>
                <div class="od-kv"><span>Subtotal (sin IVA)</span><span>{{ fmtCurrency(detailTotals.subtotal) }}</span></div>
                <div class="od-kv"><span>IVA (16%)</span><span>{{ fmtCurrency(detailTotals.iva) }}</span></div>
                <div class="od-kv od-kv-total"><span>Total (IVA incluido)</span><span>{{ fmtCurrency(detailTotals.total) }}</span></div>
              </div>
            </section>

            <!-- Cliente + Entrega -->
            <div class="od-grid2">
              <section class="od-card">
                <div class="od-card-title" style="margin-bottom:10px;"><User :size="13" /> Cliente</div>
                <div v-if="detail.clientNumber" class="od-kv"><span>No. de cliente</span><b class="od-mono" style="color:#7DD3FC;">{{ formatClientNumber(detail.clientNumber) }}</b></div>
                <div class="od-kv"><span>Nombre</span><b>{{ detail.userName || '—' }}</b></div>
                <div v-if="detail.userEmail" class="od-kv"><span>Correo</span><b class="od-break">{{ detail.userEmail }}</b></div>
                <div class="od-kv"><span>RFC</span><b class="od-mono">{{ detail.cliente?.rfc || '—' }}</b></div>
                <div v-if="detail.cliente?.razonSocial" class="od-kv"><span>Razón social</span><b>{{ detail.cliente.razonSocial }}</b></div>
                <div v-if="detail.cliente?.regimen" class="od-kv"><span>Régimen</span><b>{{ detail.cliente.regimen }}</b></div>
                <div v-if="detail.cliente?.usoCfdi" class="od-kv"><span>Uso CFDI</span><b>{{ detail.cliente.usoCfdi }}</b></div>
              </section>
              <section class="od-card">
                <div class="od-row-between" style="margin-bottom:10px;">
                  <span class="od-card-title"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> Entrega</span>
                  <span v-if="detail.entrega" class="od-tag" :style="detail.entrega.fuente==='syscom' ? 'background:rgba(34,197,94,0.12);color:#4ade80;' : ''">{{ detail.entrega.fuente==='syscom' ? 'Confirmada por SYSCOM' : 'Dirección fiscal' }}</span>
                </div>
                <template v-if="detail.entrega">
                  <div class="od-strong" style="font-size:13px;">{{ detail.entrega.atencionA }}</div>
                  <div class="od-text">{{ detail.entrega.linea1 }}</div>
                  <div class="od-text">{{ detail.entrega.linea2 }}<template v-if="detail.entrega.cp"> · C.P. {{ detail.entrega.cp }}</template></div>
                  <div v-if="detail.entrega.telefono" class="od-muted" style="margin-top:6px;">Tel. {{ detail.entrega.telefono }}</div>
                </template>
                <div v-else class="od-muted">El cliente no ha capturado su dirección.</div>
              </section>
            </div>

            <!-- SYSCOM -->
            <section v-if="detail.syscomFolio" class="od-card od-card-ok">
              <div class="od-row-between">
                <div>
                  <div class="od-label" style="color:rgba(74,222,128,0.8);">Folio SYSCOM</div>
                  <div class="od-folio">{{ detail.syscomFolio }}</div>
                </div>
                <button class="od-btn od-btn-green" :disabled="trackingLoading" @click="fetchTracking">
                  <svg v-if="trackingLoading" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  <RefreshCw v-else :size="12" />
                  {{ trackingLoading ? 'Consultando…' : 'Actualizar estado' }}
                </button>
              </div>

              <div v-if="detail.syscomEstado" class="od-tracking">
                <div style="display:flex;align-items:flex-start;gap:10px;">
                  <span class="od-status-dot" :style="{ background: syscomStyle(detail.syscomEstado.estado).color }" />
                  <div style="min-width:0;flex:1;">
                    <div class="od-strong" :style="{ color: syscomStyle(detail.syscomEstado.estado).color }">{{ detail.syscomEstado.label }}</div>
                    <div v-if="detail.syscomEstado.detalle" class="od-muted">{{ detail.syscomEstado.detalle }}</div>
                  </div>
                  <span v-if="trackingJustUpdated" class="od-tag" style="background:rgba(34,197,94,0.15);color:#22C55E;">✓ Pedido actualizado</span>
                </div>
                <div v-if="detail.syscomEstado.fletera" class="od-kv"><span>Paquetería</span><b>{{ detail.syscomEstado.fletera }}</b></div>
                <div v-if="detail.syscomEstado.guia" class="od-kv"><span>Guía</span><b class="od-mono">{{ detail.syscomEstado.guia }}</b></div>
                <div v-if="isManager && detail.syscomEstado.factura" class="od-kv"><span>Factura SYSCOM</span><b class="od-mono">{{ detail.syscomEstado.factura }}</b></div>
                <ol v-if="isManager && detail.syscomEstado.pasos?.length" class="od-log" style="margin-top:6px;">
                  <li v-for="(p, i) in detail.syscomEstado.pasos" :key="i">
                    <span class="od-status-dot" style="background:rgba(74,222,128,0.6);" />
                    <div class="od-log-note" style="margin:0;">{{ p.mensaje }}<span v-if="p.fecha && p.fecha !== '0'" class="od-muted"> · {{ p.fecha }}</span></div>
                  </li>
                </ol>
                <div v-if="detail.syscomEstado.consultado" class="od-muted" style="font-size:10.5px;">Consultado {{ fmtDateLong(detail.syscomEstado.consultado) }}</div>
              </div>
              <div v-else class="od-muted" style="margin-top:10px;">Aún no se ha consultado el estado en SYSCOM.</div>
              <div v-if="trackingError" class="od-reason">{{ trackingError }}</div>

              <!-- Costo SYSCOM vs venta (solo admin/approver) -->
              <div v-if="isManager && detail.syscom" class="od-cost">
                <div class="od-kv"><span>Costo productos SYSCOM</span><span>{{ fmtCurrency(detail.syscom.subtotal ?? 0) }}</span></div>
                <div class="od-kv"><span>Flete</span><span>{{ fmtCurrency(detail.syscom.flete ?? 0) }}</span></div>
                <div class="od-kv"><span>IVA</span><span>{{ fmtCurrency(detail.syscom.iva ?? 0) }}</span></div>
                <div class="od-kv od-strong"><span>Total pagado a SYSCOM</span><span>{{ fmtCurrency(detail.syscom.total ?? 0) }}</span></div>
                <div class="od-kv od-margin" :class="utilidad < 0 ? 'neg' : 'pos'">
                  <span>Utilidad estimada (sin IVA)</span><span>{{ fmtCurrency(utilidad) }}</span>
                </div>
              </div>

            </section>

            <!-- Pago -->
            <section v-if="detail.paymentId" class="od-card">
              <div class="od-row-between">
                <div style="min-width:0;">
                  <div class="od-card-title" style="margin-bottom:4px;">{{ detail.paymentMethod === 'spei' ? 'Transferencia SPEI' : 'Pago con tarjeta' }} · OpenPay</div>
                  <div class="od-mono od-muted od-break">{{ detail.paymentId }}</div>
                </div>
                <span class="od-pill" :style="payStatus.style">{{ payStatus.label }}</span>
              </div>
              <div v-if="detail.paymentMethod === 'spei' && detail.paymentData" class="od-grid2" style="margin-top:12px;">
                <div><div class="od-label">CLABE</div><div class="od-mono od-strong" style="color:#6ee7b7;">{{ detail.paymentData.clabe }}</div></div>
                <div><div class="od-label">Banco</div><div class="od-text">{{ detail.paymentData.bank }}</div></div>
                <div><div class="od-label">Convenio CIE</div><div class="od-mono od-strong" style="color:#22C55E;">{{ detail.paymentData.agreement }}</div></div>
              </div>
              <div v-if="isManager && detail.paymentMethod === 'spei' && detail.paymentStatus !== 'paid'" class="od-reason" style="color:rgba(251,191,36,0.9);">Verifica la recepción de la transferencia antes de aprobar.</div>
            </section>

            <!-- Notas -->
            <section v-if="detail.notes" class="od-card">
              <div class="od-card-title" style="margin-bottom:6px;">Notas del cliente</div>
              <p class="od-text" style="margin:0;white-space:pre-wrap;">{{ detail.notes }}</p>
            </section>

            <!-- Historial -->
            <section v-if="isManager && Array.isArray(detail.auditLog) && detail.auditLog.length" class="od-card">
              <div class="od-card-title" style="margin-bottom:10px;">Historial</div>
              <ol class="od-log">
                <li v-for="(entry, i) in (detail.auditLog as AuditEntry[])" :key="i">
                  <span class="od-status-dot" :style="{ background: statusCfg[entry.status]?.dot ?? '#94a3b8' }" />
                  <div style="min-width:0;flex:1;">
                    <div class="od-row-between" style="gap:8px;">
                      <span class="od-text"><b>{{ entry.retry ? 'Reintento SYSCOM' : (statusCfg[entry.status]?.label ?? entry.status) }}</b> <span class="od-muted">por {{ entry.byName }}</span></span>
                      <span class="od-muted" style="white-space:nowrap;">{{ fmtDateLong(entry.at) }}</span>
                    </div>
                    <div v-if="entry.syscomFolio" class="od-log-note" style="color:#4ade80;">Folio SYSCOM {{ entry.syscomFolio }}</div>
                    <div v-if="entry.syscomError" class="od-log-note" style="color:#fca5a5;">{{ entry.syscomError }}</div>
                    <div v-if="entry.note" class="od-log-note">{{ entry.note }}</div>
                  </div>
                </li>
              </ol>
            </section>

            <!-- Cancelar -->
            <section v-if="detail.status==='pending' || detail.status==='approved'" class="od-cancel">
              <p v-if="detail.syscomFolio && isManager" class="od-muted" style="margin:0 0 8px;">Cancelar aquí <b>no</b> cancela el pedido en SYSCOM ({{ detail.syscomFolio }}); cancélalo también con tu ejecutivo.</p>
              <button class="od-btn od-btn-ghost" :disabled="cancelling" @click="cancelOrder(detail)">{{ cancelling ? 'Cancelando…' : 'Cancelar pedido' }}</button>
            </section>

            <footer class="od-meta">
              <span>ID <span class="od-mono">{{ detail.id }}</span></span>
              <span>Actualizada {{ fmtDateLong(detail.updatedAt) }}</span>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Search, ChevronRight, Clock, Package, AlertCircle, ShoppingCart, User, X, Download, RefreshCw } from '@lucide/vue'
import type { Order } from '~/types'

definePageMeta({ middleware: 'auth' })

const auth      = useAuthStore()
const isManager = computed(() => auth.user?.role === 'admin' || auth.user?.role === 'approver')

const orders        = ref<Order[]>([])
const loading       = ref(true)
const error         = ref<string | null>(null)
const detail        = ref<Order | null>(null)
const lastSyscomError = computed(() => {
  const log = (detail.value?.auditLog ?? []) as Array<{ syscomError?: string }>
  return [...log].reverse().find(e => e.syscomError)?.syscomError ?? ''
})
type AuditEntry = { status: string; byName: string; at: string; retry?: boolean; syscomFolio?: string; syscomError?: string; note?: string }

const totalPiezas = computed(() => (detail.value?.items ?? []).reduce((s, i) => s + i.quantity, 0))

// Almacén SYSCOM que surte cada producto (solo lo recibe admin/approver)
function almacenesDe(productId: string): string {
  const a = detail.value?.syscom?.almacenes.find(x => x.productId === String(productId))?.almacenes
  if (!a) return ''
  return Object.entries(a).map(([k, v]) => (Object.keys(a).length > 1 ? `${k} (${v})` : k)).join(', ')
}

// Venta sin IVA − (costo SYSCOM + flete), ambos sin IVA
const utilidad = computed(() => {
  const sc = detail.value?.syscom
  if (!sc) return 0
  return Math.round((detailTotals.value.subtotal - (sc.subtotal ?? 0) - (sc.flete ?? 0)) * 100) / 100
})

const PAY_STATUS: Record<string, { label: string; ok?: boolean; bad?: boolean }> = {
  paid:         { label: 'Pagado', ok: true },
  pending:      { label: 'Pendiente' },
  pending_3ds:  { label: 'Pendiente · 3D Secure' },
  pending_spei: { label: 'Esperando transferencia' },
  in_progress:  { label: 'En proceso' },
  failed:       { label: 'Fallido', bad: true },
  cancelled:    { label: 'Cancelado', bad: true },
}
const payStatus = computed(() => {
  const st = PAY_STATUS[detail.value?.paymentStatus ?? ''] ?? { label: detail.value?.paymentStatus ?? 'Pendiente' }
  return {
    label: st.label,
    style: st.ok  ? { background: 'rgba(34,197,94,0.15)', color: '#22C55E' }
         : st.bad ? { background: 'rgba(239,68,68,0.12)', color: '#EF4444' }
         :          { background: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  }
})

const detailTotals  = computed(() => detail.value
  ? desgloseTotales(detail.value.total)
  : { subtotal: 0, iva: 0, total: 0 })
const search        = ref('')
const searchFocus   = ref(false)
const activeTab     = ref('all')
const actionLoading = ref(false)
const actionError   = ref<string | null>(null)
const actionSuccess = ref<string | null>(null)

const statusCfg: Record<string, { label:string; dot:string; color:string; bg:string }> = {
  pending:    { label:'Pendiente',  dot:'#F59E0B', color:'#fbbf24', bg:'rgba(245,158,11,0.12)'  },
  approved:   { label:'Aprobada',   dot:'#22C55E', color:'#22C55E', bg:'rgba(34,197,94,0.12)'  },
  rejected:   { label:'Rechazada',  dot:'#f43f5e', color:'#EF4444', bg:'rgba(239,68,68,0.12)'   },
  cancelled:  { label:'Cancelada',  dot:'#94a3b8', color:'#94a3b8', bg:'rgba(123,146,176,0.1)'  },
  processing: { label:'En proceso', dot:'#7DD3FC', color:'#7DD3FC', bg:'rgba(14,165,233,0.12)'  },
  shipped:    { label:'Enviada',    dot:'#6366f1', color:'#F59E0B', bg:'rgba(99,102,241,0.12)'  },
  delivered:  { label:'Entregada',  dot:'#22C55E', color:'#22C55E', bg:'rgba(34,197,94,0.12)'  },
}

const priCfg: Record<string, { label:string; color:string; bg:string }> = {
  low:    { label:'Baja',    color:'#94a3b8', bg:'rgba(123,146,176,0.1)' },
  normal: { label:'Normal',  color:'#7DD3FC', bg:'rgba(14,165,233,0.1)'  },
  high:   { label:'Alta',    color:'#fbbf24', bg:'rgba(245,158,11,0.1)'  },
  urgent: { label:'Urgente', color:'#EF4444', bg:'rgba(239,68,68,0.1)'   },
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
  { key:'approved',   label:'Aprobada',   color:'#22C55E', icon:'<polyline points="20 6 9 17 4 12"/>' },
  { key:'processing', label:'En proceso', color:'#7DD3FC', icon:'<path d="M12 22C6.5 22 2 17.5 2 12A10 10 0 0 1 12 2c5.5 0 10 4.5 10 10"/><polyline points="12 6 12 12 16 14"/>' },
  { key:'shipped',    label:'Enviada',    color:'#F59E0B', icon:'<path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect width="13" height="13" x="9" y="9" rx="2"/>' },
  { key:'delivered',  label:'Entregada',  color:'#22C55E', icon:'<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>' },
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
      query: {
        page: page.value, per_page: perPage.value,
        ...(search.value.trim() ? { search: search.value.trim() } : {}),
        ...(filtroCliente.value ? { cliente: filtroCliente.value } : {}),
        ...(filtroEmpresa.value ? { empresa: filtroEmpresa.value } : {}),
      },
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

/* ── Filtros por cliente y empresa (admin/approver) ── */
const route  = useRoute()
const router = useRouter()
const filtroCliente = ref(typeof route.query.cliente === 'string' ? route.query.cliente : '')
const filtroEmpresa = ref(typeof route.query.empresa === 'string' ? route.query.empresa : '')

interface FiltrosResp {
  clientes: Array<{ id: string; nombre: string; email: string; clientNumber: number | null; empresa: string | null; pedidos: number }>
  empresas: Array<{ nombre: string; rfc: string; usuarios: number; pedidos: number }>
}
const filtros = ref<FiltrosResp>({ clientes: [], empresas: [] })
const opcionesClientes = computed(() => filtros.value.clientes
  .filter(c => !filtroEmpresa.value || c.empresa === filtroEmpresa.value)
  .map(c => ({ value: c.id, label: c.nombre, badge: formatClientNumber(c.clientNumber), sub: c.empresa ?? c.email, count: c.pedidos, search: c.email })))
const opcionesEmpresas = computed(() => filtros.value.empresas.map(e => ({
  value: e.nombre, label: e.nombre, sub: [e.rfc, `${e.usuarios} usuario${e.usuarios !== 1 ? 's' : ''}`].filter(Boolean).join(' · '), count: e.pedidos,
})))

onMounted(async () => {
  if (!isManager.value) return
  try { filtros.value = await $fetch<FiltrosResp>('/api/orders/filters') } catch { /* los filtros son opcionales */ }
})

watch([filtroCliente, filtroEmpresa], ([c, e], [cAntes]) => {
  // Cliente y empresa incompatibles: se conserva el que se acaba de elegir
  if (c && e && filtros.value.clientes.find(x => x.id === c)?.empresa !== e) {
    if (c !== cAntes) filtroEmpresa.value = ''
    else filtroCliente.value = ''
    return
  }
  router.replace({ query: { ...route.query, cliente: c || undefined, empresa: e || undefined } })
  load(true)
})

// Buscar en todos los pedidos (no solo en la página cargada)
let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => load(true), 350)
})

// #6 — Retry SYSCOM
const retrying = ref<string|null>(null)

async function retrySyscom(order: Order) {
  if (retrying.value) return
  retrying.value    = order.id
  actionError.value = null
  try {
    const res = await $fetch<{ folio: string | null; syscomError?: string; order?: Order }>(`/api/orders/${order.id}/retry-syscom`, { method: 'POST' })
    const updated = res.order ?? { ...order, syscomFolio: res.folio }
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
  const headers = ['ID','No. cliente','Usuario','Email','Estado','Subtotal','IVA','Total con IVA','Artículos','Folio SYSCOM','Fecha']
  const rows = orders.value.map(o => {
    const t = desgloseTotales(o.total)
    return [
    o.id,
    formatClientNumber(o.clientNumber),
    o.userName ?? '',
    o.userEmail ?? '',
    o.status,
    t.subtotal.toFixed(2),
    t.iva.toFixed(2),
    t.total.toFixed(2),
    (o.items as { quantity: number }[]).reduce((s, i) => s + i.quantity, 0),
    o.syscomFolio ?? '',
    o.createdAt,
  ]})
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
  const num = parseClientNumber(q)
  return o.id.toLowerCase().includes(q)
    || (o.userName ?? '').toLowerCase().includes(q)
    || (o.userEmail ?? '').toLowerCase().includes(q)
    || (num !== null && o.clientNumber === num)
}))

function tabCount(key: string) {
  return key === 'all' ? orders.value.length : orders.value.filter(o => o.status === key).length
}

/* ════════════════════════════════
   ESTADO SYSCOM
════════════════════════════════ */
const trackingLoading     = ref(false)
const trackingError       = ref('')
const trackingJustUpdated = ref(false)

watch(() => detail.value?.id, () => {
  trackingError.value       = ''
  trackingJustUpdated.value = false
})

function reemplazarOrden(o: Order) {
  const idx = orders.value.findIndex(x => x.id === o.id)
  if (idx >= 0) orders.value[idx] = o
  if (detail.value?.id === o.id) detail.value = o
}

async function fetchTracking() {
  if (!detail.value?.syscomFolio || trackingLoading.value) return
  trackingLoading.value     = true
  trackingError.value       = ''
  trackingJustUpdated.value = false
  try {
    const res = await $fetch<{ statusUpdated: string | null; order: Order }>(`/api/orders/${detail.value.id}/syscom-track`)
    reemplazarOrden(res.order)
    trackingJustUpdated.value = !!res.statusUpdated
  } catch (e: unknown) {
    trackingError.value = (e as { data?: { message?: string } })?.data?.message ?? 'No se pudo consultar el estado en SYSCOM'
  } finally {
    trackingLoading.value = false
  }
}

// Al abrir la página, actualizar en segundo plano los estados SYSCOM desactualizados
async function refrescarEstadosSyscom() {
  try {
    const r = await $fetch<{ actualizados: number }>('/api/orders/syscom-refresh', { method: 'POST' })
    if (r.actualizados > 0) await load()
  } catch { /* silencioso: la lista ya muestra el último estado guardado */ }
}
onMounted(() => { refrescarEstadosSyscom() })

const SYSCOM_COLORS: Record<string, { color: string; background: string }> = {
  pendiente_pago: { color: '#fbbf24', background: 'rgba(245,158,11,0.12)' },
  autorizado:     { color: '#7DD3FC', background: 'rgba(14,165,233,0.12)' },
  en_proceso:     { color: '#7DD3FC', background: 'rgba(14,165,233,0.12)' },
  facturado:      { color: '#a5b4fc', background: 'rgba(99,102,241,0.14)' },
  en_camino:      { color: '#c4b5fd', background: 'rgba(139,92,246,0.14)' },
  entregado:      { color: '#4ade80', background: 'rgba(34,197,94,0.14)' },
  cancelado:      { color: '#f87171', background: 'rgba(239,68,68,0.12)' },
}
const syscomStyle = (estado?: string) => SYSCOM_COLORS[estado ?? ''] ?? { color: '#94a3b8', background: 'rgba(148,163,184,0.12)' }

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

.of-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.of-clear { height:40px; padding:0 14px; border-radius:10px; border:1px solid rgba(239,68,68,0.25); background:rgba(239,68,68,0.06); color:#f87171; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; }
.of-clear:hover { background:rgba(239,68,68,0.12); }

.sy-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:5px; }
.sy-folio { font-size:10.5px; font-weight:700; font-family:ui-monospace,'SF Mono',Menlo,monospace; color:#6ee7b7; background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.22); padding:1px 8px; border-radius:6px; }
.sy-pill { display:inline-flex; align-items:center; gap:5px; font-size:10.5px; font-weight:700; padding:2px 9px; border-radius:20px; }
.sy-pill-muted { color:rgba(148,163,184,0.8); background:rgba(148,163,184,0.1); font-weight:500; }
.sy-dot { width:6px; height:6px; border-radius:50%; }
.sy-guia { font-size:10.5px; color:rgba(148,163,184,0.85); font-family:ui-monospace,monospace; }

.cl-num { display:inline-block; margin-left:6px; font-size:10px; font-weight:700; font-family:ui-monospace,'SF Mono',Menlo,monospace; padding:1px 7px; border-radius:6px; color:#7DD3FC; background:rgba(14,165,233,0.1); border:1px solid rgba(14,165,233,0.2); }

/* ── Modal detalle de pedido ── */
.od-backdrop { position:fixed; inset:0; background:rgba(2,6,14,0.82); backdrop-filter:blur(7px); z-index:1050; }
.od-wrap { position:fixed; inset:0; z-index:1051; display:flex; align-items:center; justify-content:center; padding:16px; }
.od-modal { width:100%; max-width:760px; max-height:calc(100vh - 32px); max-height:calc(100dvh - 32px); display:flex; flex-direction:column; overflow:hidden;
  border-radius:20px; background:linear-gradient(160deg,#0C1A2E,#06101E); border:1px solid rgba(14,165,233,0.22); box-shadow:0 32px 80px rgba(0,0,0,0.75); font-family:'Inter',system-ui,sans-serif; color:#E2EAF4; }
.od-head { flex-shrink:0; padding:20px 24px 16px; border-bottom:1px solid rgba(255,255,255,0.07); }
.od-head-row { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
.od-head-right { display:flex; align-items:flex-start; gap:14px; flex-shrink:0; }
.od-head-total { text-align:right; }
.od-title-row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.od-id { font-size:18px; font-weight:800; font-family:ui-monospace,monospace; letter-spacing:0.5px; }
.od-pill { font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; white-space:nowrap; }
.od-sub { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:6px; font-size:12px; color:rgba(123,146,176,0.85); }
.od-dot { opacity:0.5; }
.od-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:rgba(100,118,142,0.75); margin-bottom:3px; }
.od-total { font-size:22px; font-weight:800; letter-spacing:-0.3px; }
.od-close { width:32px; height:32px; border-radius:9px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:rgba(123,146,176,0.9); display:flex; align-items:center; justify-content:center; cursor:pointer; }
.od-close:hover { background:rgba(255,255,255,0.1); }
.od-ended { margin-top:14px; padding:9px 12px; border-radius:10px; font-size:12px; font-weight:600; }
.od-timeline { position:relative; display:flex; justify-content:space-between; margin-top:18px; }
.od-tl-base, .od-tl-progress { position:absolute; top:13px; left:26px; height:2px; border-radius:2px; }
.od-tl-base { right:26px; background:rgba(255,255,255,0.08); }
.od-tl-progress { background:linear-gradient(90deg,#fbbf24,#22C55E,#7DD3FC); transition:width 0.4s ease; }
.od-tl-step { position:relative; display:flex; flex-direction:column; align-items:center; gap:6px; width:52px; }
.od-tl-dot { width:28px; height:28px; border-radius:50%; border:2px solid; display:flex; align-items:center; justify-content:center; }
.od-tl-label { font-size:10px; white-space:nowrap; }

.od-body { flex:1; min-height:0; overflow-y:auto; overscroll-behavior:contain; padding:18px 24px 20px; display:flex; flex-direction:column; gap:14px; }
.od-body > * { flex-shrink:0; }
.od-card { border-radius:14px; background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07); padding:14px 16px; }
.od-card-flush { padding:0; overflow:hidden; }
.od-card-warn { background:rgba(245,158,11,0.06); border-color:rgba(245,158,11,0.25); }
.od-card-err  { background:rgba(239,68,68,0.06);  border-color:rgba(239,68,68,0.25); }
.od-card-ok   { background:rgba(34,197,94,0.05);  border-color:rgba(34,197,94,0.22); }
.od-card-head { display:flex; justify-content:space-between; align-items:center; gap:10px; padding:12px 16px; border-bottom:1px solid rgba(255,255,255,0.06); }
.od-card-title { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:rgba(148,163,184,0.85); }
.od-row-between { display:flex; justify-content:space-between; align-items:center; gap:12px; }
.od-muted { font-size:11.5px; color:rgba(123,146,176,0.8); line-height:1.5; }
.od-text { font-size:12.5px; color:#b6c3d4; line-height:1.55; }
.od-strong { font-weight:700; color:#E2EAF4; }
.od-mono { font-family:ui-monospace,'SF Mono',Menlo,monospace; }
.od-break { word-break:break-all; }
.od-tag { font-size:10px; font-weight:600; padding:2px 8px; border-radius:20px; background:rgba(14,165,233,0.12); color:#7DD3FC; white-space:nowrap; }
.od-reason { margin-top:8px; font-size:12px; color:#fca5a5; line-height:1.5; }

.od-item { display:flex; align-items:center; gap:12px; padding:12px 16px; border-bottom:1px solid rgba(255,255,255,0.05); }
.od-item-img { width:48px; height:48px; border-radius:10px; background:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:hidden; }
.od-item-img img { width:44px; height:44px; object-fit:contain; }
.od-item-info { flex:1; min-width:0; }
.od-item-name { font-size:13px; font-weight:500; color:#d5deea; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.od-item-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:4px; font-size:11px; color:rgba(123,146,176,0.8); }
.od-item-price { text-align:right; flex-shrink:0; }
.od-item-price .od-strong { font-size:13.5px; margin-top:2px; }

.od-totals { padding:12px 16px; background:rgba(14,165,233,0.05); display:flex; flex-direction:column; gap:6px; }
.od-kv { display:flex; justify-content:space-between; align-items:baseline; gap:14px; font-size:12.5px; color:#94a3b8; padding:2px 0; }
.od-kv > span:first-child { color:rgba(123,146,176,0.85); flex-shrink:0; }
.od-kv > b { font-weight:600; color:#d5deea; text-align:right; min-width:0; }
.od-kv-total { margin-top:4px; padding-top:8px; border-top:1px solid rgba(14,165,233,0.18); font-size:14px; }
.od-kv-total > span { color:#E2EAF4 !important; font-weight:800; }
.od-kv-total > span:last-child { font-size:18px; }

.od-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.od-folio { font-size:15px; font-weight:800; color:#6ee7b7; font-family:ui-monospace,monospace; }
.od-cost { margin-top:12px; padding-top:10px; border-top:1px solid rgba(34,197,94,0.15); }
.od-margin { margin-top:4px; padding:6px 10px; border-radius:8px; font-weight:700; }
.od-margin.pos { background:rgba(34,197,94,0.1); } .od-margin.pos > span { color:#4ade80 !important; }
.od-margin.neg { background:rgba(239,68,68,0.12); } .od-margin.neg > span { color:#f87171 !important; }
.od-tracking { margin-top:12px; padding-top:12px; border-top:1px solid rgba(34,197,94,0.15); display:flex; flex-direction:column; gap:8px; }
.od-status-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:5px; }

.od-log { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:10px; }
.od-log li { display:flex; gap:10px; align-items:flex-start; }
.od-log-note { font-size:11.5px; color:rgba(148,163,184,0.85); margin-top:2px; line-height:1.45; word-break:break-word; }

.od-alert { padding:10px 14px; border-radius:10px; font-size:12.5px; line-height:1.5; }
.od-alert-err { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); color:#fca5a5; }
.od-alert-ok  { background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.25); color:#4ade80; }
.od-actions { display:flex; gap:10px; }
.od-btn { height:38px; padding:0 16px; border-radius:10px; font-size:12.5px; font-weight:700; font-family:inherit; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:7px; white-space:nowrap; transition:opacity 0.15s, background 0.15s; }
.od-btn:disabled { opacity:0.55; cursor:not-allowed; }
.od-btn-ok     { flex:2; border:none; background:linear-gradient(135deg,#22C55E,#059669); color:#fff; box-shadow:0 4px 14px rgba(34,197,94,0.3); }
.od-btn-danger { flex:1; border:1px solid rgba(239,68,68,0.35); background:rgba(239,68,68,0.08); color:#f87171; }
.od-btn-sky    { border:1px solid rgba(14,165,233,0.35); background:rgba(14,165,233,0.1); color:#7DD3FC; flex-shrink:0; }
.od-btn-green  { border:1px solid rgba(34,197,94,0.3); background:rgba(34,197,94,0.1); color:#4ade80; flex-shrink:0; }
.od-btn-ghost  { width:100%; border:1px solid rgba(239,68,68,0.2); background:transparent; color:rgba(248,113,113,0.8); font-weight:600; }
.od-btn-ghost:hover:not(:disabled) { background:rgba(239,68,68,0.06); }
.od-cancel { padding-top:2px; }
.od-meta { display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; font-size:10.5px; color:rgba(100,118,142,0.6); padding-top:4px; }

@media (max-width: 640px) {
  .od-wrap { padding:0; align-items:flex-end; }
  .od-modal { max-height:94vh; max-height:94dvh; border-radius:18px 18px 0 0; }
  .od-head { padding:16px 16px 12px; }
  .od-body { padding:14px 16px 18px; }
  .od-head-total { display:none; }
  .od-grid2 { grid-template-columns:1fr; }
  .od-tl-step { width:44px; }
  .od-tl-label { font-size:9px; }
  .od-actions { flex-direction:column-reverse; }
  .od-item { flex-wrap:wrap; }
  .od-item-price { width:100%; display:flex; justify-content:space-between; align-items:baseline; padding-left:60px; }
}
</style>
