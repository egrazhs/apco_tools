export const useStorageImage = (bucketName: string) => {
    const supabase = useSupabaseClient()
    const config = useRuntimeConfig()
    const PROJECT_ID = config.public.supabase.projectId || 'gqgdzvkoydpuefloilmr'
    
    /**
     * Genera URL pública de Supabase Storage para una imagen
     * @param imageKey - SHA-256 hash del archivo (ej: "abc123def456...")
     * @returns URL pública o null si imageKey está vacío
     */
    const getPublicUrl = (imageKey: string | null | undefined): string | null => {
        if (!imageKey) return null
        
        return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${bucketName}/${imageKey}`
    }
    
    /**
     * Alias de getPublicUrl para compatibilidad (genera URL con extensión .webp)
     * @param imageKey - SHA-256 hash del archivo
     * @returns URL pública con extensión .webp
     */
    const getImageUrl = (imageKey: string): string => {
        return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${bucketName}/${imageKey}.webp`
    }
    
    /**
     * Sube una imagen al bucket de Supabase Storage
     */
    const uploadImage = async (file: File) => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.access_token) throw new Error('No autenticado')
            
            const formData = new FormData()
            formData.append('file', file)
            formData.append('bucket', bucketName)
            
            const response = await $fetch('/admin/storage/upload', {
                method: 'POST',
                body: formData,
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            })
            
            return response
        } catch (err: any) {
            console.error('Error uploading:', err)
            return { success: false, error: err.message }
        }
    }
    
    /**
     * Elimina una imagen del bucket de Supabase Storage
     */
    const deleteImage = async (imageKey: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.access_token) throw new Error('No autenticado')
            
            const response = await $fetch(`/admin/storage/${imageKey}/delete`, {
                method: 'DELETE',
                query: { bucket: bucketName },
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            })
            
            return response
        } catch (err: any) {
            console.error('Error deleting:', err)
            return { success: false, error: err.message }
        }
    }
    
    return { 
        getPublicUrl,
        getImageUrl, 
        uploadImage, 
        deleteImage 
    }
}