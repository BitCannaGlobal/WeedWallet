<template>
  <v-app
    id="inspire"
    class="white"
  >
    <v-navigation-drawer
      v-if="pageNow !== '/login'"
      v-model="drawer"
      app
      fixed
      floating
      class="accent"
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

      <v-list
        v-if="logged"
        nav
      >
        <v-list-item
          
          v-for="[icon, text, url] in links"          
          :key="url"
          link
          :to="url"
          class="tile white--text"
        > 
          <v-list-item-content>
            <v-list-item-title class="white--text">
              {{
                text
              }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon color="#00b786">
              {{ icon }}
            </v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item
          link
          to="/create-proposal"
          class="tile white--text"
        > 
          <v-list-item-content v-if="canCreateProposal">
            <v-list-item-title class="white--text">
              Create proposal
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon v-if="canCreateProposal">
            <v-icon color="#00b786">
              mdi-chevron-right
            </v-icon>
          </v-list-item-icon>
        </v-list-item>        
      </v-list>
 
      <v-footer
        class="accent mb-8 justify-center pl-3"
        fixed
      >
        <v-btn
          class="mb-6"
          block
          @click="logoutNow"
        >
          Logout
        </v-btn>
      </v-footer> 
      <v-footer
        min-height="48"
        class="justify-center pl-0"
        fixed
      >
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

    <v-app-bar
      v-if="logged"
      app
      class="accent"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      My address:

      <v-tooltip
        content-class="custom-tooltip"
        color="grey"
        bottom
      >
        <template #activator="{ on, attrs }">
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
        <span><qr-code
          class="mb-2 mt-2"
          :text="accounts[0].address"
        /></span>
      </v-tooltip>
      <span
        v-if="isCopied"
        class="ml-2"
      >Address copied!</span>
      <v-spacer />
      <!-- <v-switch
        v-model="switch1"
        class=" mt-6"
        :label="`Simple/Pro: ${switch1.toString()}`"
      ></v-switch> -->

      <v-btn-toggle
        v-model="switch1"
        borderless
        color="#00b786"
      >
        <v-btn value="true">
          <span class="hidden-sm-and-down">Pro</span>
        </v-btn>

        <v-btn value="false">
          <span class="hidden-sm-and-down">Simple</span>
        </v-btn>
      </v-btn-toggle>
    </v-app-bar>
    <v-main>
      <v-container
        class="py-8 px-6"
        fluid
      >
        <Nuxt :vue-mode="switch1.toString()" />
      </v-container>
    </v-main>
    <v-footer padless>
      <v-col
        class="text-center"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>WeedWallet</strong> —
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
        >
          <template #activator="{ on, attrs }">
            <span
              color="#00b786"
              dark
              v-bind="attrs"
              v-on="on"
            >
              V{{ version }}
            </span>
          </template>

          <v-card class="accent">
            <v-list class="accent">
              <v-list-item>
                <v-list-item-avatar>
                  <img
                    src="https://pbs.twimg.com/profile_images/1455116847024586757/T9o06sNM_400x400.png"
                    alt="WeedWallet"
                  >
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>WeedWallet</v-list-item-title>
                  <v-list-item-subtitle>V{{ version }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-divider />

            <v-simple-table>
              <template #default>
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
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import cosmosConfig from "~/cosmos.config";
import pjson from "~/package";

export default {
  data: () => ({
    cards: ["Today", "Yesterday"],
    switch1: true,
    drawer: null,
    right: true,
    rightDrawer: false,
    cosmosConfig: cosmosConfig,
    version: pjson.version,
    menu: false,
    pageNow: "",
    isCopied: false,
    links: [
      ["mdi-chevron-right", "Portfolio", "/"],
      // ["mdi-chevron-right", "Earn", "/earn"],
      ["mdi-chevron-right", "Validators", "/validators"],
      ["mdi-chevron-right", "Proposals", "/proposals"],
      // ['mdi-wallet-outline', 'Ibc manager', '/ibc'],
      // ['mdi-account-multiple', 'Groups manager', '/groups'],
      ["mdi-chevron-right", "Transactions", "/transactions"],
      ["mdi-chevron-right", "My NFT's", "/nfts"],
      //["mdi-chevron-right", "Create proposal", "/create-proposal"],
      ["mdi-download", "Get bcna", "/get-bcna"],
    ],
    canCreateProposal: false,
  }),
  computed: {
    ...mapState("keplr", [
      `accounts`,
      `initialized`,
      `error`,
      `logged`,
      `logout`,
    ]),
    ...mapState("data", [`chainId`, "blockNow", "sdkVersion"]),
  },
  watch: {
    "$nuxt.$route.path": {
      handler: function (page) {
        this.pageNow = page;
      },
      deep: true,
      immediate: true,
    },
    async switch1(newQuestion) {
      console.log(newQuestion);
      let finalView = "";
      if (newQuestion === "true") {
        finalView = true;
      } else finalView = false;
      await this.$store.dispatch("data/changeLayout", finalView);
    },
  },
  async mounted() {
    await this.$store.dispatch("keplr/checkLogin");

    if (this.logged) {
      await this.$store.dispatch("data/getPriceNow");
      await this.$store.dispatch(
        "data/getWalletInfo",
        this.accounts[0].address
      );
      await this.$store.dispatch(
        "data/getDelegations",
        this.accounts[0].address
      );
      await this.$store.dispatch("data/getAllTxs", this.accounts[0].address);
      await this.$store.dispatch("data/getAllValidators");
      await this.$store.dispatch("data/getApr");
      await this.$store.dispatch("data/getAllBalances");
    } else {
      //this.$router.push({path: "/login"})
      //return
    }

    this.$store.dispatch("data/getBlockNow");
    this.$store.dispatch("data/getSdkVersion");
    setInterval(async () => {
      this.$store.dispatch("data/getBlockNow");
      await this.$store.dispatch("data/getPriceNow");
      await this.$store.dispatch(
        "data/getWalletInfo",
        this.accounts[0].address
      );
      await this.$store.dispatch(
        "data/getDelegations",
        this.accounts[0].address
      );
      await this.$store.dispatch("data/getAllTxs", this.accounts[0].address);
      await this.$store.dispatch("data/getAllValidators");
      await this.$store.dispatch("data/getApr");
      await this.$store.dispatch("data/getAllBalances");
    }, 5000);

    const checkAllowed = cosmosConfig[0].addressAllowedProp.find(
      (element) => element === this.accounts[0].address
    );
    if (typeof checkAllowed !== "undefined") {
      this.canCreateProposal = true;
    }   

    window.addEventListener("keplr_keystorechange", async () => {
      const payload = { key1: cosmosConfig[0], key2: 0 };
      await this.$store.dispatch("keplr/connectWallet", payload);
      await this.$store.dispatch("data/refresh", this.accounts[0].address);
      await this.$store.dispatch("data/getAllBalances");
    });
  },
  methods: {
    connectKeplr: async function () {
      const payload = { key1: cosmosConfig[0], key2: this.chainId };
      await this.$store.dispatch("keplr/connectWallet", payload);
      //await this.$store.dispatch('data/getbitcannaId', this.accounts[0].address)
      this.address = this.accounts[0].address;
      await this.$store.dispatch("data/refresh", this.accounts[0].address);

      // this.$router.push({path: "/"})
    },
    logoutNow() {
      this.$store.dispatch("keplr/logout");
      this.address = "";
      this.$router.push({ path: "/login" });
    },
    async refreshNow() {
      await this.$store.dispatch("data/refresh", this.accounts[0].address);
    },
    async copyAddr(text) {
      await this.$copyText(text);
      this.isCopied = true;
      setTimeout(this.hideCopy, 4000);
    },
    hideCopy() {
      this.isCopied = false;
    },
  },
};
</script>
<style>
.v-application {
  background-color: black !important;
  background-repeat: repeat-y;
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
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.tile {
  margin: 5px;
  border-radius: 4px;
}

.theme--dark.v-list-item--active:before,
.theme--dark.v-list-item--active:hover:before {
  /*opacity: 0;*/
  background: black !important;
}
/* Remove mouse over on table */
.v-data-table__wrapper > table > tbody > tr:hover {
  background: inherit !important;
}
.custom-tooltip {
  opacity: 1 !important;
}
</style>
