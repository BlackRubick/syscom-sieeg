import { defineComponent, ref, computed, unref, isRef, mergeProps, useSSRContext } from 'vue';
import { ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderComponent, ssrRenderAttrs } from 'vue/server-renderer';
import { _ as _sfc_main$2 } from './FiscalDataModal-EKhs8asu.mjs';
import { u as useAuthStore } from './auth-De5_qdGe.mjs';
import './FormField-CqV_UbYV.mjs';
import '@lucide/vue';
import 'pinia';

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
        _push(`<div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.3)" })}">\u2014</div>`);
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
    const avatarColors = computed(() => {
      var _a, _b;
      return palette[((_b = (_a = auth.user) == null ? void 0 : _a.name) != null ? _b : "").charCodeAt(0) % palette.length];
    });
    const initials = computed(
      () => {
        var _a, _b;
        return ((_b = (_a = auth.user) == null ? void 0 : _a.name) != null ? _b : "").split(" ").slice(0, 2).map((n) => n[0]).join("");
      }
    );
    const roleMap = {
      admin: { label: "Admin", color: "#a78bfa", bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.25)" },
      approver: { label: "Aprobador", color: "#fbbf24", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
      buyer: { label: "Comprador", color: "#38bdf8", bg: "rgba(14,165,233,0.12)", border: "rgba(14,165,233,0.25)" },
      viewer: { label: "Visor", color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" }
    };
    const roleLabel = computed(() => {
      var _a, _b, _c, _d, _e, _f;
      return (_f = (_e = (_c = roleMap[(_b = (_a = auth.user) == null ? void 0 : _a.role) != null ? _b : ""]) == null ? void 0 : _c.label) != null ? _e : (_d = auth.user) == null ? void 0 : _d.role) != null ? _f : "";
    });
    const roleBadgeStyle = computed(() => {
      var _a, _b, _c;
      const cfg = (_c = roleMap[(_b = (_a = auth.user) == null ? void 0 : _a.role) != null ? _b : ""]) != null ? _c : roleMap.viewer;
      return { fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` };
    });
    const formatDate = (d) => d ? new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d)) : "\u2014";
    const quickStats = computed(() => {
      var _a, _b, _c;
      return [
        { label: "Miembro desde", value: formatDate((_a = auth.user) == null ? void 0 : _a.createdAt) },
        { label: "\xDAltimo acceso", value: ((_b = auth.user) == null ? void 0 : _b.lastLogin) ? formatDate(auth.user.lastLogin) : "Hoy" },
        { label: "Facturas", value: ((_c = auth.user) == null ? void 0 : _c.fiscalCompleted) ? "Activo" : "Pendiente" }
      ];
    });
    const pendingItems = ["RFC y raz\xF3n social", "R\xE9gimen fiscal", "C\xF3digo postal y pa\xEDs", "Email para facturas"];
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
      "607": "Enajenaci\xF3n o Adquisici\xF3n de Bienes",
      "608": "Dem\xE1s ingresos",
      "610": "Residentes en el Extranjero",
      "611": "Ingresos por Dividendos",
      "612": "Actividades Empresariales y Profesionales",
      "614": "Ingresos por intereses",
      "615": "Ingresos por premios",
      "616": "Sin obligaciones fiscales",
      "620": "Sociedades Cooperativas",
      "621": "Incorporaci\xF3n Fiscal",
      "622": "Agr\xEDcolas, Ganaderas, Silv\xEDcolas y Pesqueras",
      "623": "Grupos de Sociedades",
      "624": "Coordinados",
      "625": "Actividades con Plataformas Tecnol\xF3gicas",
      "626": "RESICO"
    };
    const USOS_CFDI = {
      "G01": "Adquisici\xF3n de mercancias",
      "G02": "Devoluciones/descuentos",
      "G03": "Gastos en general",
      "I01": "Construcciones",
      "I02": "Mobiliario y equipo de oficina",
      "I03": "Equipo de transporte",
      "I04": "Equipo de computo",
      "I05": "Dados, troqueles y herramental",
      "I06": "Comunicaciones telef\xF3nicas",
      "I07": "Comunicaciones satelitales",
      "I08": "Otra maquinaria y equipo",
      "D01": "Honorarios m\xE9dicos y hospitalarios",
      "D02": "Gastos m\xE9dicos por discapacidad",
      "D03": "Gastos funerales",
      "D04": "Donativos",
      "D05": "Intereses hipotecarios",
      "D06": "Aportaciones al SAR",
      "D07": "Seguros de gastos m\xE9dicos",
      "D08": "Transportaci\xF3n escolar",
      "D09": "Ahorro y planes de pensiones",
      "D10": "Servicios educativos",
      "S01": "Sin efectos fiscales",
      "CP01": "Pagos",
      "CN01": "N\xF3mina"
    };
    const regimenNombre = (c) => {
      var _a;
      return (_a = REGIMENES[c]) != null ? _a : c;
    };
    const cfdiNombre = (c) => {
      var _a;
      return (_a = USOS_CFDI[c]) != null ? _a : c;
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
      const _component_FiscalFieldItem = _sfc_main$1;
      const _component_FiscalDataModal = _sfc_main$2;
      _push(`<!--[--><div style="${ssrRenderStyle({ fontFamily: `'Inter',system-ui,sans-serif`, maxWidth: "860px", margin: "0 auto" })}"><div style="${ssrRenderStyle({ "position": "relative", "border-radius": "20px", "overflow": "hidden", "margin-bottom": "20px", "box-shadow": "0 8px 32px rgba(0,0,0,0.4)" })}"><div style="${ssrRenderStyle({ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${unref(avatarColors)[0]}22 0%, ${unref(avatarColors)[1]}18 50%, rgba(9,18,40,0.95) 100%)`, zIndex: 0 })}"></div><div style="${ssrRenderStyle({ "position": "absolute", "inset": "0", "background": "linear-gradient(160deg,#0D1B35,#091228)", "z-index": "0", "opacity": "0.7" })}"></div><div style="${ssrRenderStyle({ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${unref(avatarColors)[0]}, ${unref(avatarColors)[1]}, transparent)`, zIndex: 2 })}"></div><div style="${ssrRenderStyle({ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${unref(avatarColors)[0]}18, transparent 70%)`, zIndex: 1 })}"></div><div style="${ssrRenderStyle({ position: "absolute", bottom: "-20px", left: "20%", width: "150px", height: "150px", borderRadius: "50%", background: `radial-gradient(circle, ${unref(avatarColors)[1]}12, transparent 70%)`, zIndex: 1 })}"></div><div style="${ssrRenderStyle({ "position": "relative", "z-index": "2", "padding": "32px 32px 28px", "display": "flex", "align-items": "flex-end", "gap": "24px", "flex-wrap": "wrap" })}"><div style="${ssrRenderStyle({ "position": "relative", "flex-shrink": "0" })}"><div style="${ssrRenderStyle({ width: "80px", height: "80px", borderRadius: "22px", background: `linear-gradient(135deg,${unref(avatarColors)[0]},${unref(avatarColors)[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: 800, color: "white", boxShadow: `0 8px 24px ${unref(avatarColors)[0]}55, 0 0 0 3px rgba(255,255,255,0.06)` })}">${ssrInterpolate(unref(initials))}</div><div style="${ssrRenderStyle({ position: "absolute", bottom: "-3px", right: "-3px", width: "18px", height: "18px", borderRadius: "50%", background: ((_a = unref(auth).user) == null ? void 0 : _a.status) === "active" ? "#10b981" : "#f43f5e", border: "2px solid #091228", boxShadow: `0 0 8px ${((_b = unref(auth).user) == null ? void 0 : _b.status) === "active" ? "#10b981" : "#f43f5e"}99` })}"></div></div><div style="${ssrRenderStyle({ "flex": "1", "min-width": "0" })}"><div style="${ssrRenderStyle({ "font-size": "24px", "font-weight": "800", "color": "#F1F5F9", "letter-spacing": "-0.5px", "line-height": "1.1" })}">${ssrInterpolate((_c = unref(auth).user) == null ? void 0 : _c.name)}</div><div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(148,163,184,0.75)", "margin-top": "5px", "display": "flex", "align-items": "center", "gap": "6px" })}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg> ${ssrInterpolate((_d = unref(auth).user) == null ? void 0 : _d.email)}</div><div style="${ssrRenderStyle({ "margin-top": "12px", "display": "flex", "gap": "8px", "flex-wrap": "wrap", "align-items": "center" })}"><span style="${ssrRenderStyle({ ...unref(roleBadgeStyle), padding: "4px 12px", fontSize: "11px" })}">${ssrInterpolate(unref(roleLabel))}</span><span style="${ssrRenderStyle({ fontSize: "11px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px", background: ((_e = unref(auth).user) == null ? void 0 : _e.status) === "active" ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)", color: ((_f = unref(auth).user) == null ? void 0 : _f.status) === "active" ? "#34d399" : "#fb7185", border: `1px solid ${((_g = unref(auth).user) == null ? void 0 : _g.status) === "active" ? "rgba(16,185,129,0.25)" : "rgba(244,63,94,0.25)"}`, display: "flex", alignItems: "center", gap: "5px" })}"><span style="${ssrRenderStyle({ width: "5px", height: "5px", borderRadius: "50%", background: ((_h = unref(auth).user) == null ? void 0 : _h.status) === "active" ? "#10b981" : "#f43f5e", display: "inline-block" })}"></span> ${ssrInterpolate(((_i = unref(auth).user) == null ? void 0 : _i.status) === "active" ? "Activo" : "Inactivo")}</span></div></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "2px", "background": "rgba(0,0,0,0.25)", "border-radius": "14px", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden", "flex-shrink": "0" })}"><!--[-->`);
      ssrRenderList(unref(quickStats), (stat, i) => {
        _push(`<div style="${ssrRenderStyle({ padding: "12px 18px", textAlign: "center", borderRight: i < unref(quickStats).length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" })}"><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#E2E8F0", "white-space": "nowrap" })}">${ssrInterpolate(stat.value)}</div><div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,116,139,0.7)", "margin-top": "2px", "white-space": "nowrap" })}">${ssrInterpolate(stat.label)}</div></div>`);
      });
      _push(`<!--]--></div></div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 2fr", "gap": "16px", "align-items": "start" })}"><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "16px" })}"><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "20px", "text-align": "center" })}"><div style="${ssrRenderStyle({ width: "52px", height: "52px", borderRadius: "16px", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", background: ((_j = unref(auth).user) == null ? void 0 : _j.fiscalCompleted) ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.1)", border: `1px solid ${((_k = unref(auth).user) == null ? void 0 : _k.fiscalCompleted) ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.2)"}` })}">`);
      if ((_l = unref(auth).user) == null ? void 0 : _l.fiscalCompleted) {
        _push(`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`);
      } else {
        _push(`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`);
      }
      _push(`</div><div style="${ssrRenderStyle({ "font-size": "14px", "font-weight": "700", "color": "#E2E8F0", "margin-bottom": "4px" })}">${ssrInterpolate(((_m = unref(auth).user) == null ? void 0 : _m.fiscalCompleted) ? "Datos completos" : "Datos pendientes")}</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.7)", "line-height": "1.5", "margin-bottom": "16px" })}">${ssrInterpolate(((_n = unref(auth).user) == null ? void 0 : _n.fiscalCompleted) ? "Tu informaci\xF3n fiscal est\xE1 lista para facturaci\xF3n." : "Completa tu informaci\xF3n fiscal para recibir CFDI.")}</div><button style="${ssrRenderStyle({ width: "100%", height: "38px", borderRadius: "10px", border: "none", background: ((_o = unref(auth).user) == null ? void 0 : _o.fiscalCompleted) ? "rgba(14,165,233,0.1)" : "linear-gradient(135deg,#F59E0B,#D97706)", color: ((_p = unref(auth).user) == null ? void 0 : _p.fiscalCompleted) ? "#38bdf8" : "white", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", border: ((_q = unref(auth).user) == null ? void 0 : _q.fiscalCompleted) ? "1px solid rgba(14,165,233,0.2)" : "none" })}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"${ssrRenderAttr("stroke", ((_r = unref(auth).user) == null ? void 0 : _r.fiscalCompleted) ? "#38bdf8" : "white")} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg> ${ssrInterpolate(((_s = unref(auth).user) == null ? void 0 : _s.fiscalCompleted) ? "Actualizar datos" : "Completar ahora")}</button></div>`);
      if ((_t = unref(auth).user) == null ? void 0 : _t.fiscalRfc) {
        _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "18px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}">RFC</div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "gap": "8px" })}"><span style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "700", "color": "#38bdf8", "font-family": "monospace", "letter-spacing": "1px" })}">${ssrInterpolate(unref(auth).user.fiscalRfc)}</span><button${ssrRenderAttr("title", unref(copied) ? "\xA1Copiado!" : "Copiar RFC")} style="${ssrRenderStyle({ width: "30px", height: "30px", borderRadius: "8px", border: "none", background: unref(copied) ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" })}">`);
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
      if ((_u = unref(auth).user) == null ? void 0 : _u.fiscalRegimen) {
        _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "18px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "1px", "margin-bottom": "10px" })}">R\xE9gimen Fiscal</div><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "700", "padding": "4px 10px", "border-radius": "20px", "background": "rgba(99,102,241,0.12)", "color": "#a5b4fc", "display": "inline-block", "margin-bottom": "6px" })}">${ssrInterpolate(unref(auth).user.fiscalRegimen)}</span><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(148,163,184,0.75)", "line-height": "1.4" })}">${ssrInterpolate(regimenNombre(unref(auth).user.fiscalRegimen))}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "16px" })}">`);
      if (!((_v = unref(auth).user) == null ? void 0 : _v.fiscalCompleted)) {
        _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(245,158,11,0.2)", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "padding": "32px", "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center", "gap": "14px" })}"><div style="${ssrRenderStyle({ "width": "64px", "height": "64px", "border-radius": "20px", "background": "rgba(245,158,11,0.08)", "border": "1px solid rgba(245,158,11,0.2)", "display": "flex", "align-items": "center", "justify-content": "center" })}"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"></rect><path d="M8 10h8"></path><path d="M8 14h5"></path><path d="M8 6h8"></path></svg></div><div><div style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "700", "color": "#fcd34d", "margin-bottom": "6px" })}">Sin datos fiscales registrados</div><div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.75)", "line-height": "1.6", "max-width": "320px", "margin": "0 auto" })}"> Para poder recibir facturas electr\xF3nicas (CFDI), necesitas registrar tu informaci\xF3n fiscal ante el SAT. </div></div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "8px", "width": "100%", "max-width": "280px" })}"><!--[-->`);
        ssrRenderList(pendingItems, (item) => {
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px", "text-align": "left" })}"><div style="${ssrRenderStyle({ "width": "18px", "height": "18px", "border-radius": "50%", "background": "rgba(245,158,11,0.12)", "border": "1px solid rgba(245,158,11,0.2)", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" })}"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg></div><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(148,163,184,0.7)" })}">${ssrInterpolate(item)}</span></div>`);
        });
        _push(`<!--]--></div><button style="${ssrRenderStyle({ "height": "40px", "padding": "0 28px", "border-radius": "10px", "border": "none", "background": "linear-gradient(135deg,#F59E0B,#D97706)", "color": "white", "font-size": "13px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit", "box-shadow": "0 4px 14px rgba(245,158,11,0.3)" })}"> Registrar datos fiscales </button></div></div>`);
      } else {
        _push(`<!--[--><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "padding": "14px 20px", "border-bottom": "1px solid rgba(255,255,255,0.06)", "display": "flex", "align-items": "center", "gap": "8px" })}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"></rect><path d="M8 10h8"></path><path d="M8 14h5"></path><path d="M8 6h8"></path></svg><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "700", "color": "#94a3b8", "text-transform": "uppercase", "letter-spacing": "0.8px" })}">Datos fiscales</span></div><div style="${ssrRenderStyle({ "padding": "18px 20px", "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "16px" })}">`);
        _push(ssrRenderComponent(_component_FiscalFieldItem, {
          label: "Raz\xF3n Social",
          value: unref(auth).user.fiscalRazonSocial,
          full: ""
        }, null, _parent));
        _push(ssrRenderComponent(_component_FiscalFieldItem, {
          label: "C\xF3digo Postal",
          value: unref(auth).user.fiscalCodpos
        }, null, _parent));
        _push(ssrRenderComponent(_component_FiscalFieldItem, {
          label: "Pa\xEDs",
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
            value: `${unref(auth).user.fiscalUsocfdi} \u2013 ${cfdiNombre(unref(auth).user.fiscalUsocfdi)}`,
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
              label: "N\xFAm. exterior",
              value: unref(auth).user.fiscalNumExt
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (unref(auth).user.fiscalNumInt) {
            _push(ssrRenderComponent(_component_FiscalFieldItem, {
              label: "N\xFAm. interior",
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
              label: "Delegaci\xF3n / Municipio",
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
              value: `${(_w = unref(auth).user.fiscalNombre) != null ? _w : ""} ${(_x = unref(auth).user.fiscalApellidos) != null ? _x : ""}`.trim(),
              full: ""
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (unref(auth).user.fiscalTelefono) {
            _push(ssrRenderComponent(_component_FiscalFieldItem, {
              label: "Tel\xE9fono",
              value: unref(auth).user.fiscalTelefono
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (unref(auth).user.fiscalNumregidtrib) {
            _push(ssrRenderComponent(_component_FiscalFieldItem, {
              label: "N\xFAm. Reg. ID Tributario",
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

export { _sfc_main as default };
//# sourceMappingURL=perfil-Btu3Nk4q.mjs.map
