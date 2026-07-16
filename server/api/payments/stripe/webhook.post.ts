import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    
    // 🔍 LOGS DE DEBUG TEMPORALES
    console.log('[Webhook] Secret configurado:', !!process.env.STRIPE_WEBHOOK_SECRET)
    console.log('[Webhook] Secret prefix:', process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 12))
    console.log('[Webhook] Signature header:', getHeader(event, 'stripe-signature')?.substring(0, 20))


    const rawBody = await readRawBody(event)
    const sig     = getHeader(event, 'stripe-signature') ?? ''

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    let stripeEvent: Stripe.Event
    try {
        stripeEvent = stripe.webhooks.constructEvent(
            rawBody!,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!,
        )
    } catch {
        throw createError({ statusCode: 400, message: 'Stripe signature inválida' })
    }

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
    )

    if (stripeEvent.type === 'payment_intent.succeeded') {
        const intent = stripeEvent.data.object as Stripe.PaymentIntent

        console.log('[Stripe] Object: ', stripeEvent)
        console.log('[Stripe] Event type:', stripeEvent.type)
        console.log('[Stripe] Intent ID:', intent.id)
        console.log('[Stripe] Intent status:', intent.status)   

        const { data: order, error } = await supabase
            .from('orders')
            .update({ payment_status: 'paid' })
            .eq('external_payment_id', intent.id)
            .select('id')
            .single()

        if (error || !order) {
            console.error('[Webhook] Error actualizando orden:', error)
            throw createError({ statusCode: 500, message: 'Error actualizando orden' })
        }

        // Enviar confirmación de forma asíncrona (no bloqueante para Stripe)
        /*
        $fetch('/api/mail/order-confirmation', {
            method: 'POST',
            body: { orderId: order.id },
        }).catch(err => console.error('[webhook] Error enviando email confirmación:', err))
        */

        return { received: true }
    }


    if (stripeEvent.type === 'payment_intent.payment_failed') {
        const intent = stripeEvent.data.object as Stripe.PaymentIntent

        // 1. Traer la orden para obtener el user_id
        const { data: order } = await supabase
            .from('orders')
            .select('id, user_id')
            .eq('external_payment_id', intent.id)
            .single()
            
        // 2. Actualizar status
        await supabase
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('external_payment_id', intent.id)

        // 3. Enviar correo
        if (order) {
            const { data: { user } } = await supabase.auth.admin.getUserById(order.user_id)

            if (user) {
                const { send } = useMailer()
                send({
                    to: user.email!,
                    subject: 'Problema con tu pago — APCO Tools',
                    html: orderFailedTemplate(
                        user.user_metadata?.full_name ?? user.email!,
                        order.id.slice(0, 8).toUpperCase()
                    ),
                }).catch(err => console.error('[webhook] Error enviando email pago fallido:', err))
            }
        }
    }

    return { received: true }
})