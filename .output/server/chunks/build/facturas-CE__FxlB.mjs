import { _ as __nuxt_component_0 } from './CfdiModal-CNOJThHi.mjs';
import { defineComponent, ref, computed, watch, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderStyle, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderTeleport, ssrRenderAttrs, ssrLooseContain, ssrLooseEqual, ssrGetDynamicModelProps } from 'vue/server-renderer';
import { FileText, Search, X, CheckCircle, FileDown } from '@lucide/vue';
import { _ as _export_sfc, n as navigateTo } from './server.mjs';
import { u as useAuthStore } from './auth-De5_qdGe.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "GlobalCfdiModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    pendingOrders: {}
  },
  emits: ["close", "created"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const now = /* @__PURE__ */ new Date();
    const form = ref({
      periodicidad: "04",
      meses: String(now.getMonth() + 1).padStart(2, "0"),
      a\u00F1o: String(now.getFullYear()),
      usoCfdi: "S01",
      moneda: "MXN",
      formaPago: "99",
      metodoPago: "PPD"
    });
    const loading = ref(false);
    const error = ref("");
    const result = ref(null);
    const downloading = ref(null);
    const pendingTotal = computed(() => props.pendingOrders.reduce((s, o) => s + o.total, 0));
    watch(() => props.open, (v) => {
      if (v) {
        error.value = "";
        result.value = null;
      }
    });
    watch(() => form.value.periodicidad, () => {
      form.value.meses = "";
    });
    const resultRows = computed(() => result.value ? [
      { label: "UUID SAT", value: result.value.UUID, mono: true },
      { label: "Serie / Folio", value: `${result.value.INV.Serie}-${result.value.INV.Folio}`, mono: false },
      { label: "Fecha timbrado", value: new Date(result.value.SAT.FechaTimbrado).toLocaleString("es-MX"), mono: false },
      { label: "Pedidos cubiertos", value: String(result.value.ordersIncluded), mono: false }
    ] : []);
    const fmtMXN = (n) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
    const sel = { style: "width:100%;height:34px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0 10px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;cursor:pointer;" };
    const inp = { style: "width:100%;height:34px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0 10px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;" };
    const MESES = [
      { v: "01", l: "Enero" },
      { v: "02", l: "Febrero" },
      { v: "03", l: "Marzo" },
      { v: "04", l: "Abril" },
      { v: "05", l: "Mayo" },
      { v: "06", l: "Junio" },
      { v: "07", l: "Julio" },
      { v: "08", l: "Agosto" },
      { v: "09", l: "Septiembre" },
      { v: "10", l: "Octubre" },
      { v: "11", l: "Noviembre" },
      { v: "12", l: "Diciembre" }
    ];
    const BIMESTRES = [
      { v: "13", l: "Enero \u2013 Febrero" },
      { v: "14", l: "Marzo \u2013 Abril" },
      { v: "15", l: "Mayo \u2013 Junio" },
      { v: "16", l: "Julio \u2013 Agosto" },
      { v: "17", l: "Septiembre \u2013 Octubre" },
      { v: "18", l: "Noviembre \u2013 Diciembre" }
    ];
    const FORMAS_PAGO = [
      { c: "01", n: "Efectivo" },
      { c: "02", n: "Cheque nominativo" },
      { c: "03", n: "Transferencia electr\xF3nica" },
      { c: "04", n: "Tarjeta de cr\xE9dito" },
      { c: "28", n: "Tarjeta de d\xE9bito" },
      { c: "99", n: "Por definir" }
    ];
    const USOS_CFDI = {
      G01: "Adquisici\xF3n de mercancias",
      G03: "Gastos en general",
      I01: "Construcciones",
      I02: "Mobilario y equipo de oficina por inversiones",
      I04: "Equipo de computo y accesorios",
      I06: "Comunicaciones telef\xF3nicas",
      I08: "Otra maquinaria y equipo",
      S01: "Sin efectos fiscales",
      CP01: "Pagos",
      CN01: "N\xF3mina"
    };
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "background": "rgba(2,6,14,0.85)", "backdrop-filter": "blur(6px)", "z-index": "1060" })}" data-v-61f411ea></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (__props.open) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "z-index": "1061", "display": "flex", "align-items": "center", "justify-content": "center", "padding": "16px" })}" data-v-61f411ea><div style="${ssrRenderStyle({ "width": "100%", "max-width": "640px", "border-radius": "22px", "background": "linear-gradient(160deg,#0D1B35,#09122A)", "border": "1px solid rgba(245,158,11,0.2)", "box-shadow": "0 32px 80px rgba(0,0,0,0.75)", "display": "flex", "flex-direction": "column", "max-height": "90vh" })}" data-v-61f411ea><div style="${ssrRenderStyle({ "padding": "22px 26px 16px", "border-bottom": "1px solid rgba(255,255,255,0.07)", "flex-shrink": "0" })}" data-v-61f411ea><div style="${ssrRenderStyle({ "position": "absolute", "top": "0", "left": "15%", "right": "15%", "height": "1px", "background": "linear-gradient(90deg,transparent,rgba(245,158,11,0.5),transparent)", "border-radius": "999px" })}" data-v-61f411ea></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "gap": "12px" })}" data-v-61f411ea><div data-v-61f411ea><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px", "margin-bottom": "4px" })}" data-v-61f411ea><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-61f411ea><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" data-v-61f411ea></path><path d="M16 8H8" data-v-61f411ea></path><path d="M16 12H8" data-v-61f411ea></path><path d="M12 16H8" data-v-61f411ea></path></svg><span style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "700", "color": "#F1F5F9" })}" data-v-61f411ea>Factura Global CFDI 4.0</span></div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.7)" })}" data-v-61f411ea> Receptor: <span style="${ssrRenderStyle({ "color": "#fbbf24", "font-weight": "600", "font-family": "monospace" })}" data-v-61f411ea>XAXX010101000</span><span style="${ssrRenderStyle({ "margin": "0 6px", "opacity": "0.4" })}" data-v-61f411ea>\xB7</span>PUBLICO EN GENERAL </div></div>`);
          if (!unref(result)) {
            _push2(`<button style="${ssrRenderStyle({ "width": "30px", "height": "30px", "border-radius": "8px", "background": "rgba(255,255,255,0.05)", "border": "1px solid rgba(255,255,255,0.1)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "rgba(100,116,139,0.8)" })}" data-v-61f411ea>`);
            _push2(ssrRenderComponent(unref(X), { size: 14 }, null, _parent));
            _push2(`</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
          if (unref(result)) {
            _push2(`<div style="${ssrRenderStyle({ "padding": "32px 26px", "text-align": "center", "display": "flex", "flex-direction": "column", "align-items": "center", "gap": "16px" })}" data-v-61f411ea><div style="${ssrRenderStyle({ "width": "56px", "height": "56px", "border-radius": "16px", "background": "rgba(245,158,11,0.1)", "border": "1px solid rgba(245,158,11,0.25)", "display": "flex", "align-items": "center", "justify-content": "center" })}" data-v-61f411ea>`);
            _push2(ssrRenderComponent(unref(CheckCircle), {
              size: 26,
              color: "#fbbf24"
            }, null, _parent));
            _push2(`</div><div data-v-61f411ea><div style="${ssrRenderStyle({ "font-size": "16px", "font-weight": "700", "color": "#F1F5F9", "margin-bottom": "4px" })}" data-v-61f411ea>Factura Global Timbrada</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.7)" })}" data-v-61f411ea>${ssrInterpolate(unref(result).ordersIncluded)} pedido${ssrInterpolate(unref(result).ordersIncluded !== 1 ? "s" : "")} incluido${ssrInterpolate(unref(result).ordersIncluded !== 1 ? "s" : "")}</div></div><div style="${ssrRenderStyle({ "width": "100%", "border-radius": "14px", "background": "rgba(245,158,11,0.06)", "border": "1px solid rgba(245,158,11,0.15)", "padding": "16px 20px", "text-align": "left", "display": "flex", "flex-direction": "column", "gap": "10px" })}" data-v-61f411ea><!--[-->`);
            ssrRenderList(unref(resultRows), (row) => {
              _push2(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "gap": "12px" })}" data-v-61f411ea><span style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "white-space": "nowrap" })}" data-v-61f411ea>${ssrInterpolate(row.label)}</span><span style="${ssrRenderStyle({ fontSize: "11px", color: "#94a3b8", fontFamily: row.mono ? "monospace" : "inherit", textAlign: "right", wordBreak: "break-all" })}" data-v-61f411ea>${ssrInterpolate(row.value)}</span></div>`);
            });
            _push2(`<!--]--></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "10px" })}" data-v-61f411ea><button${ssrIncludeBooleanAttr(unref(downloading) === "pdf") ? " disabled" : ""} style="${ssrRenderStyle({ height: "40px", padding: "0 20px", borderRadius: "10px", background: unref(downloading) === "pdf" ? "rgba(239,68,68,0.3)" : "linear-gradient(135deg,#ef4444,#dc2626)", border: "none", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: unref(downloading) === "pdf" ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "7px", opacity: unref(downloading) === "pdf" ? 0.7 : 1 })}" data-v-61f411ea>`);
            _push2(ssrRenderComponent(unref(FileDown), { size: 13 }, null, _parent));
            _push2(`${ssrInterpolate(unref(downloading) === "pdf" ? "Descargando\u2026" : "PDF")}</button><button${ssrIncludeBooleanAttr(unref(downloading) === "xml") ? " disabled" : ""} style="${ssrRenderStyle({ height: "40px", padding: "0 20px", borderRadius: "10px", background: unref(downloading) === "xml" ? "rgba(16,185,129,0.3)" : "linear-gradient(135deg,#10b981,#059669)", border: "none", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: unref(downloading) === "xml" ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "7px", opacity: unref(downloading) === "xml" ? 0.7 : 1 })}" data-v-61f411ea>`);
            _push2(ssrRenderComponent(unref(FileDown), { size: 13 }, null, _parent));
            _push2(`${ssrInterpolate(unref(downloading) === "xml" ? "Descargando\u2026" : "XML")}</button><button style="${ssrRenderStyle({ "height": "40px", "padding": "0 20px", "border-radius": "10px", "background": "rgba(255,255,255,0.06)", "border": "1px solid rgba(255,255,255,0.1)", "color": "#94a3b8", "font-size": "13px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit" })}" data-v-61f411ea> Cerrar </button></div></div>`);
          } else {
            _push2(`<!--[--><div style="${ssrRenderStyle({ "overflow-y": "auto", "flex": "1", "min-height": "0", "padding": "20px 26px" })}" data-v-61f411ea><div style="${ssrRenderStyle({ "padding": "14px 16px", "border-radius": "12px", "background": "rgba(245,158,11,0.06)", "border": "1px solid rgba(245,158,11,0.15)", "margin-bottom": "20px", "display": "flex", "align-items": "center", "gap": "12px" })}" data-v-61f411ea><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${ssrRenderStyle({ "flex-shrink": "0" })}" data-v-61f411ea><rect width="8" height="4" x="8" y="2" rx="1" data-v-61f411ea></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" data-v-61f411ea></path></svg><div data-v-61f411ea><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#fbbf24" })}" data-v-61f411ea>${ssrInterpolate(__props.pendingOrders.length)} pedido${ssrInterpolate(__props.pendingOrders.length !== 1 ? "s" : "")} sin facturar individualmente</div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.7)", "margin-top": "2px" })}" data-v-61f411ea>Total: <span style="${ssrRenderStyle({ "color": "#E2E8F0", "font-weight": "600" })}" data-v-61f411ea>${ssrInterpolate(fmtMXN(unref(pendingTotal)))}</span></div></div></div><div style="${ssrRenderStyle({ "margin-bottom": "18px" })}" data-v-61f411ea><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}" data-v-61f411ea>Per\xEDodo</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr 1fr", "gap": "10px" })}" data-v-61f411ea><div data-v-61f411ea><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "5px" })}" data-v-61f411ea>Periodicidad *</div><select${ssrRenderAttrs(sel)} data-v-61f411ea><option value="" data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).periodicidad) ? ssrLooseContain(unref(form).periodicidad, "") : ssrLooseEqual(unref(form).periodicidad, "")) ? " selected" : ""}>Seleccionar\u2026</option><option value="01" data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).periodicidad) ? ssrLooseContain(unref(form).periodicidad, "01") : ssrLooseEqual(unref(form).periodicidad, "01")) ? " selected" : ""}>01 \u2013 Diario</option><option value="02" data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).periodicidad) ? ssrLooseContain(unref(form).periodicidad, "02") : ssrLooseEqual(unref(form).periodicidad, "02")) ? " selected" : ""}>02 \u2013 Semanal</option><option value="03" data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).periodicidad) ? ssrLooseContain(unref(form).periodicidad, "03") : ssrLooseEqual(unref(form).periodicidad, "03")) ? " selected" : ""}>03 \u2013 Quincenal</option><option value="04" data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).periodicidad) ? ssrLooseContain(unref(form).periodicidad, "04") : ssrLooseEqual(unref(form).periodicidad, "04")) ? " selected" : ""}>04 \u2013 Mensual</option><option value="05" data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).periodicidad) ? ssrLooseContain(unref(form).periodicidad, "05") : ssrLooseEqual(unref(form).periodicidad, "05")) ? " selected" : ""}>05 \u2013 Bimestral</option></select></div><div data-v-61f411ea><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "5px" })}" data-v-61f411ea>Mes *</div><select${ssrRenderAttrs(sel)} data-v-61f411ea><option value="" data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).meses) ? ssrLooseContain(unref(form).meses, "") : ssrLooseEqual(unref(form).meses, "")) ? " selected" : ""}>Seleccionar\u2026</option>`);
            if (unref(form).periodicidad !== "05") {
              _push2(`<!--[-->`);
              ssrRenderList(MESES, (m) => {
                _push2(`<option${ssrRenderAttr("value", m.v)} data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).meses) ? ssrLooseContain(unref(form).meses, m.v) : ssrLooseEqual(unref(form).meses, m.v)) ? " selected" : ""}>${ssrInterpolate(m.v)} \u2013 ${ssrInterpolate(m.l)}</option>`);
              });
              _push2(`<!--]-->`);
            } else {
              _push2(`<!--[-->`);
              ssrRenderList(BIMESTRES, (m) => {
                _push2(`<option${ssrRenderAttr("value", m.v)} data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).meses) ? ssrLooseContain(unref(form).meses, m.v) : ssrLooseEqual(unref(form).meses, m.v)) ? " selected" : ""}>${ssrInterpolate(m.v)} \u2013 ${ssrInterpolate(m.l)}</option>`);
              });
              _push2(`<!--]-->`);
            }
            _push2(`</select></div><div data-v-61f411ea><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "5px" })}" data-v-61f411ea>A\xF1o *</div><input${ssrRenderAttrs((_temp0 = mergeProps({
              placeholder: "2025",
              maxlength: "4"
            }, inp), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, unref(form).a\u00F1o))))} data-v-61f411ea></div></div></div><div style="${ssrRenderStyle({ "margin-bottom": "18px" })}" data-v-61f411ea><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}" data-v-61f411ea>Configuraci\xF3n</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "10px", "margin-bottom": "10px" })}" data-v-61f411ea><div data-v-61f411ea><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "5px" })}" data-v-61f411ea>Uso CFDI *</div><select${ssrRenderAttrs(sel)} data-v-61f411ea><option value="" data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).usoCfdi) ? ssrLooseContain(unref(form).usoCfdi, "") : ssrLooseEqual(unref(form).usoCfdi, "")) ? " selected" : ""}>Seleccionar\u2026</option><!--[-->`);
            ssrRenderList(USOS_CFDI, (nombre, clave) => {
              _push2(`<option${ssrRenderAttr("value", clave)} data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).usoCfdi) ? ssrLooseContain(unref(form).usoCfdi, clave) : ssrLooseEqual(unref(form).usoCfdi, clave)) ? " selected" : ""}>${ssrInterpolate(clave)} \u2013 ${ssrInterpolate(nombre)}</option>`);
            });
            _push2(`<!--]--></select></div><div data-v-61f411ea><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "5px" })}" data-v-61f411ea>Moneda</div><select${ssrRenderAttrs(sel)} data-v-61f411ea><option value="MXN" data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).moneda) ? ssrLooseContain(unref(form).moneda, "MXN") : ssrLooseEqual(unref(form).moneda, "MXN")) ? " selected" : ""}>MXN \u2013 Peso mexicano</option><option value="USD" data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).moneda) ? ssrLooseContain(unref(form).moneda, "USD") : ssrLooseEqual(unref(form).moneda, "USD")) ? " selected" : ""}>USD \u2013 D\xF3lar</option></select></div><div data-v-61f411ea><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "5px" })}" data-v-61f411ea>Forma de pago *</div><select${ssrRenderAttrs(sel)} data-v-61f411ea><option value="" data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).formaPago) ? ssrLooseContain(unref(form).formaPago, "") : ssrLooseEqual(unref(form).formaPago, "")) ? " selected" : ""}>Seleccionar\u2026</option><!--[-->`);
            ssrRenderList(FORMAS_PAGO, (f) => {
              _push2(`<option${ssrRenderAttr("value", f.c)} data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).formaPago) ? ssrLooseContain(unref(form).formaPago, f.c) : ssrLooseEqual(unref(form).formaPago, f.c)) ? " selected" : ""}>${ssrInterpolate(f.c)} \u2013 ${ssrInterpolate(f.n)}</option>`);
            });
            _push2(`<!--]--></select></div><div data-v-61f411ea><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "5px" })}" data-v-61f411ea>M\xE9todo de pago *</div><select${ssrRenderAttrs(sel)} data-v-61f411ea><option value="PUE" data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).metodoPago) ? ssrLooseContain(unref(form).metodoPago, "PUE") : ssrLooseEqual(unref(form).metodoPago, "PUE")) ? " selected" : ""}>PUE \u2013 Una sola exhibici\xF3n</option><option value="PPD" data-v-61f411ea${ssrIncludeBooleanAttr(Array.isArray(unref(form).metodoPago) ? ssrLooseContain(unref(form).metodoPago, "PPD") : ssrLooseEqual(unref(form).metodoPago, "PPD")) ? " selected" : ""}>PPD \u2013 Parcialidades o diferido</option></select></div></div></div>`);
            if (unref(error)) {
              _push2(`<div style="${ssrRenderStyle({ "padding": "10px 14px", "border-radius": "10px", "background": "rgba(244,63,94,0.08)", "border": "1px solid rgba(244,63,94,0.2)", "font-size": "12px", "color": "#fb7185" })}" data-v-61f411ea>${ssrInterpolate(unref(error))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div style="${ssrRenderStyle({ "padding": "16px 26px", "border-top": "1px solid rgba(255,255,255,0.07)", "display": "flex", "align-items": "center", "justify-content": "space-between", "flex-shrink": "0" })}" data-v-61f411ea><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.5)" })}" data-v-61f411ea>${ssrInterpolate(__props.pendingOrders.length)} pedido${ssrInterpolate(__props.pendingOrders.length !== 1 ? "s" : "")} \xB7 ${ssrInterpolate(fmtMXN(unref(pendingTotal)))}</div><div style="${ssrRenderStyle({ "display": "flex", "gap": "10px" })}" data-v-61f411ea><button style="${ssrRenderStyle({ "height": "38px", "padding": "0 18px", "border-radius": "9px", "background": "rgba(255,255,255,0.05)", "border": "1px solid rgba(255,255,255,0.1)", "color": "#94a3b8", "font-size": "13px", "cursor": "pointer", "font-family": "inherit" })}" data-v-61f411ea> Cancelar </button><button${ssrIncludeBooleanAttr(unref(loading) || !__props.pendingOrders.length) ? " disabled" : ""} style="${ssrRenderStyle({
              height: "38px",
              padding: "0 22px",
              borderRadius: "9px",
              border: "none",
              fontSize: "13px",
              fontWeight: 700,
              cursor: unref(loading) || !__props.pendingOrders.length ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              opacity: !__props.pendingOrders.length ? 0.4 : 1,
              background: unref(loading) ? "rgba(245,158,11,0.4)" : "linear-gradient(135deg,#F59E0B,#D97706)",
              color: "#000",
              boxShadow: unref(loading) ? "none" : "0 4px 14px rgba(245,158,11,0.3)"
            })}" data-v-61f411ea>`);
            if (unref(loading)) {
              _push2(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin" data-v-61f411ea><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" data-v-61f411ea></path></svg>`);
            } else {
              _push2(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-61f411ea><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" data-v-61f411ea></path><path d="M16 8H8" data-v-61f411ea></path><path d="M16 12H8" data-v-61f411ea></path><path d="M12 16H8" data-v-61f411ea></path></svg>`);
            }
            _push2(` ${ssrInterpolate(unref(loading) ? "Timbrando\u2026" : "Timbrar Factura Global")}</button></div></div><!--]-->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GlobalCfdiModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-61f411ea"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "facturas",
  __ssrInlineRender: true,
  setup(__props) {
    var _a;
    const auth = useAuthStore();
    if (((_a = auth.user) == null ? void 0 : _a.role) !== "admin") navigateTo("/catalog");
    const tab = ref("orders");
    const tabs = [
      { key: "orders", label: "\xD3rdenes" },
      { key: "emitidas", label: "Emitidas" }
    ];
    const orders = ref([]);
    const loadingOrders = ref(true);
    const orderSearch = ref("");
    const orderSearchFocus = ref(false);
    const orderFilter = ref("all");
    const orderFilters = [
      { key: "all", label: "Todos" },
      { key: "ready", label: "Listos para facturar" },
      { key: "no_data", label: "Sin datos fiscales" },
      { key: "no_sync", label: "Sin sincronizar" }
    ];
    function canBill(o) {
      return !o.cfdiUid && !!(o.userFacturaUid && o.userFiscalCompleted && o.userFiscalUsocfdi);
    }
    function billBlockReason(o) {
      if (o.cfdiUid) return "CFDI emitido";
      if (!o.userFiscalCompleted) return "Sin datos fiscales";
      if (!o.userFacturaUid) return "Sin sincronizar";
      if (!o.userFiscalUsocfdi) return "Sin uso CFDI";
      return "";
    }
    function billBadgeLabel(o) {
      if (o.cfdiUid) return "Facturado";
      if (canBill(o)) return "Listo";
      if (o.userFiscalCompleted) return "Sin sincronizar";
      return "Sin datos";
    }
    function billBadgeStyle(o) {
      if (o.cfdiUid) return { fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px", background: "rgba(99,102,241,0.1)", color: "#818cf8" };
      const ready = canBill(o);
      const partial = !ready && o.userFiscalCompleted;
      return {
        fontSize: "10px",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "20px",
        background: ready ? "rgba(16,185,129,0.1)" : partial ? "rgba(245,158,11,0.1)" : "rgba(100,116,139,0.08)",
        color: ready ? "#34d399" : partial ? "#fbbf24" : "rgba(100,116,139,0.5)"
      };
    }
    const listos = computed(() => orders.value.filter(canBill).length);
    const orderKpis = computed(() => [
      { label: "Total pedidos", value: orders.value.length, grad: "linear-gradient(135deg,#0EA5E9,#22D3EE)" },
      { label: "Listos para facturar", value: listos.value, grad: "linear-gradient(135deg,#6366f1,#818cf8)" },
      { label: "Sin datos fiscales", value: orders.value.filter((o) => !o.userFiscalCompleted).length, grad: "linear-gradient(135deg,#F59E0B,#FCD34D)" },
      { label: "Sin sincronizar", value: orders.value.filter((o) => o.userFiscalCompleted && !o.userFacturaUid).length, grad: "linear-gradient(135deg,#F43F5E,#FB7185)" }
    ]);
    const filteredOrders = computed(() => {
      let list = orders.value;
      if (orderFilter.value === "ready") list = list.filter(canBill);
      if (orderFilter.value === "no_data") list = list.filter((o) => !o.userFiscalCompleted);
      if (orderFilter.value === "no_sync") list = list.filter((o) => o.userFiscalCompleted && !o.userFacturaUid);
      const q = orderSearch.value.toLowerCase();
      if (!q) return list;
      return list.filter(
        (o) => {
          var _a2, _b;
          return o.userName.toLowerCase().includes(q) || ((_a2 = o.userFiscalRfc) != null ? _a2 : "").toLowerCase().includes(q) || ((_b = o.syscomFolio) != null ? _b : "").toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
        }
      );
    });
    const syncing = ref(null);
    const cfdis = ref([]);
    const loadingCfdis = ref(false);
    const cfdiError = ref("");
    const cfdiSearch = ref("");
    const cfdiSearchFocus = ref(false);
    async function fetchCfdis() {
      var _a2, _b, _c;
      if (cfdis.value.length > 0) return;
      loadingCfdis.value = true;
      cfdiError.value = "";
      try {
        const data = await $fetch("/api/factura/cfdi", { query: { per_page: 200 } });
        cfdis.value = ((_a2 = data.data) != null ? _a2 : []).filter((c) => {
          var _a3;
          return (_a3 = c.Folio) == null ? void 0 : _a3.toUpperCase().startsWith("S");
        });
      } catch (e) {
        cfdiError.value = (_c = (_b = e == null ? void 0 : e.data) == null ? void 0 : _b.message) != null ? _c : "Error al cargar facturas";
      } finally {
        loadingCfdis.value = false;
      }
    }
    watch(tab, (t) => {
      if (t === "emitidas") fetchCfdis();
    });
    const totalFacturado = computed(() => cfdis.value.reduce((s, c) => {
      var _a2;
      return s + Number((_a2 = c.Total) != null ? _a2 : 0);
    }, 0));
    const thisMonth = computed(() => {
      const now = /* @__PURE__ */ new Date();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const yy = String(now.getFullYear());
      return cfdis.value.filter((c) => {
        var _a2;
        return (_a2 = c.FechaTimbrado) == null ? void 0 : _a2.startsWith(`${yy}-${mm}`);
      }).length;
    });
    const cfdiKpis = computed(() => [
      { label: "Total emitidas", value: cfdis.value.length, grad: "linear-gradient(135deg,#6366f1,#818cf8)" },
      { label: "Total facturado", value: fmtMXN(totalFacturado.value), grad: "linear-gradient(135deg,#0EA5E9,#22D3EE)" },
      { label: "Este mes", value: thisMonth.value, grad: "linear-gradient(135deg,#10b981,#34d399)" }
    ]);
    const filteredCfdis = computed(() => {
      const q = cfdiSearch.value.toLowerCase();
      if (!q) return cfdis.value;
      return cfdis.value.filter(
        (c) => {
          var _a2, _b, _c;
          return ((_a2 = c.RazonSocialReceptor) != null ? _a2 : "").toLowerCase().includes(q) || ((_b = c.Receptor) != null ? _b : "").toLowerCase().includes(q) || ((_c = c.Folio) != null ? _c : "").toLowerCase().includes(q) || c.UUID.toLowerCase().includes(q);
        }
      );
    });
    function cfdiStatusLabel(s) {
      var _a2;
      const map = { enviada: "Enviada", active: "Vigente", vigente: "Vigente", cancelled: "Cancelada", canceled: "Cancelada", cancelada: "Cancelada" };
      return s ? (_a2 = map[s.toLowerCase()]) != null ? _a2 : s : "\u2014";
    }
    function cfdiStatusStyle(s) {
      const ok = ["enviada", "active", "vigente"].includes((s != null ? s : "").toLowerCase());
      return { fontSize: "10px", fontWeight: 600, padding: "2px 9px", borderRadius: "20px", background: ok ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)", color: ok ? "#34d399" : "#fb7185" };
    }
    const downloading = ref(null);
    const downloadError = ref("");
    const cfdiOpen = ref(false);
    const cfdiUser = ref(null);
    const cfdiConceptos = ref([]);
    const cfdiOrderId = ref(void 0);
    function onCfdiCreated() {
      cfdis.value = [];
      if (cfdiOrderId.value) {
        orders.value = orders.value.map(
          (o) => o.id === cfdiOrderId.value ? { ...o, cfdiUid: "__pending__" } : o
        );
      }
    }
    const globalOpen = ref(false);
    const pendingForGlobal = computed(
      () => orders.value.filter((o) => ["approved", "processing", "shipped", "delivered"].includes(o.status) && !o.cfdiUid).map((o) => ({ id: o.id, total: o.total }))
    );
    function onGlobalCreated() {
      cfdis.value = [];
      $fetch("/api/factura/orders").then((data) => {
        orders.value = data.orders;
      }).catch(() => {
      });
    }
    const fmtMXN = (n) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
    const fmtDate = (iso) => {
      if (!iso) return "\u2014";
      const d = new Date(iso);
      return isNaN(d.getTime()) ? iso : d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "2-digit" });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CfdiModal = __nuxt_component_0;
      const _component_GlobalCfdiModal = __nuxt_component_1;
      _push(`<!--[--><div style="${ssrRenderStyle({ fontFamily: `'Inter',system-ui,sans-serif` })}" data-v-06494b75><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "flex-wrap": "wrap", "gap": "12px", "margin-bottom": "20px" })}" data-v-06494b75><div data-v-06494b75><h1 style="${ssrRenderStyle({ "font-size": "22px", "font-weight": "800", "color": "#F1F5F9", "margin": "0" })}" data-v-06494b75>Facturaci\xF3n CFDI 4.0</h1><p style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.85)", "margin-top": "4px" })}" data-v-06494b75>`);
      if (unref(tab) === "orders") {
        _push(`<!--[-->`);
        if (unref(loadingOrders)) {
          _push(`<span data-v-06494b75>Cargando pedidos\u2026</span>`);
        } else {
          _push(`<span data-v-06494b75>${ssrInterpolate(unref(orders).length)} pedido${ssrInterpolate(unref(orders).length !== 1 ? "s" : "")} \xB7 ${ssrInterpolate(unref(listos))} listo${ssrInterpolate(unref(listos) !== 1 ? "s" : "")} para facturar</span>`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        if (unref(loadingCfdis)) {
          _push(`<span data-v-06494b75>Cargando facturas\u2026</span>`);
        } else if (unref(cfdiError)) {
          _push(`<span style="${ssrRenderStyle({ "color": "#fb7185" })}" data-v-06494b75>${ssrInterpolate(unref(cfdiError))}</span>`);
        } else {
          _push(`<span data-v-06494b75>Serie S \xB7 ${ssrInterpolate(unref(cfdis).length)} CFDI${ssrInterpolate(unref(cfdis).length !== 1 ? "s" : "")} emitido${ssrInterpolate(unref(cfdis).length !== 1 ? "s" : "")} `);
          if (unref(totalFacturado) > 0) {
            _push(`<!--[--> \xB7 <span style="${ssrRenderStyle({ "color": "#a5b4fc" })}" data-v-06494b75>${ssrInterpolate(fmtMXN(unref(totalFacturado)))}</span><!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span>`);
        }
        _push(`<!--]-->`);
      }
      _push(`</p></div>`);
      if (unref(tab) === "orders" && !unref(loadingOrders)) {
        _push(`<button${ssrIncludeBooleanAttr(!unref(pendingForGlobal).length) ? " disabled" : ""} style="${ssrRenderStyle({
          height: "40px",
          padding: "0 18px",
          borderRadius: "11px",
          border: "1px solid rgba(245,158,11,0.35)",
          fontSize: "13px",
          fontWeight: 700,
          cursor: !unref(pendingForGlobal).length ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.2s",
          opacity: !unref(pendingForGlobal).length ? 0.4 : 1,
          background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(217,119,6,0.08))",
          color: "#fbbf24",
          boxShadow: unref(pendingForGlobal).length ? "0 4px 16px rgba(245,158,11,0.15)" : "none"
        })}" data-v-06494b75>`);
        _push(ssrRenderComponent(unref(FileText), { size: 14 }, null, _parent));
        _push(` Factura Global `);
        if (unref(pendingForGlobal).length) {
          _push(`<span style="${ssrRenderStyle({ "padding": "1px 7px", "border-radius": "20px", "background": "rgba(245,158,11,0.2)", "font-size": "10px", "font-weight": "700" })}" data-v-06494b75>${ssrInterpolate(unref(pendingForGlobal).length)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div style="${ssrRenderStyle({ "display": "flex", "gap": "4px", "margin-bottom": "20px", "border-radius": "12px", "background": "rgba(255,255,255,0.03)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "4px", "width": "fit-content" })}" data-v-06494b75><!--[-->`);
      ssrRenderList(tabs, (t) => {
        _push(`<button style="${ssrRenderStyle({
          height: "34px",
          padding: "0 18px",
          borderRadius: "9px",
          border: "none",
          fontSize: "12.5px",
          fontWeight: unref(tab) === t.key ? 700 : 500,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.18s",
          background: unref(tab) === t.key ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "transparent",
          color: unref(tab) === t.key ? "#fff" : "rgba(100,116,139,0.8)",
          boxShadow: unref(tab) === t.key ? "0 2px 10px rgba(99,102,241,0.3)" : "none"
        })}" data-v-06494b75>${ssrInterpolate(t.label)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (unref(tab) === "orders") {
        _push(`<!--[--><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(4,1fr)", "gap": "12px", "margin-bottom": "20px" })}" data-v-06494b75><!--[-->`);
        ssrRenderList(unref(orderKpis), (k) => {
          _push(`<div style="${ssrRenderStyle({ "border-radius": "14px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "16px 18px" })}" data-v-06494b75><div style="${ssrRenderStyle({ fontSize: "24px", fontWeight: 800, background: k.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 })}" data-v-06494b75>${ssrInterpolate(unref(loadingOrders) ? "\u2014" : k.value)}</div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.8)", "margin-top": "4px", "font-weight": "500" })}" data-v-06494b75>${ssrInterpolate(k.label)}</div></div>`);
        });
        _push(`<!--]--></div><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "14px 16px", "margin-bottom": "20px", "display": "flex", "flex-direction": "column", "gap": "10px" })}" data-v-06494b75><div style="${ssrRenderStyle({ "position": "relative", "max-width": "360px" })}" data-v-06494b75>`);
        _push(ssrRenderComponent(unref(Search), {
          size: 13,
          style: { "position": "absolute", "left": "12px", "top": "50%", "transform": "translateY(-50%)", "pointer-events": "none" },
          color: unref(orderSearchFocus) ? "#6366f1" : "rgba(100,116,139,0.6)"
        }, null, _parent));
        _push(`<input${ssrRenderAttr("value", unref(orderSearch))} placeholder="Buscar por cliente, RFC o folio SYSCOM\u2026" style="${ssrRenderStyle({ width: "100%", height: "38px", background: unref(orderSearchFocus) ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.04)", border: `1px solid ${unref(orderSearchFocus) ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "9px", paddingLeft: "36px", paddingRight: "12px", fontSize: "12px", color: "#E2E8F0", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "all 0.2s" })}" data-v-06494b75></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "6px", "flex-wrap": "wrap" })}" data-v-06494b75><!--[-->`);
        ssrRenderList(orderFilters, (f) => {
          _push(`<button style="${ssrRenderStyle({
            height: "28px",
            padding: "0 12px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: unref(orderFilter) === f.key ? 600 : 500,
            cursor: "pointer",
            border: "none",
            fontFamily: "inherit",
            background: unref(orderFilter) === f.key ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "rgba(255,255,255,0.05)",
            color: unref(orderFilter) === f.key ? "#fff" : "rgba(100,116,139,0.9)",
            boxShadow: unref(orderFilter) === f.key ? "0 2px 8px rgba(99,102,241,0.25)" : "none"
          })}" data-v-06494b75>${ssrInterpolate(f.label)}</button>`);
        });
        _push(`<!--]--></div></div>`);
        if (unref(loadingOrders)) {
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "3px" })}" data-v-06494b75><!--[-->`);
          ssrRenderList(5, (i) => {
            _push(`<div class="pulse" style="${ssrRenderStyle({ "border-radius": "12px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "height": "72px" })}" data-v-06494b75></div>`);
          });
          _push(`<!--]--></div>`);
        } else if (unref(filteredOrders).length > 0) {
          _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden" })}" data-v-06494b75><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "0.8fr 1.6fr 0.7fr 0.8fr 0.9fr 120px", "gap": "0", "padding": "10px 18px", "border-bottom": "1px solid rgba(255,255,255,0.07)" })}" data-v-06494b75><!--[-->`);
          ssrRenderList(["Pedido", "Cliente", "Art\xEDculos", "Total", "Estado fiscal", "Acci\xF3n"], (h) => {
            _push(`<span style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "text-transform": "uppercase", "letter-spacing": "0.8px" })}" data-v-06494b75>${ssrInterpolate(h)}</span>`);
          });
          _push(`<!--]--></div><!--[-->`);
          ssrRenderList(unref(filteredOrders), (o, idx) => {
            var _a2;
            _push(`<div style="${ssrRenderStyle({ display: "grid", gridTemplateColumns: "0.8fr 1.6fr 0.7fr 0.8fr 0.9fr 120px", gap: 0, padding: "12px 18px", borderBottom: idx < unref(filteredOrders).length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", alignItems: "center" })}" data-v-06494b75><div data-v-06494b75><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#E2E8F0", "font-family": "monospace" })}" data-v-06494b75>${ssrInterpolate(o.id.slice(-6).toUpperCase())}</div><div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,116,139,0.5)", "margin-top": "2px" })}" data-v-06494b75>${ssrInterpolate(fmtDate(o.createdAt))}</div></div><div style="${ssrRenderStyle({ "min-width": "0" })}" data-v-06494b75><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#E2E8F0", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" })}" data-v-06494b75>${ssrInterpolate(o.userName)}</div><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "#38bdf8", "font-family": "monospace", "margin-top": "2px" })}" data-v-06494b75>${ssrInterpolate((_a2 = o.userFiscalRfc) != null ? _a2 : "Sin RFC")}</div></div><div data-v-06494b75><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#E2E8F0" })}" data-v-06494b75>${ssrInterpolate(o.items.length)} art.</div></div><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "700", "color": "#a5b4fc" })}" data-v-06494b75>${ssrInterpolate(fmtMXN(o.total))}</div><div data-v-06494b75><span style="${ssrRenderStyle(billBadgeStyle(o))}" data-v-06494b75>${ssrInterpolate(billBadgeLabel(o))}</span></div><div data-v-06494b75>`);
            if (o.cfdiUid) {
              _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "5px", "font-size": "10px", "font-weight": "600", "color": "#818cf8" })}" data-v-06494b75><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-06494b75><path d="M20 6 9 17l-5-5" data-v-06494b75></path></svg> CFDI emitido </div>`);
            } else if (canBill(o)) {
              _push(`<button style="${ssrRenderStyle({ "height": "32px", "padding": "0 14px", "border-radius": "8px", "background": "linear-gradient(135deg,#6366f1,#4f46e5)", "border": "none", "color": "#fff", "font-size": "11px", "font-weight": "700", "cursor": "pointer", "font-family": "inherit", "display": "flex", "align-items": "center", "gap": "5px", "white-space": "nowrap", "box-shadow": "0 2px 8px rgba(99,102,241,0.3)" })}" data-v-06494b75><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-06494b75><rect width="14" height="17" x="5" y="2" rx="2" data-v-06494b75></rect><path d="M9 7h6M9 11h6M9 15h4" data-v-06494b75></path></svg> Facturar </button>`);
            } else if (o.userFiscalCompleted && !o.userFacturaUid) {
              _push(`<button${ssrIncludeBooleanAttr(unref(syncing) === o.userId) ? " disabled" : ""} style="${ssrRenderStyle({ height: "32px", padding: "0 12px", borderRadius: "8px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8", fontSize: "11px", fontWeight: 600, cursor: unref(syncing) === o.userId ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "5px", opacity: unref(syncing) === o.userId ? 0.6 : 1 })}" data-v-06494b75>`);
              if (unref(syncing) === o.userId) {
                _push(`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin" data-v-06494b75><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" data-v-06494b75></path></svg>`);
              } else {
                _push(`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-06494b75><path d="M21 2v6h-6" data-v-06494b75></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8" data-v-06494b75></path><path d="M3 22v-6h6" data-v-06494b75></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16" data-v-06494b75></path></svg>`);
              }
              _push(` ${ssrInterpolate(unref(syncing) === o.userId ? "Sincronizando\u2026" : "Sincronizar")}</button>`);
            } else {
              _push(`<div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,116,139,0.35)", "line-height": "1.3" })}" data-v-06494b75>${ssrInterpolate(billBlockReason(o))}</div>`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        } else if (!unref(loadingOrders)) {
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "center", "padding": "50px", "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "font-size": "13px", "color": "#94a3b8" })}" data-v-06494b75> No se encontraron pedidos </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!--[--><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(3,1fr)", "gap": "12px", "margin-bottom": "20px" })}" data-v-06494b75><!--[-->`);
        ssrRenderList(unref(cfdiKpis), (k) => {
          _push(`<div style="${ssrRenderStyle({ "border-radius": "14px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "16px 18px" })}" data-v-06494b75><div style="${ssrRenderStyle({ fontSize: "24px", fontWeight: 800, background: k.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 })}" data-v-06494b75>${ssrInterpolate(unref(loadingCfdis) ? "\u2014" : k.value)}</div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.8)", "margin-top": "4px", "font-weight": "500" })}" data-v-06494b75>${ssrInterpolate(k.label)}</div></div>`);
        });
        _push(`<!--]--></div><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "14px 16px", "margin-bottom": "20px" })}" data-v-06494b75><div style="${ssrRenderStyle({ "position": "relative", "max-width": "360px" })}" data-v-06494b75>`);
        _push(ssrRenderComponent(unref(Search), {
          size: 13,
          style: { "position": "absolute", "left": "12px", "top": "50%", "transform": "translateY(-50%)", "pointer-events": "none" },
          color: unref(cfdiSearchFocus) ? "#6366f1" : "rgba(100,116,139,0.6)"
        }, null, _parent));
        _push(`<input${ssrRenderAttr("value", unref(cfdiSearch))} placeholder="Buscar por folio, RFC o nombre\u2026" style="${ssrRenderStyle({ width: "100%", height: "38px", background: unref(cfdiSearchFocus) ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.04)", border: `1px solid ${unref(cfdiSearchFocus) ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: "9px", paddingLeft: "36px", paddingRight: "12px", fontSize: "12px", color: "#E2E8F0", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "all 0.2s" })}" data-v-06494b75></div></div>`);
        if (unref(loadingCfdis)) {
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "3px" })}" data-v-06494b75><!--[-->`);
          ssrRenderList(5, (i) => {
            _push(`<div class="pulse" style="${ssrRenderStyle({ "border-radius": "12px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "height": "64px" })}" data-v-06494b75></div>`);
          });
          _push(`<!--]--></div>`);
        } else if (unref(filteredCfdis).length > 0) {
          _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden" })}" data-v-06494b75><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "0.8fr 2fr 1fr 1fr 0.9fr 90px", "gap": "0", "padding": "10px 18px", "border-bottom": "1px solid rgba(255,255,255,0.07)" })}" data-v-06494b75><!--[-->`);
          ssrRenderList(["Folio", "Cliente", "Fecha", "Total", "Estado", ""], (h) => {
            _push(`<span style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "text-transform": "uppercase", "letter-spacing": "0.8px" })}" data-v-06494b75>${ssrInterpolate(h)}</span>`);
          });
          _push(`<!--]--></div><!--[-->`);
          ssrRenderList(unref(filteredCfdis), (c, idx) => {
            var _a2, _b, _c, _d;
            _push(`<div style="${ssrRenderStyle({ display: "grid", gridTemplateColumns: "0.8fr 2fr 1fr 1fr 0.9fr 90px", gap: 0, padding: "11px 18px", borderBottom: idx < unref(filteredCfdis).length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", alignItems: "center" })}" data-v-06494b75><div data-v-06494b75><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "700", "color": "#E2E8F0", "font-family": "monospace" })}" data-v-06494b75>${ssrInterpolate((_a2 = c.Folio) != null ? _a2 : "\u2014")}</div><div style="${ssrRenderStyle({ "font-size": "9px", "color": "rgba(100,116,139,0.45)", "margin-top": "2px", "font-family": "monospace", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" })}"${ssrRenderAttr("title", c.UUID)} data-v-06494b75>${ssrInterpolate(c.UUID.slice(0, 18))}\u2026</div></div><div style="${ssrRenderStyle({ "min-width": "0" })}" data-v-06494b75><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#E2E8F0", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" })}" data-v-06494b75>${ssrInterpolate((_b = c.RazonSocialReceptor) != null ? _b : "\u2014")}</div><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "#38bdf8", "font-family": "monospace", "margin-top": "2px" })}" data-v-06494b75>${ssrInterpolate((_c = c.Receptor) != null ? _c : "")}</div></div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(148,163,184,0.8)" })}" data-v-06494b75>${ssrInterpolate(fmtDate(c.FechaTimbrado))}</div><div data-v-06494b75><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#a5b4fc" })}" data-v-06494b75>${ssrInterpolate(fmtMXN(Number((_d = c.Total) != null ? _d : 0)))}</div><div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,116,139,0.5)" })}" data-v-06494b75>MXN</div></div><div data-v-06494b75><span style="${ssrRenderStyle(cfdiStatusStyle(c.Status))}" data-v-06494b75>${ssrInterpolate(cfdiStatusLabel(c.Status))}</span></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "6px", "justify-content": "flex-end" })}" data-v-06494b75><button${ssrIncludeBooleanAttr(unref(downloading) === c.UID + "-pdf") ? " disabled" : ""} title="PDF" style="${ssrRenderStyle({ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", cursor: unref(downloading) === c.UID + "-pdf" ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: unref(downloading) === c.UID + "-pdf" ? 0.5 : 1 })}" data-v-06494b75>`);
            if (unref(downloading) === c.UID + "-pdf") {
              _push(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin" data-v-06494b75><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" data-v-06494b75></path></svg>`);
            } else {
              _push(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-06494b75><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-v-06494b75></path><polyline points="7 10 12 15 17 10" data-v-06494b75></polyline><line x1="12" y1="15" x2="12" y2="3" data-v-06494b75></line></svg>`);
            }
            _push(`</button><button${ssrIncludeBooleanAttr(unref(downloading) === c.UID + "-xml") ? " disabled" : ""} title="XML" style="${ssrRenderStyle({ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", cursor: unref(downloading) === c.UID + "-xml" ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: unref(downloading) === c.UID + "-xml" ? 0.5 : 1 })}" data-v-06494b75>`);
            if (unref(downloading) === c.UID + "-xml") {
              _push(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin" data-v-06494b75><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" data-v-06494b75></path></svg>`);
            } else {
              _push(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-06494b75><polyline points="16 18 22 12 16 6" data-v-06494b75></polyline><polyline points="8 6 2 12 8 18" data-v-06494b75></polyline></svg>`);
            }
            _push(`</button></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else if (!unref(loadingCfdis) && !unref(cfdiError)) {
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", "padding": "60px 20px", "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "gap": "12px", "text-align": "center" })}" data-v-06494b75><div style="${ssrRenderStyle({ "width": "48px", "height": "48px", "border-radius": "14px", "background": "rgba(99,102,241,0.08)", "border": "1px solid rgba(99,102,241,0.15)", "display": "flex", "align-items": "center", "justify-content": "center" })}" data-v-06494b75><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-06494b75><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" data-v-06494b75></path><path d="M16 8H8" data-v-06494b75></path><path d="M16 12H8" data-v-06494b75></path><path d="M12 16H8" data-v-06494b75></path></svg></div><div style="${ssrRenderStyle({ "font-size": "14px", "font-weight": "600", "color": "#94a3b8" })}" data-v-06494b75>No hay CFDIs serie S emitidos</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.6)" })}" data-v-06494b75>Ve a la pesta\xF1a &quot;Pedidos&quot; para facturar a un cliente</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      if (unref(downloadError)) {
        _push(`<div style="${ssrRenderStyle({ "position": "fixed", "bottom": "24px", "right": "24px", "padding": "12px 18px", "border-radius": "10px", "background": "#1e0a0f", "border": "1px solid rgba(244,63,94,0.3)", "font-size": "12px", "color": "#fb7185", "z-index": "2000", "display": "flex", "align-items": "center", "gap": "10px", "box-shadow": "0 8px 30px rgba(0,0,0,0.5)" })}" data-v-06494b75>${ssrInterpolate(unref(downloadError))} <button style="${ssrRenderStyle({ "background": "none", "border": "none", "color": "#fb7185", "cursor": "pointer", "padding": "0", "font-size": "16px", "line-height": "1" })}" data-v-06494b75>\xD7</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(cfdiUser)) {
        _push(ssrRenderComponent(_component_CfdiModal, {
          user: unref(cfdiUser),
          open: unref(cfdiOpen),
          "initial-conceptos": unref(cfdiConceptos),
          "order-id": unref(cfdiOrderId),
          onClose: ($event) => {
            cfdiOpen.value = false;
            cfdiUser.value = null;
          },
          onCreated: onCfdiCreated
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_GlobalCfdiModal, {
        open: unref(globalOpen),
        "pending-orders": unref(pendingForGlobal),
        onClose: ($event) => globalOpen.value = false,
        onCreated: onGlobalCreated
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/facturas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const facturas = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-06494b75"]]);

export { facturas as default };
//# sourceMappingURL=facturas-CE__FxlB.mjs.map
