// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: "Herramientas y Suministros de Alta Calidad SA de CV",
            link:[{rel: 'icon', type:'image/webp', href:'/favicon.jpg'}]
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
        // ← RESEND
        resendApiKey: process.env.NUXT_RESEND_API_KEY,
        mailFrom: process.env.NUXT_MAIL_FROM,
        mailToContact: process.env.NUXT_MAIL_TO_CONTACT,
        // ← MERCADOPAGO (private keys)
        mpAccessToken: process.env.NUXT_MP_ACCESS_TOKEN,
        stripeSecretKey: process.env.NUXT_STRIPE_SECRET_KEY,
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