import { Resend } from 'resend'
import {
    buildAdminEmail,
    buildCustomerConfirmedEmail,
    buildCustomerFailedEmail,
} from './emailTemplates'

/**
 * Resuelve los datos del cliente de una orden.
 * Prioridad: columnas de la orden -> auth.users (correo) -> profiles (nombre).
 * Requiere que `supabase` sea el cliente con service role.
 */
async function resolveCustomer(supabase: any, order: any) {
    let email: string | null = order.customer_email ?? null
    let name: string | null = order.customer_name ?? null

    if (order.user_id) {
        if (!email) {
            const { data, error } = await supabase.auth.admin.getUserById(order.user_id)
            if (error) {
                console.warn('⚠️ No se pudo obtener el correo del usuario:', error.message)
            }
            email = data?.user?.email ?? null
        }

        if (!name) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('name')
                .eq('id', order.user_id)
                .maybeSingle()
            name = profile?.name ?? null
        }
    }

    return { email, name: name ?? email ?? 'cliente' }
}

/**
 * Carga los productos y la dirección de envío de la orden
 * para armar el detalle de los correos.
 */
async function loadOrderDetails(supabase: any, order: any) {
    const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('quantity, unit_price, discount, subtotal, products(name, code, model)')
        .eq('order_id', order.id)

    if (itemsError) {
        console.warn('⚠️ No se pudieron cargar los productos de la orden:', itemsError.message)
    }

    let address = null
    if (order.address_id) {
        const { data, error: addressError } = await supabase
            .from('addresses')
            .select('*')
            .eq('id', order.address_id)
            .maybeSingle()

        if (addressError) {
            console.warn('⚠️ No se pudo cargar la dirección de envío:', addressError.message)
        }
        address = data ?? null
    }

    return { items: items ?? [], address }
}

/**
 * Procesa el pago de una orden y envía correos.
 * Se puede llamar desde el webhook y desde la verificación: los correos
 * se envían una sola vez por estado gracias a la columna `notified_status`.
 * Uso: await processOrderPayment(supabase, config, payment, orderId)
 */
export async function processOrderPayment(
    supabase: any,
    config: any,
    payment: any,
    orderId: string
) {
    console.log('═══════════════════════════════════════')
    console.log('📦 PROCESANDO PAGO DE ORDEN')
    console.log('═══════════════════════════════════════')

    const status = payment.status  // 'approved' | 'pending' | 'rejected'
    console.log('📊 Estado del pago:', status)

    const paymentStatusMap: Record<string, 'paid' | 'pending' | 'failed'> = {
        approved: 'paid',
        pending: 'pending',
        rejected: 'failed',
    }

    const orderStatus = paymentStatusMap[status] ?? 'pending'

    try {
        // 1️⃣ Actualizar orden en Supabase
        console.log('🔄 Actualizando orden en Supabase...')
        const updates: Record<string, any> = {
            payment_status: orderStatus,
            external_payment_id: String(payment.id),
            updated_at: new Date().toISOString(),
        }

        if (orderStatus === 'paid') {
            updates.status = 'paid'
        }

        const { error: updateError } = await supabase
            .from('orders')
            .update(updates)
            .eq('id', orderId)

        if (updateError) {
            throw new Error(`Error actualizando orden: ${updateError.message}`)
        }
        console.log('✅ Orden actualizada')

        // 2️⃣ Obtener datos completos de la orden
        console.log('📥 Obteniendo datos de la orden...')
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        if (orderError) {
            console.error('❌ Error obteniendo orden:', orderError)
            throw new Error(`Error obteniendo orden: ${orderError.message}`)
        }
        console.log('✅ Datos de orden obtenidos')

        // Datos del cliente (correo y nombre)
        const customer = await resolveCustomer(supabase, order)
        order.customer_email = customer.email
        order.customer_name = customer.name

        // 3️⃣ Reservar el envío de correos para este estado.
        //    El update condicional es atómico: si la verificación y el webhook
        //    llegan al mismo tiempo, solo uno obtiene la reserva.
        const { data: claimed, error: claimError } = await supabase
            .from('orders')
            .update({ notified_status: orderStatus })
            .eq('id', orderId)
            .or(`notified_status.is.null,notified_status.neq.${orderStatus}`)
            .select('id')

        if (claimError) {
            console.error('❌ No se pudo reservar el envío de correos (¿existe la columna notified_status?):', claimError.message)
        } else if (!claimed?.length) {
            console.log(`⏭️ Ya se enviaron los correos para el estado "${orderStatus}", se omiten duplicados`)
        } else {
            // Productos y dirección para el detalle de los correos
            const details = await loadOrderDetails(supabase, order)
            order.items = details.items
            order.address = details.address

            console.log(`📨 Enviando correos (estado: ${orderStatus})...`)

            // 3a. Correo al cliente (un fallo aquí no debe bloquear el aviso al admin)
            try {
                if (!order.customer_email) {
                    console.warn('⚠️ Orden sin correo de cliente, se omite correo al cliente')
                } else if (orderStatus === 'paid') {
                    await sendOrderConfirmedEmail(config, order)
                } else if (orderStatus === 'failed') {
                    await sendOrderFailedEmail(config, order, payment)
                } else if (orderStatus === 'pending') {
                    console.log('⏳ Pago pendiente, sin correo al cliente aún')
                }
            } catch (emailError: any) {
                console.error('❌ Falló el correo al cliente:', emailError.message)
            }

            // 3b. Notificación al admin (ferretería)
            try {
                console.log('📨 Enviando notificación al admin...')
                await sendAdminNotification(config, order, payment, orderStatus)
            } catch (emailError: any) {
                console.error('❌ Falló la notificación al admin:', emailError.message)
            }
        }

        console.log('═══════════════════════════════════════')
        console.log('✅ ORDEN PROCESADA CORRECTAMENTE')
        console.log('═══════════════════════════════════════')

        return order
    } catch (error: any) {
        console.error('❌ ERROR PROCESANDO ORDEN:')
        console.error('   Tipo:', error.constructor.name)
        console.error('   Mensaje:', error.message)
        console.error('   Stack:', error.stack)
        throw error
    }
}

/**
 * Envío genérico con Resend.
 * El SDK devuelve los errores en result.error y no lanza excepción.
 */
async function sendEmail(
    config: any,
    label: string,
    payload: { to: string; subject: string; html: string; text: string; replyTo?: string }
) {
    if (!config.resendApiKey) {
        console.error('❌ RESEND_API_KEY NO CONFIGURADA')
        throw new Error('Email service not configured')
    }

    const resend = new Resend(config.resendApiKey)

    const result = await resend.emails.send({
        from: config.mailFrom,
        ...payload,
    })

    if (result.error) {
        console.error(`❌ Error enviando ${label}:`, result.error)
        throw new Error(result.error.message)
    }

    console.log(`✅ ${label} enviado:`, result.data?.id)
}

/** Confirmación al cliente cuando el pago es aprobado */
async function sendOrderConfirmedEmail(config: any, order: any) {
    const email = buildCustomerConfirmedEmail(order)

    await sendEmail(config, 'email de confirmación', {
        to: order.customer_email,
        replyTo: config.mailToContact,
        ...email,
    })
}

/** Aviso al cliente cuando el pago es rechazado */
async function sendOrderFailedEmail(config: any, order: any, payment: any) {
    const email = buildCustomerFailedEmail(order, payment.status_detail)

    await sendEmail(config, 'email de pago fallido', {
        to: order.customer_email,
        replyTo: config.mailToContact,
        ...email,
    })
}

/** Notificación interna a la ferretería */
async function sendAdminNotification(
    config: any,
    order: any,
    payment: any,
    orderStatus: 'paid' | 'failed' | 'pending'
) {
    const email = buildAdminEmail(order, payment, orderStatus)

    await sendEmail(config, 'notificación admin', {
        to: config.mailToContact,
        replyTo: order.customer_email ?? undefined,
        ...email,
    })
}