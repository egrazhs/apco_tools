# ⚡ Cheat Sheet: Crear Endpoints de Email Rápido

## Template básico (copy → paste → edita)

**Archivo:** `/server/api/TU_NOMBRE.post.ts`

```typescript
import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    if (!config.resendApiKey) throw createError({ statusCode: 500, statusMessage: 'Email service not configured' })

    const resend = new Resend(config.resendApiKey)
    const body = await readBody(event)
    const { nombre, email, mensaje } = body

    // Validar
    if (!nombre || !email || !mensaje) {
        throw createError({ statusCode: 400, statusMessage: 'Faltan campos' })
    }

    try {
        // Email usuario
        await resend.emails.send({
            from: config.mailFrom,
            to: email,
            subject: 'Confirmación - APCO TOOLS',
            html: template1({ nombre }),
        })

        // Email admin
        await resend.emails.send({
            from: config.mailFrom,
            to: config.mailToContact,
            subject: `Nuevo mensaje de ${nombre}`,
            html: template2({ nombre, email, mensaje }),
        })

        return { success: true, message: 'Enviado' }
    } catch (error) {
        console.error('Error:', error)
        throw createError({ statusCode: 500, statusMessage: 'Error al enviar' })
    }
})

function template1({ nombre }: any) {
    return `<h1>Hola ${nombre}</h1><p>Recibimos tu solicitud.</p>`
}

function template2({ nombre, email, mensaje }: any) {
    return `<p>De: ${nombre} (${email})</p><p>${mensaje}</p>`
}
```

---

## En el componente

```vue
<script setup>
    const { sendEmail, loading, error } = useEmailService()
    
    const form = reactive({
        nombre: '',
        email: '',
        mensaje: '',
    })

    async function submit() {
        try {
            await sendEmail('/api/TU_NOMBRE', form)
            // ✓ éxito
        } catch (err) {
            // ✗ error
        }
    }
</script>

<template>
    <form @submit.prevent="submit">
        <input v-model="form.nombre" required />
        <input v-model="form.email" type="email" required />
        <textarea v-model="form.mensaje" required></textarea>
        <button :disabled="loading">{{ loading ? 'Enviando...' : 'Enviar' }}</button>
    </form>
</template>
```

---

## Casos comunes

### 📧 Solo email simple (sin template)

```typescript
await resend.emails.send({
    from: config.mailFrom,
    to: email,
    subject: 'Hola',
    text: 'Este es un email simple',
})
```

### 📨 Múltiples destinatarios

```typescript
await resend.emails.send({
    from: config.mailFrom,
    to: [email1, email2, config.mailToContact],
    subject: 'Asunto',
    html: '...',
})
```

### 🎯 Con CC y BCC

```typescript
await resend.emails.send({
    from: config.mailFrom,
    to: email,
    cc: ['cc@example.com'],
    bcc: ['bcc@example.com'],
    subject: 'Asunto',
    html: '...',
})
```

### 📎 Con adjuntos (archivos)

```typescript
// Primero carga el archivo a un buffer
const fs = require('fs')
const attachment = fs.readFileSync('ruta/archivo.pdf')

await resend.emails.send({
    from: config.mailFrom,
    to: email,
    subject: 'Tu PDF',
    html: '...',
    attachments: [
        {
            filename: 'documento.pdf',
            content: attachment,
        },
    ],
})
```

---

## HTML Email - Componentes reutilizables

### Encabezado

```html
<div class="header" style="background: #dc2626; color: white; padding: 20px; text-align: center;">
    <h1>Bienvenido</h1>
</div>
```

### Contenedor

```html
<div style="max-width: 600px; margin: 0 auto; font-family: Arial; line-height: 1.6;">
    <!-- contenido -->
</div>
```

### Botón

```html
<a href="https://tudominio.com/algo" 
   style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
    Ir al sitio
</a>
```

### Pie de página

```html
<div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    <p>&copy; 2024 APCO Tools. Todos los derechos reservados.</p>
</div>
```

---

## Validaciones rápidas

```typescript
// Validar email
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Email inválido' })
}

// Validar teléfono
if (telefono && telefono.length < 10) {
    throw createError({ statusCode: 400, statusMessage: 'Teléfono inválido' })
}

// Validar que no esté vacío
if (!mensaje || mensaje.trim() === '') {
    throw createError({ statusCode: 400, statusMessage: 'Mensaje requerido' })
}

// Validar longitud
if (mensaje.length > 5000) {
    throw createError({ statusCode: 400, statusMessage: 'Mensaje muy largo (máx 5000 caracteres)' })
}
```

---

## Debug

### Ver logs del servidor

```
[Resend] Email enviado a: user@example.com
[Resend] Subject: Confirmación
```

### Ver detalles en Resend dashboard

https://resend.com/emails

---

## Usar variables de ambiente

```typescript
const apiKey = process.env.RESEND_API_KEY        // En servidor solo
const mailFrom = useRuntimeConfig().mailFrom      // Accesible en endpoint
const adminEmail = useRuntimeConfig().mailToContact
```

---

## Patrones comunes

### Cambio de estado

```vue
const enviado = ref(false)
const { sendEmail, loading } = useEmailService()

async function submit() {
    try {
        await sendEmail('/api/contacto', form)
        enviado.value = true  // Mostrar pantalla de éxito
    } catch (err) {
        // toast de error
    }
}
```

### Limpiar formulario

```vue
// Después de envío exitoso
Object.keys(form).forEach(key => form[key] = '')
```

### Loading en botón

```vue
<button :disabled="loading" :class="{ opacity: loading ? 0.5 : 1 }">
    {{ loading ? 'Enviando...' : 'Enviar' }}
</button>
```

---

## Nombres de archivos (convención)

```
/server/api/
    ├── cotizacion.post.ts      ← POST /api/cotizacion
    ├── contacto.post.ts         ← POST /api/contacto
    ├── newsletter.post.ts       ← POST /api/newsletter
    └── comentario.post.ts       ← POST /api/comentario
```

**Patrón:** `[nombre-descriptivo].post.ts`

---

## Error handling (patrones)

❌ No hacer:
```typescript
try { ... } catch (e) { console.log(e) }  // Inutil
```

✅ Hacer:
```typescript
try {
    await resend.emails.send({ ... })
} catch (error) {
    console.error('Fallo al enviar email:', error)
    throw createError({
        statusCode: 500,
        statusMessage: 'No pudimos enviar tu mensaje',
    })
}
```

---

## Workflow completo (quick reference)

```
1. Crear /server/api/nuevo.post.ts
   ↓
2. import Resend + defineEventHandler
   ↓
3. readBody() → validar → enviar con resend.emails.send()
   ↓
4. catch error → throw createError()
   ↓
5. En componente: useEmailService() + $fetch('/api/nuevo')
   ↓
6. test en http://localhost:3000
   ↓
7. Verificar en Resend dashboard
```

---

## 🚀 Ready to go!

```bash
# Copiar template
# Editar 3 líneas
# Probar
# ✓ Enviando emails en 2 min
```
