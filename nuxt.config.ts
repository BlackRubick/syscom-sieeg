export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],

  runtimeConfig: {
    sessionSecret:     process.env.SESSION_SECRET     ?? 'dev-secret',
    syscomClientId:    process.env.SYSCOM_CLIENT_ID   ?? '',
    syscomClientSecret: process.env.SYSCOM_CLIENT_SECRET ?? '',
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'SIEEG SYSCOM',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' },
      ],
    },
  },

  compatibilityDate: '2024-11-01',
})
