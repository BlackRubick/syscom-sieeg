<template>
  <div :style="{ gridColumn: full ? '1/-1' : undefined }">
    <div style="font-size:10px;font-weight:500;color:#5F6E84;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.6px;">{{ label }}</div>
    <div v-if="value" :style="{ fontSize:'13px', fontWeight:500, color:'#5B6B82', fontFamily: mono ? 'monospace' : 'inherit', wordBreak:'break-word' }">{{ value }}</div>
    <div v-else style="font-size:13px;color:rgba(91,107,130,0.35);">—</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value?: string | null; full?: boolean; mono?: boolean }>()
</script>
