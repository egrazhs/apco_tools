// composables/useAddresses.ts
export const useAddresses = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const { data: addresses, refresh, pending, error } = useAsyncData(
        'user-addresses',
        async () => {
            if (!user.value?.sub) return []

            const { data, error } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', user.value.sub)
                .order('is_default', { ascending: false })

            if (error) throw error
            return data ?? []
        },
        { server: false }
    )

    const defaultAddress = computed(() =>
        addresses.value?.find(a => a.is_default) ?? null
    )

    async function saveAddress(form: any, editId?: string | null) {
        const { id, ...payload } = form

        if (editId) {
            // Si se está marcando como predeterminada, limpiar las demás primero
            if (payload.is_default) {
                const { data: { user: currentUser } } = await supabase.auth.getUser()
                await supabase
                    .from('addresses')
                    .update({ is_default: false })
                    .eq('user_id', currentUser!.id)
            }

            const { error } = await supabase
                .from('addresses')
                .update(payload)
                .eq('id', editId)
            if (error) throw error
        } else {
            const { data: { user: currentUser } } = await supabase.auth.getUser()
            if (!currentUser) throw new Error('No hay sesión activa')

            // Si se marca como predeterminada, limpiar las demás primero
            if (payload.is_default) {
                await supabase
                    .from('addresses')
                    .update({ is_default: false })
                    .eq('user_id', currentUser.id)
            }

            const { error } = await supabase
                .from('addresses')
                .insert({ ...payload, user_id: currentUser.id })
            if (error) throw error
        }
        await refresh()
    }

    async function removeAddress(id: string) {
        const { error } = await supabase
            .from('addresses')
            .delete()
            .eq('id', id)
        if (error) throw error
        await refresh()
    }

    async function setDefaultAddress(id: string) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user.value?.sub ?? '')

        await supabase
            .from('addresses')
            .update({ is_default: true })
            .eq('id', id)

        await refresh()
    }

    return { addresses, defaultAddress, refresh, pending, error, saveAddress, removeAddress, setDefaultAddress }
}