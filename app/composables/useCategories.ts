export interface Category {
	id?: string
	nombre: string
	slug: string
	activo: boolean
	created_at?: string
}

export const useCategories = () => {
	const supabase = useSupabaseClient()

	const getCategories = async () => {
		return await supabase.from('categorias').select('*').order('created_at', { ascending: false })
	}

	const getCategoryById = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('categorias').select('*').eq('id', id).single()
	}

	const createCategory = async (data: Category) => {
		return await supabase.from('categorias').insert(data).select().single()
	}

	const updateCategory = async (id: string, data: Partial<Category>) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('categorias').update(data).eq('id', id).select().single()
	}

	const deleteCategory = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('categorias').delete().eq('id', id)
	}

	return { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory}
}