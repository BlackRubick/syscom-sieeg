<template>
  <div class="pv">
    <DocumentoToolbar :listo="!!rma" :volver-a="`/garantias/${route.params.id}`" />
    <p v-if="error" class="pv-msg">{{ error }}</p>
    <p v-else-if="!rma" class="pv-msg">Preparando documento…</p>
    <div v-else class="pv-sheet">
      <article class="doc">
        <header class="doc-head">
          <div class="doc-company">
            <img src="/logosieeg.jpg" alt="SIEEG" class="doc-logo" />
            <div>
              <div class="doc-company-name">SIEEG Integradores</div>
              <div>Boulevard Belisario Domínguez #4213 L5</div>
              <div>Tuxtla Gutiérrez, Chiapas, México</div>
              <div>Tel. / WhatsApp 961 333 6529 · contacto@sieeg.com.mx</div>
            </div>
          </div>
          <div class="doc-idbox">
            <div class="doc-type">Garantía · RMA</div>
            <div class="doc-folio">{{ rma.folio }}</div>
            <table class="doc-idtable">
              <tr><th>Recibido</th><td>{{ fecha(rma.createdAt) }}</td></tr>
              <tr><th>Estado</th><td>{{ RMA_ESTADOS[rma.status].label }}</td></tr>
              <tr v-if="rma.folioProveedor"><th>RMA proveedor</th><td>{{ rma.folioProveedor }}</td></tr>
            </table>
          </div>
        </header>

        <section class="doc-parties">
          <div class="doc-party">
            <div class="doc-label doc-label-row"><span>Cliente</span><span v-if="rma.cliente.clientNumber && !rma.cliente.mostrador" class="doc-clnum">{{ formatClientNumber(rma.cliente.clientNumber) }}</span></div>
            <div class="doc-party-name">{{ rma.cliente.mostrador ? 'PUBLICO EN GENERAL' : rma.cliente.razonSocial || rma.cliente.name }}</div>
            <div v-if="!rma.cliente.mostrador && rma.cliente.razonSocial && rma.cliente.razonSocial !== rma.cliente.name">Atención: {{ rma.cliente.name }}</div>
            <div>{{ [rma.cliente.mostrador ? null : rma.cliente.email, rma.cliente.telefono].filter(Boolean).join(' · ') }}</div>
          </div>
          <div class="doc-party">
            <div class="doc-label">Recibió</div>
            <div class="doc-party-name">{{ rma.atiende?.name ?? 'SIEEG Integradores' }}</div>
            <div v-if="rma.atiende?.email">{{ rma.atiende.email }}</div>
            <div v-if="rma.orderId">Pedido PED-{{ rma.orderId.slice(-8).toUpperCase() }}</div>
          </div>
        </section>

        <table class="doc-items">
          <thead><tr><th>Modelo</th><th>Descripción</th><th>No. de serie</th><th class="c">Cant.</th></tr></thead>
          <tbody>
            <tr>
              <td class="mono">{{ rma.sku }}</td>
              <td>{{ rma.productName }}</td>
              <td class="mono">{{ rma.serie || '—' }}</td>
              <td class="c">{{ rma.quantity }}</td>
            </tr>
          </tbody>
        </table>

        <section class="doc-block">
          <div class="doc-label">Falla reportada</div>
          <div class="doc-text">{{ rma.falla }}</div>
        </section>
        <section v-if="rma.accesorios" class="doc-block">
          <div class="doc-label">Accesorios recibidos</div>
          <div class="doc-text">{{ rma.accesorios }}</div>
        </section>
        <section v-if="rma.resolucion" class="doc-block">
          <div class="doc-label">Resolución</div>
          <div class="doc-text">{{ rma.resolucion }}</div>
        </section>

        <section class="doc-terms">
          <div class="doc-label">Condiciones de la garantía</div>
          <ol>
            <li>La garantía es la que otorga el fabricante del producto y se tramita a través de nuestro proveedor.</li>
            <li>El tiempo de revisión depende del fabricante; le avisaremos cada avance de su garantía.</li>
            <li>La garantía no aplica por mal uso, golpes, humedad, descargas eléctricas, instalación incorrecta o sellos alterados.</li>
            <li>Presente este comprobante con el folio {{ rma.folio }} para recoger su producto.</li>
          </ol>
        </section>

        <section class="doc-signs">
          <div><span />Entrega (cliente)</div>
          <div><span />Recibe (SIEEG Integradores)</div>
        </section>

        <footer class="doc-foot">
          <span>Consulte el estado de su garantía en su cuenta o por WhatsApp.</span>
          <span>SIEEG Integradores · 961 333 6529 · contacto@sieeg.com.mx</span>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Rma } from '~/utils/rma'

definePageMeta({ layout: false, middleware: 'auth' })

const route = useRoute()
const error = ref('')
const rma   = ref<Rma | null>(null)

onMounted(async () => {
  try { rma.value = (await $fetch<{ rma: Rma }>(`/api/rma/${route.params.id}`)).rma }
  catch (e: any) { error.value = e?.data?.message ?? 'No se pudo cargar la garantía' }
})

const fecha = (iso: string) => new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })

useHead(() => ({ title: rma.value ? `Garantía ${rma.value.folio} - SIEEG` : 'Garantía - SIEEG' }))
</script>

<style scoped>
.doc {
  --ink: #0B1B33; --brand: #1570EF; --muted: #5B6B82; --line: #D9E1EC; --soft: #F4F7FB;
  width: 100%; max-width: 816px; margin: 0 auto; background: #fff; color: var(--ink);
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif; font-size: 11.5px; line-height: 1.45;
  padding: 40px 44px 32px; box-sizing: border-box;
}
.doc * { box-sizing: border-box; }
.doc-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; padding-bottom: 18px; border-bottom: 3px solid var(--ink); }
.doc-company { display: flex; gap: 14px; align-items: center; color: var(--muted); font-size: 10.5px; }
.doc-logo { height: 58px; width: auto; }
.doc-company-name { font-size: 15px; font-weight: 800; color: var(--ink); margin-bottom: 2px; }
.doc-idbox { text-align: right; min-width: 210px; }
.doc-type { font-size: 11px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: var(--brand); }
.doc-folio { font-size: 24px; font-weight: 800; letter-spacing: .5px; margin: 2px 0 8px; font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; }
.doc-idtable { margin-left: auto; border-collapse: collapse; font-size: 10.5px; }
.doc-idtable th { text-align: right; font-weight: 600; color: var(--muted); padding: 1px 10px 1px 0; }
.doc-idtable td { text-align: right; font-weight: 600; padding: 1px 0; }
.doc-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 16px; }
.doc-party { padding: 12px 14px; border: 1px solid var(--line); border-radius: 8px; background: var(--soft); color: #33445C; font-size: 10.5px; }
.doc-party-name { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
.doc-label { font-size: 9.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; }
.doc-label-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
.doc-clnum { font-size: 12px; letter-spacing: .5px; color: var(--ink); font-family: ui-monospace, Menlo, Consolas, monospace; }
.doc-items { width: 100%; border-collapse: collapse; margin-top: 18px; }
.doc-items thead th { background: var(--ink); color: #fff; font-size: 9.5px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; padding: 8px; text-align: left; }
.doc-items td { padding: 10px 8px; border-bottom: 1px solid var(--line); }
.doc-items .c { text-align: center; width: 60px; }
.doc-items .mono { font-family: ui-monospace, Menlo, Consolas, monospace; white-space: nowrap; }
.doc-block { margin-top: 14px; }
.doc-text { white-space: pre-line; color: #33445C; font-size: 11.5px; }
.doc-terms { margin-top: 20px; padding-top: 12px; border-top: 1px solid var(--line); color: #33445C; font-size: 10px; }
.doc-terms ol { margin: 0; padding-left: 16px; }
.doc-terms li { margin: 2px 0; }
.doc-signs { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-top: 56px; text-align: center; font-size: 10.5px; color: var(--muted); }
.doc-signs span { display: block; border-top: 1px solid var(--ink); margin-bottom: 6px; }
.doc-foot { display: flex; justify-content: space-between; gap: 12px; margin-top: 28px; padding-top: 10px; border-top: 3px solid var(--brand); font-size: 9.5px; color: var(--muted); }
@media (max-width: 700px) {
  .doc { padding: 20px 16px; }
  .doc-head { flex-direction: column; }
  .doc-idbox { text-align: left; }
  .doc-idtable { margin-left: 0; }
  .doc-parties, .doc-signs { grid-template-columns: 1fr; gap: 14px; }
}
@media print {
  .doc { max-width: none; padding: 0; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
