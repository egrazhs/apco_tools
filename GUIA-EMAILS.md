# 📧 Guía: Agregar Envío de Emails a Cualquier Formulario

## Resumen de la arquitectura

```
Tu Componente (Contacto, Cotización, Newsletter, etc.)
    ↓
useEmailService() composable
    ↓
$fetch('/api/tu-endpoint') 
    ↓
/server/api/tu-endpoint.post.ts
    ↓
Resend SDK
    ↓
Emails enviados ✓
```

---

## Pasos para agregar emails a un nuevo formulario

### 1️⃣ Crear el endpoint del servidor

En `/server/api/mi-formulario.post.ts`:

```typescript
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

    const { nombre, email, mensaje } = body

    // Validar campos requeridos
    if (!nombre || !email || !mensaje) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Faltan campos requeridos',
        })
    }

    try {
        // Email al cliente
        await resend.emails.send({
            from: config.mailFrom,
            to: email,
            subject: 'Confirmación de tu solicitud',
            html: `<h1>Gracias ${nombre}</h1><p>Recibimos tu solicitud.</p>`,
        })

        // Email al admin
        await resend.emails.send({
            from: config.mailFrom,
            to: config.mailToContact,
            subject: `Nueva solicitud de ${nombre}`,
            html: `<p>Email: ${email}</p><p>Mensaje: ${mensaje}</p>`,
        })

        return {
            success: true,
            message: 'Mensaje enviado',
        }
    } catch (error) {
        console.error('Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al enviar',
        })
    }
})
```

### 2️⃣ En tu componente/página

```vue
<script setup lang="ts">
    const { sendEmail, loading, error } = useEmailService()
    const toast = useToast()

    const form = reactive({
        nombre: '',
        email: '',
        mensaje: '',
    })

    async function handleSubmit() {
        try {
            await sendEmail('/api/mi-formulario', form)
            
            toast.add({
                title: 'Enviado',
                description: 'Gracias por contactarnos',
                color: 'green',
            })
            
            // Limpiar formulario
            form.nombre = ''
            form.email = ''
            form.mensaje = ''
        } catch (err) {
            toast.add({
                title: 'Error',
                description: error.value,
                color: 'red',
            })
        }
    }
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <input v-model="form.nombre" type="text" placeholder="Nombre" required />
        <input v-model="form.email" type="email" placeholder="Email" required />
        <textarea v-model="form.mensaje" placeholder="Mensaje" required></textarea>
        
        <button type="submit" :disabled="loading">
            {{ loading ? 'Enviando...' : 'Enviar' }}
        </button>
        
        <div v-if="error" class="error">{{ error }}</div>
    </form>
</template>
```

---

## Ejemplos de casos de uso

### 📋 Newsletter

**Endpoint:** `/server/api/newsletter.post.ts`

```typescript
const body = await readBody(event)
const { email } = body

await resend.emails.send({
    from: config.mailFrom,
    to: email,
    subject: 'Bienvenido a nuestro Newsletter',
    html: '<h1>¡Gracias por suscribirte!</h1>',
})
```

### 💬 Chat / Comentarios

**Endpoint:** `/server/api/comentario.post.ts`

```typescript
const body = await readBody(event)
const { nombre, email, productId, comentario } = body

// Email al usuario
await resend.emails.send({
    from: config.mailFrom,
    to: email,
    subject: 'Tu comentario fue recibido',
    html: `<p>Gracias ${nombre}, revisaremos tu comentario.</p>`,
})

// Email al admin
await resend.emails.send({
    from: config.mailFrom,
    to: config.mailToContact,
    subject: `Nuevo comentario sobre producto #${productId}`,
    html: `<p>De: ${nombre}</p><p>${comentario}</p>`,
})
```

### 🎁 Formulario de promoción / Sorteo

**Endpoint:** `/server/api/sorteo.post.ts`

```typescript
const body = await readBody(event)
const { nombre, email, telefono } = body

await resend.emails.send({
    from: config.mailFrom,
    to: email,
    subject: '¡Estás registrado en nuestro sorteo!',
    html: `
        <h1>¡Buena suerte!</h1>
        <p>${nombre}, tu número es: ${Math.random().toString(36).substr(2, 9)}</p>
    `,
})
```

---

## Templates HTML personalizados

### Patrón básico (copy & paste)

```typescript
function emailTemplate({ nombre, empresa }: any) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; }
                .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
                .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
                .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Bienvenido</h1>
                </div>
                <div class="content">
                    <h2>Hola ${nombre}</h2>
                    <p>Tu empresa: ${empresa}</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 APCO Tools</p>
                </div>
            </div>
        </body>
    </html>
    `
}
```

---

## Checklist para cada nuevo formulario

- [ ] Crear archivo `/server/api/mi-endpoint.post.ts`
- [ ] Validar campos requeridos con `throw createError()`
- [ ] Crear templates HTML para cliente y admin
- [ ] Usar `useEmailService()` en el componente
- [ ] Agregar manejo de errores con toast
- [ ] Probar en desarrollo con `npm run dev`
- [ ] Verificar que los emails lleguen a tu bandeja

---

## Debugging

### Revisar logs del servidor

En la terminal donde corre `npm run dev`:

```
[Resend] Email enviado correctamente a: user@example.com
```

### Variables de entorno incorrectas

Si ves: `Email service not configured`

✅ Solución: Verifica `.env.local` tiene `RESEND_API_KEY`

### Error "statusMessage not defined"

❌ Usa siempre:
```typescript
throw createError({
    statusCode: 500,
    statusMessage: 'Tu mensaje de error aquí',
})
```

### Email llegó a SPAM

📧 Configura SPF / DKIM en Resend (dashboard)

---

## Tips de productividad

1. **Copia rápida de endpoint**
   - Copia `/server/api/cotizacion.post.ts`
   - Renómbralo a tu nuevo endpoint
   - Actualiza los templates

2. **Reutiliza composable**
   - `useEmailService()` funciona igual en TODOS los formularios
   - No necesitas crear uno nuevo

3. **Variables globales**
   - `config.resendApiKey` ← privada, solo servidor
   - `config.mailFrom` ← remitente de emails
   - `config.mailToContact` ← donde llegan los emails del admin

---

## Recursos

- Docs Resend: https://resend.com/docs/send-email
- Nuxt Server Routes: https://nuxt.com/docs/guide/directory-structure/server
- HTML Email Best Practices: https://litmus.com/blog/
