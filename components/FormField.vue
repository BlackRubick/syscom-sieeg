<template>
  <div>
    <label :style="labelStyle">{{ label }}<span v-if="required" style="color:#fb7185;margin-left:2px;">*</span></label>
    <input v-bind="$attrs" :type="type" :value="modelValue" :placeholder="placeholder" :required="required"
      @input="onInput"
      @focus="focus=true" @blur="focus=false"
      :style="inputStyle" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
const props = defineProps<{ label:string; modelValue:string; type?:string; placeholder?:string; required?:boolean; uppercase?:boolean }>()
const emit  = defineEmits(['update:modelValue'])

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', props.uppercase ? val.toUpperCase() : val)
}

const focus = ref(false)
const labelStyle = { display:'block', fontSize:'11px', fontWeight:500, color:'rgba(148,163,184,0.85)', marginBottom:'6px' }
const inputStyle = computed(() => ({
  width:'100%', height:'40px',
  background: focus.value ? 'rgba(14,165,233,0.06)' : 'rgba(255,255,255,0.04)',
  border:`1px solid ${focus.value ? 'rgba(14,165,233,0.45)' : 'rgba(255,255,255,0.1)'}`,
  borderRadius:'10px', padding:'0 12px', fontSize:'13px', color:'#E2E8F0',
  outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'all 0.18s',
  textTransform: props.uppercase ? 'uppercase' : 'none',
}))
</script>
