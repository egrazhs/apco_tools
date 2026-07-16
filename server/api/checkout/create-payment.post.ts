import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

// ─── Helpers de proveedor ────────────────────────────────────────────────────

async function createStripeSession(order: any, items: any[], baseUrl: string) {
    const stripe = await import('stripe').then(m => new m.default(process.env.STRIPE_SECRET_KEY!))

    const lineItems = items.map((item: any) => ({
        price_data: {
            currency:     'mxn',
            unit_amount:  Math.round(item.unit_price * 100), // Stripe trabaja en centavos
            product_data: {
                name: item.products?.name ?? `Producto #${item.product_id}`
            },
        },
        quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
        mode:                'payment',
        line_items:          lineItems,
        success_url:         `${baseUrl}/checkout/success?order_id=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:          `${baseUrl}/checkout/failed?order_id=${order.id}`,
        client_reference_id: String(order.id),
        metadata: {
            order_id: String(order.id),
        },
    })

    return { redirect_url: session.url }
}

async function createMercadoPagoPreference(order: any, items: any[], baseUrl: string) {
    const accessToken = process.env.MP_ACCESS_TOKEN!

    const mpItems = items.map((item: any) => ({
        title: item.products?.name ?? `Producto #${item.product_id}`,
        quantity:   item.quantity,
        unit_price: item.unit_price,
        currency_id: 'MXN',
    }))

    const mpBaseUrl = baseUrl.includes('localhost')
        ? process.env.NGROK_URL ?? 'https://tu-dominio.ngrok-free.app'
        : baseUrl

    const body = {
        items: mpItems,
        back_urls: {
            success: `${mpBaseUrl}/checkout/success?order_id=${order.id}`,
            failure: `${mpBaseUrl}/checkout/failed?order_id=${order.id}`,
            pending: `${mpBaseUrl}/checkout/success?order_id=${order.id}&pending=true`,
        },
        auto_return:        'approved',
        external_reference: String(order.id),
    }


    console.log('[MP BODY]', JSON.stringify({
        ...body,
        notification_url: `${baseUrl}/api/payments/webhooks/mercadopago`,
    }, null, 2))
    console.log('[MP baseUrl]', baseUrl)
    
    const response = await $fetch<{ id: string; init_point: string; sandbox_init_point: string }>(
    'https://api.mercadopago.com/checkout/preferences',
        {
            method:  'POST',
            headers: {
                Authorization:  `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: {
                ...body,
                notification_url: `${baseUrl}/api/payments/webhooks/mercadopago`,
            },
        }
    ).catch(err => {
        console.error('[MP ERROR]', JSON.stringify(err.data, null, 2))
        throw err
    })

    const isSandbox = accessToken.startsWith('TEST-')
    return { redirect_url: isSandbox ? response.sandbox_init_point : response.init_point }
}

// ─── Handler principal ───────────────────────────────────────────────────────

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    console.log('user en create-payment:', user)        // ← agregar
    console.log('cookies:', event.headers.get('cookie'))
    
    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'No autorizado' })
    }

    const { order_id } = await readBody<{ order_id: string }>(event)
    if (!order_id) {
        throw createError({ statusCode: 400, statusMessage: 'order_id requerido' })
    }

    const supabase = await serverSupabaseClient(event)

    // Verificar que la orden pertenece al usuario y está en estado pending
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                product_id,
                quantity,
                unit_price,
                subtotal,
                products ( name )
            )
        `)
        .eq('id', order_id)
        .eq('user_id', user.sub)
        .eq('status', 'pending')
        .single()

    if (orderError || !order) {
        console.log("orderError: ", orderError)
        throw createError({ statusCode: 404, statusMessage: 'Orden no encontrada o ya procesada' })
    }

    const provider  = process.env.PAYMENT_PROVIDER ?? 'stripe'
    const baseUrl   = process.env.NUXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const orderItems = order.order_items ?? []

    if (provider === 'stripe') {
        return createStripeSession(order, orderItems, baseUrl)
    }

    if (provider === 'mercadopago') {
        return createMercadoPagoPreference(order, orderItems, baseUrl)
    }

    throw createError({
        statusCode:     500,
        statusMessage:  `PAYMENT_PROVIDER inválido: "${provider}". Usa "stripe" o "mercadopago".`,
    })
})
