export interface Product {
	id?: number
	brand_id: number
	category_id?: number
    subcategory_id?: number
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
	mercadopago_link: string
}

export const useProducts = () => {
	const supabase = useSupabaseClient()

	const getProducts = async () => {
	    return await supabase
	        .from('products')
	        .select(`*, brand:brands(*), category:categories(*), subcategory:subcategories(*))`)
	        .eq('is_active', true)
	        .order('created_at', { ascending: false })
	}

	const getProductById = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('products').select(`*, brand:brands(*), category:categories(*), subcategory:subcategories(*)`).eq('id', id).single()
	}

	const getProductsBySubcategory = async (subcategory_id: string) => {
		return await supabase.from('products').select('*').eq('subcategory_id', subcategory_id).eq('is_active', true).order('created_at')
	}

	const getTotalProductsByBrand = async (brand_id: string) => {
		if (!brand_id) throw new Error('ID requerido')
    	return await supabase.from('products').select('*', { count: 'exact', head: true }).eq('brand_id', brand_id).eq('is_active', true)
	}

	const createProduct = async (data: Product) => {
		return await supabase.from('products').insert([data]).select().single()
	}

	const updateProduct = async (id: string, data: Partial<Product>) => {
		if (!id) throw new Error('ID requerido')
		return await supabase.from('products').update(data).eq('id', id).select().single()
	}

	//Soft delete
	const deleteProduct = async (id: string) => {
	    if (!id) throw new Error('ID requerido')
	    return await supabase.from('products').update({ is_active: false }).eq('id', id)
	}

	return { 
		getProducts, 
		getProductById, 
		getProductsBySubcategory, 
		getTotalProductsByBrand, 
		createProduct, 
		updateProduct, 
		deleteProduct
	}
}