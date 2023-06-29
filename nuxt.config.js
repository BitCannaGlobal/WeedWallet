import colors from "vuetify/es5/util/colors";

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - WeedWallet",
    title: "WeedWallet",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@plugins/chart",
    "@plugins/entrance",
    "@plugins/qrCode",
    // '@plugins/ellipseProgress',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "nuxt-clipboard",
    "@nuxtjs/markdownit",
    [
      "vue-toastification/nuxt",
      {
        timeout: 1000,
        draggable: false,
        filterBeforeCreate: (toast, toasts) => {
          if (toasts.filter((t) => t.type === toast.type).length !== 0) {
            // Returning false discards the toast
            return false;
          }
          // You can modify the toast if you want
          return toast;
        },
      },
    ],
  ],
  toast: {
    // Use your own CSS file
    cssFile: "@/assets/toast.css",
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: "/",
  },
  clipboard: {
    autoSetContainer: true,
  },
  // [optional] markdownit options
  // See https://github.com/markdown-it/markdown-it
  markdownit: {
    preset: "default",
    linkify: true,
    breaks: false,
    runtime: true, // Support `$md()`
    use: ["markdown-it-div", "markdown-it-attrs"],
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: "white",
          accent: "#1c1d20",
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          selected: colors.shades.black,
          green: "#00bb82",
        },
      },
    },
  },
  serverMiddleware: {
    "/api": "~/api",
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  server: {
    // default: localhost
    host: "0",
    port: 3000,
  },
};
