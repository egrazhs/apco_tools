// Base wrapper para todos los correos
function baseTemplate(content: string): string {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8" />
        <style>
            body { font-family: Georgia, serif; background: #f5f5f4; margin: 0; padding: 0; }
            .wrapper { max-width: 600px; margin: 32px auto; background: #fff; border-top: 4px solid #dc2626; }
            .header { padding: 24px 32px; border-bottom: 1px solid #e7e5e4; }
            .header img { height: 40px; }
            .body { padding: 32px; color: #1c1917; line-height: 1.7; }
            .footer { padding: 16px 32px; background: #44403c; color: #a8a29e; font-size: 12px; }
            .footer a { color: #a8a29e; }
            .btn { display: inline-block; background: #dc2626; color: #fff !important;
                   padding: 12px 24px; text-decoration: none; font-size: 14px;
                   margin: 16px 0; }
            .table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            .table th { background: #f5f5f4; text-align: left; padding: 8px 12px;
                        font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
            .table td { padding: 10px 12px; border-bottom: 1px solid #f5f5f4; }
            .total-row td { font-weight: bold; border-top: 2px solid #1c1917; }
            h2 { font-size: 24px; margin: 0 0 16px; }
            p { margin: 0 0 12px; }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="header">
                <!-- Reemplaza con tu logo real cuando esté disponible -->
                <strong style="font-size: 20px; color: #dc2626;">APCO Tools</strong>
            </div>
            <div class="body">
                ${content}
            </div>
            <div class="footer">
                <p>APCO Tools &mdash; Herramientas y Suministros SA de CV</p>
                <p>Av. La Paz 1181 Col. Centro, Guadalajara, Jalisco</p>
                <p>
                    <a href="tel:3336672206">(33) 3667 2206</a> &nbsp;|&nbsp;
                    <a href="mailto:ventas@apcotools.com.mx">ventas@apcotools.com.mx</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `
}

// ─── Contacto ────────────────────────────────────────────────
export function contactFormTemplate(data: {
    nombre: string
    email: string
    asunto: string
    mensaje: string
}) {
    return baseTemplate(`
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>De:</strong> ${data.nombre} &lt;${data.email}&gt;</p>
        <p><strong>Asunto:</strong> ${data.asunto || '(sin asunto)'}</p>
        <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 16px 0;" />
        <p>${data.mensaje.replace(/\n/g, '<br/>')}</p>
    `)
}

// Confirmación al usuario que llenó el formulario
export function contactConfirmTemplate(nombre: string) {
    return baseTemplate(`
        <h2>Recibimos tu mensaje, ${nombre}</h2>
        <p>Gracias por contactarnos. Un asesor de APCO Tools se pondrá en contacto contigo a la brevedad.</p>
        <p>Si tienes una urgencia, puedes llamarnos directamente:</p>
        <p>
            <strong>(33) 3667 2206</strong> &nbsp;|&nbsp;
            <strong>(33) 2486 0054</strong>
        </p>
    `)
}

// ─── Órdenes ─────────────────────────────────────────────────
interface OrderEmailData {
    orderNumber: string
    customerName: string
    items: { nombre: string; quantity: number; unit_price: number; subtotal: number }[]
    subtotal: number
    shipping: number
    tax: number
    total: number
    address: string
}

function formatMXN(amount: number) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}

export function orderConfirmationTemplate(order: OrderEmailData) {
    const itemRows = order.items.map(item => `
        <tr>
            <td>${item.nombre}</td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="text-align:right;">${formatMXN(item.unit_price)}</td>
            <td style="text-align:right;">${formatMXN(item.subtotal)}</td>
        </tr>
    `).join('')

    return baseTemplate(`
        <h2>¡Gracias por tu compra, ${order.customerName}!</h2>
        <p>Tu pedido <strong>#${order.orderNumber}</strong> ha sido confirmado y está siendo procesado.</p>

        <table class="table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th style="text-align:center;">Cant.</th>
                    <th style="text-align:right;">Precio unit.</th>
                    <th style="text-align:right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${itemRows}
                <tr><td colspan="3" style="text-align:right; padding-top:8px;">Subtotal</td><td style="text-align:right;">${formatMXN(order.subtotal)}</td></tr>
                <tr><td colspan="3" style="text-align:right;">Envío</td><td style="text-align:right;">${formatMXN(order.shipping)}</td></tr>
                <tr><td colspan="3" style="text-align:right;">IVA</td><td style="text-align:right;">${formatMXN(order.tax)}</td></tr>
                <tr class="total-row"><td colspan="3" style="text-align:right;">Total</td><td style="text-align:right;">${formatMXN(order.total)}</td></tr>
            </tbody>
        </table>

        <p><strong>Dirección de entrega:</strong><br/>${order.address}</p>

        <a href="https://apcotools.com.mx/mi-cuenta" class="btn">Ver mi pedido</a>

        <p style="font-size:13px; color:#78716c;">
            Si tienes alguna duda sobre tu pedido, responde este correo o llámanos al (33) 3667 2206.
        </p>
    `)
}

export function orderFailedTemplate(customerName: string, orderNumber: string) {
    return baseTemplate(`
        <h2>Hubo un problema con tu pago</h2>
        <p>Hola ${customerName}, lamentablemente el pago para tu pedido <strong>#${orderNumber}</strong> no pudo procesarse.</p>
        <p>Tu carrito sigue guardado. Puedes intentarlo nuevamente:</p>
        <a href="https://apcotools.com.mx/checkout" class="btn">Reintentar pago</a>
        <p style="font-size:13px; color:#78716c; margin-top:16px;">
            Si el problema persiste, contáctanos al (33) 3667 2206 y te ayudamos a completar tu compra.
        </p>
    `)
}

export function orderCancelledTemplate(customerName: string, orderNumber: string) {
    return baseTemplate(`
        <h2>Tu pedido fue cancelado</h2>
        <p>Hola ${customerName}, tu pedido <strong>#${orderNumber}</strong> ha sido cancelado.</p>
        <p>Si esto fue un error o tienes preguntas, por favor contáctanos:</p>
        <p><strong>(33) 3667 2206</strong> &nbsp;|&nbsp; ventas@apcotools.com.mx</p>
    `)
}