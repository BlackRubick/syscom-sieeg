import { _ as _sfc_main$1 } from './ProductModal-DV7syrtH.mjs';
import { defineComponent, ref, computed, watch, unref, useSSRContext } from 'vue';
import { ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { Search, ChevronDown, Tag, LayoutGrid, Package, AlertCircle, Loader2, Eye } from '@lucide/vue';
import { f as fetchProductos } from './useSyscom-Bu-iKqE2.mjs';
import { u as useCartStore } from './cart-YNBuivug.mjs';
import 'pinia';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "catalog",
  __ssrInlineRender: true,
  setup(__props) {
    useCartStore();
    const search = ref("");
    const dSearch = ref("");
    const searchFocused = ref(false);
    const sortBy = ref("relevancia");
    const pagina = ref(1);
    const categories = ref([]);
    const activeCategoryId = ref(null);
    const brands = ref([]);
    const activeBrandId = ref(null);
    const brandSearch = ref("");
    const brandDropOpen = ref(false);
    const loadingBrands = ref(false);
    const products = ref([]);
    const cantidad = ref(0);
    const paginas = ref(1);
    const loading = ref(false);
    const loadingCats = ref(true);
    const apiError = ref(null);
    const hoveredId = ref(null);
    const addedIds = ref(/* @__PURE__ */ new Set());
    const detailProduct = ref(null);
    const SORT_OPTIONS = [
      { value: "relevancia", label: "Relevancia" },
      { value: "precio:asc", label: "Precio: menor" },
      { value: "precio:desc", label: "Precio: mayor" },
      { value: "topseller", label: "M\xE1s vendidos" }
    ];
    const hasFilter = computed(() => !!dSearch.value || !!activeCategoryId.value || !!activeBrandId.value);
    const filteredBrands = computed(() => brands.value.filter((b) => !brandSearch.value || b.nombre.toLowerCase().includes(brandSearch.value.toLowerCase())).slice(0, 40));
    let debounceTimer;
    watch(search, (v) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        dSearch.value = v;
        pagina.value = 1;
      }, 250);
    });
    let loadId = 0;
    watch([dSearch, activeCategoryId, activeBrandId, pagina, sortBy], loadProducts);
    async function loadAllCategories(myId) {
      const seen = /* @__PURE__ */ new Set();
      for (const cat of categories.value) {
        if (myId !== loadId) return;
        const r = await fetchProductos({ categoria: cat.id });
        if (myId !== loadId) return;
        const fresh = r.products.filter((p) => !seen.has(p.id));
        fresh.forEach((p) => seen.add(p.id));
        products.value = [...products.value, ...fresh];
        cantidad.value = products.value.length;
        if (loading.value && products.value.length > 0) loading.value = false;
      }
      if (myId === loadId) loading.value = false;
    }
    async function loadProducts() {
      var _a, _b;
      const myId = ++loadId;
      loading.value = true;
      apiError.value = null;
      products.value = [];
      cantidad.value = 0;
      if (!hasFilter.value) {
        paginas.value = 1;
        loadAllCategories(myId);
        return;
      }
      const r = await fetchProductos({
        busqueda: dSearch.value || void 0,
        categoria: (_a = activeCategoryId.value) != null ? _a : void 0,
        marca: (_b = activeBrandId.value) != null ? _b : void 0,
        pagina: pagina.value,
        orden: sortBy.value
      });
      if (myId !== loadId) return;
      products.value = r.products;
      cantidad.value = r.cantidad;
      paginas.value = r.paginas;
      if (r.error) apiError.value = r.error;
      loading.value = false;
    }
    const fmtCurrency = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
    function stockLabel(p) {
      return p.stock > 10 ? "En stock" : p.stock > 0 ? `Solo ${p.stock}` : "Agotado";
    }
    function stockBadgeStyle(p) {
      return p.stock > 10 ? { background: "rgba(16,185,129,0.12)", color: "#34d399" } : p.stock > 0 ? { background: "rgba(245,158,11,0.12)", color: "#fbbf24" } : { background: "rgba(244,63,94,0.12)", color: "#fb7185" };
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_ProductModal = _sfc_main$1;
      _push(`<!--[--><div style="${ssrRenderStyle({ fontFamily: `'Inter',system-ui,sans-serif`, display: "flex", flexDirection: "column", gap: "22px" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "flex-wrap": "wrap", "gap": "12px" })}"><div><h1 style="${ssrRenderStyle({ "font-size": "22px", "font-weight": "800", "color": "#F1F5F9", "margin": "0", "line-height": "1.2" })}">Cat\xE1logo SYSCOM</h1><p style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.85)", "margin": "5px 0 0" })}">${ssrInterpolate(unref(categories).length > 0 ? `${unref(categories).length} categor\xEDas disponibles` : "Cargando cat\xE1logo\u2026")}</p></div>`);
      if (unref(hasFilter)) {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px", "padding": "6px 14px", "border-radius": "20px", "background": "rgba(14,165,233,0.1)", "border": "1px solid rgba(14,165,233,0.2)" })}"><div style="${ssrRenderStyle({ "width": "7px", "height": "7px", "border-radius": "50%", "background": "#0EA5E9" })}"></div><span style="${ssrRenderStyle({ "font-size": "12px", "font-weight": "600", "color": "#38bdf8" })}">${ssrInterpolate(unref(loading) ? "\u2026" : `${unref(cantidad).toLocaleString("es-MX")} resultados`)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "padding": "16px", "display": "flex", "flex-direction": "column", "gap": "14px" })}"><div style="${ssrRenderStyle({ "display": "flex", "gap": "10px", "flex-wrap": "wrap" })}"><div style="${ssrRenderStyle({ "flex": "1", "min-width": "200px", "position": "relative" })}">`);
      _push(ssrRenderComponent(unref(Search), {
        size: 15,
        style: { "position": "absolute", "left": "13px", "top": "50%", "transform": "translateY(-50%)", "pointer-events": "none" },
        color: unref(searchFocused) ? "#0EA5E9" : "rgba(100,116,139,0.7)"
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(search))} placeholder="Buscar por nombre, modelo, marca\u2026" style="${ssrRenderStyle({ width: "100%", height: "42px", background: unref(searchFocused) ? "rgba(14,165,233,0.06)" : "rgba(255,255,255,0.04)", border: `1px solid ${unref(searchFocused) ? "rgba(14,165,233,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: "11px", paddingLeft: "40px", paddingRight: unref(search) ? "36px" : "14px", fontSize: "13px", color: "#E2E8F0", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "all 0.2s" })}">`);
      if (unref(search)) {
        _push(`<button style="${ssrRenderStyle({ "position": "absolute", "right": "12px", "top": "50%", "transform": "translateY(-50%)", "background": "rgba(255,255,255,0.08)", "border": "none", "border-radius": "50%", "width": "18px", "height": "18px", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "rgba(148,163,184,0.8)", "font-size": "12px" })}">\xD7</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div style="${ssrRenderStyle({ "position": "relative", "flex-shrink": "0" })}"><select style="${ssrRenderStyle({ "height": "42px", "padding-left": "14px", "padding-right": "36px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "11px", "font-size": "13px", "color": "#CBD5E1", "outline": "none", "appearance": "none", "cursor": "pointer", "font-family": "inherit", "min-width": "160px" })}"><!--[-->`);
      ssrRenderList(SORT_OPTIONS, (o) => {
        _push(`<option${ssrRenderAttr("value", o.value)} style="${ssrRenderStyle({ "background": "#0D1B35" })}"${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), o.value) : ssrLooseEqual(unref(sortBy), o.value)) ? " selected" : ""}>${ssrInterpolate(o.label)}</option>`);
      });
      _push(`<!--]--></select>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        size: 14,
        color: "rgba(100,116,139,0.8)",
        style: { "position": "absolute", "right": "12px", "top": "50%", "transform": "translateY(-50%)", "pointer-events": "none" }
      }, null, _parent));
      _push(`</div><div style="${ssrRenderStyle({ "position": "relative", "flex-shrink": "0" })}"><button style="${ssrRenderStyle({ height: "42px", padding: "0 14px", borderRadius: "11px", border: `1px solid ${unref(activeBrandId) ? "rgba(14,165,233,0.4)" : "rgba(255,255,255,0.1)"}`, background: unref(activeBrandId) ? "rgba(14,165,233,0.1)" : "rgba(255,255,255,0.04)", color: unref(activeBrandId) ? "#38bdf8" : "#CBD5E1", fontSize: "13px", fontWeight: unref(activeBrandId) ? 600 : 400, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "7px", minWidth: "150px", justifyContent: "space-between" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "6px", "overflow": "hidden" })}">`);
      _push(ssrRenderComponent(unref(Tag), {
        size: 13,
        "stroke-width": 1.8
      }, null, _parent));
      _push(`<span style="${ssrRenderStyle({ "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap", "max-width": "100px" })}">${ssrInterpolate(unref(activeBrandId) ? (_b = (_a = unref(brands).find((b) => b.id === unref(activeBrandId))) == null ? void 0 : _a.nombre) != null ? _b : unref(activeBrandId) : "Marca")}</span></div>`);
      if (unref(activeBrandId)) {
        _push(`<span style="${ssrRenderStyle({ "font-size": "14px", "line-height": "1", "cursor": "pointer" })}">\xD7</span>`);
      } else {
        _push(ssrRenderComponent(unref(ChevronDown), {
          size: 13,
          color: "rgba(100,116,139,0.7)"
        }, null, _parent));
      }
      _push(`</button>`);
      if (unref(brandDropOpen)) {
        _push(`<div style="${ssrRenderStyle({ "position": "absolute", "right": "0", "top": "48px", "width": "240px", "background": "#0D1B35", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "12px", "overflow": "hidden", "z-index": "50", "box-shadow": "0 16px 40px rgba(0,0,0,0.5)" })}"><div style="${ssrRenderStyle({ "padding": "8px" })}"><input${ssrRenderAttr("value", unref(brandSearch))} autofocus placeholder="Buscar marca..." style="${ssrRenderStyle({ "width": "100%", "height": "34px", "background": "rgba(255,255,255,0.05)", "border": "1px solid rgba(255,255,255,0.1)", "border-radius": "8px", "padding": "0 10px", "font-size": "12px", "color": "#E2E8F0", "outline": "none", "font-family": "inherit", "box-sizing": "border-box" })}"></div><div style="${ssrRenderStyle({ "max-height": "220px", "overflow-y": "auto", "padding-bottom": "6px" })}">`);
        if (unref(loadingBrands)) {
          _push(`<div style="${ssrRenderStyle({ "padding": "16px", "text-align": "center", "font-size": "12px", "color": "rgba(100,116,139,0.7)" })}">Cargando marcas\u2026</div>`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList(unref(filteredBrands), (b) => {
            _push(`<button style="${ssrRenderStyle({ display: "block", width: "100%", padding: "8px 14px", fontSize: "12px", color: unref(activeBrandId) === b.id ? "#38bdf8" : "#CBD5E1", background: unref(activeBrandId) === b.id ? "rgba(14,165,233,0.1)" : "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", fontWeight: unref(activeBrandId) === b.id ? 600 : 400 })}">${ssrInterpolate(b.nombre)}</button>`);
          });
          _push(`<!--]-->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(brandDropOpen)) {
        _push(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "z-index": "40" })}"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div style="${ssrRenderStyle({ "display": "flex", "gap": "6px", "overflow-x": "auto", "padding-bottom": "2px" })}" class="no-scrollbar"><button style="${ssrRenderStyle({ flexShrink: 0, height: "30px", padding: "0 12px", borderRadius: "6px", fontSize: "12px", fontWeight: !unref(activeCategoryId) ? 600 : 400, cursor: "pointer", border: "none", fontFamily: "inherit", background: !unref(activeCategoryId) ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.04)", color: !unref(activeCategoryId) ? "#38bdf8" : "rgba(100,116,139,0.75)", outline: `1px solid ${!unref(activeCategoryId) ? "rgba(14,165,233,0.35)" : "rgba(255,255,255,0.07)"}`, display: "flex", alignItems: "center", gap: "6px" })}">`);
      _push(ssrRenderComponent(unref(LayoutGrid), {
        size: 12,
        "stroke-width": !unref(activeCategoryId) ? 2.2 : 1.8
      }, null, _parent));
      _push(` Todos </button>`);
      if (unref(loadingCats)) {
        _push(`<!--[-->`);
        ssrRenderList(6, (i) => {
          _push(`<div class="shimmer-bg" style="${ssrRenderStyle({ "flex-shrink": "0", "height": "30px", "width": "100px", "border-radius": "6px", "background": "rgba(255,255,255,0.04)" })}"></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(categories), (cat) => {
          _push(`<button style="${ssrRenderStyle({ flexShrink: 0, height: "30px", padding: "0 12px", borderRadius: "6px", fontSize: "12px", fontWeight: unref(activeCategoryId) === cat.id ? 600 : 400, cursor: "pointer", border: "none", fontFamily: "inherit", background: unref(activeCategoryId) === cat.id ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.04)", color: unref(activeCategoryId) === cat.id ? "#38bdf8" : "rgba(100,116,139,0.75)", outline: `1px solid ${unref(activeCategoryId) === cat.id ? "rgba(14,165,233,0.35)" : "rgba(255,255,255,0.07)"}`, display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" })}">`);
          _push(ssrRenderComponent(unref(Package), {
            size: 12,
            "stroke-width": unref(activeCategoryId) === cat.id ? 2.2 : 1.8
          }, null, _parent));
          _push(` ${ssrInterpolate(cat.nombre)}</button>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div></div>`);
      if (unref(apiError)) {
        _push(`<div style="${ssrRenderStyle({ "padding": "12px 16px", "border-radius": "10px", "background": "rgba(244,63,94,0.08)", "border": "1px solid rgba(244,63,94,0.2)", "color": "#fb7185", "font-size": "13px", "display": "flex", "align-items": "center", "gap": "10px" })}">`);
        _push(ssrRenderComponent(unref(AlertCircle), {
          size: 16,
          style: { "flex-shrink": "0" }
        }, null, _parent));
        _push(`<span><strong>Error SYSCOM:</strong> ${ssrInterpolate(unref(apiError))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loadingCats) || unref(loading) && !unref(products).length && !unref(hasFilter)) {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", "padding": "72px 0", "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)" })}"><div style="${ssrRenderStyle({ "width": "56px", "height": "56px", "border-radius": "16px", "background": "rgba(14,165,233,0.1)", "border": "1px solid rgba(14,165,233,0.18)", "display": "flex", "align-items": "center", "justify-content": "center", "margin-bottom": "16px" })}">`);
        _push(ssrRenderComponent(unref(Loader2), {
          size: 24,
          color: "#38bdf8",
          "stroke-width": 1.8,
          class: "spin"
        }, null, _parent));
        _push(`</div><div style="${ssrRenderStyle({ "font-size": "16px", "font-weight": "700", "color": "#94a3b8" })}">Conectando con SYSCOM\u2026</div></div>`);
      } else if (unref(loading) && !unref(products).length) {
        _push(`<div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(auto-fill,minmax(240px,1fr))", "gap": "16px" })}"><!--[-->`);
        ssrRenderList(12, (i) => {
          _push(`<div style="${ssrRenderStyle({ "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)", "overflow": "hidden" })}"><div class="shimmer-bg" style="${ssrRenderStyle({ "height": "148px", "background": "rgba(255,255,255,0.03)" })}"></div><div style="${ssrRenderStyle({ "padding": "14px 16px 16px", "display": "flex", "flex-direction": "column", "gap": "10px" })}"><div class="shimmer-bg" style="${ssrRenderStyle({ "height": "10px", "width": "60px", "border-radius": "20px", "background": "rgba(255,255,255,0.06)" })}"></div><div class="shimmer-bg" style="${ssrRenderStyle({ "height": "13px", "width": "90%", "border-radius": "6px", "background": "rgba(255,255,255,0.06)" })}"></div><div class="shimmer-bg" style="${ssrRenderStyle({ "height": "13px", "width": "70%", "border-radius": "6px", "background": "rgba(255,255,255,0.04)" })}"></div><div style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center" })}"><div class="shimmer-bg" style="${ssrRenderStyle({ "height": "18px", "width": "80px", "border-radius": "6px", "background": "rgba(255,255,255,0.06)" })}"></div><div class="shimmer-bg" style="${ssrRenderStyle({ "height": "32px", "width": "90px", "border-radius": "9px", "background": "rgba(14,165,233,0.07)" })}"></div></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(products).length) {
        _push(`<div><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "repeat(auto-fill,minmax(240px,1fr))", "gap": "16px" })}"><!--[-->`);
        ssrRenderList(unref(products), (product) => {
          _push(`<div style="${ssrRenderStyle({ borderRadius: "16px", background: "linear-gradient(160deg,#0D1B35,#091228)", border: `1px solid ${unref(hoveredId) === product.id ? "rgba(14,165,233,0.22)" : "rgba(255,255,255,0.07)"}`, overflow: "hidden", transition: "border-color 0.2s,box-shadow 0.2s,transform 0.2s", boxShadow: unref(hoveredId) === product.id ? "0 12px 32px rgba(0,0,0,0.5),0 0 0 1px rgba(14,165,233,0.12)" : "0 4px 16px rgba(0,0,0,0.35)", transform: unref(hoveredId) === product.id ? "translateY(-4px)" : "translateY(0)" })}"><div style="${ssrRenderStyle({ "position": "relative", "height": "148px", "background": "rgba(255,255,255,0.02)", "display": "flex", "align-items": "center", "justify-content": "center", "overflow": "hidden" })}">`);
          if (product.images[0]) {
            _push(`<img${ssrRenderAttr("src", product.images[0])}${ssrRenderAttr("alt", product.name)} style="${ssrRenderStyle({ "width": "100%", "height": "100%", "object-fit": "contain", "padding": "10px" })}">`);
          } else {
            _push(`<div style="${ssrRenderStyle({ "width": "64px", "height": "64px", "border-radius": "16px", "background": "rgba(14,165,233,0.1)", "border": "1px solid rgba(14,165,233,0.18)", "display": "flex", "align-items": "center", "justify-content": "center" })}">`);
            _push(ssrRenderComponent(unref(Package), {
              size: 26,
              color: "#38bdf8",
              "stroke-width": 1.8
            }, null, _parent));
            _push(`</div>`);
          }
          _push(`<div style="${ssrRenderStyle({ "position": "absolute", "top": "10px", "left": "10px", "display": "flex", "gap": "5px" })}">`);
          if (product.featured) {
            _push(`<span style="${ssrRenderStyle({ "font-size": "9px", "font-weight": "700", "padding": "3px 7px", "border-radius": "4px", "background": "linear-gradient(135deg,#0EA5E9,#22D3EE)", "color": "white" })}">DESTACADO</span>`);
          } else {
            _push(`<!---->`);
          }
          if (product.discount) {
            _push(`<span style="${ssrRenderStyle({ "font-size": "9px", "font-weight": "700", "padding": "3px 7px", "border-radius": "20px", "background": "#10B981", "color": "white" })}">-${ssrInterpolate(product.discount)}%</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span style="${ssrRenderStyle([stockBadgeStyle(product), { "position": "absolute", "top": "10px", "right": "10px", "font-size": "9px", "font-weight": "600", "padding": "3px 7px", "border-radius": "20px" }])}">${ssrInterpolate(stockLabel(product))}</span></div><div style="${ssrRenderStyle({ "padding": "14px 16px 16px" })}"><div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,116,139,0.8)", "font-weight": "500", "margin-bottom": "6px" })}"><span style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.04)", "padding": "2px 7px", "border-radius": "20px" })}">${ssrInterpolate(product.category)}</span></div><div style="${ssrRenderStyle({ fontSize: "13px", fontWeight: 600, color: unref(hoveredId) === product.id ? "#F1F5F9" : "#CBD5E1", marginBottom: "5px", lineHeight: "1.35", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "36px", transition: "color 0.15s" })}">${ssrInterpolate(product.name)}</div>`);
          if (product.sku) {
            _push(`<div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,116,139,0.6)", "margin-bottom": "10px", "font-family": "monospace" })}">${ssrInterpolate(product.sku)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "14px" })}"><span style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(71,85,105,0.9)", "font-weight": "500", "overflow": "hidden", "text-overflow": "ellipsis", "white-space": "nowrap", "max-width": "120px" })}">${ssrInterpolate(product.supplier)}</span></div><div style="${ssrRenderStyle({ "height": "1px", "background": "rgba(255,255,255,0.05)", "margin-bottom": "14px" })}"></div><div style="${ssrRenderStyle({ "margin-bottom": "10px" })}">`);
          if (product.price > 0) {
            _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "baseline", "gap": "8px" })}"><div style="${ssrRenderStyle({ "font-size": "16px", "font-weight": "800", "color": "#F1F5F9", "letter-spacing": "-0.3px" })}">${ssrInterpolate(fmtCurrency(product.price))}</div>`);
            if (product.discount) {
              _push(`<div style="${ssrRenderStyle({ "font-size": "10px", "color": "rgba(100,116,139,0.6)", "text-decoration": "line-through" })}">${ssrInterpolate(fmtCurrency(Math.round(product.price / (1 - product.discount / 100))))}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.6)", "font-style": "italic" })}">Consultar precio</div>`);
          }
          _push(`</div><div style="${ssrRenderStyle({ "display": "flex", "gap": "6px" })}"><button${ssrIncludeBooleanAttr(product.stock === 0) ? " disabled" : ""} style="${ssrRenderStyle({ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", height: "32px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: product.stock === 0 ? "not-allowed" : "pointer", border: "none", fontFamily: "inherit", transition: "all 0.2s", background: unref(addedIds).has(product.id) ? "rgba(16,185,129,0.15)" : "rgba(14,165,233,0.12)", color: unref(addedIds).has(product.id) ? "#34d399" : "#38bdf8", outline: `1px solid ${unref(addedIds).has(product.id) ? "rgba(52,211,153,0.25)" : "rgba(14,165,233,0.22)"}`, opacity: product.stock === 0 ? 0.4 : 1 })}">${ssrInterpolate(unref(addedIds).has(product.id) ? "\u2713 Agregado" : "+ Agregar")}</button><button title="Ver detalle" style="${ssrRenderStyle({ "width": "32px", "height": "32px", "border-radius": "8px", "border": "1px solid rgba(255,255,255,0.1)", "background": "rgba(255,255,255,0.04)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "rgba(100,116,139,0.7)", "flex-shrink": "0" })}">`);
          _push(ssrRenderComponent(unref(Eye), {
            size: 13,
            "stroke-width": 1.8
          }, null, _parent));
          _push(`</button></div></div></div>`);
        });
        _push(`<!--]--></div>`);
        if (unref(paginas) > 1) {
          _push(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "center", "gap": "10px", "margin-top": "28px" })}"><button${ssrIncludeBooleanAttr(unref(pagina) === 1) ? " disabled" : ""} style="${ssrRenderStyle({ height: "36px", padding: "0 16px", borderRadius: "9px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#CBD5E1", fontSize: "13px", cursor: unref(pagina) === 1 ? "not-allowed" : "pointer", opacity: unref(pagina) === 1 ? 0.4 : 1, fontFamily: "inherit" })}">\u2190 Anterior</button><span style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(100,116,139,0.9)" })}">P\xE1gina <strong style="${ssrRenderStyle({ "color": "#E2E8F0" })}">${ssrInterpolate(unref(pagina))}</strong> de <strong style="${ssrRenderStyle({ "color": "#E2E8F0" })}">${ssrInterpolate(unref(paginas))}</strong></span><button${ssrIncludeBooleanAttr(unref(pagina) === unref(paginas)) ? " disabled" : ""} style="${ssrRenderStyle({ height: "36px", padding: "0 16px", borderRadius: "9px", background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.2)", color: "#38bdf8", fontSize: "13px", cursor: unref(pagina) === unref(paginas) ? "not-allowed" : "pointer", opacity: unref(pagina) === unref(paginas) ? 0.4 : 1, fontFamily: "inherit" })}">Siguiente \u2192</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else if (unref(hasFilter) && !unref(loading)) {
        _push(`<div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", "padding": "64px 0", "border-radius": "16px", "background": "linear-gradient(160deg,#0D1B35,#091228)", "border": "1px solid rgba(255,255,255,0.07)" })}"><div style="${ssrRenderStyle({ "width": "52px", "height": "52px", "border-radius": "14px", "background": "rgba(255,255,255,0.04)", "border": "1px solid rgba(255,255,255,0.07)", "display": "flex", "align-items": "center", "justify-content": "center", "margin-bottom": "14px" })}">`);
        _push(ssrRenderComponent(unref(Search), {
          size: 22,
          color: "rgba(100,116,139,0.6)"
        }, null, _parent));
        _push(`</div><div style="${ssrRenderStyle({ "font-size": "15px", "font-weight": "600", "color": "#94a3b8", "margin-bottom": "5px" })}">Sin resultados</div><div style="${ssrRenderStyle({ "font-size": "13px", "color": "rgba(71,85,105,0.9)" })}">Prueba con otra b\xFAsqueda o categor\xEDa</div><button style="${ssrRenderStyle({ "margin-top": "16px", "padding": "8px 18px", "border-radius": "9px", "background": "rgba(14,165,233,0.1)", "border": "1px solid rgba(14,165,233,0.2)", "color": "#38bdf8", "font-size": "12px", "font-weight": "600", "cursor": "pointer", "font-family": "inherit" })}">Limpiar filtros</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(detailProduct)) {
        _push(ssrRenderComponent(_component_ProductModal, {
          product: unref(detailProduct),
          show: !!unref(detailProduct),
          onClose: ($event) => detailProduct.value = null
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/catalog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=catalog-10kkpaaB.mjs.map
