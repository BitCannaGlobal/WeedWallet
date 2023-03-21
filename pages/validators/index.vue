<template>
  <v-row>
    <v-col cols="12">
      <sequential-entrance>
        <!--<v-row justify="space-around">
        <v-col>
          <v-card class="accent">
            <v-card-title class="headline">

              <h4 class="icon">
                <img src="icon/wallet.png" />
                &ensp; Wallet value
              </h4>
            </v-card-title>
            <v-card-text class="text-right text-h5">
             $ {{ ((balances / 1000000) * priceNow).toFixed(3) }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>-->

        <v-row justify="space-around">
          <v-col>
            <v-card class="accent">
              <v-card-title class="headline">
                <!--<v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet amount-->
                <h4 class="icon">
                  <img src="icon/wallet.png" />
                  &ensp; Wallet value
                </h4>
              </v-card-title>
              <v-card-text class="text-right text-h5">
                $ {{ ((balances / 1000000) * priceNow).toFixed(3) }}
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="accent">
              <v-card-title class="headline">
                <h4 class="icon">
                  <img src="icon/validator.png" />
                  &ensp; Validators
                </h4>
              </v-card-title>
              <v-card-text class="text-right text-h5">
                {{ validators.length }}
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="accent">
              <v-card-title class="headline">
                <h4 class="icon">
                  <img src="icon/tokens.png" />
                  &ensp; Total Bonded
                </h4>
              </v-card-title>
              <v-card-text class="text-right text-h5">
                {{ totalBonded }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>


      </sequential-entrance>
      <sequential-entrance fromBottom>
        <v-row class="mt-4" justify="space-around">
          <v-col>
            <v-card class="accent">
              <v-card-title class="headline">
                <v-icon class="mr-2">mdi-wallet-outline</v-icon> All validators
              </v-card-title>
              <v-card-text>
                <AllValidators />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </sequential-entrance>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

import cosmosConfig from '~/cosmos.config'
import { notifWaiting, notifError, notifSuccess } from '~/libs/notifications'

export default {
  data: () => ({
    cosmosConfig: cosmosConfig
  }),
  computed: {
    ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
    ...mapState('data', ['chainId', 'balances', 'rewards', 'delegations', 'priceNow', 'totalBonded', 'validators']),
  },
  async mounted() {

    await this.$store.dispatch('keplr/checkLogin')
    if (!this.logged) {
      this.$router.push({ path: "/login" })
      return
    }
  },
  methods: {

  }
}
</script>
<style>
.v-dialog {
  position: absolute;
  bottom: 0;
  right: 0;
}

.icon {
  display: inline-flex;
  align-self: center;
}
</style>
