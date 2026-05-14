export default defineNuxtRouteMiddleware(() => {
  const { profile } = useAuth()

  const permitido =
    profile.value?.role === 'admin' ||
    profile.value?.can_edit_products

  if (!permitido) {
    return navigateTo('/')
  }
})