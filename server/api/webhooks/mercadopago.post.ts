import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)

    // MP envía type: 'payment' con el data.id del pago
    if (body.type !== 'payment') return { ok: true }

    try {
        // Petición HTTP directa a Mercado Pago - Evita el SDK y soluciona el error en Windows
        const payment: any = await $fetch(`https://api.mercadopago.com/v1/payments/${body.data.id}`, {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            }
        })

        const orderId = payment.external_reference  // Tu UUID de Supabase
        const status = payment.status               // 'approved' | 'pending' | 'rejected'

        // Actualizar orden en Supabase
        const supabase = createClient(
            config.public.supabase.url,
            config.supabaseServiceKey  // ← asegúrate que esté en nuxt.config.ts
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

    } catch (error) {
        console.error('Error procesando el webhook de Mercado Pago:', error)
        // Retornamos 500 para que MP sepa que hubo un fallo y reintente el webhook más tarde
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Webhook Error',
        })
    }
})
