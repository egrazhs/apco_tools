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
                statusMessage: 'No autorizado. Solo administradores pueden modificar imágenes.'
            })
        }

        // ============================================
        // 2. Parsear body
        // ============================================
        const { productId, imageKey } = await readBody(event)

        if (!productId || !imageKey) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Parámetros faltantes: productId e imageKey son requeridos'
            })
        }

        // ============================================
        // 3. Desmarcar otras imágenes del producto
        // ============================================
        const supabaseAdmin = useSupabaseAdmin()

        const { error: unmarkError } = await supabaseAdmin
            .from('product_images')
            .update({ is_primary: false })
            .eq('product_id', productId)

        if (unmarkError) {
            throw unmarkError
        }

        // ============================================
        // 4. Marcar la nueva como primaria
        // ============================================
        const { error: markError } = await supabaseAdmin
            .from('product_images')
            .update({ is_primary: true })
            .eq('product_id', productId)
            .eq('image_key', imageKey)

        if (markError) {
            throw markError
        }

        // ============================================
        // 5. Retornar éxito
        // ============================================
        return {
            success: true,
            message: 'Imagen marcada como primaria'
        }

    } catch (error: any) {
        console.error('Error en set-primary.patch.ts:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Error al marcar imagen primaria'
        })
    }
})