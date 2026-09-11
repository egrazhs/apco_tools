export interface Brand {
	id?: string
	name: string
	slug?: string
	description?: string
	image_key?: string
	display_order?: number
}

export const useBrands = () => {
	const supabase = useSupabaseClient()

	const getBrands = async () => {
		return await supabase.from('brands').select('*')
	}

	const getBrandsByDisplayOrder = async () => {
		return await supabase.from('brands').select('*').order('display_order', { ascending: true })
	}

	const getBrandById = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('brands').select('*').eq('id', id).single()
	}

	const createBrand = async (data: Brand) => {
		return await supabase.from('brands').insert(data).select().single()
	}

	const updateBrand = async (id: string, data: Partial<Brand>) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('brands').update(data).eq('id', id).select().single()
	}

	const deleteBrand = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('brands').delete().eq('id', id)
	}

	return { getBrands, getBrandsByDisplayOrder, getBrandById, createBrand, updateBrand, deleteBrand }
}