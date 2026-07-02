<template>
  <!-- Submitted success -->
  <div v-if="submitted" style="min-height:65vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:'Inter',system-ui,sans-serif;">
    <div style="width:88px;height:88px;border-radius:50%;background:linear-gradient(135deg,#10B981,#34D399);display:flex;align-items:center;justify-content:center;margin-bottom:24px;box-shadow:0 0 50px rgba(16,185,129,0.35);">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
    </div>
    <div style="font-size:24px;font-weight:800;color:#F1F5F9;margin-bottom:8px;">¡Orden enviada!</div>
    <div style="font-size:13px;color:rgba(100,116,139,0.9);max-width:300px;line-height:1.6;margin-bottom:12px;">Tu solicitud fue enviada. El administrador la revisará y la enviará a SYSCOM cuando sea aprobada.</div>
    <NuxtLink to="/orders" style="display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 24px;border-radius:12px;border:none;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 4px 18px rgba(14,165,233,0.35);text-decoration:none;">
      Ver mis órdenes <ArrowRight :size="14" />
    </NuxtLink>
  </div>

  <!-- Empty cart -->
  <div v-else-if="!cart.items.length" style="min-height:65vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:'Inter',system-ui,sans-serif;">
    <div style="width:80px;height:80px;border-radius:22px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.09);display:flex;align-items:center;justify-content:center;margin-bottom:22px;box-shadow:0 10px 28px rgba(0,0,0,0.45);">
      <ShoppingCart :size="30" color="rgba(100,116,139,0.55)" :stroke-width="1.5" />
    </div>
    <div style="font-size:19px;font-weight:700;color:#E2E8F0;margin-bottom:7px;">Tu carrito está vacío</div>
    <div style="font-size:13px;color:rgba(100,116,139,0.8);margin-bottom:26px;">Agrega productos desde el catálogo</div>
    <NuxtLink to="/catalog" style="display:inline-flex;align-items:center;gap:7px;height:42px;padding:0 22px;border-radius:11px;border:none;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(14,165,233,0.3);">
      <Package :size="14" /> Ir al catálogo
    </NuxtLink>
  </div>

  <!-- Main view -->
  <div v-else :style="{ fontFamily:`'Inter',system-ui,sans-serif`, display:'flex', flexDirection:'column', gap:'18px' }">
    <!-- Header -->
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
      <div>
        <h1 style="font-size:21px;font-weight:800;color:#F1F5F9;margin:0;">Carrito de compras</h1>
        <p style="font-size:12px;color:rgba(100,116,139,0.8);margin-top:3px;">{{ cart.items.length }} producto{{ cart.items.length!==1?'s':'' }} · {{ totalUnits }} unidades</p>
      </div>
      <button @click="cart.clearCart()" style="display:flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:8px;background:rgba(244,63,94,0.07);border:1px solid rgba(244,63,94,0.18);color:#fb7185;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;flex-shrink:0;">
        <Trash2 :size="12" /> Vaciar
      </button>
    </div>

    <!-- Two columns -->
    <div style="display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start;">

      <!-- Items column -->
      <div style="flex:1 1 320px;min-width:0;display:flex;flex-direction:column;gap:10px;">
        <div v-for="item in cart.items" :key="item.product.id"
          style="border-radius:14px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.08);overflow:hidden;box-shadow:0 3px 14px rgba(0,0,0,0.3);">
          <div style="padding:14px 15px;display:flex;flex-direction:column;gap:11px;">
            <!-- Row 1: icon + name -->
            <div style="display:flex;gap:11px;align-items:center;">
              <div style="width:42px;height:42px;border-radius:11px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;" @click="detailProduct=item.product">
                <img v-if="item.product.images[0]" :src="item.product.images[0]" :alt="item.product.name" style="width:36px;height:36px;object-fit:contain;" @error="(e) => (e.currentTarget as HTMLImageElement).style.display='none'" />
                <Package v-else :size="16" color="#38bdf8" :stroke-width="1.6" />
              </div>
              <div style="flex:1;min-width:0;">
                <div @click="detailProduct=item.product" style="font-size:13px;font-weight:600;color:#E2E8F0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;">{{ item.product.name }}</div>
                <div style="display:flex;gap:6px;margin-top:3px;flex-wrap:wrap;align-items:center;">
                  <span style="font-size:11px;color:rgba(100,116,139,0.8);">{{ item.product.supplier }}</span>
                  <span v-if="item.product.sku" style="font-size:10px;font-family:monospace;color:rgba(71,85,105,0.85);">{{ item.product.sku }}</span>
                </div>
              </div>
            </div>
            <!-- Row 2: price · qty · subtotal -->
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding-left:53px;">
              <div style="min-width:62px;">
                <div style="font-size:10px;color:rgba(100,116,139,0.6);line-height:1;">c/u</div>
                <div style="font-size:12px;font-weight:600;color:#94a3b8;margin-top:2px;">{{ item.product.price > 0 ? fmtCurrency(item.product.price) : '—' }}</div>
              </div>
              <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
                <button @click="cart.updateQuantity(item.product.id, item.quantity-1)" style="width:28px;height:28px;border-radius:7px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#94a3b8;"><Minus :size="10" :stroke-width="2.5" /></button>
                <div style="width:32px;height:28px;border-radius:7px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.18);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#38bdf8;">{{ item.quantity }}</div>
                <button @click="cart.updateQuantity(item.product.id, item.quantity+1)" style="width:28px;height:28px;border-radius:7px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.18);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#38bdf8;"><Plus :size="10" :stroke-width="2.5" /></button>
              </div>
              <div style="text-align:right;flex-shrink:0;">
                <div style="font-size:14px;font-weight:800;color:#F1F5F9;">{{ item.product.price > 0 ? fmtCurrency(item.product.price * item.quantity) : '—' }}</div>
                <button @click="cart.removeItem(item.product.id)" style="margin-top:2px;background:none;border:none;cursor:pointer;color:rgba(71,85,105,0.65);display:inline-flex;align-items:center;gap:3px;font-size:10px;font-family:inherit;transition:color 0.15s;"
                  @mouseenter="e => (e.currentTarget as HTMLElement).style.color='#fb7185'"
                  @mouseleave="e => (e.currentTarget as HTMLElement).style.color='rgba(71,85,105,0.65)'">
                  <Trash2 :size="10" /> Quitar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add more -->
        <NuxtLink to="/catalog" style="display:flex;align-items:center;justify-content:center;gap:7px;height:44px;border-radius:12px;border:1.5px dashed rgba(255,255,255,0.09);cursor:pointer;font-size:12px;color:rgba(100,116,139,0.7);font-weight:500;text-decoration:none;transition:all 0.2s;"
          @mouseenter="e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(14,165,233,0.35)'; (e.currentTarget as HTMLElement).style.background='rgba(14,165,233,0.03)' }"
          @mouseleave="e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.09)'; (e.currentTarget as HTMLElement).style.background='transparent' }">
          <Plus :size="12" /> Agregar más productos
        </NuxtLink>
      </div>

      <!-- Right column -->
      <div style="flex:0 0 320px;width:320px;max-width:100%;display:flex;flex-direction:column;gap:14px;position:sticky;top:16px;">

        <!-- Order details -->
        <div style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.08);overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.35);">
          <div style="padding:15px 16px 0;display:flex;align-items:center;gap:8px;margin-bottom:14px;">
            <div style="width:26px;height:26px;border-radius:7px;background:rgba(14,165,233,0.12);border:1px solid rgba(14,165,233,0.2);display:flex;align-items:center;justify-content:center;">
              <FileText :size="12" color="#38bdf8" />
            </div>
            <span style="font-size:13px;font-weight:700;color:#E2E8F0;">Detalles de la orden</span>
          </div>
          <div style="padding:0 16px 16px;display:flex;flex-direction:column;gap:14px;">
            <!-- Priority -->
            <div>
              <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Prioridad</div>
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;">
                <button v-for="p in priorities" :key="p.key" @click="priority=p.key"
                  :style="{ height:'32px', borderRadius:'8px', border:`1px solid ${priority===p.key?p.border:'rgba(255,255,255,0.07)'}`, background:priority===p.key?p.bg:'rgba(255,255,255,0.03)', color:priority===p.key?p.color:'rgba(100,116,139,0.7)', fontSize:'11px', fontWeight:priority===p.key?700:500, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }">
                  {{ p.label }}
                </button>
              </div>
              <div :style="{ display:'flex', alignItems:'center', gap:'6px', marginTop:'7px', padding:'5px 9px', borderRadius:'7px', background:activePri.bg, border:`1px solid ${activePri.border}` }">
                <div :style="{ width:'5px', height:'5px', borderRadius:'50%', background:activePri.color, flexShrink:0 }" />
                <span :style="{ fontSize:'11px', fontWeight:600, color:activePri.color }">
                  {{ priority==='urgent'?'Urgente — notificación inmediata':priority==='high'?'Alta — procesamiento en 4h':priority==='normal'?'Normal — procesamiento en 24h':'Baja — sin urgencia' }}
                </span>
              </div>
            </div>
            <!-- Notes -->
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;">
                <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.8px;display:flex;align-items:center;gap:4px;">
                  <Tag :size="10" /> Notas
                </div>
                <span style="font-size:10px;color:rgba(71,85,105,0.75);">{{ notes.length }}/300</span>
              </div>
              <textarea v-model="notes" @input="notes=notes.slice(0,300)" placeholder="Justificación, área solicitante, instrucciones..." rows="3"
                :style="{ width:'100%', padding:'9px 11px', background:notesFocus?'rgba(14,165,233,0.05)':'rgba(255,255,255,0.03)', border:`1px solid ${notesFocus?'rgba(14,165,233,0.4)':'rgba(255,255,255,0.08)'}`, borderRadius:'9px', fontSize:'12px', color:'#CBD5E1', outline:'none', resize:'none', fontFamily:'inherit', transition:'all 0.2s', boxSizing:'border-box', lineHeight:'1.5' }"
                @focus="notesFocus=true" @blur="notesFocus=false" />
            </div>
          </div>
        </div>

        <!-- Price summary -->
        <div style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.08);overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.35);">
          <div style="padding:15px 16px 0;margin-bottom:12px;">
            <div style="font-size:13px;font-weight:700;color:#E2E8F0;">Resumen de compra</div>
          </div>
          <div style="padding:0 16px;display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
            <div v-for="item in cart.items" :key="item.product.id" style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <span style="font-size:11px;color:rgba(100,116,139,0.8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">
                {{ item.product.name.length>24 ? item.product.name.slice(0,24)+'…' : item.product.name }}
                <span style="color:rgba(71,85,105,0.8);"> ×{{ item.quantity }}</span>
              </span>
              <span style="font-size:11px;color:#94a3b8;font-weight:500;flex-shrink:0;">{{ item.product.price>0 ? fmtCurrency(item.product.price*item.quantity) : '—' }}</span>
            </div>
          </div>
          <div style="padding:12px 16px;border-top:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;font-size:12px;color:rgba(100,116,139,0.85);"><span>Subtotal</span><span>{{ fmtCurrency(cartTotal) }}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:rgba(100,116,139,0.85);"><span>IVA (16%)</span><span>{{ fmtCurrency(iva) }}</span></div>
          </div>
          <div style="padding:12px 16px;background:rgba(14,165,233,0.05);border-top:1px solid rgba(14,165,233,0.12);display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:13px;font-weight:700;color:#E2E8F0;">Total con IVA</span>
            <span style="font-size:18px;font-weight:800;letter-spacing:-0.5px;background:linear-gradient(135deg,#0EA5E9,#22D3EE);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{{ fmtCurrency(cartTotal + iva) }}</span>
          </div>
          <div style="padding:14px 16px 16px;display:flex;flex-direction:column;gap:10px;">
            <Transition name="fade">
              <div v-if="submitError" style="padding:9px 12px;border-radius:8px;background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.25);font-size:12px;color:#fb7185;">{{ submitError }}</div>
            </Transition>
            <button @click="handleCheckout()" :disabled="submitting"
              :style="{ position:'relative', width:'100%', height:'46px', borderRadius:'12px', border:'none', cursor:submitting?'not-allowed':'pointer', background:submitting?'rgba(14,165,233,0.5)':'linear-gradient(135deg,#0EA5E9,#0284C7)', color:'white', fontWeight:700, fontSize:'13px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', fontFamily:'inherit', boxShadow:submitting?'none':'0 4px 20px rgba(14,165,233,0.38)', overflow:'hidden' }">
              {{ submitting ? 'Enviando orden…' : 'Enviar solicitud' }} <ArrowRight v-if="!submitting" :size="14" />
            </button>
            <div style="display:flex;justify-content:center;gap:14px;">
              <div v-for="badge in ['🔒 Seguro','⚡ < 24h','✓ Trazable']" :key="badge" style="font-size:10px;color:rgba(71,85,105,0.8);">{{ badge }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Product detail modal -->
  <ProductModal v-if="detailProduct" :product="detailProduct" :show="!!detailProduct" @close="detailProduct=null" />
</template>

<script setup lang="ts">
import { ShoppingCart, Package, Trash2, Plus, Minus, ArrowRight, FileText, Tag } from '@lucide/vue'
import type { Product } from '~/types'

definePageMeta({ middleware: 'auth' })

const cart  = useCartStore()
const notes         = ref('')
const priority      = ref('normal')
const submitted     = ref(false)
const submitting    = ref(false)
const submitError   = ref('')
const notesFocus    = ref(false)
const detailProduct = ref<Product | null>(null)


const priorities = [
  { key:'low',    label:'Baja',    color:'#94a3b8', bg:'rgba(148,163,184,0.1)',  border:'rgba(148,163,184,0.2)' },
  { key:'normal', label:'Normal',  color:'#38bdf8', bg:'rgba(14,165,233,0.1)',   border:'rgba(14,165,233,0.25)' },
  { key:'high',   label:'Alta',    color:'#fbbf24', bg:'rgba(245,158,11,0.1)',   border:'rgba(245,158,11,0.25)' },
  { key:'urgent', label:'Urgente', color:'#fb7185', bg:'rgba(244,63,94,0.1)',    border:'rgba(244,63,94,0.25)'  },
]
const activePri = computed(() => priorities.find(p => p.key === priority.value)!)

const cartTotal  = computed(() => cart.total)
const iva        = computed(() => cartTotal.value * 0.16)
const totalUnits = computed(() => cart.items.reduce((s, i) => s + i.quantity, 0))

const fmtCurrency = (n: number) => new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' }).format(n)

async function handleCheckout() {
  if (submitting.value) return
  submitting.value  = true
  submitError.value = ''
  submitWarning.value = ''
  try {
    const items = cart.items.map(i => ({
      productId: i.product.id,
      name:      i.product.name,
      sku:       i.product.sku,
      price:     i.product.price,
      quantity:  i.quantity,
      images:    i.product.images.slice(0, 1),
      satKey:    i.product.satKey,
    }))
    await $fetch('/api/orders', {
      method: 'POST',
      body: {
        items,
        total:    cart.total,
        priority: priority.value,
        notes:    notes.value || undefined,
      },
    })
    cart.clearCart()
    submitted.value = true
  } catch (e: unknown) {
    submitError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Error al enviar la orden'
  } finally {
    submitting.value = false
  }
}
</script>
