import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-DdQ94-v7.mjs';
import { n as navigateTo } from './server.mjs';
import 'pinia';
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
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    var _a;
    const auth = useAuthStore();
    if (((_a = auth.user) == null ? void 0 : _a.role) !== "admin") navigateTo("/dashboard");
    const loading = ref(true);
    const saving = ref(false);
    const saved = ref(false);
    const focused = ref(false);
    const error = ref("");
    const currentPct = ref(0);
    const inputPct = ref(0);
    const previewPrice = computed(
      () => (1e3 * (1 + inputPct.value / 100)).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ style: { fontFamily: `'Inter',system-ui,sans-serif` } }, _attrs))}><div style="${ssrRenderStyle({ "margin-bottom": "28px", "text-align": "center" })}"><h1 style="${ssrRenderStyle({ "font-size": "22px", "font-weight": "800", "color": "#E2EAF4", "margin": "0" })}">Control de Precios</h1><p style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,118,142,0.85)", "margin-top": "4px" })}"> Ajusta el incremento global que se aplica al cat\xE1logo SYSCOM. </p></div><div style="${ssrRenderStyle({ "max-width": "520px", "margin": "0 auto" })}"><div style="${ssrRenderStyle({ "border-radius": "18px", "background": "linear-gradient(160deg,#0C1A2E,#06101E)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "28px" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "14px", "margin-bottom": "24px" })}"><div style="${ssrRenderStyle({ "width": "46px", "height": "46px", "border-radius": "13px", "background": "linear-gradient(135deg,rgba(14,165,233,0.18),rgba(14,165,233,0.08))", "border": "1px solid rgba(14,165,233,0.25)", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" })}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg></div><div><div style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "700", "color": "#E2EAF4" })}">Incremento global de precios</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,118,142,0.8)", "margin-top": "2px" })}">Se aplica a todos los productos del cat\xE1logo</div></div></div><div style="${ssrRenderStyle({ "margin-bottom": "20px" })}"><label style="${ssrRenderStyle({ "display": "block", "font-size": "12px", "font-weight": "600", "color": "rgba(123,146,176,0.9)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "8px" })}"> Porcentaje de incremento (%) </label><div style="${ssrRenderStyle({ "position": "relative" })}"><input${ssrRenderAttr("value", unref(inputPct))} type="number" min="0" max="500" step="0.5" placeholder="0" style="${ssrRenderStyle({
        width: "100%",
        height: "48px",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${unref(focused) ? "rgba(14,165,233,0.5)" : "rgba(255,255,255,0.09)"}`,
        borderRadius: "12px",
        paddingLeft: "16px",
        paddingRight: "52px",
        fontSize: "18px",
        fontWeight: 700,
        color: "#E2EAF4",
        outline: "none",
        fontFamily: "inherit",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
        MozAppearance: "textfield"
      })}"><span style="${ssrRenderStyle({ "position": "absolute", "right": "16px", "top": "50%", "transform": "translateY(-50%)", "font-size": "18px", "font-weight": "700", "color": "rgba(100,118,142,0.6)" })}">%</span></div></div>`);
      if (unref(inputPct) > 0) {
        _push(`<div style="${ssrRenderStyle({ "border-radius": "12px", "background": "rgba(14,165,233,0.06)", "border": "1px solid rgba(14,165,233,0.15)", "padding": "14px 16px", "margin-bottom": "20px" })}"><div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "600", "color": "rgba(14,165,233,0.8)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "10px" })}">Vista previa</div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "flex-wrap": "wrap", "gap": "8px" })}"><div style="${ssrRenderStyle({ "text-align": "center" })}"><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.7)", "margin-bottom": "3px" })}">Precio SYSCOM</div><div style="${ssrRenderStyle({ "font-size": "16px", "font-weight": "700", "color": "rgba(123,146,176,0.6)" })}">$1,000</div></div><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(14,165,233,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg><div style="${ssrRenderStyle({ "text-align": "center" })}"><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.7)", "margin-bottom": "3px" })}">Precio al cliente</div><div style="${ssrRenderStyle({ "font-size": "16px", "font-weight": "700", "color": "#7DD3FC" })}">$${ssrInterpolate(unref(previewPrice))}</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px", "margin-bottom": "20px" })}"><div style="${ssrRenderStyle({
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: unref(currentPct) > 0 ? "#22C55E" : "rgba(100,118,142,0.4)",
        boxShadow: unref(currentPct) > 0 ? "0 0 8px rgba(34,197,94,0.6)" : "none",
        flexShrink: 0
      })}"></div><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,118,142,0.8)" })}">`);
      if (unref(loading)) {
        _push(`<span>Cargando configuraci\xF3n...</span>`);
      } else if (unref(currentPct) > 0) {
        _push(`<span>Incremento activo: <strong style="${ssrRenderStyle({ "color": "#22C55E" })}">${ssrInterpolate(unref(currentPct))}%</strong></span>`);
      } else {
        _push(`<span>Sin incremento activo \u2014 precios originales de SYSCOM</span>`);
      }
      _push(`</span></div><button${ssrIncludeBooleanAttr(unref(saving) || unref(inputPct) === unref(currentPct)) ? " disabled" : ""} style="${ssrRenderStyle({
        width: "100%",
        height: "44px",
        borderRadius: "12px",
        border: "none",
        background: unref(saving) || unref(inputPct) === unref(currentPct) ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#0EA5E9,#0284C7)",
        color: unref(saving) || unref(inputPct) === unref(currentPct) ? "rgba(100,118,142,0.6)" : "white",
        fontSize: "14px",
        fontWeight: 600,
        cursor: unref(saving) || unref(inputPct) === unref(currentPct) ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s",
        boxShadow: unref(saving) || unref(inputPct) === unref(currentPct) ? "none" : "0 4px 16px rgba(14,165,233,0.3)"
      })}">`);
      if (unref(saving)) {
        _push(`<span>Guardando...</span>`);
      } else if (unref(saved)) {
        _push(`<span>\u2713 Guardado</span>`);
      } else {
        _push(`<span>Aplicar incremento</span>`);
      }
      _push(`</button>`);
      if (unref(error)) {
        _push(`<p style="${ssrRenderStyle({ "font-size": "12px", "color": "#EF4444", "margin-top": "10px", "text-align": "center" })}">${ssrInterpolate(unref(error))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-CCXsw7OA.mjs.map
