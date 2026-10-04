import prisma from '~/server/utils/prisma'

/* Quién puede actuar a nombre de un cliente (levantar pedidos, cotizar y dar de alta clientes). */
export const VENDE_A_CLIENTES = ['admin', 'seller']

export function vendeAClientes(role: string): boolean {
  return VENDE_A_CLIENTES.includes(role)
}

/** Resuelve para qué cliente se hace el pedido o la cotización y valida que se pueda. */
export async function resolverCliente(session: { userId: string; role: string }, clientId?: string | null) {
  if (!clientId || clientId === session.userId) {
    return { clientId: session.userId, sellerId: null as string | null }
  }
  if (!vendeAClientes(session.role)) {
    throw createError({ statusCode: 403, message: 'Solo vendedores y administradores pueden hacer pedidos a nombre de un cliente' })
  }
  const cliente = await prisma.user.findUnique({ where: { id: clientId }, select: { id: true, role: true, status: true } })
  if (!cliente) throw createError({ statusCode: 404, message: 'Cliente no encontrado' })
  // Solo se vende a clientes (compradores): no a nombre de otro vendedor o de un administrador
  if (cliente.role !== 'buyer') throw createError({ statusCode: 400, message: 'Solo se puede cotizar o pedir a nombre de un cliente' })
  if (cliente.status === 'inactive') throw createError({ statusCode: 400, message: 'La cuenta del cliente está dada de baja' })
  return { clientId: cliente.id, sellerId: session.userId }
}
