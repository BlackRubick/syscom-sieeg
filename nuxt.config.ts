export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],

  runtimeConfig: {
    syscomClientId:     process.env.SYSCOM_CLIENT_ID    ?? '',
    syscomClientSecret: process.env.SYSCOM_CLIENT_SECRET ?? '',
    smtpHost:    process.env.SMTP_HOST     ?? '',
    smtpPort:    process.env.SMTP_PORT     ?? '465',
    smtpUser:    process.env.SMTP_USER     ?? '',
    smtpPass:    process.env.SMTP_PASS     ?? '',
    smtpAdminTo: process.env.SMTP_ADMIN_TO ?? '',
    // OpenPay — server-only (private key)
    openpayPrivateKey: process.env.OPENPAY_PRIVATE_KEY ?? '',
    public: {
      openpayMerchantId: process.env.OPENPAY_MERCHANT_ID ?? '',
      openpayPublicKey:  process.env.OPENPAY_PUBLIC_KEY  ?? '',
      openpayIsSandbox:  process.env.OPENPAY_IS_SANDBOX  ?? 'true',
    },
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'SIEEG INTEGRADORES',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/jpeg', href: '/logosieeg.jpg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' },
      ],
    },
  },

  // Encabezados de seguridad para todas las respuestas
  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options':           'SAMEORIGIN',
        'X-Content-Type-Options':    'nosniff',
        'Referrer-Policy':           'strict-origin-when-cross-origin',
        'Permissions-Policy':        'camera=(), microphone=(), geolocation=(), payment=(self)',
        'Strict-Transport-Security': 'max-age=31536000',
        // Imágenes de productos y logotipos llegan de muchos dominios de SYSCOM y marcas; scripts solo propios y OpenPay
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://js.openpay.mx https://*.openpay.mx",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "img-src 'self' data: blob: https:",
          "connect-src 'self' https://*.openpay.mx",
          "frame-src 'self' blob: https://*.openpay.mx",
          "frame-ancestors 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
      },
    },
  },

  compatibilityDate: '2024-11-01',
})
