export const useAuth = () => {
	const supabase = useSupabaseClient()
	const user = useSupabaseUser()

	const perfil = useState('auth_perfil', () => null)
	const loading = useState('auth_loading', () => false)

	const fetchPerfil = async () => {
		if (!user.value?.id) {
			perfil.value = null
			return
		}

		loading.value = true

		const { data, error } = await supabase.from('perfiles').select('*').eq('id', user.value.id).single()

		if (error) {
			console.warn('Error cargando perfil:', error.message)
			perfil.value = null
		} else {
			perfil.value = data
		}

		loading.value = false
	}

	const login = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({email, password})

		if (error) throw error
	}

	const logout = async () => {
		await supabase.auth.signOut()
		perfil.value = null
	}

	// Cada vez que cambia el usuario, cargamos perfil
	watch(user, async (newUser) => {
		if (newUser?.id) {
			await fetchPerfil()
		} else {
			perfil.value = null
		}
	}, { immediate: true })

	return {user, perfil, loading, login, logout, fetchPerfil}
}