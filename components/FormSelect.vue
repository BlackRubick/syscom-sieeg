<template>
  <div>
    <label :style="labelStyle">{{ label }}<span style="color:#EF4444;margin-left:2px;">*</span></label>
    <select :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      @focus="focus=true" @blur="focus=false" :style="selectStyle">
      <option v-for="o in options" :key="o.value" :value="o.value" style="background:#FFFFFF;">{{ o.label }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
defineProps<{ label:string; modelValue:string; options:{ value:string; label:string }[] }>()
defineEmits(['update:modelValue'])
const focus = ref(false)
const labelStyle: CSSProperties = { display:'block', fontSize:'11px', fontWeight:500, color:'#5B6B82', marginBottom:'6px' }
const selectStyle = computed<CSSProperties>(() => ({ width:'100%', height:'40px', background: focus.value ? 'rgba(21,112,239,0.06)' : '#FFFFFF', border:`1px solid ${focus.value ? 'rgba(21,112,239,0.45)' : 'rgba(11,27,51,0.1)'}`, borderRadius:'10px', padding:'0 12px', fontSize:'13px', color:'#0B1B33', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'all 0.18s', cursor:'pointer' }))
</script>
