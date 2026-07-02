import { _ as __nuxt_component_0 } from './nuxt-link-BuVqOM4V.mjs';
import { defineComponent, computed, ref, watch, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderTeleport, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { ShoppingCart, AlertCircle, Search, Clock, User, ChevronRight, Package, X } from '@lucide/vue';
import { u as useAuthStore } from './auth-De5_qdGe.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "orders",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const isManager = computed(() => {
      var _a, _b;
      return ((_a = auth.user) == null ? void 0 : _a.role) === "admin" || ((_b = auth.user) == null ? void 0 : _b.role) === "approver";
    });
    const orders2 = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const detail = ref(null);
    const search = ref("");
    const searchFocus = ref(false);
    const activeTab = ref("all");
    const actionLoading = ref(false);
    const actionError = ref(null);
    const actionSuccess = ref(null);
    const statusCfg = {
      pending: { label: "Pendiente", dot: "#f59e0b", color: "#fbbf24", bg: "rgba(245,158,11,0.12)" },
      approved: { label: "Aprobada", dot: "#10b981", color: "#34d399", bg: "rgba(16,185,129,0.12)" },
      rejected: { label: "Rechazada", dot: "#f43f5e", color: "#fb7185", bg: "rgba(244,63,94,0.12)" },
      processing: { label: "En proceso", dot: "#0ea5e9", color: "#38bdf8", bg: "rgba(14,165,233,0.12)" },
      shipped: { label: "Enviada", dot: "#6366f1", color: "#818cf8", bg: "rgba(99,102,241,0.12)" },
      delivered: { label: "Entregada", dot: "#10b981", color: "#34d399", bg: "rgba(16,185,129,0.12)" }
    };
    const priCfg = {
      low: { label: "Baja", color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
      normal: { label: "Normal", color: "#38bdf8", bg: "rgba(14,165,233,0.1)" },
      high: { label: "Alta", color: "#fbbf24", bg: "rgba(245,158,11,0.1)" },
      urgent: { label: "Urgente", color: "#fb7185", bg: "rgba(244,63,94,0.1)" }
    };
    const tabs = [
      { key: "all", label: "Todas" },
      { key: "pending", label: "Pendientes" },
      { key: "approved", label: "Aprobadas" },
      { key: "processing", label: "En proceso" },
      { key: "shipped", label: "Enviadas" },
      { key: "delivered", label: "Entregadas" },
      { key: "rejected", label: "Rechazadas" }
    ];
    const timeline = [
      { key: "pending", label: "Pendiente", color: "#fbbf24", icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>' },
      { key: "approved", label: "Aprobada", color: "#34d399", icon: '<polyline points="20 6 9 17 4 12"/>' },
      { key: "processing", label: "En proceso", color: "#38bdf8", icon: '<path d="M12 22C6.5 22 2 17.5 2 12A10 10 0 0 1 12 2c5.5 0 10 4.5 10 10"/><polyline points="12 6 12 12 16 14"/>' },
      { key: "shipped", label: "Enviada", color: "#818cf8", icon: '<path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect width="13" height="13" x="9" y="9" rx="2"/>' },
      { key: "delivered", label: "Entregada", color: "#34d399", icon: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>' }
    ];
    const ORDER_FLOW = ["pending", "approved", "processing", "shipped", "delivered"];
    function stepState(stepKey, currentStatus) {
      if (currentStatus === "rejected") return stepKey === "pending" ? "done" : "pending";
      const currentIdx = ORDER_FLOW.indexOf(currentStatus);
      const stepIdx = ORDER_FLOW.indexOf(stepKey);
      if (stepIdx < currentIdx) return "done";
      if (stepIdx === currentIdx) return "active";
      return "pending";
    }
    const timelineProgress = computed(() => {
      if (!detail.value) return 0;
      if (detail.value.status === "rejected") return 0;
      const idx = ORDER_FLOW.indexOf(detail.value.status);
      if (idx < 0) return 0;
      return idx / (ORDER_FLOW.length - 1) * 100;
    });
    const filtered = computed(() => orders2.value.filter((o) => {
      var _a;
      if (activeTab.value !== "all" && o.status !== activeTab.value) return false;
      const q = search.value.toLowerCase();
      if (!q) return true;
      return o.id.toLowerCase().includes(q) || ((_a = o.userName) != null ? _a : "").toLowerCase().includes(q);
    }));
    function tabCount(key) {
      return key === "all" ? orders2.value.length : orders2.value.filter((o) => o.status === key).length;
    }
    const tracking = ref(null);
    const trackingLoading = ref(false);
    const trackingError = ref("");
    const trackingJustUpdated = ref(false);
    watch(detail, () => {
      tracking.value = null;
      trackingError.value = "";
      trackingJustUpdated.value = false;
    });
    const trackingStatusCfg = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
      const s = ((_d = (_c = (_a = tracking.value) == null ? void 0 : _a.estatus) != null ? _c : (_b = tracking.value) == null ? void 0 : _b.estado) != null ? _d : "").toLowerCase();
      if (s.includes("entrega") || s.includes("recib"))
        return { dot: "#22c55e", color: "#4ade80", label: (_f = (_e = tracking.value) == null ? void 0 : _e.estatus) != null ? _f : "Entregado" };
      if (s.includes("enviad") || s.includes("transit"))
        return { dot: "#06b6d4", color: "#22d3ee", label: (_h = (_g = tracking.value) == null ? void 0 : _g.estatus) != null ? _h : "En tr\xE1nsito" };
      if (s.includes("cancel"))
        return { dot: "#f43f5e", color: "#fb7185", label: (_j = (_i = tracking.value) == null ? void 0 : _i.estatus) != null ? _j : "Cancelado" };
      return { dot: "#0ea5e9", color: "#38bdf8", label: (_n = (_m = (_k = tracking.value) == null ? void 0 : _k.estatus) != null ? _m : (_l = tracking.value) == null ? void 0 : _l.estado) != null ? _n : "En proceso" };
    });
    const fmtCurrency = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
    const fmtDate = (d) => new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));
    const fmtDateLong = (d) => new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(d));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><div style="${ssrRenderStyle({ fontFamily: `'Inter',system-ui,sans-serif`, display: "flex", flexDirection: "column", gap: "20px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "flex-wrap": "wrap", "gap": "12px" })}" data-v-57d520cc><div data-v-57d520cc><h1 style="${ssrRenderStyle({ "font-size": "22px", "font-weight": "800", "color": "#F1F5F9", "margin": "0" })}" data-v-57d520cc>${ssrInterpolate(unref(isManager) ? "Todas las \xF3rdenes" : "Mis \xF3rdenes")}</h1><p style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.85)", "margin-top": "4px" })}" data-v-57d520cc>${ssrInterpolate(unref(loading) ? "Cargando\u2026" : `${unref(orders2).length} orden${unref(orders2).length !== 1 ? "es" : ""}`)}</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/cart",
        style: { "display": "inline-flex", "align-items": "center", "gap": "7px", "height": "36px", "padding": "0 16px", "border-radius": "9px", "border": "none", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-size": "12px", "font-weight": "600", "cursor": "pointer", "text-decoration": "none", "box-shadow": "0 3px 12px rgba(14,165,233,0.3)" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ShoppingCart), { size: 13 }, null, _parent2, _scopeId));
            _push2(` Nueva orden `);
          } else {
            return [
              createVNode(unref(ShoppingCart), { size: 13 }),
              createTextVNode(" Nueva orden ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(error)) {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "10px", "padding": "12px 16px", "border-radius": "10px", "background": "rgba(244,63,94,0.08)", "border": "1px solid rgba(244,63,94,0.2)", "color": "#fb7185", "font-size": "13px" })}" data-v-57d520cc>`);
        _push(ssrRenderComponent(unref(AlertCircle), {
          size: 16,
          style: { "flex-shrink": "0" }
        }, null, _parent));
        _push(`<span data-v-57d520cc>${ssrInterpolate(unref(error))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "14px 16px", "display": "flex", "flex-direction": "column", "gap": "12px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "position": "relative", "max-width": "380px" })}" data-v-57d520cc>`);
      _push(ssrRenderComponent(unref(Search), {
        size: 14,
        style: { "position": "absolute", "left": "13px", "top": "50%", "transform": "translateY(-50%)", "pointer-events": "none" },
        color: unref(searchFocus) ? "#0EA5E9" : "rgba(100,116,139,0.7)"
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(search))} placeholder="Buscar por ID o usuario\u2026" style="${ssrRenderStyle({ width: "100%", height: "40px", background: unref(searchFocus) ? "rgba(14,165,233,0.06)" : "rgba(255,255,255,0.04)", border: `1px solid ${unref(searchFocus) ? "rgba(14,165,233,0.45)" : "rgba(255,255,255,0.09)"}`, borderRadius: "10px", paddingLeft: "38px", paddingRight: "14px", fontSize: "13px", color: "#E2E8F0", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "all 0.2s" })}" data-v-57d520cc></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "6px", "flex-wrap": "wrap" })}" data-v-57d520cc><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button style="${ssrRenderStyle({ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0, height: "30px", padding: "0 12px", borderRadius: "6px", fontSize: "12px", fontWeight: unref(activeTab) === tab.key ? 600 : 400, cursor: "pointer", border: "none", fontFamily: "inherit", background: unref(activeTab) === tab.key ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.04)", color: unref(activeTab) === tab.key ? "#38bdf8" : "rgba(100,116,139,0.75)", outline: `1px solid ${unref(activeTab) === tab.key ? "rgba(14,165,233,0.35)" : "rgba(255,255,255,0.07)"}` })}" data-v-57d520cc>${ssrInterpolate(tab.label)} `);
        if (!unref(loading)) {
          _push(`<span style="${ssrRenderStyle({ fontSize: "10px", fontWeight: 700, background: unref(activeTab) === tab.key ? "rgba(14,165,233,0.2)" : "rgba(255,255,255,0.07)", padding: "1px 5px", borderRadius: "4px", color: unref(activeTab) === tab.key ? "#38bdf8" : "rgba(100,116,139,0.8)" })}" data-v-57d520cc>${ssrInterpolate(tabCount(tab.key))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div></div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "8px" })}" data-v-57d520cc>`);
      if (unref(loading)) {
        _push(`<!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div style="${ssrRenderStyle({ "border-radius": "14px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "16px 18px", "display": "flex", "align-items": "center", "gap": "14px" })}" data-v-57d520cc><div class="shimmer-bg" style="${ssrRenderStyle({ "width": "10px", "height": "10px", "border-radius": "50%", "background": "rgba(255,255,255,0.08)" })}" data-v-57d520cc></div><div style="${ssrRenderStyle({ "flex": "1", "display": "flex", "flex-direction": "column", "gap": "7px" })}" data-v-57d520cc><div class="shimmer-bg" style="${ssrRenderStyle({ "height": "13px", "width": "160px", "border-radius": "6px", "background": "rgba(255,255,255,0.07)" })}" data-v-57d520cc></div><div class="shimmer-bg" style="${ssrRenderStyle({ "height": "11px", "width": "220px", "border-radius": "6px", "background": "rgba(255,255,255,0.04)" })}" data-v-57d520cc></div></div><div class="shimmer-bg" style="${ssrRenderStyle({ "height": "14px", "width": "80px", "border-radius": "6px", "background": "rgba(255,255,255,0.07)" })}" data-v-57d520cc></div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(filtered), (order) => {
          var _a, _b, _c, _d, _e, _f;
          _push(`<div style="${ssrRenderStyle({ borderRadius: "14px", background: "linear-gradient(160deg,#0D1B35,#091228)", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", boxShadow: "0 3px 14px rgba(0,0,0,0.3)", transition: "all 0.18s", cursor: "pointer" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "14px", "padding": "14px 18px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ width: "9px", height: "9px", borderRadius: "50%", background: statusCfg[order.status].dot, boxShadow: `0 0 7px ${statusCfg[order.status].dot}80`, flexShrink: 0 })}" data-v-57d520cc></div><div style="${ssrRenderStyle({ "flex": "1", "min-width": "0" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px", "flex-wrap": "wrap", "margin-bottom": "4px" })}" data-v-57d520cc><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "700", "color": "#E2E8F0", "font-family": "monospace" })}" data-v-57d520cc>${ssrInterpolate(order.id.slice(-8).toUpperCase())}</span><span style="${ssrRenderStyle({ fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px", background: statusCfg[order.status].bg, color: statusCfg[order.status].color })}" data-v-57d520cc>${ssrInterpolate(statusCfg[order.status].label)}</span><span style="${ssrRenderStyle({ fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px", background: (_b = (_a = priCfg[order.priority]) == null ? void 0 : _a.bg) != null ? _b : priCfg.normal.bg, color: (_d = (_c = priCfg[order.priority]) == null ? void 0 : _c.color) != null ? _d : priCfg.normal.color })}" data-v-57d520cc>${ssrInterpolate((_f = (_e = priCfg[order.priority]) == null ? void 0 : _e.label) != null ? _f : "Normal")}</span></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "6px" })}" data-v-57d520cc>`);
          _push(ssrRenderComponent(unref(Clock), {
            size: 11,
            color: "rgba(100,116,139,0.6)"
          }, null, _parent));
          _push(`<span style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.8)" })}" data-v-57d520cc>${ssrInterpolate(fmtDate(order.createdAt))}</span>`);
          if (unref(isManager) && order.userName) {
            _push(`<!--[--><span style="${ssrRenderStyle({ "color": "rgba(71,85,105,0.5)", "font-size": "11px" })}" data-v-57d520cc>\xB7</span>`);
            _push(ssrRenderComponent(unref(User), {
              size: 11,
              color: "rgba(100,116,139,0.5)"
            }, null, _parent));
            _push(`<span style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.8)" })}" data-v-57d520cc>${ssrInterpolate(order.userName)}</span><!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div style="${ssrRenderStyle({ "text-align": "center", "flex-shrink": "0" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#E2E8F0" })}" data-v-57d520cc>${ssrInterpolate(order.items.length)}</div><div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,116,139,0.6)" })}" data-v-57d520cc>producto${ssrInterpolate(order.items.length !== 1 ? "s" : "")}</div></div><div style="${ssrRenderStyle({ "text-align": "right", "flex-shrink": "0" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "font-size": "14px", "font-weight": "700", "color": "#F1F5F9" })}" data-v-57d520cc>${ssrInterpolate(order.total > 0 ? fmtCurrency(order.total) : "\u2014")}</div><div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,116,139,0.6)", "margin-top": "1px" })}" data-v-57d520cc>MXN</div></div>`);
          _push(ssrRenderComponent(unref(ChevronRight), {
            size: 15,
            color: "rgba(100,116,139,0.5)",
            style: { "flex-shrink": "0" }
          }, null, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]-->`);
      }
      if (!unref(loading) && !unref(error) && !unref(filtered).length) {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", "padding": "60px", "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "gap": "12px" })}" data-v-57d520cc>`);
        _push(ssrRenderComponent(unref(Package), {
          size: 36,
          color: "rgba(100,116,139,0.5)",
          "stroke-width": 1.5
        }, null, _parent));
        _push(`<div style="${ssrRenderStyle({ "font-size": "14px", "font-weight": "600", "color": "#94a3b8" })}" data-v-57d520cc>Sin \xF3rdenes</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.7)" })}" data-v-57d520cc>${ssrInterpolate(unref(activeTab) === "all" ? "A\xFAn no tienes \xF3rdenes" : "No hay \xF3rdenes con este estado")}</div>`);
        if (unref(activeTab) === "all") {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/cart",
            style: { "margin-top": "4px", "display": "inline-flex", "align-items": "center", "gap": "7px", "height": "38px", "padding": "0 18px", "border-radius": "9px", "border": "none", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-size": "12px", "font-weight": "600", "cursor": "pointer", "text-decoration": "none" }
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(ShoppingCart), { size: 13 }, null, _parent2, _scopeId));
                _push2(` Crear una orden `);
              } else {
                return [
                  createVNode(unref(ShoppingCart), { size: 13 }),
                  createTextVNode(" Crear una orden ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        var _a, _b, _c, _d, _e, _f;
        if (unref(detail)) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "background": "rgba(2,6,14,0.82)", "backdrop-filter": "blur(7px)", "z-index": "1050" })}" data-v-57d520cc></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(detail)) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "z-index": "1051", "display": "flex", "align-items": "center", "justify-content": "center", "padding": "16px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "width": "100%", "max-width": "600px", "max-height": "92vh", "display": "flex", "flex-direction": "column" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "position": "relative", "display": "flex", "flex-direction": "column", "min-height": "0" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "position": "absolute", "inset": "-1px", "border-radius": "22px", "background": "linear-gradient(135deg,rgba(14,165,233,0.3),rgba(124,58,237,0.2),rgba(14,165,233,0.08))", "z-index": "0", "pointer-events": "none" })}" data-v-57d520cc></div><div style="${ssrRenderStyle({ "position": "relative", "z-index": "1", "border-radius": "22px", "background": "linear-gradient(160deg,#0D1B35,#09122A)", "box-shadow": "0 32px 80px rgba(0,0,0,0.75)", "display": "flex", "flex-direction": "column", "min-height": "0" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "padding": "22px 24px 0", "flex-shrink": "0" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "position": "absolute", "top": "0", "left": "15%", "right": "15%", "height": "1px", "background": "linear-gradient(90deg,transparent,rgba(14,165,233,0.6),transparent)", "border-radius": "999px" })}" data-v-57d520cc></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "gap": "12px", "margin-bottom": "14px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "min-width": "0" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px", "flex-wrap": "wrap" })}" data-v-57d520cc><span style="${ssrRenderStyle({ "font-size": "16px", "font-weight": "800", "color": "#F1F5F9", "font-family": "monospace", "letter-spacing": "0.5px" })}" data-v-57d520cc>${ssrInterpolate(unref(detail).id.slice(-10).toUpperCase())}</span><span style="${ssrRenderStyle({ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: statusCfg[unref(detail).status].bg, color: statusCfg[unref(detail).status].color })}" data-v-57d520cc>${ssrInterpolate(statusCfg[unref(detail).status].label)}</span><span style="${ssrRenderStyle({ fontSize: "11px", fontWeight: 600, padding: "3px 9px", borderRadius: "20px", background: (_b = (_a = priCfg[unref(detail).priority]) == null ? void 0 : _a.bg) != null ? _b : priCfg.normal.bg, color: (_d = (_c = priCfg[unref(detail).priority]) == null ? void 0 : _c.color) != null ? _d : priCfg.normal.color })}" data-v-57d520cc>${ssrInterpolate((_f = (_e = priCfg[unref(detail).priority]) == null ? void 0 : _e.label) != null ? _f : "Normal")}</span></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "5px", "margin-top": "5px", "flex-wrap": "wrap" })}" data-v-57d520cc>`);
          _push2(ssrRenderComponent(unref(Clock), {
            size: 11,
            color: "rgba(100,116,139,0.6)"
          }, null, _parent));
          _push2(`<span style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.7)" })}" data-v-57d520cc>${ssrInterpolate(fmtDateLong(unref(detail).createdAt))}</span>`);
          if (unref(isManager) && unref(detail).userName) {
            _push2(`<!--[--><span style="${ssrRenderStyle({ "color": "rgba(71,85,105,0.5)" })}" data-v-57d520cc>\xB7</span>`);
            _push2(ssrRenderComponent(unref(User), {
              size: 11,
              color: "rgba(100,116,139,0.5)"
            }, null, _parent));
            _push2(`<span style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.7)" })}" data-v-57d520cc>${ssrInterpolate(unref(detail).userName)}</span><!--]-->`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div><button style="${ssrRenderStyle({ "width": "30px", "height": "30px", "border-radius": "8px", "background": "rgba(255,255,255,0.05)", "border": "1px solid rgba(255,255,255,0.1)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "flex-shrink": "0" })}" data-v-57d520cc>`);
          _push2(ssrRenderComponent(unref(X), {
            size: 14,
            color: "rgba(148,163,184,0.8)"
          }, null, _parent));
          _push2(`</button></div><div style="${ssrRenderStyle({ "position": "relative", "padding": "0 14px", "margin-bottom": "20px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "position": "absolute", "top": "13px", "left": "14px", "right": "14px", "height": "2px", "background": "rgba(255,255,255,0.08)", "border-radius": "2px" })}" data-v-57d520cc></div><div style="${ssrRenderStyle({ position: "absolute", top: "13px", left: "14px", height: "2px", borderRadius: "2px", background: `linear-gradient(90deg,#fbbf24,#34d399,#38bdf8,#818cf8)`, width: unref(timelineProgress) + "%", transition: "width 0.4s ease" })}" data-v-57d520cc></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "position": "relative" })}" data-v-57d520cc><!--[-->`);
          ssrRenderList(timeline, (step) => {
            var _a2;
            _push2(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "gap": "6px", "width": "52px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: stepState(step.key, unref(detail).status) === "done" ? step.color + "28" : stepState(step.key, unref(detail).status) === "active" ? step.color + "38" : "rgba(9,18,40,1)", border: `2px solid ${stepState(step.key, unref(detail).status) !== "pending" ? step.color : "rgba(255,255,255,0.12)"}`, boxShadow: stepState(step.key, unref(detail).status) === "active" ? `0 0 12px ${step.color}60` : "none", transition: "all 0.25s", zIndex: 1 })}" data-v-57d520cc><svg width="11" height="11" viewBox="0 0 24 24" fill="none"${ssrRenderAttr("stroke", stepState(step.key, unref(detail).status) !== "pending" ? step.color : "rgba(100,116,139,0.35)")} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-57d520cc>${(_a2 = step.icon) != null ? _a2 : ""}</svg></div><span style="${ssrRenderStyle({ fontSize: "9px", fontWeight: stepState(step.key, unref(detail).status) === "active" ? 700 : 500, color: stepState(step.key, unref(detail).status) !== "pending" ? step.color : "rgba(100,116,139,0.4)", textAlign: "center", lineHeight: 1.2, whiteSpace: "nowrap" })}" data-v-57d520cc>${ssrInterpolate(step.label)}</span></div>`);
          });
          _push2(`<!--]--></div></div></div><div style="${ssrRenderStyle({ "overflow-y": "auto", "flex": "1", "min-height": "0", "padding": "0 24px 24px", "display": "flex", "flex-direction": "column", "gap": "14px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "border-radius": "14px", "background": "rgba(255,255,255,0.02)", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "padding": "11px 16px", "border-bottom": "1px solid rgba(255,255,255,0.06)", "display": "flex", "align-items": "center", "gap": "6px" })}" data-v-57d520cc>`);
          _push2(ssrRenderComponent(unref(Package), {
            size: 12,
            color: "rgba(100,116,139,0.6)"
          }, null, _parent));
          _push2(`<span style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "700", "color": "rgba(100,116,139,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px" })}" data-v-57d520cc>Productos \xB7 ${ssrInterpolate(unref(detail).items.length)}</span></div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column" })}" data-v-57d520cc><!--[-->`);
          ssrRenderList(unref(detail).items, (item, idx) => {
            var _a2;
            _push2(`<div style="${ssrRenderStyle({ display: "flex", alignItems: "center", gap: "12px", padding: "11px 16px", borderBottom: idx < unref(detail).items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "width": "40px", "height": "40px", "border-radius": "10px", "background": "rgba(14,165,233,0.07)", "border": "1px solid rgba(14,165,233,0.12)", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0", "overflow": "hidden" })}" data-v-57d520cc>`);
            if ((_a2 = item.images) == null ? void 0 : _a2[0]) {
              _push2(`<img${ssrRenderAttr("src", item.images[0])} style="${ssrRenderStyle({ "width": "36px", "height": "36px", "object-fit": "contain" })}" data-v-57d520cc>`);
            } else {
              _push2(ssrRenderComponent(unref(Package), {
                size: 16,
                color: "#38bdf8",
                "stroke-width": 1.5
              }, null, _parent));
            }
            _push2(`</div><div style="${ssrRenderStyle({ "flex": "1", "min-width": "0" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "500", "color": "#CBD5E1", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" })}" data-v-57d520cc>${ssrInterpolate(item.name)}</div><div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,116,139,0.55)", "font-family": "monospace", "margin-top": "2px" })}" data-v-57d520cc>${ssrInterpolate(item.sku)}</div></div><div style="${ssrRenderStyle({ "flex-shrink": "0", "text-align": "right" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#94a3b8" })}" data-v-57d520cc>\xD7 ${ssrInterpolate(item.quantity)}</div>`);
            if (item.price > 0) {
              _push2(`<div style="${ssrRenderStyle({ "font-size": "11px", "color": "#64748b", "margin-top": "2px" })}" data-v-57d520cc>${ssrInterpolate(fmtCurrency(item.price * item.quantity))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          });
          _push2(`<!--]--></div></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "padding": "14px 18px", "border-radius": "14px", "background": "rgba(14,165,233,0.06)", "border": "1px solid rgba(14,165,233,0.14)" })}" data-v-57d520cc><span style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "600", "color": "#94a3b8" })}" data-v-57d520cc>Total de la orden</span><span style="${ssrRenderStyle({ "font-size": "20px", "font-weight": "800", "color": "#F1F5F9" })}" data-v-57d520cc>${ssrInterpolate(fmtCurrency(unref(detail).total))}</span></div><div style="${ssrRenderStyle({ "border-radius": "14px", "background": "rgba(255,255,255,0.02)", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "padding": "11px 16px", "border-bottom": "1px solid rgba(255,255,255,0.06)" })}" data-v-57d520cc><span style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "700", "color": "rgba(100,116,139,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px" })}" data-v-57d520cc>Informaci\xF3n</span></div><div style="${ssrRenderStyle({ "padding": "14px 16px", "display": "flex", "flex-direction": "column", "gap": "10px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "12px" })}" data-v-57d520cc><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.65)", "flex-shrink": "0" })}" data-v-57d520cc>ID</span><span style="${ssrRenderStyle({ "font-size": "11px", "color": "#64748b", "font-family": "monospace", "text-align": "right", "word-break": "break-all" })}" data-v-57d520cc>${ssrInterpolate(unref(detail).id)}</span></div><div style="${ssrRenderStyle({ "height": "1px", "background": "rgba(255,255,255,0.05)" })}" data-v-57d520cc></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "12px" })}" data-v-57d520cc><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.65)", "flex-shrink": "0" })}" data-v-57d520cc>Creada</span><span style="${ssrRenderStyle({ "font-size": "12px", "color": "#94a3b8" })}" data-v-57d520cc>${ssrInterpolate(fmtDateLong(unref(detail).createdAt))}</span></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "12px" })}" data-v-57d520cc><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.65)", "flex-shrink": "0" })}" data-v-57d520cc>Actualizada</span><span style="${ssrRenderStyle({ "font-size": "12px", "color": "#94a3b8" })}" data-v-57d520cc>${ssrInterpolate(fmtDateLong(unref(detail).updatedAt))}</span></div>`);
          if (unref(isManager) && unref(detail).userName) {
            _push2(`<!--[--><div style="${ssrRenderStyle({ "height": "1px", "background": "rgba(255,255,255,0.05)" })}" data-v-57d520cc></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "12px" })}" data-v-57d520cc><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.65)", "flex-shrink": "0" })}" data-v-57d520cc>Solicitante</span><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#CBD5E1" })}" data-v-57d520cc>${ssrInterpolate(unref(detail).userName)}</span></div>`);
            if (unref(detail).userEmail) {
              _push2(`<div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "gap": "12px" })}" data-v-57d520cc><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.65)", "flex-shrink": "0" })}" data-v-57d520cc>Email</span><span style="${ssrRenderStyle({ "font-size": "12px", "color": "#94a3b8" })}" data-v-57d520cc>${ssrInterpolate(unref(detail).userEmail)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--]-->`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
          if (unref(detail).syscomFolio) {
            _push2(`<div style="${ssrRenderStyle({ "border-radius": "14px", "background": "rgba(16,185,129,0.06)", "border": "1px solid rgba(16,185,129,0.2)", "overflow": "hidden" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "padding": "14px 16px", "display": "flex", "align-items": "center", "justify-content": "space-between", "gap": "10px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "10px" })}" data-v-57d520cc><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${ssrRenderStyle({ "flex-shrink": "0" })}" data-v-57d520cc><rect width="14" height="17" x="5" y="2" rx="2" data-v-57d520cc></rect><path d="M9 7h6M9 11h6M9 15h4" data-v-57d520cc></path></svg><div data-v-57d520cc><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "700", "color": "rgba(52,211,153,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "3px" })}" data-v-57d520cc>Folio SYSCOM</div><div style="${ssrRenderStyle({ "font-size": "14px", "font-weight": "700", "color": "#6ee7b7", "font-family": "monospace" })}" data-v-57d520cc>${ssrInterpolate(unref(detail).syscomFolio)}</div></div></div><button${ssrIncludeBooleanAttr(unref(trackingLoading)) ? " disabled" : ""} style="${ssrRenderStyle({ height: "32px", padding: "0 14px", borderRadius: "8px", border: "1px solid rgba(52,211,153,0.3)", background: unref(trackingLoading) ? "rgba(16,185,129,0.05)" : "rgba(16,185,129,0.1)", color: "#34d399", fontSize: "11px", fontWeight: 700, cursor: unref(trackingLoading) ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, opacity: unref(trackingLoading) ? 0.7 : 1 })}" data-v-57d520cc>`);
            if (unref(trackingLoading)) {
              _push2(`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin" data-v-57d520cc><path d="M21 12a9 9 0 1 1-6.219-8.56" data-v-57d520cc></path></svg>`);
            } else {
              _push2(`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-57d520cc><path d="M21 2v6h-6" data-v-57d520cc></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8" data-v-57d520cc></path><path d="M3 22v-6h6" data-v-57d520cc></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16" data-v-57d520cc></path></svg>`);
            }
            _push2(` ${ssrInterpolate(unref(trackingLoading) ? "Consultando\u2026" : "Ver estado")}</button></div>`);
            if (unref(tracking)) {
              _push2(`<div style="${ssrRenderStyle({ "border-top": "1px solid rgba(16,185,129,0.15)", "padding": "14px 16px", "display": "flex", "flex-direction": "column", "gap": "12px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "10px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ width: "8px", height: "8px", borderRadius: "50%", background: unref(trackingStatusCfg).dot, boxShadow: `0 0 6px ${unref(trackingStatusCfg).dot}80`, flexShrink: 0 })}" data-v-57d520cc></div><div data-v-57d520cc><div style="${ssrRenderStyle([{ "font-size": "13px", "font-weight": "700" }, { color: unref(trackingStatusCfg).color }])}" data-v-57d520cc>${ssrInterpolate(unref(trackingStatusCfg).label)}</div>`);
              if (unref(tracking).fecha_creacion) {
                _push2(`<div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,116,139,0.6)", "margin-top": "2px" })}" data-v-57d520cc>Pedido creado: ${ssrInterpolate(unref(tracking).fecha_creacion)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              if (unref(trackingJustUpdated)) {
                _push2(`<div style="${ssrRenderStyle({ "margin-left": "auto", "font-size": "10px", "font-weight": "600", "padding": "2px 8px", "border-radius": "20px", "background": "rgba(16,185,129,0.15)", "color": "#34d399" })}" data-v-57d520cc> \u2713 Estado actualizado </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              if (unref(tracking).fecha_entrega) {
                _push2(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "10px", "padding": "10px 14px", "border-radius": "10px", "background": "rgba(99,102,241,0.07)", "border": "1px solid rgba(99,102,241,0.15)" })}" data-v-57d520cc><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${ssrRenderStyle({ "flex-shrink": "0" })}" data-v-57d520cc><rect width="18" height="18" x="3" y="4" rx="2" data-v-57d520cc></rect><path d="M16 2v4M8 2v4M3 10h18" data-v-57d520cc></path></svg><div data-v-57d520cc><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(129,140,248,0.7)", "text-transform": "uppercase", "letter-spacing": "0.7px" })}" data-v-57d520cc>Entrega estimada</div><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#a5b4fc", "margin-top": "2px" })}" data-v-57d520cc>${ssrInterpolate(unref(tracking).fecha_entrega)}</div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(tracking).datos_entrega) {
                _push2(`<div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.7)", "line-height": "1.6" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.5)", "text-transform": "uppercase", "letter-spacing": "0.7px", "margin-bottom": "4px" })}" data-v-57d520cc>Enviar a</div>`);
                if (unref(tracking).datos_entrega.atencion_a) {
                  _push2(`<div style="${ssrRenderStyle({ "font-weight": "600", "color": "#94a3b8" })}" data-v-57d520cc>${ssrInterpolate(unref(tracking).datos_entrega.atencion_a)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div data-v-57d520cc>${ssrInterpolate([unref(tracking).datos_entrega.calle, unref(tracking).datos_entrega.num_exterior].filter(Boolean).join(" "))}</div><div data-v-57d520cc>${ssrInterpolate([unref(tracking).datos_entrega.colonia, unref(tracking).datos_entrega.ciudad, unref(tracking).datos_entrega.estado].filter(Boolean).join(", "))}</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(trackingError)) {
                _push2(`<div style="${ssrRenderStyle({ "font-size": "11px", "color": "#fb7185" })}" data-v-57d520cc>${ssrInterpolate(unref(trackingError))}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(trackingError) && !unref(tracking)) {
              _push2(`<div style="${ssrRenderStyle({ "padding": "10px 16px", "border-top": "1px solid rgba(244,63,94,0.15)", "font-size": "11px", "color": "#fb7185" })}" data-v-57d520cc>${ssrInterpolate(unref(trackingError))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(detail).notes) {
            _push2(`<div style="${ssrRenderStyle({ "border-radius": "14px", "background": "rgba(99,102,241,0.06)", "border": "1px solid rgba(99,102,241,0.18)", "padding": "14px 16px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "700", "color": "rgba(129,140,248,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "8px" })}" data-v-57d520cc>Notas</div><p style="${ssrRenderStyle({ "font-size": "13px", "color": "#94a3b8", "line-height": "1.65", "margin": "0" })}" data-v-57d520cc>${ssrInterpolate(unref(detail).notes)}</p></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(isManager) && unref(detail).status === "pending") {
            _push2(`<div style="${ssrRenderStyle({ "border-radius": "14px", "background": "rgba(245,158,11,0.05)", "border": "1px solid rgba(245,158,11,0.2)", "padding": "16px" })}" data-v-57d520cc><div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "700", "color": "rgba(251,191,36,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "12px" })}" data-v-57d520cc>Acci\xF3n requerida</div>`);
            if (unref(actionError)) {
              _push2(`<div style="${ssrRenderStyle({ "padding": "9px 12px", "border-radius": "8px", "background": "rgba(244,63,94,0.1)", "border": "1px solid rgba(244,63,94,0.25)", "font-size": "12px", "color": "#fb7185", "margin-bottom": "10px" })}" data-v-57d520cc>${ssrInterpolate(unref(actionError))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(actionSuccess)) {
              _push2(`<div style="${ssrRenderStyle({ "padding": "9px 12px", "border-radius": "8px", "background": "rgba(16,185,129,0.1)", "border": "1px solid rgba(16,185,129,0.25)", "font-size": "12px", "color": "#34d399", "margin-bottom": "10px" })}" data-v-57d520cc>${ssrInterpolate(unref(actionSuccess))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div style="${ssrRenderStyle({ "display": "flex", "gap": "10px" })}" data-v-57d520cc><button${ssrIncludeBooleanAttr(unref(actionLoading)) ? " disabled" : ""} style="${ssrRenderStyle([{ "flex": "1", "height": "40px", "border-radius": "10px", "border": "1px solid rgba(244,63,94,0.35)", "background": "rgba(244,63,94,0.08)", "color": "#fb7185", "font-size": "13px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit", "transition": "all 0.15s" }, { opacity: unref(actionLoading) ? 0.5 : 1, cursor: unref(actionLoading) ? "not-allowed" : "pointer" }])}" data-v-57d520cc> Rechazar </button><button${ssrIncludeBooleanAttr(unref(actionLoading)) ? " disabled" : ""} style="${ssrRenderStyle([{ "flex": "2", "height": "40px", "border-radius": "10px", "border": "none", "background": "linear-gradient(135deg,#10B981,#059669)", "color": "white", "font-size": "13px", "font-weight": "700", "cursor": "pointer", "font-family": "inherit", "box-shadow": "0 4px 14px rgba(16,185,129,0.3)", "transition": "all 0.15s", "display": "flex", "align-items": "center", "justify-content": "center", "gap": "7px" }, { opacity: unref(actionLoading) ? 0.6 : 1, cursor: unref(actionLoading) ? "not-allowed" : "pointer" }])}" data-v-57d520cc>`);
            if (!unref(actionLoading)) {
              _push2(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-57d520cc><polyline points="20 6 9 17 4 12" data-v-57d520cc></polyline></svg>`);
            } else {
              _push2(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin" data-v-57d520cc><path d="M21 12a9 9 0 1 1-6.219-8.56" data-v-57d520cc></path></svg>`);
            }
            _push2(` ${ssrInterpolate(unref(actionLoading) ? "Procesando\u2026" : "Aprobar y enviar a SYSCOM")}</button></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orders.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const orders = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-57d520cc"]]);

export { orders as default };
//# sourceMappingURL=orders-CBsdMqRV.mjs.map
