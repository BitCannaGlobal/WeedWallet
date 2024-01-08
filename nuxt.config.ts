export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  devtools: {
    enabled: true
  },
  modules: [
    '@pinia/nuxt',
  ],
  plugins: [
    //'~/plugins/sequentialEntrance.js', // only in client side
  ],
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    /* server: {
      hmr: {
        protocol: "wss",
        clientPort: 443,
        path: "hmr/",
      },
    }, */
    define: {
      'process.env.DEBUG': false,
    },
  },
})