import { subirNiveles, cerrarMesAnterior } from '~/server/utils/nivelesIntegrador'

// Niveles de integrador: cada 5 min sube a quien ya llegó al mínimo de un nivel más alto
// y, al empezar el mes, baja un nivel a quien no llegó al suyo el mes anterior.
const CADA_MS = 5 * 60_000

export default defineNitroPlugin(() => {
  if (import.meta.dev || import.meta.prerender) return
  let corriendo = false
  const revisar = async () => {
    if (corriendo) return
    corriendo = true
    try {
      await cerrarMesAnterior()
      await subirNiveles()
    } catch (e: any) {
      console.error('[integrador]', e?.message ?? e)
    } finally { corriendo = false }
  }
  setTimeout(revisar, 60_000)
  setInterval(revisar, CADA_MS)
})
