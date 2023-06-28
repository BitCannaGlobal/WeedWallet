<template>
  <v-row>
    <v-col
      cols="12"
    >
      <v-col class="ml-6 mb-6">
        <h1>{{ accounts[0].walletName }}'s portfolio</h1>
      </v-col>

      <sequential-entrance>
        <v-row>
          <v-col
            class="fill-height d-flex flex-column justify-center align-center"
          >
            <v-card
              class="pa-4 accent"
              width="700"
              min-height="220"
            >
              <v-card-text>
                <v-row>
                  <v-col md="6">
                    Main account<br>
                    <h1 class="mt-2 carmenBold">
                      {{ (balances / 1000000).toFixed(2) }}
                      {{ cosmosConfig[chainId].coinLookup.viewDenom }}  
                    </h1>
                    <h3 class="mt-2">
                      ${{ totalWalletPrice }}
                    </h3>

                    <v-row class="mt-2">
                      <v-col md="6">
                        <SendModal
                          class="text-right"
                          :chain-id-props="
                            cosmosConfig[chainId].coinLookup.addressPrefix
                          "
                          :amount-available="balances / 1000000"
                          :coin-icon="cosmosConfig[chainId].coinLookup.icon"
                          type="simpleSend"
                        />
                      </v-col>
                      <v-col md="6">
                        <v-btn
                          large
                          block
                          class="mt-2 green--text"
                          color="white"
                          @click.stop="dialog = true"
                        >
                          Receive
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col md="6">
                    <v-sheet
                      outlined
                      color="white"
                      rounded
                    >
                      <v-card
                        class="pa-2 accent"
                        outlined
                        tile
                        height="160"
                      >
                        <img
                          src="BCNA-LOGO-C.svg"
                          alt="bcna"
                          height="40"
                          width="40"
                        >
                        <br><br>
                        <span class="mt-2"> {{ accounts[0].walletName }}'s portfolio</span> <br>
                        <span class="text-caption">
                          {{ accounts[0]?.address }}
                        </span>
                      </v-card>
                    </v-sheet>
                  </v-col>
                </v-row>
                <v-row class="justify-end">
                  <v-icon 
                    class="mt-n1 mr-2"
                    @click="walletDistribution = !walletDistribution"
                  >
                    mdi-chevron-down
                  </v-icon>   
                </v-row>              
                <v-divider
                  v-if="walletDistribution"
                  class="mt-6 mb-6"
                />
 
                <v-row
                  v-if="walletDistribution"
                  no-gutters
                >
                  <v-col 
                    cols="12"
                    sm="6"
                  >                   
                    <v-row no-gutters>
                      <v-col> 
                        <v-icon
                          color="#0EB584"
                          small
                          class="mt-n1"
                        >
                          mdi-circle
                        </v-icon>
                        Available 
                      </v-col>
                      <v-col> 
                        {{ (balances / 1000000).toFixed(6) }}
                        {{ cosmosConfig[chainId].coinLookup.viewDenom }}  
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col> 
                        <v-icon
                          color="#79FFD8"
                          small
                          class="mt-n1"
                        >
                          mdi-circle
                        </v-icon>
                        Delegated 
                      </v-col>
                      <v-col> 
                        {{ (totalDelegated / 1000000).toFixed(6) }}
                        {{ cosmosConfig[chainId].coinLookup.viewDenom }}  
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col> 
                        <v-icon
                          color="#FFFFFF"
                          small
                          class="mt-n1"
                        >
                          mdi-circle
                        </v-icon>
                        Vested 
                      </v-col>
                      <v-col> 
                        0
                        {{ cosmosConfig[chainId].coinLookup.viewDenom }}  
                      </v-col>
                    </v-row>  
                  </v-col>
                  <v-col 
                    cols="12"
                    sm="6"
                  >
                    <v-row no-gutters>
                      <v-col> 
                        <v-icon
                          color="#FF7E7E"
                          small
                          class="mt-n1"
                        >
                          mdi-circle
                        </v-icon>
                        Unbouding 
                      </v-col>
                      <v-col> 
                        {{ (totalUnbound / 1000000).toFixed(6) }} 
                        {{ cosmosConfig[chainId].coinLookup.viewDenom }}  
                      </v-col>
                    </v-row> 
                    <v-row no-gutters>
                      <v-col> 
                        <v-icon
                          color="#006C4C"
                          small
                          class="mt-n1"
                        >
                          mdi-circle
                        </v-icon>
                        Rewards 
                      </v-col>
                      <v-col> 
                        {{ (rewards.amount / 1000000).toFixed(6) }}
                        {{ cosmosConfig[chainId].coinLookup.viewDenom }}  
                      </v-col>
                    </v-row>  
                  </v-col> 
                </v-row> 
              </v-card-text>
            </v-card>

            <v-col class="mt-4 ml-9 mb-6"> 
              <h1 style="text-align:left; float:left;">
                Transactions
              </h1>
              <p
                class="mt-4 mr-10"
                style="text-align:right;"
              >
                <NuxtLink to="/transactions"> 
                  See all transactions 
                </NuxtLink>
              </p>
            </v-col>
            <template v-for="group in groupedEvents()">
              <div>
                <h3 class="ml-2">
                  {{ group[0].section }}
                </h3>
                
                <v-card
                  v-for="item in group"  
                  class="ma-2 pa-4 accent"
                  width="700"
                  min-height="50"
                >
                  <!-- {{ item }}  -->
                  <v-row 
                    class="data-row"
                  >
                    <v-col cols="3">
                      <v-chip
                        class="mb-2"
                        :color="item.final.color"
                        outlined
                        label
                      >
                        {{ item.final.typeReadable }}
                      </v-chip> 
                    </v-col>
                    <v-col
                      cols="4"
                      class="mt-2"
                    >
                      {{ formatDate(item.final.timestamp) }}
                    </v-col>
                    <v-col
                      v-if="item.final.msgData.amount"
                      cols="2"
                      class="mt-2 text-right"
                    >
                      {{ item.final.msgData.amount }} BCNA
                    </v-col>
                    <v-col
                      v-else
                      cols="2"
                      class="mt-2 text-right"
                    />
                  </v-row>
                </v-card>
                <!-- {{ group }} -->
              </div>
            </template>
          </v-col>
          <v-divider
            class="mx-4"
            vertical
          />

          <v-col
            class="fill-height d-flex flex-column justify-center align-center"
          >
            <v-card
              class="accent"
              width="700"
              min-height="220"
            >
              <v-card-title class="headline">
                <v-col class="mt-2">
                  <h4 class="icon">
                    <img src="icon-stake.png">
                  </h4>
                </v-col>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col class="mt-2">
                    <span>
                      <h1>Available to stake</h1>
                    </span>
                    <br>
                    <h2>
                      {{ (balances / 1000000).toFixed(6) }}
                      {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                    </h2>
                  </v-col>
                  <v-col class="mt-2 text-right">
                    <span class="text-h6 text-md-h5 text-lg-h4">
                      <!-- <v-btn
                        large
                        min-width="200"
                        class="mt-2 white--text"
                        color="#0FB786"
                      >
                        Stake
                      </v-btn> -->
                      <DelegateHomeModal
                        v-if="logged"
                        :chain-id-props="cosmosConfig[chainId].coinLookup.addressPrefix"
                        :balances="balances"
                      />                      
                    </span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card
              class="mt-6 accent"
              width="700"
              min-height="220"
            >
              <v-card-title class="headline">
                <v-col class="mt-2">
                  <h4 class="icon">
                    <img src="icon-reward.png">
                  </h4>
                </v-col>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col class="mt-2">
                    <span>
                      <h1>Your rewards</h1>
                    </span>
                    <br>
                    <h2>
                      {{ (rewards.amount / 1000000).toFixed(6) }}
                      {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                    </h2>
                  </v-col>
                  <v-col class="mt-2 text-right">
                    <span class="text-h6 text-md-h5 text-lg-h4">
                      <!--                       <v-btn
                        large
                        min-width="200"
                        class="mt-2 white--text"
                      >
                        Claim
                      </v-btn> -->
                      <ClaimAllModal
                        v-if="rewards.amount > 0"
                        :amount-claim-all="(rewards.amount / 1000000).toFixed(6)"
                        :get-all-delegation="delegations"
                        :home-page="true"
                      />                      
                    </span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </sequential-entrance>
    </v-col>
    <v-dialog
      id="qrcode"
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5">
          Receive
          <v-spacer />
          <v-icon
            class="mr-2"
            @click="dialog = false"
          >
            mdi-close-circle
          </v-icon>
        </v-card-title>

        <v-card-text align="center">
          <span><qr-code
            class="mb-2 mt-2"
            :text="accounts[0]?.address"
          /></span>
          <v-chip
            color="#00b786"
            outlined
            label 
            @click="copyAddr(accounts[0].address)"
          >
            {{ accounts[0]?.address }}
          </v-chip>
          <span
            v-if="isCopied"
            class="ml-2"
          >Address copied!</span>          
        </v-card-text> 
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import dayjs from "dayjs";
import { reverse, sortBy, orderBy, uniqWith, groupBy } from "lodash";
import { setMsg } from "~/libs/msgType";
import cosmosConfig from "~/cosmos.config";

const categories = [
  {
    section: "Today",
    matcher: (event) => { 
      // tests if the timestamp has the same day as today
      return dayjs(event.timestamp).isSame(dayjs(), "day");
    },
  },
  {
    section: "Yesterday",
    matcher: (event) => {
      return dayjs(event.timestamp).isSame(dayjs().subtract(1, "days"), "day");
    },
  },
];

export default {
  layout: "blog",
  data: () => ({
    cosmosConfig: cosmosConfig,
    rpcAllTxs: [],
    dialog: false,
    isCopied: false,
    walletDistribution: false
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
      "balances",
      "chainId",
      "totalWalletPrice",
      "rewards",
      "delegations",
      "allTxs",
      "allTxsLoaded",
      "validators",
      "validatorsLoaded",
      "totalDelegated",
      "totalUnbound",
    ]),
  },
  watch: {},
  async mounted() {
    await this.$store.dispatch("keplr/checkLogin");
    await this.$store.dispatch("data/getAllValidators");
    if (!this.logged) {
      this.$router.push({ path: "/login" });
    }
    const resultSender = await axios(
        cosmosConfig[0].apiURL +
          "/cosmos/tx/v1beta1/txs?events=message.sender=%27" +
          this.accounts[0].address +
          "%27&limit=" +
          cosmosConfig[this.chainId].maxTxSenderHome +
          "&order_by=2"
      );
      const resultRecipient = await axios(
        cosmosConfig[0].apiURL +
          "/cosmos/tx/v1beta1/txs?events=transfer.recipient=%27" +
          this.accounts[0].address +
          "%27&limit=" +
          cosmosConfig[this.chainId].maxTxRecipientHome +
          "&order_by=2"
      );
      const finalTxs = resultSender.data.tx_responses.concat(
        resultRecipient.data.tx_responses
      );

      this.rpcAllTxs = this.transactionsReducer(finalTxs);
      this.loading = false;
      this.firstLoad = false;
  },

  methods: {
    transactionsReducer(txs) {
      const duplicateFreeTxs = uniqWith(txs, (a, b) => a.txhash === b.txhash);
      const sortedTxs = sortBy(duplicateFreeTxs, ["timestamp"]);
      const reversedTxs = reverse(sortedTxs);

      reversedTxs.forEach(async (item, i) => {
        reversedTxs[i].messageInfo = this.getMessageType(
          item.tx.body.messages[0]
        );
      });
      //console.log(reversedTxs)
      // here we filter out all transactions related to validators
      return reversedTxs.reduce((collection, transaction) => {
        return collection.concat(transaction);
      }, []);
    },
    groupedEvents() {
      if (this.allTxsLoaded && this.validatorsLoaded) {
        const test = orderBy(
          groupBy(this.categorizedEvents(), "section"),
          (group) => group[0].final.timestamp,
          "desc"
        );

        return test;
      }
    },
    categorizedEvents() {
      return this.rpcAllTxs.map((event) => {
        // check if the tx is in Today, Yesterday or Last Week
        const dateString =
          ` (` + dayjs(event.timestamp).format("MMMM D, YYYY") + `)`;

        const category = categories.find(({ matcher }) => matcher(event));

        if (category) {
          const final = this.getMessageType(
            event.tx.body.messages[0],
            event.timestamp
          );
          return {
            section: category.section + dateString,
            final,
          };
        }

        // check if tx is in a month this year
        const date = dayjs(event.timestamp);
        const today = dayjs();
        if (date.year() === today.year()) {
          const final = this.getMessageType(
            event.tx.body.messages[0],
            event.timestamp
          );
          return {
            section: date.format("MMMM D, YYYY"),
            final,
          };
        }

        // tx is in a month another year
        const final = this.getMessageType(
          event.tx.body.messages[0],
          event.timestamp
        );
        return {
          section: date.format("MMMM D, YYYY"),
          final,
        };
      });
    },
    getMessageType(msg, timestamp) { 
      const typeReadable = setMsg(msg, this.accounts[0].address, timestamp, this.validators);
      return typeReadable;
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
    async copyAddr(text) {
      await this.$copyText(text);
      this.isCopied = true;
      setTimeout(this.hideCopy, 4000);
    },  
    hideCopy() {
      this.isCopied = false;
    },
  }
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
@media (min-width: 1200px) {
  .data-row {
    display: flex;
    justify-content: space-between;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
