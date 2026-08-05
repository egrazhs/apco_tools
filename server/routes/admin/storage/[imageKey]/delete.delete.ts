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
        // 2. Obtener parámetros
        // ============================================
        const imageKey = getRouterParam(event, 'imageKey')
        const bucket = getQuery(event).bucket as string

        if (!imageKey || !bucket) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Parámetros faltantes: imageKey y bucket son requeridos'
            })
        }

        // ============================================
        // 3. Validar bucket permitido
        // ============================================
        const ALLOWED_BUCKETS = ['brand-images', 'category-images', 'product-images']
        if (!ALLOWED_BUCKETS.includes(bucket)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bucket no permitido'
            })
        }

        // ============================================
        // 4. Eliminar de Storage
        // ============================================
        const supabaseServiceRole = useSupabaseServiceRole()

        const { error: deleteError } = await supabaseServiceRole.storage
            .from(bucket)
            .remove([`${imageKey}.webp`])

        if (deleteError) {
            console.error('Supabase Storage delete error:', deleteError)
            throw createError({
                statusCode: 500,
                statusMessage: 'Error al eliminar archivo de Storage'
            })
        }

        // ============================================
        // 5. Retornar éxito
        // ============================================
        return { success: true }

    } catch (error: any) {
        console.error('Error en storage/delete.delete.ts:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Error al eliminar la imagen'
        })
    }
})