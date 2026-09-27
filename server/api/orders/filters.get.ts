import { requireSession } from '~/server/utils/session'
import prisma from '~/server/utils/prisma'

/* Opciones para los filtros de Órdenes: clientes y empresas que tienen pedidos. */
export default defineEventHandler(async (event) => {
  const session = requireSession(event)
  if (!['admin', 'approver', 'seller'].includes(session.role)) throw createError({ statusCode: 403, message: 'Sin autorización' })

  const porUsuario = await prisma.order.groupBy({ by: ['userId'], _count: { _all: true } })
  const users = await prisma.user.findMany({
    where:  { id: { in: porUsuario.map(u => u.userId) } },
    select: { id: true, name: true, email: true, clientNumber: true, fiscalRazonSocial: true, fiscalRfc: true },
  })
  const pedidosDe = new Map(porUsuario.map(u => [u.userId, u._count._all]))

  const clientes = users
    .map(u => ({ id: u.id, nombre: u.name, email: u.email, clientNumber: u.clientNumber, empresa: u.fiscalRazonSocial?.trim() || null, pedidos: pedidosDe.get(u.id) ?? 0 }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  // Empresa = razón social fiscal; varios usuarios pueden pertenecer a la misma empresa
  const empresasMap = new Map<string, { nombre: string; rfcs: Set<string>; usuarios: number; pedidos: number }>()
  for (const u of users) {
    const nombre = u.fiscalRazonSocial?.trim()
    if (!nombre) continue
    const e = empresasMap.get(nombre) ?? { nombre, rfcs: new Set<string>(), usuarios: 0, pedidos: 0 }
    if (u.fiscalRfc) e.rfcs.add(u.fiscalRfc)
    e.usuarios++
    e.pedidos += pedidosDe.get(u.id) ?? 0
    empresasMap.set(nombre, e)
  }
  const empresas = [...empresasMap.values()]
    .map(e => ({ nombre: e.nombre, rfc: [...e.rfcs].join(', '), usuarios: e.usuarios, pedidos: e.pedidos }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  return { clientes, empresas }
})
