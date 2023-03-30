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
                <v-col class="mt-2">
                  <h4 class="icon">
                    <img src="icon/wallet.png" />
                    &ensp; Wallet value
                  </h4>
                </v-col>
                <v-col class="text-right">
                  ${{ totalWalletPrice }}
                </v-col>
              </v-card-title> 
            </v-card>
          </v-col>
          
          <v-col>
            <v-card class="accent">
              <v-card-title class="headline">
                <v-col class="mt-2">
                  <h4 class="icon">
                    <img src="icon/validator.png" />
                    &ensp; Validators
                  </h4>
                </v-col>
                <v-col class="text-right">
                  {{ validators.length }}
                </v-col>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="accent">
              <v-card-title class="headline">
                <v-col class="mt-2">
                  <h4 class="icon">
                    <img src="icon/tokens.png" />
                    &ensp; Total Bonded
                  </h4>
                </v-col>
                <v-col class="text-right">
                  {{ (totalBonded / 1000000).toFixed(2)}} BCNA
                </v-col>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>


      </sequential-entrance>
 
      <sequential-entrance fromBottom>
      <v-row justify="space-around">
        <v-col>
          <v-row class="mt-4 mb-2" justify="space-around">

            <v-col class="text-h6 text-md-h5 text-lg-h4"> </v-col>
            <v-col>

            <UndelegateModal
              class="text-right"
              :chainIdProps="cosmosConfig[chainId].coinLookup.addressPrefix"
              :amountAvailable="(balances / 1000000)"
              :coinIcon="cosmosConfig[chainId].coinLookup.icon"
              :selected="selected"
            />
            </v-col>
          </v-row>
        
          <v-card class="accent">
            <v-card-title class="headline">
                <v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet delegations
          </v-card-title>  
            <v-card-text class="text-h5">

              <v-simple-table class="accent">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>
                        Action
                      </th>
                      <th>
                        Status
                      </th>
                      <th>
                        Name
                      </th>
                      <th>
                        Delegate
                      </th>
                      <th>
                        Reward
                      </th>
                      <th>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="item in delegations"
                      :key="item.validatorName"
                    >
                      <td>
                        <v-checkbox
                          v-model="selected"
                          :value="item.op_address"
                          color="#00b786"
                        ></v-checkbox>
                      </td>
                      <td>
                        <v-chip
                          v-if="item.status === 'BOND_STATUS_BONDED'"
                          class="ma-2"
                          color="#00b786"
                          outlined
                          label
                        >
                          <!--{{ item.status }}-->
                          Online
                        </v-chip>
                       </td>
                      <td>
                        <router-link :to="'/validators/'+item.op_address" class="linkFormat">
                          <v-icon class="mr-2">mdi-shield-check</v-icon>                                               
                          {{ item.validatorName }}
                        </router-link> 
                      </td>
                      <td>{{ item.share / 1000000 }} {{ cosmosConfig[0].coinLookup.viewDenom }}</td>
                      <td>{{ (item.reward) }} {{ cosmosConfig[0].coinLookup.viewDenom }}</td>
                      <td>
                        <v-btn
                          class="ma-2"
                          color="#00b786"
                          @click="getReward(item.op_address)"
                        >
                        <v-icon class="mr-2">mdi-download</v-icon> Claim
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
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
    cosmosConfig: cosmosConfig,
    selected: []
  }),
  computed: {
    ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
    ...mapState('data', ['chainId', 'balances', 'rewards', 'delegations', 'priceNow', 'totalBonded', 'validators', 'balancesPrice', 'totalWalletPrice']),
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
