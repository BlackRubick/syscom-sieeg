<template>
  <div class="pv">
    <DocumentoToolbar :listo="!!doc" volver-a="/orders" />
    <p v-if="error" class="pv-msg">{{ error }}</p>
    <p v-else-if="!doc" class="pv-msg">Preparando documento…</p>
    <div v-else class="pv-sheet"><DocumentoPdf v-bind="doc" /></div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types'

definePageMeta({ layout: false, middleware: 'auth' })

type Pedido = Order & {
  cliente?: { rfc: string | null; razonSocial: string | null }
  entrega?: { linea1: string; linea2: string; cp: string; telefono: string } | null
}

const route = useRoute()
const error = ref('')
const order = ref<Pedido | null>(null)

onMounted(async () => {
  try { order.value = (await $fetch<{ order: Pedido }>(`/api/orders/${route.params.id}`)).order }
  catch (e: any) { error.value = e?.data?.message ?? 'No se pudo cargar el pedido' }
})

const ESTADO: Record<string, string> = {
  pending: 'Pendiente', approved: 'Aprobado', processing: 'En proceso', shipped: 'Enviado',
  delivered: 'Entregado', rejected: 'Rechazado', cancelled: 'Cancelado',
}

const doc = computed(() => {
  const o = order.value
  if (!o) return null
  const e = o.entrega
  return {
    tipo: 'Pedido' as const,
    folio: `PED-${o.id.slice(-8).toUpperCase()}`,
    fecha: new Date(o.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
    estado: ESTADO[o.status] ?? o.status,
    referencia: o.quoteNumber ? `Cotización ${formatQuoteNumber(o.quoteNumber)}` : undefined,
    cliente: {
      nombre: o.userName ?? '', razonSocial: o.cliente?.razonSocial, rfc: o.cliente?.rfc, email: o.userEmail,
      telefono: e?.telefono || null,
      direccion: e ? [e.linea1, e.linea2, e.cp ? `C.P. ${e.cp}` : ''].filter(Boolean).join(', ') : null,
      numero: formatClientNumber(o.clientNumber) || null,
    },
    atiende: o.vendedor ? { nombre: o.vendedor.name } : null,
    items: o.items.map(i => ({ codigo: i.sku, descripcion: i.name, cantidad: i.quantity, precio: i.price, imagen: i.images?.[0] })),
    envio: o.shippingFee ?? 0,
    total: o.total,
    notas: o.notes,
    condiciones: [
      'Precios en pesos mexicanos con IVA incluido.',
      'El pedido se surte una vez confirmado el pago.',
      e ? 'Se entrega en la dirección indicada arriba; el tiempo de entrega depende de la paquetería.' : 'El tiempo de entrega se confirma al aprobar el pedido.',
      'La garantía de cada producto es la que otorga su fabricante.',
    ],
  }
})

useHead(() => ({ title: order.value ? `Pedido PED-${order.value.id.slice(-8).toUpperCase()} - SIEEG` : 'Pedido - SIEEG' }))
</script>
