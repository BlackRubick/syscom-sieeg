import { defineComponent, ref, computed, watch, unref, useSSRContext } from 'vue';
import { ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderAttrs } from 'vue/server-renderer';
import { u as useCartStore } from './cart-YNBuivug.mjs';
import { a as adaptProduct } from './useSyscom-Bu-iKqE2.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MiniProductGrid",
  __ssrInlineRender: true,
  props: {
    title: {},
    products: {}
  },
  setup(__props) {
    useCartStore();
    const addedId = ref(null);
    const fmtCurrency = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "600", "color": "rgba(100,116,139,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "10px" })}">${ssrInterpolate(__props.title)}</div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(auto-fill,minmax(150px,1fr))", "gap": "10px" })}"><!--[-->`);
      ssrRenderList(__props.products, (p) => {
        _push(`<div style="${ssrRenderStyle({ "border-radius": "12px", "background": "rgba(255,255,255,0.03)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "10px", "display": "flex", "flex-direction": "column", "gap": "7px" })}">`);
        if (p.images[0]) {
          _push(`<img${ssrRenderAttr("src", p.images[0])}${ssrRenderAttr("alt", p.name)} style="${ssrRenderStyle({ "width": "100%", "height": "70px", "object-fit": "contain", "border-radius": "7px" })}">`);
        } else {
          _push(`<div style="${ssrRenderStyle({ "height": "70px", "display": "flex", "align-items": "center", "justify-content": "center", "font-size": "24px" })}">\u{1F4E6}</div>`);
        }
        _push(`<div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "600", "color": "#CBD5E1", "line-height": "1.3", "display": "-webkit-box", "-webkit-line-clamp": "2", "-webkit-box-orient": "vertical", "overflow": "hidden" })}">${ssrInterpolate(p.name)}</div>`);
        if (p.price > 0) {
          _push(`<div style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "700", "color": "#38bdf8" })}">${ssrInterpolate(fmtCurrency(p.price))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button${ssrIncludeBooleanAttr(p.stock === 0) ? " disabled" : ""} style="${ssrRenderStyle({ height: "28px", borderRadius: "7px", border: "none", background: unref(addedId) === p.id ? "rgba(16,185,129,0.15)" : "rgba(14,165,233,0.12)", color: unref(addedId) === p.id ? "#34d399" : "#38bdf8", fontSize: "10px", fontWeight: 600, cursor: p.stock === 0 ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: p.stock === 0 ? 0.4 : 1 })}">${ssrInterpolate(unref(addedId) === p.id ? "\u2713 Agregado" : "+ Agregar")}</button></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MiniProductGrid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductModal",
  __ssrInlineRender: true,
  props: {
    product: {},
    show: { type: Boolean }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useCartStore();
    const loading = ref(true);
    const error = ref(null);
    const detail = ref(null);
    const related = ref([]);
    const accesorios = ref([]);
    const imgIdx = ref(0);
    const added = ref(false);
    const displayProduct = computed(() => {
      if (!detail.value) return props.product;
      try {
        return adaptProduct(detail.value);
      } catch {
        return props.product;
      }
    });
    const images = computed(() => {
      var _a;
      const imgs = [];
      const raw = (_a = detail.value) == null ? void 0 : _a.imagenes;
      if (raw == null ? void 0 : raw.length) {
        [...raw].sort((a, b) => {
          var _a2, _b;
          return ((_a2 = a.orden) != null ? _a2 : 0) - ((_b = b.orden) != null ? _b : 0);
        }).forEach((i) => {
          if (i.url) imgs.push(i.url);
        });
      }
      if (!imgs.length && props.product.images[0]) imgs.push(props.product.images[0]);
      return imgs;
    });
    const stockTotal = computed(() => detail.value ? Number(detail.value.total_existencia) : props.product.stock);
    const description = computed(() => {
      var _a, _b;
      return (_b = (_a = detail.value) == null ? void 0 : _a.descripcion) != null ? _b : "";
    });
    const caracteristicas = computed(() => {
      var _a, _b;
      return (_b = (_a = detail.value) == null ? void 0 : _a.caracteristicas) != null ? _b : [];
    });
    const recursos = computed(() => {
      var _a, _b;
      return (_b = (_a = detail.value) == null ? void 0 : _a.recursos) != null ? _b : [];
    });
    const existencia = computed(() => {
      var _a;
      return (_a = detail.value) == null ? void 0 : _a.existencia;
    });
    function extractQty(v) {
      var _a, _b, _c;
      if (typeof v === "number") return v;
      if (typeof v === "string") return parseInt(v, 10) || 0;
      if (v && typeof v === "object") {
        const o = v;
        const n = (_c = (_b = (_a = o.cantidad) != null ? _a : o.total) != null ? _b : o.existencia) != null ? _c : o.stock;
        return typeof n === "number" ? n : parseInt(String(n != null ? n : "0"), 10) || 0;
      }
      return 0;
    }
    function toDisplayString(v) {
      var _a, _b, _c, _d;
      if (typeof v === "string") return v;
      if (typeof v === "number" || typeof v === "boolean") return String(v);
      if (v && typeof v === "object") {
        const o = v;
        return String((_d = (_c = (_b = (_a = o.descripcion) != null ? _a : o.nombre) != null ? _b : o.valor) != null ? _c : o.text) != null ? _d : JSON.stringify(v));
      }
      return String(v != null ? v : "");
    }
    function isHTML(v) {
      return typeof v === "string" && /<[a-z][\s\S]*>/i.test(v);
    }
    const fmtCurrency = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
    async function loadDetail() {
      var _a;
      loading.value = true;
      error.value = null;
      detail.value = null;
      related.value = [];
      accesorios.value = [];
      imgIdx.value = 0;
      const id = props.product.id;
      const [det, rel, acc] = await Promise.all([
        $fetch(`/api/syscom/productos/${id}`).catch(() => null),
        $fetch(`/api/syscom/productos/${id}/relacionados`).catch(() => []),
        $fetch(`/api/syscom/productos/${id}/accesorios`).catch(() => [])
      ]);
      if (!det || det.error) {
        error.value = String((_a = det == null ? void 0 : det.error) != null ? _a : "No se pudo cargar el producto");
      } else {
        detail.value = det;
      }
      const toProducts = (arr) => arr.slice(0, 6).map((p) => {
        try {
          return adaptProduct(p);
        } catch {
          return null;
        }
      }).filter(Boolean);
      related.value = Array.isArray(rel) ? toProducts(rel) : [];
      accesorios.value = Array.isArray(acc) ? toProducts(acc) : [];
      loading.value = false;
    }
    watch(() => props.show, (open) => {
      if (open) loadDetail();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_MiniProductGrid = _sfc_main$1;
      _push(`<!--[-->`);
      if (__props.show) {
        _push(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "background": "rgba(0,0,0,0.75)", "backdrop-filter": "blur(4px)", "z-index": "200" })}"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.show) {
        _push(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "5%", "max-width": "900px", "margin": "0 auto", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "20px", "box-shadow": "0 32px 80px rgba(0,0,0,0.7)", "overflow-y": "auto", "z-index": "201", "font-family": "'Inter',system-ui,sans-serif" })}"><button style="${ssrRenderStyle({ "position": "absolute", "top": "16px", "right": "16px", "width": "34px", "height": "34px", "border-radius": "9px", "background": "rgba(255,255,255,0.06)", "border": "1px solid rgba(255,255,255,0.1)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "z-index": "10", "color": "rgba(148,163,184,0.8)" })}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button>`);
        if (unref(loading)) {
          _push(`<div style="${ssrRenderStyle({ "padding": "28px", "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "28px" })}"><div class="shimmer-bg" style="${ssrRenderStyle({ "aspect-ratio": "1", "border-radius": "14px" })}"></div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "14px", "padding-top": "8px" })}"><div class="shimmer-bg" style="${ssrRenderStyle({ "width": "60%", "height": "11px", "border-radius": "8px" })}"></div><div class="shimmer-bg" style="${ssrRenderStyle({ "width": "90%", "height": "22px", "border-radius": "8px" })}"></div><div class="shimmer-bg" style="${ssrRenderStyle({ "width": "50%", "height": "14px", "border-radius": "8px" })}"></div><div class="shimmer-bg" style="${ssrRenderStyle({ "width": "40%", "height": "28px", "border-radius": "8px" })}"></div><div class="shimmer-bg" style="${ssrRenderStyle({ "width": "100%", "height": "60px", "border-radius": "10px" })}"></div></div></div>`);
        } else if (unref(error)) {
          _push(`<div style="${ssrRenderStyle({ "padding": "40px", "display": "flex", "flex-direction": "column", "align-items": "center", "gap": "12px", "color": "#fb7185" })}"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><div style="${ssrRenderStyle({ "font-size": "14px", "font-weight": "600" })}">No se pudo cargar el producto</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.8)" })}">${ssrInterpolate(unref(error))}</div></div>`);
        } else if (unref(displayProduct)) {
          _push(`<div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "28px", "padding": "28px 28px 20px" })}"><div><div style="${ssrRenderStyle({ "position": "relative", "border-radius": "14px", "background": "rgba(255,255,255,0.03)", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden", "aspect-ratio": "1", "display": "flex", "align-items": "center", "justify-content": "center", "margin-bottom": "10px" })}">`);
          if (unref(images).length) {
            _push(`<img${ssrRenderAttr("src", unref(images)[unref(imgIdx)])}${ssrRenderAttr("alt", unref(displayProduct).name)} style="${ssrRenderStyle({ "width": "90%", "height": "90%", "object-fit": "contain", "transition": "opacity 0.2s" })}">`);
          } else {
            _push(`<div style="${ssrRenderStyle({ "width": "72px", "height": "72px", "border-radius": "18px", "background": "rgba(14,165,233,0.1)", "border": "1px solid rgba(14,165,233,0.18)", "display": "flex", "align-items": "center", "justify-content": "center" })}"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4 7.55 4.24"></path><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg></div>`);
          }
          if (unref(images).length > 1) {
            _push(`<!--[--><button style="${ssrRenderStyle({ "position": "absolute", "left": "8px", "top": "50%", "transform": "translateY(-50%)", "width": "32px", "height": "32px", "border-radius": "8px", "background": "rgba(0,0,0,0.5)", "border": "none", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "#CBD5E1" })}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"></path></svg></button><button style="${ssrRenderStyle({ "position": "absolute", "right": "8px", "top": "50%", "transform": "translateY(-50%)", "width": "32px", "height": "32px", "border-radius": "8px", "background": "rgba(0,0,0,0.5)", "border": "none", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "#CBD5E1" })}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg></button><!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (unref(images).length > 1) {
            _push(`<div style="${ssrRenderStyle({ "display": "flex", "gap": "6px", "justify-content": "center" })}"><!--[-->`);
            ssrRenderList(unref(images).slice(0, 6), (url, i) => {
              _push(`<button style="${ssrRenderStyle({ width: "48px", height: "48px", borderRadius: "8px", overflow: "hidden", border: `2px solid ${unref(imgIdx) === i ? "#0EA5E9" : "rgba(255,255,255,0.07)"}`, padding: 0, cursor: "pointer", background: "rgba(255,255,255,0.03)" })}"><img${ssrRenderAttr("src", url)} style="${ssrRenderStyle({ "width": "100%", "height": "100%", "object-fit": "contain" })}"></button>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "12px" })}"><div style="${ssrRenderStyle({ "display": "flex", "gap": "6px", "flex-wrap": "wrap" })}"><span style="${ssrRenderStyle({ "font-size": "11px", "padding": "3px 9px", "border-radius": "5px", "background": "rgba(255,255,255,0.05)", "color": "rgba(100,116,139,0.8)", "font-weight": "500" })}">${ssrInterpolate(unref(displayProduct).category)}</span><span style="${ssrRenderStyle({ "font-size": "11px", "padding": "3px 9px", "border-radius": "5px", "background": "rgba(14,165,233,0.1)", "color": "#38bdf8", "font-weight": "600" })}">${ssrInterpolate(unref(displayProduct).supplier)}</span></div><h2 style="${ssrRenderStyle({ "font-size": "18px", "font-weight": "800", "color": "#F1F5F9", "margin": "0", "line-height": "1.3" })}">${ssrInterpolate(unref(displayProduct).name)}</h2><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "6px" })}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(100,116,139,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><path d="M7 7h.01"></path></svg><span style="${ssrRenderStyle({ "font-size": "12px", "font-family": "monospace", "color": "rgba(100,116,139,0.8)" })}">${ssrInterpolate(unref(displayProduct).sku)}</span></div><div><div style="${ssrRenderStyle({ "font-size": "28px", "font-weight": "800", "color": "#F1F5F9", "letter-spacing": "-0.5px", "line-height": "1" })}">${ssrInterpolate(unref(displayProduct).price > 0 ? fmtCurrency(unref(displayProduct).price) : "Consultar precio")}</div>`);
          if (unref(displayProduct).discount) {
            _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px", "margin-top": "4px" })}"><span style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.6)", "text-decoration": "line-through" })}">${ssrInterpolate(fmtCurrency(Math.round(unref(displayProduct).price / (1 - unref(displayProduct).discount / 100))))}</span><span style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "700", "color": "#34d399", "background": "rgba(52,211,153,0.1)", "padding": "2px 7px", "border-radius": "4px" })}">-${ssrInterpolate(unref(displayProduct).discount)}%</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px" })}"><span style="${ssrRenderStyle({ fontSize: "13px", fontWeight: 600, color: unref(stockTotal) > 10 ? "#34d399" : unref(stockTotal) > 0 ? "#fbbf24" : "#fb7185" })}">${ssrInterpolate(unref(stockTotal) > 10 ? `${unref(stockTotal)} en stock` : unref(stockTotal) > 0 ? `Solo ${unref(stockTotal)} disponibles` : "Agotado")}</span></div>`);
          if (unref(existencia) && Object.keys(unref(existencia)).length) {
            _push(`<div style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.03)", "border-radius": "10px", "padding": "10px 12px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "font-weight": "600", "color": "rgba(100,116,139,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "8px" })}">Stock por sucursal</div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "5px" })}"><!--[-->`);
            ssrRenderList(Object.entries(unref(existencia)).slice(0, 6), ([suc, raw]) => {
              _push(`<div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "font-size": "12px" })}"><span style="${ssrRenderStyle({ "color": "rgba(100,116,139,0.8)", "text-transform": "capitalize" })}">${ssrInterpolate(suc.replace(/_/g, " "))}</span><span style="${ssrRenderStyle({ fontWeight: 600, color: extractQty(raw) > 0 ? "#E2E8F0" : "rgba(100,116,139,0.4)" })}">${ssrInterpolate(extractQty(raw))}</span></div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "8px", "margin-top": "auto" })}"><button${ssrIncludeBooleanAttr(unref(stockTotal) === 0) ? " disabled" : ""} style="${ssrRenderStyle({ height: "44px", borderRadius: "11px", border: "none", cursor: unref(stockTotal) === 0 ? "not-allowed" : "pointer", background: unref(added) ? "rgba(16,185,129,0.15)" : "linear-gradient(135deg,#0EA5E9,#0284C7)", color: unref(added) ? "#34d399" : "white", fontSize: "13px", fontWeight: 700, fontFamily: "inherit", opacity: unref(stockTotal) === 0 ? 0.4 : 1, boxShadow: unref(added) ? "none" : "0 4px 16px rgba(14,165,233,0.3)", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" })}">`);
          if (!unref(added)) {
            _push(`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>`);
          } else {
            _push(`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`);
          }
          _push(` ${ssrInterpolate(unref(added) ? "Agregado al carrito" : "Agregar al carrito")}</button></div></div></div><div style="${ssrRenderStyle({ "padding": "0 28px 28px", "display": "flex", "flex-direction": "column", "gap": "20px" })}">`);
          if (unref(description)) {
            _push(`<div><div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "600", "color": "rgba(100,116,139,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "12px" })}">Descripci\xF3n</div>`);
            if (isHTML(unref(description))) {
              _push(`<div style="${ssrRenderStyle({ "font-size": "13px", "color": "#94a3b8", "line-height": "1.7" })}">${(_a = unref(description)) != null ? _a : ""}</div>`);
            } else {
              _push(`<p style="${ssrRenderStyle({ "font-size": "13px", "color": "#94a3b8", "line-height": "1.7", "margin": "0" })}">${ssrInterpolate(unref(description))}</p>`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(caracteristicas).length) {
            _push(`<div><div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "600", "color": "rgba(100,116,139,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "10px" })}">Caracter\xEDsticas</div><ul style="${ssrRenderStyle({ "margin": "0", "padding": "0", "list-style": "none", "display": "flex", "flex-direction": "column", "gap": "6px" })}"><!--[-->`);
            ssrRenderList(unref(caracteristicas), (c, i) => {
              _push(`<li style="${ssrRenderStyle({ "display": "flex", "gap": "8px", "font-size": "13px", "color": "#94a3b8" })}"><span style="${ssrRenderStyle({ "color": "#0EA5E9", "flex-shrink": "0", "margin-top": "2px" })}">\u2014</span>${ssrInterpolate(toDisplayString(c))}</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(recursos).length) {
            _push(`<div><div style="${ssrRenderStyle({ "font-size": "11px", "font-weight": "600", "color": "rgba(100,116,139,0.7)", "text-transform": "uppercase", "letter-spacing": "0.8px", "margin-bottom": "10px" })}">Recursos y manuales</div><div style="${ssrRenderStyle({ "display": "flex", "flex-wrap": "wrap", "gap": "8px" })}"><!--[-->`);
            ssrRenderList(unref(recursos).filter((r) => r.path), (r, i) => {
              var _a2;
              _push(`<a${ssrRenderAttr("href", r.path)} target="_blank" rel="noopener noreferrer" style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "5px", "padding": "6px 12px", "border-radius": "7px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.08)", "font-size": "12px", "color": "#38bdf8", "text-decoration": "none" })}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> ${ssrInterpolate((_a2 = r.recurso) != null ? _a2 : "Recurso")}</a>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(related).length) {
            _push(ssrRenderComponent(_component_MiniProductGrid, {
              title: "Productos relacionados",
              products: unref(related)
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (unref(accesorios).length) {
            _push(ssrRenderComponent(_component_MiniProductGrid, {
              title: "Accesorios",
              products: unref(accesorios)
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProductModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ProductModal-DV7syrtH.mjs.map
