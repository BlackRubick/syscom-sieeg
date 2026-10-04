<template>
  <div :style="{ fontFamily:`'Inter',system-ui,sans-serif`, display:'flex', flexDirection:'column', gap:'22px' }">

    <!-- Header -->
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
      <div>
        <h1 style="font-size:22px;font-weight:800;color:#0B1B33;margin:0;line-height:1.25;">
          Bienvenido,&nbsp;
          <span style="background:linear-gradient(135deg,#1570EF,#0B5BD3);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
            {{ auth.user?.name.split(' ')[0] }}
          </span>
        </h1>
        <p style="font-size:12px;color:#5B6B82;margin:5px 0 0;text-transform:capitalize;">{{ dateStr }}</p>
      </div>
      <div style="display:flex;gap:8px;">
        <NuxtLink v-if="auth.user?.role !== 'viewer'" to="/catalog" style="display:flex;align-items:center;gap:6px;height:36px;padding:0 14px;border-radius:9px;border:1px solid rgba(11,27,51,0.1);background:rgba(11,27,51,0.04);color:#5B6B82;font-size:12px;font-weight:500;text-decoration:none;">
          <Package :size="13" /> Nuevo pedido
        </NuxtLink>
        <NuxtLink to="/orders" style="display:flex;align-items:center;gap:6px;height:36px;padding:0 16px;border-radius:9px;background:linear-gradient(135deg,#1570EF,#0B5BD3);color:white;font-size:12px;font-weight:600;text-decoration:none;box-shadow:0 3px 14px rgba(21,112,239,0.3);">
          Ver pedidos <ArrowRight :size="13" />
        </NuxtLink>
      </div>
    </div>

    <!-- Ventas de SIEEG (lo que hay que atender) -->
    <section class="db-sec">
      <h2 class="db-h2">Ventas SIEEG</h2>
      <p v-if="resumenError" class="db-error">{{ resumenError }}</p>
      <div class="db-grid">
        <NuxtLink to="/orders" class="db-card" :class="{ alerta: (resumen?.pendientes.pedidos ?? 0) > 0 }">
          <span class="db-label">Por aprobar</span>
          <b class="db-num">{{ resumen ? resumen.pendientes.pedidos : '—' }}</b>
          <span class="db-sub">{{ resumen ? fmtCompact(resumen.pendientes.total) : '' }}</span>
        </NuxtLink>
        <NuxtLink to="/orders" class="db-card">
          <span class="db-label">Surtidos sin cobrar</span>
          <b class="db-num">{{ resumen ? resumen.porCobrar.pedidos : '—' }}</b>
          <span class="db-sub">{{ resumen ? fmtCompact(resumen.porCobrar.total) : '' }}</span>
        </NuxtLink>
        <NuxtLink to="/quotes" class="db-card">
          <span class="db-label">Cotizaciones abiertas</span>
          <b class="db-num">{{ resumen ? resumen.cotizaciones.abiertas : '—' }}</b>
          <span class="db-sub">{{ resumen ? `${fmtCompact(resumen.cotizaciones.total)} al cotizar` : '' }}</span>
        </NuxtLink>
        <div class="db-card">
          <span class="db-label">Ventas de {{ MONTHS[CURRENT_MONTH] }}</span>
          <b class="db-num">{{ resumen ? fmtCompact(resumen.ventasMes.total) : '—' }}</b>
          <span class="db-sub">{{ resumen ? `${resumen.ventasMes.pedidos} pedido${resumen.ventasMes.pedidos !== 1 ? 's' : ''} · mes anterior ${fmtCompact(resumen.ventasMesAnterior.total)}` : '' }}</span>
        </div>
      </div>
      <p v-if="resumen?.aReembolsar" class="db-error">{{ resumen.aReembolsar }} pedido{{ resumen.aReembolsar !== 1 ? 's' : '' }} cancelado{{ resumen.aReembolsar !== 1 ? 's' : '' }} con pago por reembolsar.</p>
      <ul v-if="resumen?.ultimos.length" class="db-list">
        <li v-for="o in resumen.ultimos" :key="o.id">
          <NuxtLink :to="{ path: '/orders', query: { pedido: o.id } }">{{ o.folio }}</NuxtLink>
          <span>{{ o.cliente }}</span>
          <span class="db-muted">{{ fmtDate(o.createdAt) }}</span>
          <b>{{ fmtCompact(o.total) }}</b>
        </li>
      </ul>
    </section>

    <h2 class="db-h2">Compras a SYSCOM {{ YEAR }}</h2>
    <p v-if="facturasError" class="db-error">{{ facturasError }}</p>

    <!-- KPI Cards -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;">
      <!-- Skeletons -->
      <template v-if="loading">
        <div v-for="i in 3" :key="i" style="border-radius:16px;background:linear-gradient(145deg,#FFFFFF,#F5F8FC);border:1px solid rgba(11,27,51,0.07);padding:22px 24px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
            <div class="shimmer-bg" style="width:40px;height:40px;border-radius:10px;background:rgba(11,27,51,0.07);" />
            <div class="shimmer-bg" style="width:52px;height:20px;border-radius:20px;background:rgba(11,27,51,0.05);" />
          </div>
          <div class="shimmer-bg" style="width:80px;height:30px;border-radius:8px;background:rgba(11,27,51,0.08);margin-bottom:8px;" />
          <div class="shimmer-bg" style="width:120px;height:11px;border-radius:6px;background:rgba(11,27,51,0.05);" />
        </div>
      </template>
      <!-- Real KPIs -->
      <div v-else v-for="k in kpis" :key="k.label"
        style="border-radius:16px;background:linear-gradient(145deg,#FFFFFF,#F5F8FC);border:1px solid rgba(11,27,51,0.07);padding:22px 24px;position:relative;overflow:hidden;box-shadow:0 4px 20px rgba(11,27,51,0.14);transition:transform 0.2s;"
        @mouseenter="e => (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'"
        @mouseleave="e => (e.currentTarget as HTMLElement).style.transform='translateY(0)'">
        <div :style="{ position:'absolute', top:'-20px', right:'-20px', width:'80px', height:'80px', borderRadius:'50%', background:k.glow, filter:'blur(24px)', pointerEvents:'none' }" />
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;">
          <div :style="{ width:'40px', height:'40px', borderRadius:'10px', background:k.gradient, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 14px ${k.glow}` }">
            <component :is="k.icon" :size="17" color="white" :stroke-width="2.2" />
          </div>
          <div v-if="k.delta !== null" :style="{ display:'flex', alignItems:'center', gap:'3px', fontSize:'11px', fontWeight:600, padding:'3px 8px', borderRadius:'20px', color:k.delta>0?'#16A34A':k.delta<0?'#EF4444':'#5B6B82', background:k.delta>0?'rgba(34,197,94,0.1)':k.delta<0?'rgba(251,113,133,0.1)':'rgba(91,107,130,0.1)' }">
            <TrendingUp v-if="k.delta>0" :size="10" /><TrendingDown v-else-if="k.delta<0" :size="10" />
            {{ k.delta !== 0 ? `${Math.abs(k.delta)}%` : 'Sin cambio' }}
          </div>
        </div>
        <div style="font-size:28px;font-weight:800;color:#0B1B33;letter-spacing:-0.5px;line-height:1;margin-bottom:6px;">{{ k.value }}</div>
        <div style="font-size:12px;font-weight:500;color:#5B6B82;">{{ k.label }}</div>
        <div style="font-size:11px;color:#5B6B82;margin-top:3px;">{{ k.sub }}</div>
        <div :style="{ marginTop:'18px', height:'2px', borderRadius:'999px', background:`linear-gradient(90deg,${k.accent}50,transparent)` }" />
      </div>
    </div>

    <!-- Main 2-col grid -->
    <div :style="{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap:'16px', alignItems:'start' }">

      <!-- Facturas recientes -->
      <div style="border-radius:16px;background:linear-gradient(145deg,#FFFFFF,#F5F8FC);border:1px solid rgba(11,27,51,0.07);overflow:hidden;box-shadow:0 4px 20px rgba(11,27,51,0.14);">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(11,27,51,0.06);">
          <div style="display:flex;align-items:center;gap:8px;">
            <Receipt :size="14" color="#0B5BD3" :stroke-width="1.8" />
            <span style="font-size:13px;font-weight:700;color:#0B1B33;">Facturas recientes</span>
            <span v-if="!loading" style="font-size:11px;padding:2px 7px;border-radius:20px;background:rgba(21,112,239,0.1);color:#0B5BD3;font-weight:600;">{{ totalOrders }}</span>
          </div>
          <NuxtLink to="/orders" style="display:flex;align-items:center;gap:4px;font-size:12px;color:#0B5BD3;font-weight:500;">
            Ver todas <ArrowRight :size="12" />
          </NuxtLink>
        </div>

        <!-- Column headers -->
        <div v-if="!loading && recent.length" style="display:grid;grid-template-columns:1fr 110px 90px;padding:8px 20px;border-bottom:1px solid rgba(11,27,51,0.04);">
          <div v-for="h in ['Folio','Fecha','Total']" :key="h" :style="{ fontSize:'10px', fontWeight:600, color:'#5B6B82', textTransform:'uppercase', letterSpacing:'0.7px', textAlign:h==='Total'?'right':'left' }">{{ h }}</div>
        </div>

        <!-- Skeleton rows -->
        <template v-if="loading">
          <div v-for="i in 5" :key="i" style="display:flex;align-items:center;gap:12px;padding:13px 20px;border-bottom:1px solid rgba(11,27,51,0.03);">
            <div class="shimmer-bg" style="flex:1;height:12px;border-radius:6px;background:rgba(11,27,51,0.06);" />
            <div class="shimmer-bg" style="width:80px;height:11px;border-radius:6px;background:rgba(11,27,51,0.04);" />
            <div class="shimmer-bg" style="width:60px;height:12px;border-radius:6px;background:rgba(11,27,51,0.06);" />
          </div>
        </template>

        <!-- Real rows -->
        <NuxtLink v-else v-for="(f, i) in recent" :key="`${f.folio}-${i}`" to="/orders" style="text-decoration:none;">
          <div style="display:grid;grid-template-columns:1fr 110px 90px;padding:12px 20px;transition:background 0.15s;cursor:pointer;"
            :style="{ borderBottom: i < recent.length-1 ? '1px solid rgba(11,27,51,0.04)' : 'none' }"
            @mouseenter="e => (e.currentTarget as HTMLElement).style.background='rgba(11,27,51,0.025)'"
            @mouseleave="e => (e.currentTarget as HTMLElement).style.background='transparent'">
            <div style="display:flex;align-items:center;gap:8px;min-width:0;">
              <div :style="{ width:'6px', height:'6px', borderRadius:'50%', background:facturaStatusStyle(f.estatus??f.estado).dot, boxShadow:`0 0 6px ${facturaStatusStyle(f.estatus??f.estado).dot}80`, flexShrink:0 }" />
              <span style="font-size:12px;font-weight:600;color:#5B6B82;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ f.folio || '—' }}</span>
            </div>
            <div style="font-size:11px;color:#5B6B82;align-self:center;">{{ fmtDate(f.fecha_creacion) }}</div>
            <div style="text-align:right;align-self:center;">
              <div style="font-size:12px;font-weight:700;color:#0B1B33;">{{ parseTotal(f.total)>0 ? fmtCompact(parseTotal(f.total)) : '—' }}</div>
              <div v-if="f.moneda" style="font-size:10px;color:#5F6E84;">{{ f.moneda }}</div>
            </div>
          </div>
        </NuxtLink>

        <div v-if="!loading && !recent.length" style="padding:40px 20px;text-align:center;font-size:13px;color:#5F6E84;">
          Sin facturas para {{ YEAR }}
        </div>
      </div>

      <!-- Right column -->
      <div style="display:flex;flex-direction:column;gap:14px;">

        <!-- Bar chart -->
        <div style="border-radius:16px;background:linear-gradient(145deg,#FFFFFF,#F5F8FC);border:1px solid rgba(11,27,51,0.07);padding:18px 20px;box-shadow:0 4px 20px rgba(11,27,51,0.14);">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;">
            <div>
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                <BarChart3 :size="13" color="#5F6E84" :stroke-width="1.8" />
                <span style="font-size:11px;font-weight:600;color:#5F6E84;text-transform:uppercase;letter-spacing:0.7px;">Gasto {{ YEAR }}</span>
              </div>
              <div style="font-size:20px;font-weight:800;color:#0B1B33;letter-spacing:-0.3px;">{{ loading ? '—' : fmtCompact(totalSpent) }}</div>
            </div>
            <div v-if="!loading && spentDelta !== 0" :style="{ display:'flex', alignItems:'center', gap:'3px', fontSize:'11px', fontWeight:600, padding:'3px 8px', borderRadius:'20px', color:spentDelta>0?'#16A34A':'#EF4444', background:spentDelta>0?'rgba(34,197,94,0.1)':'rgba(251,113,133,0.1)' }">
              <TrendingUp v-if="spentDelta>0" :size="10" /><TrendingDown v-else :size="10" />
              {{ Math.abs(spentDelta) }}%
            </div>
          </div>
          <!-- Bars -->
          <div style="display:flex;align-items:flex-end;gap:4px;height:72px;">
            <div v-for="(bar, i) in chartBars" :key="i" :title="`${bar.month}: ${fmtCompact(bar.amount)}`"
              style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;justify-content:flex-end;">
              <div :style="{ width:'100%', borderRadius:'3px 3px 2px 2px', background:bar.current?'linear-gradient(180deg,#1570EF,#0B5BD3)':'rgba(21,112,239,0.18)', height:`${Math.max(bar.pct*100,4)}%`, minHeight:'3px', transition:'height 0.65s ease-out', boxShadow:bar.current?'0 0 10px rgba(21,112,239,0.4)':'none' }" />
              <div :style="{ fontSize:'8px', fontWeight:bar.current?700:400, color:bar.current?'#0B5BD3':'#5F6E84' }">{{ bar.month }}</div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div style="border-radius:16px;background:linear-gradient(145deg,#FFFFFF,#F5F8FC);border:1px solid rgba(11,27,51,0.07);padding:18px 20px;box-shadow:0 4px 20px rgba(11,27,51,0.14);">
          <div style="font-size:11px;font-weight:600;color:#5F6E84;text-transform:uppercase;letter-spacing:0.7px;margin-bottom:14px;">Resumen</div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div v-for="row in summaryRows" :key="row.label" style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:12px;color:#5B6B82;">{{ row.label }}</span>
              <span style="font-size:12px;font-weight:700;color:#0B1B33;">{{ row.value }}</span>
            </div>
          </div>

          <!-- Status breakdown -->
          <template v-if="!loading && topStatuses.length">
            <div style="height:1px;background:rgba(11,27,51,0.06);margin:14px 0;" />
            <div style="font-size:11px;font-weight:600;color:#5F6E84;text-transform:uppercase;letter-spacing:0.7px;margin-bottom:10px;">Por estatus</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <div v-for="[label, count] in topStatuses" :key="label">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                  <span :style="{ fontSize:'11px', color:facturaStatusStyle(label).color, fontWeight:500 }">{{ label }}</span>
                  <span style="font-size:11px;color:#5F6E84;">{{ count }}</span>
                </div>
                <div style="height:3px;border-radius:999px;background:rgba(11,27,51,0.06);">
                  <div :style="{ height:'100%', borderRadius:'999px', background:facturaStatusStyle(label).dot, width:`${totalOrders>0?(count/totalOrders)*100:0}%`, transition:'width 0.7s ease-out' }" />
                </div>
              </div>
            </div>
          </template>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingBag, DollarSign, CalendarDays, TrendingUp, TrendingDown, ArrowRight, Package, Receipt, BarChart3 } from '@lucide/vue'
import { fetchFacturas, parseTotal, fmtCompact, fmtDate, facturaStatusStyle } from '~/composables/useSyscom'
import type { SyscomFactura } from '~/types'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Dashboard — SIEEG' })

const auth = useAuthStore()
const { isMobile } = useBreakpoint()
const YEAR         = new Date().getFullYear()
const CURRENT_MONTH = new Date().getMonth()
const MONTHS       = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

const dateStr      = ref('')
const facturas     = ref<SyscomFactura[]>([])
const prevFacturas = ref<SyscomFactura[]>([])
const loading      = ref(true)

onMounted(async () => {
  dateStr.value = new Date().toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  $fetch<Resumen>('/api/dashboard/resumen').then(r => { resumen.value = r }).catch((e) => { resumenError.value = e?.data?.message ?? 'No se pudo cargar el resumen de ventas' })
  const [curr, prev] = await Promise.all([todasLasFacturas(YEAR), todasLasFacturas(YEAR - 1)])
  facturas.value     = curr.facturas
  prevFacturas.value = prev.facturas
  if (curr.error) facturasError.value = `SYSCOM no respondió: ${curr.error}`
  loading.value      = false
})

// SYSCOM pagina sus facturas: se juntan todas las páginas del año (antes solo contaba la primera)
async function todasLasFacturas(anio: number) {
  const primera = await fetchFacturas({ anio })
  const resto = primera.paginas > 1
    ? await Promise.all(Array.from({ length: Math.min(primera.paginas, 20) - 1 }, (_, i) => fetchFacturas({ anio, pagina: i + 2 })))
    : []
  return { facturas: [primera, ...resto].flatMap(r => r.facturas), error: primera.error }
}

interface Resumen {
  pendientes: { pedidos: number; total: number }; porCobrar: { pedidos: number; total: number }; aReembolsar: number
  cotizaciones: { abiertas: number; total: number }; ventasMes: { pedidos: number; total: number }; ventasMesAnterior: { pedidos: number; total: number }
  ultimos: Array<{ id: string; folio: string; cliente: string; total: number; status: string; createdAt: string }>
}
const resumen       = ref<Resumen | null>(null)
const resumenError  = ref('')
const facturasError = ref('')

const totalOrders = computed(() => facturas.value.length)
const totalSpent  = computed(() => facturas.value.reduce((s, f) => s + parseTotal(f.total), 0))
const prevSpent   = computed(() => prevFacturas.value.reduce((s, f) => s + parseTotal(f.total), 0))
const avgTicket   = computed(() => totalOrders.value > 0 ? totalSpent.value / totalOrders.value : 0)
const spentDelta  = computed(() => prevSpent.value > 0 ? Math.round(((totalSpent.value - prevSpent.value) / prevSpent.value) * 100) : 0)
const ordersDelta = computed(() => prevFacturas.value.length > 0 ? Math.round(((totalOrders.value - prevFacturas.value.length) / prevFacturas.value.length) * 100) : 0)

const thisMonth   = computed(() => facturas.value.filter(f => { if (!f.fecha_creacion) return false; const d = new Date(f.fecha_creacion); return d.getFullYear() === YEAR && d.getMonth() === CURRENT_MONTH }))
const monthSpent  = computed(() => thisMonth.value.reduce((s, f) => s + parseTotal(f.total), 0))

const recent = computed(() => [...facturas.value].sort((a, b) => new Date(b.fecha_creacion ?? 0).getTime() - new Date(a.fecha_creacion ?? 0).getTime()).slice(0, 6))

const monthlyTotals = computed(() => {
  const t = Array(12).fill(0) as number[]
  facturas.value.forEach(f => { if (!f.fecha_creacion) return; const d = new Date(f.fecha_creacion); if (d.getFullYear() === YEAR) t[d.getMonth()] += parseTotal(f.total) })
  return t
})
const maxMonthly = computed(() => Math.max(...monthlyTotals.value, 1))

const chartBars = computed(() => MONTHS.slice(0, CURRENT_MONTH + 1).map((month, i) => ({
  month, amount: monthlyTotals.value[i], pct: monthlyTotals.value[i] / maxMonthly.value, current: i === CURRENT_MONTH,
})))

const statusCounts = computed(() => {
  const acc: Record<string, number> = {}
  facturas.value.forEach(f => { const l = facturaStatusStyle(f.estatus ?? f.estado).label; acc[l] = (acc[l] ?? 0) + 1 })
  return acc
})
const topStatuses = computed(() => Object.entries(statusCounts.value).sort((a, b) => b[1] - a[1]).slice(0, 4))

const kpis = computed(() => [
  { label:`Facturas ${YEAR}`, value:loading.value?'—':totalOrders.value.toLocaleString('es-MX'), sub:'vs. año anterior', delta:ordersDelta.value, icon:ShoppingBag, accent:'#1570EF', gradient:'linear-gradient(135deg,#1570EF,#0B5BD3)', glow:'rgba(21,112,239,0.2)' },
  { label:`Gasto total ${YEAR}`, value:loading.value?'—':fmtCompact(totalSpent.value), sub:'vs. año anterior', delta:spentDelta.value, icon:DollarSign, accent:'#8B5CF6', gradient:'linear-gradient(135deg,#1570EF,#0B5BD3)', glow:'rgba(139,92,246,0.2)' },
  { label:`Gasto de ${MONTHS[CURRENT_MONTH]}`, value:loading.value?'—':(monthSpent.value>0?fmtCompact(monthSpent.value):'$0'), sub:`${thisMonth.value.length} factura${thisMonth.value.length!==1?'s':''} este mes`, delta:null as number|null, icon:CalendarDays, accent:'#16A34A', gradient:'linear-gradient(135deg,#16A34A,#059669)', glow:'rgba(34,197,94,0.2)' },
])

const summaryRows = computed(() => [
  { label:'Total facturas',  value:loading.value?'—':totalOrders.value.toLocaleString('es-MX') },
  { label:'Ticket promedio', value:loading.value?'—':(avgTicket.value>0?fmtCompact(avgTicket.value):'—') },
  { label:'Este mes',        value:loading.value?'—':`${thisMonth.value.length} facturas` },
  { label:'Año anterior',    value:loading.value?'—':prevFacturas.value.length.toLocaleString('es-MX') },
])
</script>

<style scoped>
.db-sec { display: flex; flex-direction: column; gap: 12px; }
.db-h2 { margin: 6px 0 0; font-size: 14px; font-weight: 800; color: #0B1B33; text-transform: uppercase; letter-spacing: .6px; }
.db-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
.db-card { display: flex; flex-direction: column; gap: 4px; padding: 16px 18px; border-radius: 14px; background: #fff; border: 1px solid #E4E9F1; text-decoration: none; color: #0B1B33; }
a.db-card:hover { border-color: rgba(21,112,239,0.35); }
.db-card.alerta { border-color: rgba(245,158,11,0.45); background: #FFFBEB; }
.db-label { font-size: 12px; font-weight: 600; color: #5B6B82; }
.db-num { font-size: 26px; font-weight: 800; line-height: 1.1; }
.db-sub { font-size: 12px; color: #5F6E84; }
.db-error { margin: 0; padding: 9px 12px; border-radius: 10px; background: #FEF2F2; color: #B91C1C; font-size: 12.5px; }
.db-list { list-style: none; margin: 0; padding: 0; border: 1px solid #E4E9F1; border-radius: 14px; background: #fff; overflow: hidden; }
.db-list li { display: grid; grid-template-columns: 120px 1fr auto auto; gap: 12px; align-items: center; padding: 10px 16px; font-size: 13px; border-top: 1px solid #EEF2F7; }
.db-list li:first-child { border-top: none; }
.db-list a { color: #0B5BD3; font-weight: 700; font-family: ui-monospace, Menlo, monospace; font-size: 12px; text-decoration: none; }
.db-muted { color: #5F6E84; font-size: 12px; }
@media (max-width: 560px) { .db-list li { grid-template-columns: 1fr auto; } .db-list li .db-muted { display: none; } }
</style>
