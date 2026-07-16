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
        const { productId, order } = await readBody(event)

        if (!productId || !Array.isArray(order) || order.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Parámetros inválidos: productId es número, order es array no vacío'
            })
        }

        // ============================================
        // 3. Validar estructura de order
        // ============================================
        const isValidOrder = order.every(item => 
            item.imageKey && typeof item.displayOrder === 'number'
        )

        if (!isValidOrder) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Estructura inválida: cada item debe tener imageKey y displayOrder'
            })
        }

        // ============================================
        // 4. Actualizar display_order para cada imagen
        // ============================================
        const supabaseAdmin = useSupabaseAdmin()

        for (const item of order) {
            const { error } = await supabaseAdmin
                .from('product_images')
                .update({ display_order: item.displayOrder })
                .eq('product_id', productId)
                .eq('image_key', item.imageKey)

            if (error) {
                throw error
            }
        }

        // ============================================
        // 5. Retornar éxito
        // ============================================
        return {
            success: true,
            message: 'Imágenes reordenadas correctamente'
        }

    } catch (error: any) {
        console.error('Error en reorder.patch.ts:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Error al reordenar imágenes'
        })
    }
})