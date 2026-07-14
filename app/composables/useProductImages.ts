export const useProductImages = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    // ============================================
    // LECTURA (Cliente - RLS permite lectura pública)
    // ============================================

    /**
     * Obtiene la imagen primaria de un producto
     * @param productId - ID del producto
     * @returns { imageKey, altText, url } o null si no existe
     */
    const getPrimaryImage = async (productId: number) => {
        try {
            // Asegurar que productId es número
            const id = Number(productId)
        
            const { data, error } = await supabase
                .from('product_images')
                .select('image_key, alt_text')
                .eq('product_id', id)
                .eq('is_primary', true)
                .single()

            if (error) {
                if (error.code === 'PGRST116') return null // No encontrado
                throw error
            }

            return {
                imageKey: data.image_key,
                altText: data.alt_text || '',
                url: getImageUrl(data.image_key)
            }
        } catch (err) {
            console.error('Error fetching primary image:', err)
            return null
        }
    }

    /**
     * Obtiene todas las imágenes de un producto, ordenadas por display_order
     * @param productId - ID del producto
     * @returns Array de { imageKey, altText, url, displayOrder, isPrimary }
     */
    const getProductImages = async (productId: number) => {
        try {
            const id = Number(productId)
            
            const { data, error } = await supabase
                .from('product_images')
                .select('image_key, alt_text, display_order, is_primary')
                .eq('product_id', id)
                .order('display_order', { ascending: true })

            if (error) throw error

            return data.map(img => ({
                imageKey: img.image_key,
                altText: img.alt_text || '',
                url: getImageUrl(img.image_key),
                displayOrder: img.display_order,
                isPrimary: img.is_primary
            }))
        } catch (err) {
            console.error('Error fetching product images:', err)
            return []
        }
    }

    /**
     * Genera URL pública de una imagen en Storage
     * @param imageKey - SHA-256 hash de la imagen (nombre del archivo)
     * @returns URL pública completa
     * 
     * DECISIÓN: URL pública (no signed) porque:
     * - Las imágenes de productos son públicas
     * - No hay expiración (ahorra queries)
     * - Mejor para cache/CDN
     */
    const getImageUrl = (imageKey: string) => {
        const PROJECT_ID = 'gqgdzvkoydpuefloilmr'
        return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/product-images/${imageKey}.webp`
    }

    // ============================================
    // ADMIN CRUD (Servidor via API routes)
    // ============================================

    /**
     * Sube una nueva imagen para un producto
     * @param data - { productId, file, isPrimary, altText }
     * @returns { success: boolean, imageKey?: string, error?: string }
     */
    const uploadProductImage = async (data: {
        productId: number
        file: File
        isPrimary: boolean
        altText?: string
    }) => {
        try {
            const formData = new FormData()
            formData.append('file', data.file)
            formData.append('productId', data.productId.toString())
            formData.append('isPrimary', data.isPrimary.toString())
            formData.append('altText', data.altText || '')

            const response = await $fetch('/admin/images/upload', {
                method: 'POST',
                body: formData
            })

            return response
        } catch (err: any) {
            console.error('Error uploading image:', err)
            return {
                success: false,
                error: err.message || 'Error desconocido al subir imagen'
            }
        }
    }

    /**
     * Marca una imagen como primaria (desmarca otras del producto)
     * @param productId - ID del producto
     * @param imageKey - SHA-256 hash de la imagen
     * @returns { success: boolean, error?: string }
     */
    const setPrimaryImage = async (productId: number, imageKey: string) => {
        try {
            const response = await $fetch('/admin/images/set-primary', {
                method: 'PATCH',
                body: { productId, imageKey }
            })

            return response
        } catch (err: any) {
            console.error('Error setting primary image:', err)
            return {
                success: false,
                error: err.message || 'Error al marcar imagen primaria'
            }
        }
    }

    /**
     * Reordena las imágenes de un producto
     * @param productId - ID del producto
     * @param order - Array de { imageKey, displayOrder }
     * @returns { success: boolean, error?: string }
     */
    const reorderImages = async (productId: number, order: Array<{ imageKey: string, displayOrder: number }>) => {
        try {
            const response = await $fetch('/admin/images/reorder', {
                method: 'PATCH',
                body: { productId, order }
            })

            return response
        } catch (err: any) {
            console.error('Error reordering images:', err)
            return {
                success: false,
                error: err.message || 'Error al reordenar imágenes'
            }
        }
    }

    /**
     * Elimina una imagen de un producto
     * @param productId - ID del producto
     * @param imageKey - SHA-256 hash de la imagen
     * @returns { success: boolean, error?: string }
     */
    const deleteProductImage = async (productId: number, imageKey: string) => {
        try {
            const response = await $fetch(`/admin/images/${imageKey}`, {
                method: 'DELETE',
                query: { productId }
            })

            return response
        } catch (err: any) {
            console.error('Error deleting image:', err)
            return {
                success: false,
                error: err.message || 'Error al eliminar imagen'
            }
        }
    }

    return {
        // Lectura pública
        getPrimaryImage,
        getProductImages,
        getImageUrl,
        // Admin CRUD
        uploadProductImage,
        setPrimaryImage,
        reorderImages,
        deleteProductImage
    }
}