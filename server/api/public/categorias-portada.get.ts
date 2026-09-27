import { syscomGet } from '~/server/utils/syscom'
import { rateLimit } from '~/server/utils/rateLimit'
import type { SyscomProducto } from '~/types'

/* Categorías de la landing con una foto representativa (sin precios).
   Se busca un producto típico de cada categoría para que la foto se entienda
   (el primer producto de "Videovigilancia" puede ser un disco duro). */

const CATEGORIAS = [
  { id: '22',    nombre: 'Videovigilancia',                  busqueda: 'camara domo',       tipo: /^c[aá]mara/i },
  { id: '26',    nombre: 'Redes e IT',                       busqueda: 'switch',            tipo: /^switch/i },
  { id: '37',    nombre: 'Control de Acceso',                busqueda: 'lector facial',     tipo: /^terminal/i },
  { id: '30',    nombre: 'Energía y Climatización',          busqueda: 'panel solar',       tipo: /^panel solar/i },
  { id: '65811', nombre: 'Cableado Estructurado',            busqueda: 'bobina cable',      tipo: /^bobina/i },
  { id: '32',    nombre: 'Automatización e Intrusión',       busqueda: 'panel alarma',      tipo: /panel de alarma/i },
  { id: '38',    nombre: 'Detección de Fuego',               busqueda: 'detector humo',     tipo: /^detector de humo/i },
  { id: '25',    nombre: 'Radiocomunicación',                busqueda: 'radio portatil',    tipo: /^radio port/i },
  { id: '27',    nombre: 'GPS y Equipamiento Vehicular',     busqueda: 'dashcam',           tipo: /^dashcam/i },
  { id: '66523', nombre: 'Audio y Video Profesional',        busqueda: 'bafle',             tipo: /^bafle/i },
  { id: '42',    nombre: 'Herramientas y Material Eléctrico', busqueda: 'pinza',            tipo: /^pinzas? ponchadora/i },
  { id: '66630', nombre: 'Industria, BMS y Robots',          busqueda: 'robot',             tipo: /^robot/i },
  { id: '67040', nombre: 'Retail y Punto de Venta',          busqueda: 'impresora tickets', tipo: /^impresora/i },
]

interface CategoriaPortada { id: string; nombre: string; imagen: string; imagen2: string }

const TTL = 12 * 60 * 60 * 1000
let cache: { data: CategoriaPortada[]; exp: number } | null = null

// Dos fotos por categoría: la tarjeta usa la primera y el hero la segunda (para no repetir)
async function portada(c: typeof CATEGORIAS[number]): Promise<[string, string]> {
  try {
    const raw = await syscomGet<{ productos?: SyscomProducto[] }>('/productos', {
      moneda: 'mxn', pagina: '1', por_pagina: '24', categoria: c.id, busqueda: c.busqueda.split(/\s+/).join('+'),
    })
    const conFoto = (raw.productos ?? []).filter(p => typeof p.img_portada === 'string' && p.img_portada)
    const tipicos = conFoto.filter(p => c.tipo.test(String(p.titulo ?? '')))
    const [a, b] = [...tipicos, ...conFoto.filter(p => !tipicos.includes(p))]
    return [a ? String(a.img_portada) : '', b ? String(b.img_portada) : '']
  } catch {
    return ['', '']
  }
}

export default defineEventHandler(async (event) => {
  rateLimit(event, 'public-categorias-portada', 120, 60_000)
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')
  if (cache && cache.exp > Date.now()) return cache.data

  const data: CategoriaPortada[] = []
  // De 4 en 4 para no saturar la API de SYSCOM
  for (let i = 0; i < CATEGORIAS.length; i += 4) {
    const lote = CATEGORIAS.slice(i, i + 4)
    const fotos = await Promise.all(lote.map(portada))
    lote.forEach((c, j) => data.push({ id: c.id, nombre: c.nombre, imagen: fotos[j][0], imagen2: fotos[j][1] }))
  }
  // Solo se guarda en caché si SYSCOM respondió (al menos la mitad con foto)
  if (data.filter(c => c.imagen).length >= CATEGORIAS.length / 2) cache = { data, exp: Date.now() + TTL }
  return data
})
