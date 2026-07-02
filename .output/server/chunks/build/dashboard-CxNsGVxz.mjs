import { _ as __nuxt_component_0 } from './nuxt-link-BuVqOM4V.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, resolveDynamicComponent, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderVNode, ssrRenderAttr } from 'vue/server-renderer';
import { ShoppingBag, DollarSign, CalendarDays, Package, ArrowRight, TrendingUp, TrendingDown, Receipt, BarChart3 } from '@lucide/vue';
import { p as parseTotal, b as facturaStatusStyle, c as fmtCompact, d as fmtDate } from './useSyscom-Bu-iKqE2.mjs';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const YEAR = (/* @__PURE__ */ new Date()).getFullYear();
    const CURRENT_MONTH = (/* @__PURE__ */ new Date()).getMonth();
    const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const dateStr = ref("");
    const facturas = ref([]);
    const prevFacturas = ref([]);
    const loading = ref(true);
    const totalOrders = computed(() => facturas.value.length);
    const totalSpent = computed(() => facturas.value.reduce((s, f) => s + parseTotal(f.total), 0));
    const prevSpent = computed(() => prevFacturas.value.reduce((s, f) => s + parseTotal(f.total), 0));
    const avgTicket = computed(() => totalOrders.value > 0 ? totalSpent.value / totalOrders.value : 0);
    const spentDelta = computed(() => prevSpent.value > 0 ? Math.round((totalSpent.value - prevSpent.value) / prevSpent.value * 100) : 0);
    const ordersDelta = computed(() => prevFacturas.value.length > 0 ? Math.round((totalOrders.value - prevFacturas.value.length) / prevFacturas.value.length * 100) : 0);
    const thisMonth = computed(() => facturas.value.filter((f) => {
      if (!f.fecha_creacion) return false;
      const d = new Date(f.fecha_creacion);
      return d.getFullYear() === YEAR && d.getMonth() === CURRENT_MONTH;
    }));
    const monthSpent = computed(() => thisMonth.value.reduce((s, f) => s + parseTotal(f.total), 0));
    const recent = computed(() => [...facturas.value].sort((a, b) => {
      var _a, _b;
      return new Date((_a = b.fecha_creacion) != null ? _a : 0).getTime() - new Date((_b = a.fecha_creacion) != null ? _b : 0).getTime();
    }).slice(0, 6));
    const monthlyTotals = computed(() => {
      const t = Array(12).fill(0);
      facturas.value.forEach((f) => {
        if (!f.fecha_creacion) return;
        const d = new Date(f.fecha_creacion);
        if (d.getFullYear() === YEAR) t[d.getMonth()] += parseTotal(f.total);
      });
      return t;
    });
    const maxMonthly = computed(() => Math.max(...monthlyTotals.value, 1));
    const chartBars = computed(() => MONTHS.slice(0, CURRENT_MONTH + 1).map((month, i) => ({
      month,
      amount: monthlyTotals.value[i],
      pct: monthlyTotals.value[i] / maxMonthly.value,
      current: i === CURRENT_MONTH
    })));
    const statusCounts = computed(() => {
      const acc = {};
      facturas.value.forEach((f) => {
        var _a, _b;
        const l = facturaStatusStyle((_a = f.estatus) != null ? _a : f.estado).label;
        acc[l] = ((_b = acc[l]) != null ? _b : 0) + 1;
      });
      return acc;
    });
    const topStatuses = computed(() => Object.entries(statusCounts.value).sort((a, b) => b[1] - a[1]).slice(0, 4));
    const kpis = computed(() => [
      { label: `Facturas ${YEAR}`, value: loading.value ? "\u2014" : totalOrders.value.toLocaleString("es-MX"), sub: "vs. a\xF1o anterior", delta: ordersDelta.value, icon: ShoppingBag, accent: "#0EA5E9", gradient: "linear-gradient(135deg,#0EA5E9,#22D3EE)", glow: "rgba(14,165,233,0.2)" },
      { label: `Gasto total ${YEAR}`, value: loading.value ? "\u2014" : fmtCompact(totalSpent.value), sub: "vs. a\xF1o anterior", delta: spentDelta.value, icon: DollarSign, accent: "#8B5CF6", gradient: "linear-gradient(135deg,#7C3AED,#A78BFA)", glow: "rgba(139,92,246,0.2)" },
      { label: `Gasto de ${MONTHS[CURRENT_MONTH]}`, value: loading.value ? "\u2014" : monthSpent.value > 0 ? fmtCompact(monthSpent.value) : "$0", sub: `${thisMonth.value.length} factura${thisMonth.value.length !== 1 ? "s" : ""} este mes`, delta: null, icon: CalendarDays, accent: "#10B981", gradient: "linear-gradient(135deg,#10B981,#34D399)", glow: "rgba(16,185,129,0.2)" }
    ]);
    const summaryRows = computed(() => [
      { label: "Total facturas", value: loading.value ? "\u2014" : totalOrders.value.toLocaleString("es-MX") },
      { label: "Ticket promedio", value: loading.value ? "\u2014" : avgTicket.value > 0 ? fmtCompact(avgTicket.value) : "\u2014" },
      { label: "Este mes", value: loading.value ? "\u2014" : `${thisMonth.value.length} facturas` },
      { label: "A\xF1o anterior", value: loading.value ? "\u2014" : prevFacturas.value.length.toLocaleString("es-MX") }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ style: { fontFamily: `'Inter',system-ui,sans-serif`, display: "flex", flexDirection: "column", gap: "22px" } }, _attrs))}><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "gap": "16px", "flex-wrap": "wrap" })}"><div><h1 style="${ssrRenderStyle({ "font-size": "22px", "font-weight": "800", "color": "#F1F5F9", "margin": "0", "line-height": "1.25" })}"> Bienvenido,\xA0 <span style="${ssrRenderStyle({ "background": "linear-gradient(135deg,#0EA5E9,#22D3EE)", "-webkit-background-clip": "text", "-webkit-text-fill-color": "transparent" })}">${ssrInterpolate((_a = unref(auth).user) == null ? void 0 : _a.name.split(" ")[0])}</span></h1><p style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.75)", "margin": "5px 0 0", "text-transform": "capitalize" })}">${ssrInterpolate(unref(dateStr))}</p></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "8px" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/catalog" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "6px", "height": "36px", "padding": "0 14px", "border-radius": "9px", "border": "1px solid rgba(255,255,255,0.1)", "background": "rgba(255,255,255,0.04)", "color": "#94a3b8", "font-size": "12px", "font-weight": "500", "cursor": "pointer", "font-family": "inherit" })}"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Package), { size: 13 }, null, _parent2, _scopeId));
            _push2(` Nueva orden </button>`);
          } else {
            return [
              createVNode("button", { style: { "display": "flex", "align-items": "center", "gap": "6px", "height": "36px", "padding": "0 14px", "border-radius": "9px", "border": "1px solid rgba(255,255,255,0.1)", "background": "rgba(255,255,255,0.04)", "color": "#94a3b8", "font-size": "12px", "font-weight": "500", "cursor": "pointer", "font-family": "inherit" } }, [
                createVNode(unref(Package), { size: 13 }),
                createTextVNode(" Nueva orden ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/orders" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "6px", "height": "36px", "padding": "0 16px", "border-radius": "9px", "border": "none", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-size": "12px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit", "box-shadow": "0 3px 14px rgba(14,165,233,0.3)" })}"${_scopeId}> Facturas `);
            _push2(ssrRenderComponent(unref(ArrowRight), { size: 13 }, null, _parent2, _scopeId));
            _push2(`</button>`);
          } else {
            return [
              createVNode("button", { style: { "display": "flex", "align-items": "center", "gap": "6px", "height": "36px", "padding": "0 16px", "border-radius": "9px", "border": "none", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-size": "12px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit", "box-shadow": "0 3px 14px rgba(14,165,233,0.3)" } }, [
                createTextVNode(" Facturas "),
                createVNode(unref(ArrowRight), { size: 13 })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(auto-fit,minmax(220px,1fr))", "gap": "14px" })}">`);
      if (unref(loading)) {
        _push(`<!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(145deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "22px 24px" })}"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "flex-start", "margin-bottom": "20px" })}"><div class="shimmer-bg" style="${ssrRenderStyle({ "width": "40px", "height": "40px", "border-radius": "10px", "background": "rgba(255,255,255,0.07)" })}"></div><div class="shimmer-bg" style="${ssrRenderStyle({ "width": "52px", "height": "20px", "border-radius": "20px", "background": "rgba(255,255,255,0.05)" })}"></div></div><div class="shimmer-bg" style="${ssrRenderStyle({ "width": "80px", "height": "30px", "border-radius": "8px", "background": "rgba(255,255,255,0.08)", "margin-bottom": "8px" })}"></div><div class="shimmer-bg" style="${ssrRenderStyle({ "width": "120px", "height": "11px", "border-radius": "6px", "background": "rgba(255,255,255,0.05)" })}"></div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(kpis), (k) => {
          _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(145deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "22px 24px", "position": "relative", "overflow": "hidden", "box-shadow": "0 4px 20px rgba(0,0,0,0.4)", "transition": "transform 0.2s" })}"><div style="${ssrRenderStyle({ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: k.glow, filter: "blur(24px)", pointerEvents: "none" })}"></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "margin-bottom": "18px" })}"><div style="${ssrRenderStyle({ width: "40px", height: "40px", borderRadius: "10px", background: k.gradient, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px ${k.glow}` })}">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(k.icon), {
            size: 17,
            color: "white",
            "stroke-width": 2.2
          }, null), _parent);
          _push(`</div>`);
          if (k.delta !== null) {
            _push(`<div style="${ssrRenderStyle({ display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "20px", color: k.delta > 0 ? "#34d399" : k.delta < 0 ? "#fb7185" : "#94a3b8", background: k.delta > 0 ? "rgba(52,211,153,0.1)" : k.delta < 0 ? "rgba(251,113,133,0.1)" : "rgba(148,163,184,0.1)" })}">`);
            if (k.delta > 0) {
              _push(ssrRenderComponent(unref(TrendingUp), { size: 10 }, null, _parent));
            } else if (k.delta < 0) {
              _push(ssrRenderComponent(unref(TrendingDown), { size: 10 }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(` ${ssrInterpolate(k.delta !== 0 ? `${Math.abs(k.delta)}%` : "Sin cambio")}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div style="${ssrRenderStyle({ "font-size": "28px", "font-weight": "800", "color": "#F1F5F9", "letter-spacing": "-0.5px", "line-height": "1", "margin-bottom": "6px" })}">${ssrInterpolate(k.value)}</div><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "500", "color": "rgba(100,116,139,0.85)" })}">${ssrInterpolate(k.label)}</div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(71,85,105,0.75)", "margin-top": "3px" })}">${ssrInterpolate(k.sub)}</div><div style="${ssrRenderStyle({ marginTop: "18px", height: "2px", borderRadius: "999px", background: `linear-gradient(90deg,${k.accent}50,transparent)` })}"></div></div>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 300px", "gap": "16px", "align-items": "start" })}"><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(145deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden", "box-shadow": "0 4px 20px rgba(0,0,0,0.4)" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "padding": "16px 20px", "border-bottom": "1px solid rgba(255,255,255,0.06)" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px" })}">`);
      _push(ssrRenderComponent(unref(Receipt), {
        size: 14,
        color: "#38bdf8",
        "stroke-width": 1.8
      }, null, _parent));
      _push(`<span style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#E2E8F0" })}">Facturas recientes</span>`);
      if (!unref(loading)) {
        _push(`<span style="${ssrRenderStyle({ "font-size": "11px", "padding": "2px 7px", "border-radius": "20px", "background": "rgba(14,165,233,0.1)", "color": "#38bdf8", "font-weight": "600" })}">${ssrInterpolate(unref(totalOrders))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/orders",
        style: { "display": "flex", "align-items": "center", "gap": "4px", "font-size": "12px", "color": "#38bdf8", "font-weight": "500" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ver todas `);
            _push2(ssrRenderComponent(unref(ArrowRight), { size: 12 }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Ver todas "),
              createVNode(unref(ArrowRight), { size: 12 })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (!unref(loading) && unref(recent).length) {
        _push(`<div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 110px 90px", "padding": "8px 20px", "border-bottom": "1px solid rgba(255,255,255,0.04)" })}"><!--[-->`);
        ssrRenderList(["Folio", "Fecha", "Total"], (h) => {
          _push(`<div style="${ssrRenderStyle({ fontSize: "10px", fontWeight: 600, color: "rgba(71,85,105,0.8)", textTransform: "uppercase", letterSpacing: "0.7px", textAlign: h === "Total" ? "right" : "left" })}">${ssrInterpolate(h)}</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "12px", "padding": "13px 20px", "border-bottom": "1px solid rgba(255,255,255,0.03)" })}"><div class="shimmer-bg" style="${ssrRenderStyle({ "flex": "1", "height": "12px", "border-radius": "6px", "background": "rgba(255,255,255,0.06)" })}"></div><div class="shimmer-bg" style="${ssrRenderStyle({ "width": "80px", "height": "11px", "border-radius": "6px", "background": "rgba(255,255,255,0.04)" })}"></div><div class="shimmer-bg" style="${ssrRenderStyle({ "width": "60px", "height": "12px", "border-radius": "6px", "background": "rgba(255,255,255,0.06)" })}"></div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(recent), (f, i) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: `${f.folio}-${i}`,
            to: "/orders",
            style: { "text-decoration": "none" }
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a2, _b, _c, _d;
              if (_push2) {
                _push2(`<div style="${ssrRenderStyle([{ "display": "grid", "grid-template-columns": "1fr 110px 90px", "padding": "12px 20px", "transition": "background 0.15s", "cursor": "pointer" }, { borderBottom: i < unref(recent).length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }])}"${_scopeId}><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px", "min-width": "0" })}"${_scopeId}><div style="${ssrRenderStyle({ width: "6px", height: "6px", borderRadius: "50%", background: unref(facturaStatusStyle)((_a2 = f.estatus) != null ? _a2 : f.estado).dot, boxShadow: `0 0 6px ${unref(facturaStatusStyle)((_b = f.estatus) != null ? _b : f.estado).dot}80`, flexShrink: 0 })}"${_scopeId}></div><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#CBD5E1", "font-family": "monospace", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" })}"${_scopeId}>${ssrInterpolate(f.folio || "\u2014")}</span></div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.75)", "align-self": "center" })}"${_scopeId}>${ssrInterpolate(unref(fmtDate)(f.fecha_creacion))}</div><div style="${ssrRenderStyle({ "text-align": "right", "align-self": "center" })}"${_scopeId}><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "700", "color": "#F1F5F9" })}"${_scopeId}>${ssrInterpolate(unref(parseTotal)(f.total) > 0 ? unref(fmtCompact)(unref(parseTotal)(f.total)) : "\u2014")}</div>`);
                if (f.moneda) {
                  _push2(`<div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(71,85,105,0.7)" })}"${_scopeId}>${ssrInterpolate(f.moneda)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode("div", {
                    style: [{ "display": "grid", "grid-template-columns": "1fr 110px 90px", "padding": "12px 20px", "transition": "background 0.15s", "cursor": "pointer" }, { borderBottom: i < unref(recent).length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }],
                    onMouseenter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.025)",
                    onMouseleave: (e) => e.currentTarget.style.background = "transparent"
                  }, [
                    createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px", "min-width": "0" } }, [
                      createVNode("div", {
                        style: { width: "6px", height: "6px", borderRadius: "50%", background: unref(facturaStatusStyle)((_c = f.estatus) != null ? _c : f.estado).dot, boxShadow: `0 0 6px ${unref(facturaStatusStyle)((_d = f.estatus) != null ? _d : f.estado).dot}80`, flexShrink: 0 }
                      }, null, 4),
                      createVNode("span", { style: { "font-size": "12px", "font-weight": "600", "color": "#CBD5E1", "font-family": "monospace", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" } }, toDisplayString(f.folio || "\u2014"), 1)
                    ]),
                    createVNode("div", { style: { "font-size": "11px", "color": "rgba(100,116,139,0.75)", "align-self": "center" } }, toDisplayString(unref(fmtDate)(f.fecha_creacion)), 1),
                    createVNode("div", { style: { "text-align": "right", "align-self": "center" } }, [
                      createVNode("div", { style: { "font-size": "12px", "font-weight": "700", "color": "#F1F5F9" } }, toDisplayString(unref(parseTotal)(f.total) > 0 ? unref(fmtCompact)(unref(parseTotal)(f.total)) : "\u2014"), 1),
                      f.moneda ? (openBlock(), createBlock("div", {
                        key: 0,
                        style: { "font-size": "10px", "color": "rgba(71,85,105,0.7)" }
                      }, toDisplayString(f.moneda), 1)) : createCommentVNode("", true)
                    ])
                  ], 44, ["onMouseenter", "onMouseleave"])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]-->`);
      }
      if (!unref(loading) && !unref(recent).length) {
        _push(`<div style="${ssrRenderStyle({ "padding": "40px 20px", "text-align": "center", "font-size": "13px", "color": "rgba(100,116,139,0.6)" })}"> Sin facturas para ${ssrInterpolate(unref(YEAR))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "14px" })}"><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(145deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "18px 20px", "box-shadow": "0 4px 20px rgba(0,0,0,0.4)" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "margin-bottom": "18px" })}"><div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "6px", "margin-bottom": "4px" })}">`);
      _push(ssrRenderComponent(unref(BarChart3), {
        size: 13,
        color: "rgba(100,116,139,0.7)",
        "stroke-width": 1.8
      }, null, _parent));
      _push(`<span style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "600", "color": "rgba(100,116,139,0.7)", "text-transform": "uppercase", "letter-spacing": "0.7px" })}">Gasto ${ssrInterpolate(unref(YEAR))}</span></div><div style="${ssrRenderStyle({ "font-size": "20px", "font-weight": "800", "color": "#F1F5F9", "letter-spacing": "-0.3px" })}">${ssrInterpolate(unref(loading) ? "\u2014" : unref(fmtCompact)(unref(totalSpent)))}</div></div>`);
      if (!unref(loading) && unref(spentDelta) !== 0) {
        _push(`<div style="${ssrRenderStyle({ display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "20px", color: unref(spentDelta) > 0 ? "#34d399" : "#fb7185", background: unref(spentDelta) > 0 ? "rgba(52,211,153,0.1)" : "rgba(251,113,133,0.1)" })}">`);
        if (unref(spentDelta) > 0) {
          _push(ssrRenderComponent(unref(TrendingUp), { size: 10 }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(TrendingDown), { size: 10 }, null, _parent));
        }
        _push(` ${ssrInterpolate(Math.abs(unref(spentDelta)))}% </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-end", "gap": "4px", "height": "72px" })}"><!--[-->`);
      ssrRenderList(unref(chartBars), (bar, i) => {
        _push(`<div${ssrRenderAttr("title", `${bar.month}: ${unref(fmtCompact)(bar.amount)}`)} style="${ssrRenderStyle({ "flex": "1", "display": "flex", "flex-direction": "column", "align-items": "center", "gap": "4px", "height": "100%", "justify-content": "flex-end" })}"><div style="${ssrRenderStyle({ width: "100%", borderRadius: "3px 3px 2px 2px", background: bar.current ? "linear-gradient(180deg,#0EA5E9,#0284C7)" : "rgba(14,165,233,0.18)", height: `${Math.max(bar.pct * 100, 4)}%`, minHeight: "3px", transition: "height 0.65s ease-out", boxShadow: bar.current ? "0 0 10px rgba(14,165,233,0.4)" : "none" })}"></div><div style="${ssrRenderStyle({ fontSize: "8px", fontWeight: bar.current ? 700 : 400, color: bar.current ? "#38bdf8" : "rgba(100,116,139,0.5)" })}">${ssrInterpolate(bar.month)}</div></div>`);
      });
      _push(`<!--]--></div></div><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(145deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "18px 20px", "box-shadow": "0 4px 20px rgba(0,0,0,0.4)" })}"><div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "600", "color": "rgba(100,116,139,0.7)", "text-transform": "uppercase", "letter-spacing": "0.7px", "margin-bottom": "14px" })}">Resumen</div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "10px" })}"><!--[-->`);
      ssrRenderList(unref(summaryRows), (row) => {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center" })}"><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.75)" })}">${ssrInterpolate(row.label)}</span><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "700", "color": "#E2E8F0" })}">${ssrInterpolate(row.value)}</span></div>`);
      });
      _push(`<!--]--></div>`);
      if (!unref(loading) && unref(topStatuses).length) {
        _push(`<!--[--><div style="${ssrRenderStyle({ "height": "1px", "background": "rgba(255,255,255,0.06)", "margin": "14px 0" })}"></div><div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "600", "color": "rgba(100,116,139,0.7)", "text-transform": "uppercase", "letter-spacing": "0.7px", "margin-bottom": "10px" })}">Por estatus</div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "8px" })}"><!--[-->`);
        ssrRenderList(unref(topStatuses), ([label, count]) => {
          _push(`<div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "margin-bottom": "4px" })}"><span style="${ssrRenderStyle({ fontSize: "11px", color: unref(facturaStatusStyle)(label).color, fontWeight: 500 })}">${ssrInterpolate(label)}</span><span style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.7)" })}">${ssrInterpolate(count)}</span></div><div style="${ssrRenderStyle({ "height": "3px", "border-radius": "999px", "background": "rgba(255,255,255,0.06)" })}"><div style="${ssrRenderStyle({ height: "100%", borderRadius: "999px", background: unref(facturaStatusStyle)(label).dot, width: `${unref(totalOrders) > 0 ? count / unref(totalOrders) * 100 : 0}%`, transition: "width 0.7s ease-out" })}"></div></div></div>`);
        });
        _push(`<!--]--></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-CxNsGVxz.mjs.map
