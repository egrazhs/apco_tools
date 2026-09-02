import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
    console.log('═══════════════════════════════════════')
    console.log('📧 CONTACT ENDPOINT INICIADO')
    console.log('═══════════════════════════════════════')

    const config = useRuntimeConfig()
    
    console.log('🔍 CONFIG DISPONIBLE:')
    console.log('   resendApiKey:', config.resendApiKey ? '✅ EXISTE' : '❌ NO EXISTE')
    console.log('   mailFrom:', config.mailFrom || '❌ NO EXISTE')
    console.log('   mailToContact:', config.mailToContact || '❌ NO EXISTE')

    if (!config.resendApiKey) {
        console.error('❌ RESEND_API_KEY NO CONFIGURADA')
        throw createError({
            statusCode: 500,
            statusMessage: 'Email service not configured',
        })
    }

    console.log('✅ Variables configuradas correctamente')

    const body = await readBody(event)
    console.log('📥 Body recibido:', { nombre: body.nombre, email: body.email, asunto: body.asunto })

    const { nombre, email, asunto, mensaje } = body

    if (!nombre || !email || !mensaje) {
        console.error('❌ Faltan campos requeridos')
        throw createError({
            statusCode: 400,
            statusMessage: 'Faltan campos requeridos',
        })
    }

    try {
        console.log('🚀 Inicializando Resend...')
        const resend = new Resend(config.resendApiKey)
        console.log('✅ Resend inicializado')

        console.log('📨 Enviando email al cliente:', email)
        const clientResult = await resend.emails.send({
            from: config.mailFrom,
            to: email,
            subject: `Confirmación de tu mensaje - ${asunto || 'Contacto APCO TOOLS'}`,
            html: emailClienteContactoTemplate({ nombre, asunto }),
        })
        
        if (clientResult.error) {
            console.error('❌ Error enviando email cliente:', clientResult.error)
            throw new Error(clientResult.error.message)
        }
        console.log('✅ Email cliente enviado:', clientResult.data?.id)

        console.log('📨 Enviando email al admin:', config.mailToContact)
        const adminResult = await resend.emails.send({
            from: config.mailFrom,
            to: config.mailToContact,
            subject: `Nuevo mensaje de contacto: ${asunto || nombre}`,
            html: emailAdminContactoTemplate({ nombre, email, asunto, mensaje }),
        })
        
        if (adminResult.error) {
            console.error('❌ Error enviando email admin:', adminResult.error)
            throw new Error(adminResult.error.message)
        }
        console.log('✅ Email admin enviado:', adminResult.data?.id)

        return {
            success: true,
            message: 'Mensaje enviado correctamente',
        }
    } catch (error: any) {
        console.error('❌ ERROR AL ENVIAR:')
        console.error('   Tipo:', error.constructor.name)
        console.error('   Mensaje:', error.message)
        console.error('   Stack:', error.stack)
        
        throw createError({
            statusCode: 500,
            statusMessage: `Error al enviar el mensaje: ${error.message}`,
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
                    
                    ${asunto ? `<p><strong>Asunto:</strong> ${asunto}</p>` : ''}
                    
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
                    
                    ${asunto ? `<div class="field">
                        <span class="field-label">Asunto:</span>
                        <p>${asunto}</p>
                    </div>` : ''}
                    
                    <div class="field">
                        <span class="field-label">Mensaje:</span>
                        <div class="message-box">${mensaje.replace(/\n/g, '<br>')}</div>
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