// plugins/vuetify.js
import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labsComponents from 'vuetify/labs/components'


const bitcannaTheme = {
  dark: false,
  anchor: '#ffffff',
  colors: {
    accent: "#1c1d20",
    background: '#000000',
    surface: '#1c1d20',
    primary: '#6200EE',
    secondary: '#03DAC6',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    greenbcna: "#00bb82",
    textbcna: "#BBBCBD",
  },
}


export default defineNuxtPlugin(nuxtApp => {
  
  const vuetify = createVuetify({
    ssr: true, 
    directives,
    components: {
      ...components,
      ...labsComponents,
    },
    theme: {
      defaultTheme: 'bitcannaTheme',
      themes: {
        bitcannaTheme,
      },
    }
  })

  nuxtApp.vueApp.use(vuetify)
}) 
