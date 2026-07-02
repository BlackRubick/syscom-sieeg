import { _ as _sfc_main$1 } from './FormField-CqV_UbYV.mjs';
import { defineComponent, ref, watch, unref, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { FileText, X } from '@lucide/vue';
import { u as useAuthStore } from './auth-De5_qdGe.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FiscalDataModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    required: { type: Boolean }
  },
  emits: ["update:modelValue", "completed"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const auth = useAuthStore();
    const activeTab = ref("required");
    const saving = ref(false);
    const formError = ref("");
    const regimenFocus = ref(false);
    const paisFocus = ref(false);
    const cfdiF = ref(false);
    const tabs = [
      { key: "required", label: "Datos requeridos" },
      { key: "address", label: "Domicilio fiscal" },
      { key: "contact", label: "Contacto adicional" }
    ];
    const form = ref({
      rfc: "",
      razonSocial: "",
      codpos: "",
      email: "",
      regimen: "",
      pais: "MEX",
      usocfdi: "",
      calle: "",
      numeroExterior: "",
      numeroInterior: "",
      colonia: "",
      ciudad: "",
      delegacion: "",
      localidad: "",
      estado: "",
      numregidtrib: "",
      nombre: "",
      apellidos: "",
      telefono: ""
    });
    watch(() => props.modelValue, (open) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
      if (!open) return;
      activeTab.value = "required";
      formError.value = "";
      const u = auth.user;
      if (!u) return;
      form.value = {
        rfc: (_a = u.fiscalRfc) != null ? _a : "",
        razonSocial: (_b = u.fiscalRazonSocial) != null ? _b : "",
        codpos: (_c = u.fiscalCodpos) != null ? _c : "",
        email: (_d = u.fiscalEmail) != null ? _d : u.email,
        regimen: (_e = u.fiscalRegimen) != null ? _e : "",
        pais: (_f = u.fiscalPais) != null ? _f : "MEX",
        usocfdi: (_g = u.fiscalUsocfdi) != null ? _g : "",
        calle: (_h = u.fiscalCalle) != null ? _h : "",
        numeroExterior: (_i = u.fiscalNumExt) != null ? _i : "",
        numeroInterior: (_j = u.fiscalNumInt) != null ? _j : "",
        colonia: (_k = u.fiscalColonia) != null ? _k : "",
        ciudad: (_l = u.fiscalCiudad) != null ? _l : "",
        delegacion: (_m = u.fiscalDelegacion) != null ? _m : "",
        localidad: (_n = u.fiscalLocalidad) != null ? _n : "",
        estado: (_o = u.fiscalEstado) != null ? _o : "",
        numregidtrib: (_p = u.fiscalNumregidtrib) != null ? _p : "",
        nombre: (_q = u.fiscalNombre) != null ? _q : "",
        apellidos: (_r = u.fiscalApellidos) != null ? _r : "",
        telefono: (_s = u.fiscalTelefono) != null ? _s : ""
      };
    });
    const selectStyle = (focused) => ({
      width: "100%",
      height: "40px",
      background: focused ? "rgba(14,165,233,0.06)" : "#0D1B35",
      border: `1px solid ${focused ? "rgba(14,165,233,0.45)" : "rgba(255,255,255,0.1)"}`,
      borderRadius: "10px",
      padding: "0 12px",
      fontSize: "13px",
      color: "#E2E8F0",
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
      transition: "all 0.18s",
      cursor: "pointer"
    });
    const REGIMENES = [
      { clave: "601", nombre: "General de Ley Personas Morales" },
      { clave: "603", nombre: "Personas Morales con Fines no Lucrativos" },
      { clave: "605", nombre: "Sueldos y Salarios e Ingresos Asimilados a Salarios" },
      { clave: "606", nombre: "Arrendamiento" },
      { clave: "607", nombre: "R\xE9gimen de Enajenaci\xF3n o Adquisici\xF3n de Bienes" },
      { clave: "608", nombre: "Dem\xE1s ingresos" },
      { clave: "610", nombre: "Residentes en el Extranjero sin Establecimiento Permanente en M\xE9xico" },
      { clave: "611", nombre: "Ingresos por Dividendos (socios y accionistas)" },
      { clave: "612", nombre: "Personas F\xEDsicas con Actividades Empresariales y Profesionales" },
      { clave: "614", nombre: "Ingresos por intereses" },
      { clave: "615", nombre: "R\xE9gimen de los ingresos por obtenci\xF3n de premios" },
      { clave: "616", nombre: "Sin obligaciones fiscales" },
      { clave: "620", nombre: "Sociedades Cooperativas de Producci\xF3n" },
      { clave: "621", nombre: "Incorporaci\xF3n Fiscal" },
      { clave: "622", nombre: "Actividades Agr\xEDcolas, Ganaderas, Silv\xEDcolas y Pesqueras" },
      { clave: "623", nombre: "Opcional para Grupos de Sociedades" },
      { clave: "624", nombre: "Coordinados" },
      { clave: "625", nombre: "Actividades Empresariales con ingresos a trav\xE9s de Plataformas Tecnol\xF3gicas" },
      { clave: "626", nombre: "R\xE9gimen Simplificado de Confianza (RESICO)" }
    ];
    const USOS_CFDI = [
      { clave: "G01", nombre: "Adquisici\xF3n de mercancias" },
      { clave: "G02", nombre: "Devoluciones, descuentos o bonificaciones" },
      { clave: "G03", nombre: "Gastos en general" },
      { clave: "I01", nombre: "Construcciones" },
      { clave: "I02", nombre: "Mobiliario y equipo de oficina por inversiones" },
      { clave: "I03", nombre: "Equipo de transporte" },
      { clave: "I04", nombre: "Equipo de computo y accesorios" },
      { clave: "I05", nombre: "Dados, troqueles, moldes, matrices y herramental" },
      { clave: "I06", nombre: "Comunicaciones telef\xF3nicas" },
      { clave: "I07", nombre: "Comunicaciones satelitales" },
      { clave: "I08", nombre: "Otra maquinaria y equipo" },
      { clave: "D01", nombre: "Honorarios m\xE9dicos, dentales y gastos hospitalarios" },
      { clave: "D02", nombre: "Gastos m\xE9dicos por incapacidad o discapacidad" },
      { clave: "D03", nombre: "Gastos funerales" },
      { clave: "D04", nombre: "Donativos" },
      { clave: "D05", nombre: "Intereses reales efectivamente pagados por cr\xE9ditos hipotecarios" },
      { clave: "D06", nombre: "Aportaciones voluntarias al SAR" },
      { clave: "D07", nombre: "Primas por seguros de gastos m\xE9dicos" },
      { clave: "D08", nombre: "Gastos de transportaci\xF3n escolar obligatoria" },
      { clave: "D09", nombre: "Dep\xF3sitos en cuentas para el ahorro y planes de pensiones" },
      { clave: "D10", nombre: "Pagos por servicios educativos (colegiaturas)" },
      { clave: "S01", nombre: "Sin efectos fiscales" },
      { clave: "CP01", nombre: "Pagos" },
      { clave: "CN01", nombre: "N\xF3mina" }
    ];
    const PAISES = [
      { clave: "MEX", nombre: "M\xE9xico" },
      { clave: "USA", nombre: "Estados Unidos" },
      { clave: "CAN", nombre: "Canad\xE1" },
      { clave: "ESP", nombre: "Espa\xF1a" },
      { clave: "ARG", nombre: "Argentina" },
      { clave: "COL", nombre: "Colombia" },
      { clave: "CHL", nombre: "Chile" },
      { clave: "BRA", nombre: "Brasil" },
      { clave: "PER", nombre: "Per\xFA" },
      { clave: "GTM", nombre: "Guatemala" },
      { clave: "DEU", nombre: "Alemania" },
      { clave: "GBR", nombre: "Reino Unido" },
      { clave: "FRA", nombre: "Francia" },
      { clave: "CHN", nombre: "China" },
      { clave: "JPN", nombre: "Jap\xF3n" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormField = _sfc_main$1;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.modelValue) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "background": "rgba(2,6,14,0.82)", "backdrop-filter": "blur(7px)", "z-index": "2000" })}"></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (__props.modelValue) {
          _push2(`<div style="${ssrRenderStyle({ "position": "fixed", "inset": "0", "z-index": "2001", "display": "flex", "align-items": "center", "justify-content": "center", "padding": "16px" })}"><div style="${ssrRenderStyle({ "width": "100%", "max-width": "600px", "max-height": "92vh", "display": "flex", "flex-direction": "column" })}"><div style="${ssrRenderStyle({ "position": "relative", "display": "flex", "flex-direction": "column", "min-height": "0" })}"><div style="${ssrRenderStyle({ "position": "absolute", "inset": "-1px", "border-radius": "22px", "background": "linear-gradient(135deg,rgba(245,158,11,0.5),rgba(14,165,233,0.3),rgba(124,58,237,0.2))", "z-index": "0", "pointer-events": "none" })}"></div><div style="${ssrRenderStyle({ "position": "relative", "z-index": "1", "border-radius": "22px", "background": "linear-gradient(160deg,#0D1B35,#09122A)", "box-shadow": "0 32px 80px rgba(0,0,0,0.75)", "display": "flex", "flex-direction": "column", "min-height": "0" })}"><div style="${ssrRenderStyle({ "padding": "26px 28px 0", "flex-shrink": "0" })}"><div style="${ssrRenderStyle({ "position": "absolute", "top": "0", "left": "15%", "right": "15%", "height": "1px", "background": "linear-gradient(90deg,transparent,rgba(245,158,11,0.7),transparent)", "border-radius": "999px" })}"></div><div style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "margin-bottom": "6px" })}"><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "12px" })}"><div style="${ssrRenderStyle({ "width": "40px", "height": "40px", "border-radius": "12px", "background": "rgba(245,158,11,0.12)", "border": "1px solid rgba(245,158,11,0.25)", "display": "flex", "align-items": "center", "justify-content": "center", "flex-shrink": "0" })}">`);
          _push2(ssrRenderComponent(unref(FileText), {
            size: 18,
            color: "#fbbf24"
          }, null, _parent));
          _push2(`</div><div><div style="${ssrRenderStyle({ "font-size": "16px", "font-weight": "700", "color": "#F1F5F9" })}">Datos fiscales</div><div style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.8)", "margin-top": "2px" })}">Necesarios para la emisi\xF3n de facturas (CFDI)</div></div></div>`);
          if (!__props.required) {
            _push2(`<button style="${ssrRenderStyle({ "width": "30px", "height": "30px", "border-radius": "8px", "background": "rgba(255,255,255,0.05)", "border": "1px solid rgba(255,255,255,0.1)", "display": "flex", "align-items": "center", "justify-content": "center", "cursor": "pointer", "color": "rgba(100,116,139,0.8)", "flex-shrink": "0" })}">`);
            _push2(ssrRenderComponent(unref(X), { size: 14 }, null, _parent));
            _push2(`</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div style="${ssrRenderStyle({ "display": "flex", "gap": "2px", "background": "rgba(255,255,255,0.04)", "border-radius": "10px", "padding": "3px", "margin": "16px 0 0" })}"><!--[-->`);
          ssrRenderList(tabs, (tab) => {
            _push2(`<button style="${ssrRenderStyle({ flex: 1, height: "32px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: unref(activeTab) === tab.key ? 600 : 500, cursor: "pointer", fontFamily: "inherit", background: unref(activeTab) === tab.key ? "linear-gradient(135deg,#0EA5E9,#0284C7)" : "transparent", color: unref(activeTab) === tab.key ? "#fff" : "rgba(100,116,139,0.8)", transition: "all 0.18s" })}">${ssrInterpolate(tab.label)}</button>`);
          });
          _push2(`<!--]--></div></div><div style="${ssrRenderStyle({ "overflow-y": "auto", "padding": "20px 28px", "flex": "1", "min-height": "0" })}"><div style="${ssrRenderStyle(unref(activeTab) === "required" ? null : { display: "none" })}"><p style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.75)", "margin": "0 0 16px" })}">Los campos marcados con <span style="${ssrRenderStyle({ "color": "#fb7185" })}">*</span> son obligatorios.</p><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "14px" })}"><div style="${ssrRenderStyle({ "grid-column": "1/-1" })}">`);
          _push2(ssrRenderComponent(_component_FormField, {
            label: "RFC",
            modelValue: unref(form).rfc,
            "onUpdate:modelValue": ($event) => unref(form).rfc = $event,
            placeholder: "XAXX010101000",
            required: true,
            uppercase: ""
          }, null, _parent));
          _push2(`<p style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.6)", "margin": "4px 0 0" })}">Escr\xEDbelo exactamente como aparece en tu constancia de situaci\xF3n fiscal.</p></div><div style="${ssrRenderStyle({ "grid-column": "1/-1" })}">`);
          _push2(ssrRenderComponent(_component_FormField, {
            label: "Raz\xF3n Social (sin r\xE9gimen capital)",
            modelValue: unref(form).razonSocial,
            "onUpdate:modelValue": ($event) => unref(form).razonSocial = $event,
            placeholder: "MI EMPRESA EJEMPLO",
            required: true,
            uppercase: ""
          }, null, _parent));
          _push2(`<p style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.6)", "margin": "4px 0 0" })}">Sin S.A. de C.V., S. de R.L., etc. Solo la raz\xF3n social base.</p></div>`);
          _push2(ssrRenderComponent(_component_FormField, {
            label: "C\xF3digo Postal",
            modelValue: unref(form).codpos,
            "onUpdate:modelValue": ($event) => unref(form).codpos = $event,
            placeholder: "06600",
            required: true,
            uppercase: ""
          }, null, _parent));
          _push2(ssrRenderComponent(_component_FormField, {
            label: "Email para facturas",
            type: "email",
            modelValue: unref(form).email,
            "onUpdate:modelValue": ($event) => unref(form).email = $event,
            placeholder: "facturacion@empresa.com",
            required: true
          }, null, _parent));
          _push2(`<div><label style="${ssrRenderStyle({ "display": "block", "font-size": "11px", "font-weight": "500", "color": "rgba(148,163,184,0.85)", "margin-bottom": "6px" })}"> R\xE9gimen Fiscal <span style="${ssrRenderStyle({ "color": "#fb7185" })}">*</span></label><select style="${ssrRenderStyle(selectStyle(unref(regimenFocus)))}"><option value="" style="${ssrRenderStyle({ "background": "#0D1B35" })}" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).regimen) ? ssrLooseContain(unref(form).regimen, "") : ssrLooseEqual(unref(form).regimen, "")) ? " selected" : ""}>Selecciona...</option><!--[-->`);
          ssrRenderList(REGIMENES, (r) => {
            _push2(`<option${ssrRenderAttr("value", r.clave)} style="${ssrRenderStyle({ "background": "#0D1B35" })}"${ssrIncludeBooleanAttr(Array.isArray(unref(form).regimen) ? ssrLooseContain(unref(form).regimen, r.clave) : ssrLooseEqual(unref(form).regimen, r.clave)) ? " selected" : ""}>${ssrInterpolate(r.clave)} \u2013 ${ssrInterpolate(r.nombre)}</option>`);
          });
          _push2(`<!--]--></select></div><div><label style="${ssrRenderStyle({ "display": "block", "font-size": "11px", "font-weight": "500", "color": "rgba(148,163,184,0.85)", "margin-bottom": "6px" })}"> Pa\xEDs <span style="${ssrRenderStyle({ "color": "#fb7185" })}">*</span></label><select style="${ssrRenderStyle(selectStyle(unref(paisFocus)))}"><option value="" style="${ssrRenderStyle({ "background": "#0D1B35" })}" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).pais) ? ssrLooseContain(unref(form).pais, "") : ssrLooseEqual(unref(form).pais, "")) ? " selected" : ""}>Selecciona...</option><!--[-->`);
          ssrRenderList(PAISES, (p) => {
            _push2(`<option${ssrRenderAttr("value", p.clave)} style="${ssrRenderStyle({ "background": "#0D1B35" })}"${ssrIncludeBooleanAttr(Array.isArray(unref(form).pais) ? ssrLooseContain(unref(form).pais, p.clave) : ssrLooseEqual(unref(form).pais, p.clave)) ? " selected" : ""}>${ssrInterpolate(p.clave)} \u2013 ${ssrInterpolate(p.nombre)}</option>`);
          });
          _push2(`<!--]--></select></div><div><label style="${ssrRenderStyle({ "display": "block", "font-size": "11px", "font-weight": "500", "color": "rgba(148,163,184,0.85)", "margin-bottom": "6px" })}">Uso de CFDI</label><select style="${ssrRenderStyle(selectStyle(unref(cfdiF)))}"><option value="" style="${ssrRenderStyle({ "background": "#0D1B35" })}"${ssrIncludeBooleanAttr(Array.isArray(unref(form).usocfdi) ? ssrLooseContain(unref(form).usocfdi, "") : ssrLooseEqual(unref(form).usocfdi, "")) ? " selected" : ""}>Sin especificar</option><!--[-->`);
          ssrRenderList(USOS_CFDI, (c) => {
            _push2(`<option${ssrRenderAttr("value", c.clave)} style="${ssrRenderStyle({ "background": "#0D1B35" })}"${ssrIncludeBooleanAttr(Array.isArray(unref(form).usocfdi) ? ssrLooseContain(unref(form).usocfdi, c.clave) : ssrLooseEqual(unref(form).usocfdi, c.clave)) ? " selected" : ""}>${ssrInterpolate(c.clave)} \u2013 ${ssrInterpolate(c.nombre)}</option>`);
          });
          _push2(`<!--]--></select></div></div></div><div style="${ssrRenderStyle(unref(activeTab) === "address" ? null : { display: "none" })}"><p style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.75)", "margin": "0 0 16px" })}">Domicilio fiscal tal como aparece en tu constancia de situaci\xF3n fiscal.</p><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "14px" })}"><div style="${ssrRenderStyle({ "grid-column": "1/-1" })}">`);
          _push2(ssrRenderComponent(_component_FormField, {
            label: "Calle",
            modelValue: unref(form).calle,
            "onUpdate:modelValue": ($event) => unref(form).calle = $event,
            placeholder: "AV. INSURGENTES SUR",
            uppercase: ""
          }, null, _parent));
          _push2(`</div>`);
          _push2(ssrRenderComponent(_component_FormField, {
            label: "N\xFAmero exterior",
            modelValue: unref(form).numeroExterior,
            "onUpdate:modelValue": ($event) => unref(form).numeroExterior = $event,
            placeholder: "1234",
            uppercase: ""
          }, null, _parent));
          _push2(ssrRenderComponent(_component_FormField, {
            label: "N\xFAmero interior",
            modelValue: unref(form).numeroInterior,
            "onUpdate:modelValue": ($event) => unref(form).numeroInterior = $event,
            placeholder: "PISO 5",
            uppercase: ""
          }, null, _parent));
          _push2(ssrRenderComponent(_component_FormField, {
            label: "Colonia",
            modelValue: unref(form).colonia,
            "onUpdate:modelValue": ($event) => unref(form).colonia = $event,
            placeholder: "DEL VALLE",
            uppercase: ""
          }, null, _parent));
          _push2(ssrRenderComponent(_component_FormField, {
            label: "Ciudad",
            modelValue: unref(form).ciudad,
            "onUpdate:modelValue": ($event) => unref(form).ciudad = $event,
            placeholder: "CIUDAD DE M\xC9XICO",
            uppercase: ""
          }, null, _parent));
          _push2(ssrRenderComponent(_component_FormField, {
            label: "Delegaci\xF3n / Municipio",
            modelValue: unref(form).delegacion,
            "onUpdate:modelValue": ($event) => unref(form).delegacion = $event,
            placeholder: "BENITO JU\xC1REZ",
            uppercase: ""
          }, null, _parent));
          _push2(ssrRenderComponent(_component_FormField, {
            label: "Localidad",
            modelValue: unref(form).localidad,
            "onUpdate:modelValue": ($event) => unref(form).localidad = $event,
            placeholder: "",
            uppercase: ""
          }, null, _parent));
          _push2(ssrRenderComponent(_component_FormField, {
            label: "Estado",
            modelValue: unref(form).estado,
            "onUpdate:modelValue": ($event) => unref(form).estado = $event,
            placeholder: "CIUDAD DE M\xC9XICO",
            uppercase: ""
          }, null, _parent));
          _push2(`</div></div><div style="${ssrRenderStyle(unref(activeTab) === "contact" ? null : { display: "none" })}"><p style="${ssrRenderStyle({ "font-size": "12px", "color": "rgba(100,116,139,0.75)", "margin": "0 0 16px" })}">Informaci\xF3n adicional del contacto fiscal.</p><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "14px" })}">`);
          _push2(ssrRenderComponent(_component_FormField, {
            label: "Nombre",
            modelValue: unref(form).nombre,
            "onUpdate:modelValue": ($event) => unref(form).nombre = $event,
            placeholder: "JUAN",
            uppercase: ""
          }, null, _parent));
          _push2(ssrRenderComponent(_component_FormField, {
            label: "Apellidos",
            modelValue: unref(form).apellidos,
            "onUpdate:modelValue": ($event) => unref(form).apellidos = $event,
            placeholder: "P\xC9REZ GARC\xCDA",
            uppercase: ""
          }, null, _parent));
          _push2(ssrRenderComponent(_component_FormField, {
            label: "Tel\xE9fono",
            modelValue: unref(form).telefono,
            "onUpdate:modelValue": ($event) => unref(form).telefono = $event,
            placeholder: "5512345678"
          }, null, _parent));
          _push2(`<div style="${ssrRenderStyle({ "grid-column": "1/-1" })}">`);
          _push2(ssrRenderComponent(_component_FormField, {
            label: "N\xFAm. Registro ID Tributario (extranjeros)",
            modelValue: unref(form).numregidtrib,
            "onUpdate:modelValue": ($event) => unref(form).numregidtrib = $event,
            placeholder: "SOLO SI APLICA",
            uppercase: ""
          }, null, _parent));
          _push2(`<p style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.6)", "margin": "4px 0 0" })}">Solo requerido para residentes en el extranjero.</p></div></div></div></div><div style="${ssrRenderStyle({ "padding": "16px 28px 24px", "flex-shrink": "0", "border-top": "1px solid rgba(255,255,255,0.06)" })}">`);
          if (unref(formError)) {
            _push2(`<div style="${ssrRenderStyle({ "padding": "9px 12px", "border-radius": "8px", "background": "rgba(244,63,94,0.1)", "border": "1px solid rgba(244,63,94,0.25)", "font-size": "12px", "color": "#fb7185", "margin-bottom": "12px" })}">${ssrInterpolate(unref(formError))}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "gap": "10px" })}"><div style="${ssrRenderStyle({ "font-size": "11px", "color": "rgba(100,116,139,0.6)" })}">`);
          if (__props.required) {
            _push2(`<span>Completa los datos requeridos para continuar usando la plataforma.</span>`);
          } else {
            _push2(`<span>Puedes actualizar estos datos en cualquier momento.</span>`);
          }
          _push2(`</div><div style="${ssrRenderStyle({ "display": "flex", "gap": "10px", "flex-shrink": "0" })}">`);
          if (!__props.required) {
            _push2(`<button type="button" style="${ssrRenderStyle({ "height": "38px", "padding": "0 18px", "border-radius": "10px", "border": "1px solid rgba(255,255,255,0.1)", "background": "rgba(255,255,255,0.04)", "color": "#94a3b8", "font-size": "13px", "cursor": "pointer", "font-family": "inherit" })}"> Cancelar </button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} style="${ssrRenderStyle({ height: "38px", padding: "0 22px", borderRadius: "10px", border: "none", background: unref(saving) ? "rgba(14,165,233,0.4)" : "linear-gradient(135deg,#0EA5E9,#0284C7)", color: "white", fontSize: "13px", fontWeight: 600, cursor: unref(saving) ? "not-allowed" : "pointer", fontFamily: "inherit", whiteSpace: "nowrap" })}">${ssrInterpolate(unref(saving) ? "Guardando..." : "Guardar datos fiscales")}</button></div></div></div></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FiscalDataModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=FiscalDataModal-EKhs8asu.mjs.map
