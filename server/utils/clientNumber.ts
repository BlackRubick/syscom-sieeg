import type { Prisma } from '@prisma/client'
import prisma from '~/server/utils/prisma'

/* Crea un usuario asignándole el siguiente número de cliente.
   Si dos altas coinciden, el índice único lo detecta y se reintenta con el siguiente número. */
export async function createUserWithClientNumber<T extends Prisma.UserSelect>(
  data: Omit<Prisma.UserCreateInput, 'clientNumber'>,
  select?: T,
) {
  for (let intento = 0; intento < 5; intento++) {
    const { _max } = await prisma.user.aggregate({ _max: { clientNumber: true } })
    try {
      return await prisma.user.create({ data: { ...data, clientNumber: (_max.clientNumber ?? 0) + 1 }, select })
    } catch (e) {
      const target = (e as { code?: string; meta?: { target?: unknown } })
      if (target.code === 'P2002' && String(target.meta?.target ?? '').includes('client_number')) continue
      throw e
    }
  }
  throw createError({ statusCode: 500, message: 'No se pudo asignar número de cliente, intenta de nuevo' })
}
