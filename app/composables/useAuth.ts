export const useAuth = () => {
  const { $supabase } = useNuxtApp()

  const user = useState('auth_user', () => null)
  const perfil = useState('auth_perfil', () => null)
  const loading = useState('auth_loading', () => true)

  const fetchPerfil = async () => {
  if (!user.value) return

  const { data, error } = await $supabase.from('perfiles').select('*').eq('id', user.value.id).single()

  if (error) {
    console.warn('Error cargando perfil:', error.message)
    perfil.value = null
    return
  }

  perfil.value = data
}

  let authListener: any = null

  const init = async () => {
    loading.value = true

    const { data } = await $supabase.auth.getUser()
    user.value = data.user

    if (user.value) {
      await fetchPerfil()
    }

    loading.value = false

    if (!authListener) {
      const { data: listener } = $supabase.auth.onAuthStateChange(
        async (_, session) => {
          user.value = session?.user ?? null

          if (user.value) {
            await fetchPerfil()
          } else {
            perfil.value = null
          }
        }
      )

      authListener = listener
    }
  }

  const login = async (email: string, password: string) => {
    const { error } = await $supabase.auth.signInWithPassword({email, password})

    if (error) throw error
  }

  const logout = async () => {
    await $supabase.auth.signOut()
  }

  return {
    user,
    perfil,
    loading,
    login,
    logout,
    init
  }
}