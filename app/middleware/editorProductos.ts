export default defineNuxtRouteMiddleware(() => {
  const { perfil } = useAuth()

  const permitido =
    perfil.value?.rol === 'admin' ||
    perfil.value?.puede_editar_productos

  if (!permitido) {
    return navigateTo('/')
  }
})