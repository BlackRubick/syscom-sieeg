import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ inheritAttrs: false },
  __name: "FormField",
  __ssrInlineRender: true,
  props: {
    label: {},
    modelValue: {},
    type: {},
    placeholder: {},
    required: { type: Boolean },
    uppercase: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const focus = ref(false);
    const labelStyle = { display: "block", fontSize: "11px", fontWeight: 500, color: "rgba(148,163,184,0.85)", marginBottom: "6px" };
    const inputStyle = computed(() => ({
      width: "100%",
      height: "40px",
      background: focus.value ? "rgba(14,165,233,0.06)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${focus.value ? "rgba(14,165,233,0.45)" : "rgba(255,255,255,0.1)"}`,
      borderRadius: "10px",
      padding: "0 12px",
      fontSize: "13px",
      color: "#E2E8F0",
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
      transition: "all 0.18s",
      textTransform: props.uppercase ? "uppercase" : "none"
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><label style="${ssrRenderStyle(labelStyle)}">${ssrInterpolate(__props.label)}`);
      if (__props.required) {
        _push(`<span style="${ssrRenderStyle({ "color": "#fb7185", "margin-left": "2px" })}">*</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><input${ssrRenderAttrs(mergeProps(_ctx.$attrs, {
        type: __props.type,
        value: __props.modelValue,
        placeholder: __props.placeholder,
        required: __props.required,
        style: unref(inputStyle)
      }))}></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormField.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=FormField-CqV_UbYV.mjs.map
