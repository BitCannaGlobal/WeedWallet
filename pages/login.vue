<template>
  <v-container class="bcnaBackground">
    <v-row
      justify="center"
      align="center"
    >
      <v-col
        cols="12"
        sm="12"
        md="5"
      >
        <div class="mt-10 row justify-center">
          <v-img
            alt="Cosmofolio Logo"
            src="logo-bcna.png"
            max-height="120"
            max-width="120"
          />
        </div>
        <br>

        <v-card
          class="mt-10"
          color="#161819"
          max-width="700px"
        >
          <v-chip-group
            v-model="selection"
            selected-class="text-deep-purple-accent-4"
            mandatory
          >
            <v-chip @click="setChainId(1)">Mainet (0.46)</v-chip>
            <v-chip @click="setChainId(0)">DevNet (0.47)</v-chip>
          </v-chip-group>
        </v-card>
        <v-card
          class="mt-10"
          color="#161819"
          max-width="700px"
        >
          <v-card-title>Connect your wallet</v-card-title>

          <v-card
            class="ma-4 mb-4 pa-4"
            color="#292929"
            @click="login('keplr')"
          >
            <!-- {{ item }}  -->
            <v-row>
              <v-col cols="3">
                <v-img
                  alt="bcna"
                  src="keplr.svg"
                  height="32"
                  width="32"
                />
              </v-col>
              <v-col
                cols="6"
                class="d-flex justify-center align-center"
              >
                Keplr Connect
              </v-col>
            </v-row>
          </v-card>
          <v-card
            class="ma-4 mb-4 pa-4"
            color="#292929"
            @click="login('cosmostation')"
          >
            <!-- {{ item }}  -->
            <v-row>
              <v-col cols="3">
                <v-img
                  alt="bcna"
                  src="cosmostation.svg"
                  height="32"
                  width="32"
                />
              </v-col>
              <v-col
                cols="6"
                class="d-flex justify-center align-center"
              >
                Cosmostation Connect
              </v-col>
              <v-col v-if="selection === 1" cols="3" class="d-flex justify-right align-right">
                  <v-icon
                    size="large"
                    color="red"
                    icon="mdi-close-outline"
                  ></v-icon>
              </v-col>
            </v-row>
          </v-card>
          <v-card
            class="ma-4 mb-4 pa-4"
            color="#292929"
            @click="login('leap')"
          >
            <!-- {{ item }}  -->
            <v-row>
              <v-col cols="3">
                <v-img
                  alt="leap wallet"
                  src="https://d2gn4xht817m0g.cloudfront.net/p/media_uploads/images/original/000/694/613/694613-33436c11f26479e8c145370fdca12ac3c79a36bc.png?1658290489"
                  height="32"
                  width="32"
                />
              </v-col>
              <v-col
                cols="6"
                class="d-flex justify-center align-center"
              >
                Leap wallet
              </v-col>
              <v-col v-if="selection === 1" cols="3" class="d-flex justify-right align-right">
                  <v-icon
                    size="large"
                    color="red"
                    icon="mdi-close-outline"
                  ></v-icon>
              </v-col>
            </v-row>
          </v-card>
          <v-card-actions />
        </v-card>


      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useAppStore } from '@/stores/data'
import cosmosConfig from "~/cosmos.config";

export default {
  name: `SessionKeplrExtension`,
  layout: "session",
  data: () => ({
    address: "",
    microAddress: "",
    config: cosmosConfig,
    selection: 0,
  }),
  setup() {
    useSeoMeta({
      title: 'BitCanna - Webwallet',
      description: 'Harnessing the power of blockchain to create equal opportunities for cannabis-related industries',
      ogTitle: 'BitCanna - Webwallet',
      ogDescription: 'Harnessing the power of blockchain to create equal opportunities for cannabis-related industries',
      ogImage: 'http://localhost:3000/logo-bcna.png',
      ogUrl: 'https://www.bitcanna.io/',
      twitterTitle: 'BitCanna - Webwallet',
      twitterDescription: 'Harnessing the power of blockchain to create equal opportunities for cannabis-related industries',
      twitterImage: 'http://localhost:3000/logo-bcna.png',
      twitterCard: 'Harnessing the power of blockchain to create equal opportunities for cannabis-related industries'
    })
    useHead({
      htmlAttrs: {
        lang: 'en'
      },
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png'
        }
      ]
    })
    const store = useAppStore()
    return {
      store
    }
  },
  methods: {
    setChainId(id) {
      this.store.setChainId(id)
    },
    login: async function (type) {
      switch (type) {
        case 'keplr':
          await this.store.keplrConnect()
          break;
        case 'cosmostation':
          await this.store.cosmoStationConnect()
          break;
        case 'leap':
          await this.store.leapConnect()
          break;
        default:
          await this.store.keplrConnect()
          break;
      }
      this.$router.push({ path: "/" });
      await this.store.initRpc()
      await this.store.getSdkVersion()
      await this.store.getPriceNow()
      await this.store.getApr()
      await this.store.getBankModule()
      await this.store.getStakingModule()
      await this.store.getDistribModule()
      await this.store.getFeeGrantModule()
      await this.store.getWalletAmount()
      await this.store.getGovModule()
      await this.store.getDelegations()


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
