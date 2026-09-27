/* Nombres de categoría para el público: SYSCOM usa nombres técnicos ("Redes e IT", "BMS", "Retail").
   El id sigue siendo el de SYSCOM; solo cambia cómo se muestra. */
const NOMBRES: Record<string, string> = {
  '22':    'Cámaras de seguridad',
  '26':    'Internet y redes',
  '37':    'Control de acceso',
  '30':    'Energía y climatización',
  '65811': 'Cableado',
  '32':    'Alarmas y automatización',
  '38':    'Detección de incendios',
  '25':    'Radios',
  '27':    'GPS para vehículos',
  '66523': 'Audio y video',
  '42':    'Herramientas y material eléctrico',
  '66630': 'Industria y robótica',
  '67040': 'Punto de venta',
}

export function categoriaNombre(id: string, original = ''): string {
  return NOMBRES[id] ?? original
}
