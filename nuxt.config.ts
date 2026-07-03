// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: "Herramientas y Suministros de Alta Calidad SA de CV"
        }
    },
    compatibilityDate: '2025-07-15',
    css: ['~/assets/css/main.css'],
    devtools: { enabled: true },
    modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxtjs/supabase'],
    serverDir: '~~/app/server',
    runtimeConfig: {
        public: {
            supabase: {
                url:  process.env.SUPABASE_URL,
                key:  process.env.SUPABASE_ANON_KEY,
            },
            paymentProvider: process.env.PAYMENT_PROVIDER || 'mercadopago',
            mpPublicKey:     process.env.MP_PUBLIC_KEY,
            stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
            siteUrl:         process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        },
        resendApiKey: process.env.RESEND_API_KEY,
        mailFrom: process.env.MAIL_FROM,
        mailToContact: process.env.MAIL_TO_CONTACT,
    },

    supabase: {
        redirect: false
    },
    ui: {
        colorMode: false
    },
    nitro: {
        preset: 'firebase',
        firebase: {
            gen: 2,  // Cloud Functions 2ª generación (más moderna y recomendada)
            nodeVersion: '22'
        },
    },
    vite: {
        optimizeDeps: {                                                                                                                                   
            include: [
                '@vue/devtools-core',
                '@vue/devtools-kit',
                '@stripe/stripe-js',
            ]
        },
        server: {
            allowedHosts: ['vitalize-steersman-conical.ngrok-free.dev']
        }
    },
})