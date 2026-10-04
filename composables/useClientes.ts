/* Lista de clientes para vendedores y administración (selector del carrito y asignación de cotizaciones/pedidos). */
import { esIntegrador } from '~/utils/integrador'
export interface ClienteOpt {
  id: string; name: string; email: string; clientNumber: number | null; role: string; status: string
  razonSocial: string | null; fiscalCompleted: boolean; discountPct: number; pedidos: number; mostrador: boolean
}

const ROL: Record<string, string> = { admin: 'Administrador', seller: 'Vendedor', approver: 'Aprobador', viewer: 'Visor' }

export function useClientes() {
  const clientes = useState<ClienteOpt[]>('clientes-venta', () => [])
  const cargando = ref(false)

  async function cargar() {
    cargando.value = true
    try { clientes.value = (await $fetch<{ clientes: ClienteOpt[] }>('/api/clients')).clientes } catch { /* sin lista, sin selector */ }
    finally { cargando.value = false }
  }

  const mostrador = computed(() => clientes.value.find(c => c.mostrador) ?? null)
  const opciones  = computed(() => clientes.value.map(c => ({
    value: c.id,
    label: c.name,
    badge: c.mostrador ? 'MOSTRADOR' : formatClientNumber(c.clientNumber),
    sub:   c.mostrador ? 'Se asigna después al cliente real'
      : [c.razonSocial ?? c.email, ROL[c.role], esIntegrador(c.discountPct) ? 'Integrador' : '', c.status === 'pending' ? 'Pendiente' : ''].filter(Boolean).join(' · '),
    count: c.mostrador ? undefined : c.pedidos,
    search: `${c.email} ${c.razonSocial ?? ''}`,
  })))

  return { clientes, cargando, cargar, mostrador, opciones }
}
