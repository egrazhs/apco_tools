export default defineNuxtRouteMiddleware(() => {
  const { perfil } = useAuth()

  if (perfil.value?.rol !== 'admin') {
    return navigateTo('/')
  }
})