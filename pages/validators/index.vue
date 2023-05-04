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

        <v-row justify="space-around"  class="data-row">
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
          <v-row class="mb-2" justify="space-around">

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
                <v-spacer />
                <ClaimAllModal 
 
                  :amountClaimAll="(rewards.amount / 1000000).toFixed(6)"
                  :getAllDelegation="delegations"
                />
          </v-card-title>  
            <v-card-text class="text-h5">

              <v-simple-table class="accent">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <!-- <th>
                        Action
                      </th> -->
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
                        Undelegate
                      </th>                      
                      <th>
                        Redelegate
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
                      <!-- <td>
                        <v-checkbox
                          v-model="selected"
                          :value="item.op_address"
                          color="#00b786"
                        ></v-checkbox>
                      </td> -->
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
                        <v-chip
                          v-else
                          class="ma-2"
                          color="red"
                          outlined
                          label
                        >
                          Offline
                        </v-chip>                        
                       </td>
                      <td>
                        <router-link :to="'/validators/'+item.op_address" class="linkFormat">
                          <v-icon class="mr-2">mdi-shield-check</v-icon>                                               
                          {{ item.validatorName }}
                        </router-link> 
                      </td>
                      <td>{{ item.delegated / 1000000 }} {{ cosmosConfig[0].coinLookup.viewDenom }}</td>
                      <td>{{ Number(item.reward).toFixed(6) }} {{ cosmosConfig[0].coinLookup.viewDenom }}</td>
                      <td>{{ (item.unDelegations.amount) }} {{ cosmosConfig[0].coinLookup.viewDenom }}</td>
                      <td>{{ (item.reDelegations.amount) }} {{ cosmosConfig[0].coinLookup.viewDenom }}</td>
                      
                      <td>
                        <v-btn
                          :disabled="item.reward > 0 ? false : true"
                          class="ma-2"
                          color="#00b786"
                          @click="getReward(item.op_address)"
                        >
                        <v-icon class="mr-2">mdi-download</v-icon> Claim
                        </v-btn>
                        <RedelegateModal          
                          class="ma-2"
                          
                          :chainIdProps="cosmosConfig[chainId].coinLookup.addressPrefix"
                          :addressFrom="item.op_address"
                          :amountRe="item.delegated / 1000000"
                          :validatorName="item.validatorName"
                          :coinIcon="cosmosConfig[chainId].coinLookup.icon"
                        />
                        <UndelegateSingleModal
                          class="ma-2"
                          :chainIdProps="cosmosConfig[chainId].coinLookup.addressPrefix"
                          :addressFrom="item.op_address"
                          :amountUn="item.delegated  / 1000000"
                          :amountTotalUn="item.delegated"
                          :validatorName="item.validatorName"
                          :coinIcon="cosmosConfig[chainId].coinLookup.icon"
 
                        />                                             
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
    <sequential-entrance v-if="dataLoaded" fromBottom>
    <v-row  justify="space-around"  class="mt-4 data-row">
          <v-col>
            <v-card class="accent" min-height="500" >
              <v-card-title class="headline">
                <v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet Undelegates
              </v-card-title> 
              <!-- {{ allUnbonding }} -->
              <v-data-table
                :headers="headersUndbound"
                :items="allUnbonding"
                :items-per-page="5"
                class="elevation-1 accent"
 
              ></v-data-table>              
            </v-card>
          </v-col>
          
          <v-col>
            <v-card class="accent" min-height="500">
              <v-card-title class="headline">
 
                <v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet Redelegates
              </v-card-title> 
              <!-- {{ allRedelegate }} -->
              <v-data-table
                :headers="headersRedelegate"
                :items="allRedelegate"
                :items-per-page="5"
                class="elevation-1 accent"
              ></v-data-table>               
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

                  <v-spacer /> 
                  <v-btn-toggle
                    v-model="getStatus"
                    borderless
                    color="#00b786"
                  >
                    <v-btn value="all">
                      <span class="hidden-sm-and-down">All</span>
                    </v-btn>
 
                    <v-btn value="active">
                      <span class="hidden-sm-and-down">Active</span>
                    </v-btn>
                  </v-btn-toggle>

              </v-card-title>
              <v-card-text>
                <AllValidators :getStatus="getStatus" />
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
import {
	assertIsDeliverTxSuccess,
	SigningStargateClient,
} from '@cosmjs/stargate'

export default {
  data: () => ({
    cosmosConfig: cosmosConfig,
    selected: [],
    dataLoaded: false,
    getStatus: 'active',
    headersUndbound: [
          {
            text: 'From',
            align: 'start',
            sortable: false,
            value: 'validator_address',
          },
          { text: 'Amount', value: 'entries[0].balance' },
          { text: 'completion_time', value: 'entries[0].completion_time' },
          
        ],   
        headersRedelegate: [
          {
            text: 'From',
            align: 'start',
            sortable: false,
            value: 'redelegation.validator_src_address',
          },
          { text: 'Amount', value: 'entries[0].balance' },
          { text: 'completion_time', value: 'entries[0].redelegation_entry.completion_time' },
          
        ],                
  }),
  computed: {
    ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
    ...mapState('data', [
      'chainId', 
      'balances', 
      'rewards', 
      'delegations', 
      'priceNow', 
      'totalBonded', 
      'validators', 
      'balancesPrice', 
      'totalWalletPrice', 
      'allUnbonding',
      'allRedelegate'
    ]),

  },
  async mounted() {
 
    await this.$store.dispatch('keplr/checkLogin')  
    if (!this.logged) {
      this.$router.push({ path: "/login" })
      return
    }
    await this.$store.dispatch('data/getDelegations', this.accounts[0].address)
    this.dataLoaded = true
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
            await this.$store.dispatch('data/getDelegations', accounts[0].address)
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
