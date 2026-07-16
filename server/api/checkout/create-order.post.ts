import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

interface CartItem {
    product_id:  number    // ← corregido
    quantity:    number
    unit_price:  number
}

interface ShippingAddress {
    nombre:      string
    calle:       string
    numero_ext:  string
    numero_int?: string
    colonia:     string
    ciudad:      string
    estado:      string
    cp:          string
    telefono:    string
}

interface CreateOrderBody {
    items:   CartItem[]
    address: ShippingAddress
}

export default defineEventHandler(async (event) => {
    // ─── Autenticación ────────────────────────────────────────────────────────
    const user = await serverSupabaseUser(event)
    if (!user) {
        throw createError({ statusCode: 401, statusMessage: 'No autorizado' })
    }

    const body = await readBody<CreateOrderBody>(event)
    const { items, address } = body

    if (!items?.length || !address) {
        throw createError({ statusCode: 400, statusMessage: 'Datos incompletos' })
    }

    const supabase = await serverSupabaseClient(event)

    // ─── Verificar stock y obtener precios desde DB ───────────────────────────
    const productIds = items.map(i => i.product_id)

    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, stock')
        .in('id', productIds)

    if (productsError || !products) {
        throw createError({ statusCode: 500, statusMessage: 'Error al verificar productos' })
    }

    const productMap = Object.fromEntries(products.map(p => [p.id, p]))

    for (const item of items) {
        const product = productMap[item.product_id]
        if (!product) {
            throw createError({ statusCode: 400, statusMessage: `Producto ${item.product_id} no encontrado` })
        }
        if (product.stock !== null && product.stock < item.quantity) {
            throw createError({
                statusCode: 409,
                statusMessage: `Stock insuficiente para "${product.name}"`,
            })
        }
    }

    // ─── Calcular totales (precio real desde DB) ──────────────────────────────
    const subtotal      = items.reduce((sum, item) => {
        return sum + productMap[item.product_id].price * item.quantity
    }, 0)
    const shipping_cost = 0
    const total         = subtotal + shipping_cost

    // ─── Guardar dirección ────────────────────────────────────────────────────
    const { data: savedAddress, error: addressError } = await supabase
        .from('addresses')
        .insert({
            user_id:        user.sub,
            alias:          'Envío',           // ← agregado
            recipient_name: address.nombre,
            street:         address.calle,
            ext_number:     address.numero_ext,
            int_number:     address.numero_int ?? null,
            neighborhood:   address.colonia,
            city:           address.ciudad,
            state:          address.estado,
            zip_code:       address.cp,
            phone:          address.telefono,
            country:        'MX',
            is_default:     false,
        })
        .select('id')
        .single()

    if (addressError || !savedAddress) {
        throw createError({ statusCode: 500, statusMessage: 'Error al guardar la dirección' })
    }

    // ─── Crear orden ──────────────────────────────────────────────────────────
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id:          user.sub,
            address_id:       savedAddress.id,
            status:           'pending',
            payment_status:   'pending',       // ← agregado
            subtotal,
            shipping_cost,
            tax:              0,
            total,
            payment_provider: process.env.PAYMENT_PROVIDER ?? 'stripe',
        })
        .select()
        .single()

    if (orderError || !order) {
        throw createError({ statusCode: 500, statusMessage: 'Error al crear la orden' })
    }

    // ─── Crear líneas de orden ────────────────────────────────────────────────
    const orderItems = items.map(item => ({
        order_id:   order.id,
        product_id: item.product_id,
        quantity:   item.quantity,
        unit_price: productMap[item.product_id].price,  // precio desde DB
        discount:   0,
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) {
        await supabase.from('orders').delete().eq('id', order.id)
        throw createError({ statusCode: 500, statusMessage: 'Error al guardar productos de la orden' })
    }

    return {
        order_id: order.id,
        subtotal,
        shipping_cost,
        total,
    }
})