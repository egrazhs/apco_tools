import { Resend } from 'resend'

/**
 * Procesa el pago de una orden y envía correos
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

    const paymentStatusMap: Record<string, string> = {
        approved: 'paid',
        pending: 'pending',
        rejected: 'failed',
    }

    const orderStatus = paymentStatusMap[status] ?? 'pending'

    try {
        // 1️⃣ Actualizar orden en Supabase
        console.log('🔄 Actualizando orden en Supabase...')
        await supabase
            .from('orders')
            .update({
                payment_status: orderStatus,
                external_payment_id: String(payment.id),
                updated_at: new Date().toISOString(),
            })
            .eq('id', orderId)
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

        // 3️⃣ Enviar correos según el estado
        console.log(`📨 Enviando correos (estado: ${orderStatus})...`)
        if (orderStatus === 'paid') {
            await sendOrderConfirmedEmail(config, order, payment)
            console.log('✅ Email de confirmación enviado')
        } else if (orderStatus === 'failed') {
            await sendOrderFailedEmail(config, order, payment)
            console.log('✅ Email de fallo enviado')
        } else if (orderStatus === 'pending') {
            console.log('⏳ Pago pendiente, sin correo enviado aún')
        }

        // 4️⃣ Enviar notificación al admin
        console.log('📨 Enviando notificación al admin...')
        await sendAdminNotification(config, order, payment, orderStatus)
        console.log('✅ Notificación al admin enviada')

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
 * Envía email de confirmación al cliente cuando el pago es aprobado
 */
async function sendOrderConfirmedEmail(config: any, order: any, payment: any) {
    const resend = new Resend(config.resendApiKey)

    if (!config.resendApiKey) {
        console.error('❌ RESEND_API_KEY NO CONFIGURADA')
        throw new Error('Email service not configured')
    }

    const result = await resend.emails.send({
        from: config.mailFrom,
        to: order.customer_email,
        subject: `¡Tu orden #${order.id} ha sido confirmada! - APCO TOOLS`,
        html: emailClienteOrdenConfirmadaTemplate({
            nombreCliente: order.customer_name,
            numeroOrden: order.id,
            total: order.total_amount,
            fecha: order.created_at,
        }),
    })

    if (result.error) {
        console.error('❌ Error enviando email confirmado:', result.error)
        throw new Error(result.error.message)
    }

    console.log('✅ Email confirmado enviado:', result.data?.id)
}

/**
 * Envía email de fallo al cliente cuando el pago es rechazado
 */
async function sendOrderFailedEmail(config: any, order: any, payment: any) {
    const resend = new Resend(config.resendApiKey)

    if (!config.resendApiKey) {
        console.error('❌ RESEND_API_KEY NO CONFIGURADA')
        throw new Error('Email service not configured')
    }

    const result = await resend.emails.send({
        from: config.mailFrom,
        to: order.customer_email,
        subject: `Tu pago no pudo ser procesado - APCO TOOLS`,
        html: emailClienteOrdenFallidaTemplate({
            nombreCliente: order.customer_name,
            numeroOrden: order.id,
            razonFallo: payment.status_detail || 'Pago rechazado',
        }),
    })

    if (result.error) {
        console.error('❌ Error enviando email fallido:', result.error)
        throw new Error(result.error.message)
    }

    console.log('✅ Email fallido enviado:', result.data?.id)
}

/**
 * Envía notificación al admin sobre el pago
 */
async function sendAdminNotification(config: any, order: any, payment: any, orderStatus: string) {
    const resend = new Resend(config.resendApiKey)

    if (!config.resendApiKey) {
        console.error('❌ RESEND_API_KEY NO CONFIGURADA')
        throw new Error('Email service not configured')
    }

    const statusLabel = {
        paid: '✅ PAGADA',
        failed: '❌ RECHAZADA',
        pending: '⏳ PENDIENTE',
    }[orderStatus] || '❓ DESCONOCIDO'

    const result = await resend.emails.send({
        from: config.mailFrom,
        to: config.mailToContact,
        subject: `Nueva orden ${statusLabel}: ${order.customer_name}`,
        html: emailAdminNotificationTemplate({
            numeroOrden: order.id,
            nombreCliente: order.customer_name,
            emailCliente: order.customer_email,
            total: order.total_amount,
            estado: statusLabel,
            paymentId: payment.id,
            fecha: order.created_at,
        }),
    })

    if (result.error) {
        console.error('❌ Error enviando notificación admin:', result.error)
        throw new Error(result.error.message)
    }

    console.log('✅ Notificación admin enviada:', result.data?.id)
}

/**
 * Template: Email cliente - Orden Confirmada
 */
function emailClienteOrdenConfirmadaTemplate({
    nombreCliente,
    numeroOrden,
    total,
    fecha,
}: any) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
                .header { background: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: white; padding: 30px; }
                .order-info { background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #16a34a; }
                .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666; }
                .btn { display: inline-block; background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✅ ¡Tu orden ha sido confirmada!</h1>
                </div>
                <div class="content">
                    <p>Hola <strong>${nombreCliente}</strong>,</p>
                    
                    <p>Gracias por tu compra. Tu pago ha sido procesado exitosamente y tu orden está confirmada.</p>
                    
                    <div class="order-info">
                        <p><strong>📋 Número de orden:</strong> #${numeroOrden}</p>
                        <p><strong>💰 Total pagado:</strong> $${parseFloat(total).toFixed(2)}</p>
                        <p><strong>📅 Fecha:</strong> ${new Date(fecha).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    
                    <p>Pronto recibirás información sobre el envío de tu pedido. Si tienes alguna pregunta, no dudes en contactarnos:</p>
                    
                    <p>📞 Teléfono: (33) 2486 0054</p>
                    <p>📧 Email: HerramientasAltaCalidad@hotmail.com</p>
                    
                    <p>Saludos cordiales,<br><strong>APCO Tools</strong></p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 APCO Tools. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
    </html>
    `
}

/**
 * Template: Email cliente - Orden Fallida
 */
function emailClienteOrdenFallidaTemplate({
    nombreCliente,
    numeroOrden,
    razonFallo,
}: any) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
                .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: white; padding: 30px; }
                .alert-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>❌ No pudimos procesar tu pago</h1>
                </div>
                <div class="content">
                    <p>Hola <strong>${nombreCliente}</strong>,</p>
                    
                    <div class="alert-box">
                        <p><strong>⚠️ Tu pago fue rechazado</strong></p>
                        <p>Razón: ${razonFallo}</p>
                        <p>Número de orden: #${numeroOrden}</p>
                    </div>
                    
                    <p>Por favor, intenta nuevamente con otro método de pago o contáctanos para más información.</p>
                    
                    <p><strong>¿Necesitas ayuda?</strong></p>
                    <p>📞 Teléfono: (33) 2486 0054</p>
                    <p>📧 Email: HerramientasAltaCalidad@hotmail.com</p>
                    
                    <p>Saludos cordiales,<br><strong>APCO Tools</strong></p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 APCO Tools. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
    </html>
    `
}

/**
 * Template: Notificación Admin
 */
function emailAdminNotificationTemplate({
    numeroOrden,
    nombreCliente,
    emailCliente,
    total,
    estado,
    paymentId,
    fecha,
}: any) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
                .field { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb; }
                .field-label { font-weight: bold; color: #dc2626; }
                .status-badge { display: inline-block; padding: 8px 12px; border-radius: 5px; font-weight: bold; }
                .status-paid { background: #dcfce7; color: #15803d; }
                .status-failed { background: #fee2e2; color: #991b1b; }
                .status-pending { background: #fef3c7; color: #92400e; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>🛒 Nueva orden recibida</h2>
                </div>
                <div class="content">
                    <div class="field">
                        <span class="field-label">Estado:</span>
                        <p>
                            <span class="status-badge ${estado.includes('PAGADA') ? 'status-paid' : estado.includes('RECHAZADA') ? 'status-failed' : 'status-pending'}">
                                ${estado}
                            </span>
                        </p>
                    </div>

                    <div class="field">
                        <span class="field-label">Orden ID:</span>
                        <p>#${numeroOrden}</p>
                    </div>
                    
                    <div class="field">
                        <span class="field-label">Cliente:</span>
                        <p>${nombreCliente}</p>
                    </div>

                    <div class="field">
                        <span class="field-label">Email:</span>
                        <p><a href="mailto:${emailCliente}">${emailCliente}</a></p>
                    </div>
                    
                    <div class="field">
                        <span class="field-label">Total:</span>
                        <p><strong>$${parseFloat(total).toFixed(2)}</strong></p>
                    </div>

                    <div class="field">
                        <span class="field-label">Payment ID (MP):</span>
                        <p>${paymentId}</p>
                    </div>
                    
                    <p style="margin-top: 30px; color: #666; font-size: 12px;">
                        ⏰ ${new Date(fecha).toLocaleString('es-MX')}
                    </p>
                </div>
            </div>
        </body>
    </html>
    `
}