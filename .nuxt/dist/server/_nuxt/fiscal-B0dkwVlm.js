import { defineComponent, mergeProps, useSSRContext, ref, computed, unref } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as __nuxt_component_0 } from "./CfdiModal-CNOJThHi.js";
import { Search, ChevronRight, Pencil, X, AlertTriangle } from "@lucide/vue";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/hookable/dist/index.mjs";
import { u as useAuthStore } from "./auth-De5_qdGe.js";
import { n as navigateTo } from "../server.mjs";
import "pinia";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/unctx/dist/index.mjs";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/h3/dist/index.mjs";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/ufo/dist/index.mjs";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/klona/dist/index.mjs";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DetailField",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    full: { type: Boolean },
    mono: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        style: { gridColumn: __props.full ? "1/-1" : void 0 }
      }, _attrs))}><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "500", "color": "rgba(100,116,139,0.6)", "margin-bottom": "4px", "text-transform": "uppercase", "letter-spacing": "0.6px" })}">${ssrInterpolate(__props.label)}</div>`);
      if (__props.value) {
        _push(`<div style="${ssrRenderStyle({ fontSize: "13px", fontWeight: 500, color: "#CBD5E1", fontFamily: __props.mono ? "monospace" : "inherit", wordBreak: "break-word" })}">${ssrInterpolate(__props.value)}</div>`);
      } else {
        _push(`<div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.35)" })}">—</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DetailField.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "fiscal",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    if (auth.user?.role !== "admin") navigateTo("/catalog");
    const users = ref([]);
    const loading = ref(true);
    const apiError = ref("");
    const search = ref("");
    const statusFilter = ref("all");
    const searchFocus = ref(false);
    const hoveredRow = ref(null);
    const statusFilters = [
      { key: "all", label: "Todos" },
      { key: "complete", label: "Completos" },
      { key: "pending", label: "Pendientes" }
    ];
    const filtered = computed(() => users.value.filter((u) => {
      if (statusFilter.value === "complete" && !u.fiscalCompleted) return false;
      if (statusFilter.value === "pending" && u.fiscalCompleted) return false;
      const q = search.value.toLowerCase();
      return !q || u.name.toLowerCase().includes(q) || (u.fiscalRfc ?? "").toLowerCase().includes(q) || (u.fiscalRazonSocial ?? "").toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }));
    const kpis = computed(() => [
      { label: "Total usuarios", value: users.value.length, grad: "linear-gradient(135deg,#0EA5E9,#22D3EE)" },
      { label: "Datos completos", value: users.value.filter((u) => u.fiscalCompleted).length, grad: "linear-gradient(135deg,#10B981,#34D399)" },
      { label: "Datos pendientes", value: users.value.filter((u) => !u.fiscalCompleted).length, grad: "linear-gradient(135deg,#F59E0B,#FCD34D)" },
      { label: "% completado", value: users.value.length ? `${Math.round(users.value.filter((u) => u.fiscalCompleted).length / users.value.length * 100)}%` : "—", grad: "linear-gradient(135deg,#7C3AED,#A78BFA)" }
    ]);
    const headers = ["Usuario", "RFC", "Razón Social", "Régimen", "Estado fiscal", "Factura.com", ""];
    const detail = ref(null);
    const syncing = ref(null);
    const syncError = ref("");
    const editing = ref(false);
    const editForm = ref({});
    const editSaving = ref(false);
    const editError = ref("");
    const domicilioFields = [
      { key: "calle", label: "Calle", placeholder: "Av. Principal" },
      { key: "numeroExterior", label: "Número exterior", placeholder: "123" },
      { key: "numeroInterior", label: "Número interior", placeholder: "A" },
      { key: "colonia", label: "Colonia", placeholder: "Centro" },
      { key: "ciudad", label: "Ciudad", placeholder: "Chihuahua" },
      { key: "delegacion", label: "Delegación / Municipio", placeholder: "Municipio" },
      { key: "localidad", label: "Localidad", placeholder: "Localidad" },
      { key: "estado", label: "Estado", placeholder: "CHIH" }
    ];
    const contactoFields = [
      { key: "nombre", label: "Nombre", placeholder: "Juan" },
      { key: "apellidos", label: "Apellidos", placeholder: "Pérez García" },
      { key: "telefono", label: "Teléfono", placeholder: "6141234567" },
      { key: "numregidtrib", label: "Núm. Reg. ID Tributario", placeholder: "" }
    ];
    const cfdiOpen = ref(false);
    const cfdiUser = ref(null);
    function onCfdiCreated() {
    }
    const palette = [["#0EA5E9", "#22D3EE"], ["#7C3AED", "#A78BFA"], ["#10B981", "#34D399"], ["#F59E0B", "#FCD34D"], ["#F43F5E", "#FB7185"], ["#6366F1", "#818CF8"]];
    const avatarGrad = (name) => palette[name.charCodeAt(0) % palette.length];
    const REGIMENES = {
      "601": "General de Ley Personas Morales",
      "603": "Personas Morales con Fines no Lucrativos",
      "605": "Sueldos y Salarios",
      "606": "Arrendamiento",
      "607": "Enajenación o Adquisición de Bienes",
      "608": "Demás ingresos",
      "610": "Residentes en el Extranjero",
      "611": "Ingresos por Dividendos",
      "612": "Actividades Empresariales y Profesionales",
      "614": "Ingresos por intereses",
      "615": "Ingresos por premios",
      "616": "Sin obligaciones fiscales",
      "620": "Sociedades Cooperativas",
      "621": "Incorporación Fiscal",
      "622": "Agrícolas, Ganaderas, Silvícolas y Pesqueras",
      "623": "Grupos de Sociedades",
      "624": "Coordinados",
      "625": "Actividades con Plataformas Tecnológicas",
      "626": "RESICO"
    };
    const USOS_CFDI = {
      "G01": "Adquisición de mercancias",
      "G02": "Devoluciones/descuentos",
      "G03": "Gastos en general",
      "I01": "Construcciones",
      "I02": "Mobiliario y equipo de oficina",
      "I03": "Equipo de transporte",
      "I04": "Equipo de computo",
      "I05": "Dados, troqueles y herramental",
      "I06": "Comunicaciones telefónicas",
      "I07": "Comunicaciones satelitales",
      "I08": "Otra maquinaria y equipo",
      "D01": "Honorarios médicos y hospitalarios",
      "D02": "Gastos médicos por discapacidad",
      "D03": "Gastos funerales",
      "D04": "Donativos",
      "D05": "Intereses hipotecarios",
      "D06": "Aportaciones al SAR",
      "D07": "Seguros de gastos médicos",
      "D08": "Transportación escolar",
      "D09": "Ahorro y planes de pensiones",
      "D10": "Servicios educativos",
      "S01": "Sin efectos fiscales",
      "CP01": "Pagos",
      "CN01": "Nómina"
    };
    const regimenNombre = (clave) => REGIMENES[clave] ?? clave;
    const cfdiNombre = (clave) => USOS_CFDI[clave] ?? clave;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DetailField = _sfc_main$1;
      const _component_CfdiModal = __nuxt_component_0;
      _push(`<!--[--><div style="${ssrRenderStyle({ fontFamily: `'Inter',system-ui,sans-serif` })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "flex-wrap": "wrap", "gap": "12px", "margin-bottom": "20px" })}"><div><h1 style="${ssrRenderStyle({ "font-size": "22px", "font-weight": "800", "color": "#F1F5F9", "margin": "0" })}">Datos Fiscales</h1><p style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.85)", "margin-top": "4px" })}">`);
      if (unref(loading)) {
        _push(`<span>Cargando...</span>`);
      } else if (unref(apiError)) {
        _push(`<span style="${ssrRenderStyle({ "color": "#fb7185" })}">${ssrInterpolate(unref(apiError))}</span>`);
      } else {
        _push(`<span>${ssrInterpolate(unref(users).length)} usuarios registrados</span>`);
      }
      _push(`</p></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(4,1fr)", "gap": "12px", "margin-bottom": "20px" })}"><!--[-->`);
      ssrRenderList(unref(kpis), (k) => {
        _push(`<div style="${ssrRenderStyle({ "border-radius": "14px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "16px 18px" })}"><div style="${ssrRenderStyle({ fontSize: "26px", fontWeight: 800, background: k.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 })}">${ssrInterpolate(unref(loading) ? "—" : k.value)}</div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.8)", "margin-top": "4px", "font-weight": "500" })}">${ssrInterpolate(k.label)}</div></div>`);
      });
      _push(`<!--]--></div><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "14px 16px", "margin-bottom": "20px", "display": "flex", "flex-direction": "column", "gap": "12px" })}"><div style="${ssrRenderStyle({ "position": "relative", "max-width": "380px" })}">`);
      _push(ssrRenderComponent(unref(Search), {
        size: 14,
        style: { "position": "absolute", "left": "13px", "top": "50%", "transform": "translateY(-50%)", "pointer-events": "none" },
        color: unref(searchFocus) ? "#0EA5E9" : "rgba(100,116,139,0.7)"
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(search))} placeholder="Buscar por nombre, RFC o razón social..." style="${ssrRenderStyle({ width: "100%", height: "40px", background: unref(searchFocus) ? "rgba(14,165,233,0.06)" : "rgba(255,255,255,0.04)", border: `1px solid ${unref(searchFocus) ? "rgba(14,165,233,0.45)" : "rgba(255,255,255,0.09)"}`, borderRadius: "10px", paddingLeft: "38px", paddingRight: "14px", fontSize: "13px", color: "#E2E8F0", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "all 0.2s" })}"></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "6px", "flex-wrap": "wrap" })}"><!--[-->`);
      ssrRenderList(statusFilters, (f) => {
        _push(`<button style="${ssrRenderStyle({ height: "30px", padding: "0 12px", borderRadius: "20px", fontSize: "11px", fontWeight: unref(statusFilter) === f.key ? 600 : 500, cursor: "pointer", border: "none", fontFamily: "inherit", background: unref(statusFilter) === f.key ? "linear-gradient(135deg,#0EA5E9,#0284C7)" : "rgba(255,255,255,0.05)", color: unref(statusFilter) === f.key ? "#fff" : "rgba(100,116,139,0.9)", boxShadow: unref(statusFilter) === f.key ? "0 3px 10px rgba(14,165,233,0.25)" : "none" })}">${ssrInterpolate(f.label)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (unref(loading)) {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "3px" })}"><!--[-->`);
        ssrRenderList(6, (i) => {
          _push(`<div class="pulse" style="${ssrRenderStyle({ "border-radius": "12px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "height": "60px" })}"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(filtered).length > 0) {
        _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "2fr 1.5fr 1.5fr 1fr 1fr 1fr 44px", "gap": "0", "padding": "10px 18px", "border-bottom": "1px solid rgba(255,255,255,0.07)" })}"><!--[-->`);
        ssrRenderList(headers, (h) => {
          _push(`<span style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "text-transform": "uppercase", "letter-spacing": "0.8px" })}">${ssrInterpolate(h)}</span>`);
        });
        _push(`<!--]--></div><!--[-->`);
        ssrRenderList(unref(filtered), (u, idx) => {
          _push(`<div style="${ssrRenderStyle({ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr 1fr 44px", gap: 0, padding: "13px 18px", borderBottom: idx < unref(filtered).length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", alignItems: "center", cursor: "pointer", transition: "background 0.15s", background: unref(hoveredRow) === u.id ? "rgba(14,165,233,0.04)" : "transparent" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "10px", "min-width": "0" })}"><div style="${ssrRenderStyle({ width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0, background: `linear-gradient(135deg,${avatarGrad(u.name)[0]},${avatarGrad(u.name)[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white" })}">${ssrInterpolate(u.name.split(" ").slice(0, 2).map((n) => n[0]).join(""))}</div><div style="${ssrRenderStyle({ "min-width": "0" })}"><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "600", "color": "#E2E8F0", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" })}">${ssrInterpolate(u.name)}</div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.7)", "margin-top": "1px", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" })}">${ssrInterpolate(u.email)}</div></div></div><div style="${ssrRenderStyle({ "min-width": "0" })}">`);
          if (u.fiscalRfc) {
            _push(`<span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#38bdf8", "font-family": "monospace", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis", "display": "block" })}">${ssrInterpolate(u.fiscalRfc)}</span>`);
          } else {
            _push(`<span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.45)" })}">—</span>`);
          }
          _push(`</div><div style="${ssrRenderStyle({ "min-width": "0" })}">`);
          if (u.fiscalRazonSocial) {
            _push(`<span style="${ssrRenderStyle({ "font-size": "12px", "color": "#CBD5E1", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis", "display": "block" })}">${ssrInterpolate(u.fiscalRazonSocial)}</span>`);
          } else {
            _push(`<span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.45)" })}">—</span>`);
          }
          _push(`</div><div style="${ssrRenderStyle({ "min-width": "0" })}">`);
          if (u.fiscalRegimen) {
            _push(`<span style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "600", "padding": "2px 8px", "border-radius": "20px", "background": "rgba(99,102,241,0.12)", "color": "#a5b4fc", "white-space": "nowrap" })}">${ssrInterpolate(u.fiscalRegimen)}</span>`);
          } else {
            _push(`<span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.45)" })}">—</span>`);
          }
          _push(`</div><div><span style="${ssrRenderStyle({ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "5px", width: "fit-content", background: u.fiscalCompleted ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)", color: u.fiscalCompleted ? "#34d399" : "#fbbf24" })}"><span style="${ssrRenderStyle({ width: "5px", height: "5px", borderRadius: "50%", background: u.fiscalCompleted ? "#10b981" : "#f59e0b", display: "inline-block", flexShrink: 0 })}"></span> ${ssrInterpolate(u.fiscalCompleted ? "Completo" : "Pendiente")}</span></div><div><span style="${ssrRenderStyle({ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "5px", width: "fit-content", background: u.facturaUid ? "rgba(99,102,241,0.12)" : "rgba(100,116,139,0.08)", color: u.facturaUid ? "#818cf8" : "rgba(100,116,139,0.5)" })}"><span style="${ssrRenderStyle({ width: "5px", height: "5px", borderRadius: "50%", background: u.facturaUid ? "#6366f1" : "rgba(100,116,139,0.4)", display: "inline-block", flexShrink: 0 })}"></span> ${ssrInterpolate(u.facturaUid ? "Sincronizado" : "No sincronizado")}</span></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "center" })}"><div style="${ssrRenderStyle({ "width": "28px", "height": "28px", "border-radius": "8px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.08)", "display": "flex", "align-items": "center", "justify-content": "center" })}">`);
          _push(ssrRenderComponent(unref(ChevronRight), {
            size: 13,
            color: "rgba(100,116,139,0.7)"
          }, null, _parent));
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(loading) && !unref(apiError)) {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "center", "padding": "60px 0", "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "font-size": "14px", "font-weight": "600", "color": "#94a3b8" })}"> No se encontraron resultados </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(detail)) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "background": "rgba(2,6,14,0.78)", "backdrop-filter": "blur(6px)", "z-index": "1050" })}"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(detail)) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "z-index": "1051", "display": "flex", "align-items": "center", "justify-content": "center", "padding": "16px" })}"><div style="${ssrRenderStyle({ "width": "100%", "max-width": "620px", "max-height": "90vh", "display": "flex", "flex-direction": "column" })}"><div style="${ssrRenderStyle({ "position": "relative" })}"><div style="${ssrRenderStyle({ "position": "absolute", "inset": "-1px", "border-radius": "22px", "background": "linear-gradient(135deg,rgba(14,165,233,0.35),rgba(124,58,237,0.2))", "z-index": "0", "pointer-events": "none" })}"></div><div style="${ssrRenderStyle({ "position": "relative", "z-index": "1", "border-radius": "22px", "background": "linear-gradient(160deg,#0D1B35,#09122A)", "box-shadow": "0 32px 80px rgba(0,0,0,0.75)", "display": "flex", "flex-direction": "column", "max-height": "90vh" })}"><div style="${ssrRenderStyle({ "padding": "24px 26px 0", "flex-shrink": "0" })}"><div style="${ssrRenderStyle({ "position": "absolute", "top": "0", "left": "15%", "right": "15%", "height": "1px", "background": "linear-gradient(90deg,transparent,rgba(14,165,233,0.6),transparent)", "border-radius": "999px" })}"></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "18px" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "12px" })}"><div style="${ssrRenderStyle({ width: "42px", height: "42px", borderRadius: "12px", flexShrink: 0, background: `linear-gradient(135deg,${avatarGrad(unref(detail).name)[0]},${avatarGrad(unref(detail).name)[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "white" })}">${ssrInterpolate(unref(detail).name.split(" ").slice(0, 2).map((n) => n[0]).join(""))}</div><div><div style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "700", "color": "#F1F5F9" })}">${ssrInterpolate(unref(detail).name)}</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.75)", "margin-top": "2px" })}">${ssrInterpolate(unref(detail).email)}</div></div></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ fontSize: "11px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "5px", background: unref(detail).fiscalCompleted ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)", color: unref(detail).fiscalCompleted ? "#34d399" : "#fbbf24", border: `1px solid ${unref(detail).fiscalCompleted ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}` })}"><span style="${ssrRenderStyle({ width: "5px", height: "5px", borderRadius: "50%", background: unref(detail).fiscalCompleted ? "#10b981" : "#f59e0b", display: "inline-block" })}"></span> ${ssrInterpolate(unref(detail).fiscalCompleted ? "Datos completos" : "Datos pendientes")}</span>`);
          if (!unref(editing)) {
            _push2(`<button style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "5px", "height": "30px", "padding": "0 12px", "border-radius": "8px", "background": "rgba(14,165,233,0.1)", "border": "1px solid rgba(14,165,233,0.25)", "color": "#38bdf8", "font-size": "11px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit" })}">`);
            _push2(ssrRenderComponent(unref(Pencil), { size: 11 }, null, _parent));
            _push2(` Editar </button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button style="${ssrRenderStyle({ "width": "30px", "height": "30px", "border-radius": "8px", "background": "rgba(255,255,255,0.05)", "border": "1px solid rgba(255,255,255,0.1)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "rgba(100,116,139,0.8)" })}">`);
          _push2(ssrRenderComponent(unref(X), { size: 14 }, null, _parent));
          _push2(`</button></div></div></div><div style="${ssrRenderStyle({ "overflow-y": "auto", "padding": "0 26px 24px", "flex": "1", "min-height": "0" })}">`);
          if (!unref(editing)) {
            _push2(`<!--[-->`);
            if (!unref(detail).fiscalCompleted) {
              _push2(`<div style="${ssrRenderStyle({ "padding": "14px 16px", "border-radius": "12px", "background": "rgba(245,158,11,0.08)", "border": "1px solid rgba(245,158,11,0.2)", "font-size": "13px", "color": "rgba(245,158,11,0.9)", "display": "flex", "align-items": "center", "gap": "10px", "margin-bottom": "18px" })}">`);
              _push2(ssrRenderComponent(unref(AlertTriangle), {
                size: 15,
                color: "#fbbf24",
                style: { "flex-shrink": "0" }
              }, null, _parent));
              _push2(` Este usuario aún no ha completado sus datos fiscales. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div style="${ssrRenderStyle([{ "padding": "14px 16px", "border-radius": "12px", "margin-bottom": "18px", "display": "flex", "align-items": "center", "justify-content": "space-between", "gap": "12px" }, unref(detail).facturaUid ? "background:rgba(99,102,241,0.07);border:1px solid rgba(99,102,241,0.2)" : "background:rgba(100,116,139,0.06);border:1px solid rgba(100,116,139,0.15)"])}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "10px", "min-width": "0" })}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"${ssrRenderAttr("stroke", unref(detail).facturaUid ? "#818cf8" : "rgba(100,116,139,0.5)")} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${ssrRenderStyle({ "flex-shrink": "0" })}"><rect width="14" height="17" x="5" y="2" rx="2"></rect><path d="M9 7h6M9 11h6M9 15h4"></path></svg><div style="${ssrRenderStyle({ "min-width": "0" })}"><div style="${ssrRenderStyle({ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "2px", color: unref(detail).facturaUid ? "rgba(129,140,248,0.7)" : "rgba(100,116,139,0.5)" })}">Factura.com</div>`);
            if (unref(detail).facturaUid) {
              _push2(`<div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#a5b4fc", "font-family": "monospace", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" })}">UID: ${ssrInterpolate(unref(detail).facturaUid)}</div>`);
            } else {
              _push2(`<div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.6)" })}">No sincronizado</div>`);
            }
            _push2(`</div></div>`);
            if (unref(detail).fiscalCompleted) {
              _push2(`<button${ssrIncludeBooleanAttr(unref(syncing) === unref(detail).id) ? " disabled" : ""} style="${ssrRenderStyle({ flexShrink: 0, height: "32px", padding: "0 14px", borderRadius: "8px", border: "1px solid rgba(99,102,241,0.35)", background: "rgba(99,102,241,0.12)", color: "#818cf8", fontSize: "11px", fontWeight: 600, cursor: unref(syncing) === unref(detail).id ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: unref(syncing) === unref(detail).id ? 0.6 : 1 })}">${ssrInterpolate(unref(syncing) === unref(detail).id ? "Sincronizando…" : unref(detail).facturaUid ? "Re-sincronizar" : "Sincronizar")}</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (unref(syncError)) {
              _push2(`<div style="${ssrRenderStyle({ "font-size": "11px", "color": "#fb7185", "margin-bottom": "12px", "padding": "8px 12px", "border-radius": "8px", "background": "rgba(244,63,94,0.08)", "border": "1px solid rgba(244,63,94,0.2)" })}">${ssrInterpolate(unref(syncError))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(detail).facturaUid && unref(detail).fiscalCompleted && unref(detail).fiscalUsocfdi) {
              _push2(`<button style="${ssrRenderStyle({ "width": "100%", "height": "38px", "border-radius": "10px", "background": "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(79,70,229,0.1))", "border": "1px solid rgba(99,102,241,0.3)", "color": "#818cf8", "font-size": "13px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit", "display": "flex", "align-items": "center", "justify-content": "center", "gap": "8px", "margin-bottom": "18px", "transition": "all 0.2s" })}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="17" x="5" y="2" rx="2"></rect><path d="M9 7h6M9 11h6M9 15h4"></path><circle cx="17" cy="17" r="5"></circle><path d="m15.5 17.5 1 1 2-2"></path></svg> Generar CFDI 4.0 </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div style="${ssrRenderStyle({ "margin-bottom": "20px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}">Datos fiscales</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "10px" })}">`);
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "RFC",
              value: unref(detail).fiscalRfc,
              mono: ""
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "País",
              value: unref(detail).fiscalPais
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Razón Social",
              value: unref(detail).fiscalRazonSocial,
              full: ""
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Código Postal",
              value: unref(detail).fiscalCodpos
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Régimen Fiscal",
              value: unref(detail).fiscalRegimen ? `${unref(detail).fiscalRegimen} – ${regimenNombre(unref(detail).fiscalRegimen)}` : void 0
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Uso de CFDI",
              value: unref(detail).fiscalUsocfdi ? `${unref(detail).fiscalUsocfdi} – ${cfdiNombre(unref(detail).fiscalUsocfdi)}` : void 0
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Email fiscal",
              value: unref(detail).fiscalEmail,
              full: ""
            }, null, _parent));
            _push2(`</div></div><div style="${ssrRenderStyle({ "margin-bottom": "20px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}">Domicilio fiscal</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "10px" })}">`);
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Calle",
              value: unref(detail).fiscalCalle
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Número exterior",
              value: unref(detail).fiscalNumExt
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Número interior",
              value: unref(detail).fiscalNumInt
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Colonia",
              value: unref(detail).fiscalColonia
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Ciudad",
              value: unref(detail).fiscalCiudad
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Delegación / Municipio",
              value: unref(detail).fiscalDelegacion
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Localidad",
              value: unref(detail).fiscalLocalidad
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Estado",
              value: unref(detail).fiscalEstado
            }, null, _parent));
            _push2(`</div></div><div><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}">Contacto adicional</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "10px" })}">`);
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Nombre",
              value: unref(detail).fiscalNombre
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Apellidos",
              value: unref(detail).fiscalApellidos
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Teléfono",
              value: unref(detail).fiscalTelefono
            }, null, _parent));
            _push2(ssrRenderComponent(_component_DetailField, {
              label: "Núm. Reg. ID Tributario",
              value: unref(detail).fiscalNumregidtrib
            }, null, _parent));
            _push2(`</div></div><!--]-->`);
          } else {
            _push2(`<!--[--><div style="${ssrRenderStyle({ "margin-bottom": "18px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}">Datos fiscales <span style="${ssrRenderStyle({ "color": "#fb7185" })}">*requeridos</span></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "10px" })}"><div><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "4px" })}">RFC *</div><input${ssrRenderAttr("value", unref(editForm).rfc)} placeholder="XAXX010101000" style="${ssrRenderStyle({ "width": "100%", "height": "36px", "padding": "0 10px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "8px", "font-size": "12px", "color": "#E2E8F0", "outline": "none", "font-family": "monospace", "box-sizing": "border-box" })}"></div><div><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "4px" })}">País *</div><input${ssrRenderAttr("value", unref(editForm).pais)} placeholder="MEX" style="${ssrRenderStyle({ "width": "100%", "height": "36px", "padding": "0 10px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "8px", "font-size": "12px", "color": "#E2E8F0", "outline": "none", "font-family": "inherit", "box-sizing": "border-box" })}"></div><div style="${ssrRenderStyle({ "grid-column": "1/-1" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "4px" })}">Razón Social *</div><input${ssrRenderAttr("value", unref(editForm).razonSocial)} placeholder="Nombre o razón social completa" style="${ssrRenderStyle({ "width": "100%", "height": "36px", "padding": "0 10px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "8px", "font-size": "12px", "color": "#E2E8F0", "outline": "none", "font-family": "inherit", "box-sizing": "border-box" })}"></div><div><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "4px" })}">Código Postal *</div><input${ssrRenderAttr("value", unref(editForm).codpos)} placeholder="31000" style="${ssrRenderStyle({ "width": "100%", "height": "36px", "padding": "0 10px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "8px", "font-size": "12px", "color": "#E2E8F0", "outline": "none", "font-family": "inherit", "box-sizing": "border-box" })}"></div><div><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "4px" })}">Email fiscal *</div><input${ssrRenderAttr("value", unref(editForm).email)} type="email" placeholder="facturacion@empresa.com" style="${ssrRenderStyle({ "width": "100%", "height": "36px", "padding": "0 10px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "8px", "font-size": "12px", "color": "#E2E8F0", "outline": "none", "font-family": "inherit", "box-sizing": "border-box" })}"></div><div><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "4px" })}">Régimen Fiscal *</div><select style="${ssrRenderStyle({ "width": "100%", "height": "36px", "padding": "0 10px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "8px", "font-size": "12px", "color": "#E2E8F0", "outline": "none", "font-family": "inherit", "box-sizing": "border-box", "cursor": "pointer" })}"><option value="" style="${ssrRenderStyle({ "background": "#0D1B35" })}"${ssrIncludeBooleanAttr(Array.isArray(unref(editForm).regimen) ? ssrLooseContain(unref(editForm).regimen, "") : ssrLooseEqual(unref(editForm).regimen, "")) ? " selected" : ""}>Seleccionar…</option><!--[-->`);
            ssrRenderList(REGIMENES, (nombre, clave) => {
              _push2(`<option${ssrRenderAttr("value", clave)} style="${ssrRenderStyle({ "background": "#0D1B35" })}"${ssrIncludeBooleanAttr(Array.isArray(unref(editForm).regimen) ? ssrLooseContain(unref(editForm).regimen, clave) : ssrLooseEqual(unref(editForm).regimen, clave)) ? " selected" : ""}>${ssrInterpolate(clave)} – ${ssrInterpolate(nombre)}</option>`);
            });
            _push2(`<!--]--></select></div><div><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "4px" })}">Uso de CFDI</div><select style="${ssrRenderStyle({ "width": "100%", "height": "36px", "padding": "0 10px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "8px", "font-size": "12px", "color": "#E2E8F0", "outline": "none", "font-family": "inherit", "box-sizing": "border-box", "cursor": "pointer" })}"><option value="" style="${ssrRenderStyle({ "background": "#0D1B35" })}"${ssrIncludeBooleanAttr(Array.isArray(unref(editForm).usocfdi) ? ssrLooseContain(unref(editForm).usocfdi, "") : ssrLooseEqual(unref(editForm).usocfdi, "")) ? " selected" : ""}>Seleccionar…</option><!--[-->`);
            ssrRenderList(USOS_CFDI, (nombre, clave) => {
              _push2(`<option${ssrRenderAttr("value", clave)} style="${ssrRenderStyle({ "background": "#0D1B35" })}"${ssrIncludeBooleanAttr(Array.isArray(unref(editForm).usocfdi) ? ssrLooseContain(unref(editForm).usocfdi, clave) : ssrLooseEqual(unref(editForm).usocfdi, clave)) ? " selected" : ""}>${ssrInterpolate(clave)} – ${ssrInterpolate(nombre)}</option>`);
            });
            _push2(`<!--]--></select></div></div></div><div style="${ssrRenderStyle({ "margin-bottom": "18px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}">Domicilio fiscal</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "10px" })}"><!--[-->`);
            ssrRenderList(domicilioFields, (f) => {
              _push2(`<div><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "4px" })}">${ssrInterpolate(f.label)}</div><input${ssrRenderAttr("value", unref(editForm)[f.key])}${ssrRenderAttr("placeholder", f.placeholder)} style="${ssrRenderStyle({ "width": "100%", "height": "36px", "padding": "0 10px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "8px", "font-size": "12px", "color": "#E2E8F0", "outline": "none", "font-family": "inherit", "box-sizing": "border-box" })}"></div>`);
            });
            _push2(`<!--]--></div></div><div style="${ssrRenderStyle({ "margin-bottom": "18px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}">Contacto adicional</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "10px" })}"><!--[-->`);
            ssrRenderList(contactoFields, (f) => {
              _push2(`<div><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.6)", "margin-bottom": "4px" })}">${ssrInterpolate(f.label)}</div><input${ssrRenderAttr("value", unref(editForm)[f.key])}${ssrRenderAttr("placeholder", f.placeholder)} style="${ssrRenderStyle({ "width": "100%", "height": "36px", "padding": "0 10px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "8px", "font-size": "12px", "color": "#E2E8F0", "outline": "none", "font-family": "inherit", "box-sizing": "border-box" })}"></div>`);
            });
            _push2(`<!--]--></div></div>`);
            if (unref(editError)) {
              _push2(`<div style="${ssrRenderStyle({ "padding": "9px 12px", "border-radius": "8px", "background": "rgba(244,63,94,0.1)", "border": "1px solid rgba(244,63,94,0.25)", "font-size": "12px", "color": "#fb7185", "margin-bottom": "12px" })}">${ssrInterpolate(unref(editError))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div style="${ssrRenderStyle({ "display": "flex", "gap": "10px" })}"><button${ssrIncludeBooleanAttr(unref(editSaving)) ? " disabled" : ""} style="${ssrRenderStyle({ "flex": "1", "height": "40px", "border-radius": "10px", "border": "1px solid rgba(255,255,255,0.1)", "background": "rgba(255,255,255,0.04)", "color": "#94a3b8", "font-size": "13px", "cursor": "pointer", "font-family": "inherit" })}"> Cancelar </button><button${ssrIncludeBooleanAttr(unref(editSaving)) ? " disabled" : ""} style="${ssrRenderStyle({ flex: 2, height: "40px", borderRadius: "10px", border: "none", background: unref(editSaving) ? "rgba(14,165,233,0.5)" : "linear-gradient(135deg,#0EA5E9,#0284C7)", color: "white", fontSize: "13px", fontWeight: 700, cursor: unref(editSaving) ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: unref(editSaving) ? "none" : "0 4px 16px rgba(14,165,233,0.3)" })}">${ssrInterpolate(unref(editSaving) ? "Guardando…" : "Guardar cambios")}</button></div><!--]-->`);
          }
          _push2(`</div></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      if (unref(cfdiUser)) {
        _push(ssrRenderComponent(_component_CfdiModal, {
          user: unref(cfdiUser),
          open: unref(cfdiOpen),
          onClose: ($event) => cfdiOpen.value = false,
          onCreated: onCfdiCreated
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/fiscal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=fiscal-B0dkwVlm.js.map
