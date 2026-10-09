export type ReorderTable =
    | 'brands'
    | 'categories'
    | 'subcategories'
    | 'category_groupings'
    | 'product_subcategories'
    | 'product_images'

export const useReorder = () => {
    const supabase = useSupabaseClient()
    const toast = useToast()
    const saving = ref(false)

    /**
     * Guarda el orden de una lista completa.
     * @param table tabla (debe estar en la lista blanca del RPC)
     * @param ids   ids de TODOS los items del grupo, en el nuevo orden
     */
    const saveOrder = async (table: ReorderTable, ids: Array<string | number>) => {
        saving.value = true

        try {
            const { error } = await supabase.rpc('reorder_items', {
                p_table: table,
                p_ids: ids.map(String)
            })

            if (error) throw error

            toast.add({
                title: 'Orden guardado',
                icon: 'i-heroicons-check-circle',
                color: 'success'
            })

            return { success: true }
        } catch (err: any) {
            console.error('Error al guardar orden:', err)

            toast.add({
                title: 'No se pudo guardar el orden',
                description: err?.message,
                icon: 'i-heroicons-exclamation-triangle',
                color: 'error'
            })

            return { success: false }
        } finally {
            saving.value = false
        }
    }

    return { saveOrder, saving }
}