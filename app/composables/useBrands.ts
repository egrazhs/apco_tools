export interface Brand {
	id?: string
	nombre: string
}

export const useBrands = () => {
	const supabase = useSupabaseClient()

	const getBrands = async () => {
		return await supabase.from('marcas').select('*')
	}

	const getBrandById = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('marcas').select('*').eq('id', id).single()
	}

	const createBrand = async (data: Brand) => {
		return await supabase.from('marcas').insert(data).select().single()
	}

	const updateBrand = async (id: string, data: Partial<Brand>) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('marcas').update(data).eq('id', id).select().single()
	}

	const deleteBrand = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('marcas').delete().eq('id', id)
	}

	return { getBrands, getBrandById, createBrand, updateBrand, deleteBrand}
}