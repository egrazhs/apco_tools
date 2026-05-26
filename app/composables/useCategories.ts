export interface Category {
	id?: string
	name: string
	slug: string
	is_active: boolean
	created_at?: string
}

export const useCategories = () => {
	const supabase = useSupabaseClient()

	const getCategories = async () => {
		return await supabase.from('categories').select('*').order('created_at', { ascending: false })
	}

	const getCategoryById = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('categories').select('*').eq('id', id).single()
	}

	const getCategoryBySlug = async (slug: string) => {
	    return await supabase.from('categories').select('*').eq('slug', slug).single()
	}

	const createCategory = async (data: Category) => {
		return await supabase.from('categories').insert(data).select().single()
	}

	const updateCategory = async (id: string, data: Partial<Category>) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('categories').update(data).eq('id', id).select().single()
	}

	const deleteCategory = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('categories').delete().eq('id', id)
	}

	return { getCategories, getCategoryById, getCategoryBySlug, createCategory, updateCategory, deleteCategory}
}