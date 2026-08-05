import { createHash } from 'crypto'
import sharp from 'sharp'

export default defineEventHandler(async (event) => {
    try {
        // ============================================
        // 1. Validar autenticación (admin)
        // ============================================
        const user = await requireAuth(event)

        //console.log('🔍 [DEBUG] User extraído del JWT:', user)
        //console.log('🔍 [DEBUG] user.sub:', user.sub)

        const isAdmin = await checkAdminRole(user.sub)

        //console.log('🔍 [DEBUG] isAdmin:', isAdmin)


        if (!isAdmin) {
            throw createError({
                statusCode: 403,
                statusMessage: 'No autorizado. Solo administradores pueden subir imágenes.'
            })
        }

        // ============================================
        // 2. Parsear FormData
        // ============================================
        const formData = await readFormData(event)
        const file = formData.get('file') as File
        const bucket = formData.get('bucket') as string

        if (!file || !bucket) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Parámetros faltantes: file y bucket son requeridos'
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
        // 4. Validar tipo MIME
        // ============================================
        const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!ALLOWED_MIMES.includes(file.type)) {
            throw createError({
                statusCode: 400,
                statusMessage: `Tipo de archivo no permitido. Acepta: ${ALLOWED_MIMES.join(', ')}`
            })
        }

        // ============================================
        // 5. Leer archivo y generar SHA-256
        // ============================================
        const buffer = await file.arrayBuffer()
        const fileHash = createHash('sha256').update(Buffer.from(buffer)).digest('hex')
        const filename = `${fileHash}.webp`

        // ============================================
        // 6. Convertir a WebP con Sharp
        // ============================================
        const webpBuffer = await sharp(Buffer.from(buffer))
            .webp({ quality: 80 })
            .toBuffer()

        // ============================================
        // 7. Subir a Supabase Storage
        // ============================================
        const supabaseServiceRole = useSupabaseServiceRole()

        const { error: uploadError } = await supabaseServiceRole.storage
            .from(bucket)
            .upload(filename, webpBuffer, {
                contentType: 'image/webp',
                upsert: true
            })

        if (uploadError) {
            console.error('Supabase Storage error:', uploadError)
            throw createError({
                statusCode: 500,
                statusMessage: 'Error al subir archivo a Storage'
            })
        }

        // ============================================
        // 8. Retornar éxito
        // ============================================
        return {
            success: true,
            imageKey: fileHash,
            url: `https://gqgdzvkoydpuefloilmr.supabase.co/storage/v1/object/public/${bucket}/${fileHash}.webp`
        }

    } catch (error: any) {
        console.error('Error en storage/upload.post.ts:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Error al subir la imagen'
        })
    }
})