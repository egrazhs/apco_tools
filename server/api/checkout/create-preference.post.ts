export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    
    try {
        const response = await $fetch(
            'https://api.mercadopago.com/checkout/preferences',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: {
                    items: body.items.map((item: any) => ({
                        id: item.product_id,
                        title: item.nombre,
                        quantity: item.cantidad,
                        unit_price: item.precio,
                        currency_id: 'MXN',
                    })),
                    payer: {
                        email: body.buyerEmail,
                    },
                    external_reference: body.orderId,
                    back_urls: {
                        success: `${process.env.NUXT_PUBLIC_SITE_URL}/checkout/success`,
                        failure: `${process.env.NUXT_PUBLIC_SITE_URL}/checkout/failure`,
                        pending: `${process.env.NUXT_PUBLIC_SITE_URL}/checkout/pending`,
                    },
                    auto_return: 'approved',
                    notification_url: `${process.env.NUXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`,
                }
            }
        )
        
        return { init_point: response.init_point }
    } catch (error) {
        console.error('Error creating MP preference:', error)
        throw createError({ 
            statusCode: 500, 
            statusMessage: 'Error al crear preferencia de pago' 
        })
    }
})