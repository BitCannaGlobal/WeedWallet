export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  devtools: {
    enabled: false
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
    transpile: ['vuetify', 'qrcode-vue3', 'nuxt-storage', 'lodash'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  devServer: {
    port: 42022
  }
})
