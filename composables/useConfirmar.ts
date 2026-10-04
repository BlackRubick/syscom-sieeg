/* Confirmación con el diseño de la app (en lugar del confirm() del navegador).
   const ok = await confirmar({ titulo, mensaje, aceptar: 'Sí, cancelar', peligro: true })
   Con `pedirMotivo` devuelve el texto escrito (o null si canceló). */
export interface OpcionesConfirmar {
  titulo: string
  mensaje?: string
  aceptar?: string
  cancelar?: string
  peligro?: boolean
  pedirMotivo?: string        // etiqueta del campo de texto opcional
}

interface Estado extends OpcionesConfirmar { abierto: boolean; motivo: string; resolver?: (v: boolean | string) => void }

export function useConfirmarEstado() {
  return useState<Estado>('confirmar-dialogo', () => ({ abierto: false, titulo: '', motivo: '' }))
}

export function useConfirmar() {
  const estado = useConfirmarEstado()
  function confirmar(op: OpcionesConfirmar & { pedirMotivo: string }): Promise<string | null>
  function confirmar(op: OpcionesConfirmar): Promise<boolean>
  function confirmar(op: OpcionesConfirmar): Promise<boolean | string | null> {
    estado.value.resolver?.(false)
    return new Promise((resolve) => {
      estado.value = {
        ...op, abierto: true, motivo: '',
        resolver: (v) => resolve(op.pedirMotivo ? (v === false ? null : String(v)) : v === true || typeof v === 'string'),
      }
    })
  }
  return { confirmar }
}
