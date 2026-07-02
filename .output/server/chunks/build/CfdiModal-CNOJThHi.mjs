import { defineComponent, ref, watch, computed, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderAttrs, ssrGetDynamicModelProps, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { X, CheckCircle, FileDown, Plus, FileCheck } from '@lucide/vue';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CfdiModal",
  __ssrInlineRender: true,
  props: {
    user: {},
    open: { type: Boolean },
    initialConceptos: {},
    orderId: {}
  },
  emits: ["close", "created"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    let _nextId = 1;
    const makeRow = () => ({
      _id: _nextId++,
      descripcion: "",
      claveProdServ: "43211500",
      claveUnidad: "H87",
      unidad: "Pieza",
      cantidad: 1,
      valorUnitario: 0
    });
    const conceptos = ref([makeRow()]);
    const formaPago = ref("03");
    const metodoPago = ref("PUE");
    const moneda = ref("MXN");
    const comentarios = ref("");
    const enviarCorreo = ref(true);
    const loading = ref(false);
    const error = ref("");
    const result = ref(null);
    const downloading = ref(null);
    watch(() => props.open, (open) => {
      var _a;
      if (open) {
        conceptos.value = ((_a = props.initialConceptos) == null ? void 0 : _a.length) ? props.initialConceptos.map((c) => ({ ...c, _id: _nextId++ })) : [makeRow()];
        formaPago.value = "03";
        metodoPago.value = "PUE";
        moneda.value = "MXN";
        comentarios.value = props.orderId ? `Pedido ${props.orderId}` : "";
        enviarCorreo.value = true;
        error.value = "";
        result.value = null;
      }
    });
    const subtotal = computed(
      () => conceptos.value.reduce((s, c) => s + (c.cantidad || 0) * (c.valorUnitario || 0), 0)
    );
    const totalIva = computed(() => subtotal.value * 0.16);
    const total = computed(() => subtotal.value + totalIva.value);
    const fmtCurrency = (n) => n.toLocaleString("es-MX", { style: "currency", currency: moneda.value === "USD" ? "USD" : "MXN" });
    const formatFecha = (iso) => new Date(iso).toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short" });
    const resultRows = computed(() => result.value ? [
      { label: "UUID SAT", value: result.value.UUID, mono: true },
      { label: "Serie / Folio", value: `${result.value.INV.Serie}-${result.value.INV.Folio}`, mono: false },
      { label: "Fecha de timbrado", value: formatFecha(result.value.SAT.FechaTimbrado), mono: false },
      { label: "UID Factura.com", value: result.value.uid, mono: true }
    ] : []);
    const inputStyle = {
      style: "width:100%;height:30px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:7px;padding:0 8px;font-size:11px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;"
    };
    const selectStyle = {
      style: "width:100%;height:34px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:8px;padding:0 10px;font-size:12px;color:#E2E8F0;outline:none;font-family:inherit;box-sizing:border-box;cursor:pointer;"
    };
    const FORMAS_PAGO = [
      { clave: "01", nombre: "Efectivo" },
      { clave: "02", nombre: "Cheque nominativo" },
      { clave: "03", nombre: "Transferencia electr\xF3nica" },
      { clave: "04", nombre: "Tarjeta de cr\xE9dito" },
      { clave: "05", nombre: "Monedero electr\xF3nico" },
      { clave: "06", nombre: "Dinero electr\xF3nico" },
      { clave: "28", nombre: "Tarjeta de d\xE9bito" },
      { clave: "29", nombre: "Tarjeta de servicios" },
      { clave: "99", nombre: "Por definir" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0, _temp1, _temp2, _temp3, _temp4, _temp5;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "background": "rgba(2,6,14,0.82)", "backdrop-filter": "blur(6px)", "z-index": "1060" })}" data-v-62eba563></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (__props.open) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "z-index": "1061", "display": "flex", "align-items": "center", "justify-content": "center", "padding": "16px" })}" data-v-62eba563><div style="${ssrRenderStyle({ "width": "100%", "max-width": "860px", "max-height": "92vh", "display": "flex", "flex-direction": "column" })}" data-v-62eba563><div style="${ssrRenderStyle({ "position": "relative", "flex": "1", "min-height": "0", "display": "flex", "flex-direction": "column" })}" data-v-62eba563><div style="${ssrRenderStyle({ "position": "absolute", "inset": "-1px", "border-radius": "22px", "background": "linear-gradient(135deg,rgba(99,102,241,0.4),rgba(14,165,233,0.2))", "z-index": "0", "pointer-events": "none" })}" data-v-62eba563></div><div style="${ssrRenderStyle({ "position": "relative", "z-index": "1", "border-radius": "22px", "background": "linear-gradient(160deg,#0D1B35,#09122A)", "box-shadow": "0 32px 80px rgba(0,0,0,0.75)", "display": "flex", "flex-direction": "column", "max-height": "92vh" })}" data-v-62eba563><div style="${ssrRenderStyle({ "padding": "22px 26px 16px", "flex-shrink": "0", "border-bottom": "1px solid rgba(255,255,255,0.07)" })}" data-v-62eba563><div style="${ssrRenderStyle({ "position": "absolute", "top": "0", "left": "15%", "right": "15%", "height": "1px", "background": "linear-gradient(90deg,transparent,rgba(99,102,241,0.6),transparent)", "border-radius": "999px" })}" data-v-62eba563></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "gap": "12px" })}" data-v-62eba563><div data-v-62eba563><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px", "margin-bottom": "4px" })}" data-v-62eba563><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-62eba563><rect width="14" height="17" x="5" y="2" rx="2" data-v-62eba563></rect><path d="M9 7h6M9 11h6M9 15h4" data-v-62eba563></path></svg><span style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "700", "color": "#F1F5F9" })}" data-v-62eba563>Generar CFDI 4.0</span></div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.75)" })}" data-v-62eba563><span style="${ssrRenderStyle({ "font-weight": "600", "color": "#a5b4fc" })}" data-v-62eba563>${ssrInterpolate(__props.user.fiscalRfc)}</span><span style="${ssrRenderStyle({ "margin": "0 6px", "opacity": "0.4" })}" data-v-62eba563>\xB7</span> ${ssrInterpolate(__props.user.fiscalRazonSocial)} <span style="${ssrRenderStyle({ "margin": "0 6px", "opacity": "0.4" })}" data-v-62eba563>\xB7</span> Uso CFDI: <span style="${ssrRenderStyle({ "font-weight": "600" })}" data-v-62eba563>${ssrInterpolate(__props.user.fiscalUsocfdi)}</span></div></div>`);
          if (!unref(result)) {
            _push2(`<button style="${ssrRenderStyle({ "width": "30px", "height": "30px", "border-radius": "8px", "background": "rgba(255,255,255,0.05)", "border": "1px solid rgba(255,255,255,0.1)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "rgba(100,116,139,0.8)", "flex-shrink": "0" })}" data-v-62eba563>`);
            _push2(ssrRenderComponent(unref(X), { size: 14 }, null, _parent));
            _push2(`</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
          if (unref(result)) {
            _push2(`<div style="${ssrRenderStyle({ "padding": "32px 26px", "text-align": "center", "flex": "1", "display": "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", "gap": "16px" })}" data-v-62eba563><div style="${ssrRenderStyle({ "width": "56px", "height": "56px", "border-radius": "16px", "background": "rgba(16,185,129,0.12)", "border": "1px solid rgba(16,185,129,0.25)", "display": "flex", "align-items": "center", "justify-content": "center" })}" data-v-62eba563>`);
            _push2(ssrRenderComponent(unref(CheckCircle), {
              size: 26,
              color: "#34d399"
            }, null, _parent));
            _push2(`</div><div data-v-62eba563><div style="${ssrRenderStyle({ "font-size": "16px", "font-weight": "700", "color": "#F1F5F9", "margin-bottom": "4px" })}" data-v-62eba563>CFDI Timbrado exitosamente</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.7)" })}" data-v-62eba563>El comprobante fue sellado por el SAT</div></div><div style="${ssrRenderStyle({ "width": "100%", "max-width": "520px", "border-radius": "14px", "background": "rgba(16,185,129,0.06)", "border": "1px solid rgba(16,185,129,0.15)", "padding": "16px 20px", "text-align": "left", "display": "flex", "flex-direction": "column", "gap": "10px" })}" data-v-62eba563><!--[-->`);
            ssrRenderList(unref(resultRows), (row) => {
              _push2(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "gap": "12px" })}" data-v-62eba563><span style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "white-space": "nowrap" })}" data-v-62eba563>${ssrInterpolate(row.label)}</span><span style="${ssrRenderStyle({ fontSize: "11px", color: "#94a3b8", fontFamily: row.mono ? "monospace" : "inherit", textAlign: "right", wordBreak: "break-all" })}" data-v-62eba563>${ssrInterpolate(row.value)}</span></div>`);
            });
            _push2(`<!--]--></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "10px", "flex-wrap": "wrap", "justify-content": "center" })}" data-v-62eba563><button${ssrIncludeBooleanAttr(unref(downloading) === "pdf") ? " disabled" : ""} style="${ssrRenderStyle({ height: "40px", padding: "0 20px", borderRadius: "10px", background: unref(downloading) === "pdf" ? "rgba(239,68,68,0.3)" : "linear-gradient(135deg,#ef4444,#dc2626)", border: "none", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: unref(downloading) === "pdf" ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "7px", opacity: unref(downloading) === "pdf" ? 0.7 : 1 })}" data-v-62eba563>`);
            if (unref(downloading) === "pdf") {
              _push2(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin" data-v-62eba563><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" data-v-62eba563></path></svg>`);
            } else {
              _push2(ssrRenderComponent(unref(FileDown), { size: 13 }, null, _parent));
            }
            _push2(` ${ssrInterpolate(unref(downloading) === "pdf" ? "Descargando\u2026" : "Descargar PDF")}</button><button${ssrIncludeBooleanAttr(unref(downloading) === "xml") ? " disabled" : ""} style="${ssrRenderStyle({ height: "40px", padding: "0 20px", borderRadius: "10px", background: unref(downloading) === "xml" ? "rgba(16,185,129,0.3)" : "linear-gradient(135deg,#10b981,#059669)", border: "none", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: unref(downloading) === "xml" ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "7px", opacity: unref(downloading) === "xml" ? 0.7 : 1 })}" data-v-62eba563>`);
            if (unref(downloading) === "xml") {
              _push2(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin" data-v-62eba563><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" data-v-62eba563></path></svg>`);
            } else {
              _push2(ssrRenderComponent(unref(FileDown), { size: 13 }, null, _parent));
            }
            _push2(` ${ssrInterpolate(unref(downloading) === "xml" ? "Descargando\u2026" : "Descargar XML")}</button><button style="${ssrRenderStyle({ "height": "40px", "padding": "0 20px", "border-radius": "10px", "background": "rgba(255,255,255,0.06)", "border": "1px solid rgba(255,255,255,0.1)", "color": "#94a3b8", "font-size": "13px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit" })}" data-v-62eba563> Cerrar </button></div></div>`);
          } else {
            _push2(`<!--[--><div style="${ssrRenderStyle({ "overflow-y": "auto", "flex": "1", "min-height": "0", "padding": "20px 26px" })}" data-v-62eba563><div style="${ssrRenderStyle({ "margin-bottom": "20px" })}" data-v-62eba563><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}" data-v-62eba563>Conceptos</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1.8fr 0.9fr 0.6fr 0.7fr 0.65fr 0.9fr 28px", "gap": "6px", "padding": "0 2px 6px", "border-bottom": "1px solid rgba(255,255,255,0.06)" })}" data-v-62eba563><!--[-->`);
            ssrRenderList(["Descripci\xF3n", "Clave SAT", "Cl. Und.", "Unidad", "Cant.", "P. Unit. (s/IVA)", ""], (h) => {
              _push2(`<span style="${ssrRenderStyle({ "font-size": "9px", "font-weight": "600", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "0.7px" })}" data-v-62eba563>${ssrInterpolate(h)}</span>`);
            });
            _push2(`<!--]--></div><!--[-->`);
            ssrRenderList(unref(conceptos), (c, i) => {
              _push2(`<div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1.8fr 0.9fr 0.6fr 0.7fr 0.65fr 0.9fr 28px", "gap": "6px", "padding": "6px 2px", "border-bottom": "1px solid rgba(255,255,255,0.04)", "align-items": "center" })}" data-v-62eba563><input${ssrRenderAttrs((_temp0 = mergeProps({ placeholder: "Descripci\xF3n del producto" }, { ref_for: true }, inputStyle), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, c.descripcion))))} data-v-62eba563><input${ssrRenderAttrs((_temp1 = mergeProps({ placeholder: "43211500" }, { ref_for: true }, inputStyle), mergeProps(_temp1, ssrGetDynamicModelProps(_temp1, c.claveProdServ))))} data-v-62eba563><input${ssrRenderAttrs((_temp2 = mergeProps({ placeholder: "H87" }, { ref_for: true }, inputStyle), mergeProps(_temp2, ssrGetDynamicModelProps(_temp2, c.claveUnidad))))} data-v-62eba563><input${ssrRenderAttrs((_temp3 = mergeProps({ placeholder: "Pieza" }, { ref_for: true }, inputStyle), mergeProps(_temp3, ssrGetDynamicModelProps(_temp3, c.unidad))))} data-v-62eba563><input${ssrRenderAttrs((_temp4 = mergeProps({
                value: c.cantidad,
                type: "number",
                min: "0.000001",
                step: "1",
                placeholder: "1"
              }, { ref_for: true }, inputStyle, { style: { "text-align": "right" } }), mergeProps(_temp4, ssrGetDynamicModelProps(_temp4, c.cantidad))))} data-v-62eba563><input${ssrRenderAttrs((_temp5 = mergeProps({
                value: c.valorUnitario,
                type: "number",
                min: "0.000001",
                step: "0.01",
                placeholder: "0.00"
              }, { ref_for: true }, inputStyle, { style: { "text-align": "right" } }), mergeProps(_temp5, ssrGetDynamicModelProps(_temp5, c.valorUnitario))))} data-v-62eba563><button${ssrIncludeBooleanAttr(unref(conceptos).length === 1) ? " disabled" : ""} style="${ssrRenderStyle([{ "width": "28px", "height": "28px", "border-radius": "7px", "background": "rgba(244,63,94,0.08)", "border": "1px solid rgba(244,63,94,0.15)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "#f87171" }, unref(conceptos).length === 1 ? "opacity:0.3;cursor:not-allowed" : ""])}" data-v-62eba563>`);
              _push2(ssrRenderComponent(unref(X), { size: 11 }, null, _parent));
              _push2(`</button></div>`);
            });
            _push2(`<!--]--><button style="${ssrRenderStyle({ "margin-top": "10px", "height": "32px", "padding": "0 14px", "border-radius": "8px", "background": "rgba(99,102,241,0.08)", "border": "1px solid rgba(99,102,241,0.2)", "color": "#818cf8", "font-size": "12px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit", "display": "flex", "align-items": "center", "gap": "6px" })}" data-v-62eba563>`);
            _push2(ssrRenderComponent(unref(Plus), { size: 12 }, null, _parent));
            _push2(` Agregar concepto </button></div><div style="${ssrRenderStyle({ "margin-bottom": "20px" })}" data-v-62eba563><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}" data-v-62eba563>Configuraci\xF3n</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr 1fr", "gap": "12px", "margin-bottom": "12px" })}" data-v-62eba563><div data-v-62eba563><label style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "text-transform": "uppercase", "letter-spacing": "0.7px", "display": "block", "margin-bottom": "6px" })}" data-v-62eba563>Forma de pago</label><select${ssrRenderAttrs(selectStyle)} data-v-62eba563><option value="" data-v-62eba563${ssrIncludeBooleanAttr(Array.isArray(unref(formaPago)) ? ssrLooseContain(unref(formaPago), "") : ssrLooseEqual(unref(formaPago), "")) ? " selected" : ""}>Seleccionar...</option><!--[-->`);
            ssrRenderList(FORMAS_PAGO, (f) => {
              _push2(`<option${ssrRenderAttr("value", f.clave)} data-v-62eba563${ssrIncludeBooleanAttr(Array.isArray(unref(formaPago)) ? ssrLooseContain(unref(formaPago), f.clave) : ssrLooseEqual(unref(formaPago), f.clave)) ? " selected" : ""}>${ssrInterpolate(f.clave)} \u2014 ${ssrInterpolate(f.nombre)}</option>`);
            });
            _push2(`<!--]--></select></div><div data-v-62eba563><label style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "text-transform": "uppercase", "letter-spacing": "0.7px", "display": "block", "margin-bottom": "6px" })}" data-v-62eba563>M\xE9todo de pago</label><select${ssrRenderAttrs(selectStyle)} data-v-62eba563><option value="PUE" data-v-62eba563${ssrIncludeBooleanAttr(Array.isArray(unref(metodoPago)) ? ssrLooseContain(unref(metodoPago), "PUE") : ssrLooseEqual(unref(metodoPago), "PUE")) ? " selected" : ""}>PUE \u2014 Pago en una sola exhibici\xF3n</option><option value="PPD" data-v-62eba563${ssrIncludeBooleanAttr(Array.isArray(unref(metodoPago)) ? ssrLooseContain(unref(metodoPago), "PPD") : ssrLooseEqual(unref(metodoPago), "PPD")) ? " selected" : ""}>PPD \u2014 Pago en parcialidades o diferido</option></select></div><div data-v-62eba563><label style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "text-transform": "uppercase", "letter-spacing": "0.7px", "display": "block", "margin-bottom": "6px" })}" data-v-62eba563>Moneda</label><select${ssrRenderAttrs(selectStyle)} data-v-62eba563><option value="MXN" data-v-62eba563${ssrIncludeBooleanAttr(Array.isArray(unref(moneda)) ? ssrLooseContain(unref(moneda), "MXN") : ssrLooseEqual(unref(moneda), "MXN")) ? " selected" : ""}>MXN \u2014 Peso mexicano</option><option value="USD" data-v-62eba563${ssrIncludeBooleanAttr(Array.isArray(unref(moneda)) ? ssrLooseContain(unref(moneda), "USD") : ssrLooseEqual(unref(moneda), "USD")) ? " selected" : ""}>USD \u2014 D\xF3lar estadounidense</option></select></div></div><div data-v-62eba563><label style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "text-transform": "uppercase", "letter-spacing": "0.7px", "display": "block", "margin-bottom": "6px" })}" data-v-62eba563>Comentarios (opcional)</label><textarea placeholder="Observaciones o referencia interna..." style="${ssrRenderStyle({ width: "100%", minHeight: "60px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "8px", padding: "9px 12px", fontSize: "12px", color: "#E2E8F0", outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" })}" data-v-62eba563>${ssrInterpolate(unref(comentarios))}</textarea></div><label style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "10px", "cursor": "pointer", "margin-top": "10px", "width": "fit-content" })}" data-v-62eba563><div style="${ssrRenderStyle({ width: "36px", height: "20px", borderRadius: "999px", background: unref(enviarCorreo) ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "rgba(255,255,255,0.08)", border: `1px solid ${unref(enviarCorreo) ? "transparent" : "rgba(255,255,255,0.12)"}`, position: "relative", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 })}" data-v-62eba563><div style="${ssrRenderStyle({ position: "absolute", top: "2px", left: unref(enviarCorreo) ? "17px" : "2px", width: "14px", height: "14px", borderRadius: "50%", background: "white", transition: "left 0.2s" })}" data-v-62eba563></div></div><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(148,163,184,0.85)", "font-weight": "500" })}" data-v-62eba563>Enviar CFDI por correo al receptor</span></label></div><div style="${ssrRenderStyle({ "border-radius": "12px", "background": "rgba(99,102,241,0.05)", "border": "1px solid rgba(99,102,241,0.12)", "padding": "14px 18px" })}" data-v-62eba563><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr 1fr", "gap": "0", "text-align": "center" })}" data-v-62eba563><div style="${ssrRenderStyle({ "border-right": "1px solid rgba(255,255,255,0.07)", "padding-right": "16px" })}" data-v-62eba563><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "4px" })}" data-v-62eba563>Subtotal</div><div style="${ssrRenderStyle({ "font-size": "18px", "font-weight": "700", "color": "#E2E8F0" })}" data-v-62eba563>${ssrInterpolate(fmtCurrency(unref(subtotal)))}</div></div><div style="${ssrRenderStyle({ "border-right": "1px solid rgba(255,255,255,0.07)", "padding": "0 16px" })}" data-v-62eba563><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "4px" })}" data-v-62eba563>IVA 16%</div><div style="${ssrRenderStyle({ "font-size": "18px", "font-weight": "700", "color": "#94a3b8" })}" data-v-62eba563>${ssrInterpolate(fmtCurrency(unref(totalIva)))}</div></div><div style="${ssrRenderStyle({ "padding-left": "16px" })}" data-v-62eba563><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(99,102,241,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "4px" })}" data-v-62eba563>Total</div><div style="${ssrRenderStyle({ "font-size": "18px", "font-weight": "700", "background": "linear-gradient(135deg,#818cf8,#a5b4fc)", "-webkit-background-clip": "text", "-webkit-text-fill-color": "transparent", "background-clip": "text" })}" data-v-62eba563>${ssrInterpolate(fmtCurrency(unref(total)))}</div></div></div></div>`);
            if (unref(error)) {
              _push2(`<div style="${ssrRenderStyle({ "margin-top": "14px", "padding": "10px 14px", "border-radius": "10px", "background": "rgba(244,63,94,0.08)", "border": "1px solid rgba(244,63,94,0.2)", "font-size": "12px", "color": "#fb7185" })}" data-v-62eba563>${ssrInterpolate(unref(error))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div style="${ssrRenderStyle({ "padding": "16px 26px", "border-top": "1px solid rgba(255,255,255,0.07)", "display": "flex", "align-items": "center", "justify-content": "space-between", "flex-shrink": "0" })}" data-v-62eba563><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.5)" })}" data-v-62eba563>${ssrInterpolate(unref(conceptos).length)} concepto${ssrInterpolate(unref(conceptos).length !== 1 ? "s" : "")}</div><div style="${ssrRenderStyle({ "display": "flex", "gap": "10px" })}" data-v-62eba563><button style="${ssrRenderStyle({ "height": "38px", "padding": "0 18px", "border-radius": "9px", "background": "rgba(255,255,255,0.05)", "border": "1px solid rgba(255,255,255,0.1)", "color": "#94a3b8", "font-size": "13px", "font-weight": "500", "cursor": "pointer", "font-family": "inherit" })}" data-v-62eba563> Cancelar </button><button${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} style="${ssrRenderStyle({ height: "38px", padding: "0 22px", borderRadius: "9px", background: unref(loading) ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: unref(loading) ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "7px", opacity: unref(loading) ? 0.8 : 1 })}" data-v-62eba563>`);
            if (unref(loading)) {
              _push2(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin" data-v-62eba563><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" data-v-62eba563></path></svg>`);
            } else {
              _push2(ssrRenderComponent(unref(FileCheck), { size: 13 }, null, _parent));
            }
            _push2(` ${ssrInterpolate(unref(loading) ? "Timbrando CFDI\u2026" : "Timbrar CFDI")}</button></div></div><!--]-->`);
          }
          _push2(`</div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CfdiModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-62eba563"]]);

export { __nuxt_component_0 as _ };
//# sourceMappingURL=CfdiModal-CNOJThHi.mjs.map
