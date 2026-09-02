import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    
    if (!config.resendApiKey) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Email service not configured',
        })
    }

    const resend = new Resend(config.resendApiKey)
    const body = await readBody(event)

    const { nombre, email, asunto, mensaje } = body

    if (!nombre || !email || !mensaje) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Faltan campos requeridos',
        })
    }

    try {
        // Email al cliente (confirmación)
        await resend.emails.send({
            from: config.mailFrom,
            to: email,
            subject: `Confirmación de tu mensaje - ${asunto}`,
            html: emailClienteContactoTemplate({
                nombre,
                asunto,
            }),
        })

        // Email al administrador
        await resend.emails.send({
            from: config.mailFrom,
            to: config.mailToContact,
            subject: `Nuevo mensaje de contacto: ${asunto}`,
            html: emailAdminContactoTemplate({
                nombre,
                email,
                asunto,
                mensaje,
            }),
        })

        return {
            success: true,
            message: 'Mensaje enviado correctamente',
        }
    } catch (error) {
        console.error('Error al enviar email de contacto:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al enviar el mensaje',
        })
    }
})

function emailClienteContactoTemplate({ nombre, asunto }: any) {
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
                .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Recibimos tu mensaje</h1>
                </div>
                <div class="content">
                    <p>Hola <strong>${nombre}</strong>,</p>
                    
                    <p>Gracias por contactarnos. Recibimos tu mensaje correctamente y te responderemos lo antes posible.</p>
                    
                    <p><strong>Asunto:</strong> ${asunto}</p>
                    
                    <p>Si tienes urgencia, puedes llamarnos directamente:</p>
                    <p>📞 +52 33 2486 0054</p>
                    
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

function emailAdminContactoTemplate({ nombre, email, asunto, mensaje }: any) {
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
                .field { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb; }
                .field-label { font-weight: bold; color: #dc2626; }
                .message-box { background: #f3f4f6; padding: 15px; border-left: 4px solid #dc2626; white-space: pre-wrap; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>📧 Nuevo Mensaje de Contacto</h2>
                </div>
                <div class="content">
                    <div class="field">
                        <span class="field-label">De:</span>
                        <p>${nombre} &lt;<a href="mailto:${email}">${email}</a>&gt;</p>
                    </div>
                    
                    <div class="field">
                        <span class="field-label">Asunto:</span>
                        <p>${asunto}</p>
                    </div>
                    
                    <div class="field">
                        <span class="field-label">Mensaje:</span>
                        <div class="message-box">${mensaje}</div>
                    </div>
                    
                    <p style="margin-top: 30px; color: #666; font-size: 12px;">
                        ⏰ Recibido: ${new Date().toLocaleString('es-MX')}
                    </p>
                </div>
            </div>
        </body>
    </html>
    `
}
