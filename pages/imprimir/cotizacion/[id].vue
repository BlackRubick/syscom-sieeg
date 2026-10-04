<template>
  <div class="pv">
    <DocumentoToolbar :listo="!!doc" :volver-a="`/quotes/${route.params.id}`" />
    <p v-if="error" class="pv-msg">{{ error }}</p>
    <p v-else-if="!doc" class="pv-msg">Preparando documento…</p>
    <div v-else class="pv-sheet"><DocumentoPdf v-bind="doc" /></div>
  </div>
</template>

<script setup lang="ts">
import type { OrderItem } from '~/types'

definePageMeta({ layout: false, middleware: 'auth' })

interface Quote {
  folio: string; name: string | null; status: 'open' | 'converted' | 'cancelled'; items: OrderItem[]; total: number; notes: string | null; purchaseOrder: string | null; createdAt: string
  cliente: { name: string; email: string; clientNumber: number | null; mostrador: boolean; razonSocial: string | null; rfc: string | null; telefono: string | null; direccion: string | null }
  vendedor: { name: string; email: string } | null
}
interface Precios { items: Array<OrderItem & { disponible: boolean }>; envio: number; total: number }

const route = useRoute()
const error = ref('')
const data  = ref<{ quote: Quote; precios: Precios | null } | null>(null)

onMounted(async () => {
  try { data.value = await $fetch(`/api/quotes/${route.params.id}`) }
  catch (e: any) { error.value = e?.data?.message ?? 'No se pudo cargar la cotización' }
})

const ESTADO = { open: 'Vigente', converted: 'Convertida en pedido', cancelled: 'Cancelada' } as const

const doc = computed(() => {
  if (!data.value) return null
  const { quote: q, precios } = data.value
  // Abierta: precio del día (sin los que ya no tienen precio). Cerrada: lo que se guardó.
  const fuente = precios ? precios.items.filter(i => i.disponible) : q.items
  const total  = precios?.total ?? q.total
  return {
    tipo: 'Cotización' as const,
    folio: q.folio,
    fecha: new Date(precios ? Date.now() : q.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
    estado: ESTADO[q.status],
    referencia: precios ? `Cotizada el ${new Date(q.createdAt).toLocaleDateString('es-MX')}` : undefined,
    titulo: q.name ? `Proyecto: ${q.name}` : null,
    cliente: { nombre: q.cliente.mostrador ? 'PUBLICO EN GENERAL' : q.cliente.name, razonSocial: q.cliente.razonSocial, rfc: q.cliente.rfc, email: q.cliente.mostrador ? null : q.cliente.email, telefono: q.cliente.telefono, direccion: q.cliente.direccion, numero: q.cliente.mostrador ? null : formatClientNumber(q.cliente.clientNumber) || null },
    atiende: q.vendedor ? { nombre: q.vendedor.name, email: q.vendedor.email } : null,
    items: fuente.map(i => ({ codigo: i.sku, descripcion: i.name, cantidad: i.quantity, precio: i.price, imagen: i.images?.[0], garantia: i.garantia })),
    envio: precios?.envio ?? Math.max(0, total - totalDe(fuente)),
    total,
    notas: q.notes,
    ordenCompra: q.purchaseOrder,
    condiciones: [
      'Precios en pesos mexicanos con IVA incluido.',
      `Vigencia: ${VIGENCIA_DIAS} días naturales a partir de su emisión (hasta el ${venceCotizacion(q.createdAt)}).`,
      'Precios sujetos a existencias y a cambio sin previo aviso; al confirmar el pedido se aplica el precio del día.',
      'El tiempo de entrega se confirma al realizar el pedido.',
      'La garantía de cada producto es la que otorga su fabricante (se indica en cada partida); se tramita en SIEEG presentando este documento.',
      'Para hacer su pedido, acepte esta cotización desde su cuenta o comuníquese con su asesor.',
    ],
  }
})

// Nombre del archivo al guardar como PDF
useHead(() => ({ title: data.value ? `Cotización ${data.value.quote.folio}${data.value.quote.name ? ` - ${data.value.quote.name}` : ''} - SIEEG` : 'Cotización - SIEEG' }))
</script>
