import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
    console.log('═══════════════════════════════════════')
    console.log('📧 COTIZACION ENDPOINT INICIADO')
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
    console.log('📥 Body recibido:', { nombre: body.nombre, email: body.email })

    const { nombre, email, telefono, empresa, mensaje } = body

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
            subject: 'Confirmación de tu solicitud de cotización - APCO TOOLS',
            html: emailClienteTemplate({ nombre, empresa }),
        })
        
        // ← AGREGAR ESTAS LÍNEAS:
        if (clientResult.error) {
            console.error('❌ Error enviando email cliente:', clientResult.error)
            throw new Error(clientResult.error.message)
        }
        console.log('✅ Email cliente enviado:', clientResult.data?.id)

        console.log('📨 Enviando email al admin:', config.mailToContact)
        const adminResult = await resend.emails.send({
            from: config.mailFrom,
            to: config.mailToContact,
            subject: `Nueva solicitud de cotización de ${nombre}`,
            html: emailAdminTemplate({ nombre, empresa, email, telefono, mensaje }),
        })
        
        // ← AGREGAR ESTAS LÍNEAS:
        if (adminResult.error) {
            console.error('❌ Error enviando email admin:', adminResult.error)
            throw new Error(adminResult.error.message)
        }
        console.log('✅ Email admin enviado:', adminResult.data?.id)

        return {
            success: true,
            message: 'Solicitud enviada correctamente',
        }
    } catch (error: any) {
        console.error('❌ ERROR AL ENVIAR:')
        console.error('   Tipo:', error.constructor.name)
        console.error('   Mensaje:', error.message)
        console.error('   Stack:', error.stack)
        
        throw createError({
            statusCode: 500,
            statusMessage: `Error al enviar la solicitud: ${error.message}`,
        })
    }
})

function emailClienteTemplate({ nombre, empresa }: any) {
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
                    <h1>¡Gracias por tu solicitud!</h1>
                </div>
                <div class="content">
                    <p>Hola <strong>${nombre}</strong>,</p>
                    <p>Recibimos tu solicitud de cotización exitosamente. Nuestro equipo de asesores revisará tu solicitud en el próximo día hábil.</p>
                    ${empresa ? `<p><strong>Empresa:</strong> ${empresa}</p>` : ''}
                    <p>Te contactaremos lo antes posible a través de tu correo electrónico o por teléfono con una propuesta personalizada.</p>
                    <p><strong>¿Necesitas respuesta urgente?</strong></p>
                    <p>📞 +52 33 2486 0054</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 APCO Tools</p>
                </div>
            </div>
        </body>
    </html>
    `
}

function emailAdminTemplate({ nombre, empresa, email, telefono, mensaje }: any) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
                .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
                .field { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb; }
                .field-label { font-weight: bold; color: #dc2626; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>📋 Nueva Solicitud de Cotización</h2>
                </div>
                <div class="content">
                    <div class="field">
                        <span class="field-label">Nombre:</span>
                        <p>${nombre}</p>
                    </div>
                    ${empresa ? `<div class="field"><span class="field-label">Empresa:</span><p>${empresa}</p></div>` : ''}
                    <div class="field">
                        <span class="field-label">Email:</span>
                        <p><a href="mailto:${email}">${email}</a></p>
                    </div>
                    <div class="field">
                        <span class="field-label">Teléfono:</span>
                        <p>${telefono}</p>
                    </div>
                    <div class="field">
                        <span class="field-label">Mensaje:</span>
                        <p>${mensaje.replace(/\n/g, '<br>')}</p>
                    </div>
                    <p style="margin-top: 30px; color: #666; font-size: 12px;">⏰ ${new Date().toLocaleString('es-MX')}</p>
                </div>
            </div>
        </body>
    </html>
    `
}