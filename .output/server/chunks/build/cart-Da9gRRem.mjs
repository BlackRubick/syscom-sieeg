import { _ as __nuxt_component_0 } from './nuxt-link-BuVqOM4V.mjs';
import { _ as _sfc_main$1 } from './ProductModal-DV7syrtH.mjs';
import { defineComponent, ref, computed, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { ArrowRight, ShoppingCart, Package, Trash2, Minus, Plus, FileText, Tag } from '@lucide/vue';
import { u as useCartStore } from './cart-YNBuivug.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import './useSyscom-Bu-iKqE2.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cart",
  __ssrInlineRender: true,
  setup(__props) {
    const cart = useCartStore();
    const notes = ref("");
    const priority = ref("normal");
    const submitted = ref(false);
    const submitting = ref(false);
    const submitError = ref("");
    const notesFocus = ref(false);
    const detailProduct = ref(null);
    const priorities = [
      { key: "low", label: "Baja", color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
      { key: "normal", label: "Normal", color: "#38bdf8", bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.25)" },
      { key: "high", label: "Alta", color: "#fbbf24", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
      { key: "urgent", label: "Urgente", color: "#fb7185", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.25)" }
    ];
    const activePri = computed(() => priorities.find((p) => p.key === priority.value));
    const cartTotal = computed(() => cart.total);
    const iva = computed(() => cartTotal.value * 0.16);
    const totalUnits = computed(() => cart.items.reduce((s, i) => s + i.quantity, 0));
    const fmtCurrency = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ProductModal = _sfc_main$1;
      _push(`<!--[-->`);
      if (unref(submitted)) {
        _push(`<div style="${ssrRenderStyle({ "min-height": "65vh", "display": "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", "text-align": "center", "font-family": "'Inter',system-ui,sans-serif" })}"><div style="${ssrRenderStyle({ "width": "88px", "height": "88px", "border-radius": "50%", "background": "linear-gradient(135deg,#10B981,#34D399)", "display": "flex", "align-items": "center", "justify-content": "center", "margin-bottom": "24px", "box-shadow": "0 0 50px rgba(16,185,129,0.35)" })}"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></div><div style="${ssrRenderStyle({ "font-size": "24px", "font-weight": "800", "color": "#F1F5F9", "margin-bottom": "8px" })}">\xA1Orden enviada!</div><div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.9)", "max-width": "300px", "line-height": "1.6", "margin-bottom": "12px" })}">Tu solicitud fue enviada. El administrador la revisar\xE1 y la enviar\xE1 a SYSCOM cuando sea aprobada.</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/orders",
          style: { "display": "inline-flex", "align-items": "center", "gap": "8px", "height": "44px", "padding": "0 24px", "border-radius": "12px", "border": "none", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-size": "13px", "font-weight": "600", "cursor": "pointer", "box-shadow": "0 4px 18px rgba(14,165,233,0.35)", "text-decoration": "none" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Ver mis \xF3rdenes `);
              _push2(ssrRenderComponent(unref(ArrowRight), { size: 14 }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Ver mis \xF3rdenes "),
                createVNode(unref(ArrowRight), { size: 14 })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (!unref(cart).items.length) {
        _push(`<div style="${ssrRenderStyle({ "min-height": "65vh", "display": "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", "text-align": "center", "font-family": "'Inter',system-ui,sans-serif" })}"><div style="${ssrRenderStyle({ "width": "80px", "height": "80px", "border-radius": "22px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.09)", "display": "flex", "align-items": "center", "justify-content": "center", "margin-bottom": "22px", "box-shadow": "0 10px 28px rgba(0,0,0,0.45)" })}">`);
        _push(ssrRenderComponent(unref(ShoppingCart), {
          size: 30,
          color: "rgba(100,116,139,0.55)",
          "stroke-width": 1.5
        }, null, _parent));
        _push(`</div><div style="${ssrRenderStyle({ "font-size": "19px", "font-weight": "700", "color": "#E2E8F0", "margin-bottom": "7px" })}">Tu carrito est\xE1 vac\xEDo</div><div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.8)", "margin-bottom": "26px" })}">Agrega productos desde el cat\xE1logo</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/catalog",
          style: { "display": "inline-flex", "align-items": "center", "gap": "7px", "height": "42px", "padding": "0 22px", "border-radius": "11px", "border": "none", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-size": "13px", "font-weight": "600", "cursor": "pointer", "box-shadow": "0 4px 16px rgba(14,165,233,0.3)" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Package), { size: 14 }, null, _parent2, _scopeId));
              _push2(` Ir al cat\xE1logo `);
            } else {
              return [
                createVNode(unref(Package), { size: 14 }),
                createTextVNode(" Ir al cat\xE1logo ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div style="${ssrRenderStyle({ fontFamily: `'Inter',system-ui,sans-serif`, display: "flex", flexDirection: "column", gap: "18px" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "flex-wrap": "wrap", "gap": "10px" })}"><div><h1 style="${ssrRenderStyle({ "font-size": "21px", "font-weight": "800", "color": "#F1F5F9", "margin": "0" })}">Carrito de compras</h1><p style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.8)", "margin-top": "3px" })}">${ssrInterpolate(unref(cart).items.length)} producto${ssrInterpolate(unref(cart).items.length !== 1 ? "s" : "")} \xB7 ${ssrInterpolate(unref(totalUnits))} unidades</p></div><button style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "6px", "height": "32px", "padding": "0 12px", "border-radius": "8px", "background": "rgba(244,63,94,0.07)", "border": "1px solid rgba(244,63,94,0.18)", "color": "#fb7185", "font-size": "12px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit", "flex-shrink": "0" })}">`);
        _push(ssrRenderComponent(unref(Trash2), { size: 12 }, null, _parent));
        _push(` Vaciar </button></div><div style="${ssrRenderStyle({ "display": "flex", "flex-wrap": "wrap", "gap": "20px", "align-items": "flex-start" })}"><div style="${ssrRenderStyle({ "flex": "1 1 320px", "min-width": "0", "display": "flex", "flex-direction": "column", "gap": "10px" })}"><!--[-->`);
        ssrRenderList(unref(cart).items, (item) => {
          _push(`<div style="${ssrRenderStyle({ "border-radius": "14px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.08)", "overflow": "hidden", "box-shadow": "0 3px 14px rgba(0,0,0,0.3)" })}"><div style="${ssrRenderStyle({ "padding": "14px 15px", "display": "flex", "flex-direction": "column", "gap": "11px" })}"><div style="${ssrRenderStyle({ "display": "flex", "gap": "11px", "align-items": "center" })}"><div style="${ssrRenderStyle({ "width": "42px", "height": "42px", "border-radius": "11px", "background": "rgba(14,165,233,0.08)", "border": "1px solid rgba(14,165,233,0.15)", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0", "cursor": "pointer" })}">`);
          if (item.product.images[0]) {
            _push(`<img${ssrRenderAttr("src", item.product.images[0])}${ssrRenderAttr("alt", item.product.name)} style="${ssrRenderStyle({ "width": "36px", "height": "36px", "object-fit": "contain" })}">`);
          } else {
            _push(ssrRenderComponent(unref(Package), {
              size: 16,
              color: "#38bdf8",
              "stroke-width": 1.6
            }, null, _parent));
          }
          _push(`</div><div style="${ssrRenderStyle({ "flex": "1", "min-width": "0" })}"><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "600", "color": "#E2E8F0", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap", "cursor": "pointer" })}">${ssrInterpolate(item.product.name)}</div><div style="${ssrRenderStyle({ "display": "flex", "gap": "6px", "margin-top": "3px", "flex-wrap": "wrap", "align-items": "center" })}"><span style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.8)" })}">${ssrInterpolate(item.product.supplier)}</span>`);
          if (item.product.sku) {
            _push(`<span style="${ssrRenderStyle({ "font-size": "10px", "font-family": "monospace", "color": "rgba(71,85,105,0.85)" })}">${ssrInterpolate(item.product.sku)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "gap": "8px", "padding-left": "53px" })}"><div style="${ssrRenderStyle({ "min-width": "62px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,116,139,0.6)", "line-height": "1" })}">c/u</div><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#94a3b8", "margin-top": "2px" })}">${ssrInterpolate(item.product.price > 0 ? fmtCurrency(item.product.price) : "\u2014")}</div></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "5px", "flex-shrink": "0" })}"><button style="${ssrRenderStyle({ "width": "28px", "height": "28px", "border-radius": "7px", "background": "rgba(255,255,255,0.05)", "border": "1px solid rgba(255,255,255,0.1)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "#94a3b8" })}">`);
          _push(ssrRenderComponent(unref(Minus), {
            size: 10,
            "stroke-width": 2.5
          }, null, _parent));
          _push(`</button><div style="${ssrRenderStyle({ "width": "32px", "height": "28px", "border-radius": "7px", "background": "rgba(14,165,233,0.08)", "border": "1px solid rgba(14,165,233,0.18)", "display": "flex", "align-items": "center", "justify-content": "center", "font-size": "13px", "font-weight": "800", "color": "#38bdf8" })}">${ssrInterpolate(item.quantity)}</div><button style="${ssrRenderStyle({ "width": "28px", "height": "28px", "border-radius": "7px", "background": "rgba(14,165,233,0.08)", "border": "1px solid rgba(14,165,233,0.18)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "#38bdf8" })}">`);
          _push(ssrRenderComponent(unref(Plus), {
            size: 10,
            "stroke-width": 2.5
          }, null, _parent));
          _push(`</button></div><div style="${ssrRenderStyle({ "text-align": "right", "flex-shrink": "0" })}"><div style="${ssrRenderStyle({ "font-size": "14px", "font-weight": "800", "color": "#F1F5F9" })}">${ssrInterpolate(item.product.price > 0 ? fmtCurrency(item.product.price * item.quantity) : "\u2014")}</div><button style="${ssrRenderStyle({ "margin-top": "2px", "background": "none", "border": "none", "cursor": "pointer", "color": "rgba(71,85,105,0.65)", "display": "inline-flex", "align-items": "center", "gap": "3px", "font-size": "10px", "font-family": "inherit", "transition": "color 0.15s" })}">`);
          _push(ssrRenderComponent(unref(Trash2), { size: 10 }, null, _parent));
          _push(` Quitar </button></div></div></div></div>`);
        });
        _push(`<!--]-->`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/catalog",
          style: { "display": "flex", "align-items": "center", "justify-content": "center", "gap": "7px", "height": "44px", "border-radius": "12px", "border": "1.5px dashed rgba(255,255,255,0.09)", "cursor": "pointer", "font-size": "12px", "color": "rgba(100,116,139,0.7)", "font-weight": "500", "text-decoration": "none", "transition": "all 0.2s" },
          onMouseenter: (e) => {
            e.currentTarget.style.borderColor = "rgba(14,165,233,0.35)";
            e.currentTarget.style.background = "rgba(14,165,233,0.03)";
          },
          onMouseleave: (e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
            e.currentTarget.style.background = "transparent";
          }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Plus), { size: 12 }, null, _parent2, _scopeId));
              _push2(` Agregar m\xE1s productos `);
            } else {
              return [
                createVNode(unref(Plus), { size: 12 }),
                createTextVNode(" Agregar m\xE1s productos ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div style="${ssrRenderStyle({ "flex": "0 0 320px", "width": "320px", "max-width": "100%", "display": "flex", "flex-direction": "column", "gap": "14px", "position": "sticky", "top": "16px" })}"><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.08)", "overflow": "hidden", "box-shadow": "0 4px 18px rgba(0,0,0,0.35)" })}"><div style="${ssrRenderStyle({ "padding": "15px 16px 0", "display": "flex", "align-items": "center", "gap": "8px", "margin-bottom": "14px" })}"><div style="${ssrRenderStyle({ "width": "26px", "height": "26px", "border-radius": "7px", "background": "rgba(14,165,233,0.12)", "border": "1px solid rgba(14,165,233,0.2)", "display": "flex", "align-items": "center", "justify-content": "center" })}">`);
        _push(ssrRenderComponent(unref(FileText), {
          size: 12,
          color: "#38bdf8"
        }, null, _parent));
        _push(`</div><span style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#E2E8F0" })}">Detalles de la orden</span></div><div style="${ssrRenderStyle({ "padding": "0 16px 16px", "display": "flex", "flex-direction": "column", "gap": "14px" })}"><div><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "8px" })}">Prioridad</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(4,1fr)", "gap": "5px" })}"><!--[-->`);
        ssrRenderList(priorities, (p) => {
          _push(`<button style="${ssrRenderStyle({ height: "32px", borderRadius: "8px", border: `1px solid ${unref(priority) === p.key ? p.border : "rgba(255,255,255,0.07)"}`, background: unref(priority) === p.key ? p.bg : "rgba(255,255,255,0.03)", color: unref(priority) === p.key ? p.color : "rgba(100,116,139,0.7)", fontSize: "11px", fontWeight: unref(priority) === p.key ? 700 : 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" })}">${ssrInterpolate(p.label)}</button>`);
        });
        _push(`<!--]--></div><div style="${ssrRenderStyle({ display: "flex", alignItems: "center", gap: "6px", marginTop: "7px", padding: "5px 9px", borderRadius: "7px", background: unref(activePri).bg, border: `1px solid ${unref(activePri).border}` })}"><div style="${ssrRenderStyle({ width: "5px", height: "5px", borderRadius: "50%", background: unref(activePri).color, flexShrink: 0 })}"></div><span style="${ssrRenderStyle({ fontSize: "11px", fontWeight: 600, color: unref(activePri).color })}">${ssrInterpolate(unref(priority) === "urgent" ? "Urgente \u2014 notificaci\xF3n inmediata" : unref(priority) === "high" ? "Alta \u2014 procesamiento en 4h" : unref(priority) === "normal" ? "Normal \u2014 procesamiento en 24h" : "Baja \u2014 sin urgencia")}</span></div></div><div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "7px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px", "display": "flex", "align-items": "center", "gap": "4px" })}">`);
        _push(ssrRenderComponent(unref(Tag), { size: 10 }, null, _parent));
        _push(` Notas </div><span style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(71,85,105,0.75)" })}">${ssrInterpolate(unref(notes).length)}/300</span></div><textarea placeholder="Justificaci\xF3n, \xE1rea solicitante, instrucciones..." rows="3" style="${ssrRenderStyle({ width: "100%", padding: "9px 11px", background: unref(notesFocus) ? "rgba(14,165,233,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${unref(notesFocus) ? "rgba(14,165,233,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "9px", fontSize: "12px", color: "#CBD5E1", outline: "none", resize: "none", fontFamily: "inherit", transition: "all 0.2s", boxSizing: "border-box", lineHeight: "1.5" })}">${ssrInterpolate(unref(notes))}</textarea></div></div></div><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.08)", "overflow": "hidden", "box-shadow": "0 4px 18px rgba(0,0,0,0.35)" })}"><div style="${ssrRenderStyle({ "padding": "15px 16px 0", "margin-bottom": "12px" })}"><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#E2E8F0" })}">Resumen de compra</div></div><div style="${ssrRenderStyle({ "padding": "0 16px", "display": "flex", "flex-direction": "column", "gap": "6px", "margin-bottom": "12px" })}"><!--[-->`);
        ssrRenderList(unref(cart).items, (item) => {
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.8)", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap", "flex": "1" })}">${ssrInterpolate(item.product.name.length > 24 ? item.product.name.slice(0, 24) + "\u2026" : item.product.name)} <span style="${ssrRenderStyle({ "color": "rgba(71,85,105,0.8)" })}"> \xD7${ssrInterpolate(item.quantity)}</span></span><span style="${ssrRenderStyle({ "font-size": "11px", "color": "#94a3b8", "font-weight": "500", "flex-shrink": "0" })}">${ssrInterpolate(item.product.price > 0 ? fmtCurrency(item.product.price * item.quantity) : "\u2014")}</span></div>`);
        });
        _push(`<!--]--></div><div style="${ssrRenderStyle({ "padding": "12px 16px", "border-top": "1px solid rgba(255,255,255,0.06)", "display": "flex", "flex-direction": "column", "gap": "8px" })}"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "font-size": "12px", "color": "rgba(100,116,139,0.85)" })}"><span>Subtotal</span><span>${ssrInterpolate(fmtCurrency(unref(cartTotal)))}</span></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "font-size": "12px", "color": "rgba(100,116,139,0.85)" })}"><span>IVA (16%)</span><span>${ssrInterpolate(fmtCurrency(unref(iva)))}</span></div></div><div style="${ssrRenderStyle({ "padding": "12px 16px", "background": "rgba(14,165,233,0.05)", "border-top": "1px solid rgba(14,165,233,0.12)", "display": "flex", "justify-content": "space-between", "align-items": "center" })}"><span style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#E2E8F0" })}">Total con IVA</span><span style="${ssrRenderStyle({ "font-size": "18px", "font-weight": "800", "letter-spacing": "-0.5px", "background": "linear-gradient(135deg,#0EA5E9,#22D3EE)", "-webkit-background-clip": "text", "-webkit-text-fill-color": "transparent" })}">${ssrInterpolate(fmtCurrency(unref(cartTotal) + unref(iva)))}</span></div><div style="${ssrRenderStyle({ "padding": "14px 16px 16px", "display": "flex", "flex-direction": "column", "gap": "10px" })}">`);
        if (unref(submitError)) {
          _push(`<div style="${ssrRenderStyle({ "padding": "9px 12px", "border-radius": "8px", "background": "rgba(244,63,94,0.1)", "border": "1px solid rgba(244,63,94,0.25)", "font-size": "12px", "color": "#fb7185" })}">${ssrInterpolate(unref(submitError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} style="${ssrRenderStyle({ position: "relative", width: "100%", height: "46px", borderRadius: "12px", border: "none", cursor: unref(submitting) ? "not-allowed" : "pointer", background: unref(submitting) ? "rgba(14,165,233,0.5)" : "linear-gradient(135deg,#0EA5E9,#0284C7)", color: "white", fontWeight: 700, fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "inherit", boxShadow: unref(submitting) ? "none" : "0 4px 20px rgba(14,165,233,0.38)", overflow: "hidden" })}">${ssrInterpolate(unref(submitting) ? "Enviando orden\u2026" : "Enviar solicitud")} `);
        if (!unref(submitting)) {
          _push(ssrRenderComponent(unref(ArrowRight), { size: 14 }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</button><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "center", "gap": "14px" })}"><!--[-->`);
        ssrRenderList(["\u{1F512} Seguro", "\u26A1 < 24h", "\u2713 Trazable"], (badge) => {
          _push(`<div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(71,85,105,0.8)" })}">${ssrInterpolate(badge)}</div>`);
        });
        _push(`<!--]--></div></div></div></div></div></div>`);
      }
      if (unref(detailProduct)) {
        _push(ssrRenderComponent(_component_ProductModal, {
          product: unref(detailProduct),
          show: !!unref(detailProduct),
          onClose: ($event) => detailProduct.value = null
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cart-Da9gRRem.mjs.map
