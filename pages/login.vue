<template>
  <v-container class="bcnaBackground">
    <v-row
      justify="center"
      align="center"
    >
      <v-col
        cols="4"
        sm="4"
        md="4"
      >
        <div class="mt-10 row justify-center">
          <v-img
            alt="Cosmofolio Logo"
            src="logo-bcna.png"
            max-height="60"
            max-width="60"
          />
        </div>
        <br>

        <v-card
          class="mt-10"
          height="100%"
        >
          <v-card-actions class="justify-center">
            <v-list
              two-line
              subheader
            >
              <v-list-item
                color="#000000"
                @click="connectKeplr"
              >
                <v-list-item-avatar>
                  <v-img
                    alt="bcna"
                    src="uctq7aeh_400x400.png"
                  />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Keplr connect </v-list-item-title>
                  <v-list-item-subtitle>
                    Connect your wallet cosmos from keplr
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-avatar>
                  <v-img
                    alt="bcna"
                    src="nWwjGAZN_400x400.png"
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>Cosmostation connect</v-list-item-title>
                  <v-list-item-subtitle>
                    Connect your wallet cosmos from Cosmostation
                    <v-chip
                      x-small
                      class="ma-2"
                      color="orange"
                      label
                      outlined
                    >
                      Soon
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-actions>
        </v-card>
        <!--<v-card>
        <v-card-title class="headline justify-center">
          Keplr login
        </v-card-title>
        <v-card-text>
          <v-list-item v-for="item in accounts" :key="item.address" two-line>
            <v-list-item-content>
              <v-list-item-title>{{ item.id }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.address }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            v-on:click="connectKeplr"
            block

          >
          <img
            class="mr-2"
            src="/keplr.png"
            width="20"
            height="20"
          >
          Connect Keplr wallet
          </v-btn>
        </v-card-actions>
      </v-card>-->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import cosmosConfig from "~/cosmos.config";

export default {
  name: `SessionKeplrExtension`,
  layout: "session",
  data: () => ({
    address: "",
    microAddress: "",
    config: cosmosConfig,
  }),
  computed: {
    ...mapState("keplr", [
      `accounts`,
      `initialized`,
      `error`,
      `loading`,
      `logged`,
      `logout`,
    ]),
    ...mapState("data", [`chainId`]),
  },
  async mounted() {
    // console.log(this.logged)

    await this.$store.dispatch("keplr/checkLogin");
    /* if (!this.logged) {
      this.$router.push({path: "/login"})
      return
    }
  */
  },
  methods: {
    connectKeplr: async function (event) {
      const payload = { key1: cosmosConfig[0], key2: this.chainId };
      await this.$store.dispatch("keplr/connectWallet", payload);
      console.log(this.accounts[0].address);
      //await this.$store.dispatch('data/getbitcannaId', this.accounts[0].address)
      this.address = this.accounts[0].address;
      await this.$store.dispatch("data/refresh", this.accounts[0].address);

      this.$router.push({ path: "/" });

      await this.$store.dispatch("data/getPriceNow");
      await this.$store.dispatch("data/getApr");
      await this.$store.dispatch(
        "data/getWalletInfo",
        this.accounts[0].address
      );
      await this.$store.dispatch(
        "data/getDelegations",
        this.accounts[0].address
      );
      await this.$store.dispatch("data/getAllBalances");
    },
  },
};
</script>
<style>
.cosmofolio-logo {
  height: 380px;
  width: 380px;
}

.bcnaBackground {
  background: transparent url("/bg_imgs.png") 0 0 no-repeat padding-box;
  background-size: 800px;
  background-position: 20% 10%;
  height: 100vh;
}
</style>
