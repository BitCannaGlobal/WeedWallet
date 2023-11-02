<template>
  <v-app id="inspire">
    <v-navigation-drawer v-if="store.logged" v-model="drawer">
      <img
        alt="user"
        class="ma-4"
        height="64"
        width="64"
        src="https://wallet.bitcanna.io/BCNA-LOGO-C.svg"
      > 
      <v-sheet
        color="#151618"
        class="ma-4"
      >
        <div>
          <v-list>
          <v-list-item
            prepend-avatar="https://res.cloudinary.com/stargaze/image/upload/w_700/yzsrwjxcsjzx17acr90i.jpg"
            :title="store.nameWallet" 
          >
          </v-list-item>
        </v-list>


        </div>
      </v-sheet>
 
        <v-divider></v-divider>

        <v-list nav>
          
          <v-list-item 
            v-for="[icon, text, url] in links" 
            :to="url"
            :append-icon="icon" 
            :title="text" 
            :value="text" 
            class="ma-2 tile white--text"
          >
          </v-list-item>
        </v-list>
      <!-- <v-list>
          <v-list-item
            prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
            title="John Leider"
            subtitle="john@google.com"
          >
            <template v-slot:append>
              <v-btn
                size="small"
                variant="text"
                icon="mdi-menu-down"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider> -->
    </v-navigation-drawer>
    <v-app-bar
      v-if="store.logged"
      app
      class="accent"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      My address:
 
      <v-tooltip
        content-class="custom-tooltip"
        color="grey"
        location="bottom"
      >
         <template v-slot:activator="{ props }">
          <v-chip
            class="ml-3"
            color="#00b786"
            variant="outlined"
            label
            v-bind="props" 
            @click="copyAddr(store.addrWallet)"
          >
            {{ store.addrWallet }}
          </v-chip>
        </template>
        <span class="mb-2 mt-2">
          <QRCodeVue3
          
          :width="250"
          :height="250"
          :value="store.addrWallet"
          :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }" 
          :dotsOptions="{
            type: 'dots',
            color: '#3CC194',
            gradient: {
              type: 'linear',
              rotation: 0,
              colorStops: [
                { offset: 0, color: '#3CC194' },
                { offset: 1, color: '#3CC194' },
              ],
            },
          }"
          :backgroundOptions="{ color: '#ffffff' }"
          :cornersSquareOptions="{ type: 'dot', color: '#000000' }"
          :cornersDotOptions="{ type: undefined, color: '#000000' }"    
        />
      </span>
      </v-tooltip>
      <v-chip
            class="ml-3"
            color="#00b786"
            variant="outlined"
            label 
            @click="copyAddr(store.addrWallet)"
          >
            {{ cosmosConfig[store.chainSelected].chainId }}
          </v-chip>
      
      <span
        v-if="isCopied"
        class="ml-2"
      >Address copied!</span>
      <v-spacer />
      <v-btn
        v-if="store.logged" 
        icon
        class="mr-2"
        @click="logoutNow"
      > 
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </v-main>
  </v-app>
</template>

<script>
import { useTheme } from 'vuetify'
import QRCodeVue3 from "qrcode-vue3";
import useClipboard from '~/composables/useClipboard'
import { useAppStore } from '@/stores/data'
import cosmosConfig from "~/cosmos.config";

export default {
  components: {
    QRCodeVue3
  },
  data: () => ({ 
    cosmosConfig: cosmosConfig,
    drawer: null,
    isCopied: false,
    links: [
      ["mdi-chevron-right", "Overview", "/"],
      ["mdi-chevron-right", "Address book", "/addressbook"],
      ["mdi-chevron-right", "Transactions", "/transactions"],
      
      // ["mdi-chevron-right", "Validators", "/validators"],
      ["mdi-chevron-right", "Proposals", "/proposals"],
      ["mdi-chevron-right", "Delegate", "/delegate"],
      // ['mdi-wallet-outline', 'Ibc manager', '/ibc'],
      // ['mdi-account-multiple', 'Groups manager', '/groups'],
      ["mdi-chevron-right", "NFTs", "/nfts"],
      //["mdi-chevron-right", "Create proposal", "/create-proposal"],
      ["mdi-chevron-right", "Get BCNA", "/get-bcna"],
    ],
  }),
  setup() {
    const store = useAppStore()
    const theme = useTheme()

    return {
      store,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }
  },
  async beforeCreate() {
    // await this.$store.dispatch("keplr/checkLogin");
    // await this.$store.dispatch("data/getAllValidators");
    if (!this.store.logged) {
      this.$router.push({ path: "/login" });
    }
  },
  methods: {
    logoutNow() {
      this.store.logout()
      this.$router.push({ path: "/login" });
      //this.$store.dispatch("keplr/logout");
      //this.address = "";
      //this.$router.push({ path: "/login" });
    },
    async refreshNow() {
      await this.$store.dispatch("data/refresh", this.accounts[0].address);
    },
    async copyAddr(text) {
      const { toClipboard } = useClipboard()
      await toClipboard(text)
      this.isCopied = true;
      setTimeout(this.hideCopy, 4000);
    },
    hideCopy() {
      this.isCopied = false;
    },
  },
    
}
</script>

<style>

@font-face {
    font-family: CarmenBold;
    src: url("fonts/Carmen Sans Bold.otf") format("opentype");
}
@font-face {
    font-family: CarmenExtraBold;
    src: url("fonts/Carmen Sans ExtraBold.otf") format("opentype");
}
@font-face {
    font-family: CarmenHeavy;
    src: url("fonts/Carmen Sans Heavy.otf") format("opentype");
}
@font-face {
    font-family: CarmenLight;
    src: url("fonts/Carmen Sans Light.otf") format("opentype");
}
@font-face {
    font-family: CarmenMedium;
    src: url("fonts/Carmen Sans Medium.otf") format("opentype");
}
@font-face {
    font-family: CarmenRegular;
    src: url("fonts/Carmen Sans Regular.otf") format("opentype");
}
@font-face {
    font-family: CarmenSemiBold;
    src: url("fonts/Carmen Sans SemiBold.otf") format("opentype");
}
@font-face {
    font-family: CarmenThin;
    src: url("fonts/Carmen Sans Thin.otf") format("opentype");
}
@font-face {
    font-family: CarmenUltraLight;
    src: url("fonts/Carmen Sans UltraLight.otf") format("opentype");
}
.body,
.v-text-field,
.v-application{
    font-family: 'CarmenMedium';
} 
.carmenBold {
    font-family: 'CarmenBold';

} 

.tile {
  margin: 5px;
  border-radius: 4px;
}

 
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
a {
color: #e5e9ec !important;
caret-color: #f4f4f4 !important;
}
.custom-tooltip {
  opacity: 1 !important;
}
</style>