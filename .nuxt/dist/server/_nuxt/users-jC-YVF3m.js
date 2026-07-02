import { _ as _sfc_main$2 } from "./FormField-CqV_UbYV.js";
import { defineComponent, ref, computed, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrRenderTeleport, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { UserPlus, Search, MoreVertical, Pencil, Trash2, X } from "@lucide/vue";
import "/Users/blackrubick/Desktop/sieeg-syscom-nuxt/node_modules/hookable/dist/index.mjs";
import { u as useAuthStore } from "./auth-De5_qdGe.js";
import "pinia";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FormSelect",
  __ssrInlineRender: true,
  props: {
    label: {},
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const focus = ref(false);
    const labelStyle = { display: "block", fontSize: "11px", fontWeight: 500, color: "rgba(148,163,184,0.85)", marginBottom: "6px" };
    const selectStyle = computed(() => ({ width: "100%", height: "40px", background: focus.value ? "rgba(14,165,233,0.06)" : "#0D1B35", border: `1px solid ${focus.value ? "rgba(14,165,233,0.45)" : "rgba(255,255,255,0.1)"}`, borderRadius: "10px", padding: "0 12px", fontSize: "13px", color: "#E2E8F0", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "all 0.18s", cursor: "pointer" }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><label style="${ssrRenderStyle(labelStyle)}">${ssrInterpolate(__props.label)}<span style="${ssrRenderStyle({ "color": "#fb7185", "margin-left": "2px" })}">*</span></label><select${ssrRenderAttr("value", __props.modelValue)} style="${ssrRenderStyle(unref(selectStyle))}"><!--[-->`);
      ssrRenderList(__props.options, (o) => {
        _push(`<option${ssrRenderAttr("value", o.value)} style="${ssrRenderStyle({ "background": "#0D1B35" })}">${ssrInterpolate(o.label)}</option>`);
      });
      _push(`<!--]--></select></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormSelect.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "users",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const isAdmin = computed(() => auth.user?.role === "admin");
    const users = ref([]);
    const loading = ref(true);
    const apiError = ref("");
    const search = ref("");
    const roleFilter = ref("all");
    const searchFocus = ref(false);
    const openMenu = ref(null);
    const roleFilters = [
      { key: "all", label: "Todos" },
      { key: "admin", label: "Admin" },
      { key: "approver", label: "Aprobador" },
      { key: "buyer", label: "Comprador" },
      { key: "viewer", label: "Visor" }
    ];
    const ROLES = ["admin", "approver", "buyer", "viewer"];
    const STATUSES = ["active", "inactive", "pending"];
    const filtered = computed(() => users.value.filter((u) => {
      if (roleFilter.value !== "all" && u.role !== roleFilter.value) return false;
      const q = search.value.toLowerCase();
      return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }));
    const kpis = computed(() => [
      { label: "Total", value: users.value.length, grad: "linear-gradient(135deg,#0EA5E9,#22D3EE)" },
      { label: "Activos", value: users.value.filter((u) => u.status === "active").length, grad: "linear-gradient(135deg,#10B981,#34D399)" },
      { label: "Administradores", value: users.value.filter((u) => u.role === "admin").length, grad: "linear-gradient(135deg,#7C3AED,#A78BFA)" },
      { label: "Pendientes", value: users.value.filter((u) => u.status === "pending").length, grad: "linear-gradient(135deg,#F59E0B,#FCD34D)" }
    ]);
    const roleCfg = {
      admin: { label: "Admin", color: "#a78bfa", bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.25)" },
      approver: { label: "Aprobador", color: "#fbbf24", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
      buyer: { label: "Comprador", color: "#38bdf8", bg: "rgba(14,165,233,0.12)", border: "rgba(14,165,233,0.25)" },
      viewer: { label: "Visor", color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" }
    };
    const statusCfg = {
      active: { label: "Activo", color: "#34d399", bg: "rgba(16,185,129,0.12)", dot: "#10b981" },
      inactive: { label: "Inactivo", color: "#fb7185", bg: "rgba(244,63,94,0.12)", dot: "#f43f5e" },
      pending: { label: "Pendiente", color: "#fbbf24", bg: "rgba(245,158,11,0.12)", dot: "#f59e0b" }
    };
    const palette = [["#0EA5E9", "#22D3EE"], ["#7C3AED", "#A78BFA"], ["#10B981", "#34D399"], ["#F59E0B", "#FCD34D"], ["#F43F5E", "#FB7185"], ["#6366F1", "#818CF8"]];
    const avatarGrad = (name) => palette[name.charCodeAt(0) % palette.length];
    const formatDate = (d) => new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));
    const modal = ref(null);
    const editTarget = ref(null);
    const form = ref({ name: "", email: "", password: "", role: "buyer", status: "active" });
    const saving = ref(false);
    const formError = ref("");
    const confirmDeleteId = ref(null);
    const deleting = ref(false);
    const deleteError = ref("");
    const deleteTarget = computed(() => users.value.find((u) => u.id === confirmDeleteId.value));
    const isSelf = computed(() => !!confirmDeleteId.value && confirmDeleteId.value === auth.user?.id);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormField = _sfc_main$2;
      const _component_FormSelect = _sfc_main$1;
      _push(`<!--[--><div style="${ssrRenderStyle({ fontFamily: `'Inter',system-ui,sans-serif` })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "flex-wrap": "wrap", "gap": "12px", "margin-bottom": "20px" })}"><div><h1 style="${ssrRenderStyle({ "font-size": "22px", "font-weight": "800", "color": "#F1F5F9", "margin": "0" })}">Gestión de Usuarios</h1><p style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.85)", "margin-top": "4px" })}">`);
      if (unref(loading)) {
        _push(`<span>Cargando...</span>`);
      } else if (unref(apiError)) {
        _push(`<span style="${ssrRenderStyle({ "color": "#fb7185" })}">${ssrInterpolate(unref(apiError))}</span>`);
      } else {
        _push(`<span>${ssrInterpolate(unref(users).length)} usuarios en el sistema</span>`);
      }
      _push(`</p></div>`);
      if (unref(isAdmin)) {
        _push(`<button style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "7px", "height": "38px", "padding": "0 18px", "border-radius": "10px", "border": "none", "background": "linear-gradient(135deg,#0EA5E9,#0284C7)", "color": "white", "font-size": "13px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit", "box-shadow": "0 4px 16px rgba(14,165,233,0.3)" })}">`);
        _push(ssrRenderComponent(unref(UserPlus), { size: 14 }, null, _parent));
        _push(` Nuevo usuario </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(4,1fr)", "gap": "12px", "margin-bottom": "20px" })}"><!--[-->`);
      ssrRenderList(unref(kpis), (k) => {
        _push(`<div style="${ssrRenderStyle({ "border-radius": "14px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "16px 18px" })}"><div style="${ssrRenderStyle({ fontSize: "26px", fontWeight: 800, background: k.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 })}">${ssrInterpolate(unref(loading) ? "—" : k.value)}</div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.8)", "margin-top": "4px", "font-weight": "500" })}">${ssrInterpolate(k.label)}</div></div>`);
      });
      _push(`<!--]--></div><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "14px 16px", "margin-bottom": "20px", "display": "flex", "flex-direction": "column", "gap": "12px" })}"><div style="${ssrRenderStyle({ "position": "relative", "max-width": "380px" })}">`);
      _push(ssrRenderComponent(unref(Search), {
        size: 14,
        style: { "position": "absolute", "left": "13px", "top": "50%", "transform": "translateY(-50%)", "pointer-events": "none" },
        color: unref(searchFocus) ? "#0EA5E9" : "rgba(100,116,139,0.7)"
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(search))} placeholder="Buscar por nombre, email o área..." style="${ssrRenderStyle({ width: "100%", height: "40px", background: unref(searchFocus) ? "rgba(14,165,233,0.06)" : "rgba(255,255,255,0.04)", border: `1px solid ${unref(searchFocus) ? "rgba(14,165,233,0.45)" : "rgba(255,255,255,0.09)"}`, borderRadius: "10px", paddingLeft: "38px", paddingRight: "14px", fontSize: "13px", color: "#E2E8F0", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "all 0.2s" })}"></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "6px", "flex-wrap": "wrap" })}"><!--[-->`);
      ssrRenderList(roleFilters, (f) => {
        _push(`<button style="${ssrRenderStyle({ height: "30px", padding: "0 12px", borderRadius: "20px", fontSize: "11px", fontWeight: unref(roleFilter) === f.key ? 600 : 500, cursor: "pointer", border: "none", fontFamily: "inherit", background: unref(roleFilter) === f.key ? "linear-gradient(135deg,#0EA5E9,#0284C7)" : "rgba(255,255,255,0.05)", color: unref(roleFilter) === f.key ? "#fff" : "rgba(100,116,139,0.9)", boxShadow: unref(roleFilter) === f.key ? "0 3px 10px rgba(14,165,233,0.25)" : "none" })}">${ssrInterpolate(f.label)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (unref(loading)) {
        _push(`<div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(auto-fill,minmax(280px,1fr))", "gap": "14px" })}"><!--[-->`);
        ssrRenderList(6, (i) => {
          _push(`<div class="pulse" style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "height": "180px" })}"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(auto-fill,minmax(280px,1fr))", "gap": "14px" })}"><!--[-->`);
        ssrRenderList(unref(filtered), (user) => {
          _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "18px", "position": "relative", "box-shadow": "0 3px 14px rgba(0,0,0,0.3)", "transition": "box-shadow 0.25s,transform 0.2s" })}">`);
          if (unref(isAdmin)) {
            _push(`<div style="${ssrRenderStyle({ "position": "absolute", "top": "14px", "right": "14px" })}"><button style="${ssrRenderStyle({ "width": "28px", "height": "28px", "border-radius": "8px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.07)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "rgba(100,116,139,0.7)" })}">`);
            _push(ssrRenderComponent(unref(MoreVertical), { size: 13 }, null, _parent));
            _push(`</button>`);
            if (unref(openMenu) === user.id) {
              _push(`<div style="${ssrRenderStyle({ "position": "absolute", "right": "0", "top": "34px", "width": "140px", "background": "#0D1B35", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "12px", "box-shadow": "0 12px 32px rgba(0,0,0,0.5)", "overflow": "hidden", "z-index": "20" })}"><button style="${ssrRenderStyle({ "width": "100%", "display": "flex", "align-items": "center", "gap": "8px", "padding": "9px 12px", "background": "none", "border": "none", "cursor": "pointer", "font-size": "12px", "color": "#CBD5E1", "font-family": "inherit" })}">`);
              _push(ssrRenderComponent(unref(Pencil), { size: 13 }, null, _parent));
              _push(` Editar </button><button style="${ssrRenderStyle({ "width": "100%", "display": "flex", "align-items": "center", "gap": "8px", "padding": "9px 12px", "background": "none", "border": "none", "cursor": "pointer", "font-size": "12px", "color": "#fb7185", "font-family": "inherit" })}">`);
              _push(ssrRenderComponent(unref(Trash2), { size: 13 }, null, _parent));
              _push(` Eliminar </button></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "12px", "margin-bottom": "14px" })}"><div style="${ssrRenderStyle({ width: "46px", height: "46px", borderRadius: "13px", background: `linear-gradient(135deg,${avatarGrad(user.name)[0]},${avatarGrad(user.name)[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700, color: "white", flexShrink: 0 })}">${ssrInterpolate(user.name.split(" ").slice(0, 2).map((n) => n[0]).join(""))}</div><div style="${ssrRenderStyle({ "min-width": "0", "flex": "1" })}"><div style="${ssrRenderStyle({ "font-size": "13px", "font-weight": "700", "color": "#E2E8F0", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis", "padding-right": "36px" })}">${ssrInterpolate(user.name)}</div><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.8)", "margin-top": "2px", "white-space": "nowrap", "overflow": "hidden", "text-overflow": "ellipsis" })}">${ssrInterpolate(user.email)}</div></div></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "6px", "flex-wrap": "wrap", "margin-bottom": "14px" })}"><span style="${ssrRenderStyle({ fontSize: "10px", fontWeight: 600, padding: "3px 9px", borderRadius: "20px", background: roleCfg[user.role].bg, color: roleCfg[user.role].color, border: `1px solid ${roleCfg[user.role].border}` })}">${ssrInterpolate(roleCfg[user.role].label)}</span><span style="${ssrRenderStyle({ fontSize: "10px", fontWeight: 600, padding: "3px 9px", borderRadius: "20px", background: statusCfg[user.status]?.bg, color: statusCfg[user.status]?.color, display: "flex", alignItems: "center", gap: "4px" })}"><span style="${ssrRenderStyle({ width: "5px", height: "5px", borderRadius: "50%", background: statusCfg[user.status]?.dot, display: "inline-block" })}"></span> ${ssrInterpolate(statusCfg[user.status]?.label)}</span></div>`);
          if (user.lastLogin) {
            _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "7px", "padding-top": "12px", "border-top": "1px solid rgba(255,255,255,0.06)" })}"><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between" })}"><span style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.75)" })}">Último acceso</span><span style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "500", "color": "#94a3b8" })}">${ssrInterpolate(formatDate(user.lastLogin))}</span></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      }
      if (!unref(loading) && unref(filtered).length === 0 && !unref(apiError)) {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "center", "padding": "60px 0", "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "font-size": "14px", "font-weight": "600", "color": "#94a3b8", "margin-top": "4px" })}"> No se encontraron usuarios </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(modal)) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "background": "rgba(2,6,14,0.75)", "backdrop-filter": "blur(6px)", "z-index": "1050" })}"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(modal)) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "z-index": "1051", "display": "flex", "align-items": "center", "justify-content": "center", "padding": "16px" })}"><div style="${ssrRenderStyle({ "width": "100%", "max-width": "480px" })}"><div style="${ssrRenderStyle({ "position": "relative" })}"><div style="${ssrRenderStyle({ "position": "absolute", "inset": "-1px", "border-radius": "20px", "background": "linear-gradient(135deg,rgba(14,165,233,0.4),rgba(124,58,237,0.25),rgba(14,165,233,0.1))", "z-index": "0", "pointer-events": "none" })}"></div><div style="${ssrRenderStyle({ "position": "relative", "z-index": "1", "border-radius": "20px", "background": "linear-gradient(160deg,#0D1B35,#09122A)", "padding": "28px 28px 24px", "box-shadow": "0 32px 80px rgba(0,0,0,0.7)" })}"><div style="${ssrRenderStyle({ "position": "absolute", "top": "0", "left": "20%", "right": "20%", "height": "1px", "background": "linear-gradient(90deg,transparent,rgba(14,165,233,0.7),transparent)", "border-radius": "999px" })}"></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "22px" })}"><div><div style="${ssrRenderStyle({ "font-size": "16px", "font-weight": "700", "color": "#F1F5F9" })}">${ssrInterpolate(unref(modal) === "create" ? "Nuevo usuario" : "Editar usuario")}</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.8)", "margin-top": "3px" })}">${ssrInterpolate(unref(modal) === "create" ? "Completa los datos para agregar un usuario" : `Modificando a ${unref(editTarget)?.name.split(" ")[0]}`)}</div></div><button style="${ssrRenderStyle({ "width": "30px", "height": "30px", "border-radius": "8px", "background": "rgba(255,255,255,0.05)", "border": "1px solid rgba(255,255,255,0.1)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "rgba(100,116,139,0.8)" })}">`);
          _push2(ssrRenderComponent(unref(X), { size: 14 }, null, _parent));
          _push2(`</button></div><form style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "14px" })}"><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "12px" })}"><div style="${ssrRenderStyle({ "grid-column": "1/-1" })}">`);
          _push2(ssrRenderComponent(_component_FormField, {
            label: "Nombre completo",
            modelValue: unref(form).name,
            "onUpdate:modelValue": ($event) => unref(form).name = $event,
            placeholder: "Juan Pérez García",
            required: true
          }, null, _parent));
          _push2(`</div><div style="${ssrRenderStyle({ "grid-column": "1/-1" })}">`);
          _push2(ssrRenderComponent(_component_FormField, {
            label: "Correo electrónico",
            type: "email",
            modelValue: unref(form).email,
            "onUpdate:modelValue": ($event) => unref(form).email = $event,
            placeholder: "juan@empresa.com",
            required: true
          }, null, _parent));
          _push2(`</div>`);
          if (unref(modal) === "create") {
            _push2(`<div style="${ssrRenderStyle({ "grid-column": "1/-1" })}">`);
            _push2(ssrRenderComponent(_component_FormField, {
              label: "Contraseña",
              type: "password",
              modelValue: unref(form).password,
              "onUpdate:modelValue": ($event) => unref(form).password = $event,
              placeholder: "Mínimo 6 caracteres",
              required: true
            }, null, _parent));
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(ssrRenderComponent(_component_FormSelect, {
            label: "Rol",
            modelValue: unref(form).role,
            "onUpdate:modelValue": ($event) => unref(form).role = $event,
            options: ROLES.map((r) => ({ value: r, label: roleCfg[r].label }))
          }, null, _parent));
          _push2(ssrRenderComponent(_component_FormSelect, {
            label: "Estado",
            modelValue: unref(form).status,
            "onUpdate:modelValue": ($event) => unref(form).status = $event,
            options: STATUSES.map((s) => ({ value: s, label: statusCfg[s].label }))
          }, null, _parent));
          _push2(`</div>`);
          if (unref(formError)) {
            _push2(`<div style="${ssrRenderStyle({ "padding": "9px 12px", "border-radius": "8px", "background": "rgba(244,63,94,0.1)", "border": "1px solid rgba(244,63,94,0.25)", "font-size": "12px", "color": "#fb7185" })}">${ssrInterpolate(unref(formError))}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div style="${ssrRenderStyle({ "display": "flex", "gap": "10px", "justify-content": "flex-end", "margin-top": "4px" })}"><button type="button" style="${ssrRenderStyle({ "height": "38px", "padding": "0 18px", "border-radius": "10px", "border": "1px solid rgba(255,255,255,0.1)", "background": "rgba(255,255,255,0.04)", "color": "#94a3b8", "font-size": "13px", "cursor": "pointer", "font-family": "inherit" })}">Cancelar</button><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} style="${ssrRenderStyle({ height: "38px", padding: "0 22px", borderRadius: "10px", border: "none", background: unref(saving) ? "rgba(14,165,233,0.5)" : "linear-gradient(135deg,#0EA5E9,#0284C7)", color: "white", fontSize: "13px", fontWeight: 600, cursor: unref(saving) ? "not-allowed" : "pointer", fontFamily: "inherit" })}">${ssrInterpolate(unref(saving) ? "Guardando..." : unref(modal) === "create" ? "Crear usuario" : "Guardar cambios")}</button></div></form></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(confirmDeleteId)) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "background": "rgba(2,6,14,0.75)", "backdrop-filter": "blur(6px)", "z-index": "1060" })}"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(confirmDeleteId)) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "z-index": "1061", "display": "flex", "align-items": "center", "justify-content": "center", "padding": "16px", "pointer-events": "none" })}"><div style="${ssrRenderStyle({ "width": "100%", "max-width": "360px", "pointer-events": "auto" })}"><div style="${ssrRenderStyle({ "border-radius": "20px", "background": "linear-gradient(160deg,#0D1B35,#09122A)", "border": "1px solid rgba(244,63,94,0.3)", "padding": "28px 24px 24px", "box-shadow": "0 32px 80px rgba(0,0,0,0.7)", "display": "flex", "flex-direction": "column", "align-items": "center", "gap": "10px", "text-align": "center" })}"><div style="${ssrRenderStyle({ "width": "48px", "height": "48px", "border-radius": "14px", "background": "rgba(244,63,94,0.12)", "border": "1px solid rgba(244,63,94,0.25)", "display": "flex", "align-items": "center", "justify-content": "center", "margin-bottom": "4px" })}">`);
          _push2(ssrRenderComponent(unref(Trash2), {
            size: 22,
            color: "#fb7185"
          }, null, _parent));
          _push2(`</div><div style="${ssrRenderStyle({ "font-size": "16px", "font-weight": "700", "color": "#F1F5F9" })}">¿Eliminar a ${ssrInterpolate(unref(deleteTarget)?.name.split(" ")[0])}?</div><div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.85)", "line-height": "1.5" })}"> Se eliminará <strong style="${ssrRenderStyle({ "color": "#CBD5E1" })}">${ssrInterpolate(unref(deleteTarget)?.name)}</strong> del sistema.<br>Esta acción no se puede deshacer. </div>`);
          if (unref(isSelf)) {
            _push2(`<div style="${ssrRenderStyle({ "padding": "9px 12px", "border-radius": "8px", "background": "rgba(245,158,11,0.1)", "border": "1px solid rgba(245,158,11,0.25)", "font-size": "12px", "color": "#fbbf24", "width": "100%", "box-sizing": "border-box" })}"> No puedes eliminar tu propia cuenta. </div>`);
          } else if (unref(deleteError)) {
            _push2(`<div style="${ssrRenderStyle({ "padding": "9px 12px", "border-radius": "8px", "background": "rgba(244,63,94,0.1)", "border": "1px solid rgba(244,63,94,0.25)", "font-size": "12px", "color": "#fb7185", "width": "100%", "box-sizing": "border-box" })}">${ssrInterpolate(unref(deleteError))}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div style="${ssrRenderStyle({ "display": "flex", "gap": "10px", "margin-top": "10px", "width": "100%" })}"><button${ssrIncludeBooleanAttr(unref(deleting)) ? " disabled" : ""} style="${ssrRenderStyle({ "flex": "1", "height": "40px", "border-radius": "10px", "border": "1px solid rgba(255,255,255,0.12)", "background": "rgba(255,255,255,0.05)", "color": "#94a3b8", "font-size": "13px", "cursor": "pointer", "font-family": "inherit" })}">Cancelar</button><button${ssrIncludeBooleanAttr(unref(deleting) || unref(isSelf)) ? " disabled" : ""} style="${ssrRenderStyle({ flex: 1, height: "40px", borderRadius: "10px", border: "none", background: unref(deleting) || unref(isSelf) ? "rgba(244,63,94,0.35)" : "linear-gradient(135deg,#f43f5e,#e11d48)", color: "white", fontSize: "13px", fontWeight: 600, cursor: unref(deleting) || unref(isSelf) ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: unref(deleting) || unref(isSelf) ? "none" : "0 4px 16px rgba(244,63,94,0.35)" })}">${ssrInterpolate(unref(deleting) ? "Eliminando..." : "Sí, eliminar")}</button></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/users.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=users-jC-YVF3m.js.map
