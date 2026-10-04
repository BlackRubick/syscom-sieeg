/* Garantía que da SYSCOM por producto ("5 años", "1 años", "6 meses"…), con singular corregido. */
export function formatGarantia(g?: string | null): string {
  const t = String(g ?? '').trim()
  if (!t || /^(0|no|sin)\b/i.test(t)) return ''
  return t.replace(/^1\s+años?\b/i, '1 año').replace(/^1\s+meses\b/i, '1 mes')
}
