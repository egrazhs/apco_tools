export interface Category {
	id?: string
	name: string
	slug: string
	is_active: boolean
	brand_id?: string
    image_key?: string
	image?: string
	created_at?: string
}

export const useCategories = () => {
	const supabase = useSupabaseClient()
	const { getPublicUrl } = useStorageImage('category-images')
	const PLACEHOLDER = '/img/placeholder-category.svg'
	
	/**
	 * Resuelve la URL de imagen para una categoría
	 */
	const resolveImageUrl = (category: Category): string => {
		if (category.image_key) {
			return getPublicUrl(category.image_key) || PLACEHOLDER
		}
		return PLACEHOLDER
	}
	
	/**
	 * Mapea categorías raw añadiendo la URL de imagen resuelta
	 */
	const mapCategoriesWithImages = (categories: Category[]): Category[] => {
		return categories.map(category => ({
			...category,
			image: resolveImageUrl(category)
		}))
	}
	
	const getCategories = async () => {
		const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false })
		
		if (error) return { data: null, error }
		
		return { data: mapCategoriesWithImages(data || []), error: null }
	}
	
	const getCategoryById = async (id: string) => {
		if (!id) throw new Error('ID requerido')
		
		const { data, error } = await supabase.from('categories').select('*').eq('id', id).single()
		
		if (error) return { data: null, error }
		
		return { 
			data: data ? { ...data, image: resolveImageUrl(data) } : null, 
			error: null 
		}
	}
	
	const getCategoryBySlug = async (slug: string) => {
		const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single()
		
		if (error) return { data: null, error }
		
		return { 
			data: data ? { ...data, image: resolveImageUrl(data) } : null, 
			error: null 
		}
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
	
	const getCategoriesByBrand = async (brandId: string) => {
	    if (!brandId) throw new Error('Brand ID requerido')
		
		// Obtener categorías activas de la marca
		const { data: categories, error: catError } = await supabase
			.from('categories')
			.select('*')
			.eq('brand_id', brandId)
			.eq('is_active', true)
			.order('created_at', { ascending: false })
		
		if (catError) return { data: null, error: catError }
		
		// Obtener productos activos de la marca para validar categorías con productos
		const { data: products, error: prodError } = await supabase
			.from('products')
			.select('category_id')
			.eq('brand_id', brandId)
			.eq('is_active', true)
		
		if (prodError) return { data: null, error: prodError }
		
		// Obtener IDs únicos de categorías que tienen productos
		const categoryIdsWithProducts = new Set(products?.map(p => p.category_id) || [])
		
		// Filtrar solo categorías que tienen al menos un producto
		const categoriesWithProducts = (categories || []).filter(cat => 
			categoryIdsWithProducts.has(cat.id)
		)
		
		return { data: mapCategoriesWithImages(categoriesWithProducts), error: null }
	}
	
	return { 
		getCategories, 
		getCategoryById, 
		getCategoryBySlug, 
		createCategory, 
		updateCategory, 
		deleteCategory, 
		getCategoriesByBrand 
	}
}