export interface Product {
	id?: number
	brand_id: number
	name: string
	short_description: string
	long_description: string
	image_url: string
	price: number
	slug: string
	created_at?: string
	code: string
	stock: number
	is_active: boolean
}

export const useProducts = () => {
	const supabase = useSupabaseClient()

	const getProducts = async () => {
		return await supabase.from('products').select('*').select(`*, brand:brands(*)`).order('created_at', { ascending: false })
	}

	const getProductById = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('products').select(`*, brand:brands(*)`).eq('id', id).single()
	}

	const createProduct = async (data: Product) => {
		return await supabase.from('products').insert([data]).select().single()
	}

	const updateProduct = async (id: string, data: Partial<Product>) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('products').update(data).eq('id', id).select().single()
	}

	const deleteProduct = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('products').delete().eq('id', id)
	}

	return { getProducts, getProductById, createProduct, updateProduct, deleteProduct}
}