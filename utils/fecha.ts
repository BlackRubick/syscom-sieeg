/* Fechas guardadas como "2024-01-15" (sin hora): new Date() las toma como UTC y en México salen un día antes.
   Aquí se leen como fecha local. */
export function parseFecha(s?: string | null): Date | null {
  if (!s) return null
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T12:00:00`) : new Date(s)
  return isNaN(d.getTime()) ? null : d
}

export function fechaCorta(s?: string | null): string {
  const d = parseFecha(s)
  return d ? new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(d) : '—'
}
