import { Resend } from 'resend'
import { useRuntimeConfig } from '#imports'

export function useMailer() {
    const config = useRuntimeConfig()
    const resend = new Resend(config.resendApiKey)

    async function send({
        to,
        subject,
        html,
        replyTo,
    }: {
        to: string | string[]
        subject: string
        html: string
        replyTo?: string
    }) {
        const { data, error } = await resend.emails.send({
            from: `APCO Tools <${config.mailFrom}>`,
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
            replyTo,
        })

        if (error) {
            console.error('[mailer] Error enviando email:', error)
            throw error
        }

        return data
    }

    return { send }
}