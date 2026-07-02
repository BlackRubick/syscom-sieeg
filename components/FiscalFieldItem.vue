<template>
  <div :style="{ gridColumn: full ? '1/-1' : undefined }">
    <div style="font-size:10px;font-weight:600;color:rgba(100,116,139,0.5);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:5px;">{{ label }}</div>
    <div v-if="value" style="font-size:13px;font-weight:500;color:#CBD5E1;word-break:break-word;line-height:1.4;">{{ value }}</div>
    <div v-else style="font-size:13px;color:rgba(100,116,139,0.3);">—</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value?: string | null; full?: boolean }>()
</script>
