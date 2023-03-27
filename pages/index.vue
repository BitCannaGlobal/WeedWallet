<template>

  <v-row>
    <v-col
      cols="12"
    >
      <sequential-entrance>
        <v-row justify="space-around">
          <v-col class="text-h6 text-md-h5 text-lg-h4">Wallet Statistics</v-col>
          <v-col>
          <SendModal
            class="text-right"
            :chainIdProps="cosmosConfig[chainId].coinLookup.addressPrefix"
            :amountAvailable="(balances / 1000000)"
            :coinIcon="cosmosConfig[chainId].coinLookup.icon"
          />
          </v-col>
        </v-row>
      </sequential-entrance>
      <sequential-entrance>
      <v-row justify="space-around">
        <v-col>
          <v-card class="accent">
            <v-card-title class="headline">
              <!--<v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet amount-->
              <v-col class="mt-2">
                <h4 class="icon">
                  <img src="icon/wallet.png" />
                  &ensp; Wallet value 
                </h4>
              </v-col>
              <v-col class="text-right">
                ${{ balancesPrice }}
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
                &ensp; BCNA price
              </h4>
            </v-col>
            <v-col class="text-right">
                ${{ priceNow }}
            </v-col>               
            </v-card-title> 
          </v-card>
        </v-col>
        <v-col>
 
          <v-card class="accent">
            <v-card-title class="headline">
              <v-col class="mt-2">
              <h4 class="icon">
                <img src="icon/apr.png" />
                &ensp; APR
              </h4>
            </v-col>
            <v-col class="text-right">
              {{ aprNow }}%
            </v-col>               
            </v-card-title> 
          </v-card>          
        </v-col>
      </v-row>
      </sequential-entrance>
      <sequential-entrance fromBottom>
      <v-row class="mt-4">
        <v-col>
          <v-card class="accent">
            <v-card-title class="headline">
              <v-icon class="mr-2">mdi-wallet-outline</v-icon> Price history
            </v-card-title>
            <v-card-text>
               <ChartsBar />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="accent">
            <v-card-title class="headline">
              <v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet distribution
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                   <ChartsDoughnut 
                      :amount="Number(balances)" 
                      :rewardsDoughnut="rewards.amount" 
                      :totalDelegated="totalDelegated" 
                      :totalUnbound="totalUnbound"
                    />
                </v-col>
                <v-col>
                  <v-simple-table class="accent">

                    <tbody>
                      <tr>
                        <td>
                          <v-icon
                            color="#b3ffeb"
                            small
                          >
                            mdi-circle
                          </v-icon>                      
                          Available</td>
                        <td>{{ (balances / 1000000).toFixed(2) }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
                      </tr>
                      <tr>
                        <td>
                          <v-icon
                            color="#33ffc9"
                            small
                          >
                            mdi-circle
                          </v-icon>                            
                          Delegated</td>
                        <td>{{ (totalDelegated /1000000) }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
                      </tr>
                      <tr>
                        <td>
                          <v-icon
                            color="#00b383"
                            small
                          >
                            mdi-circle
                          </v-icon>                          
                          Unbonding</td>
                        <td>{{ totalUnbound }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
                      </tr>
                      <tr>
                        <td>
                          <v-icon
                            color="#004d38"
                            small
                          >
                            mdi-circle
                          </v-icon>                                              
                          Staking Reward</td>
                        <td>{{ (rewards.amount / 1000000).toFixed(2) }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
                      </tr>

                    </tbody>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      </sequential-entrance>
      <sequential-entrance>

      </sequential-entrance>
      <sequential-entrance fromBottom>
      <v-row justify="space-around">
        <v-col>
          <v-row class="mt-4 mb-2" justify="space-around">

            <v-col class="text-h6 text-md-h5 text-lg-h4">Wallet delegations</v-col>
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
            <!--<v-card-title class="headline">
              <v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet delegations
            </v-card-title>-->
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
                      <td> {{ item.validatorName }} </td>
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
      <!--<v-row justify="space-around">

        <v-col class="text-h6 text-md-h5 text-lg-h4">Your Stake</v-col>
      </v-row>
      <v-row justify="space-around">
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
      </v-row>-->
    </v-col>
  </v-row>

</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import {
	assertIsDeliverTxSuccess,
	SigningStargateClient,
} from '@cosmjs/stargate'
import cosmosConfig from '~/cosmos.config'
import { notifWaiting, notifError, notifSuccess } from '~/libs/notifications'

export default {
  data: () => ({
    cosmosConfig: cosmosConfig,
    selected: []
  }),
  computed: {
    ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
    ...mapState('data', ['chainId', 'balances', 'rewards', 'delegations', 'priceNow', 'aprNow', 'totalDelegated', 'balancesPrice', 'totalUnbound']),
  },
  watch: {

  },
  async mounted () {
    // console.log(this.logged)

    await this.$store.dispatch('keplr/checkLogin')
    if (!this.logged) {
      this.$router.push({path: "/login"})
      return
    }
    await this.$store.dispatch('data/getPriceNow')
    await this.$store.dispatch('data/getApr')
    await this.$store.dispatch('data/getWalletInfo', this.accounts[0].address)
    await this.$store.dispatch('data/getDelegations', this.accounts[0].address)
  },
  methods: {

    getReward(addrValidator) {
      (async () => {
          const chainId = cosmosConfig[this.chainId].chainId;
          await window.keplr.enable(chainId);
          const offlineSigner = await window.getOfflineSignerAuto(chainId);

          const accounts = await offlineSigner.getAccounts();
          const client = await SigningStargateClient.connectWithSigner(
            cosmosConfig[this.chainId].rpcURL,
            offlineSigner
          )
            const fee = {
              amount: [
                {
                  denom: cosmosConfig[this.chainId].chainDenom,
                  amount: '5000',
                },
              ],
              gas: '200000',
            }

            var returnWaiting = notifWaiting(this.$toast)
          try {
            const result = await client.withdrawRewards(accounts[0].address, addrValidator, fee, '')
            assertIsDeliverTxSuccess(result)
            this.$toast.dismiss(returnWaiting);
            notifSuccess(this.$toast, result.transactionHash)
            await this.$store.dispatch('data/refresh', accounts[0].address)
          } catch (error) {
            console.error(error);

            this.$toast.dismiss(returnWaiting);
            notifError(this.$toast, error)
          }
      })();
    },
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
