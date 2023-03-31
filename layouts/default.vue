<template>
  <v-app class="white" id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
      class="accent"
      v-if="pageNow !== '/login'"
    >
      <v-sheet class="accent pa-4">
        <div v-if="logged">
        <v-avatar
          class="mb-2"
          size="64"
        >
          <img
            alt="user"
            src="https://res.cloudinary.com/stargaze/image/upload/w_700/yzsrwjxcsjzx17acr90i.jpg"
          >
        </v-avatar>
         <span class="ml-2"> {{ accounts[0].walletName }}</span>

        <v-btn
          class="mb-2"
          block
          @click="logoutNow"
        >Logout
        </v-btn>
        </div>
        <v-btn
          v-if="!logged"
          block
          @click="connectKeplr"
          >
          <img
            class="mr-2"
            src="/keplr.png"
            width="20"
            height="20"
          >
          Connect Keplr
        </v-btn>
      </v-sheet>

          <v-list nav >
            <v-list-item
              v-for="[icon, text, url] in links"
              :key="url"
              link
              :to="url"
              v-if="logged"
              class="tile white--text"
            >
              <v-list-item-content>
                <v-list-item-title class="white--text">{{ text }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon color="#00b786">{{ icon }}</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
<!--          <v-list nav class="accent">
            <v-list-item
              link
              v-if="!logged"
              to="/login"
            >
              <v-list-item-icon>
                <v-icon>mdi-wallet-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Login</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-list nav class="accent">
            <v-list-item
              link
              v-if="!logged"
              to="/explorer"
            >
              <v-list-item-icon>
                <v-icon>mdi-search-web</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Explorer</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>-->

          <v-footer class="justify-center pl-0" fixed>

          <v-icon
            class="heart"
            color="green darken-2"
            small
          >
            mdi-circle
          </v-icon>
          <span class="ml-1">Block: {{ blockNow }}</span>
    </v-footer>

    </v-navigation-drawer>
    <v-app-bar v-if="logged" app class="accent">
      My address:


    <v-tooltip color="black" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-chip
          class="ml-3"
          color="#00b786"
          outlined
          label
          v-bind="attrs"
          v-on="on" 
          @click="copyAddr(accounts[0].address)"         
        >
          {{ accounts[0].address }}
        </v-chip>
        
      </template>
      <span><qr-code class="mb-2 mt-2" :text="accounts[0].address"></qr-code></span>
    </v-tooltip>
    <span v-if="isCopied" class="ml-2">Address copied!</span>
      <v-spacer></v-spacer>

        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x

        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="#00b786"
              dark
              v-bind="attrs"
              v-on="on"
            >
              V{{ version }}
            </v-btn>
          </template>

          <v-card class="accent">
            <v-list class="accent">
              <v-list-item>
                <v-list-item-avatar>
                  <img
                    src="https://pbs.twimg.com/profile_images/1455116847024586757/T9o06sNM_400x400.png"
                    alt="John"
                  >
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>WeedWallet</v-list-item-title>
                  <v-list-item-subtitle>V{{ version }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-simple-table>
              <template v-slot:default>
                <tbody class="accent">
                  <tr>
                    <td>RPC</td>
                    <td>{{ cosmosConfig[0].rpcURL }}</td>
                  </tr>
                  <tr>
                    <td>API</td>
                    <td>{{ cosmosConfig[0].apiURL }}</td>
                  </tr>
                  <tr>
                    <td>SDK</td>
                    <td>{{ sdkVersion }}</td>
                  </tr>

                </tbody>
              </template>
            </v-simple-table>


            <v-card-actions>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-menu>
    </v-app-bar>
    <v-main>
      <v-container
        class="py-8 px-6"
        fluid
      >
        <Nuxt />
        
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import cosmosConfig from '~/cosmos.config'
import pjson from '~/package'



  export default {
    data: () => ({
      cards: ['Today', 'Yesterday'],
      drawer: null,
      right: true,
      rightDrawer: false,
      cosmosConfig: cosmosConfig,
      version: pjson.version,
      menu: false,
      pageNow: '',
      isCopied: false,
      links: [
        ['mdi-chevron-right', 'Portfolio', '/'],
        ['mdi-chevron-right', 'Earn', '/earn'],
        ['mdi-chevron-right', 'Validators', '/validators'],
        ['mdi-chevron-right', 'Proposals', '/proposals'],
        // ['mdi-wallet-outline', 'Ibc manager', '/ibc'],
        // ['mdi-account-multiple', 'Groups manager', '/groups'],
        ['mdi-chevron-right', 'Transactions', '/transactions'],
        ['mdi-chevron-right', 'Collectibles', '/collectibles'],
        ['mdi-chevron-right', 'Create proposal', '/create-proposal'],
      ],
    }),
  computed: {
    ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
    ...mapState('data', [`chainId`, 'blockNow', 'sdkVersion']),
  },
  watch: {
    '$nuxt.$route.path': {
      handler: function(page) {
        this.pageNow = page
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {

    this.$store.dispatch('data/getBlockNow')
    this.$store.dispatch('data/getSdkVersion')
    setInterval(async () => {
      this.$store.dispatch('data/getBlockNow')
    }, 5000);

    window.addEventListener("keplr_keystorechange", async () => {
      var payload = {'key1': cosmosConfig[0], 'key2': 0}
      await this.$store.dispatch('keplr/connectWallet', payload)
      await this.$store.dispatch('data/refresh', this.accounts[0].address)
      await this.$store.dispatch('data/getAllBalances')
    })
  },
  methods: {
    connectKeplr: async function (event) {
      var payload = {'key1': cosmosConfig[0], 'key2': this.chainId}
      await this.$store.dispatch('keplr/connectWallet', payload)
      console.log(this.accounts[0].address)
      //await this.$store.dispatch('data/getbitcannaId', this.accounts[0].address)
      this.address = this.accounts[0].address
      await this.$store.dispatch('data/refresh', this.accounts[0].address)

      this.$router.push({path: "/"})
    },
    logoutNow() {
      this.$store.dispatch('keplr/logout')
      this.address = ''
      this.$router.push({path: "/login"})
    },
    async refreshNow() {
      await this.$store.dispatch('data/refresh', this.accounts[0].address)
    },
    async copyAddr(text) {
      await this.$copyText(text);
      this.isCopied = true
      setTimeout(this.hideCopy, 4000);
    },    
    hideCopy() {
      this.isCopied = false
    },     
  }
  }
</script>
<style>
.v-application {
    background-color: black !important;
}
.test {
    background-color: black !important;
}

.heart {
  fill: red;
  position: relative;
  width: 40px;
  animation: pulse 1s ease infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.tile {
  margin: 5px;
  border-radius: 4px;
}

.theme--dark.v-list-item--active:before, .theme--dark.v-list-item--active:hover:before {
  /*opacity: 0;*/
  background: black !important;
}
/* Remove mouse over on table */
.v-data-table__wrapper > table > tbody > tr:hover {
  background: inherit !important;
}
</style>
