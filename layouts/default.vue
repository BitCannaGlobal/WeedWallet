<template>
  <v-app class="white" id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
      class="accent"
      v-if="logged"
    >
      <v-sheet class="accent pa-4">
        <div>
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
          <v-list nav class="accent">
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
          </v-list>
          <v-footer class="justify-center pl-0"  fixed  >
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
        <v-chip
          class="ml-3"
          color="#00b786"
          outlined
          label
        >
          {{ accounts[0].address }}
        </v-chip>
      <v-spacer></v-spacer>
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

  export default {
    data: () => ({
      cards: ['Today', 'Yesterday'],
      drawer: null,
      right: true,
      rightDrawer: false,
      links: [
        ['mdi-chevron-right', 'Portfolio', '/'],
        ['mdi-chevron-right', 'Earn', '/earn'],
        ['mdi-chevron-right', 'Validators', '/validators'],
        ['mdi-chevron-right', 'Proposals', '/proposals'],
        // ['mdi-wallet-outline', 'Ibc manager', '/ibc'],
        // ['mdi-account-multiple', 'Groups manager', '/groups'],
        ['mdi-chevron-right', 'Transactions', '/transactions'],
        ['mdi-chevron-right', 'Collectibles', '/collectibles'],
        //['mdi-chevron-right', 'Create proposal', '/create-proposal'],
      ],
    }),
  computed: {
    ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
    ...mapState('data', [`chainId`, 'blockNow']),
  },
  async mounted() {

    this.$store.dispatch('data/init')
    this.$store.dispatch('data/getBlockNow')
    setInterval(async () => {
      this.$store.dispatch('data/getBlockNow')
    }, 5000);


    window.addEventListener("keplr_keystorechange", async () => {
      var payload = {'key1': cosmosConfig[0], 'key2': 0}
      await this.$store.dispatch('keplr/connectWallet', payload)
      console.log('refresh addr: ' + this.accounts[0].address)
      await this.$store.dispatch('data/refresh', this.accounts[0].address)
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

</style>
