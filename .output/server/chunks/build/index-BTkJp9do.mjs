import { _ as __nuxt_component_0 } from './nuxt-link-DKQTkC3E.mjs';
import { defineComponent, ref, computed, reactive, mergeProps, withCtx, createVNode, createTextVNode, openBlock, createBlock, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _imports_0 } from './_virtual_public-1NHFEfRi.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const navLinks = [
      { id: "inicio", label: "Inicio" },
      { id: "productos", label: "Productos" },
      { id: "nosotros", label: "Nosotros" },
      { id: "contacto", label: "Contacto" }
    ];
    ref(null);
    const cycleWords = ["c\xF3mputo", "redes", "servidores", "perif\xE9ricos", "seguridad"];
    const wordIndex = ref(0);
    const wordVisible = ref(true);
    const currentWord = computed(() => cycleWords[wordIndex.value]);
    const mouseX = ref(50);
    const mouseY = ref(50);
    const panelItems = [
      { name: "C\xF3mputo", sub: "Laptops \xB7 Desktops", icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>', gradient: "linear-gradient(135deg,#0EA5E9,#0284C7)", glow: "rgba(14,165,233,0.4)" },
      { name: "Redes", sub: "Switches \xB7 WiFi", icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>', gradient: "linear-gradient(135deg,#0EA5E9,#0284C7)", glow: "rgba(14,165,233,0.35)" },
      { name: "Servidores", sub: "NAS \xB7 UPS \xB7 Rack", icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><line x1="6" x2="6" y1="6" y2="6"/><line x1="6" x2="6" y1="18" y2="18"/></svg>', gradient: "linear-gradient(135deg,#F59E0B,#d97706)", glow: "rgba(245,158,11,0.35)" },
      { name: "Seguridad", sub: "CCTV \xB7 Control", icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', gradient: "linear-gradient(135deg,#f43f5e,#e11d48)", glow: "rgba(239,68,68,0.35)" }
    ];
    const trustMarks = ["Factura CFDI", "Precios de distribuidor", "Entrega a domicilio"];
    const categories = [
      {
        name: "C\xF3mputo y laptops",
        desc: "Equipos de escritorio, laptops, all-in-one y workstations para oficina y trabajo remoto.",
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>',
        gradient: "linear-gradient(135deg,#0EA5E9,#0284C7)",
        glow: "rgba(14,165,233,0.35)"
      },
      {
        name: "Redes y conectividad",
        desc: "Switches, routers, access points y cableado estructurado para tu infraestructura de red.",
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>',
        gradient: "linear-gradient(135deg,#0EA5E9,#0284C7)",
        glow: "rgba(14,165,233,0.35)"
      },
      {
        name: "Servidores y almacenamiento",
        desc: "Servidores, NAS, UPS y soluciones de respaldo para empresas de cualquier tama\xF1o.",
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><line x1="6" x2="6" y1="6" y2="6"/><line x1="6" x2="6" y1="18" y2="18"/></svg>',
        gradient: "linear-gradient(135deg,#F59E0B,#d97706)",
        glow: "rgba(245,158,11,0.3)"
      },
      {
        name: "Impresi\xF3n y perif\xE9ricos",
        desc: "Impresoras, multifuncionales, esc\xE1neres, teclados, monitores y accesorios de oficina.",
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect width="10" height="8" x="7" y="14" rx="1"/></svg>',
        gradient: "linear-gradient(135deg,#22C55E,#059669)",
        glow: "rgba(34,197,94,0.3)"
      },
      {
        name: "Seguridad electr\xF3nica",
        desc: "C\xE1maras IP, sistemas CCTV, control de acceso y alarmas para proteger tu negocio.",
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        gradient: "linear-gradient(135deg,#f43f5e,#e11d48)",
        glow: "rgba(239,68,68,0.3)"
      },
      {
        name: "Consumibles y accesorios",
        desc: "Tintas, t\xF3ners, cables, memorias, bater\xEDas y todo lo que tu equipo necesita d\xEDa a d\xEDa.",
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
        gradient: "linear-gradient(135deg,#7DD3FC,#0EA5E9)",
        glow: "rgba(34,211,238,0.3)"
      }
    ];
    const benefits = [
      {
        title: "Precios preferenciales",
        desc: "Accede a precios especiales negociados para empresas. Sin cat\xE1logos p\xFAblicos \u2014 tus precios son exclusivos.",
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
        bg: "rgba(14,165,233,0.1)",
        border: "1px solid rgba(14,165,233,0.2)"
      },
      {
        title: "Factura a tu empresa",
        desc: "Genera facturas CFDI de cada compra al momento. Proceso 100% digital, sin tr\xE1mites adicionales.",
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/></svg>',
        bg: "rgba(34,197,94,0.1)",
        border: "1px solid rgba(34,197,94,0.2)"
      },
      {
        title: "Entrega r\xE1pida",
        desc: "Rastreamos cada pedido en tiempo real. Coordinamos env\xEDos directamente a tu empresa o sucursal.",
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect width="13" height="10" x="9" y="11" rx="1"/><path d="M12 11V5"/><path d="M9 18h1m5 0h1"/><circle cx="11" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
        bg: "rgba(245,158,11,0.1)",
        border: "1px solid rgba(245,158,11,0.2)"
      },
      {
        title: "Atenci\xF3n personalizada",
        desc: "Tienes un ejecutivo dedicado para cotizaciones, soporte y seguimiento de tus compras.",
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        bg: "rgba(14,165,233,0.1)",
        border: "1px solid rgba(14,165,233,0.2)"
      }
    ];
    const navStyle = {
      position: "sticky",
      top: "0",
      zIndex: "100",
      height: "64px",
      display: "flex",
      alignItems: "center",
      background: "rgba(4,12,26,0.88)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)"
    };
    function fieldWrap(focus) {
      return {
        position: "relative",
        borderRadius: "11px",
        background: focus ? "rgba(14,165,233,0.07)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${focus ? "rgba(14,165,233,0.55)" : "rgba(255,255,255,0.12)"}`,
        transition: "all 0.2s",
        boxShadow: focus ? "0 0 0 3px rgba(14,165,233,0.08)" : "none"
      };
    }
    const form = reactive({ name: "", email: "", company: "", phone: "" });
    const nameFocus = ref(false);
    const emailFocus = ref(false);
    const companyFocus = ref(false);
    const phoneFocus = ref(false);
    const reqLoading = ref(false);
    const reqError = ref("");
    const requestSent = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ style: { "min-height": "100vh", "background": "#06101E", "font-family": "'Inter',system-ui,sans-serif", "color": "#E2EAF4", "overflow-x": "hidden" } }, _attrs))}><nav style="${ssrRenderStyle(navStyle)}"><div style="${ssrRenderStyle({ "width": "100%", "max-width": "1200px", "margin": "0 auto", "padding": "0 24px", "display": "flex", "align-items": "center", "gap": "20px" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        style: { "display": "flex", "align-items": "center", "gap": "10px", "flex-shrink": "0", "text-decoration": "none" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "700", "color": "#E2EAF4", "letter-spacing": "-0.3px" })}"${_scopeId}>SIEEG <span style="${ssrRenderStyle({ "color": "#0EA5E9" })}"${_scopeId}>INTEGRADORES</span></span>`);
          } else {
            return [
              createVNode("span", { style: { "font-size": "15px", "font-weight": "700", "color": "#E2EAF4", "letter-spacing": "-0.3px" } }, [
                createTextVNode("SIEEG "),
                createVNode("span", { style: { "color": "#0EA5E9" } }, "INTEGRADORES")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="nav-links" style="${ssrRenderStyle({ "display": "flex", "gap": "4px", "margin-left": "32px" })}"><!--[-->`);
      ssrRenderList(navLinks, (link) => {
        _push(`<a${ssrRenderAttr("href", "#" + link.id)} style="${ssrRenderStyle({ "padding": "7px 14px", "border-radius": "8px", "font-size": "13px", "font-weight": "500", "color": "rgba(123,146,176,0.9)", "transition": "all 0.2s", "cursor": "pointer", "text-decoration": "none" })}">${ssrInterpolate(link.label)}</a>`);
      });
      _push(`<!--]--></div><div style="${ssrRenderStyle({ "margin-left": "auto", "display": "flex", "align-items": "center", "gap": "10px" })}"><a href="#contacto" class="hide-mobile" style="${ssrRenderStyle({ "padding": "8px 16px", "border-radius": "9px", "font-size": "13px", "font-weight": "500", "color": "rgba(123,146,176,0.9)", "border": "1px solid rgba(255,255,255,0.1)", "background": "transparent", "cursor": "pointer", "text-decoration": "none", "transition": "all 0.2s" })}"> Quiero comprar </a>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        style: { "display": "flex", "align-items": "center", "gap": "7px", "padding": "8px 18px", "border-radius": "9px", "font-size": "13px", "font-weight": "600", "color": "white", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "border": "none", "cursor": "pointer", "text-decoration": "none", "box-shadow": "0 3px 14px rgba(14,165,233,0.3)", "transition": "all 0.2s" },
        onMouseenter: (e) => e.currentTarget.style.boxShadow = "0 6px 20px rgba(14,165,233,0.45)",
        onMouseleave: (e) => e.currentTarget.style.boxShadow = "0 3px 14px rgba(14,165,233,0.3)"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"${_scopeId}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"${_scopeId}></path><polyline points="10 17 15 12 10 7"${_scopeId}></polyline><line x1="15" x2="3" y1="12" y2="12"${_scopeId}></line></svg> Iniciar sesi\xF3n `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                width: "13",
                height: "13",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2.2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, [
                createVNode("path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }),
                createVNode("polyline", { points: "10 17 15 12 10 7" }),
                createVNode("line", {
                  x1: "15",
                  x2: "3",
                  y1: "12",
                  y2: "12"
                })
              ])),
              createTextVNode(" Iniciar sesi\xF3n ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></nav><section id="inicio" style="${ssrRenderStyle({ "position": "relative", "min-height": "100vh", "display": "flex", "align-items": "center", "padding": "100px 24px 80px", "overflow": "hidden" })}"><div class="orb orb-1"></div><div class="orb orb-2"></div><div class="orb orb-3"></div><div style="${ssrRenderStyle({ position: "absolute", inset: 0, background: `radial-gradient(700px circle at ${unref(mouseX)}% ${unref(mouseY)}%, rgba(14,165,233,0.07) 0%, transparent 60%)`, pointerEvents: "none", transition: "background 0.1s" })}"></div><div style="${ssrRenderStyle({ "position": "absolute", "inset": "0", "background-image": "radial-gradient(rgba(255,255,255,0.07) 1px,transparent 1px)", "background-size": "32px 32px", "pointer-events": "none", "mask-image": "radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)" })}"></div><div class="hero-line-h"></div><div style="${ssrRenderStyle({ "position": "relative", "z-index": "1", "max-width": "1200px", "margin": "0 auto", "width": "100%", "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "64px", "align-items": "center" })}" class="hero-grid"><div><div class="hero-badge"><span class="badge-dot"></span> DISTRIBUCI\xD3N B2B \xB7 M\xC9XICO </div><h1 class="hero-h1"> Tu empresa merece<br><span style="${ssrRenderStyle({ "position": "relative", "display": "inline-block" })}"><span class="hero-gradient-text" style="${ssrRenderStyle({ opacity: unref(wordVisible) ? 1 : 0, transform: unref(wordVisible) ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.35s ease, transform 0.35s ease", display: "inline-block" })}">${ssrInterpolate(unref(currentWord))}</span><span class="word-underline"></span></span><br>de primera calidad </h1><p class="hero-sub"> Somos distribuidores especializados en tecnolog\xEDa para empresas. Cat\xE1logo completo, <span style="${ssrRenderStyle({ "color": "#7DD3FC", "font-weight": "500" })}">precios preferenciales</span> y facturaci\xF3n CFDI inmediata. </p><div style="${ssrRenderStyle({ "display": "flex", "gap": "12px", "flex-wrap": "wrap", "margin-bottom": "36px" })}"><a href="#contacto" class="btn-primary-hero"> Quiero comprar con ustedes <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "btn-ghost-hero"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ya soy cliente `);
          } else {
            return [
              createTextVNode(" Ya soy cliente ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div style="${ssrRenderStyle({ "display": "flex", "gap": "20px", "flex-wrap": "wrap" })}"><!--[-->`);
      ssrRenderList(trustMarks, (t) => {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "7px", "font-size": "12px", "color": "rgba(123,146,176,0.7)" })}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg> ${ssrInterpolate(t)}</div>`);
      });
      _push(`<!--]--></div></div><div style="${ssrRenderStyle({ "position": "relative", "display": "flex", "justify-content": "center", "align-items": "center" })}" class="hero-visual"><div style="${ssrRenderStyle({ "position": "absolute", "width": "340px", "height": "340px", "border-radius": "50%", "background": "radial-gradient(circle,rgba(14,165,233,0.18) 0%,rgba(14,165,233,0.12) 50%,transparent 70%)", "filter": "blur(40px)", "pointer-events": "none" })}"></div><div class="floating-panel"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "padding": "16px 18px", "border-bottom": "1px solid rgba(255,255,255,0.07)" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px" })}"><div style="${ssrRenderStyle({ "width": "8px", "height": "8px", "border-radius": "50%", "background": "#22C55E", "box-shadow": "0 0 6px #22C55E" })}"></div><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "rgba(123,146,176,0.85)" })}">Cat\xE1logo disponible</span></div><span style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.7)", "background": "rgba(255,255,255,0.05)", "padding": "3px 8px", "border-radius": "20px", "border": "1px solid rgba(255,255,255,0.08)" })}">+5,000 SKUs</span></div><div style="${ssrRenderStyle({ "padding": "16px", "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "10px" })}"><!--[-->`);
      ssrRenderList(panelItems, (item) => {
        var _a;
        _push(`<div class="panel-item"><div style="${ssrRenderStyle({ width: "32px", height: "32px", borderRadius: "9px", background: item.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 12px ${item.glow}` })}"><span>${(_a = item.icon) != null ? _a : ""}</span></div><div><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#E2EAF4", "line-height": "1.3" })}">${ssrInterpolate(item.name)}</div><div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.75)", "margin-top": "1px" })}">${ssrInterpolate(item.sub)}</div></div></div>`);
      });
      _push(`<!--]--></div><div style="${ssrRenderStyle({ "padding": "12px 18px", "border-top": "1px solid rgba(255,255,255,0.06)", "display": "flex", "align-items": "center", "justify-content": "space-between" })}"><span style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.7)" })}">Precios desde</span><span style="${ssrRenderStyle({ "font-size": "14px", "font-weight": "700", "color": "#E2EAF4" })}">Consultar <span style="${ssrRenderStyle({ "color": "#7DD3FC" })}">\u2192</span></span></div></div><div class="float-badge float-badge-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#E2EAF4" })}">Factura CFDI incluida</span></div><div class="float-badge float-badge-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#E2EAF4" })}">Precio preferencial</span></div></div></div><div class="scroll-indicator"><div class="scroll-dot"></div></div></section><section id="productos" style="${ssrRenderStyle({ "padding": "80px 24px", "background": "rgba(13,27,53,0.3)" })}"><div style="${ssrRenderStyle({ "max-width": "1100px", "margin": "0 auto" })}"><div style="${ssrRenderStyle({ "text-align": "center", "margin-bottom": "52px" })}"><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#7DD3FC", "letter-spacing": "1px", "text-transform": "uppercase", "margin-bottom": "12px" })}">Nuestros productos</div><h2 style="${ssrRenderStyle({ "font-size": "clamp(26px,3.5vw,38px)", "font-weight": "800", "color": "#E2EAF4", "letter-spacing": "-0.5px", "margin-bottom": "12px" })}">\xBFQu\xE9 puedes comprar con nosotros?</h2><p style="${ssrRenderStyle({ "font-size": "15px", "color": "rgba(123,146,176,0.8)", "max-width": "500px", "margin": "0 auto" })}">Manejamos un amplio cat\xE1logo de productos tecnol\xF3gicos para todo tipo de empresa.</p></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(auto-fit,minmax(240px,1fr))", "gap": "14px" })}"><!--[-->`);
      ssrRenderList(categories, (cat) => {
        var _a;
        _push(`<div style="${ssrRenderStyle({ "padding": "26px 22px", "border-radius": "16px", "background": "linear-gradient(145deg,#0C1A2E,#06101E)", "border": "1px solid rgba(255,255,255,0.07)", "display": "flex", "flex-direction": "column", "gap": "14px", "transition": "transform 0.2s,border-color 0.2s,box-shadow 0.2s", "cursor": "default" })}"><div style="${ssrRenderStyle({ width: "44px", height: "44px", borderRadius: "11px", background: cat.gradient, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px ${cat.glow}` })}"><span>${(_a = cat.icon) != null ? _a : ""}</span></div><div><div style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "700", "color": "#E2EAF4", "margin-bottom": "6px" })}">${ssrInterpolate(cat.name)}</div><div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(123,146,176,0.75)", "line-height": "1.6" })}">${ssrInterpolate(cat.desc)}</div></div></div>`);
      });
      _push(`<!--]--></div></div></section><section id="nosotros" style="${ssrRenderStyle({ "padding": "80px 24px" })}"><div style="${ssrRenderStyle({ "max-width": "1000px", "margin": "0 auto" })}"><div style="${ssrRenderStyle({ "text-align": "center", "margin-bottom": "52px" })}"><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#7DD3FC", "letter-spacing": "1px", "text-transform": "uppercase", "margin-bottom": "12px" })}">Por qu\xE9 elegirnos</div><h2 style="${ssrRenderStyle({ "font-size": "clamp(26px,3.5vw,38px)", "font-weight": "800", "color": "#E2EAF4", "letter-spacing": "-0.5px" })}">Lo que nos diferencia</h2></div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(auto-fit,minmax(220px,1fr))", "gap": "24px" })}"><!--[-->`);
      ssrRenderList(benefits, (b) => {
        var _a;
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "flex-start", "gap": "12px" })}"><div style="${ssrRenderStyle({ width: "42px", height: "42px", borderRadius: "11px", background: b.bg, border: b.border, display: "flex", alignItems: "center", justifyContent: "center" })}"><span>${(_a = b.icon) != null ? _a : ""}</span></div><div><div style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "700", "color": "#E2EAF4", "margin-bottom": "5px" })}">${ssrInterpolate(b.title)}</div><div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(123,146,176,0.78)", "line-height": "1.65" })}">${ssrInterpolate(b.desc)}</div></div></div>`);
      });
      _push(`<!--]--></div></div></section><section id="contacto" style="${ssrRenderStyle({ "padding": "80px 24px 100px", "background": "rgba(13,27,53,0.3)" })}"><div style="${ssrRenderStyle({ "max-width": "1100px", "margin": "0 auto" })}"><div style="${ssrRenderStyle({ "text-align": "center", "margin-bottom": "52px" })}"><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#7DD3FC", "letter-spacing": "1px", "text-transform": "uppercase", "margin-bottom": "12px" })}">Cont\xE1ctanos</div><h2 style="${ssrRenderStyle({ "font-size": "clamp(26px,3.5vw,38px)", "font-weight": "800", "color": "#E2EAF4", "letter-spacing": "-0.5px", "margin-bottom": "12px" })}">Estamos para atenderte</h2><p style="${ssrRenderStyle({ "font-size": "14px", "color": "rgba(123,146,176,0.8)", "line-height": "1.65", "max-width": "480px", "margin": "0 auto" })}"> Vis\xEDtanos, ll\xE1manos o escr\xEDbenos. Tambi\xE9n puedes dejarnos tus datos y te contactamos a la brevedad. </p></div><div class="contact-grid"><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "16px" })}"><div style="${ssrRenderStyle({ "padding": "24px", "border-radius": "18px", "background": "linear-gradient(145deg,#0C1A2E,#06101E)", "border": "1px solid rgba(255,255,255,0.07)" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "12px", "margin-bottom": "14px" })}"><div style="${ssrRenderStyle({ "width": "38px", "height": "38px", "border-radius": "10px", "background": "rgba(14,165,233,0.12)", "border": "1px solid rgba(14,165,233,0.22)", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" })}"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7DD3FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></div><div style="${ssrRenderStyle({ "font-size": "14px", "font-weight": "700", "color": "#E2EAF4" })}">Vis\xEDtanos</div></div><p style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(123,146,176,0.85)", "line-height": "1.7", "margin": "0" })}"> Boulevard Belisario Dom\xEDnguez #4213 L5<br> Tuxtla Guti\xE9rrez, Chiapas </p></div><div style="${ssrRenderStyle({ "padding": "24px", "border-radius": "18px", "background": "linear-gradient(145deg,#0C1A2E,#06101E)", "border": "1px solid rgba(255,255,255,0.07)" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "12px", "margin-bottom": "14px" })}"><div style="${ssrRenderStyle({ "width": "38px", "height": "38px", "border-radius": "10px", "background": "rgba(245,158,11,0.1)", "border": "1px solid rgba(245,158,11,0.2)", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" })}"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div><div style="${ssrRenderStyle({ "font-size": "14px", "font-weight": "700", "color": "#E2EAF4" })}">Horario comercial</div></div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "8px" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "gap": "12px" })}"><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,118,142,0.8)" })}">Lunes \u2013 Viernes</span><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#fbbf24" })}">07:00 \u2013 20:00 hrs</span></div><div style="${ssrRenderStyle({ "height": "1px", "background": "rgba(255,255,255,0.05)" })}"></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "gap": "12px" })}"><span style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,118,142,0.8)" })}">S\xE1bados</span><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#fbbf24" })}">07:00 \u2013 17:00 hrs</span></div></div></div><div style="${ssrRenderStyle({ "padding": "24px", "border-radius": "18px", "background": "linear-gradient(145deg,#0C1A2E,#06101E)", "border": "1px solid rgba(255,255,255,0.07)", "display": "flex", "flex-direction": "column", "gap": "16px" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "12px" })}"><div style="${ssrRenderStyle({ "width": "38px", "height": "38px", "border-radius": "10px", "background": "rgba(34,197,94,0.1)", "border": "1px solid rgba(34,197,94,0.2)", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" })}"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div><div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.7)", "font-weight": "500", "margin-bottom": "2px" })}">Tel\xE9fono</div><a href="tel:9611180157" style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "700", "color": "#22C55E", "text-decoration": "none", "letter-spacing": "0.3px" })}">961 118 0157</a></div></div><div style="${ssrRenderStyle({ "height": "1px", "background": "rgba(255,255,255,0.05)" })}"></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "12px" })}"><div style="${ssrRenderStyle({ "width": "38px", "height": "38px", "border-radius": "10px", "background": "rgba(14,165,233,0.1)", "border": "1px solid rgba(14,165,233,0.2)", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" })}"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg></div><div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.7)", "font-weight": "500", "margin-bottom": "2px" })}">Correo electr\xF3nico</div><a href="mailto:contacto@sieeg.com.mx" style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "600", "color": "#a78bfa", "text-decoration": "none" })}">contacto@sieeg.com.mx</a></div></div></div></div><div><div style="${ssrRenderStyle({ "position": "relative" })}"><div style="${ssrRenderStyle({ "position": "absolute", "inset": "-1px", "border-radius": "22px", "background": "linear-gradient(135deg,rgba(14,165,233,0.35) 0%,rgba(14,165,233,0.2) 60%,rgba(14,165,233,0.1) 100%)", "z-index": "0" })}"></div><div style="${ssrRenderStyle({ "position": "relative", "z-index": "1", "border-radius": "22px", "background": "linear-gradient(160deg,#0C1A2E,#06101E)", "padding": "36px 32px", "box-shadow": "0 24px 64px rgba(0,0,0,0.6)" })}"><div style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "700", "color": "#E2EAF4", "margin-bottom": "6px" })}">\xBFListo para comprar con nosotros?</div><p style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(123,146,176,0.7)", "margin-bottom": "24px", "line-height": "1.6" })}">D\xE9janos tus datos y te contactamos para darte acceso con precios exclusivos.</p>`);
      if (unref(requestSent)) {
        _push(`<div style="${ssrRenderStyle({ "text-align": "center", "padding": "20px 0" })}"><div style="${ssrRenderStyle({ "width": "64px", "height": "64px", "border-radius": "50%", "background": "rgba(34,197,94,0.12)", "border": "1px solid rgba(34,197,94,0.3)", "display": "flex", "align-items": "center", "justify-content": "center", "margin": "0 auto 20px" })}"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div><h3 style="${ssrRenderStyle({ "font-size": "20px", "font-weight": "700", "color": "#E2EAF4", "margin-bottom": "10px" })}">\xA1Mensaje recibido!</h3><p style="${ssrRenderStyle({ "font-size": "14px", "color": "rgba(123,146,176,0.85)", "line-height": "1.65", "margin-bottom": "24px" })}"> Gracias por tu inter\xE9s. Nos pondremos en contacto contigo a la brevedad. </p><button style="${ssrRenderStyle({ "padding": "10px 24px", "border-radius": "9px", "font-size": "13px", "font-weight": "600", "color": "#0EA5E9", "background": "rgba(14,165,233,0.1)", "border": "1px solid rgba(14,165,233,0.25)", "cursor": "pointer", "font-family": "inherit" })}"> Enviar otra solicitud </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(requestSent)) {
        _push(`<form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "16px" })}"><div><label style="${ssrRenderStyle({ "display": "block", "font-size": "12px", "font-weight": "500", "color": "rgba(123,146,176,0.9)", "margin-bottom": "7px" })}">Nombre completo *</label><div style="${ssrRenderStyle(fieldWrap(unref(nameFocus)))}"><svg style="${ssrRenderStyle({ "position": "absolute", "left": "14px", "top": "50%", "transform": "translateY(-50%)", "pointer-events": "none" })}" width="14" height="14" viewBox="0 0 24 24" fill="none"${ssrRenderAttr("stroke", unref(nameFocus) ? "#0EA5E9" : "rgba(100,118,142,0.7)")} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg><input${ssrRenderAttr("value", unref(form).name)} type="text" placeholder="Juan Garc\xEDa" required style="${ssrRenderStyle({ "width": "100%", "height": "46px", "background": "transparent", "border": "none", "outline": "none", "padding-left": "40px", "padding-right": "14px", "font-size": "14px", "color": "#E2EAF4", "box-sizing": "border-box", "font-family": "inherit" })}"></div></div><div><label style="${ssrRenderStyle({ "display": "block", "font-size": "12px", "font-weight": "500", "color": "rgba(123,146,176,0.9)", "margin-bottom": "7px" })}">Correo electr\xF3nico *</label><div style="${ssrRenderStyle(fieldWrap(unref(emailFocus)))}"><svg style="${ssrRenderStyle({ "position": "absolute", "left": "14px", "top": "50%", "transform": "translateY(-50%)", "pointer-events": "none" })}" width="14" height="14" viewBox="0 0 24 24" fill="none"${ssrRenderAttr("stroke", unref(emailFocus) ? "#0EA5E9" : "rgba(100,118,142,0.7)")} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg><input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="juan@miempresa.com" required style="${ssrRenderStyle({ "width": "100%", "height": "46px", "background": "transparent", "border": "none", "outline": "none", "padding-left": "40px", "padding-right": "14px", "font-size": "14px", "color": "#E2EAF4", "box-sizing": "border-box", "font-family": "inherit" })}"></div></div><div><label style="${ssrRenderStyle({ "display": "block", "font-size": "12px", "font-weight": "500", "color": "rgba(123,146,176,0.9)", "margin-bottom": "7px" })}">Empresa</label><div style="${ssrRenderStyle(fieldWrap(unref(companyFocus)))}"><svg style="${ssrRenderStyle({ "position": "absolute", "left": "14px", "top": "50%", "transform": "translateY(-50%)", "pointer-events": "none" })}" width="14" height="14" viewBox="0 0 24 24" fill="none"${ssrRenderAttr("stroke", unref(companyFocus) ? "#0EA5E9" : "rgba(100,118,142,0.7)")} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg><input${ssrRenderAttr("value", unref(form).company)} type="text" placeholder="Mi Empresa S.A. de C.V." style="${ssrRenderStyle({ "width": "100%", "height": "46px", "background": "transparent", "border": "none", "outline": "none", "padding-left": "40px", "padding-right": "14px", "font-size": "14px", "color": "#E2EAF4", "box-sizing": "border-box", "font-family": "inherit" })}"></div></div><div><label style="${ssrRenderStyle({ "display": "block", "font-size": "12px", "font-weight": "500", "color": "rgba(123,146,176,0.9)", "margin-bottom": "7px" })}">Tel\xE9fono</label><div style="${ssrRenderStyle(fieldWrap(unref(phoneFocus)))}"><svg style="${ssrRenderStyle({ "position": "absolute", "left": "14px", "top": "50%", "transform": "translateY(-50%)", "pointer-events": "none" })}" width="14" height="14" viewBox="0 0 24 24" fill="none"${ssrRenderAttr("stroke", unref(phoneFocus) ? "#0EA5E9" : "rgba(100,118,142,0.7)")} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg><input${ssrRenderAttr("value", unref(form).phone)} type="tel" placeholder="+52 55 0000 0000" style="${ssrRenderStyle({ "width": "100%", "height": "46px", "background": "transparent", "border": "none", "outline": "none", "padding-left": "40px", "padding-right": "14px", "font-size": "14px", "color": "#E2EAF4", "box-sizing": "border-box", "font-family": "inherit" })}"></div></div>`);
        if (unref(reqError)) {
          _push(`<div style="${ssrRenderStyle({ "padding": "10px 14px", "border-radius": "10px", "background": "rgba(239,68,68,0.1)", "border": "1px solid rgba(239,68,68,0.25)", "font-size": "13px", "color": "#EF4444" })}">${ssrInterpolate(unref(reqError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(reqLoading)) ? " disabled" : ""} style="${ssrRenderStyle([{ "margin-top": "4px", "height": "50px", "border-radius": "12px", "border": "none", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-weight": "700", "font-size": "14px", "display": "flex", "align-items": "center", "justify-content": "center", "gap": "8px", "font-family": "inherit", "box-shadow": "0 4px 20px rgba(14,165,233,0.35)", "transition": "all 0.2s" }, { opacity: unref(reqLoading) ? 0.8 : 1, cursor: unref(reqLoading) ? "not-allowed" : "pointer" }])}">`);
        if (unref(reqLoading)) {
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "10px" })}"><svg class="spin" style="${ssrRenderStyle({ "width": "15px", "height": "15px" })}" fill="none" viewBox="0 0 24 24"><circle style="${ssrRenderStyle({ "opacity": "0.3" })}" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle><path style="${ssrRenderStyle({ "opacity": "0.9" })}" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Enviando... </div>`);
        } else {
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px" })}"> Quiero ser cliente <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></div>`);
        }
        _push(`</button><p style="${ssrRenderStyle({ "text-align": "center", "font-size": "11px", "color": "rgba(100,118,142,0.85)", "margin-top": "2px" })}"> Nos pondremos en contacto contigo en menos de 24 horas. </p></form>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div></div></section><footer style="${ssrRenderStyle({ "padding": "36px 24px 28px", "border-top": "1px solid rgba(255,255,255,0.06)" })}"><div style="${ssrRenderStyle({ "max-width": "1100px", "margin": "0 auto", "display": "flex", "align-items": "center", "justify-content": "space-between", "flex-wrap": "wrap", "gap": "16px" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "10px" })}"><img${ssrRenderAttr("src", _imports_0)} alt="SIEEG" style="${ssrRenderStyle({ "height": "28px", "width": "28px", "object-fit": "contain", "border-radius": "6px", "opacity": "0.75" })}"><span style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "600", "color": "rgba(123,146,176,0.55)" })}">SIEEG INTEGRADORES</span></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "20px", "flex-wrap": "wrap" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/terminos",
        style: { "font-size": "12px", "color": "rgba(100,118,142,0.75)", "text-decoration": "none", "transition": "color 0.2s" },
        onMouseenter: (e) => e.currentTarget.style.color = "rgba(123,146,176,0.9)",
        onMouseleave: (e) => e.currentTarget.style.color = "rgba(100,118,142,0.75)"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` T\xE9rminos y Condiciones `);
          } else {
            return [
              createTextVNode(" T\xE9rminos y Condiciones ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/privacidad",
        style: { "font-size": "12px", "color": "rgba(100,118,142,0.75)", "text-decoration": "none", "transition": "color 0.2s" },
        onMouseenter: (e) => e.currentTarget.style.color = "rgba(123,146,176,0.9)",
        onMouseleave: (e) => e.currentTarget.style.color = "rgba(100,118,142,0.75)"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Pol\xEDticas de Privacidad `);
          } else {
            return [
              createTextVNode(" Pol\xEDticas de Privacidad ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,118,142,0.7)", "margin": "0" })}">\xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} SIEEG INTEGRADORES. Todos los derechos reservados.</p></div></div></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BTkJp9do.mjs.map
