export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const siteUrl = config.public.siteUrl
    
    try {
        console.log('[MP] back_urls:', {
            success: `${siteUrl}/checkout/success`,
            failure: `${siteUrl}/checkout/failed`,
            pending: `${siteUrl}/checkout/pending`,
        })
        
        const result = await $fetch(
            'https://api.mercadopago.com/checkout/preferences',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: {
                    items: body.items.map((item: any) => ({
                        id: String(item.product_id),
                        title: item.name,
                        quantity: item.quantity,
                        unit_price: Number(item.unit_price),
                        currency_id: 'MXN',
                    })),
                    external_reference: body.orderId,
                    back_urls: {
                        success: `${siteUrl}/checkout/success`,
                        failure: `${siteUrl}/checkout/failed`,
                        pending: `${siteUrl}/checkout/pending`,
                    },
                    auto_return: 'approved',
                    notification_url: `${siteUrl}/api/webhooks/mercadopago`,
                    statement_descriptor: 'APCO Tools',
                }
            }
        )
        
        return {
            init_point: result.sandbox_init_point, // cambiar a result.init_point en producción
            preference_id: result.id,
        }
    } catch (error) {
        console.error('[MP] Error creating preference:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al crear preferencia de pago'
        })
    }
})