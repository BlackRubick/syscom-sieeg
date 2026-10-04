import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'
import { getMostradorId } from '~/server/utils/mostrador'

/* Borrar un usuario solo si no tiene historial. Sus pedidos, cotizaciones y garantías se borrarían en cascada
   (incluidos pedidos comprados a SYSCOM y facturados), así que en ese caso se pide desactivarlo. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (session.role !== 'admin') throw createError({ statusCode: 403, message: 'Solo administradores pueden eliminar usuarios' })

  const id = getRouterParam(event, 'id')!
  if (id === session.userId) throw createError({ statusCode: 400, message: 'No puedes eliminar tu propia cuenta' })
  if (id === await getMostradorId()) throw createError({ statusCode: 400, message: 'El cliente de mostrador no se puede eliminar' })

  const existing = await prisma.user.findUnique({
    where: { id },
    select: { id: true, _count: { select: { orders: true, quotes: true, rmas: true, sellerOrders: true, sellerQuotes: true } } },
  })
  if (!existing) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })

  const c = existing._count
  const historial = [
    c.orders && `${c.orders} pedido${c.orders !== 1 ? 's' : ''}`,
    c.quotes && `${c.quotes} ${c.quotes !== 1 ? "cotizaciones" : "cotización"}`,
    c.rmas && `${c.rmas} garantía${c.rmas !== 1 ? 's' : ''}`,
    (c.sellerOrders || c.sellerQuotes) && 'ventas registradas como vendedor',
  ].filter(Boolean)
  if (historial.length) {
    throw createError({ statusCode: 409, message: `No se puede eliminar: tiene ${historial.join(', ')}. Desactívalo para que ya no pueda entrar y se conserve su historial.` })
  }

  await prisma.user.delete({ where: { id } })
  return { ok: true }
})
