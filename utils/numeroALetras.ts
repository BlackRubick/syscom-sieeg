/* Importe con letra para documentos: 12199.98 → "DOCE MIL CIENTO NOVENTA Y NUEVE PESOS 98/100 M.N." */

const UNIDADES = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ',
  'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE', 'VEINTE',
  'VEINTIÚN', 'VEINTIDÓS', 'VEINTITRÉS', 'VEINTICUATRO', 'VEINTICINCO', 'VEINTISÉIS', 'VEINTISIETE', 'VEINTIOCHO', 'VEINTINUEVE']
const DECENAS  = ['', '', '', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
const CENTENAS = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']

function hasta999(n: number): string {
  if (n === 0) return ''
  if (n === 100) return 'CIEN'
  const c = Math.floor(n / 100), r = n % 100
  let txt = CENTENAS[c]
  if (r) {
    const dec = r < 30 ? UNIDADES[r] : `${DECENAS[Math.floor(r / 10)]}${r % 10 ? ` Y ${UNIDADES[r % 10]}` : ''}`
    txt = txt ? `${txt} ${dec}` : dec
  }
  return txt
}

function entero(n: number): string {
  if (n === 0) return 'CERO'
  const millones = Math.floor(n / 1_000_000)
  const miles    = Math.floor((n % 1_000_000) / 1000)
  const resto    = n % 1000
  const partes: string[] = []
  if (millones) partes.push(millones === 1 ? 'UN MILLÓN' : `${hasta999(millones)} MILLONES`)
  if (miles)    partes.push(miles === 1 ? 'MIL' : `${hasta999(miles)} MIL`)
  if (resto)    partes.push(hasta999(resto))
  return partes.join(' ')
}

export function importeConLetra(monto: number): string {
  const centavos = Math.round(monto * 100)
  const pesos = Math.floor(centavos / 100)
  const cts   = String(centavos % 100).padStart(2, '0')
  // "UN MILLÓN DE PESOS" / "DOS MILLONES DE PESOS" cuando no hay miles ni unidades
  const de = pesos >= 1_000_000 && pesos % 1_000_000 === 0 ? ' DE' : ''
  return `${entero(pesos)}${de} ${pesos === 1 ? 'PESO' : 'PESOS'} ${cts}/100 M.N.`
}
