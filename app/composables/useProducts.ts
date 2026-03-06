export interface Product {
	id?: number
	marca_id: number
	nombre: string
	descripcion_corta: string
	descripcion_larga: string
	imagen_principal: string
	precio_venta: number
	slug: string
	created_at?: string
	codigo: string
	stock: number
	is_active: boolean
}

export const useProducts = () => {
	const supabase = useSupabaseClient()

	const getProducts = async () => {
		return await supabase.from('productos').select('*').select(`*, marca:marcas(*)`).order('created_at', { ascending: false })
	}

	const getProductById = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('productos').select(`*, marca:marcas(*)`).eq('id', id).single()
	}

	const createProduct = async (data: Product) => {
		return await supabase.from('productos').insert([data]).select().single()
	}

	const updateProduct = async (id: string, data: Partial<Product>) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('productos').update(data).eq('id', id).select().single()
	}

	const deleteProduct = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('productos').delete().eq('id', id)
	}

	return { getProducts, getProductById, createProduct, updateProduct, deleteProduct}
}