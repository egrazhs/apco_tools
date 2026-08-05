// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: "Herramientas y Suministros de Alta Calidad SA de CV",
            link:[{rel: 'icon', type:'image/webp', href:'/favicon.webp'}]
        }
    },
    compatibilityDate: '2025-07-15',
    css: ['~/assets/css/main.css'],
    devtools: { enabled: false },
    experimental: {
        checkIfPageUnused: false
    },
    icon: {
        serverBundle: {
            collections: ['heroicons'],
        }
    },
    modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxtjs/supabase'], 
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
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
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
        externals: {
          external: ['stripe']
        },
        preset: 'firebase',
        traceDeps: [
          '!@img/sharp-win32-x64',
          '!@img/sharp-win32-ia32'
        ],
        firebase: {
            gen: 2,
            nodeVersion: '22',
            httpsOptions: {
                region: 'us-central1'
            }
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