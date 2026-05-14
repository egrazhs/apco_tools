import { serverSupabaseServiceRole } from '#supabase/server'
import { useMailer } from '~/server/utils/mailer'
import { orderConfirmationTemplate } from '~/server/utils/emailTemplates'

export default defineEventHandler(async (event) => {
    const { orderId } = await readBody(event)
    const supabase = serverSupabaseServiceRole(event)
    const { send } = useMailer()

    // Traer orden completa con items, dirección y usuario
    const { data: order } = await supabase
        .from('orders')
        .select(`
            id, subtotal, shipping_cost, tax, total,
            order_items (quantity, unit_price, subtotal, products(nombre)),
            addresses (recipient_name, street, ext_number, neighborhood, city, state, zip_code),
            profiles (full_name, email)
        `)
        .eq('id', orderId)
        .single()

    if (!order) throw createError({ statusCode: 404, statusMessage: 'Orden no encontrada' })

    const addr = order.addresses
    const addressString = `${addr.street} #${addr.ext_number}, ${addr.neighborhood}, ${addr.city}, ${addr.state} CP ${addr.zip_code}`

    await send({
        to: order.profiles.email,
        subject: `Confirmación de tu pedido #${order.id.slice(0, 8).toUpperCase()} — APCO Tools`,
        html: orderConfirmationTemplate({
            orderNumber: order.id.slice(0, 8).toUpperCase(),
            customerName: order.profiles.full_name ?? order.addresses.recipient_name,
            items: order.order_items.map((i: any) => ({
                nombre: i.products.nombre,
                quantity: i.quantity,
                unit_price: i.unit_price,
                subtotal: i.subtotal,
            })),
            subtotal: order.subtotal,
            shipping: order.shipping_cost,
            tax: order.tax,
            total: order.total,
            address: addressString,
        }),
    })

    return { ok: true }
})