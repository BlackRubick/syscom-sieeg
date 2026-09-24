import type { CfdiConcepto, FacturaEmisor } from '~/server/utils/factura'

/* Plantilla propia de vista previa de CFDI 4.0.
   Se genera localmente con los mismos conceptos que se enviarían a Factura.com,
   sin crear borrador ni consumir folio. */

export interface CfdiPreviewData {
  emisor:   FacturaEmisor
  receptor: {
    rfc:         string
    razonSocial: string
    regimen:     string
    codpos:      string
    usoCfdi:     string
    email?:      string
  }
  serie:       string
  conceptos:   CfdiConcepto[]
  formaPago:   string
  metodoPago:  string
  moneda:      string
  comentarios?: string
  informacionGlobal?: { periodicidad: string; meses: string; año: string }
  referencia?:  string
  logoUrl?:     string
  entorno:      'sandbox' | 'production'
}

const FORMAS_PAGO: Record<string, string> = {
  '01': 'Efectivo', '02': 'Cheque nominativo', '03': 'Transferencia electrónica de fondos',
  '04': 'Tarjeta de crédito', '05': 'Monedero electrónico', '06': 'Dinero electrónico',
  '28': 'Tarjeta de débito', '29': 'Tarjeta de servicios', '99': 'Por definir',
}
const METODOS_PAGO: Record<string, string> = {
  PUE: 'Pago en una sola exhibición', PPD: 'Pago en parcialidades o diferido',
}
const USOS_CFDI: Record<string, string> = {
  G01: 'Adquisición de mercancías', G02: 'Devoluciones, descuentos o bonificaciones', G03: 'Gastos en general',
  I01: 'Construcciones', I02: 'Mobiliario y equipo de oficina por inversiones', I03: 'Equipo de transporte',
  I04: 'Equipo de cómputo y accesorios', I05: 'Dados, troqueles, moldes, matrices y herramental',
  I06: 'Comunicaciones telefónicas', I07: 'Comunicaciones satelitales', I08: 'Otra maquinaria y equipo',
  D01: 'Honorarios médicos, dentales y gastos hospitalarios', D10: 'Pagos por servicios educativos (colegiaturas)',
  S01: 'Sin efectos fiscales', CP01: 'Pagos', CN01: 'Nómina',
}
const REGIMENES: Record<string, string> = {
  '601': 'General de Ley Personas Morales', '603': 'Personas Morales con Fines no Lucrativos',
  '605': 'Sueldos y Salarios e Ingresos Asimilados a Salarios', '606': 'Arrendamiento',
  '607': 'Régimen de Enajenación o Adquisición de Bienes', '608': 'Demás ingresos',
  '610': 'Residentes en el Extranjero sin Establecimiento Permanente en México',
  '611': 'Ingresos por Dividendos (socios y accionistas)',
  '612': 'Personas Físicas con Actividades Empresariales y Profesionales',
  '614': 'Ingresos por intereses', '615': 'Régimen de los ingresos por obtención de premios',
  '616': 'Sin obligaciones fiscales', '620': 'Sociedades Cooperativas de Producción',
  '621': 'Incorporación Fiscal', '622': 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras',
  '623': 'Opcional para Grupos de Sociedades', '624': 'Coordinados',
  '625': 'Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
  '626': 'Régimen Simplificado de Confianza',
}
const PERIODICIDADES: Record<string, string> = {
  '01': 'Diario', '02': 'Semanal', '03': 'Quincenal', '04': 'Mensual', '05': 'Bimestral',
}
const MESES: Record<string, string> = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril', '05': 'Mayo', '06': 'Junio',
  '07': 'Julio', '08': 'Agosto', '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre',
  '13': 'Enero-Febrero', '14': 'Marzo-Abril', '15': 'Mayo-Junio', '16': 'Julio-Agosto',
  '17': 'Septiembre-Octubre', '18': 'Noviembre-Diciembre',
}

const esc = (v: unknown) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const withName = (code: string, map: Record<string, string>) =>
  code ? (map[code] ? `${code} — ${map[code]}` : code) : '—'

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100

/* ── Importe con letra ── */
const UNIDADES = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE',
  'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE',
  'VEINTE', 'VEINTIÚN', 'VEINTIDÓS', 'VEINTITRÉS', 'VEINTICUATRO', 'VEINTICINCO', 'VEINTISÉIS', 'VEINTISIETE', 'VEINTIOCHO', 'VEINTINUEVE']
const DECENAS  = ['', '', '', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
const CENTENAS = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']

function menorMil(n: number): string {
  if (n === 0)   return ''
  if (n === 100) return 'CIEN'
  const c = Math.floor(n / 100)
  const r = n % 100
  let txt = CENTENAS[c]
  if (r > 0) {
    const dec = r < 30 ? UNIDADES[r] : DECENAS[Math.floor(r / 10)] + (r % 10 ? ` Y ${UNIDADES[r % 10]}` : '')
    txt = txt ? `${txt} ${dec}` : dec
  }
  return txt
}

function enteroALetras(n: number): string {
  if (n === 0) return 'CERO'
  const millones = Math.floor(n / 1_000_000)
  const miles    = Math.floor((n % 1_000_000) / 1000)
  const resto    = n % 1000
  const partes: string[] = []
  if (millones) partes.push(millones === 1 ? 'UN MILLÓN' : `${enteroALetras(millones)} MILLONES`)
  if (miles)    partes.push(miles === 1 ? 'MIL' : `${menorMil(miles)} MIL`)
  if (resto)    partes.push(menorMil(resto))
  return partes.join(' ')
}

export function importeConLetra(total: number, moneda: string): string {
  const entero   = Math.floor(total)
  const centavos = Math.round((total - entero) * 100)
  const nombre   = moneda === 'USD' ? (entero === 1 ? 'DÓLAR' : 'DÓLARES') : (entero === 1 ? 'PESO' : 'PESOS')
  const sufijo   = moneda === 'USD' ? 'USD' : 'M.N.'
  const base     = enteroALetras(entero)
  const de       = /MILL(ÓN|ONES)$/.test(base) ? ' DE' : ''
  return `${base}${de} ${nombre} ${String(centavos).padStart(2, '0')}/100 ${sufijo}`
}

export function renderCfdiPreview(d: CfdiPreviewData): string {
  const fmt = (n: number) => n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const cur = d.moneda === 'USD' ? 'USD' : 'MXN'

  const subtotal = round2(d.conceptos.reduce((s, c) => s + Number(c.Impuestos.Traslados[0]?.Base ?? 0), 0))
  const iva      = round2(d.conceptos.reduce((s, c) => s + Number(c.Impuestos.Traslados[0]?.Importe ?? 0), 0))
  const total    = round2(subtotal + iva)

  const hoy = new Date().toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Mexico_City' })

  // Factura.com guarda "NA"/"SN" en campos de domicilio vacíos
  const val = (v: string) => (['NA', 'N/A', 'SN', 'S/N'].includes(v.trim().toUpperCase()) ? '' : v.trim())
  const calle = val(d.emisor.calle)
  const direccionEmisor = [
    calle && [calle, val(d.emisor.exterior) && `#${val(d.emisor.exterior)}`, val(d.emisor.interior) && `Int. ${val(d.emisor.interior)}`].filter(Boolean).join(' '),
    val(d.emisor.colonia) && `Col. ${val(d.emisor.colonia)}`,
    [val(d.emisor.ciudad), val(d.emisor.estado)].filter(Boolean).join(', '),
    d.emisor.codpos && `C.P. ${d.emisor.codpos}`,
  ].filter(Boolean).join(' · ')

  const filas = d.conceptos.map((c, i) => {
    const importe = Number(c.Impuestos.Traslados[0]?.Base ?? 0)
    return `<tr>
      <td class="c">${i + 1}</td>
      <td class="mono">${esc(c.ClaveProdServ)}</td>
      <td class="r">${fmt(Number(c.Cantidad))}</td>
      <td>${esc(c.ClaveUnidad)}<br><span class="muted">${esc(c.Unidad)}</span></td>
      <td>${esc(c.Descripcion)}<div class="muted small">Objeto imp. ${esc(c.ObjetoImp)} · IVA 16%: $${fmt(Number(c.Impuestos.Traslados[0]?.Importe ?? 0))}</div></td>
      <td class="r">$${fmt(Number(c.ValorUnitario))}</td>
      <td class="r strong">$${fmt(importe)}</td>
    </tr>`
  }).join('')

  const global = d.informacionGlobal ? `
    <div class="box">
      <div class="box-title">Información global</div>
      <div class="kv"><span>Periodicidad</span><b>${esc(withName(d.informacionGlobal.periodicidad, PERIODICIDADES))}</b></div>
      <div class="kv"><span>Mes(es)</span><b>${esc(withName(d.informacionGlobal.meses, MESES))}</b></div>
      <div class="kv"><span>Año</span><b>${esc(d.informacionGlobal.año)}</b></div>
    </div>` : ''

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vista previa CFDI · ${esc(d.receptor.rfc)}</title>
<style>
  @page { size: letter; margin: 12mm; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #e5e9f0; font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif; color: #1e293b; font-size: 11px; }
  .toolbar { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 20px; background: #0f172a; color: #e2e8f0; font-size: 12px; }
  .toolbar b { color: #fbbf24; }
  .toolbar button { height: 32px; padding: 0 16px; border-radius: 8px; border: none; background: #4f46e5; color: #fff; font-weight: 700; cursor: pointer; font-family: inherit; }
  .page { position: relative; width: 216mm; min-height: 279mm; margin: 20px auto; background: #fff; padding: 14mm; box-shadow: 0 10px 40px rgba(15,23,42,0.18); overflow: hidden; }
  .watermark { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
  .watermark span { transform: rotate(-32deg); font-size: 50px; font-weight: 900; letter-spacing: 4px; color: rgba(220,38,38,0.08); white-space: nowrap; }
  header { display: flex; justify-content: space-between; gap: 20px; padding-bottom: 14px; border-bottom: 3px solid #1e3a8a; }
  .brand { display: flex; gap: 14px; align-items: center; }
  .brand img { width: 64px; height: 64px; object-fit: cover; border-radius: 10px; }
  .brand h1 { margin: 0 0 3px; font-size: 16px; color: #0f172a; }
  .muted { color: #64748b; }
  .small { font-size: 9.5px; }
  .doc { text-align: right; min-width: 200px; }
  .doc .tipo { font-size: 18px; font-weight: 800; color: #1e3a8a; letter-spacing: 1px; }
  .doc .folio { display: inline-block; margin-top: 6px; padding: 4px 10px; border-radius: 6px; background: #fef3c7; color: #92400e; font-weight: 700; }
  .badge { display: inline-block; margin-top: 6px; padding: 3px 8px; border-radius: 6px; background: #fee2e2; color: #b91c1c; font-weight: 700; font-size: 10px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
  .box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; margin-top: 12px; }
  .grid .box { margin-top: 0; }
  .box-title { font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #1e3a8a; margin-bottom: 6px; }
  .kv { display: flex; justify-content: space-between; gap: 10px; padding: 2px 0; }
  .kv span { color: #64748b; white-space: nowrap; }
  .kv b { text-align: right; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-top: 14px; }
  thead th { background: #1e3a8a; color: #fff; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.5px; padding: 7px 6px; text-align: left; }
  tbody td { padding: 7px 6px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  tbody tr:nth-child(even) td { background: #f8fafc; }
  .r { text-align: right; white-space: nowrap; }
  .c { text-align: center; }
  .mono { font-family: ui-monospace, 'SF Mono', Menlo, monospace; }
  .strong { font-weight: 700; }
  .bottom { display: grid; grid-template-columns: 1fr 240px; gap: 14px; margin-top: 14px; align-items: start; }
  .totals .kv { padding: 5px 0; border-bottom: 1px dashed #e2e8f0; }
  .totals .kv.total { border: none; margin-top: 4px; padding: 8px 10px; border-radius: 6px; background: #1e3a8a; color: #fff; font-size: 13px; }
  .totals .kv.total span { color: #c7d2fe; }
  .letra { font-weight: 700; }
  .sat { display: grid; grid-template-columns: 90px 1fr; gap: 12px; margin-top: 14px; }
  .qr { width: 90px; height: 90px; border: 2px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 9px; color: #94a3b8; padding: 6px; }
  .placeholder { font-family: ui-monospace, monospace; color: #94a3b8; font-style: italic; }
  footer { margin-top: 16px; padding-top: 10px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 9.5px; }
  @media print {
    body { background: #fff; }
    .toolbar { display: none; }
    .page { margin: 0; width: auto; min-height: auto; box-shadow: none; padding: 0; }
    thead th, .totals .kv.total, .doc .folio, .badge, tbody tr:nth-child(even) td { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
  @media (max-width: 860px) {
    .page { width: auto; margin: 0; padding: 16px; min-height: auto; }
    .grid, .bottom { grid-template-columns: 1fr; }
    header { flex-direction: column; }
    .doc { text-align: left; }
  }
</style>
</head>
<body>
  <div class="toolbar">
    <div><b>Vista previa</b> · no se creó borrador ni se usó folio${d.entorno === 'sandbox' ? ' · entorno <b>SANDBOX</b>' : ''}</div>
    <button onclick="window.print()">Imprimir / Guardar PDF</button>
  </div>

  <div class="page">
    <div class="watermark"><span>VISTA PREVIA · SIN VALOR FISCAL</span></div>

    <header>
      <div class="brand">
        ${d.logoUrl ? `<img src="${esc(d.logoUrl)}" alt="">` : ''}
        <div>
          <h1>${esc(d.emisor.razonSocial)}</h1>
          <div><b>RFC:</b> <span class="mono">${esc(d.emisor.rfc)}</span></div>
          <div class="muted">Régimen: ${esc(withName(d.emisor.regimenId, REGIMENES))}</div>
          ${direccionEmisor ? `<div class="muted">${esc(direccionEmisor)}</div>` : ''}
          ${d.emisor.email ? `<div class="muted">${esc(d.emisor.email)}</div>` : ''}
        </div>
      </div>
      <div class="doc">
        <div class="tipo">FACTURA</div>
        <div class="muted">CFDI 4.0 · Tipo I — Ingreso</div>
        <div class="folio">Serie ${esc(d.serie || '—')} · Folio: se asigna al timbrar</div>
        <div class="muted" style="margin-top:6px;">Fecha de vista previa: ${esc(hoy)}</div>
        <div class="muted">Lugar de expedición: ${esc(d.emisor.codpos || '—')}</div>
        <div class="badge">SIN VALOR FISCAL</div>
      </div>
    </header>

    <div class="grid" style="margin-top:14px;">
      <div class="box">
        <div class="box-title">Receptor</div>
        <div class="kv"><span>Razón social</span><b>${esc(d.receptor.razonSocial || '—')}</b></div>
        <div class="kv"><span>RFC</span><b class="mono">${esc(d.receptor.rfc || '—')}</b></div>
        <div class="kv"><span>Régimen fiscal</span><b>${esc(withName(d.receptor.regimen, REGIMENES))}</b></div>
        <div class="kv"><span>Domicilio fiscal (C.P.)</span><b>${esc(d.receptor.codpos || '—')}</b></div>
        <div class="kv"><span>Uso CFDI</span><b>${esc(withName(d.receptor.usoCfdi, USOS_CFDI))}</b></div>
        ${d.receptor.email ? `<div class="kv"><span>Correo</span><b>${esc(d.receptor.email)}</b></div>` : ''}
      </div>
      <div class="box">
        <div class="box-title">Pago</div>
        <div class="kv"><span>Forma de pago</span><b>${esc(withName(d.formaPago, FORMAS_PAGO))}</b></div>
        <div class="kv"><span>Método de pago</span><b>${esc(withName(d.metodoPago, METODOS_PAGO))}</b></div>
        <div class="kv"><span>Moneda</span><b>${esc(d.moneda)}</b></div>
        <div class="kv"><span>Exportación</span><b>01 — No aplica</b></div>
        ${d.referencia ? `<div class="kv"><span>Referencia</span><b class="mono">${esc(d.referencia)}</b></div>` : ''}
      </div>
    </div>

    ${global}

    <table>
      <thead>
        <tr>
          <th class="c" style="width:26px;">#</th>
          <th style="width:70px;">Clave SAT</th>
          <th class="r" style="width:60px;">Cant.</th>
          <th style="width:60px;">Unidad</th>
          <th>Descripción</th>
          <th class="r" style="width:90px;">P. unitario</th>
          <th class="r" style="width:95px;">Importe</th>
        </tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>

    <div class="bottom">
      <div>
        <div class="box">
          <div class="box-title">Importe con letra</div>
          <div class="letra">${esc(importeConLetra(total, d.moneda))}</div>
        </div>
        ${d.comentarios ? `<div class="box"><div class="box-title">Observaciones</div>${esc(d.comentarios)}</div>` : ''}
      </div>
      <div class="box totals">
        <div class="kv"><span>Subtotal</span><b>$${fmt(subtotal)}</b></div>
        <div class="kv"><span>IVA trasladado 16%</span><b>$${fmt(iva)}</b></div>
        <div class="kv total"><span>Total ${cur}</span><b>$${fmt(total)}</b></div>
      </div>
    </div>

    <div class="sat">
      <div class="qr">Código QR del SAT<br>(al timbrar)</div>
      <div class="box" style="margin-top:0;">
        <div class="box-title">Timbre fiscal digital</div>
        <div class="kv"><span>Folio fiscal (UUID)</span><b class="placeholder">se genera al timbrar</b></div>
        <div class="kv"><span>No. certificado SAT</span><b class="placeholder">se genera al timbrar</b></div>
        <div class="kv"><span>Fecha de timbrado</span><b class="placeholder">se genera al timbrar</b></div>
        <div class="kv"><span>Sello digital</span><b class="placeholder">se genera al timbrar</b></div>
      </div>
    </div>

    <footer>
      Este documento es una vista previa generada por SIEEG y no es un comprobante fiscal.
      Los importes coinciden con los que se enviarán a timbrar; el folio, UUID, sellos y QR los asigna el SAT al timbrar.
    </footer>
  </div>
</body>
</html>`
}
