import type { Product } from './useProducts'

// Columnas por las que se permite ordenar
const ALLOWED_SORT_COLUMNS = ['name', 'code', 'price', 'stock', 'created_at', 'is_active'] as const
type AdminSortColumn = typeof ALLOWED_SORT_COLUMNS[number]

export interface AdminProductListItem
    extends Pick<Product, 'id' | 'name' | 'code' | 'slug' | 'price' | 'stock' | 'is_active' | 'created_at'> {
    brand: { id: number; name: string } | null
    category: { id: number; name: string } | null
    primary_image_url: string | null
}

export interface AdminProductsParams {
    page?: number
    pageSize?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    isActive?: boolean | null
    brandId?: number
    categoryId?: number
}

export interface AdminProductsResult {
    data: AdminProductListItem[]
    count: number
    error: any
}

export const useAdminProducts = () => {
    const supabase = useSupabaseClient()

    const getAdminProducts = async (params: AdminProductsParams = {}): Promise<AdminProductsResult> => {
        const {
            page = 1,
            pageSize = 25,
            search = '',
            sortBy = 'created_at',
            sortOrder = 'desc',
            isActive = null,
            brandId,
            categoryId
        } = params

        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        // Validar columna de orden contra whitelist
        const sortColumn: AdminSortColumn = ALLOWED_SORT_COLUMNS.includes(sortBy as AdminSortColumn)
            ? (sortBy as AdminSortColumn)
            : 'created_at'

        let query = supabase
            .from('products')
            .select(
                `
                id,
                name,
                code,
                slug,
                price,
                stock,
                is_active,
                created_at,
                image_url,
                brand:brands(id, name),
                category:categories(id, name),
                product_images(id, image_key, is_primary)
                `,
                { count: 'exact' }
            )

        // Búsqueda por nombre o código (usa los índices GIN/pg_trgm ya creados)
        const term = search.trim()
        if (term) {
            // La coma separa condiciones en el filtro .or() de PostgREST,
            // así que la quitamos para no romper la sintaxis del filtro
            const safeTerm = term.replace(/,/g, ' ')
            query = query.or(`name.ilike.%${safeTerm}%,code.ilike.%${safeTerm}%`)
        }

        if (isActive !== null && isActive !== undefined) {
            query = query.eq('is_active', isActive)
        }

        if (brandId) {
            query = query.eq('brand_id', brandId)
        }

        if (categoryId) {
            query = query.eq('category_id', categoryId)
        }

        query = query.order(sortColumn, { ascending: sortOrder === 'asc' }).range(from, to)

        const { data, count, error } = await query

        // Procesar datos para extraer imagen primaria
        const processedData = (data as any[])?.map(product => {
            const primaryImage = product.product_images?.find((img: any) => img.is_primary)
            const imageKey = primaryImage?.image_key
            const imageUrl = imageKey 
                ? `https://gqgdzvkoydpuefloilmr.supabase.co/storage/v1/object/public/product-images/${imageKey}.webp`
                : null

            return {
                id: product.id,
                name: product.name,
                code: product.code,
                slug: product.slug,
                price: product.price,
                stock: product.stock,
                is_active: product.is_active,
                created_at: product.created_at,
                brand: product.brand,
                category: product.category,
                primary_image_url: imageUrl
            } as AdminProductListItem
        }) ?? []

        return {
            data: processedData,
            count: count ?? 0,
            error
        }
    }

    return {
        getAdminProducts
    }
}