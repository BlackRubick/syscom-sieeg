import { defineComponent, mergeProps, useSSRContext, ref, computed, unref, isRef } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$2 } from "./FiscalDataModal-EKhs8asu.js";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/hookable/dist/index.mjs";
import { u as useAuthStore } from "./auth-De5_qdGe.js";
import "./FormField-CqV_UbYV.js";
import "@lucide/vue";
import "pinia";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FiscalFieldItem",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    full: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        style: { gridColumn: __props.full ? "1/-1" : void 0 }
      }, _attrs))}><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "0.7px", "margin-bottom": "5px" })}">${ssrInterpolate(__props.label)}</div>`);
      if (__props.value) {
        _push(`<div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "500", "color": "#CBD5E1", "word-break": "break-word", "line-height": "1.4" })}">${ssrInterpolate(__props.value)}</div>`);
      } else {
        _push(`<div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.3)" })}">—</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FiscalFieldItem.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "perfil",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const showModal = ref(false);
    const copied = ref(false);
    const palette = [["#0EA5E9", "#22D3EE"], ["#7C3AED", "#A78BFA"], ["#10B981", "#34D399"], ["#F59E0B", "#FCD34D"], ["#F43F5E", "#FB7185"], ["#6366F1", "#818CF8"]];
    const avatarColors = computed(() => palette[(auth.user?.name ?? "").charCodeAt(0) % palette.length]);
    const initials = computed(
      () => (auth.user?.name ?? "").split(" ").slice(0, 2).map((n) => n[0]).join("")
    );
    const roleMap = {
      admin: { label: "Admin", color: "#a78bfa", bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.25)" },
      approver: { label: "Aprobador", color: "#fbbf24", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
      buyer: { label: "Comprador", color: "#38bdf8", bg: "rgba(14,165,233,0.12)", border: "rgba(14,165,233,0.25)" },
      viewer: { label: "Visor", color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" }
    };
    const roleLabel = computed(() => roleMap[auth.user?.role ?? ""]?.label ?? auth.user?.role ?? "");
    const roleBadgeStyle = computed(() => {
      const cfg = roleMap[auth.user?.role ?? ""] ?? roleMap.viewer;
      return { fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` };
    });
    const formatDate = (d) => d ? new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d)) : "—";
    const quickStats = computed(() => [
      { label: "Miembro desde", value: formatDate(auth.user?.createdAt) },
      { label: "Último acceso", value: auth.user?.lastLogin ? formatDate(auth.user.lastLogin) : "Hoy" },
      { label: "Facturas", value: auth.user?.fiscalCompleted ? "Activo" : "Pendiente" }
    ]);
    const pendingItems = ["RFC y razón social", "Régimen fiscal", "Código postal y país", "Email para facturas"];
    const hasDomicilio = computed(() => {
      const u = auth.user;
      return u && (u.fiscalCalle || u.fiscalColonia || u.fiscalCiudad || u.fiscalEstado);
    });
    const hasContacto = computed(() => {
      const u = auth.user;
      return u && (u.fiscalNombre || u.fiscalApellidos || u.fiscalTelefono || u.fiscalNumregidtrib);
    });
    const direccionFormateada = computed(() => {
      const u = auth.user;
      if (!u) return "";
      const partes = [
        u.fiscalCalle,
        u.fiscalNumExt ? `#${u.fiscalNumExt}` : null,
        u.fiscalColonia,
        u.fiscalCiudad,
        u.fiscalEstado,
        u.fiscalCodpos ? `C.P. ${u.fiscalCodpos}` : null
      ].filter(Boolean);
      return partes.join(", ");
    });
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
    const regimenNombre = (c) => REGIMENES[c] ?? c;
    const cfdiNombre = (c) => USOS_CFDI[c] ?? c;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FiscalFieldItem = _sfc_main$1;
      const _component_FiscalDataModal = _sfc_main$2;
      _push(`<!--[--><div style="${ssrRenderStyle({ fontFamily: `'Inter',system-ui,sans-serif`, maxWidth: "860px", margin: "0 auto" })}"><div style="${ssrRenderStyle({ "position": "relative", "border-radius": "20px", "overflow": "hidden", "margin-bottom": "20px", "box-shadow": "0 8px 32px rgba(0,0,0,0.4)" })}"><div style="${ssrRenderStyle({ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${unref(avatarColors)[0]}22 0%, ${unref(avatarColors)[1]}18 50%, rgba(9,18,40,0.95) 100%)`, zIndex: 0 })}"></div><div style="${ssrRenderStyle({ "position": "absolute", "inset": "0", "background": "linear-gradient(160deg,#0D1B35,#091228)", "z-index": "0", "opacity": "0.7" })}"></div><div style="${ssrRenderStyle({ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${unref(avatarColors)[0]}, ${unref(avatarColors)[1]}, transparent)`, zIndex: 2 })}"></div><div style="${ssrRenderStyle({ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${unref(avatarColors)[0]}18, transparent 70%)`, zIndex: 1 })}"></div><div style="${ssrRenderStyle({ position: "absolute", bottom: "-20px", left: "20%", width: "150px", height: "150px", borderRadius: "50%", background: `radial-gradient(circle, ${unref(avatarColors)[1]}12, transparent 70%)`, zIndex: 1 })}"></div><div style="${ssrRenderStyle({ "position": "relative", "z-index": "2", "padding": "32px 32px 28px", "display": "flex", "align-items": "flex-end", "gap": "24px", "flex-wrap": "wrap" })}"><div style="${ssrRenderStyle({ "position": "relative", "flex-shrink": "0" })}"><div style="${ssrRenderStyle({ width: "80px", height: "80px", borderRadius: "22px", background: `linear-gradient(135deg,${unref(avatarColors)[0]},${unref(avatarColors)[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: 800, color: "white", boxShadow: `0 8px 24px ${unref(avatarColors)[0]}55, 0 0 0 3px rgba(255,255,255,0.06)` })}">${ssrInterpolate(unref(initials))}</div><div style="${ssrRenderStyle({ position: "absolute", bottom: "-3px", right: "-3px", width: "18px", height: "18px", borderRadius: "50%", background: unref(auth).user?.status === "active" ? "#10b981" : "#f43f5e", border: "2px solid #091228", boxShadow: `0 0 8px ${unref(auth).user?.status === "active" ? "#10b981" : "#f43f5e"}99` })}"></div></div><div style="${ssrRenderStyle({ "flex": "1", "min-width": "0" })}"><div style="${ssrRenderStyle({ "font-size": "24px", "font-weight": "800", "color": "#F1F5F9", "letter-spacing": "-0.5px", "line-height": "1.1" })}">${ssrInterpolate(unref(auth).user?.name)}</div><div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(148,163,184,0.75)", "margin-top": "5px", "display": "flex", "align-items": "center", "gap": "6px" })}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg> ${ssrInterpolate(unref(auth).user?.email)}</div><div style="${ssrRenderStyle({ "margin-top": "12px", "display": "flex", "gap": "8px", "flex-wrap": "wrap", "align-items": "center" })}"><span style="${ssrRenderStyle({ ...unref(roleBadgeStyle), padding: "4px 12px", fontSize: "11px" })}">${ssrInterpolate(unref(roleLabel))}</span><span style="${ssrRenderStyle({ fontSize: "11px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px", background: unref(auth).user?.status === "active" ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)", color: unref(auth).user?.status === "active" ? "#34d399" : "#fb7185", border: `1px solid ${unref(auth).user?.status === "active" ? "rgba(16,185,129,0.25)" : "rgba(244,63,94,0.25)"}`, display: "flex", alignItems: "center", gap: "5px" })}"><span style="${ssrRenderStyle({ width: "5px", height: "5px", borderRadius: "50%", background: unref(auth).user?.status === "active" ? "#10b981" : "#f43f5e", display: "inline-block" })}"></span> ${ssrInterpolate(unref(auth).user?.status === "active" ? "Activo" : "Inactivo")}</span></div></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "2px", "background": "rgba(0,0,0,0.25)", "border-radius": "14px", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden", "flex-shrink": "0" })}"><!--[-->`);
      ssrRenderList(unref(quickStats), (stat, i) => {
        _push(`<div style="${ssrRenderStyle({ padding: "12px 18px", textAlign: "center", borderRight: i < unref(quickStats).length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" })}"><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#E2E8F0", "white-space": "nowrap" })}">${ssrInterpolate(stat.value)}</div><div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,116,139,0.7)", "margin-top": "2px", "white-space": "nowrap" })}">${ssrInterpolate(stat.label)}</div></div>`);
      });
      _push(`<!--]--></div></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 2fr", "gap": "16px", "align-items": "start" })}"><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "16px" })}"><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "20px", "text-align": "center" })}"><div style="${ssrRenderStyle({ width: "52px", height: "52px", borderRadius: "16px", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", background: unref(auth).user?.fiscalCompleted ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.1)", border: `1px solid ${unref(auth).user?.fiscalCompleted ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.2)"}` })}">`);
      if (unref(auth).user?.fiscalCompleted) {
        _push(`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`);
      } else {
        _push(`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`);
      }
      _push(`</div><div style="${ssrRenderStyle({ "font-size": "14px", "font-weight": "700", "color": "#E2E8F0", "margin-bottom": "4px" })}">${ssrInterpolate(unref(auth).user?.fiscalCompleted ? "Datos completos" : "Datos pendientes")}</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.7)", "line-height": "1.5", "margin-bottom": "16px" })}">${ssrInterpolate(unref(auth).user?.fiscalCompleted ? "Tu información fiscal está lista para facturación." : "Completa tu información fiscal para recibir CFDI.")}</div><button style="${ssrRenderStyle({ width: "100%", height: "38px", borderRadius: "10px", border: "none", background: unref(auth).user?.fiscalCompleted ? "rgba(14,165,233,0.1)" : "linear-gradient(135deg,#F59E0B,#D97706)", color: unref(auth).user?.fiscalCompleted ? "#38bdf8" : "white", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", border: unref(auth).user?.fiscalCompleted ? "1px solid rgba(14,165,233,0.2)" : "none" })}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"${ssrRenderAttr("stroke", unref(auth).user?.fiscalCompleted ? "#38bdf8" : "white")} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg> ${ssrInterpolate(unref(auth).user?.fiscalCompleted ? "Actualizar datos" : "Completar ahora")}</button></div>`);
      if (unref(auth).user?.fiscalRfc) {
        _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "18px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}">RFC</div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "700", "color": "#38bdf8", "font-family": "monospace", "letter-spacing": "1px" })}">${ssrInterpolate(unref(auth).user.fiscalRfc)}</span><button${ssrRenderAttr("title", unref(copied) ? "¡Copiado!" : "Copiar RFC")} style="${ssrRenderStyle({ width: "30px", height: "30px", borderRadius: "8px", border: "none", background: unref(copied) ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" })}">`);
        if (!unref(copied)) {
          _push(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`);
        } else {
          _push(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`);
        }
        _push(`</button></div>`);
        if (unref(auth).user.fiscalRazonSocial) {
          _push(`<div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.6)", "margin-top": "8px", "line-height": "1.4" })}">${ssrInterpolate(unref(auth).user.fiscalRazonSocial)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(auth).user?.fiscalRegimen) {
        _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "18px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}">Régimen Fiscal</div><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "700", "padding": "4px 10px", "border-radius": "20px", "background": "rgba(99,102,241,0.12)", "color": "#a5b4fc", "display": "inline-block", "margin-bottom": "6px" })}">${ssrInterpolate(unref(auth).user.fiscalRegimen)}</span><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(148,163,184,0.75)", "line-height": "1.4" })}">${ssrInterpolate(regimenNombre(unref(auth).user.fiscalRegimen))}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "16px" })}">`);
      if (!unref(auth).user?.fiscalCompleted) {
        _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(245,158,11,0.2)", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "padding": "32px", "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center", "gap": "14px" })}"><div style="${ssrRenderStyle({ "width": "64px", "height": "64px", "border-radius": "20px", "background": "rgba(245,158,11,0.08)", "border": "1px solid rgba(245,158,11,0.2)", "display": "flex", "align-items": "center", "justify-content": "center" })}"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"></rect><path d="M8 10h8"></path><path d="M8 14h5"></path><path d="M8 6h8"></path></svg></div><div><div style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "700", "color": "#fcd34d", "margin-bottom": "6px" })}">Sin datos fiscales registrados</div><div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.75)", "line-height": "1.6", "max-width": "320px", "margin": "0 auto" })}"> Para poder recibir facturas electrónicas (CFDI), necesitas registrar tu información fiscal ante el SAT. </div></div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "8px", "width": "100%", "max-width": "280px" })}"><!--[-->`);
        ssrRenderList(pendingItems, (item) => {
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px", "text-align": "left" })}"><div style="${ssrRenderStyle({ "width": "18px", "height": "18px", "border-radius": "50%", "background": "rgba(245,158,11,0.12)", "border": "1px solid rgba(245,158,11,0.2)", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" })}"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg></div><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(148,163,184,0.7)" })}">${ssrInterpolate(item)}</span></div>`);
        });
        _push(`<!--]--></div><button style="${ssrRenderStyle({ "height": "40px", "padding": "0 28px", "border-radius": "10px", "border": "none", "background": "linear-gradient(135deg,#F59E0B,#D97706)", "color": "white", "font-size": "13px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit", "box-shadow": "0 4px 14px rgba(245,158,11,0.3)" })}"> Registrar datos fiscales </button></div></div>`);
      } else {
        _push(`<!--[--><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "padding": "14px 20px", "border-bottom": "1px solid rgba(255,255,255,0.06)", "display": "flex", "align-items": "center", "gap": "8px" })}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"></rect><path d="M8 10h8"></path><path d="M8 14h5"></path><path d="M8 6h8"></path></svg><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "700", "color": "#94a3b8", "text-transform": "uppercase", "letter-spacing": "0.8px" })}">Datos fiscales</span></div><div style="${ssrRenderStyle({ "padding": "18px 20px", "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "16px" })}">`);
        _push(ssrRenderComponent(_component_FiscalFieldItem, {
          label: "Razón Social",
          value: unref(auth).user.fiscalRazonSocial,
          full: ""
        }, null, _parent));
        _push(ssrRenderComponent(_component_FiscalFieldItem, {
          label: "Código Postal",
          value: unref(auth).user.fiscalCodpos
        }, null, _parent));
        _push(ssrRenderComponent(_component_FiscalFieldItem, {
          label: "País",
          value: unref(auth).user.fiscalPais
        }, null, _parent));
        _push(ssrRenderComponent(_component_FiscalFieldItem, {
          label: "Email fiscal",
          value: unref(auth).user.fiscalEmail,
          full: ""
        }, null, _parent));
        if (unref(auth).user.fiscalUsocfdi) {
          _push(ssrRenderComponent(_component_FiscalFieldItem, {
            label: "Uso de CFDI",
            value: `${unref(auth).user.fiscalUsocfdi} – ${cfdiNombre(unref(auth).user.fiscalUsocfdi)}`,
            full: ""
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(hasDomicilio)) {
          _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "padding": "14px 20px", "border-bottom": "1px solid rgba(255,255,255,0.06)", "display": "flex", "align-items": "center", "gap": "8px" })}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "700", "color": "#94a3b8", "text-transform": "uppercase", "letter-spacing": "0.8px" })}">Domicilio fiscal</span></div><div style="${ssrRenderStyle({ "padding": "18px 20px" })}">`);
          if (unref(direccionFormateada)) {
            _push(`<div style="${ssrRenderStyle({ "font-size": "13px", "color": "#CBD5E1", "line-height": "1.7", "margin-bottom": "14px", "padding": "12px 14px", "border-radius": "10px", "background": "rgba(255,255,255,0.03)", "border": "1px solid rgba(255,255,255,0.06)" })}">${ssrInterpolate(unref(direccionFormateada))}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "14px" })}">`);
          if (unref(auth).user.fiscalNumExt) {
            _push(ssrRenderComponent(_component_FiscalFieldItem, {
              label: "Núm. exterior",
              value: unref(auth).user.fiscalNumExt
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (unref(auth).user.fiscalNumInt) {
            _push(ssrRenderComponent(_component_FiscalFieldItem, {
              label: "Núm. interior",
              value: unref(auth).user.fiscalNumInt
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (unref(auth).user.fiscalLocalidad) {
            _push(ssrRenderComponent(_component_FiscalFieldItem, {
              label: "Localidad",
              value: unref(auth).user.fiscalLocalidad
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (unref(auth).user.fiscalDelegacion) {
            _push(ssrRenderComponent(_component_FiscalFieldItem, {
              label: "Delegación / Municipio",
              value: unref(auth).user.fiscalDelegacion
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(hasContacto)) {
          _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "padding": "14px 20px", "border-bottom": "1px solid rgba(255,255,255,0.06)", "display": "flex", "align-items": "center", "gap": "8px" })}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5a19.36 19.36 0 0 1-3-8.59A2 2 0 0 1 3.64 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "700", "color": "#94a3b8", "text-transform": "uppercase", "letter-spacing": "0.8px" })}">Contacto adicional</span></div><div style="${ssrRenderStyle({ "padding": "18px 20px", "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "14px" })}">`);
          if (unref(auth).user.fiscalNombre || unref(auth).user.fiscalApellidos) {
            _push(ssrRenderComponent(_component_FiscalFieldItem, {
              label: "Nombre completo",
              value: `${unref(auth).user.fiscalNombre ?? ""} ${unref(auth).user.fiscalApellidos ?? ""}`.trim(),
              full: ""
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (unref(auth).user.fiscalTelefono) {
            _push(ssrRenderComponent(_component_FiscalFieldItem, {
              label: "Teléfono",
              value: unref(auth).user.fiscalTelefono
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (unref(auth).user.fiscalNumregidtrib) {
            _push(ssrRenderComponent(_component_FiscalFieldItem, {
              label: "Núm. Reg. ID Tributario",
              value: unref(auth).user.fiscalNumregidtrib
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div></div></div>`);
      _push(ssrRenderComponent(_component_FiscalDataModal, {
        modelValue: unref(showModal),
        "onUpdate:modelValue": ($event) => isRef(showModal) ? showModal.value = $event : null
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/perfil.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=perfil-Btu3Nk4q.js.map
