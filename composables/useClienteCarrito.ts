/* Cliente para el que el vendedor/admin arma el carrito. Se conserva al navegar y al recargar la página. */
const KEY = 'sieeg-carrito-cliente'

export function useClienteCarrito() {
  const cliente = useState<string>('carrito-cliente', () => '')
  if (import.meta.client) {
    if (!cliente.value) {
      try { cliente.value = sessionStorage.getItem(KEY) ?? '' } catch { /* sin storage */ }
    }
    watch(cliente, v => {
      try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY) } catch { /* sin storage */ }
    })
  }
  return cliente
}
