// composables/useOrders.ts
export const useOrders = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const { data: orders, refresh, pending, error } = useAsyncData(
        'user-orders',
        async () => {
            if (!user.value?.sub) return []

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id, created_at, subtotal, shipping_cost, tax, total,
                    status, payment_status, payment_provider,
                    order_items (
                        id, quantity, unit_price, discount, subtotal,
                        products ( name, image_url )
                    ),
                    addresses (
                        alias, recipient_name, street, ext_number, int_number,
                        neighborhood, city, state, zip_code
                    )
                `)
                .eq('user_id', user.value.sub)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data ?? []
        },
        { server: false }
    )

    return { orders, refresh, pending, error }
}