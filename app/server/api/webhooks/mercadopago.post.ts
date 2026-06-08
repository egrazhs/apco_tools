import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // MP envía type: 'payment' con el data.id del pago
    if (body.type !== 'payment') return { ok: true }

    const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN!,
    })

    const paymentApi = new Payment(client)
    const payment = await paymentApi.get({ id: body.data.id })

    

    const orderId = payment.external_reference  // tu UUID de Supabase
    const status = payment.status               // 'approved' | 'pending' | 'rejected'

    // Actualizar orden en Supabase
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // service role en server-side
    )

    const paymentStatusMap: Record<string, string> = {
        approved: 'paid',
        pending:  'pending',
        rejected: 'failed',
    }

    await supabase
        .from('orders')
        .update({
            payment_status:      paymentStatusMap[status] ?? 'pending',
            external_payment_id: String(payment.id),
            updated_at:          new Date().toISOString(),
        })
        .eq('id', orderId)

    return { ok: true }
})