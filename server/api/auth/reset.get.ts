import { usuarioDeTokenReset } from '~/server/utils/resetPassword'

/* Valida la liga antes de mostrar el formulario (para avisar de inmediato si ya venció). */
export default defineEventHandler(async (event) => {
  const user = await usuarioDeTokenReset(getQuery(event).token)
  return { nombre: user.name.split(' ')[0], email: user.email }
})
