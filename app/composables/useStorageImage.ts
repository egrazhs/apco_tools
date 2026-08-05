// composables/useStorageImage.ts
export const useStorageImage = (bucketName: string) => {
    const supabase = useSupabaseClient()

    const getImageUrl = (imageKey: string) => {
        const PROJECT_ID = 'gqgdzvkoydpuefloilmr'
        return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${bucketName}/${imageKey}.webp`
    }

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

    return { getImageUrl, uploadImage, deleteImage }
}