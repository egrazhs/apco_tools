# Configuración de Variables de Entorno para Resend

## En `.env.local` (raíz del proyecto)

Asegúrate de tener estas variables configuradas:

```env
# Resend (envío de emails)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
NUXT_PUBLIC_SITE_URL=http://localhost:3000

# Email configuration
NUXT_MAIL_FROM=noreply@tudominio.com
NUXT_MAIL_TO_CONTACT=HerramientasAltaCalidad@hotmail.com
```

## En `nuxt.config.ts`

Verifica que tengas esto en `runtimeConfig`:

```typescript
export default defineNuxtConfig({
    runtimeConfig: {
        // Privadas (solo servidor, no visible en cliente)
        resendApiKey: process.env.RESEND_API_KEY,
        mailFrom: process.env.NUXT_MAIL_FROM,
        mailToContact: process.env.NUXT_MAIL_TO_CONTACT,

        // Públicas (accesibles desde cliente)
        public: {
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
        },
    },
    // ... resto de config
})
```

## Obtener API Key de Resend

1. Ve a https://resend.com
2. Regístrate / Inicia sesión
3. Ve a **API Keys** en el sidebar
4. Copia tu clave y colócala en `.env.local`

## Probar en desarrollo

Una vez configurado, simplemente:
1. Inicia el servidor: `npm run dev`
2. Ve a `/cotizacion`
3. Completa el formulario y envía
4. Revisa la consola del servidor para ver logs

## Emails de prueba en sandbox

Resend te permite enviar emails de prueba a cualquier dirección en desarrollo.
