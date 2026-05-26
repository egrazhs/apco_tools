export interface Subcategory {
	id?: string
	name: string
	slug: string
	is_active: boolean
	created_at?: string
	category_id: number
}

export const useSubcategories = () => {
	const supabase = useSupabaseClient()

	const getSubcategories = async () => {
		return await supabase.from('subcategories').select('*').order('created_at', { ascending: false })
	}

	const getSubcategoryById = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('subcategories').select('*').eq('id', id).single()
	}

	const getSubcategoriesByCategory = async (category_id: string) => {
		if (!category_id) throw new Error('ID requerido')
		return await supabase.from('subcategories').select('*').eq('category_id', category_id) 
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

	return { getSubcategories, getSubcategoryById, getSubcategoriesByCategory, createSubcategory, updateSubcategory, deleteSubcategory}
}