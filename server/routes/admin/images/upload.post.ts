import { createHash } from 'crypto'
import sharp from 'sharp'

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
                statusMessage: 'No autorizado. Solo administradores pueden subir imágenes.'
            })
        }

        // ============================================
        // 2. Parsear FormData
        // ============================================
        const formData = await readFormData(event)
        const file = formData.get('file') as File
        const productId = Number(formData.get('productId'))
        const isPrimary = formData.get('isPrimary') === 'true'
        const altText = formData.get('altText') as string || null

        if (!file || !productId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Parámetros faltantes: file y productId son requeridos'
            })
        }

        // ============================================
        // 3. Validar tipo MIME
        // ============================================
        // DECISIÓN: Validar MIME porque:
        // - Evita subir archivos maliciosos
        // - Sharp puede fallar con archivos inválidos
        // - Mejor experiencia de usuario (error claro)
        const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!ALLOWED_MIMES.includes(file.type)) {
            throw createError({
                statusCode: 400,
                statusMessage: `Tipo de archivo no permitido. Acepta: ${ALLOWED_MIMES.join(', ')}`
            })
        }

        // ============================================
        // 4. Leer archivo y generar SHA-256
        // ============================================
        const buffer = await file.arrayBuffer()
        const fileHash = createHash('sha256').update(Buffer.from(buffer)).digest('hex')
        const filename = `${fileHash}.webp`

        // ============================================
        // 5. Convertir a WebP con Sharp
        // ============================================
        // DECISIÓN: Convertir a WebP porque:
        // - Formato moderno, mejor compresión (50% menos que JPG/PNG)
        // - Soportado en todos los navegadores modernos
        // - Optimiza velocidad de carga del sitio
        const webpBuffer = await sharp(Buffer.from(buffer))
            .webp({ quality: 80 }) // Calidad 80 = buena relación tamaño/calidad
            .toBuffer()

        // ============================================
        // 6. Subir a Supabase Storage
        // ============================================
        const supabaseServiceRole = useSupabaseServiceRole()

        const { error: uploadError } = await supabaseServiceRole.storage
            .from('product-images')
            .upload(filename, webpBuffer, {
                contentType: 'image/webp',
                upsert: false // Si ya existe (mismo hash), no sobrescribir
            })

        // Si el archivo ya existe (deduplicación), no es error
        // Solo continuamos con la BD
        if (uploadError && uploadError.message !== 'Duplicate') {
            throw uploadError
        }

        // ============================================
        // 7. Insertar en BD con deduplicación
        // ============================================
        const supabaseAdmin = useSupabaseAdmin()

        // Si isPrimary, primero desmarcamos otros
        if (isPrimary) {
            await supabaseAdmin
                .from('product_images')
                .update({ is_primary: false })
                .eq('product_id', productId)
        }

        // Insertar o ignorar si ya existe (mismo product_id + image_key)
        const { data, error: insertError } = await supabaseAdmin
            .from('product_images')
            .insert({
                product_id: productId,
                image_key: fileHash,
                is_primary: isPrimary,
                alt_text: altText,
                display_order: 0
            })
            .select()
            .single()

        if (insertError) {
            // Si es constraint violation (duplicate), no es error crítico
            if (insertError.code !== '23505') {
                throw insertError
            }
        }

        // ============================================
        // 8. Retornar éxito
        // ============================================
        return {
            success: true,
            imageKey: fileHash,
            message: 'Imagen subida exitosamente'
        }

    } catch (error: any) {
        console.error('Error en upload.post.ts:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Error al subir la imagen'
        })
    }
})