<template>

  <v-row>
    <v-col
      cols="12"
      v-if="layout"
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
                  class="mt-n1"
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
                <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
 
                <v-icon 
                  class="mt-n1"
                  color="#00b786"
                  v-bind="attrs"
                  v-on="on"                
                >
                  mdi-information-slab-circle-outline
                </v-icon>

                </template>
                <span>
                  Proudly powered by BCNAracle 💚
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
          <v-card class="accent" min-height="400">
            <v-card-title class="headline">
              <v-icon class="mr-2">mdi-wallet-outline</v-icon> Price history
            </v-card-title>
            <v-card-text>
               <ChartsBar />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="accent" min-height="400">
            <v-card-title class="headline">
              <v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet distribution
            </v-card-title>
            <v-card-text>
              <v-row align="center" justify="center">
                <v-col>
 

                   <ChartsDoughnut 
                    v-if="Number(balances) > 0
                      || rewards.amount > 0
                      || totalDelegated  > 0
                      || totalUnbound  > 0"
                      :amount="Number(balances)" 
                      :rewardsDoughnut="rewards.amount" 
                      :totalDelegated="totalDelegated" 
                      :totalUnbound="totalUnbound"
                    />
                    <h2 
                    v-else  
                    class="mt-10 d-flex justify-center align-center fill-height"
                  >
                    No balance
                  </h2>
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
                        <td>{{ (balances / 1000000).toFixed(6) }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
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
                        <td>{{ (totalDelegated /1000000).toFixed(6) }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
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
                        <td>{{ (rewards.amount / 1000000).toFixed(6) }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
                      </tr>
                      <tr>
                        <td>
                          <v-icon
                            color="#00b786"
                            small
                          >
                            mdi-circle
                          </v-icon>                             
                          Total</td>
                        <td>
                          {{ totalWallet }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
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

    <v-col
      cols="12"
      v-else
    >
    <v-col class="ml-6 mb-6 text-h6 text-md-h5 text-lg-h4">atmon3r's portfolio</v-col>
 
    <sequential-entrance>
        <v-row >
          <v-col class="fill-height d-flex flex-column justify-center align-center">

            <v-card class="pa-4 accent" width="700" min-height="220">
 
            <v-card-text>

              <v-row>
                <v-col md="6"> 
                    Main account<br />
                    <span class="text-h6 text-md-h5 text-lg-h4">
                      {{ (balances / 1000000).toFixed(2) }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                    </span>
                    <br />
                    <span class="text-h6">
                      ${{ totalWalletPrice }}
                    </span>  
                    <br /> 


                    <v-row class="mt-1">
                      <v-col md="6"> 
                        <v-btn
                          large
                          block
                          class="mt-2 white--text" 
                          color="#0FB786"
                        >
                          Send
                        </v-btn> 
                      </v-col>
                      <v-col
                        md="6" 
                      >
                        <v-btn
                          large
                          block
                          class="mt-2 green--text" 
                          color="white"
                        >
                          Receive
                        </v-btn>                      
                      </v-col>
                    </v-row>
              
 
                </v-col>
                <v-col
                  md="6" 
                >
                <v-sheet outlined color="#00b786" rounded>
                  <v-card
                    class="pa-2 accent"
                    outlined
                    tile
                    height="160" 
                  >
                    <v-avatar>
                      <img
                        src="logo-bcna.png"
                        alt="bcna"
                      >
                    </v-avatar>
                    <br /><br />
                    <span class="mt-2"> atmon3r's portfolio</span> <br />
                    <span class="text-caption">
                      {{ accounts[0]?.address }}
                    </span>
                  </v-card>
                </v-sheet>
                </v-col>
              </v-row>
              
            </v-card-text>
          </v-card>   
          
          <v-col class="mt-4 ml-8 mb-6 text-h6 text-md-h5 text-lg-h4">Transactions</v-col>         
          <template v-for="group in groupedEvents()" >
      <div >
        <h3>{{ group[0].section }}</h3>
        <v-card v-for="item in group" class="ma-2 pa-4 accent" width="700" min-height="50">
           {{ item }} 


          </v-card>
        <!-- {{ group }} -->
      </div>
    </template>

          </v-col>
          <v-divider
            class="mx-4"
            vertical
          ></v-divider>
          
          <v-col class="fill-height d-flex flex-column justify-center align-center">
            <v-card class="accent" width="700" min-height="220">
            <v-card-title class="headline">
              <v-col class="mt-2">
              <h4 class="icon">
                <img src="icon-stake.png" /> 
              </h4>
            </v-col>           
            </v-card-title> 
            <v-card-text>
             
              <span class="text-h6 text-md-h5 text-lg-h4">
                Available to stake
              </span>     
              <br />
              <span class="text-h6 ">
                {{ (balances / 1000000).toFixed(6) }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}
              </span>                       
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
import dayjs from 'dayjs'
import { reverse, sortBy, orderBy, uniqWith, groupBy } from 'lodash'
 
import { setMsg } from '~/libs/msgType'

import cosmosConfig from '~/cosmos.config'
import { notifWaiting, notifError, notifSuccess } from '~/libs/notifications'

const categories = [
  {
    section: 'Today',
    matcher: (event) => {
      console.log(dayjs(event.timestamp).isSame(dayjs(), 'day'))
      // tests if the timestamp has the same day as today
      return dayjs(event.timestamp).isSame(dayjs(), 'day')
    },
  },
  {
    section: 'Yesterday',
    matcher: (event) => {
      return dayjs(event.timestamp).isSame(dayjs().subtract(1, 'days'), 'day')
    },
  },
]

export default {
  layout: 'blog',
  data: (ins) => ({
    cosmosConfig: cosmosConfig,
    rpcAllTxs: ''
  }),
  watch: {
 
  },  
  computed: {
    ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
    ...mapState('data', ['layout', 'chainId', 'balances', 'rewards', 'delegations', 'allTxs', 'allTxsLoaded', 'priceNow', 'aprNow', 'totalDelegated', 'balancesPrice', 'totalUnbound', 'totalWalletPrice', 'totalWallet']),

  },
  watch: {

  },
  async mounted () {
    await this.$store.dispatch('keplr/checkLogin')
  },
  
  methods: {
    transactionsReducer(txs) {
      const duplicateFreeTxs = uniqWith(txs, (a, b) => a.txhash === b.txhash)
      const sortedTxs = sortBy(duplicateFreeTxs, ['timestamp'])
      const reversedTxs = reverse(sortedTxs)

      reversedTxs.forEach(async (item, i) => {
        reversedTxs[i].messageInfo = this.getMessageType(item.tx.body.messages[0])
      });
      //console.log(reversedTxs)
      // here we filter out all transactions related to validators
      return reversedTxs.reduce((collection, transaction) => {
        return collection.concat(transaction)
      }, [])
    },    
    groupedEvents() {
 
      if (this.allTxsLoaded) {
      let test = orderBy(
        groupBy(this.categorizedEvents(), 'section'),
        (group) => group[0].final.timestamp,
        'desc'
      )
      
      return test
      }
    },    
    categorizedEvents() {
 
      
      
      return this.allTxs.map((event) => {
        
        // check if the tx is in Today, Yesterday or Last Week
        const dateString =
          ` (` + dayjs(event.timestamp).format('MMMM D, YYYY') + `)`
          
        const category = categories.find(({ matcher }) => matcher(event))
        
        if (category) {
          let final = this.getMessageType(event.tx.body.messages[0])
          return {
            section: category.section + dateString,
            final,
          }
        }

        // check if tx is in a month this year
        const date = dayjs(event.timestamp)
        const today = dayjs()
        if (date.year() === today.year()) {
          let final = this.getMessageType(event.tx.body.messages[0])
          return {
            section: date.format('MMMM D, YYYY'),
            final,
          }
        }

        // tx is in a month another year
        let final = this.getMessageType(event.tx.body.messages[0])
        return {
          section: date.format('MMMM D, YYYY'),
          final,
        }
      })
    },
    getMessageType(msg) {
      let typeReadable = setMsg(msg, this.accounts[0].address)
      return typeReadable
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
