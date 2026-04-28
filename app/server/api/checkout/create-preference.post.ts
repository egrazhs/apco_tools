import { MercadoPagoConfig, Preference } from 'mercadopago'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    // body = { items: [...], orderId: 'uuid', buyerEmail: '...' }

    const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN!,
    })

    const preference = new Preference(client)

    const response = await preference.create({
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
            external_reference: body.orderId, // tu UUID de orden en Supabase
            back_urls: {
                success: `${process.env.BASE_URL}/checkout/success`,
                failure: `${process.env.BASE_URL}/checkout/failure`,
                pending: `${process.env.BASE_URL}/checkout/pending`,
            },
            auto_return: 'approved',
            notification_url: `${process.env.BASE_URL}/api/webhooks/mercadopago`,
        },
    })

    return { init_point: response.init_point }
})