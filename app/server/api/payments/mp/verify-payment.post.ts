import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const { order_id } = await readBody<{ order_id: string }>(event)

    if (!order_id) {
        throw createError({ statusCode: 400, statusMessage: 'order_id requerido' })
    }

    const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN!,
    })

    const config = useRuntimeConfig()
    
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
    )
    
    // Buscar pagos por external_reference
    const paymentApi = new Payment(client)
    const results = await paymentApi.search({
        options: { criteria: 'desc', external_reference: order_id }
    })


    console.log('[MP VERIFY] results:', JSON.stringify(results.results?.map(p => ({
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
                payment_status:      'paid',
                status:              'paid',
                external_payment_id: String(payment.id),
                updated_at:          new Date().toISOString(),
            })
            .eq('id', order_id)
    }

    return { status }
})