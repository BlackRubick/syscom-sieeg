<template>
  <div style="font-family:'Inter',system-ui,sans-serif;max-width:900px;margin:0 auto;">

    <!-- ── Éxito: pago con tarjeta ── -->
    <div v-if="submitted" style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
      <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#10B981,#34D399);display:flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow:0 0 40px rgba(16,185,129,0.3);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style="font-size:22px;font-weight:800;color:#F1F5F9;margin-bottom:8px;">¡Transacción exitosa!</div>
      <div style="font-size:14px;color:#34d399;font-weight:600;margin-bottom:6px;">Recibimos tu pago. ¡Gracias por tu compra!</div>
      <div style="font-size:12px;color:rgba(100,116,139,0.75);max-width:300px;line-height:1.6;margin-bottom:6px;">El administrador procesará tu pedido a la brevedad.</div>
      <div v-if="paymentAuth" style="font-size:11px;font-family:monospace;color:rgba(100,116,139,0.45);margin-bottom:22px;">Autorización: {{ paymentAuth }}</div>
      <a href="/orders" style="height:42px;padding:0 24px;border-radius:11px;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;box-shadow:0 4px 16px rgba(14,165,233,0.3);">
        Ver mis órdenes
      </a>
    </div>

    <!-- ── Éxito: SPEI — muestra referencia bancaria ── -->
    <div v-else-if="speiResult" style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;">
      <div style="width:100%;max-width:460px;border-radius:20px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(14,165,233,0.25);overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">

        <!-- Header -->
        <div style="padding:20px 24px 16px;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:40px;border-radius:12px;background:rgba(14,165,233,0.15);border:1px solid rgba(14,165,233,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
          </div>
          <div>
            <div style="font-size:15px;font-weight:800;color:#F1F5F9;">Pedido creado — Pago pendiente</div>
            <div style="font-size:12px;color:rgba(100,116,139,0.7);margin-top:1px;">Realiza la transferencia SPEI para confirmar tu compra</div>
          </div>
        </div>

        <!-- Datos bancarios -->
        <div style="padding:20px 24px;display:flex;flex-direction:column;gap:14px;">

          <!-- Monto -->
          <div style="padding:14px 16px;border-radius:12px;background:rgba(14,165,233,0.07);border:1px solid rgba(14,165,233,0.18);display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:12px;color:rgba(100,116,139,0.8);">Monto a transferir</span>
            <span style="font-size:20px;font-weight:800;background:linear-gradient(135deg,#0EA5E9,#22D3EE);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{{ fmt(speiResult.amount) }} MXN</span>
          </div>

          <!-- CLABE -->
          <div>
            <div style="font-size:10px;font-weight:700;color:rgba(100,116,139,0.6);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;">CLABE interbancaria</div>
            <div style="display:flex;align-items:center;gap:8px;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.09);">
              <span style="font-size:16px;font-weight:700;font-family:monospace;color:#E2E8F0;letter-spacing:2px;flex:1;">{{ speiResult.clabe }}</span>
              <button @click="copyClabe" style="height:30px;padding:0 10px;border-radius:7px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.25);color:#38bdf8;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;flex-shrink:0;">
                {{ clabeCopied ? '✓ Copiado' : 'Copiar' }}
              </button>
            </div>
          </div>

          <!-- Banco y Convenio -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div>
              <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.55);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:5px;">Banco</div>
              <div style="font-size:13px;font-weight:600;color:#CBD5E1;">{{ speiResult.bank }}</div>
            </div>
            <div>
              <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.55);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:5px;">Convenio CIE</div>
              <div style="font-size:13px;font-weight:700;font-family:monospace;color:#38bdf8;">{{ speiResult.agreement }}</div>
            </div>
          </div>

          <!-- Referencia -->
          <div v-if="speiResult.beneficiary">
            <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.55);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:5px;">Beneficiario / Referencia</div>
            <div style="font-size:12px;font-family:monospace;color:#94a3b8;">{{ speiResult.beneficiary }}</div>
          </div>

          <!-- Aviso -->
          <div style="padding:10px 13px;border-radius:9px;background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.2);font-size:11px;color:rgba(251,191,36,0.85);line-height:1.5;">
            Tu pedido quedará en espera hasta que el administrador confirme la recepción del pago. Guarda el comprobante de transferencia.
          </div>
        </div>

        <div style="padding:0 24px 20px;">
          <a href="/orders" style="display:flex;align-items:center;justify-content:center;height:44px;border-radius:11px;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-size:13px;font-weight:700;text-decoration:none;box-shadow:0 4px 16px rgba(14,165,233,0.3);">
            Ver mis órdenes
          </a>
        </div>
      </div>
    </div>

    <!-- ── Carrito vacío ── -->
    <div v-else-if="!cart.items.length" style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
      <div style="width:72px;height:72px;border-radius:20px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
        <ShoppingCart :size="28" color="rgba(100,116,139,0.45)" :stroke-width="1.5" />
      </div>
      <div style="font-size:18px;font-weight:700;color:#E2E8F0;margin-bottom:6px;">Tu carrito está vacío</div>
      <div style="font-size:13px;color:rgba(100,116,139,0.65);margin-bottom:24px;">Agrega productos desde el catálogo para continuar</div>
      <a href="/catalog" style="height:40px;padding:0 20px;border-radius:10px;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 14px rgba(14,165,233,0.28);">
        Ir al catálogo
      </a>
    </div>

    <!-- ── Vista principal del carrito ── -->
    <template v-else>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <div>
          <h1 style="font-size:20px;font-weight:800;color:#F1F5F9;margin:0;">Carrito de compras</h1>
          <p style="font-size:12px;color:rgba(100,116,139,0.65);margin:4px 0 0;">{{ cart.items.length }} producto{{ cart.items.length !== 1 ? 's' : '' }} · {{ totalUnits }} unidades</p>
        </div>
        <button @click="cart.clearCart()"
          style="height:34px;padding:0 14px;border-radius:9px;background:rgba(244,63,94,0.07);border:1px solid rgba(244,63,94,0.18);color:#fb7185;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px;">
          <Trash2 :size="12" /> Vaciar todo
        </button>
      </div>

      <!-- Tabla de productos -->
      <div style="border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);margin-bottom:16px;overflow:hidden;">
        <div style="display:grid;grid-template-columns:1fr 100px 120px 110px 40px;gap:12px;padding:10px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
          <span style="font-size:10px;font-weight:600;color:rgba(71,85,105,0.8);text-transform:uppercase;letter-spacing:0.8px;">Producto</span>
          <span style="font-size:10px;font-weight:600;color:rgba(71,85,105,0.8);text-transform:uppercase;letter-spacing:0.8px;text-align:center;">Precio u.</span>
          <span style="font-size:10px;font-weight:600;color:rgba(71,85,105,0.8);text-transform:uppercase;letter-spacing:0.8px;text-align:center;">Cantidad</span>
          <span style="font-size:10px;font-weight:600;color:rgba(71,85,105,0.8);text-transform:uppercase;letter-spacing:0.8px;text-align:right;">Subtotal</span>
          <span></span>
        </div>

        <div v-for="(item, idx) in cart.items" :key="item.product.id"
          :style="{ borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }">
          <div style="display:grid;grid-template-columns:1fr 100px 120px 110px 40px;gap:12px;padding:14px 20px;align-items:center;">
            <div style="display:flex;align-items:center;gap:12px;min-width:0;">
              <div style="width:46px;height:46px;flex-shrink:0;border-radius:10px;background:rgba(14,165,233,0.07);border:1px solid rgba(14,165,233,0.12);display:flex;align-items:center;justify-content:center;overflow:hidden;">
                <img v-if="item.product?.images?.[0]" :src="item.product.images[0]" :alt="item.product.name"
                  style="width:40px;height:40px;object-fit:contain;"
                  @error="(e:any) => e.target.style.display='none'" />
                <Package v-else :size="18" color="#38bdf8" :stroke-width="1.5" />
              </div>
              <div style="min-width:0;">
                <div style="font-size:13px;font-weight:600;color:#E2E8F0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ item.product?.name ?? '—' }}</div>
                <div style="font-size:11px;color:rgba(100,116,139,0.65);margin-top:2px;display:flex;gap:6px;">
                  <span>{{ item.product?.supplier ?? '' }}</span>
                  <span v-if="item.product?.sku" style="font-family:monospace;">{{ item.product.sku }}</span>
                </div>
              </div>
            </div>
            <div style="text-align:center;font-size:12px;font-weight:600;color:#94a3b8;">
              {{ item.product?.price > 0 ? fmt(item.product.price) : '—' }}
            </div>
            <div style="display:flex;align-items:center;justify-content:center;gap:6px;">
              <button @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
                style="width:28px;height:28px;border-radius:7px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#94a3b8;">
                <Minus :size="10" :stroke-width="2.5" />
              </button>
              <div style="width:34px;height:28px;border-radius:7px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.18);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#38bdf8;">
                {{ item.quantity }}
              </div>
              <button @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
                style="width:28px;height:28px;border-radius:7px;background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.18);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#38bdf8;">
                <Plus :size="10" :stroke-width="2.5" />
              </button>
            </div>
            <div style="text-align:right;font-size:14px;font-weight:700;color:#F1F5F9;">
              {{ item.product?.price > 0 ? fmt(item.product.price * item.quantity) : '—' }}
            </div>
            <div style="display:flex;justify-content:center;">
              <button @click="cart.removeItem(item.product.id)"
                style="width:28px;height:28px;border-radius:7px;background:transparent;border:1px solid transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(100,116,139,0.35);transition:all 0.15s;"
                @mouseenter="(e:any) => { e.currentTarget.style.background='rgba(244,63,94,0.08)'; e.currentTarget.style.borderColor='rgba(244,63,94,0.2)'; e.currentTarget.style.color='#fb7185' }"
                @mouseleave="(e:any) => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.color='rgba(100,116,139,0.35)' }">
                <Trash2 :size="13" />
              </button>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid rgba(255,255,255,0.04);padding:10px 20px;">
          <a href="/catalog"
            style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:rgba(100,116,139,0.55);font-weight:500;text-decoration:none;"
            @mouseenter="(e:any) => e.currentTarget.style.color='#38bdf8'"
            @mouseleave="(e:any) => e.currentTarget.style.color='rgba(100,116,139,0.55)'">
            <Plus :size="12" /> Agregar más productos
          </a>
        </div>
      </div>

      <!-- Fila inferior -->
      <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap;">

        <!-- Detalles de la orden -->
        <div style="flex:1;min-width:280px;border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);padding:20px;display:flex;flex-direction:column;gap:18px;">
          <div style="font-size:13px;font-weight:700;color:#E2E8F0;">Detalles de la orden</div>
          <div>
            <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">Prioridad</div>
            <div style="display:flex;gap:6px;">
              <button v-for="p in priorities" :key="p.key" @click="priority = p.key"
                :style="{
                  flex:1, height:'34px', borderRadius:'9px', fontSize:'12px',
                  fontWeight: priority === p.key ? 700 : 500, cursor:'pointer', fontFamily:'inherit',
                  border: `1px solid ${priority === p.key ? p.border : 'rgba(255,255,255,0.07)'}`,
                  background: priority === p.key ? p.bg : 'rgba(255,255,255,0.02)',
                  color: priority === p.key ? p.color : 'rgba(100,116,139,0.6)',
                  transition:'all 0.15s'
                }">{{ p.label }}</button>
            </div>
            <div :style="{ display:'flex', alignItems:'center', gap:'7px', marginTop:'8px', padding:'8px 11px', borderRadius:'9px', background: activePri.bg, border:`1px solid ${activePri.border}` }">
              <div :style="{ width:'6px', height:'6px', borderRadius:'50%', background: activePri.color, flexShrink:0 }" />
              <span :style="{ fontSize:'11px', fontWeight:600, color: activePri.color }">{{ priorityLabel }}</span>
            </div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.6);text-transform:uppercase;letter-spacing:0.8px;">Notas</div>
              <span style="font-size:10px;color:rgba(71,85,105,0.65);">{{ notes.length }}/300</span>
            </div>
            <textarea v-model="notes" @input="notes = notes.slice(0, 300)"
              placeholder="Justificación, área solicitante, instrucciones especiales..."
              rows="3"
              :style="{
                width:'100%', padding:'10px 12px', fontSize:'12px', color:'#CBD5E1',
                outline:'none', resize:'none', fontFamily:'inherit', lineHeight:'1.5',
                boxSizing:'border-box', borderRadius:'10px', transition:'all 0.2s',
                background: notesFocus ? 'rgba(14,165,233,0.05)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${notesFocus ? 'rgba(14,165,233,0.35)' : 'rgba(255,255,255,0.07)'}`
              }"
              @focus="notesFocus = true" @blur="notesFocus = false" />
          </div>
        </div>

        <!-- Resumen y pago -->
        <div style="flex:0 0 300px;min-width:280px;border-radius:16px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
          <div style="padding:18px 20px 14px;">
            <div style="font-size:13px;font-weight:700;color:#E2E8F0;margin-bottom:14px;">Resumen</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <div v-for="item in cart.items" :key="item.product.id"
                style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                <span style="font-size:12px;color:rgba(100,116,139,0.75);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">
                  {{ (item.product?.name ?? '').slice(0, 28) }}{{ (item.product?.name ?? '').length > 28 ? '…' : '' }}
                  <span style="color:rgba(71,85,105,0.7);"> ×{{ item.quantity }}</span>
                </span>
                <span style="font-size:12px;color:#94a3b8;font-weight:500;flex-shrink:0;">
                  {{ item.product?.price > 0 ? fmt(item.product.price * item.quantity) : '—' }}
                </span>
              </div>
            </div>
          </div>
          <div style="padding:14px 20px;border-top:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;font-size:12px;color:rgba(100,116,139,0.8);">
              <span>Subtotal</span><span>{{ fmt(subtotal) }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:rgba(100,116,139,0.8);">
              <span>IVA (16%)</span><span>{{ fmt(iva) }}</span>
            </div>
          </div>
          <div style="padding:14px 20px;border-top:1px solid rgba(14,165,233,0.12);background:rgba(14,165,233,0.04);display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:13px;font-weight:700;color:#E2E8F0;">Total con IVA</span>
            <span style="font-size:18px;font-weight:800;letter-spacing:-0.5px;background:linear-gradient(135deg,#0EA5E9,#22D3EE);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{{ fmt(subtotal + iva) }}</span>
          </div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:10px;">
            <button @click="openPaymentModal"
              style="width:100%;height:44px;border-radius:11px;border:none;cursor:pointer;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;font-weight:700;font-size:13px;font-family:inherit;box-shadow:0 4px 18px rgba(14,165,233,0.32);display:flex;align-items:center;justify-content:center;gap:8px;">
              <CreditCard :size="15" /> Elegir método de pago
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- ══════════════════════════════════════════ -->
    <!-- ──── Modal de pago OpenPay ────────────── -->
    <!-- ══════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="showPayModal"
        style="position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;"
        @click.self="closePayModal">
        <div style="position:absolute;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);"></div>

        <div style="position:relative;width:100%;max-width:440px;border-radius:20px;background:linear-gradient(160deg,#0D1B35,#091228);border:1px solid rgba(255,255,255,0.1);overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.6);">

          <!-- ── Modal header ── -->
          <div style="padding:22px 24px 0;">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;">
              <div>
                <!-- Logo OpenPay oficial -->
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                  <div style="background:white;border-radius:6px;padding:3px 10px;display:flex;align-items:center;">
                    <img src="/openpay/openpay-logo.jpg" alt="Openpay by BBVA" style="height:18px;object-fit:contain;" />
                  </div>
                  <span style="font-size:11px;color:rgba(100,116,139,0.5);">Pago seguro</span>
                </div>
                <!-- Logos de marcas de tarjeta oficiales -->
                <div style="display:flex;align-items:center;gap:5px;">
                  <div style="height:22px;padding:2px 8px;border-radius:4px;background:white;display:flex;align-items:center;justify-content:center;">
                    <img src="/openpay/visa.png" alt="Visa" style="height:13px;object-fit:contain;" />
                  </div>
                  <div style="height:22px;padding:2px 6px;border-radius:4px;background:white;display:flex;align-items:center;justify-content:center;">
                    <img src="/openpay/mastercard.png" alt="Mastercard" style="height:18px;object-fit:contain;" />
                  </div>
                  <div style="height:22px;width:36px;border-radius:4px;overflow:hidden;flex-shrink:0;">
                    <img src="/openpay/amex.png" alt="American Express" style="height:22px;width:36px;object-fit:cover;" />
                  </div>
                  <div style="height:22px;padding:2px 6px;border-radius:4px;background:white;display:flex;align-items:center;justify-content:center;">
                    <img src="/openpay/carnet.png" alt="Carnet" style="height:16px;object-fit:contain;" />
                  </div>
                </div>
              </div>
              <button @click="closePayModal"
                style="width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#64748b;flex-shrink:0;">
                <X :size="15" />
              </button>
            </div>

            <!-- Total -->
            <div style="padding:11px 14px;border-radius:11px;background:rgba(14,165,233,0.07);border:1px solid rgba(14,165,233,0.18);display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
              <span style="font-size:12px;color:rgba(100,116,139,0.8);">Total a pagar</span>
              <span style="font-size:20px;font-weight:800;background:linear-gradient(135deg,#0EA5E9,#22D3EE);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{{ fmt(subtotal + iva) }}</span>
            </div>

            <!-- Selector método -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
              <button @click="payTab = 'card'"
                :style="{
                  height:'44px', borderRadius:'10px', fontSize:'12px', fontWeight:600,
                  cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center',
                  justifyContent:'center', gap:'8px', transition:'all 0.15s', border:'none',
                  background: payTab==='card' ? 'rgba(14,165,233,0.15)' : 'rgba(255,255,255,0.03)',
                  color: payTab==='card' ? '#38bdf8' : 'rgba(100,116,139,0.7)',
                  outline: payTab==='card' ? '1.5px solid rgba(14,165,233,0.45)' : '1px solid rgba(255,255,255,0.08)',
                }">
                <CreditCard :size="14" /> Tarjeta
              </button>
              <button @click="payTab = 'spei'"
                :style="{
                  height:'44px', borderRadius:'10px', fontSize:'12px', fontWeight:600,
                  cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center',
                  justifyContent:'center', gap:'8px', transition:'all 0.15s', border:'none',
                  background: payTab==='spei' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
                  color: payTab==='spei' ? '#34d399' : 'rgba(100,116,139,0.7)',
                  outline: payTab==='spei' ? '1.5px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.08)',
                }">
                <div style="background:white;border-radius:3px;padding:1px 4px;display:flex;align-items:center;">
                  <img src="/openpay/spei.png" alt="SPEI" style="height:14px;object-fit:contain;" />
                </div>
                Transferencia
              </button>
            </div>
          </div>

          <!-- ── Tab: Tarjeta ── -->
          <div v-if="payTab === 'card'" style="padding:0 24px 24px;display:flex;flex-direction:column;gap:14px;">
            <div>
              <label style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.7px;display:block;margin-bottom:6px;">Nombre en la tarjeta</label>
              <input v-model="card.holderName" type="text" placeholder="Como aparece en la tarjeta"
                autocomplete="cc-name"
                :style="inputStyle(cardFocus.holderName)"
                @focus="cardFocus.holderName=true" @blur="cardFocus.holderName=false" />
            </div>
            <div>
              <label style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.7px;display:block;margin-bottom:6px;">Número de tarjeta</label>
              <div style="position:relative;">
                <input v-model="card.number" type="text" placeholder="0000 0000 0000 0000"
                  autocomplete="cc-number" maxlength="19"
                  @input="formatCardNumber"
                  :style="{ ...inputStyle(cardFocus.number), paddingRight:'44px' }"
                  @focus="cardFocus.number=true" @blur="cardFocus.number=false" />
                <div style="position:absolute;right:13px;top:50%;transform:translateY(-50%);pointer-events:none;">
                  <CreditCard :size="16" color="rgba(100,116,139,0.4)" />
                </div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div>
                <label style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.7px;display:block;margin-bottom:6px;">Vencimiento (MM/AA)</label>
                <input v-model="card.expiry" type="text" placeholder="MM/AA"
                  autocomplete="cc-exp" maxlength="5"
                  @input="formatExpiry"
                  :style="inputStyle(cardFocus.expiry)"
                  @focus="cardFocus.expiry=true" @blur="cardFocus.expiry=false" />
              </div>
              <div>
                <label style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.7px;display:block;margin-bottom:6px;">CVV</label>
                <input v-model="card.cvv" type="password" placeholder="•••"
                  autocomplete="cc-csc" maxlength="4"
                  :style="inputStyle(cardFocus.cvv)"
                  @focus="cardFocus.cvv=true" @blur="cardFocus.cvv=false" />
              </div>
            </div>

            <!-- Error de pago con tarjeta -->
            <div v-if="payError" style="padding:10px 13px;border-radius:9px;background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.2);font-size:12px;color:#fb7185;display:flex;align-items:flex-start;gap:8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fb7185" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{{ payError }}</span>
            </div>

            <button @click="handlePayCard" :disabled="paying"
              :style="{
                width:'100%', height:'46px', borderRadius:'12px', border:'none', marginTop:'4px',
                cursor: paying ? 'not-allowed' : 'pointer',
                background: paying ? 'rgba(14,165,233,0.35)' : 'linear-gradient(135deg,#0EA5E9,#0284C7)',
                color:'white', fontWeight:700, fontSize:'14px', fontFamily:'inherit',
                boxShadow: paying ? 'none' : '0 6px 20px rgba(14,165,233,0.38)',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                transition:'all 0.2s'
              }">
              <span v-if="paying" style="display:flex;align-items:center;gap:8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 0.8s linear infinite;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                Procesando pago…
              </span>
              <span v-else style="display:flex;align-items:center;gap:8px;">
                <Lock :size="14" /> Pagar {{ fmt(subtotal + iva) }}
              </span>
            </button>

            <div style="display:flex;align-items:center;justify-content:center;gap:7px;">
              <Lock :size="11" color="rgba(100,116,139,0.35)" />
              <span style="font-size:10px;color:rgba(100,116,139,0.4);">Pago cifrado SSL · Procesado por</span>
              <div style="background:white;border-radius:4px;padding:1px 6px;display:inline-flex;align-items:center;">
                <img src="/openpay/openpay-logo.jpg" alt="Openpay" style="height:11px;object-fit:contain;" />
              </div>
            </div>
          </div>

          <!-- ── Tab: SPEI ── -->
          <div v-else style="padding:0 24px 24px;display:flex;flex-direction:column;gap:14px;">
            <div style="padding:14px 16px;border-radius:12px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);display:flex;flex-direction:column;gap:10px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <div style="background:white;border-radius:5px;padding:4px 8px;display:flex;align-items:center;flex-shrink:0;">
                  <img src="/openpay/spei.png" alt="SPEI" style="height:22px;object-fit:contain;" />
                </div>
                <div style="font-size:12px;font-weight:600;color:#34d399;">Transferencia SPEI</div>
              </div>
              <div style="font-size:11px;color:rgba(100,116,139,0.75);line-height:1.6;">
                Al confirmar, se generará una CLABE interbancaria. Realiza la transferencia desde tu banco con ese número. Tu pedido quedará pendiente hasta que el administrador confirme el pago.
              </div>
            </div>

            <div style="padding:12px 16px;border-radius:11px;background:rgba(14,165,233,0.06);border:1px solid rgba(14,165,233,0.15);display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:12px;color:rgba(100,116,139,0.8);">Monto a transferir</span>
              <span style="font-size:18px;font-weight:800;background:linear-gradient(135deg,#0EA5E9,#22D3EE);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{{ fmt(subtotal + iva) }}</span>
            </div>

            <div v-if="payError" style="padding:10px 13px;border-radius:9px;background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.2);font-size:12px;color:#fb7185;">
              {{ payError }}
            </div>

            <button @click="handlePaySpei" :disabled="paying"
              :style="{
                width:'100%', height:'46px', borderRadius:'12px', border:'none', marginTop:'4px',
                cursor: paying ? 'not-allowed' : 'pointer',
                background: paying ? 'rgba(16,185,129,0.25)' : 'linear-gradient(135deg,#10B981,#059669)',
                color:'white', fontWeight:700, fontSize:'14px', fontFamily:'inherit',
                boxShadow: paying ? 'none' : '0 6px 20px rgba(16,185,129,0.3)',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                transition:'all 0.2s'
              }">
              <span v-if="paying" style="display:flex;align-items:center;gap:8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 0.8s linear infinite;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                Generando referencia…
              </span>
              <span v-else>Generar referencia SPEI</span>
            </button>

            <div style="display:flex;align-items:center;justify-content:center;gap:7px;">
              <Lock :size="11" color="rgba(100,116,139,0.35)" />
              <span style="font-size:10px;color:rgba(100,116,139,0.4);">Procesado por</span>
              <div style="background:white;border-radius:4px;padding:1px 6px;display:inline-flex;align-items:center;">
                <img src="/openpay/openpay-logo.jpg" alt="Openpay" style="height:11px;object-fit:contain;" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<style>
@keyframes spin { to { transform: rotate(360deg) } }
</style>

<script setup lang="ts">
import { ShoppingCart, Package, Trash2, Plus, Minus, CreditCard, X, Lock } from '@lucide/vue'

definePageMeta({ middleware: 'auth' })

const cart      = useCartStore()
const notes     = ref('')
const priority  = ref('normal')
const notesFocus = ref(false)

// ── States de resultado ──
const submitted  = ref(false)
const paymentAuth = ref('')
const speiResult  = ref<{ clabe: string; bank: string; agreement: string; beneficiary: string; amount: number } | null>(null)
const clabeCopied = ref(false)

// ── Modal ──
const showPayModal = ref(false)
const payTab       = ref<'card' | 'spei'>('card')
const paying       = ref(false)
const payError     = ref('')

// ── Card fields ──
const card = reactive({ holderName: '', number: '', expiry: '', cvv: '' })
const cardFocus = reactive({ holderName: false, number: false, expiry: false, cvv: false })

const config = useRuntimeConfig()

const priorities = [
  { key:'low',    label:'Baja',    color:'#94a3b8', bg:'rgba(148,163,184,0.08)', border:'rgba(148,163,184,0.2)' },
  { key:'normal', label:'Normal',  color:'#38bdf8', bg:'rgba(14,165,233,0.09)',  border:'rgba(14,165,233,0.25)' },
  { key:'high',   label:'Alta',    color:'#fbbf24', bg:'rgba(245,158,11,0.09)',  border:'rgba(245,158,11,0.25)' },
  { key:'urgent', label:'Urgente', color:'#fb7185', bg:'rgba(244,63,94,0.09)',   border:'rgba(244,63,94,0.25)'  },
]

const activePri     = computed(() => priorities.find(p => p.key === priority.value)!)
const priorityLabel = computed(() => ({ urgent:'Urgente — notificación inmediata', high:'Alta — procesamiento en 4h', normal:'Normal — procesamiento en 24h', low:'Baja — sin urgencia' }[priority.value] ?? ''))
const subtotal      = computed(() => cart.total)
const iva           = computed(() => subtotal.value * 0.16)
const totalUnits    = computed(() => cart.items.reduce((s, i) => s + i.quantity, 0))

const fmt = (n: number) => new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' }).format(n)

function inputStyle(focused: boolean) {
  return {
    width:'100%', height:'42px', padding:'0 13px', fontSize:'13px',
    color:'#E2E8F0', outline:'none', fontFamily:'inherit', boxSizing:'border-box',
    borderRadius:'10px', transition:'all 0.2s',
    background: focused ? 'rgba(14,165,233,0.05)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused ? 'rgba(14,165,233,0.45)' : 'rgba(255,255,255,0.08)'}`,
  }
}

function formatCardNumber(e: Event) {
  let v = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 16)
  card.number = v.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(e: Event) {
  let v = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4)
  // Si el primer dígito es > 1, agregar cero a la izquierda (ej. "6" → "06")
  if (v.length === 1 && parseInt(v) > 1) v = '0' + v
  if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2)
  card.expiry = v
}

function cartItems() {
  return cart.items.map(i => ({
    productId: i.product?.id,
    name:      i.product?.name,
    sku:       i.product?.sku,
    price:     i.product?.price,
    quantity:  i.quantity,
    images:    i.product?.images?.slice(0, 1) ?? [],
    satKey:    i.product?.satKey,
  }))
}

// ── OpenPay.js ──
let openpayLoaded = false

async function loadOpenPay(): Promise<void> {
  if (typeof window === 'undefined') return
  const w = window as any
  // Si ya está inicializado correctamente, no hacer nada
  if (openpayLoaded && w.OpenPay?.token) return
  // Cargar script si no existe aún
  if (!w.OpenPay) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://js.openpay.mx/openpay.v1.min.js'
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('No se pudo cargar OpenPay.js'))
      document.head.appendChild(s)
    })
  }
  const merchantId = config.public.openpayMerchantId
  const publicKey  = config.public.openpayPublicKey
  if (!merchantId || !publicKey) {
    throw new Error('OpenPay: credenciales no configuradas')
  }
  w.OpenPay.setId(merchantId)
  w.OpenPay.setApiKey(publicKey)
  w.OpenPay.setSandboxMode(config.public.openpayIsSandbox !== 'false')
  openpayLoaded = true
}

function openPaymentModal() {
  payError.value = ''
  showPayModal.value = true
  loadOpenPay().catch(() => {})
}

function closePayModal() {
  if (paying.value) return
  showPayModal.value = false
  payError.value = ''
}

// ── Pago con tarjeta ──
async function handlePayCard() {
  if (paying.value) return
  payError.value = ''

  if (!card.holderName.trim()) { payError.value = 'Escribe el nombre del titular'; return }
  const rawNum = card.number.replace(/\D/g, '')
  if (rawNum.length < 15 || rawNum.length > 19) { payError.value = 'Número de tarjeta inválido'; return }
  const [expM, expY] = card.expiry.split('/')
  if (!expM || !expY || expM.length !== 2 || expY.length !== 2) { payError.value = 'Fecha de vencimiento inválida (MM/AA)'; return }
  const mNum = parseInt(expM, 10)
  if (mNum < 1 || mNum > 12) { payError.value = 'Mes de vencimiento inválido (01-12)'; return }
  const now = new Date()
  const curY = now.getFullYear() % 100
  const curM = now.getMonth() + 1
  const yNum = parseInt(expY, 10)
  if (yNum < curY || (yNum === curY && mNum < curM)) { payError.value = 'La tarjeta ya venció, verifica la fecha'; return }
  if (!card.cvv || card.cvv.length < 3) { payError.value = 'CVV inválido'; return }

  paying.value = true

  // Cargar e inicializar OpenPay
  try {
    await loadOpenPay()
  } catch (e: any) {
    payError.value = 'No se pudo inicializar el módulo de pago, intenta de nuevo.'
    paying.value = false
    return
  }

  const w = window as any

  // Obtener deviceSessionId con manejo de error
  let deviceSessionId: string
  try {
    deviceSessionId = w.OpenPay.deviceData.setup() || ('ds-' + Date.now())
  } catch {
    deviceSessionId = 'ds-' + Date.now()
  }

  // Timeout de seguridad — si los callbacks nunca disparan, desbloquear UI
  let callbackFired = false
  const safetyTimer = setTimeout(() => {
    if (!callbackFired) {
      callbackFired = true
      paying.value = false
      payError.value = 'La operación no respondió. Revisa tu conexión e intenta de nuevo.'
    }
  }, 25000)

  const done = () => {
    callbackFired = true
    clearTimeout(safetyTimer)
  }

  // Tokenizar tarjeta con OpenPay.js
  try {
    w.OpenPay.token.create(
      {
        card_number:      rawNum,
        holder_name:      card.holderName.trim(),
        expiration_year:  expY,
        expiration_month: expM,
        cvv2:             card.cvv,
      },
      // ── Callback éxito: token creado, enviar al servidor ──
      async (response: any) => {
        done()
        try {
          const result = await $fetch<any>('/api/payments/create', {
            method: 'POST',
            body: {
              method:          'card',
              token:           response.data.id,
              deviceSessionId,
              redirectUrl:     window.location.origin + '/payment/return',
              items:           cartItems(),
              priority:        priority.value,
              notes:           notes.value || undefined,
            },
          })
          cart.clearCart()
          showPayModal.value = false
          if (result.threeDSUrl) {
            // Redirigir al banco para verificación 3D Secure
            window.location.href = result.threeDSUrl
          } else {
            paymentAuth.value = result.order?.authorization ?? result.order?.paymentId ?? ''
            submitted.value   = true
          }
        } catch (e: any) {
          payError.value = e?.data?.message ?? 'Tu pago no pudo ser realizado, intenta de nuevo.'
        } finally {
          paying.value = false
        }
      },
      // ── Callback error: OpenPay rechazó la tarjeta ──
      (error: any) => {
        done()
        const code = error?.data?.error_code
        const msgs: Record<number, string> = {
          3001: 'El pago no pudo ser realizado, intenta de nuevo.',
          3002: 'Tu pago no pudo ser completado. Intenta con otra tarjeta o elige otra forma de pago.',
          3003: 'Tu pago no pudo ser realizado. Intenta con otra tarjeta.',
          3004: 'El pago no pudo ser realizado, intenta de nuevo.',
          3005: 'El pago no pudo ser realizado, intenta de nuevo.',
          3006: 'El pago no pudo ser realizado, intenta de nuevo o comunícate con tu banco.',
          3007: 'La tarjeta ha expirado. Intenta con otra tarjeta.',
          3008: 'La tarjeta no es compatible con compras. Intenta con otra tarjeta.',
          3009: 'Tu pago fue declinado. Comunícate con tu banco o intenta con otra tarjeta.',
          3010: 'Tu banco ha restringido el uso de la tarjeta. Comunícate con tu banco.',
          3011: 'Tu banco ha declinado el pago. Comunícate con tu banco y autoriza el pago.',
          3012: 'Se requiere autorización de tu banco para este pago. Comunícate con tu banco.',
          2004: 'El número de tarjeta es inválido.',
          2005: 'La tarjeta ha expirado.',
          2009: 'El código de seguridad (CVV) es inválido.',
        }
        // Intentar también sin .data por si OpenPay.js cambia la estructura
        const code2 = code ?? error?.error_code
        payError.value = (code2 && msgs[code2])
          ?? error?.data?.description
          ?? error?.description
          ?? 'Ocurrió un error, intenta de nuevo o comunícate con tu banco.'
        paying.value = false
      },
    )
  } catch (syncErr: any) {
    // OpenPay.token.create lanzó excepción síncrona
    done()
    payError.value = 'Error al procesar la tarjeta. Verifica los datos e intenta de nuevo.'
    paying.value = false
  }
}

// ── Pago SPEI ──
async function handlePaySpei() {
  if (paying.value) return
  payError.value = ''
  paying.value   = true

  try {
    const result = await $fetch<any>('/api/payments/create', {
      method: 'POST',
      body: {
        method:   'spei',
        items:    cartItems(),
        priority: priority.value,
        notes:    notes.value || undefined,
      },
    })
    cart.clearCart()
    showPayModal.value = false
    speiResult.value   = {
      clabe:       result.order?.spei?.clabe ?? '',
      bank:        result.order?.spei?.bank  ?? '',
      agreement:   result.order?.spei?.agreement ?? '',
      beneficiary: result.order?.spei?.beneficiary ?? '',
      amount:      result.order?.total ?? (subtotal.value + iva.value),
    }
  } catch (e: any) {
    payError.value = e?.data?.message ?? 'Ocurrió un error, intenta de nuevo o comunícate con tu banco.'
  } finally {
    paying.value = false
  }
}

async function copyClabe() {
  if (!speiResult.value?.clabe) return
  try {
    await navigator.clipboard.writeText(speiResult.value.clabe)
    clabeCopied.value = true
    setTimeout(() => { clabeCopied.value = false }, 2000)
  } catch {}
}
</script>
