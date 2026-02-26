// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app:{
    head:{
      title: "Herramientas y Suministros de Alta Calidad SA de CV"
    }
  },
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@nuxtjs/supabase'],
  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_ANON_KEY
      }
    }
  },
  supabase: {
    redirect: false
  },
})


