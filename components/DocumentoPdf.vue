<template>
  <article class="doc">
    <!-- Encabezado -->
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
        <div class="doc-type">{{ tipo }}</div>
        <div class="doc-folio">{{ folio }}</div>
        <table class="doc-idtable">
          <tr><th>Fecha</th><td>{{ fecha }}</td></tr>
          <tr v-if="estado"><th>Estado</th><td>{{ estado }}</td></tr>
          <tr v-if="referencia"><th>Referencia</th><td>{{ referencia }}</td></tr>
          <tr v-if="ordenCompra"><th>Orden de compra</th><td>{{ ordenCompra }}</td></tr>
        </table>
      </div>
    </header>

    <div v-if="titulo" class="doc-title">{{ titulo }}</div>

    <!-- Cliente y datos de atención -->
    <section class="doc-parties">
      <div class="doc-party">
        <div class="doc-label doc-label-row"><span>Cliente</span><span v-if="cliente.numero" class="doc-clnum">{{ cliente.numero }}</span></div>
        <div class="doc-party-name">{{ cliente.razonSocial || cliente.nombre }}</div>
        <div v-if="cliente.razonSocial && cliente.razonSocial !== cliente.nombre">Atención: {{ cliente.nombre }}</div>
        <div v-if="cliente.rfc">RFC: {{ cliente.rfc }}</div>
        <div v-if="cliente.direccion">{{ cliente.direccion }}</div>
        <div>{{ [cliente.email, cliente.telefono].filter(Boolean).join(' · ') }}</div>
      </div>
      <div class="doc-party">
        <div class="doc-label">Atendido por</div>
        <div class="doc-party-name">{{ atiende?.nombre ?? 'SIEEG Integradores' }}</div>
        <div v-if="atiende?.email">{{ atiende.email }}</div>
        <div>Moneda: pesos mexicanos (MXN)</div>
        <div>Forma de pago: transferencia bancaria</div>
      </div>
    </section>

    <!-- Productos -->
    <table class="doc-items">
      <thead>
        <tr>
          <th class="n">#</th>
          <th class="img" />
          <th>Descripción</th>
          <th class="c">Cant.</th>
          <th class="r">Precio unitario</th>
          <th class="r">Importe</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(it, i) in items" :key="`${it.codigo}-${i}`">
          <td class="n">{{ i + 1 }}</td>
          <td class="img"><img v-if="it.imagen" :src="it.imagen" alt="" /></td>
          <td>
            <div class="doc-item-name">{{ it.descripcion }}</div>
            <div class="doc-item-code">Modelo: {{ it.codigo }}</div>
          </td>
          <td class="c">{{ it.cantidad }}</td>
          <td class="r">{{ money(it.precio) }}</td>
          <td class="r b">{{ money(it.precio * it.cantidad) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Totales -->
    <section class="doc-summary">
      <div class="doc-words">
        <div class="doc-label">Importe con letra</div>
        <div class="doc-words-text">{{ importeConLetra(total) }}</div>
        <template v-if="notas">
          <div class="doc-label" style="margin-top:12px;">Comentarios</div>
          <div class="doc-notes">{{ notas }}</div>
        </template>
      </div>
      <table class="doc-totals">
        <tr><th>Subtotal</th><td>{{ money(desglose.subtotal) }}</td></tr>
        <tr><th>IVA 16%</th><td>{{ money(desglose.iva) }}</td></tr>
        <tr><th>Envío</th><td>{{ money(envio) }}</td></tr>
        <tr class="doc-total"><th>Total</th><td>{{ money(total) }}</td></tr>
      </table>
    </section>

    <!-- Condiciones -->
    <section class="doc-terms">
      <div class="doc-label">Condiciones</div>
      <ol>
        <li v-for="c in condiciones" :key="c">{{ c }}</li>
      </ol>
    </section>

    <footer class="doc-foot">
      <span>Gracias por su preferencia.</span>
      <span>SIEEG Integradores · 961 333 6529 · contacto@sieeg.com.mx</span>
    </footer>
  </article>
</template>

<script setup lang="ts">
/* Documento imprimible (cotización o pedido) en tamaño carta. Solo presentación: recibe los datos ya calculados. */
export interface DocItem { codigo: string; descripcion: string; cantidad: number; precio: number; imagen?: string }
export interface DocCliente { nombre: string; razonSocial?: string | null; rfc?: string | null; email?: string | null; telefono?: string | null; direccion?: string | null; numero?: string | null }

const props = defineProps<{
  tipo: 'Cotización' | 'Pedido'
  folio: string
  fecha: string
  estado?: string
  referencia?: string
  titulo?: string | null
  cliente: DocCliente
  atiende?: { nombre: string; email?: string | null } | null
  items: DocItem[]
  envio: number
  total: number
  notas?: string | null
  ordenCompra?: string | null
  condiciones: string[]
}>()

const desglose = computed(() => desgloseTotales(props.total))
const money = (n: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
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

.doc-title { margin-top: 16px; font-size: 16px; font-weight: 800; }

.doc-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 16px; }
.doc-party { padding: 12px 14px; border: 1px solid var(--line); border-radius: 8px; background: var(--soft); color: #33445C; font-size: 10.5px; }
.doc-party-name { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
.doc-label { font-size: 9.5px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; }
.doc-label-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
.doc-clnum { font-size: 12px; letter-spacing: .5px; color: var(--ink); font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; }

.doc-items { width: 100%; border-collapse: collapse; margin-top: 18px; }
.doc-items thead th { background: var(--ink); color: #fff; font-size: 9.5px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; padding: 8px 8px; text-align: left; }
.doc-items thead th:first-child { border-radius: 6px 0 0 0; }
.doc-items thead th:last-child { border-radius: 0 6px 0 0; }
.doc-items td { padding: 8px; border-bottom: 1px solid var(--line); vertical-align: middle; }
.doc-items tbody tr:nth-child(even) td { background: var(--soft); }
.doc-items .n { width: 26px; text-align: center; color: var(--muted); }
.doc-items .img { width: 44px; padding: 4px; }
.doc-items .img img { width: 36px; height: 36px; object-fit: contain; display: block; background: #fff; border-radius: 4px; }
.doc-items .c { text-align: center; width: 48px; }
.doc-items .r { text-align: right; white-space: nowrap; width: 100px; }
.doc-items .b { font-weight: 700; }
.doc-item-name { font-weight: 600; }
.doc-item-code { font-size: 9.5px; color: var(--muted); font-family: ui-monospace, Menlo, Consolas, monospace; margin-top: 1px; }

.doc-summary { display: flex; justify-content: space-between; gap: 24px; margin-top: 16px; align-items: flex-start; }
.doc-words { flex: 1; }
.doc-words-text { font-weight: 700; font-size: 11px; }
.doc-notes { white-space: pre-line; color: #33445C; }
.doc-totals { border-collapse: collapse; min-width: 250px; font-size: 11.5px; }
.doc-totals th { text-align: left; font-weight: 500; color: var(--muted); padding: 4px 16px 4px 0; }
.doc-totals td { text-align: right; padding: 4px 0; font-weight: 600; }
.doc-total th, .doc-total td { background: var(--ink); color: #fff; font-size: 14px; font-weight: 800; padding: 9px 12px; }
.doc-total th { border-radius: 6px 0 0 6px; }
.doc-total td { border-radius: 0 6px 6px 0; }

.doc-terms { margin-top: 20px; padding-top: 12px; border-top: 1px solid var(--line); color: #33445C; font-size: 10px; }
.doc-terms ol { margin: 0; padding-left: 16px; }
.doc-terms li { margin: 2px 0; }

.doc-foot { display: flex; justify-content: space-between; gap: 12px; margin-top: 22px; padding-top: 10px; border-top: 3px solid var(--brand); font-size: 9.5px; color: var(--muted); }

.doc-items tr, .doc-summary, .doc-parties, .doc-terms { break-inside: avoid; }

@media (max-width: 700px) {
  .doc { padding: 20px 16px; }
  .doc-head, .doc-summary { flex-direction: column; }
  .doc-idbox { text-align: left; }
  .doc-idtable { margin-left: 0; }
  .doc-parties { grid-template-columns: 1fr; }
  .doc-items .img { display: none; }
  .doc-totals { width: 100%; }
}
@media print {
  .doc { max-width: none; padding: 0; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
