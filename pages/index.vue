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
      <v-row justify="space-around" class="data-row">
        <v-col>
          <v-card class="accent">
            
            <v-card-title class="headline">
              <!--<v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet amount-->
              <v-col class="mt-2">
                <h4 class="icon">
                  <!-- <img src="icon/wallet.png" /> -->
                  <v-img 
                    src="icon/wallet.png"
                  ></v-img>                  
                  &ensp; Wallet value 
                </h4>
              </v-col>
              <v-col class="text-right">
                ${{ totalWalletPrice }} 
                <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
 
                <v-icon 
                  color="#00b786"
                  v-bind="attrs"
                  v-on="on"                
                >
                  mdi-information-slab-circle-outline
                </v-icon>

                </template>
                <span>
                  - Available<br />
                  - Delegated<br />
                  - Unbonding<br />
                  - Reward<br />
                </span>
              </v-tooltip>                

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
              <v-row align="center" justify="center">
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
                        <td>{{ (totalDelegated /1000000).toFixed(2) }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
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

import cosmosConfig from '~/cosmos.config'
import { notifWaiting, notifError, notifSuccess } from '~/libs/notifications'

export default {
  data: () => ({
    cosmosConfig: cosmosConfig,
    
  }),
  computed: {
    ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
    ...mapState('data', ['chainId', 'balances', 'rewards', 'delegations', 'priceNow', 'aprNow', 'totalDelegated', 'balancesPrice', 'totalUnbound', 'totalWalletPrice']),
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
    await this.$store.dispatch('data/getAllBalances')
    
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
@media (min-width: 300px) {
  .data-row {
    margin: 2 auto;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(1, 1fr);
  }
}
@media (min-width: 1760px) {
  .data-row {
    display: flex;
    justify-content: space-between;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
