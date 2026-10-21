import { test } from 'node:test'
import assert from 'node:assert/strict'
import { precioVenta, precioConMargen, costoSyscom } from '../server/utils/preciosPuros'
import { envioDe, esEnvioBasico, desgloseTotales, totalDe, minimoEnvioConIva } from '../utils/orderTotals'
import { esIntegrador, nivelIntegrador, metaMensual, mesEnCurso, nivelAlSubir, nivelAlCerrarMes } from '../utils/integrador'
import { formatGarantia } from '../utils/garantia'
import { formatClientNumber, parseClientNumber } from '../utils/clientNumber'

// Kit de videoportero de SYSCOM: precio público $6,086.57 sin IVA
const kit = { precios: { precio_especial: '6086.57', precio_lista: '6086.57' } }

test('precio de venta: precio SYSCOM − descuento, después + IVA', () => {
  assert.equal(precioVenta(kit, { markupPct: 0, discountPct: 0 }), 7060.42)
  assert.equal(precioVenta(kit, { markupPct: 0, discountPct: 10 }), 6354.38)
  assert.equal(precioVenta(kit, { markupPct: 0, discountPct: 20 }), 5648.34)
  assert.equal(precioVenta(kit, { markupPct: 0, discountPct: 30 }), 4942.29)
})

test('el margen global se suma antes del descuento', () => {
  assert.equal(precioConMargen(kit, { markupPct: 10, discountPct: 0 }), 7766.46)
  assert.equal(precioVenta(kit, { markupPct: 10, discountPct: 20 }), 6213.17)
})

test('base: precio especial y, si no hay, el de lista', () => {
  assert.equal(costoSyscom({ precios: { precio_especial: '0', precio_lista: '100' } }), 100)
  assert.equal(costoSyscom({ precios: { precio_especial: '80', precio_lista: '100' } }), 80)
  assert.equal(costoSyscom({ precios: {} }), 0)
})

test('envío: cargo bajo el mínimo + IVA; básico (nunca $0) al alcanzarlo', () => {
  const cfg = { freeShippingMin: 1000, shippingFee: 200, basicShippingFee: 1.75 }
  assert.equal(minimoEnvioConIva(cfg), 1160)
  assert.equal(envioDe(1159.99, cfg), 200)
  assert.equal(envioDe(1160, cfg), 1.75)
  assert.equal(envioDe(0, cfg), 0)
  assert.equal(esEnvioBasico(5000, cfg), true)
})

test('totales: el IVA solo se desglosa (precios con IVA incluido)', () => {
  assert.deepEqual(desgloseTotales(116), { subtotal: 100, iva: 16, total: 116 })
  assert.equal(totalDe([{ price: 10.5, quantity: 3 }, { price: 1, quantity: 2 }]), 33.5)
})

test('integrador: solo niveles 10, 20 y 25', () => {
  assert.equal(esIntegrador(25), true)
  assert.equal(esIntegrador(30), false)
  assert.equal(esIntegrador(15), false)
  assert.equal(nivelIntegrador(20), 20)
  assert.equal(nivelIntegrador(0), 0)
  assert.equal(nivelIntegrador(true), 25)
  assert.equal(nivelIntegrador(30), null)
})

test('garantía con singular corregido', () => {
  assert.equal(formatGarantia('1 años'), '1 año')
  assert.equal(formatGarantia('5 años'), '5 años')
  assert.equal(formatGarantia('Sin garantía'), '')
  assert.equal(formatGarantia(undefined), '')
})

test('número de cliente: solo el número y acepta el formato anterior', () => {
  assert.equal(formatClientNumber(12), '0012')
  assert.equal(parseClientNumber('CL-0012'), 12)
  assert.equal(parseClientNumber('0012'), 12)
  assert.equal(parseClientNumber('hola'), null)
})

test('integrador: compra mínima mensual por nivel (25 % → 5000, 20 % → 2800, 10 % → 1000)', () => {
  assert.equal(metaMensual(0, 9000), null)
  assert.deepEqual(metaMensual(25, 3200), { nivel: 25, minimo: 5000, comprado: 3200, falta: 1800, avance: 64, cumplida: false, bajaA: 20, sube: null })
  assert.deepEqual(metaMensual(10, 500)!.sube, { nivel: 20, falta: 2300 })
  assert.equal(metaMensual(10, 500)!.bajaA, 10)
  assert.equal(metaMensual(20, 2800)!.cumplida, true)
  assert.equal(metaMensual(20, 2799.99)!.falta, 0.01)
  assert.equal(metaMensual(10, 0)!.falta, 1000)
  assert.equal(metaMensual(10, 4000)!.avance, 100)
})

test('mes en curso en hora de México', () => {
  // 1 de noviembre 03:00 UTC = 31 de octubre 21:00 en México: todavía es octubre
  const { inicio, fin } = mesEnCurso(new Date('2026-11-01T03:00:00Z'))
  assert.equal(inicio.toISOString(), '2026-10-01T06:00:00.000Z')
  assert.equal(fin.toISOString(), '2026-11-01T06:00:00.000Z')
})

test('integrador: al cerrar el mes baja un nivel si no llegó (25 → 20 → 10) y nunca baja del 10', () => {
  assert.equal(nivelAlCerrarMes(25, 4999), 20)
  assert.equal(nivelAlCerrarMes(25, 5000), 25)
  assert.equal(nivelAlCerrarMes(20, 1000), 10)
  assert.equal(nivelAlCerrarMes(10, 0), 10)
  assert.equal(nivelAlCerrarMes(20, 6000), 25)
  assert.equal(nivelAlCerrarMes(0, 9000), 0)
})

test('integrador: sube en el momento al llegar al mínimo de un nivel más alto', () => {
  assert.equal(nivelAlSubir(20, 5000), 25)
  assert.equal(nivelAlSubir(10, 2800), 20)
  assert.equal(nivelAlSubir(10, 5000), 25)
  assert.equal(nivelAlSubir(10, 2799), 10)
  assert.equal(nivelAlSubir(25, 0), 25)
  assert.equal(nivelAlSubir(0, 9000), 0)
})

test('mes anterior y clave del mes', () => {
  const ant = mesEnCurso(new Date('2026-11-01T07:00:00Z'), -1)
  assert.equal(ant.clave, '2026-10')
  assert.equal(ant.inicio.toISOString(), '2026-10-01T06:00:00.000Z')
  assert.equal(mesEnCurso(new Date('2026-01-10T12:00:00Z'), -1).clave, '2025-12')
})
