import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const query = getQuery(event)
    
    // MP envía type=payment via query string o body
    const isPayment = body.type === 'payment' || query.type === 'payment'
    if (!isPayment) return { ok: true }
    
    const paymentId = body.data?.id ?? query['data.id']
    if (!paymentId) return { ok: true }
    
    try {
        // Consultar detalle del pago en MP via API
        const paymentData = await $fetch(
            `https://api.mercadopago.com/v1/payments/${String(paymentId)}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                }
            }
        )
        
        // Mapear status de MP a nuestro esquema
        const statusMap: Record<string, string> = {
            approved: 'paid',
            rejected: 'failed',
            cancelled: 'failed',
            in_process: 'pending',
            pending: 'pending',
        }
        
        const payment_status = statusMap[paymentData.status ?? ''] ?? 'pending'
        
        // Actualizar orden en Supabase
        const supabase = createClient(
            config.public.supabase.url,
            config.supabaseServiceKey,
        )
        
        const { error } = await supabase
            .from('orders')
            .update({
                payment_status,
                payment_provider: 'mercadopago',
                external_payment_id: String(paymentId),
            })
            .eq('id', paymentData.external_reference)
        
        if (error) console.error('[MP Webhook] Supabase error:', error)
        
        return { ok: true }
    } catch (error) {
        console.error('[MP Webhook] Error:', error)
        // Retornamos 500 para que MP reintente el webhook
        throw createError({
            statusCode: 500,
            statusMessage: 'Webhook processing error'
        })
    }
})