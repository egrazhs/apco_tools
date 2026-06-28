import type { Product } from './useProducts'

// Columnas por las que se permite ordenar
const ALLOWED_SORT_COLUMNS = ['name', 'code', 'price', 'stock', 'created_at', 'is_active'] as const
type AdminSortColumn = typeof ALLOWED_SORT_COLUMNS[number]

export interface AdminProductListItem
    extends Pick<Product, 'id' | 'name' | 'code' | 'slug' | 'price' | 'stock' | 'is_active' | 'created_at'> {
    brand: { id: number; name: string } | null
    category: { id: number; name: string } | null
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
                brand:brands(id, name),
                category:categories(id, name)
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

        return {
            data: (data as unknown as AdminProductListItem[]) ?? [],
            count: count ?? 0,
            error
        }
    }

    return {
        getAdminProducts
    }
}