export type PaymentResult = { type: 'redirect'; url: string }

export interface PaymentItem {
    product_id: string
    name:       string
    quantity:   number
    unit_price: number
}

export const usePayment = () => {
    const config   = useRuntimeConfig()
    const provider = config.public.paymentProvider as 'mercadopago' | 'stripe'

    // ─── Mercado Pago ─────────────────────────────────────────────────────────
    const initMercadoPago = async (
        orderId: string,
        items:   PaymentItem[],
    ): Promise<PaymentResult> => {
        const data = await $fetch<{ init_point: string }>(
            '/api/payments/mp/create-preference',
            { method: 'POST', body: { orderId, items } },
        )
        return { type: 'redirect', url: data.init_point }
    }

    // ─── Stripe ───────────────────────────────────────────────────────────────
    const initStripe = async (
        orderId: string,
        amount:  number,
    ): Promise<PaymentResult> => {
        const data = await $fetch<{ clientSecret: string }>(
            '/api/payments/stripe/create-intent',
            { method: 'POST', body: { orderId, amount } },
        )
        return { type: 'elements', clientSecret: data.clientSecret }
    }

    // ─── Entrada pública ──────────────────────────────────────────────────────
    const initPayment = async (orderId: string): Promise<PaymentResult> => {
        const data = await $fetch<{ redirect_url: string }>(
            '/api/checkout/create-payment',
            { method: 'POST', body: { order_id: orderId } },
        )
        return { type: 'redirect', url: data.redirect_url }
    }

    return { provider, initPayment }
}