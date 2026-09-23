import { _ as __nuxt_component_0 } from './nuxt-link-DKQTkC3E.mjs';
import { defineComponent, watch, ref, computed, unref, isRef, mergeProps, withCtx, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderStyle, ssrRenderComponent, ssrRenderSlot, ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './_virtual_public-1NHFEfRi.mjs';
import { b as useRoute, a as useRouter } from './server.mjs';
import { defineStore } from 'pinia';
import { u as useCartStore } from './cart-DSVjrl-J.mjs';
import { u as useAuthStore } from './auth-DdQ94-v7.mjs';
import { u as useBreakpoint } from './useBreakpoint-DbQtNGMm.mjs';
import { _ as _sfc_main$3 } from './FiscalDataModal-GSDye5iO.mjs';
import { AlertTriangle } from '@lucide/vue';
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
import './FormField-q4VHXPBn.mjs';

const useUIStore = defineStore("ui", {
  state: () => ({
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
    notifications: [],
    notifsLoaded: false
  }),
  getters: {
    unreadCount: (s) => s.notifications.filter((n) => !n.read).length
  },
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    openMobileSidebar() {
      this.mobileSidebarOpen = true;
    },
    closeMobileSidebar() {
      this.mobileSidebarOpen = false;
    },
    async fetchNotifications() {
      try {
        const res = await $fetch(
          "/api/notifications"
        );
        this.notifications = res.notifications;
        this.notifsLoaded = true;
      } catch {
      }
    },
    async markRead(id) {
      const n = this.notifications.find((n2) => n2.id === id);
      if (n) n.read = true;
      try {
        await $fetch(`/api/notifications/${id}/read`, { method: "POST" });
      } catch {
      }
    },
    async markAllRead() {
      this.notifications.forEach((n) => {
        n.read = true;
      });
      try {
        await $fetch("/api/notifications/read-all", { method: "POST" });
      } catch {
      }
    }
  }
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AppSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const ui = useUIStore();
    const cart = useCartStore();
    const auth = useAuthStore();
    const { isMobile } = useBreakpoint();
    const collapsed = computed(() => ui.sidebarCollapsed);
    const cartCount = computed(() => cart.count);
    const ALL_NAV = [
      {
        href: "/dashboard",
        label: "Dashboard",
        roles: ["admin", "approver", "viewer"],
        svg: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>'
      },
      {
        href: "/catalog",
        label: "Cat\xE1logo",
        roles: null,
        svg: '<path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/>'
      },
      {
        href: "/cart",
        label: "Carrito",
        cart: true,
        roles: null,
        svg: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>'
      },
      {
        href: "/orders",
        label: "\xD3rdenes",
        roles: null,
        svg: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>'
      },
      {
        href: "/users",
        label: "Usuarios",
        roles: ["admin"],
        svg: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
      },
      {
        href: "/admin",
        label: "Precios",
        roles: ["admin"],
        svg: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>'
      },
      {
        href: "/fiscal",
        label: "Datos Fiscales",
        roles: ["admin"],
        svg: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 10h8"/><path d="M8 14h5"/><path d="M8 6h8"/>'
      },
      {
        href: "/facturas",
        label: "Facturaci\xF3n",
        roles: ["admin"],
        svg: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M12 16H8"/>'
      },
      {
        href: "/perfil",
        label: "Mi Perfil",
        roles: ["buyer", "approver", "viewer"],
        svg: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>'
      }
    ];
    const navItems = computed(() => {
      var _a, _b;
      const role = (_b = (_a = auth.user) == null ? void 0 : _a.role) != null ? _b : "";
      return ALL_NAV.filter((item) => !item.roles || item.roles.includes(role));
    });
    const sidebarStyle = computed(() => {
      if (isMobile.value) {
        return {
          position: "fixed",
          top: "0",
          left: "0",
          height: "100%",
          width: "260px",
          display: "flex",
          flexDirection: "column",
          background: "rgba(3,9,20,0.99)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          zIndex: "200",
          overflow: "visible",
          transform: ui.mobileSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)"
        };
      }
      return {
        width: collapsed.value ? "64px" : "220px",
        transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: "0",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "rgba(3,9,20,0.98)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        position: "relative",
        zIndex: "20",
        overflow: "visible"
      };
    });
    function isActive(href) {
      return href === "/dashboard" ? route.path === href : route.path.startsWith(href);
    }
    function linkStyle(href) {
      const active = isActive(href);
      const expand = !collapsed.value || isMobile.value;
      return {
        display: "flex",
        alignItems: "center",
        gap: "9px",
        height: "36px",
        padding: expand ? "0 10px" : "0",
        justifyContent: expand ? "flex-start" : "center",
        borderRadius: "9px",
        position: "relative",
        cursor: "pointer",
        background: active ? "rgba(14,165,233,0.10)" : "transparent",
        border: `1px solid ${active ? "rgba(14,165,233,0.18)" : "transparent"}`,
        transition: "background 0.15s, border-color 0.15s",
        overflow: "hidden"
      };
    }
    function onHover(e, href, entering) {
      if (!isActive(href)) {
        e.currentTarget.style.background = entering ? "rgba(255,255,255,0.04)" : "transparent";
      }
    }
    const badgeStyle = computed(() => ({
      position: !collapsed.value || isMobile.value ? "static" : "absolute",
      top: !collapsed.value || isMobile.value ? void 0 : "3px",
      right: !collapsed.value || isMobile.value ? void 0 : "3px",
      minWidth: "17px",
      height: "17px",
      borderRadius: "9px",
      background: "#0EA5E9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "9px",
      fontWeight: 700,
      color: "white",
      padding: "0 4px",
      flexShrink: 0
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<aside${ssrRenderAttrs(mergeProps({
        style: unref(sidebarStyle),
        class: "no-scrollbar"
      }, _attrs))}><div style="${ssrRenderStyle({ "height": "60px", "display": "flex", "align-items": "center", "padding": "0 16px", "border-bottom": "1px solid rgba(255,255,255,0.06)", "flex-shrink": "0", "gap": "10px", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "width": "30px", "height": "30px", "border-radius": "8px", "overflow": "hidden", "flex-shrink": "0", "box-shadow": "0 0 14px rgba(14,165,233,0.35)" })}"><img${ssrRenderAttr("src", _imports_0)} alt="SIEEG" style="${ssrRenderStyle({ "width": "100%", "height": "100%", "object-fit": "cover" })}"></div>`);
      if (!unref(collapsed) || unref(isMobile)) {
        _push(`<div style="${ssrRenderStyle({ "overflow": "hidden", "white-space": "nowrap", "transition": "opacity 0.2s", "flex": "1" })}"><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "800", "color": "#E2EAF4", "line-height": "1", "letter-spacing": "-0.3px" })}">SIEEG</div><div style="${ssrRenderStyle({ "font-size": "9px", "color": "rgba(100,118,142,0.7)", "font-weight": "500", "letter-spacing": "0.8px", "margin-top": "2px" })}">INTEGRADORES</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isMobile)) {
        _push(`<button style="${ssrRenderStyle({ "width": "30px", "height": "30px", "border-radius": "8px", "background": "rgba(255,255,255,0.06)", "border": "1px solid rgba(255,255,255,0.08)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "flex-shrink": "0", "margin-left": "auto" })}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(123,146,176,0.8)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><nav style="${ssrRenderStyle({ "flex": "1", "padding": "8px 6px", "overflow-y": "auto", "overflow-x": "hidden" })}" class="no-scrollbar">`);
      if (!unref(collapsed) || unref(isMobile)) {
        _push(`<div style="${ssrRenderStyle({ "font-size": "9px", "font-weight": "600", "color": "rgba(100,118,142,0.8)", "text-transform": "uppercase", "letter-spacing": "1.2px", "padding": "4px 10px 8px", "user-select": "none" })}"> Navegaci\xF3n </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(navItems), (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.href,
          to: item.href,
          style: { "text-decoration": "none", "display": "block", "margin-bottom": "1px" },
          onClick: ($event) => unref(isMobile) && unref(ui).closeMobileSidebar()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a;
            if (_push2) {
              _push2(`<div style="${ssrRenderStyle(linkStyle(item.href))}"${ssrRenderAttr("title", unref(collapsed) && !unref(isMobile) ? item.label : void 0)}${_scopeId}>`);
              if (isActive(item.href)) {
                _push2(`<div style="${ssrRenderStyle({ "position": "absolute", "left": "0", "top": "50%", "transform": "translateY(-50%)", "width": "3px", "height": "18px", "border-radius": "0 3px 3px 0", "background": "#0EA5E9", "box-shadow": "0 0 8px rgba(14,165,233,0.7)" })}"${_scopeId}></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<svg${ssrRenderAttr("width", 15)}${ssrRenderAttr("height", 15)} viewBox="0 0 24 24" fill="none"${ssrRenderAttr("stroke", isActive(item.href) ? "#7DD3FC" : "rgba(100,118,142,0.75)")}${ssrRenderAttr("stroke-width", isActive(item.href) ? 2.2 : 1.8)} stroke-linecap="round" stroke-linejoin="round" style="${ssrRenderStyle({ "flex-shrink": "0" })}"${_scopeId}>${(_a = item.svg) != null ? _a : ""}</svg>`);
              if (!unref(collapsed) || unref(isMobile)) {
                _push2(`<span style="${ssrRenderStyle({ fontSize: "12.5px", fontWeight: isActive(item.href) ? 600 : 500, color: isActive(item.href) ? "#E2EAF4" : "rgba(100,118,142,0.8)", whiteSpace: "nowrap", flex: 1, overflow: "hidden", textOverflow: "ellipsis", transition: "opacity 0.15s" })}"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (item.cart && unref(cartCount) > 0) {
                _push2(`<div style="${ssrRenderStyle(unref(badgeStyle))}"${_scopeId}>${ssrInterpolate(unref(cartCount))}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", {
                  style: linkStyle(item.href),
                  title: unref(collapsed) && !unref(isMobile) ? item.label : void 0,
                  onMouseenter: (e) => onHover(e, item.href, true),
                  onMouseleave: (e) => onHover(e, item.href, false)
                }, [
                  isActive(item.href) ? (openBlock(), createBlock("div", {
                    key: 0,
                    style: { "position": "absolute", "left": "0", "top": "50%", "transform": "translateY(-50%)", "width": "3px", "height": "18px", "border-radius": "0 3px 3px 0", "background": "#0EA5E9", "box-shadow": "0 0 8px rgba(14,165,233,0.7)" }
                  })) : createCommentVNode("", true),
                  (openBlock(), createBlock("svg", {
                    width: 15,
                    height: 15,
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: isActive(item.href) ? "#7DD3FC" : "rgba(100,118,142,0.75)",
                    "stroke-width": isActive(item.href) ? 2.2 : 1.8,
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    style: { "flex-shrink": "0" },
                    innerHTML: item.svg
                  }, null, 8, ["stroke", "stroke-width", "innerHTML"])),
                  !unref(collapsed) || unref(isMobile) ? (openBlock(), createBlock("span", {
                    key: 1,
                    style: { fontSize: "12.5px", fontWeight: isActive(item.href) ? 600 : 500, color: isActive(item.href) ? "#E2EAF4" : "rgba(100,118,142,0.8)", whiteSpace: "nowrap", flex: 1, overflow: "hidden", textOverflow: "ellipsis", transition: "opacity 0.15s" }
                  }, toDisplayString(item.label), 5)) : createCommentVNode("", true),
                  item.cart && unref(cartCount) > 0 ? (openBlock(), createBlock("div", {
                    key: 2,
                    style: unref(badgeStyle)
                  }, toDisplayString(unref(cartCount)), 5)) : createCommentVNode("", true)
                ], 44, ["title", "onMouseenter", "onMouseleave"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav>`);
      if (!unref(isMobile)) {
        _push(`<button style="${ssrRenderStyle({ "position": "absolute", "right": "-11px", "top": "72px", "width": "22px", "height": "22px", "border-radius": "50%", "background": "#0C1A2E", "border": "1px solid rgba(255,255,255,0.12)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "z-index": "30", "box-shadow": "0 2px 8px rgba(0,0,0,0.4)", "padding": "0" })}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(123,146,176,0.8)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">`);
        if (!unref(collapsed)) {
          _push(`<path d="m15 18-6-6 6-6"></path>`);
        } else {
          _push(`<path d="m9 18 6-6-6-6"></path>`);
        }
        _push(`</svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</aside>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppSidebar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const ui = useUIStore();
    useRouter();
    const { isMobile } = useBreakpoint();
    const notifOpen = ref(false);
    const userOpen = ref(false);
    const roleLabels = { admin: "Administrador", buyer: "Comprador", approver: "Aprobador", viewer: "Visor" };
    const initials = computed(() => {
      var _a, _b;
      return (_b = (_a = auth.user) == null ? void 0 : _a.name.split(" ").slice(0, 2).map((n) => n[0]).join("")) != null ? _b : "..";
    });
    const firstName = computed(() => {
      var _a, _b;
      return (_b = (_a = auth.user) == null ? void 0 : _a.name.split(" ").slice(0, 2).join(" ")) != null ? _b : "...";
    });
    const roleLabel = computed(() => {
      var _a;
      return auth.user ? (_a = roleLabels[auth.user.role]) != null ? _a : auth.user.role : "...";
    });
    const notifColors = { order: "#7DD3FC", approval: "#22C55E", delivery: "#0EA5E9", system: "#94a3b8", alert: "#F59E0B" };
    function notifColor(type) {
      var _a;
      return (_a = notifColors[type]) != null ? _a : "#94a3b8";
    }
    function notifIcon(type) {
      if (type === "order") return '<path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>';
      if (type === "approval") return '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>';
      if (type === "delivery") return '<rect width="16" height="13" x="1" y="5" rx="1"/><path d="M1 10h16"/><path d="M17 5h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/>';
      if (type === "alert") return '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>';
      return '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>';
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<header${ssrRenderAttrs(mergeProps({
        style: { height: "60px", display: "flex", alignItems: "center", padding: unref(isMobile) ? "0 16px" : "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(4,11,24,0.95)", backdropFilter: "blur(12px)", flexShrink: 0, gap: "12px", position: "sticky", top: 0, zIndex: 10, fontFamily: `'Inter',system-ui,sans-serif` }
      }, _attrs))}>`);
      if (unref(isMobile)) {
        _push(`<button style="${ssrRenderStyle({ "width": "36px", "height": "36px", "border-radius": "10px", "background": "transparent", "border": "1px solid transparent", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "flex-shrink": "0" })}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(123,146,176,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div style="${ssrRenderStyle({ "margin-left": "auto", "display": "flex", "align-items": "center", "gap": "4px" })}"><div style="${ssrRenderStyle({ "position": "relative" })}"><button style="${ssrRenderStyle({ width: "36px", height: "36px", borderRadius: "10px", background: unref(notifOpen) ? "rgba(255,255,255,0.08)" : "transparent", border: "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" })}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(123,146,176,0.9)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>`);
      if (unref(ui).unreadCount > 0) {
        _push(`<div style="${ssrRenderStyle({ "position": "absolute", "top": "5px", "right": "5px", "width": "16px", "height": "16px", "border-radius": "50%", "background": "#0EA5E9", "font-size": "9px", "font-weight": "700", "color": "white", "display": "flex", "align-items": "center", "justify-content": "center" })}">${ssrInterpolate(unref(ui).unreadCount)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      if (unref(notifOpen)) {
        _push(`<div style="${ssrRenderStyle({ position: "absolute", right: 0, top: "44px", width: unref(isMobile) ? "calc(100vw - 32px)" : "300px", maxWidth: "300px", background: "#0C1A2E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", boxShadow: "0 16px 48px rgba(0,0,0,0.6)", overflow: "hidden", zIndex: 50 })}"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center", "padding": "12px 14px", "border-bottom": "1px solid rgba(255,255,255,0.07)" })}"><span style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "600", "color": "#E2EAF4" })}">Notificaciones</span>`);
        if (unref(ui).unreadCount > 0) {
          _push(`<button style="${ssrRenderStyle({ "font-size": "11px", "color": "#7DD3FC", "background": "none", "border": "none", "cursor": "pointer", "font-weight": "500" })}">Marcar le\xEDdas</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div style="${ssrRenderStyle({ "max-height": "280px", "overflow-y": "auto" })}"><!--[-->`);
        ssrRenderList(unref(ui).notifications, (n) => {
          var _a2;
          _push(`<div style="${ssrRenderStyle({ display: "flex", gap: "10px", padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", background: !n.read ? "rgba(14,165,233,0.04)" : "transparent" })}"><div style="${ssrRenderStyle({ width: "30px", height: "30px", borderRadius: "8px", background: `${notifColor(n.type)}18`, border: `1px solid ${notifColor(n.type)}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: notifColor(n.type) })}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"${ssrRenderAttr("stroke", notifColor(n.type))} stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${(_a2 = notifIcon(n.type)) != null ? _a2 : ""}</svg></div><div style="${ssrRenderStyle({ "flex": "1", "min-width": "0" })}"><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#7B92B0" })}">${ssrInterpolate(n.title)}</div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.8)", "margin-top": "2px", "overflow": "hidden", "display": "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical" })}">${ssrInterpolate(n.message)}</div></div>`);
          if (!n.read) {
            _push(`<div style="${ssrRenderStyle({ "width": "6px", "height": "6px", "border-radius": "50%", "background": "#0EA5E9", "flex-shrink": "0", "margin-top": "4px" })}"></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div style="${ssrRenderStyle({ "width": "1px", "height": "20px", "background": "rgba(255,255,255,0.07)", "margin": "0 6px" })}"></div><div style="${ssrRenderStyle({ "position": "relative" })}"><button style="${ssrRenderStyle({ display: "flex", alignItems: "center", gap: "8px", height: "36px", padding: "0 10px 0 6px", borderRadius: "10px", background: unref(userOpen) ? "rgba(255,255,255,0.08)" : "transparent", border: "1px solid transparent", cursor: "pointer" })}"><div style="${ssrRenderStyle({ "width": "28px", "height": "28px", "border-radius": "8px", "background": "linear-gradient(135deg,#0EA5E9,#7DD3FC)", "display": "flex", "align-items": "center", "justify-content": "center", "font-size": "11px", "font-weight": "700", "color": "white", "flex-shrink": "0" })}">${ssrInterpolate(unref(initials))}</div>`);
      if (!unref(isMobile)) {
        _push(`<div style="${ssrRenderStyle({ "text-align": "left" })}"><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#E2EAF4", "line-height": "1" })}">${ssrInterpolate(unref(firstName))}</div><div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,118,142,0.8)", "margin-top": "2px" })}">${ssrInterpolate(unref(roleLabel))}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isMobile)) {
        _push(`<svg${ssrRenderAttr("width", 12)}${ssrRenderAttr("height", 12)} viewBox="0 0 24 24" fill="none" stroke="rgba(100,118,142,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${ssrRenderStyle({ transition: "transform 0.2s", transform: unref(userOpen) ? "rotate(180deg)" : "rotate(0deg)", marginLeft: "2px" })}"><path d="m6 9 6 6 6-6"></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      if (unref(userOpen)) {
        _push(`<div style="${ssrRenderStyle({ "position": "absolute", "right": "0", "top": "44px", "width": "200px", "background": "#0C1A2E", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "14px", "box-shadow": "0 16px 48px rgba(0,0,0,0.6)", "overflow": "hidden", "z-index": "50" })}"><div style="${ssrRenderStyle({ "padding": "12px 14px", "border-bottom": "1px solid rgba(255,255,255,0.07)" })}"><div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#E2EAF4" })}">${ssrInterpolate((_a = unref(auth).user) == null ? void 0 : _a.name)}</div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,118,142,0.8)", "margin-top": "2px" })}">${ssrInterpolate((_b = unref(auth).user) == null ? void 0 : _b.email)}</div></div><div style="${ssrRenderStyle({ "border-top": "1px solid rgba(255,255,255,0.07)" })}"><button style="${ssrRenderStyle({ "width": "100%", "display": "flex", "align-items": "center", "gap": "8px", "padding": "10px 14px", "font-size": "12px", "color": "#EF4444", "background": "none", "border": "none", "cursor": "pointer", "text-align": "left", "font-family": "inherit" })}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg> Cerrar sesi\xF3n </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (unref(notifOpen) || unref(userOpen)) {
        _push(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "z-index": "40" })}"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const ui = useUIStore();
    const { isMobile } = useBreakpoint();
    const needsFiscal = (user) => !!user && user.role !== "admin" && !user.fiscalCompleted;
    const route = useRoute();
    watch(() => route.path, () => {
      if (isMobile.value) ui.closeMobileSidebar();
    });
    const showFiscalModal = ref(false);
    const fiscalModalRequired = computed(() => needsFiscal(auth.user));
    const showFiscalBanner = computed(() => auth.loaded && needsFiscal(auth.user) && !showFiscalModal.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppSidebar = _sfc_main$2;
      const _component_AppHeader = _sfc_main$1;
      const _component_FiscalDataModal = _sfc_main$3;
      _push(`<!--[--><div style="${ssrRenderStyle({ "display": "flex", "height": "100vh", "background": "#06101E", "position": "relative", "overflow": "hidden" })}"><div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "pointer-events": "none", "z-index": "0", "background": "radial-gradient(ellipse 70% 50% at 0% 0%,rgba(14,165,233,0.09) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 100% 100%,rgba(14,165,233,0.06) 0%,transparent 60%)" })}"></div><div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "pointer-events": "none", "z-index": "0", "background-image": "linear-gradient(rgba(255,255,255,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.016) 1px,transparent 1px)", "background-size": "64px 64px" })}"></div>`);
      if (unref(isMobile) && unref(ui).mobileSidebarOpen) {
        _push(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "background": "rgba(0,0,0,0.6)", "z-index": "150", "backdrop-filter": "blur(2px)" })}"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_AppSidebar, null, null, _parent));
      _push(`<div style="${ssrRenderStyle({ "flex": "1", "display": "flex", "flex-direction": "column", "min-width": "0", "overflow": "hidden", "position": "relative", "z-index": "1" })}">`);
      _push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
      if (unref(showFiscalBanner)) {
        _push(`<div style="${ssrRenderStyle({ flexShrink: 0, padding: unref(isMobile) ? "0 16px" : "0 28px" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "gap": "10px", "padding": "11px 16px", "border-radius": "12px", "background": "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.06))", "border": "1px solid rgba(245,158,11,0.3)", "margin-top": "12px", "flex-wrap": "wrap" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "10px" })}"><div style="${ssrRenderStyle({ "width": "32px", "height": "32px", "border-radius": "9px", "background": "rgba(245,158,11,0.15)", "border": "1px solid rgba(245,158,11,0.25)", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" })}">`);
        _push(ssrRenderComponent(unref(AlertTriangle), {
          size: 15,
          color: "#fbbf24"
        }, null, _parent));
        _push(`</div><div><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "600", "color": "#fcd34d" })}">Datos fiscales incompletos</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(245,158,11,0.8)", "margin-top": "1px" })}">Completa tu informaci\xF3n fiscal para poder recibir facturas (CFDI).</div></div></div><button style="${ssrRenderStyle({ "height": "34px", "padding": "0 16px", "border-radius": "9px", "border": "none", "background": "linear-gradient(135deg,#F59E0B,#D97706)", "color": "white", "font-size": "12px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit", "white-space": "nowrap", "flex-shrink": "0" })}"> Completar ahora </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main style="${ssrRenderStyle({ flex: 1, overflowY: "auto", padding: unref(isMobile) ? "16px 16px 32px" : "28px 28px 40px" })}">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
      _push(ssrRenderComponent(_component_FiscalDataModal, {
        modelValue: unref(showFiscalModal),
        "onUpdate:modelValue": ($event) => isRef(showFiscalModal) ? showFiscalModal.value = $event : null,
        required: unref(fiscalModalRequired)
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-CiLg_ijk.mjs.map
