<template>
  <div>
    <div style="font-size:11px;font-weight:600;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">{{ title }}</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;">
      <div v-for="p in products" :key="p.id"
        style="border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);padding:10px;display:flex;flex-direction:column;gap:7px;">
        <img v-if="p.images[0]" :src="p.images[0]" :alt="p.name" style="width:100%;height:70px;object-fit:contain;border-radius:7px;" />
        <div v-else style="height:70px;display:flex;align-items:center;justify-content:center;font-size:24px;">📦</div>
        <div style="font-size:11px;font-weight:600;color:#CBD5E1;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">{{ p.name }}</div>
        <div v-if="p.price > 0" style="font-size:12px;font-weight:700;color:#38bdf8;">{{ fmtCurrency(p.price) }}</div>
        <button @click="add(p)" :disabled="p.stock === 0"
          :style="{ height:'28px', borderRadius:'7px', border:'none', background:addedId===p.id?'rgba(16,185,129,0.15)':'rgba(14,165,233,0.12)', color:addedId===p.id?'#34d399':'#38bdf8', fontSize:'10px', fontWeight:600, cursor:p.stock===0?'not-allowed':'pointer', fontFamily:'inherit', opacity:p.stock===0?0.4:1 }">
          {{ addedId === p.id ? '✓ Agregado' : '+ Agregar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'
defineProps<{ title: string; products: Product[] }>()
const cart    = useCartStore()
const addedId = ref<string | null>(null)
const fmtCurrency = (n: number) => new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN' }).format(n)
function add(p: Product) {
  cart.addItem(p); addedId.value = p.id
  setTimeout(() => { addedId.value = null }, 1500)
}
</script>
