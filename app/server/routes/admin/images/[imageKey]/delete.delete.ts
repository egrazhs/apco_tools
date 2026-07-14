export default defineEventHandler(async (event) => {
    try {
        // ============================================
        // 1. Validar autenticación (admin)
        // ============================================
        const user = await requireAuth(event)
        const isAdmin = await checkAdminRole(user.sub)

        if (!isAdmin) {
            throw createError({
                statusCode: 403,
                statusMessage: 'No autorizado. Solo administradores pueden eliminar imágenes.'
            })
        }

        // ============================================
        // 2. Parsear parámetros
        // ============================================
        const imageKey = getRouterParam(event, 'imageKey')
        const query = getQuery(event)
        const productId = Number(query.productId)

        if (!imageKey || !productId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Parámetros faltantes: imageKey (ruta) y productId (query) son requeridos'
            })
        }

        const supabaseAdmin = useSupabaseAdmin()

        // ============================================
        // 3. Eliminar registro de BD
        // ============================================
        const { error: deleteError } = await supabaseAdmin
            .from('product_images')
            .delete()
            .eq('product_id', productId)
            .eq('image_key', imageKey)

        if (deleteError) {
            throw deleteError
        }

        // ============================================
        // 4. DECISIÓN: Deduplicación inteligente
        // ============================================
        // Verificar si otros productos usan el mismo imageKey (hash)
        // 
        // RAZÓN de esta lógica:
        // - Si 2 productos suben la MISMA imagen (mismo hash SHA-256),
        //   ambos apuntan al MISMO archivo en Storage
        // - Si solo elimino el archivo sin verificar, el otro producto
        //   queda sin imagen
        // - Solución: Borrar archivo solo si no hay más referencias
        //
        // Ejemplo:
        // - Producto A sube imagen.jpg → hash: aabbcc → almacenado en Storage
        // - Producto B sube la misma imagen.jpg → hash: aabbcc → reutiliza archivo
        // - Elimino imagen de Producto A → ¿borro archivo? NO, lo usa B
        // - Elimino imagen de Producto B → ¿borro archivo? SÍ, no lo usa nadie

        const { count, error: countError } = await supabaseAdmin
            .from('product_images')
            .select('*', { count: 'exact', head: true })
            .eq('image_key', imageKey)

        if (countError) {
            console.error('Error checking image references:', countError)
            // No lanzar error, solo loguear. El registro ya se eliminó.
        }

        // Si no hay más referencias, eliminar archivo de Storage
        if (count === 0) {
            const filename = `${imageKey}.webp`

            const { error: storageError } = await supabaseAdmin.storage
                .from('product-images')
                .remove([filename])

            if (storageError) {
                console.error('Error deleting file from storage:', storageError)
                // No lanzar error. Registro está eliminado, eso es lo importante.
                // El archivo puede limpiarse después manualmente si falla.
            }
        }

        // ============================================
        // 5. Retornar éxito
        // ============================================
        return {
            success: true,
            message: 'Imagen eliminada correctamente'
        }

    } catch (error: any) {
        console.error('Error en delete.delete.ts:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Error al eliminar imagen'
        })
    }
})