<template>
  <v-row justify="center">
    <v-col
      cols="12"
      sm="10"
      md="8"
      lg="6"
    >
      <v-card ref="form">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="8"
              >
                <v-text-field
                  v-model="input1"
                  label="Amount"
                  outlined
                  :hint="amountWallet1"
                  persistent-hint
                >
                  <template v-slot:append>
                    <v-fade-transition leave-absolute>
                      <v-progress-circular
                        v-if="loading"
                        size="24"
                        color="info"
                        indeterminate
                      ></v-progress-circular>
                      <img
                        v-else
                        width="24"
                        height="24"
                        :src="select.img"
                        alt=""
                      >
                    </v-fade-transition>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
                  v-model="select"
                  :items="allAssets"
                  item-text="text"
                  label="Coin"
                  required
                  outlined
                  @input="setSelected(select)"
                >
                  <template slot="item" slot-scope="data">
                    <img
                      width="24"
                      height="24"
                      :src="data.item.img"
                      alt=""
                    >
                    <span class="cb-item">{{data.item.text}}</span>
                  </template>
                </v-select>
                              <v-col
                cols="12"
                sm="6"
                md="12"
                align-center
                class="text-center"
              >
                <v-icon
                  x-large
                >
                  mdi-swap-vertical-bold
                </v-icon>
              </v-col>
              </v-col>

              <v-col
                cols="12"
                sm="6"
                md="8"
              >
                <v-text-field
                  v-model="input2"
                  label="Amount"
                  outlined
                  :hint="amountWallet2"
                  persistent-hint
                >
                  <template v-slot:append>
                    <v-fade-transition leave-absolute>
                      <v-progress-circular
                        v-if="loading"
                        size="24"
                        color="info"
                        indeterminate
                      ></v-progress-circular>
                      <img
                        v-else
                        width="24"
                        height="24"
                        :src="select2.img"
                        alt=""
                      >
                    </v-fade-transition>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-select
                  v-model="select2"
                  :items="allAssets"
                  item-text="text"
                  label="Coin"
                  required
                  outlined
                  @input="setSelected2(select2)"
                >
                  <template slot="item" slot-scope="data">
                    <img
                      width="24"
                      height="24"
                      :src="data.item.img"
                      alt=""
                    >
                    <span class="cb-item">{{data.item.text}}</span>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-container>
          <br /><br />
            <v-simple-table>
              <template v-slot:default>

                <tbody>
                  <tr :class="actionIbcColor">
                    <td >Step 1</td>
                    <td>BitCanna to Osmosis</td>
                    <td>
                      <v-progress-circular
                        v-if="actionIbcColor === 'orange'"
                        indeterminate
                      ></v-progress-circular>
                      <v-icon v-if="actionIbcColor === 'green'">
                        mdi-check-bold
                      </v-icon>
                      <v-icon v-if="actionIbcColor === '#1E1E1E'">
                        mdi-clock-time-eight-outline
                      </v-icon>
                    </td>
                  </tr>
                  <tr :class="actionSwapColor">
                    <td>Step 2</td>
                    <td>BitCanna swap to UsdC</td>
                    <td>
                      <v-progress-circular
                        v-if="actionSwapColor === 'orange'"
                        indeterminate
                      ></v-progress-circular>
                      <v-icon v-if="actionSwapColor === 'green'">
                        mdi-check-bold
                      </v-icon>
                      <v-icon v-if="actionSwapColor === '#1E1E1E'">
                        mdi-clock-time-eight-outline
                      </v-icon>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>


        </v-card-text>
        <v-divider class="mt-12"></v-divider>
        <v-card-actions>
          <v-btn text>
            Cancel
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            text
            @click="start"
          >
            Submit
          </v-btn>
          <!--<v-btn
            color="primary"
            text
            @click="start2"
          >
            Submit 2
          </v-btn>-->
        </v-card-actions>
      </v-card>
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
    input1: '',
      input2: '',
      externalContent: '',
      allAssets: [],
      loading: true,
      reveal: false,
      switch1: true,
      amountWallet1: '',
      amountWallet2: '',
      select: { text: 'BCNA', img: 'https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/bcna.svg' },
      select2: { text: 'USDC', img: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/usdc.svg' },
      actionIbcColor: '#1E1E1E',
      actionSwapColor: '#1E1E1E',
  }),
  computed: {
    ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
    ...mapState('data', ['chainId', 'balances', 'rewards', 'delegations', 'priceNow', 'aprNow', 'totalDelegated', 'balancesPrice', 'totalUnbound']),
  },
  watch: {
    input1: function (val) {
      //console.log(val)
      this.amountWallet2 = 'Recevied ≈ ' + (val * 0.020) + ' USDC'
      this.input2 = (val * 0.020)
    }
  },
  async mounted () {
    await this.$store.dispatch('keplr/checkLogin')
    if (!this.logged) {
      this.$router.push({path: "/login"})
      return
    } 
    
    var getWalletBcna = await axios(cosmosConfig[0].apiURL + '/cosmos/bank/v1beta1/balances/bcna13jawsn574rf3f0u5rhu7e8n6sayx5gkwgusz73');
    //console.log(getWalletBcna.data.balances[0].amount)
    this.amountWallet1 = 'Wallet value: ' + (getWalletBcna.data.balances[0].amount / 1000000).toFixed(2) + ' BCNA'
    this.amountWallet2 = 'Recevied ≈ '

    var allAssets = this.allAssets
    //console.log(cosmosConfig)
    cosmosConfig.forEach(function(item){
      allAssets.push({ text: item.coinLookup.viewDenom, img: item.coinLookup.icon });
    });

    this.allAssets = allAssets
    this.loading = false
  },
  methods: {
    async start() {
      console.log('Start!') 
    }, 
    setSelected(value) {
      const foundLogo = cosmosConfig.find(element => element.coinLookup.viewDenom === value);
      this.select = { text: value, img: foundLogo.coinLookup.icon }
      console.log(foundLogo.coinLookup.icon)
    },
    setSelected2(value) {
      const foundLogo = cosmosConfig.find(element => element.coinLookup.viewDenom === value);
      this.select2 = { text: value, img: foundLogo.coinLookup.icon }
      console.log(foundLogo.coinLookup.icon)
    }    
  }
}
</script>
 