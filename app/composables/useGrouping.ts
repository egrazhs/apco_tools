export const useGroupings = () => {
    const supabase = useSupabaseClient()

    /**
     * Get all groupings for a category
     * Returns empty array if no groupings exist
     */
    const getGroupingsByCategory = async (categoryId: number) => {
        if (!categoryId) return { data: [] }
        
        const { data, error } = await supabase
            .from('category_groupings')
            .select('id, name, slug')
            .eq('category_id', categoryId)
            .order('display_order', { ascending: true })

        if (error) {
            console.error('Error cargando agrupaciones:', error)
            return { data: null, error }
        }
        
        return { data: data || [] }
    }

    /**
     * Get a single grouping by slug
     */
    const getGroupingBySlug = async (slug: string) => {
        const { data, error } = await supabase
            .from('category_groupings')
            .select('*')
            .eq('slug', slug)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return { data }
    }

    return {
        getGroupingsByCategory,
        getGroupingBySlug,
    }
}