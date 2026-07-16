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
        const results = await $fetch(
            'https://api.mercadopago.com/v1/payments/search',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                },
                query: {
                    external_reference: order_id,
                    sort: 'date_created',
                    criteria: 'desc',
                }
            }
        )
        
        console.log('[MP VERIFY] results:', JSON.stringify(results.results?.map((p: any) => ({
            id: p.id,
            status: p.status,
            external_reference: p.external_reference
        })), null, 2))
        
        const payment = results.results?.[0]
        
        if (!payment) {
            return { status: 'not_found' }
        }
        
        const status = payment.status // 'approved' | 'pending' | 'rejected'
        
        // Actualizar orden solo si está aprobado
        if (status === 'approved') {
            await supabase
                .from('orders')
                .update({
                    payment_status: 'paid',
                    status: 'paid',
                    external_payment_id: String(payment.id),
                    updated_at: new Date().toISOString(),
                })
                .eq('id', order_id)
        }
        
        return { status }
    } catch (error) {
        console.error('[MP VERIFY] Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al verificar pago'
        })
    }
})