/* Deja pasar solo formato básico del HTML de terceros (descripciones de SYSCOM):
   sin scripts, iframes, estilos, eventos (onclick…) ni ligas javascript:. */
const PERMITIDAS = new Set(['P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'SPAN', 'DIV', 'A', 'IMG', 'SMALL', 'SUB', 'SUP', 'HR', 'BLOCKQUOTE'])
const ATRIBUTOS: Record<string, string[]> = { A: ['href', 'title'], IMG: ['src', 'alt', 'width', 'height'], TD: ['colspan', 'rowspan'], TH: ['colspan', 'rowspan'] }

export function sanitizeHtml(html: string): string {
  if (typeof DOMParser === 'undefined') return ''
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const limpiar = (el: Element) => {
    for (const hijo of [...el.children]) {
      if (!PERMITIDAS.has(hijo.tagName)) {
        // Etiquetas peligrosas se quitan con todo; las desconocidas se cambian por su texto
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'INPUT', 'BUTTON', 'LINK', 'META', 'SVG', 'MATH'].includes(hijo.tagName)) hijo.remove()
        else hijo.replaceWith(doc.createTextNode(hijo.textContent ?? ''))
        continue
      }
      const ok = ATRIBUTOS[hijo.tagName] ?? []
      for (const a of [...hijo.attributes]) {
        const v = a.value.trim().toLowerCase()
        if (!ok.includes(a.name) || ((a.name === 'href' || a.name === 'src') && !/^(https?:|\/)/.test(v))) hijo.removeAttribute(a.name)
      }
      if (hijo.tagName === 'A') { hijo.setAttribute('target', '_blank'); hijo.setAttribute('rel', 'noopener noreferrer') }
      if (hijo.tagName === 'IMG') hijo.setAttribute('loading', 'lazy')
      limpiar(hijo)
    }
  }
  const root = doc.body.firstElementChild!
  limpiar(root)
  return root.innerHTML
}
