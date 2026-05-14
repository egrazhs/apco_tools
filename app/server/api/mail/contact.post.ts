import { useMailer } from '~/server/utils/mailer'
import { contactFormTemplate, contactConfirmTemplate } from '~/server/utils/emailTemplates'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)

    const { nombre, email, asunto, mensaje } = body

    if (!nombre || !email || !mensaje) {
        throw createError({ statusCode: 400, statusMessage: 'Campos requeridos faltantes' })
    }

    const { send } = useMailer()

    // 1. Notificar al equipo APCO
    await send({
        to: config.mailToContact,
        subject: `Nuevo contacto: ${asunto || nombre}`,
        html: contactFormTemplate({ nombre, email, asunto, mensaje }),
        replyTo: email,
    })

    // 2. Confirmar recepción al usuario
    await send({
        to: email,
        subject: 'Recibimos tu mensaje — APCO Tools',
        html: contactConfirmTemplate(nombre),
    })

    return { ok: true }
})