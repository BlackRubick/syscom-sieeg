import { refrescarEstadosSyscom } from '~/server/utils/syscomTracking'

// Estado de los pedidos en SYSCOM (facturado, en camino, entregado): se consulta solo cada 10 min,
// sin que nadie tenga que darle a «Actualizar estado».
const CADA_MS = 10 * 60_000

export default defineNitroPlugin(() => {
  if (import.meta.dev || import.meta.prerender) return
  let corriendo = false
  const revisar = async () => {
    if (corriendo) return
    corriendo = true
    try {
      await refrescarEstadosSyscom({ max: 50 })
    } catch (e: any) {
      console.error('[syscom-estados]', e?.message ?? e)
    } finally { corriendo = false }
  }
  setTimeout(revisar, 90_000)
  setInterval(revisar, CADA_MS)
})
