<template>
  <div :style="{ fontFamily:`'Inter',system-ui,sans-serif` }">

    <!-- Header -->
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
      <div>
        <h1 style="font-size:22px;font-weight:800;color:#F1F5F9;margin:0;">Facturación CFDI 4.0</h1>
        <p style="font-size:13px;color:rgba(100,116,139,0.85);margin-top:4px;">
          <template v-if="tab==='orders'">
            <span v-if="loadingOrders">Cargando pedidos…</span>
            <span v-else>{{ orders.length }} pedido{{ orders.length!==1?'s':'' }} · {{ listos }} listo{{ listos!==1?'s':'' }} para facturar</span>
          </template>
          <template v-else>
            <span v-if="loadingCfdis">Cargando facturas…</span>
            <span v-else-if="cfdiError" style="color:#fb7185;">{{ cfdiError }}</span>
            <span v-else>Serie S · {{ cfdis.length }} CFDI{{ cfdis.length!==1?'s':'' }} emitido{{ cfdis.length!==1?'s':'' }}
              <template v-if="totalFacturado>0"> · <span style="color:#a5b4fc;">{{ fmtMXN(totalFacturado) }}</span></template>
            </span>
          </template>
        </p>
      </div>
      <!-- Botón Factura Global (solo visible en tab Órdenes) -->
      <button v-if="tab==='orders' && !loadingOrders" @click="globalOpen=true" :disabled="!pendingForGlobal.length"
        :style="{ height:'40px', padding:'0 18px', borderRadius:'11px', border:'1px solid rgba(245,158,11,0.35)', fontSize:'13px', fontWeight:700, cursor:!pendingForGlobal.length?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'8px', transition:'all 0.2s', opacity:!pendingForGlobal.length?0.4:1,
          background: 'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(217,119,6,0.08))', color:'#fbbf24',
          boxShadow: pendingForGlobal.length ? '0 4px 16px rgba(245,158,11,0.15)' : 'none' }">
        <FileText :size="14" />
        Factura Global
        <span v-if="pendingForGlobal.length" style="padding:1px 7px;border-radius:20px;background:rgba(245,158,11,0.2);font-size:10px;font-weight:700;">{{ pendingForGlobal.length }}</span>
      </button>
    </div>

    <!-- Tabs -->
    <div style="display:flex;gap:4px;margin-bottom:20px;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);padding:4px;width:fit-content;">
      <button v-for="t in tabs" :key="t.key" @click="tab=t.key"
        :style="{ height:'34px', padding:'0 18px', borderRadius:'9px', border:'none', fontSize:'12.5px', fontWeight:tab===t.key?700:500, cursor:'pointer', fontFamily:'inherit', transition:'all 0.18s',
          background: tab===t.key ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'transparent',
          color:      tab===t.key ? '#fff' : 'rgba(100,116,139,0.8)',
          boxShadow:  tab===t.key ? '0 2px 10px rgba(99,102,241,0.3)' : 'none' }">
        {{ t.label }}
      </button>
    </div>

    <!-- ══════════════════════════════════════════════ -->
    <!-- PESTAÑA: PEDIDOS                              -->
    <!-- ══════════════════════════════════════════════ -->
    <template v-if="tab==='orders'">

      <!-- KPIs pedidos -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;">
        <div v-for="k in orderKpis" :key="k.label" style="border-radius:14px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:16px 18px;">
          <div :style="{ fontSize:'24px', fontWeight:800, background:k.grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }">
            {{ loadingOrders ? '—' : k.value }}
          </div>
          <div style="font-size:11px;color:rgba(100,116,139,0.8);margin-top:4px;font-weight:500;">{{ k.label }}</div>
        </div>
      </div>

      <!-- Filtros pedidos -->
      <div style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:14px 16px;margin-bottom:20px;display:flex;flex-direction:column;gap:10px;">
        <div style="position:relative;max-width:360px;">
          <Search :size="13" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;" :color="orderSearchFocus?'#6366f1':'rgba(100,116,139,0.6)'" />
          <input v-model="orderSearch" placeholder="Buscar por cliente, RFC o folio SYSCOM…"
            @focus="orderSearchFocus=true" @blur="orderSearchFocus=false"
            :style="{ width:'100%', height:'38px', background: orderSearchFocus?'rgba(99,102,241,0.06)':'rgba(255,255,255,0.04)', border:`1px solid ${orderSearchFocus?'rgba(99,102,241,0.4)':'rgba(255,255,255,0.08)'}`, borderRadius:'9px', paddingLeft:'36px', paddingRight:'12px', fontSize:'12px', color:'#E2E8F0', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'all 0.2s' }" />
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button v-for="f in orderFilters" :key="f.key" @click="orderFilter=f.key"
            :style="{ height:'28px', padding:'0 12px', borderRadius:'20px', fontSize:'11px', fontWeight:orderFilter===f.key?600:500, cursor:'pointer', border:'none', fontFamily:'inherit',
              background: orderFilter===f.key ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'rgba(255,255,255,0.05)',
              color:      orderFilter===f.key ? '#fff' : 'rgba(100,116,139,0.9)',
              boxShadow:  orderFilter===f.key ? '0 2px 8px rgba(99,102,241,0.25)' : 'none' }">
            {{ f.label }}
          </button>
        </div>
      </div>

      <!-- Skeleton pedidos -->
      <div v-if="loadingOrders" style="display:flex;flex-direction:column;gap:3px;">
        <div v-for="i in 5" :key="i" class="pulse" style="border-radius:12px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);height:72px;" />
      </div>

      <!-- Tabla pedidos -->
      <div v-else-if="filteredOrders.length>0" style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
        <div style="display:grid;grid-template-columns:0.8fr 1.6fr 0.7fr 0.8fr 0.9fr 120px;gap:0;padding:10px 18px;border-bottom:1px solid rgba(255,255,255,0.07);">
          <span v-for="h in ['Pedido','Cliente','Artículos','Total','Estado fiscal','Acción']" :key="h"
            style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);text-transform:uppercase;letter-spacing:0.8px;">{{ h }}</span>
        </div>

        <div v-for="(o, idx) in filteredOrders" :key="o.id"
          :style="{ display:'grid', gridTemplateColumns:'0.8fr 1.6fr 0.7fr 0.8fr 0.9fr 120px', gap:0, padding:'12px 18px', borderBottom: idx<filteredOrders.length-1?'1px solid rgba(255,255,255,0.05)':'none', alignItems:'center' }">

          <!-- Pedido -->
          <div>
            <div style="font-size:12px;font-weight:600;color:#E2E8F0;font-family:monospace;">{{ o.id.slice(-6).toUpperCase() }}</div>
            <div style="font-size:10px;color:rgba(100,116,139,0.5);margin-top:2px;">{{ fmtDate(o.createdAt) }}</div>
          </div>

          <!-- Cliente -->
          <div style="min-width:0;">
            <div style="font-size:12px;font-weight:600;color:#E2E8F0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ o.userName }}</div>
            <div style="font-size:10px;font-weight:600;color:#38bdf8;font-family:monospace;margin-top:2px;">{{ o.userFiscalRfc ?? 'Sin RFC' }}</div>
          </div>

          <!-- Artículos -->
          <div>
            <div style="font-size:12px;font-weight:600;color:#E2E8F0;">{{ (o.items as OrderItem[]).length }} art.</div>
          </div>

          <!-- Total -->
          <div style="font-size:12px;font-weight:700;color:#a5b4fc;">{{ fmtMXN(o.total) }}</div>

          <!-- Estado fiscal -->
          <div>
            <span :style="billBadgeStyle(o)">{{ billBadgeLabel(o) }}</span>
          </div>

          <!-- Acción -->
          <div>
            <!-- Ya facturado -->
            <div v-if="o.cfdiUid"
              style="display:flex;align-items:center;gap:5px;font-size:10px;font-weight:600;color:#818cf8;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              CFDI emitido
            </div>
            <!-- Listo para facturar -->
            <button v-else-if="canBill(o)" @click="openCfdiFromOrder(o)"
              style="height:32px;padding:0 14px;border-radius:8px;background:linear-gradient(135deg,#6366f1,#4f46e5);border:none;color:#fff;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:5px;white-space:nowrap;box-shadow:0 2px 8px rgba(99,102,241,0.3);">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="17" x="5" y="2" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>
              Facturar
            </button>
            <!-- Sin sincronizar -->
            <button v-else-if="o.userFiscalCompleted && !o.userFacturaUid" @click="syncUser(o)" :disabled="syncing===o.userId"
              :style="{ height:'32px', padding:'0 12px', borderRadius:'8px', background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)', color:'#818cf8', fontSize:'11px', fontWeight:600, cursor:syncing===o.userId?'not-allowed':'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:'5px', opacity:syncing===o.userId?0.6:1 }">
              <svg v-if="syncing===o.userId" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
              {{ syncing===o.userId ? 'Sincronizando…' : 'Sincronizar' }}
            </button>
            <!-- Bloqueado sin datos -->
            <div v-else style="font-size:10px;color:rgba(100,116,139,0.35);line-height:1.3;">{{ billBlockReason(o) }}</div>
          </div>

        </div>
      </div>

      <div v-else-if="!loadingOrders" style="display:flex;align-items:center;justify-content:center;padding:50px;border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);font-size:13px;color:#94a3b8;">
        No se encontraron pedidos
      </div>

    </template>

    <!-- ══════════════════════════════════════════════ -->
    <!-- PESTAÑA: EMITIDAS                             -->
    <!-- ══════════════════════════════════════════════ -->
    <template v-else>

      <!-- KPIs CFDIs -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;">
        <div v-for="k in cfdiKpis" :key="k.label" style="border-radius:14px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:16px 18px;">
          <div :style="{ fontSize:'24px', fontWeight:800, background:k.grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1 }">
            {{ loadingCfdis ? '—' : k.value }}
          </div>
          <div style="font-size:11px;color:rgba(100,116,139,0.8);margin-top:4px;font-weight:500;">{{ k.label }}</div>
        </div>
      </div>

      <!-- Búsqueda CFDIs -->
      <div style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:14px 16px;margin-bottom:20px;">
        <div style="position:relative;max-width:360px;">
          <Search :size="13" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;" :color="cfdiSearchFocus?'#6366f1':'rgba(100,116,139,0.6)'" />
          <input v-model="cfdiSearch" placeholder="Buscar por folio, RFC o nombre…"
            @focus="cfdiSearchFocus=true" @blur="cfdiSearchFocus=false"
            :style="{ width:'100%', height:'38px', background: cfdiSearchFocus?'rgba(99,102,241,0.06)':'rgba(255,255,255,0.04)', border:`1px solid ${cfdiSearchFocus?'rgba(99,102,241,0.4)':'rgba(255,255,255,0.08)'}`, borderRadius:'9px', paddingLeft:'36px', paddingRight:'12px', fontSize:'12px', color:'#E2E8F0', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'all 0.2s' }" />
        </div>
      </div>

      <!-- Skeleton CFDIs -->
      <div v-if="loadingCfdis" style="display:flex;flex-direction:column;gap:3px;">
        <div v-for="i in 5" :key="i" class="pulse" style="border-radius:12px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);height:64px;" />
      </div>

      <!-- Tabla CFDIs -->
      <div v-else-if="filteredCfdis.length>0" style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
        <div style="display:grid;grid-template-columns:0.8fr 2fr 1fr 1fr 0.9fr 90px;gap:0;padding:10px 18px;border-bottom:1px solid rgba(255,255,255,0.07);">
          <span v-for="h in ['Folio','Cliente','Fecha','Total','Estado','']" :key="h"
            style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);text-transform:uppercase;letter-spacing:0.8px;">{{ h }}</span>
        </div>
        <div v-for="(c, idx) in filteredCfdis" :key="c.UID"
          :style="{ display:'grid', gridTemplateColumns:'0.8fr 2fr 1fr 1fr 0.9fr 90px', gap:0, padding:'11px 18px', borderBottom: idx<filteredCfdis.length-1?'1px solid rgba(255,255,255,0.05)':'none', alignItems:'center' }">

          <div>
            <div style="font-size:12px;font-weight:700;color:#E2E8F0;font-family:monospace;">{{ c.Folio ?? '—' }}</div>
            <div style="font-size:9px;color:rgba(100,116,139,0.45);margin-top:2px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" :title="c.UUID">{{ c.UUID.slice(0,18) }}…</div>
          </div>

          <div style="min-width:0;">
            <div style="font-size:12px;font-weight:600;color:#E2E8F0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ c.RazonSocialReceptor ?? '—' }}</div>
            <div style="font-size:10px;font-weight:600;color:#38bdf8;font-family:monospace;margin-top:2px;">{{ c.Receptor ?? '' }}</div>
          </div>

          <div style="font-size:11px;color:rgba(148,163,184,0.8);">{{ fmtDate(c.FechaTimbrado) }}</div>

          <div>
            <div style="font-size:13px;font-weight:700;color:#a5b4fc;">{{ fmtMXN(Number(c.Total??0)) }}</div>
            <div style="font-size:10px;color:rgba(100,116,139,0.5);">MXN</div>
          </div>

          <div><span :style="cfdiStatusStyle(c.Status)">{{ cfdiStatusLabel(c.Status) }}</span></div>

          <div style="display:flex;gap:6px;justify-content:flex-end;">
            <button @click="download(c.UID,'pdf')" :disabled="downloading===c.UID+'-pdf'" title="PDF"
              :style="{ width:'32px', height:'32px', borderRadius:'8px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', cursor:downloading===c.UID+'-pdf'?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity:downloading===c.UID+'-pdf'?0.5:1 }">
              <svg v-if="downloading===c.UID+'-pdf'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
            <button @click="download(c.UID,'xml')" :disabled="downloading===c.UID+'-xml'" title="XML"
              :style="{ width:'32px', height:'32px', borderRadius:'8px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', color:'#34d399', cursor:downloading===c.UID+'-xml'?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity:downloading===c.UID+'-xml'?0.5:1 }">
              <svg v-if="downloading===c.UID+'-xml'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="!loadingCfdis && !cfdiError" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);gap:12px;text-align:center;">
        <div style="width:48px;height:48px;border-radius:14px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.15);display:flex;align-items:center;justify-content:center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M12 16H8"/></svg>
        </div>
        <div style="font-size:14px;font-weight:600;color:#94a3b8;">No hay CFDIs serie S emitidos</div>
        <div style="font-size:12px;color:rgba(100,116,139,0.6);">Ve a la pestaña "Pedidos" para facturar a un cliente</div>
      </div>

      <!-- #18 — Paginación CFDIs -->
      <div v-if="!loadingCfdis && cfdiTotalPages > 1" style="display:flex;align-items:center;justify-content:center;gap:10px;margin-top:12px;">
        <button @click="prevCfdiPage" :disabled="cfdiPage===1"
          style="height:32px;padding:0 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#94a3b8;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;"
          :style="{ opacity: cfdiPage===1 ? 0.4 : 1, cursor: cfdiPage===1 ? 'not-allowed' : 'pointer' }">
          ← Anterior
        </button>
        <span style="font-size:12px;color:rgba(100,116,139,0.7);">Página {{ cfdiPage }} de {{ cfdiTotalPages }}</span>
        <button @click="nextCfdiPage" :disabled="cfdiPage===cfdiTotalPages"
          style="height:32px;padding:0 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:#94a3b8;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;"
          :style="{ opacity: cfdiPage===cfdiTotalPages ? 0.4 : 1, cursor: cfdiPage===cfdiTotalPages ? 'not-allowed' : 'pointer' }">
          Siguiente →
        </button>
      </div>

    </template>

    <!-- Toast error descarga -->
    <div v-if="downloadError" style="position:fixed;bottom:24px;right:24px;padding:12px 18px;border-radius:10px;background:#1e0a0f;border:1px solid rgba(244,63,94,0.3);font-size:12px;color:#fb7185;z-index:2000;display:flex;align-items:center;gap:10px;box-shadow:0 8px 30px rgba(0,0,0,0.5);">
      {{ downloadError }}
      <button @click="downloadError=''" style="background:none;border:none;color:#fb7185;cursor:pointer;padding:0;font-size:16px;line-height:1;">×</button>
    </div>
  </div>

  <!-- ══ Modal CFDI individual ══ -->
  <CfdiModal
    v-if="cfdiUser"
    :user="cfdiUser"
    :open="cfdiOpen"
    :initial-conceptos="cfdiConceptos"
    :order-id="cfdiOrderId"
    @close="cfdiOpen=false; cfdiUser=null"
    @created="onCfdiCreated"
  />

  <!-- ══ Modal Factura Global ══ -->
  <GlobalCfdiModal
    :open="globalOpen"
    :pending-orders="pendingForGlobal"
    @close="globalOpen=false"
    @created="onGlobalCreated"
  />
</template>

<script setup lang="ts">
import { Search, FileText } from '@lucide/vue'
import type { OrderItem } from '~/types'

definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
if (auth.user?.role !== 'admin') navigateTo('/catalog')

/* ── Tabs ── */
const tab  = ref<'orders'|'emitidas'>('orders')
const tabs = [
  { key: 'orders',   label: 'Órdenes' },
  { key: 'emitidas', label: 'Emitidas' },
]

/* ════════════════════════════════
   PEDIDOS
════════════════════════════════ */
interface BillingOrder {
  id:                    string
  userId:                string
  userName:              string
  userEmail:             string
  userFacturaUid:        string | null
  userFiscalCompleted:   boolean
  userFiscalRfc:         string | null
  userFiscalRazonSocial: string | null
  userFiscalUsocfdi:     string | null
  userFiscalRegimen:     string | null
  status:                string
  items:                 OrderItem[]
  total:                 number
  priority:              string
  notes:                 string | null
  syscomFolio:           string | null
  cfdiUid:               string | null
  createdAt:             string
  updatedAt:             string
}

const orders       = ref<BillingOrder[]>([])
const loadingOrders = ref(true)
const orderSearch  = ref('')
const orderSearchFocus = ref(false)
const orderFilter  = ref('all')

const orderFilters = [
  { key: 'all',     label: 'Todos' },
  { key: 'ready',   label: 'Listos para facturar' },
  { key: 'no_data', label: 'Sin datos fiscales' },
  { key: 'no_sync', label: 'Sin sincronizar' },
]

onMounted(async () => {
  try {
    const data = await $fetch<{ orders: BillingOrder[] }>('/api/factura/orders')
    orders.value = data.orders
  } catch { /**/ } finally {
    loadingOrders.value = false
  }
})

function canBill(o: BillingOrder) {
  return !o.cfdiUid && !!(o.userFacturaUid && o.userFiscalCompleted && o.userFiscalUsocfdi)
}
function billBlockReason(o: BillingOrder) {
  if (o.cfdiUid)              return 'CFDI emitido'
  if (!o.userFiscalCompleted) return 'Sin datos fiscales'
  if (!o.userFacturaUid)      return 'Sin sincronizar'
  if (!o.userFiscalUsocfdi)   return 'Sin uso CFDI'
  return ''
}
function billBadgeLabel(o: BillingOrder) {
  if (o.cfdiUid)             return 'Facturado'
  if (canBill(o))            return 'Listo'
  if (o.userFiscalCompleted) return 'Sin sincronizar'
  return 'Sin datos'
}
function billBadgeStyle(o: BillingOrder) {
  if (o.cfdiUid) return { fontSize:'10px', fontWeight:600, padding:'2px 8px', borderRadius:'20px', background:'rgba(99,102,241,0.1)', color:'#818cf8' }
  const ready   = canBill(o)
  const partial = !ready && o.userFiscalCompleted
  return {
    fontSize:'10px', fontWeight:600, padding:'2px 8px', borderRadius:'20px',
    background: ready   ? 'rgba(16,185,129,0.1)' : partial ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.08)',
    color:      ready   ? '#34d399'              : partial ? '#fbbf24'              : 'rgba(100,116,139,0.5)',
  }
}

const listos = computed(() => orders.value.filter(canBill).length)

const orderKpis = computed(() => [
  { label: 'Total pedidos',         value: orders.value.length,                                                      grad:'linear-gradient(135deg,#0EA5E9,#22D3EE)' },
  { label: 'Listos para facturar',  value: listos.value,                                                             grad:'linear-gradient(135deg,#6366f1,#818cf8)' },
  { label: 'Sin datos fiscales',    value: orders.value.filter(o=>!o.userFiscalCompleted).length,                    grad:'linear-gradient(135deg,#F59E0B,#FCD34D)' },
  { label: 'Sin sincronizar',       value: orders.value.filter(o=>o.userFiscalCompleted&&!o.userFacturaUid).length,  grad:'linear-gradient(135deg,#F43F5E,#FB7185)' },
])

const filteredOrders = computed(() => {
  let list = orders.value
  if (orderFilter.value === 'ready')   list = list.filter(canBill)
  if (orderFilter.value === 'no_data') list = list.filter(o => !o.userFiscalCompleted)
  if (orderFilter.value === 'no_sync') list = list.filter(o => o.userFiscalCompleted && !o.userFacturaUid)
  const q = orderSearch.value.toLowerCase()
  if (!q) return list
  return list.filter(o =>
    o.userName.toLowerCase().includes(q)
    || (o.userFiscalRfc ?? '').toLowerCase().includes(q)
    || (o.syscomFolio   ?? '').toLowerCase().includes(q)
    || o.id.toLowerCase().includes(q)
  )
})

/* ── Sincronizar con Factura.com ── */
const syncing = ref<string|null>(null)

async function syncUser(o: BillingOrder) {
  syncing.value = o.userId
  try {
    const res = await $fetch<{ facturaUid: string }>('/api/factura/clients/sync', {
      method: 'POST', body: { userId: o.userId },
    })
    orders.value = orders.value.map(order =>
      order.userId === o.userId ? { ...order, userFacturaUid: res.facturaUid } : order
    )
  } catch { /**/ } finally {
    syncing.value = null
  }
}

/* ════════════════════════════════
   CFDIs EMITIDOS
════════════════════════════════ */
interface CfdiItem {
  UUID:                 string
  UID:                  string
  Folio?:               string
  FechaTimbrado?:       string
  Receptor?:            string
  RazonSocialReceptor?: string
  Total?:               string
  Subtotal?:            string
  NumOrder?:            string
  Status?:              string
}

const cfdis        = ref<CfdiItem[]>([])
const loadingCfdis = ref(false)
const cfdiError    = ref('')
const cfdiSearch   = ref('')
const cfdiSearchFocus = ref(false)

// #18 — Paginación de CFDIs
const cfdiPage      = ref(1)
const cfdiPerPage   = ref(50)
const cfdiTotalPages = ref(1)

async function fetchCfdis(force = false) {
  if (!force && cfdis.value.length > 0) return
  loadingCfdis.value = true
  cfdiError.value    = ''
  try {
    const data = await $fetch<{ data: CfdiItem[]; total?: number }>('/api/factura/cfdi', {
      query: { per_page: cfdiPerPage.value, page: cfdiPage.value },
    })
    cfdis.value = (data.data ?? []).filter(c => c.Folio?.toUpperCase().startsWith('S'))
    if (data.total) cfdiTotalPages.value = Math.ceil(data.total / cfdiPerPage.value)
  } catch (e: unknown) {
    cfdiError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al cargar facturas'
  } finally {
    loadingCfdis.value = false
  }
}

function prevCfdiPage() { if (cfdiPage.value > 1) { cfdiPage.value--; cfdis.value = []; fetchCfdis(true) } }
function nextCfdiPage() { if (cfdiPage.value < cfdiTotalPages.value) { cfdiPage.value++; cfdis.value = []; fetchCfdis(true) } }

watch(tab, (t) => { if (t === 'emitidas') fetchCfdis() })

const totalFacturado = computed(() => cfdis.value.reduce((s,c) => s + Number(c.Total??0), 0))
const thisMonth = computed(() => {
  const now = new Date()
  const mm  = String(now.getMonth()+1).padStart(2,'0')
  const yy  = String(now.getFullYear())
  return cfdis.value.filter(c => c.FechaTimbrado?.startsWith(`${yy}-${mm}`)).length
})

const cfdiKpis = computed(() => [
  { label:'Total emitidas',  value: cfdis.value.length,         grad:'linear-gradient(135deg,#6366f1,#818cf8)' },
  { label:'Total facturado', value: fmtMXN(totalFacturado.value), grad:'linear-gradient(135deg,#0EA5E9,#22D3EE)' },
  { label:'Este mes',        value: thisMonth.value,            grad:'linear-gradient(135deg,#10b981,#34d399)' },
])

const filteredCfdis = computed(() => {
  const q = cfdiSearch.value.toLowerCase()
  if (!q) return cfdis.value
  return cfdis.value.filter(c =>
    (c.RazonSocialReceptor??'').toLowerCase().includes(q)
    || (c.Receptor??'').toLowerCase().includes(q)
    || (c.Folio??'').toLowerCase().includes(q)
    || c.UUID.toLowerCase().includes(q)
  )
})

function cfdiStatusLabel(s?: string) {
  const map: Record<string,string> = { enviada:'Enviada', active:'Vigente', vigente:'Vigente', cancelled:'Cancelada', canceled:'Cancelada', cancelada:'Cancelada' }
  return s ? (map[s.toLowerCase()] ?? s) : '—'
}
function cfdiStatusStyle(s?: string) {
  const ok = ['enviada','active','vigente'].includes((s??'').toLowerCase())
  return { fontSize:'10px', fontWeight:600, padding:'2px 9px', borderRadius:'20px', background:ok?'rgba(16,185,129,0.1)':'rgba(244,63,94,0.1)', color:ok?'#34d399':'#fb7185' }
}

/* ── Descarga PDF/XML ── */
const downloading  = ref<string|null>(null)
const downloadError = ref('')

async function download(uid: string, format: 'pdf'|'xml') {
  const key = `${uid}-${format}`
  if (downloading.value===key) return
  downloading.value   = key
  downloadError.value = ''
  try {
    const res  = await fetch(`/api/factura/cfdi/${uid}/${format}`)
    if (!res.ok) throw new Error(`${res.status}`)
    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `cfdi-${uid}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    downloadError.value = `No se pudo descargar el ${format.toUpperCase()}`
    setTimeout(() => { downloadError.value = '' }, 5000)
  } finally {
    downloading.value = null
  }
}

/* ════════════════════════════════
   CFDI MODAL
════════════════════════════════ */
interface CfdiUser {
  id:               string
  fiscalRfc?:       string | null
  fiscalRazonSocial?: string | null
  fiscalUsocfdi?:   string | null
  fiscalRegimen?:   string | null
  facturaUid?:      string | null
}

const cfdiOpen      = ref(false)
const cfdiUser      = ref<CfdiUser|null>(null)
const cfdiConceptos = ref<unknown[]>([])
const cfdiOrderId   = ref<string|undefined>(undefined)

async function openCfdiFromOrder(o: BillingOrder) {
  // Cerrar y desmontar primero para que el watch de CfdiModal dispare correctamente
  cfdiOpen.value = false
  cfdiUser.value = null
  await nextTick()

  cfdiUser.value = {
    id:                o.userId,
    fiscalRfc:         o.userFiscalRfc,
    fiscalRazonSocial: o.userFiscalRazonSocial,
    fiscalUsocfdi:     o.userFiscalUsocfdi,
    fiscalRegimen:     o.userFiscalRegimen,
    facturaUid:        o.userFacturaUid,
  }
  cfdiConceptos.value = (o.items as OrderItem[]).map(item => ({
    descripcion:   item.sku ? `${item.name} (${item.sku})` : item.name,
    claveProdServ: item.satKey ?? '43211500',
    claveUnidad:   'H87',
    unidad:        'Pieza',
    cantidad:      item.quantity,
    valorUnitario: item.price,
  }))
  cfdiOrderId.value = o.id
  await nextTick()
  cfdiOpen.value = true
}

async function onCfdiCreated() {
  // Invalidar caché de emitidas para que recargue al cambiar de pestaña
  cfdis.value = []
  // Recargar desde servidor para obtener el cfdiUid real (elimina el hack __pending__)
  try {
    const data = await $fetch<{ orders: BillingOrder[] }>('/api/factura/orders')
    orders.value = data.orders
  } catch { /* silencioso */ }
}

/* ════════════════════════════════
   FACTURA GLOBAL
════════════════════════════════ */
const globalOpen = ref(false)

// Pedidos aprobados que no tienen CFDI individual ni global
const pendingForGlobal = computed(() =>
  orders.value
    .filter(o => ['approved','processing','shipped','delivered'].includes(o.status) && !o.cfdiUid)
    .map(o => ({ id: o.id, total: o.total }))
)

function onGlobalCreated() {
  // Recargar órdenes para reflejar cfdiUid actualizado
  cfdis.value = []
  $fetch<{ orders: BillingOrder[] }>('/api/factura/orders').then(data => {
    orders.value = data.orders
  }).catch(() => {})
}

/* ── Formatters ── */
const fmtMXN  = (n: number) => n.toLocaleString('es-MX', { style:'currency', currency:'MXN' })
const fmtDate = (iso?: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-MX', { day:'2-digit', month:'short', year:'2-digit' })
}
</script>

<style scoped>
.spin { animation: spin 0.8s linear infinite; }
@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
.pulse { animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
</style>
