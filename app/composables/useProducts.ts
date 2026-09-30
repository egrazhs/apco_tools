// Interfaces actualizadas
export interface Subcategory {
    id: number
    name: string
    slug: string
    category_id: number
    is_active: boolean
}

export interface ProductSubcategory {
    id: number
    product_id: number
    subcategory_id: number
    created_at: string
    subcategories: Subcategory
}

export interface Product {
    id?: number
    brand_id: number
    category_id?: number
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
    model: string
    specifications: string
    product_subcategories?: ProductSubcategory[]  // ← NUEVA
}

export const useProducts = () => {
    const supabase = useSupabaseClient()

    const getProducts = async () => {
        return await supabase
            .from('products')
            .select(`
                *,
                brand:brands(*),
                category:categories(*),
                product_subcategories(
                    id,
                    product_id,
                    subcategory_id,
                    created_at,
                    subcategories(id, name, slug, category_id, is_active)
                )
            `)
            .eq('is_active', true)
            .order('order', { ascending: true })
    }

    const getProductById = async (id: string) => {
        if (!id) throw new Error('ID requerido')
        return await supabase
            .from('products')
            .select(`
                *,
                brand:brands(*),
                category:categories(*),
                product_subcategories(
                    id,
                    product_id,
                    subcategory_id,
                    created_at,
                    subcategories(id, name, slug, category_id, is_active)
                )
            `)
            .eq('id', id)
            .single()
    }

    const getProductsBySubcategory = async (subcategory_id: number | string) => {
	    const subId = Number(subcategory_id)
	    
	    //console.log('🔍 getProductsBySubcategory called with:', subId)
	    
	    // PASO 1: Obtener los product_ids
	    const { data: relations, error: relError } = await supabase
	        .from('product_subcategories')
	        .select('product_id')
	        .eq('subcategory_id', subId)

	    //console.log('📋 Relations found:', relations?.length || 0, relations)

	    if (relError || !relations) {
	        console.error('❌ Error fetching relations:', relError)
	        return { data: null, error: relError }
	    }

	    const productIds = relations.map(r => r.product_id)

	    if (productIds.length === 0) {
	        //console.warn('⚠️ No products in this subcategory')
	        return { data: [], error: null }
	    }

	    // PASO 2: Obtener los productos
	    const { data: products, error } = await supabase
	        .from('products')
	        .select(`
	            *,
	            brand:brands(*),
	            category:categories(*),
	            product_subcategories(
	                id,
	                product_id,
	                subcategory_id,
	                created_at,
	                subcategories(id, name, slug, category_id, is_active)
	            )
	        `)
	        .in('id', productIds)
	        .eq('is_active', true)
	        .order('order', { ascending: true })

	    //console.log('🎁 Products found:', products?.length || 0, products)
	    
	    if (error) {
	        //console.error('❌ Error fetching products:', error)
	    }

	    return { data: products, error }
	}

	const getProductsByBrand = async (brand_id: string | number) => {
	    if (!brand_id) throw new Error('ID de marca requerido')
	    
	    return await supabase
	        .from('products')
	        .select(`
	            *,
	            brand:brands(*),
	            category:categories(*),
	            product_subcategories(
	                id,
	                product_id,
	                subcategory_id,
	                created_at,
	                subcategories(id, name, slug, category_id, is_active)
	            )
	        `)
	        .eq('brand_id', brand_id)
	        .eq('is_active', true)
	        .order('order', { ascending: true })
	}

    const getTotalProductsByBrand = async (brand_id: string) => {
        if (!brand_id) throw new Error('ID requerido')
        return await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('brand_id', brand_id)
            .eq('is_active', true)
    }

    const createProduct = async (data: Product) => {
	    // Extraer subcategory_ids antes de crear el producto
	    const { subcategory_ids, ...productData } = data as any
	    
	    // 1. Crear el producto
	    const { data: newProduct, error: productError } = await supabase
	        .from('products')
	        .insert([productData])
	        .select()
	        .single()
	    
	    if (productError || !newProduct) {
	        throw new Error(`Error creando producto: ${productError?.message}`)
	    }

	    // 2. Crear las relaciones en product_subcategories
	    if (subcategory_ids && subcategory_ids.length > 0) {
	        const relations = subcategory_ids.map((subId: number) => ({
	            product_id: newProduct.id,
	            subcategory_id: Number(subId)
	        }))
	        
	        const { error: relError } = await supabase
	            .from('product_subcategories')
	            .insert(relations)
	        
	        if (relError) {
	            //console.error('Error creando relaciones:', relError)
	            throw new Error(`Error asignando subcategorías: ${relError.message}`)
	        }
	    }

	    return { data: newProduct, error: null }
	}

	const updateProduct = async (id: string, data: Partial<Product>) => {
	    if (!id) throw new Error('ID requerido')
	    
	    //console.log('🔍 updateProduct called with data:', data)
	    
	    // Extraer subcategory_ids antes de actualizar el producto
	    const { subcategory_ids, ...productData } = data as any
	    
	    //console.log('📋 Extracted subcategory_ids:', subcategory_ids)
	    //console.log('📦 Product data to update:', productData)
	    
	    // 1. Actualizar el producto
	    const { data: updatedProduct, error: productError } = await supabase
	        .from('products')
	        .update(productData)
	        .eq('id', id)
	        .select()
	        .single()
	    
	    if (productError) {
	        throw new Error(`Error actualizando producto: ${productError.message}`)
	    }

	    //console.log('✅ Product updated:', updatedProduct)

	    // 2. Actualizar relaciones en product_subcategories
	    if (subcategory_ids !== undefined && Array.isArray(subcategory_ids)) {
	        //console.log('🔄 Updating relations for product_id:', id)
	        
	        // PASO 1: Eliminar las relaciones viejas
	        const { error: deleteError } = await supabase
	            .from('product_subcategories')
	            .delete()
	            .eq('product_id', id)
	        
	        if (deleteError) {
	            console.error('❌ Error deleting old relations:', deleteError)
	            throw new Error(`Error actualizando subcategorías: ${deleteError.message}`)
	        }

	       //console.log('🗑️ Old relations deleted')

	        // PASO 2: Insertar las nuevas relaciones
	        if (subcategory_ids.length > 0) {
	            const relations = subcategory_ids.map((subId: any) => {
	                const numId = Number(subId)
	                //console.log('➕ Creating relation - product_id:', id, 'subcategory_id:', numId)
	                return {
	                    product_id: Number(id),
	                    subcategory_id: numId
	                }
	            })
	            
	            //console.log('📝 Relations to insert:', relations)
	            
	            const { error: insertError } = await supabase
	                .from('product_subcategories')
	                .insert(relations)
	            
	            if (insertError) {
	                console.error('❌ Error inserting new relations:', insertError)
	                throw new Error(`Error asignando subcategorías: ${insertError.message}`)
	            }

	            //console.log('✅ New relations inserted')
	        }
	    } else {
	        console.warn('⚠️ subcategory_ids not provided or not an array:', subcategory_ids)
	    }

	    return { data: updatedProduct, error: null }
	}

	//SoftDelete
    const deleteProduct = async (id: string) => {
        if (!id) throw new Error('ID requerido')
        return await supabase.from('products').update({ is_active: false }).eq('id', id)
    }

    // Helper: extraer subcategorías de un producto
    const getSubcategoriesFromProduct = (product: Product): Subcategory[] => {
        if (!product.product_subcategories) return []
        return product.product_subcategories.map(ps => ps.subcategories)
    }

    return {
        getProducts,
        getProductById,
        getProductsBySubcategory,
        getProductsByBrand,
        getTotalProductsByBrand,
        createProduct,
        updateProduct,
        deleteProduct,
        getSubcategoriesFromProduct
    }
}