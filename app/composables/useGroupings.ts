export interface Grouping {
    id?: string
    name: string
    slug?: string
    description?: string
    image_key?: string
    display_order?: number,
    is_active?: boolean
}

export const useGroupings = () => {
    const supabase = useSupabaseClient()


    const getGroupings = async() => {
        return await supabase.from('category_groupings').select('*')
    }

    /**
     * Get all groupings for a category
     * Returns empty array if no groupings exist
     */
    const getGroupingsByCategory = async (categoryId: number) => {
        if (!categoryId) return { data: [] }
        
        const { data, error } = await supabase
            .from('category_groupings')
            .select('id, name, slug, image_key')
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

    const getGroupingById = async (id: string) => {
        if (!id) throw new Error('ID requerido')
        return await supabase.from('category_groupings').select('*').eq('id', id).single()
    }

    const createGrouping = async (data: Grouping) => {
        return await supabase.from('category_groupings').insert(data).select().single()
    }

    const updateGrouping = async (id: string, data: Partial<Grouping>) => {
        if (!id) throw new Error('ID requerido')
        return await supabase.from('category_groupings').update(data).eq('id', id).select().single()
    }

    const deleteGrouping = async (id: string) => {
        if (!id) throw new Error('ID requerido')
        return await supabase.from('category_groupings').delete().eq('id', id)
    }

    return {
        getGroupings,
        getGroupingsByCategory,
        getGroupingBySlug,
        getGroupingById,
        createGrouping,
        updateGrouping,
        deleteGrouping
    }
}