<template>
  <div style="font-family:'Inter',system-ui,sans-serif;max-width:900px;margin:0 auto;">

    <!-- ── Éxito: pago con tarjeta ── -->
    <div v-if="submitted" style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
      <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#16A34A,#059669);display:flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow:0 0 40px rgba(34,197,94,0.3);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style="font-size:22px;font-weight:800;color:#0B1B33;margin-bottom:8px;">¡Transacción exitosa!</div>
      <div style="font-size:14px;color:#16A34A;font-weight:600;margin-bottom:6px;">Recibimos tu pago. ¡Gracias por tu compra!</div>
      <div style="font-size:12px;color:#5B6B82;max-width:300px;line-height:1.6;margin-bottom:6px;">El administrador procesará tu pedido a la brevedad.</div>
      <div v-if="paymentAuth" style="font-size:11px;font-family:monospace;color:rgba(91,107,130,0.45);margin-bottom:22px;">Autorización: {{ paymentAuth }}</div>
      <a href="/orders" style="height:42px;padding:0 24px;border-radius:11px;background:linear-gradient(135deg,#1570EF,#0B5BD3);color:white;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;box-shadow:0 4px 16px rgba(21,112,239,0.3);">
        Ver mis órdenes
      </a>
    </div>

    <!-- ── Éxito: SPEI — recibo de pago completo ── -->
    <div v-else-if="speiResult" style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;">
      <div style="width:100%;max-width:680px;border-radius:20px;background:linear-gradient(160deg,#FFFFFF,#F5F8FC);border:1px solid rgba(21,112,239,0.2);overflow:hidden;box-shadow:0 24px 80px rgba(11,27,51,0.16);">

        <!-- ── Encabezado del recibo ── -->
        <div style="padding:22px 28px 18px;border-bottom:1px solid rgba(11,27,51,0.06);display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <img src="/logosieeg.jpg" alt="SIEEG" style="height:26px;width:26px;object-fit:contain;border-radius:5px;" />
              <span style="font-size:15px;font-weight:800;color:#0B1B33;letter-spacing:-0.3px;">SIEEG INTEGRADORES</span>
            </div>
            <div style="font-size:11px;color:#7A889C;margin-bottom:12px;">Transferencia interbancaria (SPEI)</div>
            <div style="display:flex;flex-direction:column;gap:5px;">
              <div style="font-size:11px;color:#7A889C;">
                <span style="font-weight:600;color:#5B6B82;">Fecha límite de pago:</span>
                <span style="margin-left:6px;">{{ speiDueDate }}</span>
              </div>
              <div style="font-size:11px;color:#7A889C;">
                <span style="font-weight:600;color:#5B6B82;">Beneficiario:</span>
                <span style="margin-left:6px;">{{ speiResult.beneficiary || 'SIEEG INTEGRADORES' }}</span>
              </div>
            </div>
          </div>
          <!-- Monto a pagar -->
          <div style="padding:16px 22px;border-radius:14px;background:rgba(21,112,239,0.1);border:1px solid rgba(21,112,239,0.25);text-align:center;min-width:180px;">
            <div style="font-size:10px;font-weight:600;color:#7A889C;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;">Total a pagar / MXN</div>
            <div style="font-size:26px;font-weight:800;background:linear-gradient(135deg,#1570EF,#0B5BD3);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-1px;">{{ fmt(speiResult.amount) }}</div>
          </div>
        </div>

        <!-- ── Detalles de la compra ── -->
        <div style="padding:16px 28px;border-bottom:1px solid rgba(11,27,51,0.06);">
          <div style="font-size:11px;font-weight:700;color:#0B5BD3;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">Detalles de la compra</div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;gap:16px;padding:8px 0;border-bottom:1px solid rgba(11,27,51,0.04);">
              <span style="font-size:12px;color:#7A889C;">Descripción</span>
              <span style="font-size:12px;color:#5B6B82;font-weight:500;">Pedido SIEEG Integradores</span>
            </div>
            <div style="display:flex;justify-content:space-between;gap:16px;padding:8px 0;">
              <span style="font-size:12px;color:#7A889C;">Fecha y hora</span>
              <span style="font-size:12px;color:#5B6B82;">{{ speiCreatedDate }}</span>
            </div>
          </div>
        </div>

        <!-- ── Instrucciones de pago ── -->
        <div style="padding:16px 28px 20px;border-bottom:1px solid rgba(11,27,51,0.06);">
          <div style="font-size:11px;font-weight:700;color:#0B5BD3;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:14px;">Pasos para realizar el pago</div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">

            <!-- Bancomer -->
            <div style="padding:14px 16px;border-radius:12px;background:rgba(11,27,51,0.02);border:1px solid rgba(11,27,51,0.08);">
              <div style="font-size:11px;font-weight:700;color:#0B1B33;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                <div style="width:6px;height:6px;border-radius:50%;background:#1570EF;flex-shrink:0;"></div>
                Desde BBVA Bancomer
              </div>
              <div style="font-size:11px;color:#5B6B82;line-height:1.65;margin-bottom:10px;">
                1. Dentro del menú <strong style="color:#0B1B33;">"Pagar"</strong> seleccione <strong style="color:#0B1B33;">"De servicios"</strong> e ingrese el <strong style="color:#0B1B33;">"Número de convenio CIE"</strong>.
              </div>
              <div style="font-size:11px;color:#5B6B82;line-height:1.65;margin-bottom:10px;">
                2. Ingrese los datos de registro para concluir con la operación:
              </div>
              <div style="display:flex;flex-direction:column;gap:6px;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <span style="font-size:10px;color:#7A889C;">Núm. convenio CIE:</span>
                  <span style="font-size:11px;font-weight:700;font-family:monospace;color:#0B5BD3;">{{ speiResult.agreement }}</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <span style="font-size:10px;color:#7A889C;">Referencia:</span>
                  <div style="display:flex;align-items:center;gap:4px;">
                    <span style="font-size:10px;font-weight:600;font-family:monospace;color:#0B1B33;">{{ speiResult.reference || speiResult.clabe }}</span>
                    <button @click="copyRef" style="height:18px;padding:0 5px;border-radius:4px;background:rgba(21,112,239,0.1);border:1px solid rgba(21,112,239,0.2);color:#0B5BD3;font-size:9px;cursor:pointer;font-family:inherit;flex-shrink:0;">
                      {{ refCopied ? '✓' : 'Copiar' }}
                    </button>
                  </div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <span style="font-size:10px;color:#7A889C;">Importe:</span>
                  <span style="font-size:11px;font-weight:700;color:#0B1B33;">{{ fmt(speiResult.amount) }} MXN</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <span style="font-size:10px;color:#7A889C;">Concepto:</span>
                  <span style="font-size:10px;color:#5B6B82;">Pedido SIEEG</span>
                </div>
              </div>
            </div>

            <!-- Otros bancos -->
            <div style="padding:14px 16px;border-radius:12px;background:rgba(11,27,51,0.02);border:1px solid rgba(11,27,51,0.08);">
              <div style="font-size:11px;font-weight:700;color:#0B1B33;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                <div style="width:6px;height:6px;border-radius:50%;background:#16A34A;flex-shrink:0;"></div>
                Desde cualquier otro banco
              </div>
              <div style="font-size:11px;color:#5B6B82;line-height:1.65;margin-bottom:10px;">
                Registra la cuenta beneficiaria del pago con los siguientes datos y realiza la transferencia:
              </div>
              <div style="display:flex;flex-direction:column;gap:6px;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <span style="font-size:10px;color:#7A889C;">Beneficiario:</span>
                  <span style="font-size:10px;font-weight:600;color:#0B1B33;">{{ speiResult.beneficiary || 'SIEEG' }}</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <span style="font-size:10px;color:#7A889C;">Banco destino:</span>
                  <span style="font-size:10px;font-weight:600;color:#0B1B33;">{{ speiResult.bank }}</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <span style="font-size:10px;color:#7A889C;">CLABE:</span>
                  <div style="display:flex;align-items:center;gap:4px;">
                    <span style="font-size:10px;font-weight:600;font-family:monospace;color:#0B5BD3;">{{ speiResult.clabe }}</span>
                    <button @click="copyClabe" style="height:18px;padding:0 5px;border-radius:4px;background:rgba(21,112,239,0.1);border:1px solid rgba(21,112,239,0.2);color:#0B5BD3;font-size:9px;cursor:pointer;font-family:inherit;flex-shrink:0;">
                      {{ clabeCopied ? '✓' : 'Copiar' }}
                    </button>
                  </div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <span style="font-size:10px;color:#7A889C;">Concepto de pago:</span>
                  <span style="font-size:10px;font-weight:600;font-family:monospace;color:#0B1B33;">{{ speiResult.reference || speiResult.clabe }}</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <span style="font-size:10px;color:#7A889C;">Referencia:</span>
                  <span style="font-size:10px;font-weight:600;font-family:monospace;color:#0B5BD3;">{{ speiResult.agreement }}</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                  <span style="font-size:10px;color:#7A889C;">Importe:</span>
                  <span style="font-size:11px;font-weight:700;color:#0B1B33;">{{ fmt(speiResult.amount) }} MXN</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Aviso importante -->
          <div style="margin-top:14px;padding:10px 13px;border-radius:9px;background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.2);font-size:11px;color:rgba(251,191,36,0.85);line-height:1.55;">
            Tu pedido quedará en espera hasta que el administrador confirme la recepción del pago. Guarda el comprobante de transferencia. El recibo estará disponible mientras la transacción esté pendiente.
          </div>
        </div>

        <!-- ── Acciones ── -->
        <div style="padding:18px 28px;display:flex;gap:10px;flex-wrap:wrap;">
          <a v-if="speiPdfUrl" :href="speiPdfUrl" target="_blank" rel="noopener"
            style="flex:1;min-width:160px;height:42px;border-radius:10px;background:rgba(21,112,239,0.1);border:1px solid rgba(21,112,239,0.3);color:#0B5BD3;font-size:12px;font-weight:600;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:7px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Descargar recibo PDF
          </a>
          <a href="/orders"
            style="flex:1;min-width:160px;height:42px;border-radius:10px;background:linear-gradient(135deg,#1570EF,#0B5BD3);color:white;font-size:12px;font-weight:700;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 4px 14px rgba(21,112,239,0.28);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Ver mis órdenes
          </a>
        </div>

        <!-- Powered by Openpay -->
        <div style="padding:0 28px 18px;display:flex;align-items:center;justify-content:center;gap:8px;">
          <span style="font-size:10px;color:#7A889C;">Procesado por</span>
          <div style="background:white;border-radius:4px;padding:2px 8px;display:inline-flex;align-items:center;">
            <img src="/openpay/openpay-logo.jpg" alt="Openpay" style="height:12px;object-fit:contain;" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Pedido confirmado (sin pago en línea) ── -->
    <div v-else-if="pedidoConfirmado" style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 16px;">
      <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#16A34A,#059669);display:flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow:0 0 40px rgba(34,197,94,0.3);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style="font-size:22px;font-weight:800;color:#0B1B33;margin-bottom:8px;">¡Recibimos tu pedido!</div>
      <div style="font-size:14px;color:#5B6B82;max-width:420px;line-height:1.6;margin-bottom:22px;">Te contactaremos para confirmar el pago por transferencia y la entrega. Puedes ver cómo va en <b>Mis órdenes</b>.</div>
      <a href="/orders" style="height:42px;padding:0 24px;border-radius:11px;background:linear-gradient(135deg,#1570EF,#0B5BD3);color:white;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;box-shadow:0 4px 16px rgba(21,112,239,0.3);">
        Ver mis órdenes
      </a>
    </div>

    <!-- ── Carrito vacío ── -->
    <div v-else-if="!cart.items.length" style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
      <CartQuotesForYou />
      <div style="width:72px;height:72px;border-radius:20px;background:linear-gradient(160deg,#FFFFFF,#F5F8FC);border:1px solid rgba(11,27,51,0.08);display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
        <ShoppingCart :size="28" color="rgba(91,107,130,0.45)" :stroke-width="1.5" />
      </div>
      <div style="font-size:18px;font-weight:700;color:#0B1B33;margin-bottom:6px;">Tu carrito está vacío</div>
      <div style="font-size:13px;color:#7A889C;margin-bottom:24px;">Agrega productos desde el catálogo para continuar</div>
      <a href="/catalog" style="height:40px;padding:0 20px;border-radius:10px;background:linear-gradient(135deg,#1570EF,#0B5BD3);color:white;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 14px rgba(21,112,239,0.28);">
        Ir al catálogo
      </a>
    </div>

    <!-- ── Vista principal del carrito ── -->
    <template v-else>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <div>
          <h1 style="font-size:20px;font-weight:800;color:#0B1B33;margin:0;">Carrito de compras</h1>
          <p style="font-size:12px;color:#7A889C;margin:4px 0 0;">{{ cart.items.length }} producto{{ cart.items.length !== 1 ? 's' : '' }} · {{ totalUnits }} unidades</p>
        </div>
        <button @click="cart.clearCart()"
          style="height:34px;padding:0 14px;border-radius:9px;background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.18);color:#EF4444;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px;">
          <Trash2 :size="12" /> Vaciar todo
        </button>
      </div>

      <!-- Cotización que está comprando -->
      <div v-if="cart.quote" class="ct-quote">
        <FileText :size="16" />
        <div>
          Estás comprando <b>{{ cart.quote.name ? `«${cart.quote.name}»` : 'la cotización' }}</b> <span class="ct-quote-folio">{{ cart.quote.folio }}</span>
          <span v-if="cart.quote.vendedor"> · preparada por {{ cart.quote.vendedor }}</span>
        </div>
        <button type="button" @click="cart.quitarCotizacion()">Ya no es de esta cotización</button>
      </div>
      <CartQuotesForYou v-else-if="!vende" />


      <!-- Cliente (vendedor / admin): el pedido o la cotización quedan a su nombre, con su precio -->
      <div v-if="vende" class="ct-client">
        <div class="ct-client-pick">
          <FilterCombo v-model="clienteId" :options="opcionesClientes" label="Cliente" empty-label="Sin elegir" count-label="pedido" placeholder="Buscar por nombre, empresa o número…" />
          <NuxtLink to="/clientes?nuevo=1" class="ct-client-new">+ Nuevo cliente</NuxtLink>
        </div>
        <div v-if="clienteSel && !clienteSel.mostrador && !clienteSel.fiscalCompleted" class="ct-client-warn">Este cliente no tiene datos fiscales: captúralos en Datos Fiscales antes de aprobar el pedido.</div>
      </div>

      <!-- Tabla de productos -->
      <div style="border-radius:16px;background:linear-gradient(160deg,#FFFFFF,#F5F8FC);border:1px solid rgba(11,27,51,0.07);margin-bottom:16px;overflow:hidden;">
        <div style="display:grid;grid-template-columns:1fr 100px 120px 110px 40px;gap:12px;padding:10px 20px;border-bottom:1px solid rgba(11,27,51,0.06);">
          <span style="font-size:10px;font-weight:600;color:#5B6B82;text-transform:uppercase;letter-spacing:0.8px;">Producto</span>
          <span style="font-size:10px;font-weight:600;color:#5B6B82;text-transform:uppercase;letter-spacing:0.8px;text-align:center;">Precio u.</span>
          <span style="font-size:10px;font-weight:600;color:#5B6B82;text-transform:uppercase;letter-spacing:0.8px;text-align:center;">Cantidad</span>
          <span style="font-size:10px;font-weight:600;color:#5B6B82;text-transform:uppercase;letter-spacing:0.8px;text-align:right;">Subtotal</span>
          <span></span>
        </div>

        <div v-for="(item, idx) in cart.items" :key="item.product.id"
          :style="{ borderTop: idx > 0 ? '1px solid rgba(11,27,51,0.04)' : 'none' }">
          <div style="display:grid;grid-template-columns:1fr 100px 120px 110px 40px;gap:12px;padding:14px 20px;align-items:center;">
            <div style="display:flex;align-items:center;gap:12px;min-width:0;">
              <div style="width:46px;height:46px;flex-shrink:0;border-radius:10px;background:rgba(21,112,239,0.07);border:1px solid rgba(21,112,239,0.12);display:flex;align-items:center;justify-content:center;overflow:hidden;">
                <img v-if="item.product?.images?.[0]" :src="item.product.images[0]" :alt="item.product.name"
                  style="width:40px;height:40px;object-fit:contain;"
                  @error="(e:any) => e.target.style.display='none'" />
                <Package v-else :size="18" color="#0B5BD3" :stroke-width="1.5" />
              </div>
              <div style="min-width:0;">
                <div style="font-size:13px;font-weight:600;color:#0B1B33;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ item.product?.name ?? '—' }}</div>
                <div style="font-size:11px;color:#7A889C;margin-top:2px;display:flex;gap:6px;">
                  <span>{{ item.product?.supplier ?? '' }}</span>
                  <span v-if="item.product?.sku" style="font-family:monospace;">{{ item.product.sku }}</span>
                </div>
              </div>
            </div>
            <div style="text-align:center;font-size:12px;font-weight:600;color:#5B6B82;">
              {{ precioDe(item) > 0 ? fmt(precioDe(item)) : '—' }}
            </div>
            <div style="display:flex;align-items:center;justify-content:center;gap:6px;">
              <button @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
                style="width:28px;height:28px;border-radius:7px;background:rgba(11,27,51,0.04);border:1px solid rgba(11,27,51,0.08);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#5B6B82;">
                <Minus :size="10" :stroke-width="2.5" />
              </button>
              <div style="width:34px;height:28px;border-radius:7px;background:rgba(21,112,239,0.08);border:1px solid rgba(21,112,239,0.18);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#0B5BD3;">
                {{ item.quantity }}
              </div>
              <button @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
                style="width:28px;height:28px;border-radius:7px;background:rgba(21,112,239,0.08);border:1px solid rgba(21,112,239,0.18);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#0B5BD3;">
                <Plus :size="10" :stroke-width="2.5" />
              </button>
            </div>
            <div style="text-align:right;font-size:14px;font-weight:700;color:#0B1B33;">
              {{ precioDe(item) > 0 ? fmt(precioDe(item) * item.quantity) : '—' }}
            </div>
            <div style="display:flex;justify-content:center;">
              <button @click="cart.removeItem(item.product.id)"
                style="width:28px;height:28px;border-radius:7px;background:transparent;border:1px solid transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(91,107,130,0.35);transition:all 0.15s;"
                @mouseenter="(e:any) => { e.currentTarget.style.background='rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor='rgba(239,68,68,0.2)'; e.currentTarget.style.color='#EF4444' }"
                @mouseleave="(e:any) => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.color='rgba(91,107,130,0.35)' }">
                <Trash2 :size="13" />
              </button>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid rgba(11,27,51,0.04);padding:10px 20px;">
          <a href="/catalog"
            style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#7A889C;font-weight:500;text-decoration:none;"
            @mouseenter="(e:any) => e.currentTarget.style.color='#0B5BD3'"
            @mouseleave="(e:any) => e.currentTarget.style.color='#7A889C'">
            <Plus :size="12" /> Agregar más productos
          </a>
        </div>
      </div>

      <!-- Fila inferior -->
      <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap;">

        <!-- Detalles de la orden -->
        <div style="flex:1;min-width:280px;border-radius:16px;background:linear-gradient(160deg,#FFFFFF,#F5F8FC);border:1px solid rgba(11,27,51,0.07);padding:20px;display:flex;flex-direction:column;gap:18px;">
          <div style="font-size:13px;font-weight:700;color:#0B1B33;">Detalles de la orden</div>
          <div>
            <div style="font-size:10px;font-weight:600;color:#7A889C;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">Prioridad</div>
            <div style="display:flex;gap:6px;">
              <button v-for="p in priorities" :key="p.key" @click="priority = p.key"
                :style="{
                  flex:1, height:'34px', borderRadius:'9px', fontSize:'12px',
                  fontWeight: priority === p.key ? 700 : 500, cursor:'pointer', fontFamily:'inherit',
                  border: `1px solid ${priority === p.key ? p.border : 'rgba(11,27,51,0.07)'}`,
                  background: priority === p.key ? p.bg : 'rgba(11,27,51,0.02)',
                  color: priority === p.key ? p.color : '#7A889C',
                  transition:'all 0.15s'
                }">{{ p.label }}</button>
            </div>
            <div :style="{ display:'flex', alignItems:'center', gap:'7px', marginTop:'8px', padding:'8px 11px', borderRadius:'9px', background: activePri.bg, border:`1px solid ${activePri.border}` }">
              <div :style="{ width:'6px', height:'6px', borderRadius:'50%', background: activePri.color, flexShrink:0 }" />
              <span :style="{ fontSize:'11px', fontWeight:600, color: activePri.color }">{{ priorityLabel }}</span>
            </div>
          </div>
          <div class="ct-info">
            <div class="ct-info-title">Información adicional</div>
            <label class="ct-info-field">
              <span>Folio interno / Orden de compra (opcional):</span>
              <input v-model="purchaseOrder" maxlength="60" class="ct-info-input" />
            </label>
            <label class="ct-info-field">
              <span class="ct-info-row">Comentarios a vendedor <em>{{ notes.length }}/300</em></span>
              <textarea v-model="notes" maxlength="300" rows="4" class="ct-info-input ct-info-area"
                placeholder="Escribe aquí cualquier comentario o instrucción especial…" />
            </label>
          </div>
        </div>

        <!-- Resumen y pago -->
        <div style="flex:0 0 300px;min-width:280px;border-radius:16px;background:linear-gradient(160deg,#FFFFFF,#F5F8FC);border:1px solid rgba(11,27,51,0.07);overflow:hidden;">
          <div style="padding:18px 20px 14px;">
            <div style="font-size:13px;font-weight:700;color:#0B1B33;margin-bottom:14px;">Resumen</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <div v-for="item in cart.items" :key="item.product.id"
                style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                <span style="font-size:12px;color:#5B6B82;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">
                  {{ (item.product?.name ?? '').slice(0, 28) }}{{ (item.product?.name ?? '').length > 28 ? '…' : '' }}
                  <span style="color:#7A889C;"> ×{{ item.quantity }}</span>
                </span>
                <span style="font-size:12px;color:#5B6B82;font-weight:500;flex-shrink:0;">
                  {{ precioDe(item) > 0 ? fmt(precioDe(item) * item.quantity) : '—' }}
                </span>
              </div>
            </div>
          </div>
          <div style="padding:14px 20px;border-top:1px solid rgba(11,27,51,0.06);display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;justify-content:space-between;font-size:12px;color:#5B6B82;">
              <span>Envío</span>
              <span style="color:#0B1B33;font-weight:600;">{{ fmt(envio) }}</span>
            </div>
            <div v-if="envio > 0 && !envioBasico" style="padding:8px 10px;border-radius:8px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);font-size:11px;color:#B45309;line-height:1.5;">
              Agrega {{ fmt(faltaEnvio) }} más y solo pagas el envío básico de {{ fmt(shippingCfg.basicShippingFee ?? ENVIO_BASICO) }} (compras desde {{ fmt(shippingCfg.freeShippingMin) }} + IVA).
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:#5B6B82;">
              <span>Subtotal (sin IVA)</span><span>{{ fmt(subtotal) }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:#5B6B82;">
              <span>IVA (16%)</span><span>{{ fmt(iva) }}</span>
            </div>
          </div>
          <div style="padding:14px 20px;border-top:1px solid rgba(21,112,239,0.12);background:rgba(21,112,239,0.04);display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:13px;font-weight:700;color:#0B1B33;">Total (IVA incluido)</span>
            <span style="font-size:18px;font-weight:800;letter-spacing:-0.5px;background:linear-gradient(135deg,#1570EF,#0B5BD3);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{{ fmt(totales.total) }}</span>
          </div>
          <div style="padding:16px 20px;display:flex;flex-direction:column;gap:10px;">
            <div v-if="accionError" class="ct-error">{{ accionError }}</div>
            <div v-if="preview.loading" class="ct-note">Calculando precios del cliente…</div>
            <button v-if="clienteId" class="ct-btn ct-btn-primary" :disabled="!!accion || preview.loading" @click="generarPedidoCliente">
              <Package :size="15" /> {{ accion === 'pedido' ? 'Generando…' : clienteSel?.mostrador ? 'Generar pedido de mostrador' : `Generar pedido para ${clienteSel?.name.split(' ')[0] ?? 'el cliente'}` }}
            </button>
            <button v-else-if="!esVendedor && !pagoEnLinea" class="ct-btn ct-btn-primary" :disabled="!!accion" @click="confirmarPedido">
              <Package :size="15" /> {{ accion === 'confirmar' ? 'Enviando…' : 'Confirmar pedido' }}
            </button>
            <div v-if="!esVendedor && !clienteId && !pagoEnLinea" class="ct-note">Te contactamos para el pago por transferencia y la entrega.</div>
            <button v-else-if="!esVendedor && !clienteId" @click="openPaymentModal"
              style="width:100%;height:44px;border-radius:11px;border:none;cursor:pointer;background:linear-gradient(135deg,#1570EF,#0B5BD3);color:white;font-weight:700;font-size:13px;font-family:inherit;box-shadow:0 4px 18px rgba(21,112,239,0.32);display:flex;align-items:center;justify-content:center;gap:8px;">
              <CreditCard :size="15" /> Elegir método de pago
            </button>
            <div class="ct-sep"><span>o guárdalo para después</span></div>
            <input v-model="nombreCotizacion" class="ct-name" maxlength="120" :placeholder="clienteSel && !clienteSel.mostrador ? `Nombre de la cotización (ej. Casa de ${clienteSel.name.split(' ')[0]})` : 'Nombre de la cotización (ej. Casa de Fulanito)'" aria-label="Nombre de la cotización" />
            <button class="ct-btn ct-btn-ghost" :disabled="!!accion || (esVendedor && !clienteId)" @click="guardarCotizacion">
              <FileText :size="15" /> {{ accion === 'cotizacion' ? 'Guardando…' : 'Guardar como cotización' }}
            </button>
            <div v-if="esVendedor && !clienteId" class="ct-note">Elige un cliente arriba para cotizar o generar el pedido.</div>
            <div v-else class="ct-note">La cotización guarda los productos con un número de folio; el precio se actualiza al del día cuando se acepta.</div>
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
        <div style="position:absolute;inset:0;background:rgba(11,27,51,0.45);backdrop-filter:blur(6px);"></div>

        <div style="position:relative;width:100%;max-width:440px;border-radius:20px;background:linear-gradient(160deg,#FFFFFF,#F5F8FC);border:1px solid rgba(11,27,51,0.1);overflow:hidden;box-shadow:0 24px 80px rgba(11,27,51,0.16);">

          <!-- ── Modal header ── -->
          <div style="padding:22px 24px 0;">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;">
              <div>
                <!-- Logo OpenPay oficial -->
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                  <div style="background:white;border-radius:6px;padding:3px 10px;display:flex;align-items:center;">
                    <img src="/openpay/openpay-logo.jpg" alt="Openpay by BBVA" style="height:18px;object-fit:contain;" />
                  </div>
                  <span style="font-size:11px;color:#7A889C;">Pago seguro</span>
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
                style="width:32px;height:32px;border-radius:8px;background:rgba(11,27,51,0.04);border:1px solid rgba(11,27,51,0.08);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#5B6B82;flex-shrink:0;">
                <X :size="15" />
              </button>
            </div>

            <!-- Total -->
            <div style="padding:11px 14px;border-radius:11px;background:rgba(21,112,239,0.07);border:1px solid rgba(21,112,239,0.18);display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
              <span style="font-size:12px;color:#5B6B82;">Total a pagar</span>
              <span style="font-size:20px;font-weight:800;background:linear-gradient(135deg,#1570EF,#0B5BD3);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{{ fmt(totales.total) }}</span>
            </div>

            <!-- Selector método -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
              <button @click="payTab = 'card'"
                :style="{
                  height:'44px', borderRadius:'10px', fontSize:'12px', fontWeight:600,
                  cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center',
                  justifyContent:'center', gap:'8px', transition:'all 0.15s', border:'none',
                  background: payTab==='card' ? 'rgba(21,112,239,0.15)' : 'rgba(11,27,51,0.03)',
                  color: payTab==='card' ? '#0B5BD3' : '#7A889C',
                  outline: payTab==='card' ? '1.5px solid rgba(21,112,239,0.45)' : '1px solid rgba(11,27,51,0.08)',
                }">
                <CreditCard :size="14" /> Tarjeta
              </button>
              <button @click="payTab = 'spei'"
                :style="{
                  height:'44px', borderRadius:'10px', fontSize:'12px', fontWeight:600,
                  cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center',
                  justifyContent:'center', gap:'8px', transition:'all 0.15s', border:'none',
                  background: payTab==='spei' ? 'rgba(34,197,94,0.12)' : 'rgba(11,27,51,0.03)',
                  color: payTab==='spei' ? '#16A34A' : '#7A889C',
                  outline: payTab==='spei' ? '1.5px solid rgba(34,197,94,0.35)' : '1px solid rgba(11,27,51,0.08)',
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
              <label style="font-size:10px;font-weight:600;color:#7A889C;text-transform:uppercase;letter-spacing:0.7px;display:block;margin-bottom:6px;">Nombre en la tarjeta</label>
              <input v-model="card.holderName" type="text" placeholder="Como aparece en la tarjeta"
                autocomplete="cc-name"
                :style="inputStyle(cardFocus.holderName)"
                @focus="cardFocus.holderName=true" @blur="cardFocus.holderName=false" />
            </div>
            <div>
              <label style="font-size:10px;font-weight:600;color:#7A889C;text-transform:uppercase;letter-spacing:0.7px;display:block;margin-bottom:6px;">Número de tarjeta</label>
              <div style="position:relative;">
                <input v-model="card.number" type="text" placeholder="0000 0000 0000 0000"
                  autocomplete="cc-number" maxlength="19"
                  @input="formatCardNumber"
                  :style="{ ...inputStyle(cardFocus.number), paddingRight:'44px' }"
                  @focus="cardFocus.number=true" @blur="cardFocus.number=false" />
                <div style="position:absolute;right:13px;top:50%;transform:translateY(-50%);pointer-events:none;">
                  <CreditCard :size="16" color="rgba(91,107,130,0.4)" />
                </div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div>
                <label style="font-size:10px;font-weight:600;color:#7A889C;text-transform:uppercase;letter-spacing:0.7px;display:block;margin-bottom:6px;">Vencimiento (MM/AA)</label>
                <input v-model="card.expiry" type="text" placeholder="MM/AA"
                  autocomplete="cc-exp" maxlength="5"
                  @input="formatExpiry"
                  :style="inputStyle(cardFocus.expiry)"
                  @focus="cardFocus.expiry=true" @blur="cardFocus.expiry=false" />
              </div>
              <div>
                <label style="font-size:10px;font-weight:600;color:#7A889C;text-transform:uppercase;letter-spacing:0.7px;display:block;margin-bottom:6px;">CVV</label>
                <input v-model="card.cvv" type="password" placeholder="•••"
                  autocomplete="cc-csc" maxlength="4"
                  :style="inputStyle(cardFocus.cvv)"
                  @focus="cardFocus.cvv=true" @blur="cardFocus.cvv=false" />
              </div>
            </div>

            <!-- Error de pago con tarjeta -->
            <div v-if="payError" style="padding:10px 13px;border-radius:9px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);font-size:12px;color:#EF4444;display:flex;align-items:flex-start;gap:8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{{ payError }}</span>
            </div>

            <button @click="handlePayCard" :disabled="paying"
              :style="{
                width:'100%', height:'46px', borderRadius:'12px', border:'none', marginTop:'4px',
                cursor: paying ? 'not-allowed' : 'pointer',
                background: paying ? 'rgba(21,112,239,0.35)' : 'linear-gradient(135deg,#1570EF,#0B5BD3)',
                color:'white', fontWeight:700, fontSize:'14px', fontFamily:'inherit',
                boxShadow: paying ? 'none' : '0 6px 20px rgba(21,112,239,0.38)',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                transition:'all 0.2s'
              }">
              <span v-if="paying" style="display:flex;align-items:center;gap:8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 0.8s linear infinite;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                Procesando pago…
              </span>
              <span v-else style="display:flex;align-items:center;gap:8px;">
                <Lock :size="14" /> Pagar {{ fmt(totales.total) }}
              </span>
            </button>

            <div style="display:flex;align-items:center;justify-content:center;gap:7px;">
              <Lock :size="11" color="rgba(91,107,130,0.35)" />
              <span style="font-size:10px;color:rgba(91,107,130,0.4);">Pago cifrado SSL · Procesado por</span>
              <div style="background:white;border-radius:4px;padding:1px 6px;display:inline-flex;align-items:center;">
                <img src="/openpay/openpay-logo.jpg" alt="Openpay" style="height:11px;object-fit:contain;" />
              </div>
            </div>
          </div>

          <!-- ── Tab: SPEI ── -->
          <div v-else style="padding:0 24px 24px;display:flex;flex-direction:column;gap:14px;">
            <div style="padding:14px 16px;border-radius:12px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.2);display:flex;flex-direction:column;gap:10px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <div style="background:white;border-radius:5px;padding:4px 8px;display:flex;align-items:center;flex-shrink:0;">
                  <img src="/openpay/spei.png" alt="SPEI" style="height:22px;object-fit:contain;" />
                </div>
                <div style="font-size:12px;font-weight:600;color:#16A34A;">Transferencia SPEI</div>
              </div>
              <div style="font-size:11px;color:#5B6B82;line-height:1.6;">
                Al confirmar, se generará una CLABE interbancaria. Realiza la transferencia desde tu banco con ese número. Tu pedido quedará pendiente hasta que el administrador confirme el pago.
              </div>
            </div>

            <div style="padding:12px 16px;border-radius:11px;background:rgba(21,112,239,0.06);border:1px solid rgba(21,112,239,0.15);display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:12px;color:#5B6B82;">Monto a transferir</span>
              <span style="font-size:18px;font-weight:800;background:linear-gradient(135deg,#1570EF,#0B5BD3);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{{ fmt(totales.total) }}</span>
            </div>

            <div v-if="payError" style="padding:10px 13px;border-radius:9px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);font-size:12px;color:#EF4444;">
              {{ payError }}
            </div>

            <button @click="handlePaySpei" :disabled="paying"
              :style="{
                width:'100%', height:'46px', borderRadius:'12px', border:'none', marginTop:'4px',
                cursor: paying ? 'not-allowed' : 'pointer',
                background: paying ? 'rgba(34,197,94,0.25)' : 'linear-gradient(135deg,#16A34A,#059669)',
                color:'white', fontWeight:700, fontSize:'14px', fontFamily:'inherit',
                boxShadow: paying ? 'none' : '0 6px 20px rgba(34,197,94,0.3)',
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
              <Lock :size="11" color="rgba(91,107,130,0.35)" />
              <span style="font-size:10px;color:rgba(91,107,130,0.4);">Procesado por</span>
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
.ct-client { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:16px; padding:16px 20px; border-radius:16px; background:#fff; border:1px solid rgba(21,112,239,0.22); box-shadow:0 6px 18px rgba(21,112,239,0.06); }
.ct-client-warn { flex-basis:100%; margin-top:0; padding:7px 10px; border-radius:8px; background:rgba(245,158,11,0.1); color:#92400E; font-size:12px; }
.ct-client-pick { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.ct-info { display:flex; flex-direction:column; gap:12px; margin:0 -20px -20px; padding:16px 20px 20px; border-top:1px solid rgba(11,27,51,0.07); background:#F7F9FC; border-radius:0 0 16px 16px; }
.ct-info-title { font-size:13px; font-weight:700; color:#0B1B33; }
.ct-info-field { display:flex; flex-direction:column; gap:6px; font-size:12px; color:#5B6B82; }
.ct-info-row { display:flex; justify-content:space-between; }
.ct-info-row em { font-style:normal; font-size:10px; color:#7A889C; }
.ct-info-input { width:100%; height:40px; padding:0 12px; border-radius:10px; border:1px solid #D5DEEA; background:#fff; font-size:13px; color:#0B1B33; font-family:inherit; outline:none; box-sizing:border-box; transition:border-color .2s; }
.ct-info-input:focus { border-color:rgba(21,112,239,0.5); }
.ct-info-area { height:auto; padding:10px 12px; resize:vertical; line-height:1.5; }
.ct-client-new { font-size:12.5px; font-weight:600; color:#0B5BD3; white-space:nowrap; }
.ct-btn { width:100%; height:44px; border-radius:11px; font-weight:700; font-size:13px; font-family:inherit; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; transition:background .2s, opacity .2s; }
.ct-btn:disabled { opacity:.55; cursor:not-allowed; }
.ct-btn-primary { border:none; background:linear-gradient(135deg,#1570EF,#0B5BD3); color:#fff; box-shadow:0 4px 18px rgba(21,112,239,0.32); }
.ct-btn-ghost { border:1px solid rgba(11,27,51,0.14); background:#fff; color:#0B1B33; }
.ct-btn-ghost:hover:not(:disabled) { background:#F5F8FC; }
.ct-note { font-size:11.5px; color:#7A889C; line-height:1.5; text-align:center; }
.ct-sep { display:flex; align-items:center; gap:8px; margin:4px 0 -2px; font-size:11px; color:#7A889C; }
.ct-sep::before, .ct-sep::after { content:''; flex:1; height:1px; background:rgba(11,27,51,0.1); }
.ct-name { width:100%; height:40px; padding:0 12px; border-radius:10px; border:1px solid rgba(11,27,51,0.14); background:#F5F8FC; font-size:12.5px; color:#0B1B33; font-family:inherit; outline:none; box-sizing:border-box; }
.ct-name:focus { border-color:#1570EF; background:#fff; }
.ct-quote { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:16px; padding:12px 16px; border-radius:14px; background:#EAF2FF; border:1px solid rgba(21,112,239,0.25); color:#0B1B33; font-size:13.5px; }
.ct-quote > div { flex:1; min-width:220px; }
.ct-quote svg { color:#0B5BD3; flex-shrink:0; }
.ct-quote-folio { font-size:11px; font-weight:700; padding:1px 6px; border-radius:5px; background:#fff; color:#0B5BD3; font-family:ui-monospace,Menlo,monospace; }
.ct-quote button { border:none; background:none; color:#5B6B82; font-size:12px; text-decoration:underline; cursor:pointer; font-family:inherit; }
.ct-error { padding:9px 11px; border-radius:9px; background:#FEF2F2; color:#B91C1C; font-size:12.5px; }
</style>

<script setup lang="ts">
import { ShoppingCart, Package, Trash2, Plus, Minus, CreditCard, X, Lock, FileText } from '@lucide/vue'
import { ENVIO_BASICO, type ShippingConfig } from '~/utils/orderTotals'

definePageMeta({ middleware: 'auth' })

const cart      = useCartStore()
const notes     = ref('')
// Folio interno / orden de compra del cliente
const purchaseOrder = ref('')
const priority  = ref('normal')

// ── States de resultado ──
const submitted  = ref(false)
const paymentAuth = ref('')
const speiResult  = ref<{
  clabe: string
  bank: string
  agreement: string
  beneficiary: string
  amount: number
  reference: string
  dueDate: string
  createdAt: string
  transactionId: string
} | null>(null)
const clabeCopied = ref(false)
const refCopied   = ref(false)

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
  { key:'low',    label:'Baja',    color:'#5B6B82', bg:'rgba(91,107,130,0.08)', border:'rgba(91,107,130,0.2)' },
  { key:'normal', label:'Normal',  color:'#0B5BD3', bg:'rgba(21,112,239,0.09)',  border:'rgba(21,112,239,0.25)' },
  { key:'high',   label:'Alta',    color:'#B45309', bg:'rgba(245,158,11,0.09)',  border:'rgba(245,158,11,0.25)' },
  { key:'urgent', label:'Urgente', color:'#EF4444', bg:'rgba(239,68,68,0.09)',   border:'rgba(239,68,68,0.25)'  },
]

const activePri     = computed(() => priorities.find(p => p.key === priority.value)!)
const priorityLabel = computed(() => ({ urgent:'Urgente — notificación inmediata', high:'Alta — procesamiento en 4h', normal:'Normal — procesamiento en 24h', low:'Baja — sin urgencia' }[priority.value] ?? ''))
// Envío: si la compra no llega al mínimo se cobra nuestro cargo (el servidor lo vuelve a calcular)
const { data: shippingCfg } = useFetch<ShippingConfig>('/api/config/shipping', { default: () => ({ freeShippingMin: 1000, shippingFee: 200, basicShippingFee: ENVIO_BASICO }) })
// ── Cliente (vendedor / admin) ──
const auth       = useAuthStore()
const esVendedor = computed(() => auth.user?.role === 'seller')
const vende      = computed(() => esVendedor.value || auth.user?.role === 'admin')
const { clientes, opciones: opcionesClientes, cargar: cargarClientes, mostrador } = useClientes()
// Se conserva el cliente elegido mientras navega entre catálogo y carrito
const clienteId  = useClienteCarrito()
const clienteSel = computed(() => clientes.value.find(c => c.id === clienteId.value) ?? null)
onMounted(async () => {
  if (!vende.value) return
  await cargarClientes()
  // Sin cliente elegido, se arma para "Mostrador · Público en general" y después se asigna
  if (!clienteId.value && mostrador.value) clienteId.value = mostrador.value.id
})

// Precios del cliente elegido (su descuento); sin cliente se usan los del catálogo
const preview = reactive({ loading: false, precios: {} as Record<string, number> })
let previewId = 0
async function cargarPreview() {
  const id = ++previewId
  if (!clienteId.value || !cart.items.length) { preview.precios = {}; return }
  preview.loading = true
  try {
    const r = await $fetch<{ items: Array<{ productId: string; price: number }> }>('/api/pricing/preview', {
      method: 'POST', body: { clientId: clienteId.value, items: cartItems() },
    })
    if (id === previewId) preview.precios = Object.fromEntries(r.items.map(i => [i.productId, i.price]))
  } catch { if (id === previewId) preview.precios = {} } finally { if (id === previewId) preview.loading = false }
}
onMounted(() => watch([clienteId, () => cart.items.map(i => `${i.product.id}:${i.quantity}`).join()], cargarPreview, { immediate: true }))

function precioDe(item: { product: { id: string; price: number } }) {
  return clienteId.value && preview.precios[item.product.id] != null ? preview.precios[item.product.id] : (item.product?.price ?? 0)
}
const totalCarrito  = computed(() => cart.items.reduce((s, i) => s + precioDe(i) * i.quantity, 0))
const envio         = computed(() => envioDe(totalCarrito.value, shippingCfg.value))
const envioBasico   = computed(() => esEnvioBasico(totalCarrito.value, shippingCfg.value))
const faltaEnvio    = computed(() => Math.max(0, minimoEnvioConIva(shippingCfg.value) - totalCarrito.value))
// Los precios ya incluyen IVA: el total es la suma + envío y el IVA solo se desglosa
const totales       = computed(() => desgloseTotales(totalCarrito.value + envio.value))

// ── Cotización y pedido a nombre del cliente ──
const accion      = ref<'' | 'cotizacion' | 'pedido' | 'confirmar'>('')
const nombreCotizacion = ref('')
const pedidoConfirmado = ref(false)
// Sin llaves de OpenPay no hay cobro en línea: el cliente confirma y se coordina el pago por transferencia
const pagoEnLinea = computed(() => !!(config.public.openpayMerchantId && config.public.openpayPublicKey))

async function confirmarPedido() {
  if (!confirm(`¿Confirmar tu pedido por ${fmt(totales.value.total)}? Te contactaremos para el pago.`)) return
  accion.value = 'confirmar'; accionError.value = ''
  try {
    await $fetch('/api/orders', {
      method: 'POST', body: { items: cartItems(), priority: priority.value, notes: notes.value || undefined, purchaseOrder: purchaseOrder.value || undefined, quoteId: cart.quote?.id },
    })
    await cart.clearCart()
    notes.value = ''
    purchaseOrder.value = ''
    pedidoConfirmado.value = true
  } catch (e: any) {
    accionError.value = e?.data?.message ?? 'No se pudo enviar tu pedido'
  } finally { accion.value = '' }
}
const accionError = ref('')
async function guardarCotizacion() {
  accion.value = 'cotizacion'; accionError.value = ''
  try {
    const r = await $fetch<{ quote: { id: string } }>('/api/quotes', {
      method: 'POST', body: { items: cartItems(), clientId: clienteId.value || undefined, notes: notes.value || undefined, purchaseOrder: purchaseOrder.value || undefined, name: nombreCotizacion.value || undefined },
    })
    await cart.clearCart()
    notes.value = ''
    purchaseOrder.value = ''
    nombreCotizacion.value = ''
    clienteId.value = ''
    await navigateTo(`/quotes/${r.quote.id}`)
  } catch (e: any) {
    accionError.value = e?.data?.message ?? 'No se pudo guardar la cotización'
  } finally { accion.value = '' }
}
async function generarPedidoCliente() {
  if (!clienteSel.value) return
  if (!confirm(`¿Generar el pedido a nombre de ${clienteSel.value.name}? Quedará pendiente de aprobación.`)) return
  accion.value = 'pedido'; accionError.value = ''
  try {
    await $fetch('/api/orders', {
      method: 'POST', body: { items: cartItems(), clientId: clienteId.value, priority: priority.value, notes: notes.value || undefined, purchaseOrder: purchaseOrder.value || undefined },
    })
    await cart.clearCart()
    notes.value = ''
    purchaseOrder.value = ''
    clienteId.value = ''
    await navigateTo('/orders')
  } catch (e: any) {
    accionError.value = e?.data?.message ?? 'No se pudo generar el pedido'
  } finally { accion.value = '' }
}
const subtotal      = computed(() => totales.value.subtotal)
const iva           = computed(() => totales.value.iva)
const totalUnits    = computed(() => cart.items.reduce((s, i) => s + i.quantity, 0))

const speiPdfUrl = computed(() => {
  if (!speiResult.value?.transactionId) return ''
  const isSandbox = config.public.openpayIsSandbox === true || config.public.openpayIsSandbox === 'true'
  const dash = isSandbox ? 'https://sandbox-dashboard.openpay.mx' : 'https://dashboard.openpay.mx'
  return `${dash}/spei-pdf/${config.public.openpayMerchantId}/${speiResult.value.transactionId}`
})

const speiDueDate = computed(() => {
  const raw = speiResult.value?.dueDate
  const d = raw ? new Date(raw) : (() => { const n = new Date(); n.setDate(n.getDate() + 30); return n })()
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
})

const speiCreatedDate = computed(() => {
  const raw = speiResult.value?.createdAt
  if (!raw) return new Date().toLocaleString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  return new Date(raw).toLocaleString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
})

const fmt = (n: number) => new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' }).format(n)

function inputStyle(focused: boolean) {
  return {
    width:'100%', height:'42px', padding:'0 13px', fontSize:'13px',
    color:'#0B1B33', outline:'none', fontFamily:'inherit', boxSizing:'border-box',
    borderRadius:'10px', transition:'all 0.2s',
    background: focused ? 'rgba(21,112,239,0.05)' : 'rgba(11,27,51,0.03)',
    border: `1px solid ${focused ? 'rgba(21,112,239,0.45)' : 'rgba(11,27,51,0.08)'}`,
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
  w.OpenPay.setSandboxMode(config.public.openpayIsSandbox === true || config.public.openpayIsSandbox === 'true')
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
              purchaseOrder:   purchaseOrder.value || undefined,
              quoteId:         cart.quote?.id,
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
        purchaseOrder: purchaseOrder.value || undefined,
        quoteId:  cart.quote?.id,
      },
    })
    cart.clearCart()
    showPayModal.value = false
    speiResult.value   = {
      clabe:         result.order?.spei?.clabe       ?? '',
      bank:          result.order?.spei?.bank         ?? 'BBVA Bancomer',
      agreement:     result.order?.spei?.agreement    ?? '',
      beneficiary:   result.order?.spei?.beneficiary  ?? 'SIEEG INTEGRADORES',
      amount:        result.order?.total              ?? totales.value.total,
      reference:     result.order?.spei?.reference    ?? '',
      dueDate:       result.order?.spei?.dueDate      ?? '',
      createdAt:     result.order?.spei?.createdAt    ?? '',
      transactionId: result.order?.paymentId          ?? '',
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

async function copyRef() {
  const val = speiResult.value?.reference || speiResult.value?.clabe
  if (!val) return
  try {
    await navigator.clipboard.writeText(val)
    refCopied.value = true
    setTimeout(() => { refCopied.value = false }, 2000)
  } catch {}
}
</script>
