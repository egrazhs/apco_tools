import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body   = await readBody(event)
    const query  = getQuery(event)

    // MP envía type=payment via query string o body
    const isPayment = body.type === 'payment' || query.type === 'payment'
    if (!isPayment) return { ok: true }

    const paymentId = body.data?.id ?? query['data.id']
    if (!paymentId) return { ok: true }

    // Consultar detalle del pago en MP
    const mpClient  = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
    const mpPayment = new Payment(mpClient)
    const paymentData = await mpPayment.get({ id: String(paymentId) })

    // Mapear status de MP a nuestro esquema
    const statusMap: Record<string, string> = {
        approved:    'paid',
        rejected:    'failed',
        cancelled:   'failed',
        in_process:  'pending',
        pending:     'pending',
    }
    const payment_status = statusMap[paymentData.status ?? ''] ?? 'pending'

    // Actualizar orden en Supabase
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        config.supabaseServiceKey,
    )

    const { error } = await supabase
        .from('orders')
        .update({
            payment_status,
            payment_provider:    'mercadopago',
            external_payment_id: String(paymentId),
        })
        .eq('id', paymentData.external_reference)

    if (error) console.error('[MP Webhook] Supabase error:', error)

    return { ok: true }
})