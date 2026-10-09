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
	    const { data, error } = await supabase
	        .from('categories')
	        .select('*, brands(name)')
	        .order('order', { ascending: true })
	    
	    if (error) return { data: null, error }
	    
	    // Ordenar en el cliente: primero por marca, luego por nombre de categoría
	    const sorted = (data || []).sort((a, b) => {
	        const brandA = a.brands?.name || ''
	        const brandB = b.brands?.name || ''
	        
	        // Comparar por marca
	        const brandCompare = brandA.localeCompare(brandB, 'es-MX')
	        if (brandCompare !== 0) return brandCompare
	        
	        // Si son la misma marca, comparar por nombre de categoría
	        return a.name.localeCompare(b.name, 'es-MX')
	    })
	    
	    return { data: mapCategoriesWithImages(sorted), error: null }
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

	const getCategoriesByBrandId = async (brandId: number) => {
	    const { data, error } = await supabase
	        .from('categories')
	        .select('id, name, slug, brand_id')
	        .eq('brand_id', brandId)
	        .eq('is_active', true)
	        .order('order', { ascending: true })

	    if (error) throw error
	    return { data: data || [] }
	}

	const getAllCategoriesByBrand = async (brandId: string) => {
	    if (!brandId) throw new Error('Brand ID requerido')

	    const { data, error } = await supabase
	        .from('categories')
	        .select('id, name, slug, is_active, order')
	        .eq('brand_id', brandId)
	        .order('order', { ascending: true })
	        .order('id', { ascending: true })

	    if (error) return { data: null, error }

	    return { data: data || [], error: null }
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
			.order('order', { ascending: true })
		
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


	const getActiveCategoriesByBrand = async (brandId: string) => {
	    if (!brandId) throw new Error('Brand ID requerido')
	    
	    // ── PASO 1: Obtener todas las categorías activas
	    const { data: categories, error: catError } = await supabase
	        .from('categories')
	        .select('id, name, slug, is_active, brand_id, created_at, image_key, order')
	        .eq('brand_id', brandId)
	        .eq('is_active', true)
	        .order('order', { ascending: true })
	    
	    if (catError) {
	        return { data: null, error: catError }
	    }
	    
	    if (!categories || categories.length === 0) {
	        return { data: [], error: null }
	    }
	    
	    // ── PASO 2: Obtener todas las subcategorías de estas categorías
	    const categoryIds = categories.map(c => c.id)
	    
	    const { data: subcategories, error: subError } = await supabase
	        .from('subcategories')
	        .select('id, category_id, name')
	        .in('category_id', categoryIds)
	    
	    if (subError) {
	        return { data: null, error: subError }
	    }
	    
	    
	    // ── PASO 3: Obtener productos de estas subcategorías
	    const subcategoryIds = subcategories?.map(s => s.id) || []
	    
	    if (subcategoryIds.length === 0) {
	        return { data: [], error: null }
	    }
	    
	    const { data: productSubcategories, error: psError } = await supabase
	        .from('product_subcategories')
	        .select('subcategory_id, products(id, is_active)')
	        .in('subcategory_id', subcategoryIds)
	    
	    if (psError) {
	        return { data: null, error: psError }
	    }
	    
	    // ── PASO 4: Filtrar subcategorías con productos activos
	    const subcategoryIdsWithActiveProducts = new Set(
	        (productSubcategories || [])
	            .filter(ps => ps.products?.is_active === true)
	            .map(ps => ps.subcategory_id)
	    )
	    
	    // ── PASO 5: Obtener categorías que tienen esas subcategorías
	    const categoryIdsWithProducts = new Set(
	        (subcategories || [])
	            .filter(sub => subcategoryIdsWithActiveProducts.has(sub.id))
	            .map(sub => sub.category_id)
	    )
	    
	    const categoriesWithProducts = (categories || []).filter(cat =>
	        categoryIdsWithProducts.has(cat.id)
	    )
	    
	    return { 
	        data: mapCategoriesWithImages(categoriesWithProducts), 
	        error: null 
	    }
	}
	
	return { 
		getCategories, 
		getCategoryById, 
		getCategoryBySlug,
		getCategoriesByBrandId,
		getAllCategoriesByBrand, 
		createCategory, 
		updateCategory, 
		deleteCategory, 
		getCategoriesByBrand,
		getActiveCategoriesByBrand
	}
}