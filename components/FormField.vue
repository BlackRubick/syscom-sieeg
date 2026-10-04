<template>
  <div>
    <label :style="labelStyle">{{ label }}<span v-if="required" style="color:#EF4444;margin-left:2px;">*</span></label>
    <input v-bind="$attrs" :type="type" :value="modelValue" :placeholder="placeholder" :required="required"
      @input="onInput"
      @focus="focus=true" @blur="focus=false"
      :style="inputStyle" />
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
defineOptions({ inheritAttrs: false })
const props = defineProps<{ label:string; modelValue:string; type?:string; placeholder?:string; required?:boolean; uppercase?:boolean }>()
const emit  = defineEmits(['update:modelValue'])

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', props.uppercase ? val.toUpperCase() : val)
}

const focus = ref(false)
const labelStyle: CSSProperties = { display:'block', fontSize:'11px', fontWeight:500, color:'#5B6B82', marginBottom:'6px' }
const inputStyle = computed<CSSProperties>(() => ({
  width:'100%', height:'40px',
  background: focus.value ? 'rgba(21,112,239,0.06)' : 'rgba(11,27,51,0.04)',
  border:`1px solid ${focus.value ? 'rgba(21,112,239,0.45)' : 'rgba(11,27,51,0.1)'}`,
  borderRadius:'10px', padding:'0 12px', fontSize:'13px', color:'#0B1B33',
  outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'all 0.18s',
  textTransform: props.uppercase ? 'uppercase' : 'none',
}))
</script>
