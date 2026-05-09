import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body   = await readBody(event)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    const intent = await stripe.paymentIntents.create({
        amount:   Math.round(Number(body.amount) * 100), // centavos MXN
        currency: 'mxn',
        metadata: { orderId: String(body.orderId) },
        automatic_payment_methods: { enabled: true },
    })

    // Guardar el intent id en la orden para relacionarlo en el webhook
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
    )

    await supabase
        .from('orders')
        .update({
            payment_provider:    'stripe',
            external_payment_id: intent.id,
        })
        .eq('id', body.orderId)

    return { clientSecret: intent.client_secret }
})