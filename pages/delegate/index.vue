<template>
  <div
    v-if="store.logged"
    class="ma-6"
  >
    <v-row class="ma-2">
      <h1>
        Delegate 
      </h1>
      <v-spacer /> 
      <!-- <ClaimAllModal
        v-if="rewards.amount > 0"
        :amount-claim-all="(rewards.amount / 1000000).toFixed(6)"
        :get-all-delegation="delegations"
        :home-page="true"
      /> -->
      <ClaimAllModal 
        :amount-claim-all="0"
        :get-all-delegation="delegations"
        :home-page="false"
      /> 
    </v-row>
    <v-col cols="12">
      <v-divider class="mb-6" />
 
      <v-row justify="space-around">
        <v-col>
          <span class="text-h5">My validators</span>
          <v-table
            theme="dark"
            class="table rounded"
          >
            <template #default>                   
              <tbody>
                <tr
                  v-for="item in store.allMyDelegations"
                  :key="item.validatorName"
                  class="myValidator"
                >
                  <td style="">
                    <router-link
                      :to="'/validators/' + item.op_address"
                      class="linkFormat box"
                    >
                      <v-avatar size="48">
                        <v-img
                          :src="'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/bitcanna/moniker/'+item.op_address+'.png'" 
                          :alt="item.validatorName" 
                        /> 
                      </v-avatar>
                      <span class="ml-8"><h3>{{ item.validatorName }}</h3></span> 
                    </router-link>
                  </td>
                  <td style="text-align: right;">
                    <span class="mr-4 carmenBold">
                      {{ Number(item.delegated / 1000000).toFixed(2) }}
                      <span
                        color="#00BB82"
                        class="text-greenbcna carmenBold"
                      >
                        +{{ Number(item.reward).toFixed(2) }}                             
                      </span>
                    </span>
                    <v-chip
                      v-if="item.status === 'BOND_STATUS_BONDED'"
                      class="ma-2"
                      color="#00b786"
                      label
                      variant="flat"
                    >
                      Active
                    </v-chip>
                    <v-chip
                      v-else
                      class="ma-2"
                      color="red"
                      label
                      variant="flat"
                    >
                      Inactive
                    </v-chip> 
                  </td>
                </tr>
              </tbody>
            </template>
          </v-table>
        </v-col>
      </v-row> 

      <!--         <v-row
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
 -->
      <v-row 
        justify="space-around"
      >
        <v-col>
          <span class="text-h5">All validators</span>
          <v-card class="accent">
            <template #append>
              <v-switch
                v-model="orderVal"
                color="#00b786"
                :label="`View ${getStatus.toString()}`"
              />
            </template>
            <v-card-text>
              <AllValidators :get-status="getStatus" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script>
//import { mapState } from "vuex";
import { useAppStore } from '@/stores/data'
import cosmosConfig from "~/cosmos.config";
//import { notifWaiting, notifError, notifSuccess } from "~/libs/notifications";
import {
  assertIsDeliverTxSuccess,
  SigningStargateClient,
} from "@cosmjs/stargate";

export default {
  setup() {
    const store = useAppStore()

    return {
      store
    }
  },
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
    /* ...mapState("keplr", [
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
    ]), */
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

    /* await this.$store.dispatch("keplr/checkLogin");
    if (!this.logged) {
      this.$router.push({ path: "/login" });
      return;
    }
    await this.$store.dispatch("data/getDelegations", this.accounts[0].address);
    this.dataLoaded = true;    */
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
/* rounded corners */
.rounded {
    --radius: 5px;
 
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    border-spacing: 0;
}
.rounded tr:first-child>:first-child { border-top-left-radius: var(--radius); }
.rounded tr:first-child>:last-child { border-top-right-radius: var(--radius); }
.rounded tr:last-child>:first-child { border-bottom-left-radius: var(--radius); }
.rounded tr:last-child>:last-child { border-bottom-right-radius: var(--radius); }

.table {
  background-color: #1C1D20;
}

</style> 