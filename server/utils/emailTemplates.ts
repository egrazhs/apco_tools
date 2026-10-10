/**
 * Plantillas de correo de APCO Tools.
 * - Estilos en línea y layout con tablas (compatible con Hotmail/Outlook/Gmail)
 * - Cada builder devuelve { subject, html, text }
 */

const BRAND = {
    name: 'APCO Tools',
    red: '#dc2626',
    slate: '#334155',
    text: '#1f2937',
    muted: '#6b7280',
    border: '#e5e7eb',
    soft: '#f3f4f6',
    logoUrl: 'https://apcotools.com/img/logo_apco_tools.jpg',
    email: 'HerramientasAltaCalidad@hotmail.com',
    phones: ['(33) 3667 2206', '(33) 1699 1475', '(33) 2486 0054'],
    address: 'Av. La Paz 1181, Col. Centro, CP 44100, Guadalajara, Jalisco',
    whatsapp: '523324860054',
}

const TIMEZONE = 'America/Mexico_City'

const FAILURE_REASONS: Record<string, string> = {
    cc_rejected_insufficient_amount: 'Fondos insuficientes',
    cc_rejected_bad_filled_security_code: 'Código de seguridad incorrecto',
    cc_rejected_bad_filled_date: 'Fecha de vencimiento incorrecta',
    cc_rejected_bad_filled_other: 'Datos de la tarjeta incorrectos',
    cc_rejected_call_for_authorize: 'Debes autorizar el pago con tu banco',
    cc_rejected_high_risk: 'Pago rechazado por seguridad',
    cc_rejected_other_reason: 'La tarjeta rechazó el pago',
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function esc(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function money(value: unknown): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(value) || 0)
}

function dateLong(value: string): string {
    return new Date(value).toLocaleDateString('es-MX', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function dateTime(value: string): string {
    return new Date(value).toLocaleString('es-MX', { timeZone: TIMEZONE })
}

/** Folio corto: usa order_number y, si no existe, los primeros 8 caracteres del UUID */
export function orderFolio(order: any): string {
    if (order.order_number) return `#${order.order_number}`
    return `#${String(order.id).slice(0, 8).toUpperCase()}`
}

function whatsappUrl(phone: string | null | undefined, text?: string): string {
    const digits = String(phone ?? BRAND.whatsapp).replace(/\D/g, '')
    const full = digits.length === 10 ? `52${digits}` : digits
    const query = text ? `?text=${encodeURIComponent(text)}` : ''
    return `https://wa.me/${full}${query}`
}

function failureReason(code?: string): string {
    return (code && FAILURE_REASONS[code]) || 'Pago rechazado'
}

function addressLines(address: any): string[] {
    if (!address) return []

    const street = [
        address.street,
        address.ext_number ? `#${address.ext_number}` : '',
        address.int_number ? `Int. ${address.int_number}` : '',
    ].filter(Boolean).join(' ')

    const cityLine = [address.city, address.state].filter(Boolean).join(', ')
    const zip = address.zip_code ? `CP ${address.zip_code}` : ''

    return [
        address.recipient_name,
        street,
        address.neighborhood ? `Col. ${address.neighborhood}` : '',
        [cityLine, zip].filter(Boolean).join(' · '),
        address.country,
    ].filter(Boolean)
}

// ─────────────────────────────────────────────────────────────
// Bloques HTML reutilizables
// ─────────────────────────────────────────────────────────────

function sectionTitle(text: string): string {
    return `<p style="margin:24px 0 8px;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${BRAND.red};">${esc(text)}</p>`
}

function button(label: string, href: string): string {
    return `
        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:24px auto 0;">
            <tr>
                <td style="background:${BRAND.red};border-radius:6px;">
                    <a href="${esc(href)}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">${esc(label)}</a>
                </td>
            </tr>
        </table>`
}

function infoBox(rows: Array<[string, string]>): string {
    const lines = rows.map(([label, value]) => `
        <tr>
            <td style="padding:4px 0;font-size:14px;color:${BRAND.muted};">${esc(label)}</td>
            <td align="right" style="padding:4px 0;font-size:14px;font-weight:bold;color:${BRAND.text};">${value}</td>
        </tr>`).join('')

    return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;background:${BRAND.soft};border-left:4px solid ${BRAND.red};border-radius:4px;">
            <tr><td style="padding:12px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${lines}</table>
            </td></tr>
        </table>`
}

function itemsTable(items: any[]): string {
    if (!items?.length) return ''

    const rows = items.map((item) => {
        const product = item.products ?? {}
        const meta = [product.code, product.model].filter(Boolean).join(' · ')

        return `
            <tr>
                <td style="padding:10px 8px;border-bottom:1px solid ${BRAND.border};font-size:14px;color:${BRAND.text};">
                    <strong>${esc(product.name ?? 'Producto')}</strong>
                    ${meta ? `<br><span style="font-size:12px;color:${BRAND.muted};">${esc(meta)}</span>` : ''}
                </td>
                <td align="center" style="padding:10px 8px;border-bottom:1px solid ${BRAND.border};font-size:14px;color:${BRAND.text};">${esc(item.quantity)}</td>
                <td align="right" style="padding:10px 8px;border-bottom:1px solid ${BRAND.border};font-size:14px;color:${BRAND.text};white-space:nowrap;">${money(item.unit_price)}</td>
                <td align="right" style="padding:10px 8px;border-bottom:1px solid ${BRAND.border};font-size:14px;color:${BRAND.text};white-space:nowrap;"><strong>${money(item.subtotal)}</strong></td>
            </tr>`
    }).join('')

    const headerCell = (label: string, align: string) =>
        `<th align="${align}" style="padding:8px;background:${BRAND.soft};font-size:12px;text-transform:uppercase;color:${BRAND.muted};">${label}</th>`

    return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
                ${headerCell('Producto', 'left')}
                ${headerCell('Cant.', 'center')}
                ${headerCell('Precio', 'right')}
                ${headerCell('Importe', 'right')}
            </tr>
            ${rows}
        </table>`
}

function totalsTable(order: any, totalLabel: string): string {
    const row = (label: string, value: string, strong = false) => `
        <tr>
            <td align="right" style="padding:4px 8px;font-size:${strong ? '16px' : '14px'};color:${strong ? BRAND.text : BRAND.muted};${strong ? 'font-weight:bold;' : ''}">${esc(label)}</td>
            <td align="right" style="padding:4px 8px;width:120px;font-size:${strong ? '16px' : '14px'};color:${BRAND.text};${strong ? 'font-weight:bold;' : ''}white-space:nowrap;">${value}</td>
        </tr>`

    const rows = [
        row('Subtotal', money(order.subtotal)),
        Number(order.shipping_cost) > 0 ? row('Envío', money(order.shipping_cost)) : '',
        Number(order.tax) > 0 ? row('Impuestos', money(order.tax)) : '',
        row(totalLabel, money(order.total), true),
    ].join('')

    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">${rows}</table>`
}

function addressBlock(address: any): string {
    const lines = addressLines(address)
    if (!lines.length) return ''

    return `
        ${sectionTitle('Dirección de envío')}
        <p style="margin:0;font-size:14px;line-height:1.6;color:${BRAND.text};">${lines.map(esc).join('<br>')}</p>`
}

function layout({ title, preheader, content }: { title: string; preheader: string; content: string }): string {
    const phones = BRAND.phones.map(esc).join(' &nbsp;|&nbsp; ')

    return `<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${esc(title)}</title>
    </head>
    <body style="margin:0;padding:0;background:${BRAND.soft};font-family:Arial,Helvetica,sans-serif;color:${BRAND.text};">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.soft};">
            <tr>
                <td align="center" style="padding:24px 12px;">
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">

                        <tr>
                            <td align="center" style="padding:20px;background:#ffffff;">
                                <img src="${BRAND.logoUrl}" alt="${BRAND.name}" width="180" style="display:block;width:180px;max-width:100%;height:auto;border:0;">
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="background:${BRAND.red};color:#ffffff;padding:18px 24px;font-size:22px;font-weight:bold;">
                                ${esc(title)}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:28px 24px;font-size:15px;line-height:1.6;">
                                ${content}
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="background:${BRAND.slate};padding:24px;color:#cbd5e1;font-size:13px;line-height:1.7;">
                                <strong style="color:#ffffff;font-size:15px;">Herramientas y Suministros</strong><br>
                                ${esc(BRAND.address)}<br>
                                ${phones}<br>
                                <a href="mailto:${BRAND.email}" style="color:#ffffff;text-decoration:underline;">${BRAND.email}</a><br>
                                <a href="${whatsappUrl(null)}" style="color:#ffffff;text-decoration:underline;">Escríbenos por WhatsApp</a>
                                <br><br>
                                <span style="font-size:12px;color:#94a3b8;">&copy; ${new Date().getFullYear()} ${BRAND.name}. Todos los derechos reservados.</span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>`
}

// ─────────────────────────────────────────────────────────────
// Texto plano (mejora la entrega y es el respaldo del HTML)
// ─────────────────────────────────────────────────────────────

function itemsText(items: any[]): string {
    return (items ?? []).map((item) => {
        const name = item.products?.name ?? 'Producto'
        return `- ${name} x${item.quantity}  ${money(item.unit_price)} c/u = ${money(item.subtotal)}`
    }).join('\n')
}

function totalsText(order: any, totalLabel: string): string {
    return [
        `Subtotal: ${money(order.subtotal)}`,
        Number(order.shipping_cost) > 0 ? `Envío: ${money(order.shipping_cost)}` : '',
        Number(order.tax) > 0 ? `Impuestos: ${money(order.tax)}` : '',
        `${totalLabel}: ${money(order.total)}`,
    ].filter(Boolean).join('\n')
}

function footerText(): string {
    return [
        '--',
        'Herramientas y Suministros - APCO Tools',
        BRAND.address,
        BRAND.phones.join(' | '),
        BRAND.email,
        `WhatsApp: ${whatsappUrl(null)}`,
    ].join('\n')
}

// ─────────────────────────────────────────────────────────────
// Builders públicos
// ─────────────────────────────────────────────────────────────

/** Correo al cliente: pago aprobado */
export function buildCustomerConfirmedEmail(order: any) {
    const folio = orderFolio(order)
    const subject = `Pedido ${folio} confirmado - ${BRAND.name}`

    const content = `
        <p style="margin:0 0 12px;">Hola <strong>${esc(order.customer_name)}</strong>,</p>
        <p style="margin:0;">Gracias por tu compra. Tu pago fue procesado correctamente y tu pedido está confirmado.</p>

        ${infoBox([
            ['Pedido', esc(folio)],
            ['Fecha', esc(dateLong(order.created_at))],
        ])}

        ${sectionTitle('Tu pedido')}
        ${itemsTable(order.items)}
        ${totalsTable(order, 'Total pagado')}
        ${addressBlock(order.address)}

        <p style="margin:24px 0 0;">Pronto recibirás información sobre el envío. Si tienes alguna duda, escríbenos y con gusto te ayudamos.</p>
        ${button('Contactar por WhatsApp', whatsappUrl(null, `Hola, tengo una consulta sobre mi pedido ${folio}`))}
    `

    const text = [
        `Hola ${order.customer_name},`,
        '',
        'Gracias por tu compra. Tu pago fue procesado correctamente y tu pedido está confirmado.',
        '',
        `Pedido: ${folio}`,
        `Fecha: ${dateLong(order.created_at)}`,
        '',
        itemsText(order.items),
        '',
        totalsText(order, 'Total pagado'),
        '',
        addressLines(order.address).length ? `Envío a:\n${addressLines(order.address).join('\n')}\n` : '',
        'Pronto recibirás información sobre el envío.',
        '',
        footerText(),
    ].join('\n')

    return {
        subject,
        html: layout({ title: '¡Pedido confirmado!', preheader: `Tu pedido ${folio} fue confirmado. Total: ${money(order.total)}`, content }),
        text,
    }
}

/** Correo al cliente: pago rechazado */
export function buildCustomerFailedEmail(order: any, statusDetail?: string) {
    const folio = orderFolio(order)
    const reason = failureReason(statusDetail)
    const subject = `No pudimos procesar el pago de tu pedido ${folio} - ${BRAND.name}`

    const content = `
        <p style="margin:0 0 12px;">Hola <strong>${esc(order.customer_name)}</strong>,</p>
        <p style="margin:0;">No pudimos procesar el pago de tu pedido.</p>

        ${infoBox([
            ['Pedido', esc(folio)],
            ['Motivo', esc(reason)],
            ['Total', esc(money(order.total))],
        ])}

        <p style="margin:0;">Puedes intentarlo de nuevo con otro método de pago, o escribirnos y te ayudamos a completar tu compra.</p>
        ${button('Contactar por WhatsApp', whatsappUrl(null, `Hola, no pude completar el pago de mi pedido ${folio}`))}
    `

    const text = [
        `Hola ${order.customer_name},`,
        '',
        'No pudimos procesar el pago de tu pedido.',
        '',
        `Pedido: ${folio}`,
        `Motivo: ${reason}`,
        `Total: ${money(order.total)}`,
        '',
        'Puedes intentarlo de nuevo con otro método de pago, o escribirnos y te ayudamos.',
        '',
        footerText(),
    ].join('\n')

    return {
        subject,
        html: layout({ title: 'No pudimos procesar tu pago', preheader: `El pago de tu pedido ${folio} no se completó.`, content }),
        text,
    }
}

/** Aviso interno a la ferretería */
export function buildAdminEmail(order: any, payment: any, orderStatus: 'paid' | 'failed' | 'pending') {
    const folio = orderFolio(order)

    const labels = {
        paid: { text: 'PAGADA', icon: '✅', bg: '#dcfce7', color: '#15803d' },
        failed: { text: 'RECHAZADA', icon: '❌', bg: '#fee2e2', color: '#991b1b' },
        pending: { text: 'PENDIENTE', icon: '⏳', bg: '#fef3c7', color: '#92400e' },
    }
    const label = labels[orderStatus] ?? labels.pending

    const subject = `${label.icon} Nueva orden ${label.text} ${folio} - ${order.customer_name}`
    const phone = order.address?.phone

    const contactButton = phone
        ? button('Escribir al cliente por WhatsApp', whatsappUrl(phone, `Hola ${order.customer_name}, te escribimos de ${BRAND.name} sobre tu pedido ${folio}.`))
        : ''

    const notes = order.notes
        ? `${sectionTitle('Notas del cliente')}<p style="margin:0;font-size:14px;">${esc(order.notes)}</p>`
        : ''

    const content = `
        <p style="margin:0 0 8px;">
            <span style="display:inline-block;padding:6px 12px;border-radius:4px;background:${label.bg};color:${label.color};font-weight:bold;">${label.icon} ${label.text}</span>
        </p>

        ${infoBox([
            ['Pedido', esc(folio)],
            ['Fecha', esc(dateTime(order.created_at))],
            ['Payment ID (MP)', esc(payment.id)],
        ])}
        <p style="margin:0;font-size:11px;color:${BRAND.muted};">ID interno: ${esc(order.id)}</p>

        ${sectionTitle('Cliente')}
        <p style="margin:0;font-size:14px;line-height:1.6;">
            <strong>${esc(order.customer_name)}</strong><br>
            <a href="mailto:${esc(order.customer_email)}" style="color:${BRAND.red};">${esc(order.customer_email)}</a>
            ${phone ? `<br>Tel: ${esc(phone)}` : ''}
        </p>

        ${sectionTitle('Productos')}
        ${itemsTable(order.items)}
        ${totalsTable(order, 'Total')}
        ${addressBlock(order.address)}
        ${notes}
        ${contactButton}
    `

    const text = [
        `Nueva orden ${label.text} ${folio}`,
        '',
        `Cliente: ${order.customer_name}`,
        `Correo: ${order.customer_email}`,
        phone ? `Teléfono: ${phone}` : '',
        `Fecha: ${dateTime(order.created_at)}`,
        `Payment ID (MP): ${payment.id}`,
        `ID interno: ${order.id}`,
        '',
        itemsText(order.items),
        '',
        totalsText(order, 'Total'),
        '',
        addressLines(order.address).length ? `Envío a:\n${addressLines(order.address).join('\n')}` : '',
        order.notes ? `\nNotas: ${order.notes}` : '',
    ].filter((line) => line !== undefined).join('\n')

    return {
        subject,
        html: layout({ title: 'Nueva orden recibida', preheader: `${label.text} · ${folio} · ${order.customer_name} · ${money(order.total)}`, content }),
        text,
    }
}