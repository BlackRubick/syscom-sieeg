/* Abre la vista previa del CFDI (plantilla propia, sin consumir folio) en una pestaña nueva. */
export function useCfdiPreview() {
  const previewing   = ref(false)
  const previewError = ref('')

  async function openPreview(body: Record<string, unknown>) {
    previewError.value = ''
    // Abrir la pestaña antes del await para que el navegador no la bloquee como popup
    const win = window.open('', '_blank')
    if (win) win.document.write('<p style="font-family:system-ui;padding:24px;color:#64748b;">Generando vista previa…</p>')

    previewing.value = true
    try {
      const html = await $fetch<string>('/api/factura/cfdi/preview', {
        method: 'POST', body, responseType: 'text',
      })
      const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
      if (win) win.location.href = url
      else window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (e: unknown) {
      win?.close()
      const data = (e as { data?: unknown })?.data
      let msg = 'No se pudo generar la vista previa'
      if (typeof data === 'string') { try { msg = JSON.parse(data).message ?? msg } catch { /**/ } }
      else if ((data as { message?: string })?.message) msg = (data as { message: string }).message
      previewError.value = msg
    } finally {
      previewing.value = false
    }
  }

  return { previewing, previewError, openPreview }
}
