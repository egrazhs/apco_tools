import { MercadoPagoConfig, Preference } from 'mercadopago'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body   = await readBody(event)

    const client     = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
    const preference = new Preference(client)

    const siteUrl = config.public.siteUrl
    console.log('[MP] back_urls:', {
        success: `${siteUrl}/checkout/success`,
        failure: `${siteUrl}/checkout/failed`,
        pending: `${siteUrl}/checkout/pending`,
    })

    const result = await preference.create({
        body: {
            items: body.items.map((item: any) => ({
                id:          String(item.product_id),
                title:       item.name,
                quantity:    item.quantity,
                unit_price:  Number(item.unit_price),
                currency_id: 'MXN',
            })),
            external_reference: body.orderId,
            back_urls: {
                success: `${config.public.siteUrl}/checkout/success`,  // ← corregido
                failure: `${config.public.siteUrl}/checkout/failed`,   // ← corregido
                pending: `${config.public.siteUrl}/checkout/pending`,  // ← corregido
            },
            auto_return:          'approved',
            notification_url:     `${config.public.siteUrl}/api/payments/mp/webhook`, // ← corregido
            statement_descriptor: 'APCO Tools',
        },
    })



    return {
        init_point:    result.sandbox_init_point, // cambiar a result.init_point en producción
        preference_id: result.id,
    }
})