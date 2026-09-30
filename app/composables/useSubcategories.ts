export interface Subcategory {
	id?: string
	name: string
	slug: string
	is_active: boolean
	created_at?: string
	category_id: number
	order: number
}

export const useSubcategories = () => {
	const supabase = useSupabaseClient()
	const { getPublicUrl } = useStorageImage('subcategory_images')
	const PLACEHOLDER = '/img/placeholder-category.svg'

	const resolveImageUrl = (category: Category): string => {
		if (category.image_key) {
			return getPublicUrl(category.image_key) || PLACEHOLDER
		}
		return PLACEHOLDER
	}

	/**
	 * Mapea subcategorías raw añadiendo la URL de imagen resuelta
	 */
	const mapSubcategoriesWithImages = (categories: Category[]): Category[] => {
		return categories.map(category => ({
			...category,
			image: resolveImageUrl(category)
		}))
	}






	const getSubcategories = async () => {
		const {data, error} = await supabase.from('subcategories').select('*').order('order', { ascending: true })

		if (error) return { data: null, error }

		return { data: mapSubcategoriesWithImages(data || []), error: null }
	}

	const getSubcategoryById = async (id: string) => {
	    const { data, error } = await supabase
	        .from('subcategories')
	        .select(`
	            *,
	            categories(
	                id,
	                name,
	                slug,
	                brand_id,
	                brands(id, name, slug)
	            )
	        `)
	        .eq('id', id)
	        .single()

	    if (error) throw error
	    return { data }
	}

	const getSubcategoriesWithDetails = async () => {
        const {data, error} = await supabase
            .from('subcategories')
            .select(`
                *,
                categories(
                    id,
                    name,
                    slug,
                    brand_id,
                    brands(id, name, slug)
                )
            `)
            .order('order', { ascending: true })

        if (error) return { data: null, error }

        return { data: mapSubcategoriesWithImages(data || []), error: null }
    }

	const getSubcategoriesByCategory = async (categoryId: number) => {
        const { data, error } = await supabase
            .from('subcategories')
            .select('*')
            .eq('category_id', categoryId)
            .is('grouping_id', null)
            .order('order', { ascending: true })

        if (error) throw error
        return { data: data || [] }
    }

	const createSubcategory = async (data: Category) => {
		return await supabase.from('subcategories').insert(data).select().single()
	}

	const updateSubcategory = async (id: string, data: Partial<Category>) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('subcategories').update(data).eq('id', id).select().single()
	}

	const deleteSubcategory = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('subcategories').delete().eq('id', id)
	}

	const getSubcategoriesByGrouping = async (groupingId: number) => {
        const { data, error } = await supabase
            .from('subcategories')
            .select('*')
            .eq('grouping_id', groupingId)
            .order('order', { ascending: true })

        if (error) throw error
        return { data: data || [] }
    }

	return { 
		getSubcategories,
		getSubcategoriesWithDetails, 
		getSubcategoryById, 
		getSubcategoriesByCategory, 
		createSubcategory, 
		updateSubcategory, 
		deleteSubcategory, 
		getSubcategoriesByGrouping
	}
}