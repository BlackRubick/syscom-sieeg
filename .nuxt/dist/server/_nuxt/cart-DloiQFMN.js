import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrRenderTeleport, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _imports_0 } from "./_virtual_public-1NHFEfRi.js";
import { publicAssetsURL } from "#internal/nuxt/paths";
import { ShoppingCart, Trash2, Package, Minus, Plus, CreditCard, X, Lock } from "@lucide/vue";
import { u as useRuntimeConfig } from "../server.mjs";
import { u as useCartStore } from "./cart-DSVjrl-J.js";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/ofetch/dist/node.mjs";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/hookable/dist/index.mjs";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/unctx/dist/index.mjs";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/h3/dist/index.mjs";
import "pinia";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/ufo/dist/index.mjs";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/klona/dist/index.mjs";
const _imports_1 = publicAssetsURL("/openpay/openpay-logo.jpg");
const _imports_2 = publicAssetsURL("/openpay/visa.png");
const _imports_3 = publicAssetsURL("/openpay/mastercard.png");
const _imports_4 = publicAssetsURL("/openpay/amex.png");
const _imports_5 = publicAssetsURL("/openpay/carnet.png");
const _imports_6 = publicAssetsURL("/openpay/spei.png");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cart",
  __ssrInlineRender: true,
  setup(__props) {
    const cart = useCartStore();
    const notes = ref("");
    const priority = ref("normal");
    const notesFocus = ref(false);
    const submitted = ref(false);
    const paymentAuth = ref("");
    const speiResult = ref(null);
    const clabeCopied = ref(false);
    const refCopied = ref(false);
    const showPayModal = ref(false);
    const payTab = ref("card");
    const paying = ref(false);
    const payError = ref("");
    const card = reactive({ holderName: "", number: "", expiry: "", cvv: "" });
    const cardFocus = reactive({ holderName: false, number: false, expiry: false, cvv: false });
    const config = useRuntimeConfig();
    const priorities = [
      { key: "low", label: "Baja", color: "#94a3b8", bg: "rgba(123,146,176,0.08)", border: "rgba(123,146,176,0.2)" },
      { key: "normal", label: "Normal", color: "#7DD3FC", bg: "rgba(14,165,233,0.09)", border: "rgba(14,165,233,0.25)" },
      { key: "high", label: "Alta", color: "#fbbf24", bg: "rgba(245,158,11,0.09)", border: "rgba(245,158,11,0.25)" },
      { key: "urgent", label: "Urgente", color: "#EF4444", bg: "rgba(239,68,68,0.09)", border: "rgba(239,68,68,0.25)" }
    ];
    const activePri = computed(() => priorities.find((p) => p.key === priority.value));
    const priorityLabel = computed(() => ({ urgent: "Urgente — notificación inmediata", high: "Alta — procesamiento en 4h", normal: "Normal — procesamiento en 24h", low: "Baja — sin urgencia" })[priority.value] ?? "");
    const subtotal = computed(() => cart.total);
    const iva = computed(() => subtotal.value * 0.16);
    const totalUnits = computed(() => cart.items.reduce((s, i) => s + i.quantity, 0));
    const speiPdfUrl = computed(() => {
      if (!speiResult.value?.transactionId) return "";
      const isSandbox = config.public.openpayIsSandbox === true || config.public.openpayIsSandbox === "true";
      const dash = isSandbox ? "https://sandbox-dashboard.openpay.mx" : "https://dashboard.openpay.mx";
      return `${dash}/spei-pdf/${config.public.openpayMerchantId}/${speiResult.value.transactionId}`;
    });
    const speiDueDate = computed(() => {
      const raw = speiResult.value?.dueDate;
      const d = raw ? new Date(raw) : (() => {
        const n = /* @__PURE__ */ new Date();
        n.setDate(n.getDate() + 30);
        return n;
      })();
      return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
    });
    const speiCreatedDate = computed(() => {
      const raw = speiResult.value?.createdAt;
      if (!raw) return (/* @__PURE__ */ new Date()).toLocaleString("es-MX", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
      return new Date(raw).toLocaleString("es-MX", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    });
    const fmt = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
    function inputStyle(focused) {
      return {
        width: "100%",
        height: "42px",
        padding: "0 13px",
        fontSize: "13px",
        color: "#E2EAF4",
        outline: "none",
        fontFamily: "inherit",
        boxSizing: "border-box",
        borderRadius: "10px",
        transition: "all 0.2s",
        background: focused ? "rgba(14,165,233,0.05)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${focused ? "rgba(14,165,233,0.45)" : "rgba(255,255,255,0.08)"}`
      };
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ style: { "font-family": "'Inter',system-ui,sans-serif", "max-width": "900px", "margin": "0 auto" } }, _attrs))}>`);
      if (unref(submitted)) {
        _push(`<div style="${ssrRenderStyle({ "min-height": "60vh", "display": "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", "text-align": "center" })}"><div style="${ssrRenderStyle({ "width": "80px", "height": "80px", "border-radius": "50%", "background": "linear-gradient(135deg,#22C55E,#34D399)", "display": "flex", "align-items": "center", "justify-content": "center", "margin-bottom": "20px", "box-shadow": "0 0 40px rgba(34,197,94,0.3)" })}"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></div><div style="${ssrRenderStyle({ "font-size": "22px", "font-weight": "800", "color": "#E2EAF4", "margin-bottom": "8px" })}">¡Transacción exitosa!</div><div style="${ssrRenderStyle({ "font-size": "14px", "color": "#22C55E", "font-weight": "600", "margin-bottom": "6px" })}">Recibimos tu pago. ¡Gracias por tu compra!</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,118,142,0.75)", "max-width": "300px", "line-height": "1.6", "margin-bottom": "6px" })}">El administrador procesará tu pedido a la brevedad.</div>`);
        if (unref(paymentAuth)) {
          _push(`<div style="${ssrRenderStyle({ "font-size": "11px", "font-family": "monospace", "color": "rgba(100,118,142,0.45)", "margin-bottom": "22px" })}">Autorización: ${ssrInterpolate(unref(paymentAuth))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<a href="/orders" style="${ssrRenderStyle({ "height": "42px", "padding": "0 24px", "border-radius": "11px", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-size": "13px", "font-weight": "600", "text-decoration": "none", "display": "inline-flex", "align-items": "center", "box-shadow": "0 4px 16px rgba(14,165,233,0.3)" })}"> Ver mis órdenes </a></div>`);
      } else if (unref(speiResult)) {
        _push(`<div style="${ssrRenderStyle({ "min-height": "60vh", "display": "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", "padding": "24px 16px" })}"><div style="${ssrRenderStyle({ "width": "100%", "max-width": "680px", "border-radius": "20px", "background": "linear-gradient(160deg,#0C1A2E,#06101E)", "border": "1px solid rgba(14,165,233,0.2)", "overflow": "hidden", "box-shadow": "0 24px 80px rgba(0,0,0,0.6)" })}"><div style="${ssrRenderStyle({ "padding": "22px 28px 18px", "border-bottom": "1px solid rgba(255,255,255,0.06)", "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "flex-wrap": "wrap", "gap": "16px" })}"><div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px", "margin-bottom": "8px" })}"><img${ssrRenderAttr("src", _imports_0)} alt="SIEEG" style="${ssrRenderStyle({ "height": "26px", "width": "26px", "object-fit": "contain", "border-radius": "5px" })}"><span style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "800", "color": "#E2EAF4", "letter-spacing": "-0.3px" })}">SIEEG INTEGRADORES</span></div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.65)", "margin-bottom": "12px" })}">Transferencia interbancaria (SPEI)</div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "5px" })}"><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.6)" })}"><span style="${ssrRenderStyle({ "font-weight": "600", "color": "#94a3b8" })}">Fecha límite de pago:</span><span style="${ssrRenderStyle({ "margin-left": "6px" })}">${ssrInterpolate(unref(speiDueDate))}</span></div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.6)" })}"><span style="${ssrRenderStyle({ "font-weight": "600", "color": "#94a3b8" })}">Beneficiario:</span><span style="${ssrRenderStyle({ "margin-left": "6px" })}">${ssrInterpolate(unref(speiResult).beneficiary || "SIEEG INTEGRADORES")}</span></div></div></div><div style="${ssrRenderStyle({ "padding": "16px 22px", "border-radius": "14px", "background": "rgba(14,165,233,0.1)", "border": "1px solid rgba(14,165,233,0.25)", "text-align": "center", "min-width": "180px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,118,142,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "6px" })}">Total a pagar / MXN</div><div style="${ssrRenderStyle({ "font-size": "26px", "font-weight": "800", "background": "linear-gradient(135deg,#0EA5E9,#7DD3FC)", "-webkit-background-clip": "text", "-webkit-text-fill-color": "transparent", "letter-spacing": "-1px" })}">${ssrInterpolate(fmt(unref(speiResult).amount))}</div></div></div><div style="${ssrRenderStyle({ "padding": "16px 28px", "border-bottom": "1px solid rgba(255,255,255,0.06)" })}"><div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "700", "color": "#7DD3FC", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "10px" })}">Detalles de la compra</div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "6px" })}"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "gap": "16px", "padding": "8px 0", "border-bottom": "1px solid rgba(255,255,255,0.04)" })}"><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,118,142,0.6)" })}">Descripción</span><span style="${ssrRenderStyle({ "font-size": "12px", "color": "#7B92B0", "font-weight": "500" })}">Pedido SIEEG Integradores</span></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "gap": "16px", "padding": "8px 0" })}"><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,118,142,0.6)" })}">Fecha y hora</span><span style="${ssrRenderStyle({ "font-size": "12px", "color": "#7B92B0" })}">${ssrInterpolate(unref(speiCreatedDate))}</span></div></div></div><div style="${ssrRenderStyle({ "padding": "16px 28px 20px", "border-bottom": "1px solid rgba(255,255,255,0.06)" })}"><div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "700", "color": "#7DD3FC", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "14px" })}">Pasos para realizar el pago</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "14px" })}"><div style="${ssrRenderStyle({ "padding": "14px 16px", "border-radius": "12px", "background": "rgba(255,255,255,0.02)", "border": "1px solid rgba(255,255,255,0.08)" })}"><div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "700", "color": "#E2EAF4", "margin-bottom": "10px", "display": "flex", "align-items": "center", "gap": "6px" })}"><div style="${ssrRenderStyle({ "width": "6px", "height": "6px", "border-radius": "50%", "background": "#0EA5E9", "flex-shrink": "0" })}"></div> Desde BBVA Bancomer </div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(123,146,176,0.75)", "line-height": "1.65", "margin-bottom": "10px" })}"> 1. Dentro del menú <strong style="${ssrRenderStyle({ "color": "#E2EAF4" })}">&quot;Pagar&quot;</strong> seleccione <strong style="${ssrRenderStyle({ "color": "#E2EAF4" })}">&quot;De servicios&quot;</strong> e ingrese el <strong style="${ssrRenderStyle({ "color": "#E2EAF4" })}">&quot;Número de convenio CIE&quot;</strong>. </div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(123,146,176,0.75)", "line-height": "1.65", "margin-bottom": "10px" })}"> 2. Ingrese los datos de registro para concluir con la operación: </div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "6px" })}"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.6)" })}">Núm. convenio CIE:</span><span style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "700", "font-family": "monospace", "color": "#7DD3FC" })}">${ssrInterpolate(unref(speiResult).agreement)}</span></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.6)" })}">Referencia:</span><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "4px" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "font-family": "monospace", "color": "#E2EAF4" })}">${ssrInterpolate(unref(speiResult).reference || unref(speiResult).clabe)}</span><button style="${ssrRenderStyle({ "height": "18px", "padding": "0 5px", "border-radius": "4px", "background": "rgba(14,165,233,0.1)", "border": "1px solid rgba(14,165,233,0.2)", "color": "#7DD3FC", "font-size": "9px", "cursor": "pointer", "font-family": "inherit", "flex-shrink": "0" })}">${ssrInterpolate(unref(refCopied) ? "✓" : "Copiar")}</button></div></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.6)" })}">Importe:</span><span style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "700", "color": "#E2EAF4" })}">${ssrInterpolate(fmt(unref(speiResult).amount))} MXN</span></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.6)" })}">Concepto:</span><span style="${ssrRenderStyle({ "font-size": "10px", "color": "#94a3b8" })}">Pedido SIEEG</span></div></div></div><div style="${ssrRenderStyle({ "padding": "14px 16px", "border-radius": "12px", "background": "rgba(255,255,255,0.02)", "border": "1px solid rgba(255,255,255,0.08)" })}"><div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "700", "color": "#E2EAF4", "margin-bottom": "10px", "display": "flex", "align-items": "center", "gap": "6px" })}"><div style="${ssrRenderStyle({ "width": "6px", "height": "6px", "border-radius": "50%", "background": "#22C55E", "flex-shrink": "0" })}"></div> Desde cualquier otro banco </div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(123,146,176,0.75)", "line-height": "1.65", "margin-bottom": "10px" })}"> Registra la cuenta beneficiaria del pago con los siguientes datos y realiza la transferencia: </div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "6px" })}"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.6)" })}">Beneficiario:</span><span style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "#E2EAF4" })}">${ssrInterpolate(unref(speiResult).beneficiary || "SIEEG")}</span></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.6)" })}">Banco destino:</span><span style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "#E2EAF4" })}">${ssrInterpolate(unref(speiResult).bank)}</span></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.6)" })}">CLABE:</span><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "4px" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "font-family": "monospace", "color": "#7DD3FC" })}">${ssrInterpolate(unref(speiResult).clabe)}</span><button style="${ssrRenderStyle({ "height": "18px", "padding": "0 5px", "border-radius": "4px", "background": "rgba(14,165,233,0.1)", "border": "1px solid rgba(14,165,233,0.2)", "color": "#7DD3FC", "font-size": "9px", "cursor": "pointer", "font-family": "inherit", "flex-shrink": "0" })}">${ssrInterpolate(unref(clabeCopied) ? "✓" : "Copiar")}</button></div></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.6)" })}">Concepto de pago:</span><span style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "font-family": "monospace", "color": "#E2EAF4" })}">${ssrInterpolate(unref(speiResult).reference || unref(speiResult).clabe)}</span></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.6)" })}">Referencia:</span><span style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "font-family": "monospace", "color": "#7DD3FC" })}">${ssrInterpolate(unref(speiResult).agreement)}</span></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.6)" })}">Importe:</span><span style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "700", "color": "#E2EAF4" })}">${ssrInterpolate(fmt(unref(speiResult).amount))} MXN</span></div></div></div></div><div style="${ssrRenderStyle({ "margin-top": "14px", "padding": "10px 13px", "border-radius": "9px", "background": "rgba(245,158,11,0.07)", "border": "1px solid rgba(245,158,11,0.2)", "font-size": "11px", "color": "rgba(251,191,36,0.85)", "line-height": "1.55" })}"> Tu pedido quedará en espera hasta que el administrador confirme la recepción del pago. Guarda el comprobante de transferencia. El recibo estará disponible mientras la transacción esté pendiente. </div></div><div style="${ssrRenderStyle({ "padding": "18px 28px", "display": "flex", "gap": "10px", "flex-wrap": "wrap" })}">`);
        if (unref(speiPdfUrl)) {
          _push(`<a${ssrRenderAttr("href", unref(speiPdfUrl))} target="_blank" rel="noopener" style="${ssrRenderStyle({ "flex": "1", "min-width": "160px", "height": "42px", "border-radius": "10px", "background": "rgba(14,165,233,0.1)", "border": "1px solid rgba(14,165,233,0.3)", "color": "#7DD3FC", "font-size": "12px", "font-weight": "600", "text-decoration": "none", "display": "flex", "align-items": "center", "justify-content": "center", "gap": "7px" })}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Descargar recibo PDF </a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<a href="/orders" style="${ssrRenderStyle({ "flex": "1", "min-width": "160px", "height": "42px", "border-radius": "10px", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-size": "12px", "font-weight": "700", "text-decoration": "none", "display": "flex", "align-items": "center", "justify-content": "center", "gap": "7px", "box-shadow": "0 4px 14px rgba(14,165,233,0.28)" })}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg> Ver mis órdenes </a></div><div style="${ssrRenderStyle({ "padding": "0 28px 18px", "display": "flex", "align-items": "center", "justify-content": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.5)" })}">Procesado por</span><div style="${ssrRenderStyle({ "background": "white", "border-radius": "4px", "padding": "2px 8px", "display": "inline-flex", "align-items": "center" })}"><img${ssrRenderAttr("src", _imports_1)} alt="Openpay" style="${ssrRenderStyle({ "height": "12px", "object-fit": "contain" })}"></div></div></div></div>`);
      } else if (!unref(cart).items.length) {
        _push(`<div style="${ssrRenderStyle({ "min-height": "60vh", "display": "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", "text-align": "center" })}"><div style="${ssrRenderStyle({ "width": "72px", "height": "72px", "border-radius": "20px", "background": "linear-gradient(160deg,#0C1A2E,#06101E)", "border": "1px solid rgba(255,255,255,0.08)", "display": "flex", "align-items": "center", "justify-content": "center", "margin-bottom": "20px" })}">`);
        _push(ssrRenderComponent(unref(ShoppingCart), {
          size: 28,
          color: "rgba(100,118,142,0.45)",
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</div><div style="${ssrRenderStyle({ "font-size": "18px", "font-weight": "700", "color": "#E2EAF4", "margin-bottom": "6px" })}">Tu carrito está vacío</div><div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,118,142,0.65)", "margin-bottom": "24px" })}">Agrega productos desde el catálogo para continuar</div><a href="/catalog" style="${ssrRenderStyle({ "height": "40px", "padding": "0 20px", "border-radius": "10px", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-size": "13px", "font-weight": "600", "text-decoration": "none", "display": "inline-flex", "align-items": "center", "gap": "6px", "box-shadow": "0 4px 14px rgba(14,165,233,0.28)" })}"> Ir al catálogo </a></div>`);
      } else {
        _push(`<!--[--><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "20px" })}"><div><h1 style="${ssrRenderStyle({ "font-size": "20px", "font-weight": "800", "color": "#E2EAF4", "margin": "0" })}">Carrito de compras</h1><p style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,118,142,0.65)", "margin": "4px 0 0" })}">${ssrInterpolate(unref(cart).items.length)} producto${ssrInterpolate(unref(cart).items.length !== 1 ? "s" : "")} · ${ssrInterpolate(unref(totalUnits))} unidades</p></div><button style="${ssrRenderStyle({ "height": "34px", "padding": "0 14px", "border-radius": "9px", "background": "rgba(239,68,68,0.07)", "border": "1px solid rgba(239,68,68,0.18)", "color": "#EF4444", "font-size": "12px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit", "display": "flex", "align-items": "center", "gap": "6px" })}">`);
        _push(ssrRenderComponent(unref(Trash2), { size: 12 }, null, _parent));
        _push(` Vaciar todo </button></div><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0C1A2E,#06101E)", "border": "1px solid rgba(255,255,255,0.07)", "margin-bottom": "16px", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 100px 120px 110px 40px", "gap": "12px", "padding": "10px 20px", "border-bottom": "1px solid rgba(255,255,255,0.06)" })}"><span style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,118,142,0.8)", "text-transform": "uppercase", "letter-spacing": "0.8px" })}">Producto</span><span style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,118,142,0.8)", "text-transform": "uppercase", "letter-spacing": "0.8px", "text-align": "center" })}">Precio u.</span><span style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,118,142,0.8)", "text-transform": "uppercase", "letter-spacing": "0.8px", "text-align": "center" })}">Cantidad</span><span style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,118,142,0.8)", "text-transform": "uppercase", "letter-spacing": "0.8px", "text-align": "right" })}">Subtotal</span><span></span></div><!--[-->`);
        ssrRenderList(unref(cart).items, (item, idx) => {
          _push(`<div style="${ssrRenderStyle({ borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" })}"><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 100px 120px 110px 40px", "gap": "12px", "padding": "14px 20px", "align-items": "center" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "12px", "min-width": "0" })}"><div style="${ssrRenderStyle({ "width": "46px", "height": "46px", "flex-shrink": "0", "border-radius": "10px", "background": "rgba(14,165,233,0.07)", "border": "1px solid rgba(14,165,233,0.12)", "display": "flex", "align-items": "center", "justify-content": "center", "overflow": "hidden" })}">`);
          if (item.product?.images?.[0]) {
            _push(`<img${ssrRenderAttr("src", item.product.images[0])}${ssrRenderAttr("alt", item.product.name)} style="${ssrRenderStyle({ "width": "40px", "height": "40px", "object-fit": "contain" })}">`);
          } else {
            _push(ssrRenderComponent(unref(Package), {
              size: 18,
              color: "#7DD3FC",
              "stroke-width": 1.5
            }, null, _parent));
          }
          _push(`</div><div style="${ssrRenderStyle({ "min-width": "0" })}"><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "600", "color": "#E2EAF4", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" })}">${ssrInterpolate(item.product?.name ?? "—")}</div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.65)", "margin-top": "2px", "display": "flex", "gap": "6px" })}"><span>${ssrInterpolate(item.product?.supplier ?? "")}</span>`);
          if (item.product?.sku) {
            _push(`<span style="${ssrRenderStyle({ "font-family": "monospace" })}">${ssrInterpolate(item.product.sku)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div><div style="${ssrRenderStyle({ "text-align": "center", "font-size": "12px", "font-weight": "600", "color": "#94a3b8" })}">${ssrInterpolate(item.product?.price > 0 ? fmt(item.product.price) : "—")}</div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "center", "gap": "6px" })}"><button style="${ssrRenderStyle({ "width": "28px", "height": "28px", "border-radius": "7px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.08)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "#94a3b8" })}">`);
          _push(ssrRenderComponent(unref(Minus), {
            size: 10,
            "stroke-width": 2.5
          }, null, _parent));
          _push(`</button><div style="${ssrRenderStyle({ "width": "34px", "height": "28px", "border-radius": "7px", "background": "rgba(14,165,233,0.08)", "border": "1px solid rgba(14,165,233,0.18)", "display": "flex", "align-items": "center", "justify-content": "center", "font-size": "13px", "font-weight": "700", "color": "#7DD3FC" })}">${ssrInterpolate(item.quantity)}</div><button style="${ssrRenderStyle({ "width": "28px", "height": "28px", "border-radius": "7px", "background": "rgba(14,165,233,0.08)", "border": "1px solid rgba(14,165,233,0.18)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "#7DD3FC" })}">`);
          _push(ssrRenderComponent(unref(Plus), {
            size: 10,
            "stroke-width": 2.5
          }, null, _parent));
          _push(`</button></div><div style="${ssrRenderStyle({ "text-align": "right", "font-size": "14px", "font-weight": "700", "color": "#E2EAF4" })}">${ssrInterpolate(item.product?.price > 0 ? fmt(item.product.price * item.quantity) : "—")}</div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "center" })}"><button style="${ssrRenderStyle({ "width": "28px", "height": "28px", "border-radius": "7px", "background": "transparent", "border": "1px solid transparent", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "rgba(100,118,142,0.35)", "transition": "all 0.15s" })}">`);
          _push(ssrRenderComponent(unref(Trash2), { size: 13 }, null, _parent));
          _push(`</button></div></div></div>`);
        });
        _push(`<!--]--><div style="${ssrRenderStyle({ "border-top": "1px solid rgba(255,255,255,0.04)", "padding": "10px 20px" })}"><a href="/catalog" style="${ssrRenderStyle({ "display": "inline-flex", "align-items": "center", "gap": "6px", "font-size": "12px", "color": "rgba(100,118,142,0.55)", "font-weight": "500", "text-decoration": "none" })}">`);
        _push(ssrRenderComponent(unref(Plus), { size: 12 }, null, _parent));
        _push(` Agregar más productos </a></div></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "16px", "align-items": "flex-start", "flex-wrap": "wrap" })}"><div style="${ssrRenderStyle({ "flex": "1", "min-width": "280px", "border-radius": "16px", "background": "linear-gradient(160deg,#0C1A2E,#06101E)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "20px", "display": "flex", "flex-direction": "column", "gap": "18px" })}"><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#E2EAF4" })}">Detalles de la orden</div><div><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,118,142,0.6)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "10px" })}">Prioridad</div><div style="${ssrRenderStyle({ "display": "flex", "gap": "6px" })}"><!--[-->`);
        ssrRenderList(priorities, (p) => {
          _push(`<button style="${ssrRenderStyle({
            flex: 1,
            height: "34px",
            borderRadius: "9px",
            fontSize: "12px",
            fontWeight: unref(priority) === p.key ? 700 : 500,
            cursor: "pointer",
            fontFamily: "inherit",
            border: `1px solid ${unref(priority) === p.key ? p.border : "rgba(255,255,255,0.07)"}`,
            background: unref(priority) === p.key ? p.bg : "rgba(255,255,255,0.02)",
            color: unref(priority) === p.key ? p.color : "rgba(100,118,142,0.6)",
            transition: "all 0.15s"
          })}">${ssrInterpolate(p.label)}</button>`);
        });
        _push(`<!--]--></div><div style="${ssrRenderStyle({ display: "flex", alignItems: "center", gap: "7px", marginTop: "8px", padding: "8px 11px", borderRadius: "9px", background: unref(activePri).bg, border: `1px solid ${unref(activePri).border}` })}"><div style="${ssrRenderStyle({ width: "6px", height: "6px", borderRadius: "50%", background: unref(activePri).color, flexShrink: 0 })}"></div><span style="${ssrRenderStyle({ fontSize: "11px", fontWeight: 600, color: unref(activePri).color })}">${ssrInterpolate(unref(priorityLabel))}</span></div></div><div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "8px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,118,142,0.6)", "text-transform": "uppercase", "letter-spacing": "0.8px" })}">Notas</div><span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.65)" })}">${ssrInterpolate(unref(notes).length)}/300</span></div><textarea placeholder="Justificación, área solicitante, instrucciones especiales..." rows="3" style="${ssrRenderStyle({
          width: "100%",
          padding: "10px 12px",
          fontSize: "12px",
          color: "#7B92B0",
          outline: "none",
          resize: "none",
          fontFamily: "inherit",
          lineHeight: "1.5",
          boxSizing: "border-box",
          borderRadius: "10px",
          transition: "all 0.2s",
          background: unref(notesFocus) ? "rgba(14,165,233,0.05)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${unref(notesFocus) ? "rgba(14,165,233,0.35)" : "rgba(255,255,255,0.07)"}`
        })}">${ssrInterpolate(unref(notes))}</textarea></div></div><div style="${ssrRenderStyle({ "flex": "0 0 300px", "min-width": "280px", "border-radius": "16px", "background": "linear-gradient(160deg,#0C1A2E,#06101E)", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "padding": "18px 20px 14px" })}"><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#E2EAF4", "margin-bottom": "14px" })}">Resumen</div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "8px" })}"><!--[-->`);
        ssrRenderList(unref(cart).items, (item) => {
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,118,142,0.75)", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap", "flex": "1" })}">${ssrInterpolate((item.product?.name ?? "").slice(0, 28))}${ssrInterpolate((item.product?.name ?? "").length > 28 ? "…" : "")} <span style="${ssrRenderStyle({ "color": "rgba(100,118,142,0.7)" })}"> ×${ssrInterpolate(item.quantity)}</span></span><span style="${ssrRenderStyle({ "font-size": "12px", "color": "#94a3b8", "font-weight": "500", "flex-shrink": "0" })}">${ssrInterpolate(item.product?.price > 0 ? fmt(item.product.price * item.quantity) : "—")}</span></div>`);
        });
        _push(`<!--]--></div></div><div style="${ssrRenderStyle({ "padding": "14px 20px", "border-top": "1px solid rgba(255,255,255,0.06)", "display": "flex", "flex-direction": "column", "gap": "8px" })}"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "font-size": "12px", "color": "rgba(100,118,142,0.8)" })}"><span>Subtotal</span><span>${ssrInterpolate(fmt(unref(subtotal)))}</span></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "font-size": "12px", "color": "rgba(100,118,142,0.8)" })}"><span>IVA (16%)</span><span>${ssrInterpolate(fmt(unref(iva)))}</span></div></div><div style="${ssrRenderStyle({ "padding": "14px 20px", "border-top": "1px solid rgba(14,165,233,0.12)", "background": "rgba(14,165,233,0.04)", "display": "flex", "justify-content": "space-between", "align-items": "center" })}"><span style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#E2EAF4" })}">Total con IVA</span><span style="${ssrRenderStyle({ "font-size": "18px", "font-weight": "800", "letter-spacing": "-0.5px", "background": "linear-gradient(135deg,#0EA5E9,#7DD3FC)", "-webkit-background-clip": "text", "-webkit-text-fill-color": "transparent" })}">${ssrInterpolate(fmt(unref(subtotal) + unref(iva)))}</span></div><div style="${ssrRenderStyle({ "padding": "16px 20px", "display": "flex", "flex-direction": "column", "gap": "10px" })}"><button style="${ssrRenderStyle({ "width": "100%", "height": "44px", "border-radius": "11px", "border": "none", "cursor": "pointer", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-weight": "700", "font-size": "13px", "font-family": "inherit", "box-shadow": "0 4px 18px rgba(14,165,233,0.32)", "display": "flex", "align-items": "center", "justify-content": "center", "gap": "8px" })}">`);
        _push(ssrRenderComponent(unref(CreditCard), { size: 15 }, null, _parent));
        _push(` Elegir método de pago </button></div></div></div><!--]-->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showPayModal)) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "z-index": "1000", "display": "flex", "align-items": "center", "justify-content": "center", "padding": "16px" })}"><div style="${ssrRenderStyle({ "position": "absolute", "inset": "0", "background": "rgba(0,0,0,0.75)", "backdrop-filter": "blur(6px)" })}"></div><div style="${ssrRenderStyle({ "position": "relative", "width": "100%", "max-width": "440px", "border-radius": "20px", "background": "linear-gradient(160deg,#0C1A2E,#06101E)", "border": "1px solid rgba(255,255,255,0.1)", "overflow": "hidden", "box-shadow": "0 24px 80px rgba(0,0,0,0.6)" })}"><div style="${ssrRenderStyle({ "padding": "22px 24px 0" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "margin-bottom": "16px" })}"><div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "10px", "margin-bottom": "8px" })}"><div style="${ssrRenderStyle({ "background": "white", "border-radius": "6px", "padding": "3px 10px", "display": "flex", "align-items": "center" })}"><img${ssrRenderAttr("src", _imports_1)} alt="Openpay by BBVA" style="${ssrRenderStyle({ "height": "18px", "object-fit": "contain" })}"></div><span style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.5)" })}">Pago seguro</span></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "5px" })}"><div style="${ssrRenderStyle({ "height": "22px", "padding": "2px 8px", "border-radius": "4px", "background": "white", "display": "flex", "align-items": "center", "justify-content": "center" })}"><img${ssrRenderAttr("src", _imports_2)} alt="Visa" style="${ssrRenderStyle({ "height": "13px", "object-fit": "contain" })}"></div><div style="${ssrRenderStyle({ "height": "22px", "padding": "2px 6px", "border-radius": "4px", "background": "white", "display": "flex", "align-items": "center", "justify-content": "center" })}"><img${ssrRenderAttr("src", _imports_3)} alt="Mastercard" style="${ssrRenderStyle({ "height": "18px", "object-fit": "contain" })}"></div><div style="${ssrRenderStyle({ "height": "22px", "width": "36px", "border-radius": "4px", "overflow": "hidden", "flex-shrink": "0" })}"><img${ssrRenderAttr("src", _imports_4)} alt="American Express" style="${ssrRenderStyle({ "height": "22px", "width": "36px", "object-fit": "cover" })}"></div><div style="${ssrRenderStyle({ "height": "22px", "padding": "2px 6px", "border-radius": "4px", "background": "white", "display": "flex", "align-items": "center", "justify-content": "center" })}"><img${ssrRenderAttr("src", _imports_5)} alt="Carnet" style="${ssrRenderStyle({ "height": "16px", "object-fit": "contain" })}"></div></div></div><button style="${ssrRenderStyle({ "width": "32px", "height": "32px", "border-radius": "8px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.08)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "#64748b", "flex-shrink": "0" })}">`);
          _push2(ssrRenderComponent(unref(X), { size: 15 }, null, _parent));
          _push2(`</button></div><div style="${ssrRenderStyle({ "padding": "11px 14px", "border-radius": "11px", "background": "rgba(14,165,233,0.07)", "border": "1px solid rgba(14,165,233,0.18)", "display": "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "18px" })}"><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,118,142,0.8)" })}">Total a pagar</span><span style="${ssrRenderStyle({ "font-size": "20px", "font-weight": "800", "background": "linear-gradient(135deg,#0EA5E9,#7DD3FC)", "-webkit-background-clip": "text", "-webkit-text-fill-color": "transparent" })}">${ssrInterpolate(fmt(unref(subtotal) + unref(iva)))}</span></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "8px", "margin-bottom": "20px" })}"><button style="${ssrRenderStyle({
            height: "44px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.15s",
            border: "none",
            background: unref(payTab) === "card" ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.03)",
            color: unref(payTab) === "card" ? "#7DD3FC" : "rgba(100,118,142,0.7)",
            outline: unref(payTab) === "card" ? "1.5px solid rgba(14,165,233,0.45)" : "1px solid rgba(255,255,255,0.08)"
          })}">`);
          _push2(ssrRenderComponent(unref(CreditCard), { size: 14 }, null, _parent));
          _push2(` Tarjeta </button><button style="${ssrRenderStyle({
            height: "44px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.15s",
            border: "none",
            background: unref(payTab) === "spei" ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
            color: unref(payTab) === "spei" ? "#22C55E" : "rgba(100,118,142,0.7)",
            outline: unref(payTab) === "spei" ? "1.5px solid rgba(34,197,94,0.35)" : "1px solid rgba(255,255,255,0.08)"
          })}"><div style="${ssrRenderStyle({ "background": "white", "border-radius": "3px", "padding": "1px 4px", "display": "flex", "align-items": "center" })}"><img${ssrRenderAttr("src", _imports_6)} alt="SPEI" style="${ssrRenderStyle({ "height": "14px", "object-fit": "contain" })}"></div> Transferencia </button></div></div>`);
          if (unref(payTab) === "card") {
            _push2(`<div style="${ssrRenderStyle({ "padding": "0 24px 24px", "display": "flex", "flex-direction": "column", "gap": "14px" })}"><div><label style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,118,142,0.7)", "text-transform": "uppercase", "letter-spacing": "0.7px", "display": "block", "margin-bottom": "6px" })}">Nombre en la tarjeta</label><input${ssrRenderAttr("value", unref(card).holderName)} type="text" placeholder="Como aparece en la tarjeta" autocomplete="cc-name" style="${ssrRenderStyle(inputStyle(unref(cardFocus).holderName))}"></div><div><label style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,118,142,0.7)", "text-transform": "uppercase", "letter-spacing": "0.7px", "display": "block", "margin-bottom": "6px" })}">Número de tarjeta</label><div style="${ssrRenderStyle({ "position": "relative" })}"><input${ssrRenderAttr("value", unref(card).number)} type="text" placeholder="0000 0000 0000 0000" autocomplete="cc-number" maxlength="19" style="${ssrRenderStyle({ ...inputStyle(unref(cardFocus).number), paddingRight: "44px" })}"><div style="${ssrRenderStyle({ "position": "absolute", "right": "13px", "top": "50%", "transform": "translateY(-50%)", "pointer-events": "none" })}">`);
            _push2(ssrRenderComponent(unref(CreditCard), {
              size: 16,
              color: "rgba(100,118,142,0.4)"
            }, null, _parent));
            _push2(`</div></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "12px" })}"><div><label style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,118,142,0.7)", "text-transform": "uppercase", "letter-spacing": "0.7px", "display": "block", "margin-bottom": "6px" })}">Vencimiento (MM/AA)</label><input${ssrRenderAttr("value", unref(card).expiry)} type="text" placeholder="MM/AA" autocomplete="cc-exp" maxlength="5" style="${ssrRenderStyle(inputStyle(unref(cardFocus).expiry))}"></div><div><label style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,118,142,0.7)", "text-transform": "uppercase", "letter-spacing": "0.7px", "display": "block", "margin-bottom": "6px" })}">CVV</label><input${ssrRenderAttr("value", unref(card).cvv)} type="password" placeholder="•••" autocomplete="cc-csc" maxlength="4" style="${ssrRenderStyle(inputStyle(unref(cardFocus).cvv))}"></div></div>`);
            if (unref(payError)) {
              _push2(`<div style="${ssrRenderStyle({ "padding": "10px 13px", "border-radius": "9px", "background": "rgba(239,68,68,0.08)", "border": "1px solid rgba(239,68,68,0.2)", "font-size": "12px", "color": "#EF4444", "display": "flex", "align-items": "flex-start", "gap": "8px" })}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="${ssrRenderStyle({ "flex-shrink": "0", "margin-top": "1px" })}"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><span>${ssrInterpolate(unref(payError))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button${ssrIncludeBooleanAttr(unref(paying)) ? " disabled" : ""} style="${ssrRenderStyle({
              width: "100%",
              height: "46px",
              borderRadius: "12px",
              border: "none",
              marginTop: "4px",
              cursor: unref(paying) ? "not-allowed" : "pointer",
              background: unref(paying) ? "rgba(14,165,233,0.35)" : "linear-gradient(135deg,#0EA5E9,#0284C7)",
              color: "white",
              fontWeight: 700,
              fontSize: "14px",
              fontFamily: "inherit",
              boxShadow: unref(paying) ? "none" : "0 6px 20px rgba(14,165,233,0.38)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s"
            })}">`);
            if (unref(paying)) {
              _push2(`<span style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px" })}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="${ssrRenderStyle({ "animation": "spin 0.8s linear infinite" })}"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg> Procesando pago… </span>`);
            } else {
              _push2(`<span style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px" })}">`);
              _push2(ssrRenderComponent(unref(Lock), { size: 14 }, null, _parent));
              _push2(` Pagar ${ssrInterpolate(fmt(unref(subtotal) + unref(iva)))}</span>`);
            }
            _push2(`</button><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "center", "gap": "7px" })}">`);
            _push2(ssrRenderComponent(unref(Lock), {
              size: 11,
              color: "rgba(100,118,142,0.35)"
            }, null, _parent));
            _push2(`<span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.4)" })}">Pago cifrado SSL · Procesado por</span><div style="${ssrRenderStyle({ "background": "white", "border-radius": "4px", "padding": "1px 6px", "display": "inline-flex", "align-items": "center" })}"><img${ssrRenderAttr("src", _imports_1)} alt="Openpay" style="${ssrRenderStyle({ "height": "11px", "object-fit": "contain" })}"></div></div></div>`);
          } else {
            _push2(`<div style="${ssrRenderStyle({ "padding": "0 24px 24px", "display": "flex", "flex-direction": "column", "gap": "14px" })}"><div style="${ssrRenderStyle({ "padding": "14px 16px", "border-radius": "12px", "background": "rgba(34,197,94,0.06)", "border": "1px solid rgba(34,197,94,0.2)", "display": "flex", "flex-direction": "column", "gap": "10px" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "10px" })}"><div style="${ssrRenderStyle({ "background": "white", "border-radius": "5px", "padding": "4px 8px", "display": "flex", "align-items": "center", "flex-shrink": "0" })}"><img${ssrRenderAttr("src", _imports_6)} alt="SPEI" style="${ssrRenderStyle({ "height": "22px", "object-fit": "contain" })}"></div><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#22C55E" })}">Transferencia SPEI</div></div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.75)", "line-height": "1.6" })}"> Al confirmar, se generará una CLABE interbancaria. Realiza la transferencia desde tu banco con ese número. Tu pedido quedará pendiente hasta que el administrador confirme el pago. </div></div><div style="${ssrRenderStyle({ "padding": "12px 16px", "border-radius": "11px", "background": "rgba(14,165,233,0.06)", "border": "1px solid rgba(14,165,233,0.15)", "display": "flex", "justify-content": "space-between", "align-items": "center" })}"><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,118,142,0.8)" })}">Monto a transferir</span><span style="${ssrRenderStyle({ "font-size": "18px", "font-weight": "800", "background": "linear-gradient(135deg,#0EA5E9,#7DD3FC)", "-webkit-background-clip": "text", "-webkit-text-fill-color": "transparent" })}">${ssrInterpolate(fmt(unref(subtotal) + unref(iva)))}</span></div>`);
            if (unref(payError)) {
              _push2(`<div style="${ssrRenderStyle({ "padding": "10px 13px", "border-radius": "9px", "background": "rgba(239,68,68,0.08)", "border": "1px solid rgba(239,68,68,0.2)", "font-size": "12px", "color": "#EF4444" })}">${ssrInterpolate(unref(payError))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button${ssrIncludeBooleanAttr(unref(paying)) ? " disabled" : ""} style="${ssrRenderStyle({
              width: "100%",
              height: "46px",
              borderRadius: "12px",
              border: "none",
              marginTop: "4px",
              cursor: unref(paying) ? "not-allowed" : "pointer",
              background: unref(paying) ? "rgba(34,197,94,0.25)" : "linear-gradient(135deg,#22C55E,#059669)",
              color: "white",
              fontWeight: 700,
              fontSize: "14px",
              fontFamily: "inherit",
              boxShadow: unref(paying) ? "none" : "0 6px 20px rgba(34,197,94,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s"
            })}">`);
            if (unref(paying)) {
              _push2(`<span style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px" })}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="${ssrRenderStyle({ "animation": "spin 0.8s linear infinite" })}"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg> Generando referencia… </span>`);
            } else {
              _push2(`<span>Generar referencia SPEI</span>`);
            }
            _push2(`</button><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "center", "gap": "7px" })}">`);
            _push2(ssrRenderComponent(unref(Lock), {
              size: 11,
              color: "rgba(100,118,142,0.35)"
            }, null, _parent));
            _push2(`<span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.4)" })}">Procesado por</span><div style="${ssrRenderStyle({ "background": "white", "border-radius": "4px", "padding": "1px 6px", "display": "inline-flex", "align-items": "center" })}"><img${ssrRenderAttr("src", _imports_1)} alt="Openpay" style="${ssrRenderStyle({ "height": "11px", "object-fit": "contain" })}"></div></div></div>`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=cart-DloiQFMN.js.map
