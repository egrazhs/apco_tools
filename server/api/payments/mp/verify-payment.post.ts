import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const { order_id } = await readBody<{ order_id: string }>(event)

    if (!order_id) {
        throw createError({ statusCode: 400, statusMessage: 'order_id requerido' })
    }

    const config = useRuntimeConfig()

    const supabase = createClient(
        config.public.supabase.url,
        config.supabaseServiceKey,
    )

    try {
        // Buscar pagos por external_reference usando la API de MP
        const results: any = await $fetch(
            'https://api.mercadopago.com/v1/payments/search',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${config.mpAccessToken}`,
                },
                query: {
                    external_reference: order_id,
                    sort: 'date_created',
                    criteria: 'desc',
                },
            }
        )

        console.log('[MP VERIFY] results:', JSON.stringify(results.results?.map((p: any) => ({
            id: p.id,
            status: p.status,
            external_reference: p.external_reference,
        })), null, 4))

        // Si hay un pago aprobado, ese manda; si no, el más reciente
        const payment = results.results?.find((p: any) => p.status === 'approved')
            ?? results.results?.[0]

        if (!payment) {
            return { status: 'not_found' }
        }

        // Solo se procesa si está aprobado. Pendientes y rechazos los atiende el webhook.
        // processOrderPayment actualiza la orden y envía los correos una sola vez.
        if (payment.status === 'approved') {
            await processOrderPayment(supabase, config, payment, order_id)
        }

        return { status: payment.status }
    } catch (error) {
        console.error('[MP VERIFY] Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al verificar pago',
        })
    }
})