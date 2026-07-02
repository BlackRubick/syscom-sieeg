<template>
  <div>
    <label :style="labelStyle">{{ label }}<span style="color:#fb7185;margin-left:2px;">*</span></label>
    <select :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      @focus="focus=true" @blur="focus=false" :style="selectStyle">
      <option v-for="o in options" :key="o.value" :value="o.value" style="background:#0D1B35;">{{ o.label }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label:string; modelValue:string; options:{ value:string; label:string }[] }>()
defineEmits(['update:modelValue'])
const focus = ref(false)
const labelStyle = { display:'block', fontSize:'11px', fontWeight:500, color:'rgba(148,163,184,0.85)', marginBottom:'6px' }
const selectStyle = computed(() => ({ width:'100%', height:'40px', background: focus.value ? 'rgba(14,165,233,0.06)' : '#0D1B35', border:`1px solid ${focus.value ? 'rgba(14,165,233,0.45)' : 'rgba(255,255,255,0.1)'}`, borderRadius:'10px', padding:'0 12px', fontSize:'13px', color:'#E2E8F0', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'all 0.18s', cursor:'pointer' }))
</script>
