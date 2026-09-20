import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { b as useRoute } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "return",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const status = ref("loading");
    const authorization = ref("");
    const errorMsg = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ style: { "font-family": "'Inter',system-ui,sans-serif", "min-height": "80vh", "display": "flex", "align-items": "center", "justify-content": "center", "padding": "24px" } }, _attrs))}>`);
      if (unref(status) === "loading") {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "gap": "16px", "text-align": "center" })}"><div style="${ssrRenderStyle({ "width": "56px", "height": "56px", "border-radius": "50%", "border": "3px solid rgba(14,165,233,0.15)", "border-top-color": "#0EA5E9", "animation": "spin 0.8s linear infinite" })}"></div><div style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "600", "color": "#94a3b8" })}">Verificando tu pago\u2026</div></div>`);
      } else if (unref(status) === "success") {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center", "gap": "4px" })}"><div style="${ssrRenderStyle({ "width": "80px", "height": "80px", "border-radius": "50%", "background": "linear-gradient(135deg,#10B981,#34D399)", "display": "flex", "align-items": "center", "justify-content": "center", "margin-bottom": "16px", "box-shadow": "0 0 40px rgba(16,185,129,0.3)" })}"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></div><div style="${ssrRenderStyle({ "font-size": "22px", "font-weight": "800", "color": "#F1F5F9", "margin-bottom": "8px" })}">\xA1Transacci\xF3n exitosa!</div><div style="${ssrRenderStyle({ "font-size": "14px", "color": "#34d399", "font-weight": "600", "margin-bottom": "6px" })}">Recibimos tu pago. \xA1Gracias por tu compra!</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.75)", "max-width": "300px", "line-height": "1.6", "margin-bottom": "6px" })}">El administrador procesar\xE1 tu pedido a la brevedad.</div>`);
        if (unref(authorization)) {
          _push(`<div style="${ssrRenderStyle({ "font-size": "11px", "font-family": "monospace", "color": "rgba(100,116,139,0.45)", "margin-bottom": "22px" })}">Autorizaci\xF3n: ${ssrInterpolate(unref(authorization))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<a href="/orders" style="${ssrRenderStyle({ "height": "42px", "padding": "0 24px", "border-radius": "11px", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-size": "13px", "font-weight": "600", "text-decoration": "none", "display": "inline-flex", "align-items": "center", "box-shadow": "0 4px 16px rgba(14,165,233,0.3)" })}"> Ver mis \xF3rdenes </a></div>`);
      } else if (unref(status) === "failed") {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center", "gap": "4px" })}"><div style="${ssrRenderStyle({ "width": "80px", "height": "80px", "border-radius": "50%", "background": "linear-gradient(135deg,#ef4444,#f87171)", "display": "flex", "align-items": "center", "justify-content": "center", "margin-bottom": "16px", "box-shadow": "0 0 40px rgba(239,68,68,0.3)" })}"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></div><div style="${ssrRenderStyle({ "font-size": "22px", "font-weight": "800", "color": "#F1F5F9", "margin-bottom": "8px" })}">Pago no realizado</div><div style="${ssrRenderStyle({ "font-size": "14px", "color": "#fb7185", "font-weight": "600", "margin-bottom": "6px" })}">Tu pago no pudo ser realizado, intenta de nuevo.</div>`);
        if (unref(errorMsg)) {
          _push(`<div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.65)", "max-width": "300px", "line-height": "1.6", "margin-bottom": "22px" })}">${ssrInterpolate(unref(errorMsg))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<a href="/cart" style="${ssrRenderStyle({ "height": "42px", "padding": "0 24px", "border-radius": "11px", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-size": "13px", "font-weight": "600", "text-decoration": "none", "display": "inline-flex", "align-items": "center", "box-shadow": "0 4px 16px rgba(14,165,233,0.3)" })}"> Volver al carrito </a></div>`);
      } else {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center", "gap": "4px" })}"><div style="${ssrRenderStyle({ "font-size": "18px", "font-weight": "700", "color": "#E2E8F0", "margin-bottom": "6px" })}">No se encontr\xF3 informaci\xF3n del pago</div><div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.65)", "margin-bottom": "22px" })}">Si realizaste un pago, revisa el estado de tu orden.</div><a href="/orders" style="${ssrRenderStyle({ "height": "42px", "padding": "0 24px", "border-radius": "11px", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-size": "13px", "font-weight": "600", "text-decoration": "none", "display": "inline-flex", "align-items": "center" })}"> Ver mis \xF3rdenes </a></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/payment/return.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=return-BGL7NeX_.mjs.map
