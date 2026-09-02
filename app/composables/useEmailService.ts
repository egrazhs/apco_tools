export interface EmailPayload {
    nombre: string
    email: string
    telefono?: string
    empresa?: string
    mensaje: string
    [key: string]: any
}

interface EmailResponse {
    success: boolean
    message: string
}

/**
 * Composable para enviar emails a través de la API
 * Uso en cualquier formulario:
 *
 * const { sendEmail, loading, error } = useEmailService()
 * await sendEmail('/api/cotizacion', formData)
 */
export const useEmailService = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    const sendEmail = async (endpoint: string, payload: EmailPayload): Promise<EmailResponse> => {
        loading.value = true
        error.value = null

        try {
            const response = await $fetch<EmailResponse>(endpoint, {
                method: 'POST',
                body: payload,
            })

            return response
        } catch (err: any) {
            const message = err.data?.statusMessage || err.message || 'Error al enviar el email'
            error.value = message
            console.error('Error en useEmailService:', err)

            throw new Error(message)
        } finally {
            loading.value = false
        }
    }

    return {
        sendEmail,
        loading: readonly(loading),
        error: readonly(error),
    }
}
