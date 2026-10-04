import { test } from 'node:test'
import assert from 'node:assert/strict'
import { precioVenta, precioConMargen, costoSyscom } from '../server/utils/preciosPuros'
import { envioDe, esEnvioBasico, desgloseTotales, totalDe, minimoEnvioConIva } from '../utils/orderTotals'
import { esIntegrador, nivelIntegrador } from '../utils/integrador'
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

test('integrador: solo niveles 10, 20 y 30', () => {
  assert.equal(esIntegrador(30), true)
  assert.equal(esIntegrador(15), false)
  assert.equal(nivelIntegrador(20), 20)
  assert.equal(nivelIntegrador(0), 0)
  assert.equal(nivelIntegrador(true), 30)
  assert.equal(nivelIntegrador(25), null)
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
