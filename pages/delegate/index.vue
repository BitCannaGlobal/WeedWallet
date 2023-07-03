<template>
  <v-row>
    <v-row class="ma-2">
      <h1>
        Delegate 
      </h1>
      <v-spacer /> 
      <ClaimAllModal
        v-if="rewards.amount > 0"
        :amount-claim-all="(rewards.amount / 1000000).toFixed(6)"
        :get-all-delegation="delegations"
        :home-page="true"
      />
    </v-row>
    <v-col cols="12">
      <v-divider class="mb-6" />
      <sequential-entrance from-bottom>
        <v-row justify="space-around">
          <v-col>
            <span class="text-h6">My validators</span>
            <v-simple-table class="mt-2 accent">
              <template #default>
                <!-- <thead>
                      <tr> 
                        <th>Status</th>
                        <th>Name</th>
                        <th>Delegate</th>
                        <th>Reward</th>
                        <th>Undelegate</th>
                        <th>Redelegate</th>
                        <th />
                      </tr>
                    </thead> -->
                    
                <tbody>
                  <tr
                    v-for="item in delegations"
                    :key="item.validatorName"
                    class="myValidator"
                  >
                    <!-- <td>
                        <v-checkbox
                          v-model="selected"
                          :value="item.op_address"
                          color="#00b786"
                        ></v-checkbox>
                      </td> -->

                    <td style="">
                      <a 
                        class="linkFormat box"
                        @click="selectValidator(item)"
                      > 
                      
                      <!-- BCNA-LOGO-C.svg -->
                      <v-avatar>
                        <v-img
                          :src="'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/bitcanna/moniker/'+item.op_address+'.png'" 
                          :alt="item.validatorName" 
                        /> 
                      </v-avatar>
                        <span class="ml-8"><h3>{{ item.validatorName }}</h3></span>                            
                      </a>
                    </td>
                    <td style="text-align: right;">
                      <span class="text-h6 mr-4">
                        {{ Number(item.delegated / 1000000).toFixed(2) }}
                        <span
                          color="#00BB82"
                          class="green--text"
                        >
                          +{{ Number(item.reward).toFixed(2) }}                             
                        </span>
                      </span>
                      <v-chip
                        v-if="item.status === 'BOND_STATUS_BONDED'"
                        class="ma-2"
                        color="#00b786"
                        label
                      >
                        Active
                      </v-chip>
                      <v-chip
                        v-else
                        class="ma-2"
                        color="red"
                        label
                      >
                        Inactive
                      </v-chip> 
                    </td>
 
                    <!-- <td>
                          {{ item.delegated / 1000000 }}
                          {{ cosmosConfig[0].coinLookup.viewDenom }}
                        </td>
                        <td>
                          {{ Number(item.reward).toFixed(6) }}
                          {{ cosmosConfig[0].coinLookup.viewDenom }}
                        </td>
                        <td>
                          {{ item.unDelegations.amount }}
                          {{ cosmosConfig[0].coinLookup.viewDenom }}
                        </td>
                        <td>
                          {{ item.reDelegations.amount }}
                          {{ cosmosConfig[0].coinLookup.viewDenom }}
                        </td>

                        <td>
                          <v-btn
                            :disabled="item.reward > 0 ? false : true"
                            class="ma-2"
                            color="#00b786"
                            @click="getReward(item.op_address)"
                          >
                            <v-icon class="mr-2">
                              mdi-download
                            </v-icon> Claim
                          </v-btn>
                          <RedelegateModal
                            class="ma-2"
                            :chain-id-props="
                              cosmosConfig[chainId].coinLookup.addressPrefix
                            "
                            :address-from="item.op_address"
                            :amount-re="item.delegated / 1000000"
                            :validator-name="item.validatorName"
                            :coin-icon="cosmosConfig[chainId].coinLookup.icon"
                          />
                          <UndelegateSingleModal
                            class="ma-2"
                            :chain-id-props="
                              cosmosConfig[chainId].coinLookup.addressPrefix
                            "
                            :address-from="item.op_address"
                            :amount-un="item.delegated / 1000000"
                            :amount-total-un="item.delegated"
                            :validator-name="item.validatorName"
                            :coin-icon="cosmosConfig[chainId].coinLookup.icon"
                          />
                        </td> -->
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </sequential-entrance>
      <sequential-entrance
        v-if="dataLoaded"
        from-bottom
      >
        <v-row
          justify="space-around"
          class="mt-4 data-row"
        >
          <v-col v-if="allUnbonding.length > 0">
            <v-card class="accent">
              <v-card-title class="headline">
                <v-icon class="mr-2">
                  mdi-wallet-outline
                </v-icon> Wallet
                Undelegates
              </v-card-title>
              <!-- {{ allUnbonding }} -->

 



              <v-data-table
                :headers="headersUndbound"
                :items="allUnbonding"
                :items-per-page="5"
                class="elevation-1 accent"
              >
                <template #item.entries[0].balance="{ item }">
                  {{ item.entries[0].balance / 1000000 }} {{ cosmosConfig[0].coinLookup.viewDenom }}
                </template>  
                <template #item.entries[0].completion_time="{ item }">
                  {{ formatDate(item.entries[0].completion_time) }} 
                </template>  
              </v-data-table>
            </v-card>
          </v-col>

          <v-col v-if="allRedelegate.length > 0">
            <v-card class="accent">
              <v-card-title class="headline">
                <v-icon class="mr-2">
                  mdi-wallet-outline
                </v-icon> Wallet
                Redelegates
              </v-card-title>
              <!-- {{ allRedelegate }} -->
              <v-data-table
                :headers="headersRedelegate"
                :items="allRedelegate"
                :items-per-page="5"
                class="elevation-1 accent"
              >
                <template #item.entries[0].balance="{ item }">
                  {{ item.entries[0].balance / 1000000 }} {{ cosmosConfig[0].coinLookup.viewDenom }}
                </template>
                <template #item.entries[0].redelegation_entry.completion_time="{ item }">
                  {{ formatDate(item.entries[0].redelegation_entry.completion_time) }} 
                </template>  
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </sequential-entrance>
      <sequential-entrance from-bottom>
        <v-row
          class="mt-4"
          justify="space-around"
        >
          <v-col>
            <v-card class="accent">
              <v-card-title class="headline">
                <v-icon class="mr-2">
                  mdi-wallet-outline
                </v-icon> All validators

                <v-spacer />
                <v-switch
                  v-model="orderVal"
                  color="#00b786"
                  :label="`View ${getStatus.toString()}`"
                />

                <!-- <v-btn-toggle
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
                </v-btn-toggle> -->
              </v-card-title>
              <v-card-text>
                <AllValidators :get-status="getStatus" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </sequential-entrance>
    </v-col>
    <v-dialog
      v-model="dialog"
      max-width="600" 
    >
      <v-card color="#161819">
        <v-card-title class="text-h5">
          Delegate
          <v-spacer />
          <v-icon
            class="mr-2"
            @click="dialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text class="mt-6">
          <v-row>
            <v-col
              md="6"
              class="fill-height d-flex"
            >
            <v-avatar>
              <v-img
                :src="'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/bitcanna/moniker/'+selectedValidator.op_address+'.png'" 
                :alt="selectedValidator.validatorName" 
              /> 
            </v-avatar>
            <span class="text-h6 mt-2 ml-8">{{ selectedValidator.validatorName }}</span>
            </v-col>
            <v-col md="6">
              <v-row>
                <v-col
                  md="6"
                  class="ml-2"
                >
                  Your reward {{ validatorRewards }}
                </v-col>
                <v-col md="3">
                  <SoloRewardModal 
                    :validator-name="selectedValidator.validatorName"
                    :op-address="selectedValidator.op_address"
                    :total-reward="selectedValidator?.reward" 
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>  


          <v-sheet
            outlined
            color="gray"
            rounded
            class="mt-4"
          >
            <v-card
              color="#1C1D20"
              class="pa-2"
              outlined
              tile 
            >
              <v-row>
                <v-col md="6">
                  <v-list-item two-line>
                    <v-list-item-content>        
                      <v-list-item-subtitle class="mb-2 subtitle-1">
                        Commission rate
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 subtitle-2">
                        {{ selectedValidator.commission }}%
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item two-line>
                    <v-list-item-content>        
                      <v-list-item-subtitle class="mb-2 subtitle-1">
                        Voting Power
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6">
                        {{ selectedValidator.votingPower }}%
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col md="6">
                  <v-list-item two-line>
                    <v-list-item-content>        
                      <v-list-item-subtitle class="mb-2 subtitle-1">
                        Total stake
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 subtitle-2">
                        {{ validatorDelegations / 1000000 }}
                        {{ cosmosConfig[0].coinLookup.viewDenom }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item two-line>
                    <v-list-item-content>        
                      <v-list-item-subtitle class="mb-2 subtitle-1">
                        Rewards
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6">
                        {{ validatorRewards }}
                        {{ cosmosConfig[0].coinLookup.viewDenom }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-card>
          </v-sheet>  

          <DelegateModal
            v-if="logged"
            :chain-id-props="cosmosConfig[chainId].coinLookup.addressPrefix"
            :address-to="selectedValidator.op_address"
            :validator-name="validatorDetails.description?.moniker" 
          /> 


          <v-row>
            <v-col
              md="6"
              class="fill-height d-flex"
            >
              <RedelegateModal
                v-if="logged"
                :chain-id-props="cosmosConfig[chainId].coinLookup.addressPrefix"
                :address-from="selectedValidator.op_address"
                :amount-re="validatorDelegations / 1000000"
                :validator-name="validatorDetails.description?.moniker"
                :coin-icon="cosmosConfig[chainId].coinLookup.icon"
              /> 
            </v-col>
            <v-col md="6">
              <UndelegateSingleModal
                v-if="logged"
                :chain-id-props="cosmosConfig[chainId].coinLookup.addressPrefix"
                :address-from="selectedValidator.op_address"
                :amount-un="validatorDelegations / 1000000"
                :amount-total-un="myTotalUnDelegation"
                :validator-name="validatorDetails.description?.moniker"
                :coin-icon="cosmosConfig[chainId].coinLookup.icon"
              />            
            </v-col>
          </v-row>  
        </v-card-text>

        <v-card-actions>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>    
  </v-row>
</template>

<script>
import { mapState } from "vuex";

import cosmosConfig from "~/cosmos.config";
import { notifWaiting, notifError, notifSuccess } from "~/libs/notifications";
import {
  assertIsDeliverTxSuccess,
  SigningStargateClient,
} from "@cosmjs/stargate";

export default {
  data: () => ({
    cosmosConfig: cosmosConfig,
    dialog: false,
    selected: [],
    dataLoaded: false,
    getStatus: "active",
    orderVal: true,
    dislableBtnAll: false,
    dislableBtnActive: true,
    selectedValidator: "",
    myTotalUnDelegation: 0,
    headersUndbound: [
      {
        text: "From",
        align: "start",
        sortable: false,
        value: "validator_address",
      },
      { text: "Amount", value: "entries[0].balance" },
      { text: "Completion Time", value: "entries[0].completion_time" },
    ],
    headersRedelegate: [
      {
        text: "From",
        align: "start",
        sortable: false,
        value: "redelegation.validator_src_address",
      },
      { text: "Amount", value: "entries[0].balance" },
      {
        text: "Completion Time",
        value: "entries[0].redelegation_entry.completion_time",
      },
    ],
  }),
  computed: {
    ...mapState("keplr", [
      `accounts`,
      `initialized`,
      `error`,
      `logged`,
      `logout`,
    ]),
    ...mapState("data", [
      "chainId",
      "balances",
      "rewards",
      "delegations",
      "priceNow",
      "totalBonded",
      "validators",
      "balancesPrice",
      "totalWalletPrice",
      "allUnbonding",
      "allRedelegate",
      "validatorDetails",
      "validatorDelegations",
      "validatorUnDelegations",
      "validatorRewards",
    ]),
  },
  watch: {
    orderVal: function (val) {  
      if (val === true) {
        this.getStatus = "active";
      } else {
        this.getStatus = "all";
      }            
    },
  },  
  async mounted() {

    await this.$store.dispatch("keplr/checkLogin");
    if (!this.logged) {
      this.$router.push({ path: "/login" });
      return;
    }
    await this.$store.dispatch("data/getDelegations", this.accounts[0].address);
    this.dataLoaded = true;   
  },
  methods: {
    async selectValidator(validator) {
      this.dialog = true
      this.selectedValidator = validator;
      await this.$store.dispatch("data/getValidatorDetails", validator.op_address);

      if (this.logged) {
        await this.$store.dispatch("data/getValidatorDelegation", {
          validatorAddr: validator.op_address,
          delegatorAddr: this.accounts[0].address,
        });
        await this.$store.dispatch("data/getValidatorUnDelegations", {
          validatorAddr: validator.op_address,
          delegatorAddr: this.accounts[0].address,
        });  
        await this.$store.dispatch("data/getValidatorRewards", {
            validatorAddr: validator.op_address,
            delegatorAddr: this.accounts[0].address,
        }); 
      }
    },
    getReward(addrValidator) {
      (async () => {
        const chainId = cosmosConfig[this.chainId].chainId;
        await window.keplr.enable(chainId);
        const offlineSigner = await window.getOfflineSignerAuto(chainId);

        const accounts = await offlineSigner.getAccounts();
        const client = await SigningStargateClient.connectWithSigner(
          cosmosConfig[this.chainId].rpcURL,
          offlineSigner
        );
        const fee = {
          amount: [
            {
              denom: cosmosConfig[this.chainId].chainDenom,
              amount: "5000",
            },
          ],
          gas: "200000",
        };

        const returnWaiting = notifWaiting(this.$toast);
        try {
          const result = await client.withdrawRewards(
            accounts[0].address,
            addrValidator,
            fee,
            ""
          );
          assertIsDeliverTxSuccess(result);
          this.$toast.dismiss(returnWaiting);
          notifSuccess(this.$toast, result.transactionHash);
          await this.$store.dispatch(
            "data/getDelegations",
            accounts[0].address
          );
        } catch (error) {
          console.error(error);

          this.$toast.dismiss(returnWaiting);
          notifError(this.$toast, error);
        }
      })();
    },
    formatDate(dateStr) {
      return Intl.DateTimeFormat("us-EN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      }).format(new Date(dateStr))
    }, 
  },
};
</script>
<style>
/* .v-dialog {
  position: absolute;
  bottom: 0;
  right: 0;
} */

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
.myValidator {
  height: 90px !important;
} 
.linkFormat {
 
  text-decoration: none; 
}
.box {
   display: flex;
   align-items:center;
}


</style> 