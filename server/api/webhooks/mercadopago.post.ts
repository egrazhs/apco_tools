import { createClient } from '@supabase/supabase-js'
import { processOrderPayment } from '../../utils/orders'

export default defineEventHandler(async (event) => {
    console.log('═══════════════════════════════════════')
    console.log('💳 MERCADOPAGO WEBHOOK INICIADO')
    console.log('═══════════════════════════════════════')

    const config = useRuntimeConfig()
    const body = await readBody(event)

    // MP envía type: 'payment' con el data.id del pago
    if (body.type !== 'payment') return { ok: true }

    try {
        console.log('📥 Payment ID recibido:', body.data.id)

        // Petición HTTP directa a Mercado Pago - Evita el SDK y soluciona el error en Windows
        const payment: any = await $fetch(`https://api.mercadopago.com/v1/payments/${body.data.id}`, {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            }
        })

        console.log('✅ Datos del pago obtenidos de MP')

        const orderId = payment.external_reference  // Tu UUID de Supabase
        const status = payment.status               // 'approved' | 'pending' | 'rejected'

        console.log('📋 Orden ID:', orderId)
        console.log('📊 Status del pago:', status)

        // Crear cliente Supabase
        const supabase = createClient(
            config.public.supabase.url,
            config.supabaseServiceKey
        )

        // ✨ Una función que hace TODO: actualizar orden y enviar correos
        await processOrderPayment(supabase, config, payment, orderId)

        return { ok: true }
    } catch (error) {
        console.error('❌ Error procesando el webhook de Mercado Pago:', error)
        // Retornamos 500 para que MP sepa que hubo un fallo y reintente el webhook más tarde
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Webhook Error',
        })
    }
})