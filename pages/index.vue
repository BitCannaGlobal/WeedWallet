<template>
  <v-row>
    <v-col
      v-if="layout"
      cols="12"
    >
      <sequential-entrance>
        <v-row justify="space-around">
          <v-col class="text-h6 text-md-h5 text-lg-h4">
            Wallet Statistics
          </v-col>
          <v-col>
            <SendModal
              class="text-right"
              :chain-id-props="cosmosConfig[chainId].coinLookup.addressPrefix"
              :amount-available="balances / 1000000"
              :coin-icon="cosmosConfig[chainId].coinLookup.icon"
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
                <h4 class="icon">
                  <v-img src="icon/wallet.png" />
                  &ensp; Wallet value
                </h4>
              </v-card-title>
              <v-card-text class="text-right text-h5">
                ${{ totalWalletPrice }}
                <v-tooltip top>
                  <template #activator="{ on, attrs }">
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
                    - Available<br>
                    - Delegated<br>
                    - Unbonding<br>
                    - Reward<br>
                  </span>
                </v-tooltip>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="accent">
              <v-card-title class="headline">
                <h4 class="icon">
                  <img src="icon/tokens.png">
                  &ensp; BCNA price
                </h4>
              </v-card-title>
              <v-card-text class="text-right text-h5">
                ${{ priceNow }}
                <v-tooltip top>
                  <template #activator="{ on, attrs }">
                    <v-icon
                      class="mt-n1"
                      color="#00b786"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-information-slab-circle-outline
                    </v-icon>
                  </template>
                  <span> Proudly powered by BCNAracle 💚 </span>
                </v-tooltip>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="accent">
              <v-card-title class="headline">
                <h4 class="icon">
                  <img src="icon/apr.png">
                  &ensp; APR
                </h4>
              </v-card-title>
              <v-card-text class="text-right text-h5">
                {{ aprNow }}%
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </sequential-entrance>

      <sequential-entrance from-bottom>
        <v-row class="mt-4">
          <v-col>
            <v-card
              class="accent"
              min-height="400"
            >
              <v-card-title class="headline">
                <v-icon class="mr-2">
                  mdi-wallet-outline
                </v-icon> Price history
              </v-card-title>
              <v-card-text>
                <ChartsBar />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              class="accent"
              min-height="400"
            >
              <v-card-title class="headline">
                <v-icon class="mr-2">
                  mdi-wallet-outline
                </v-icon> Wallet
                distribution
              </v-card-title>
              <v-card-text>
                <v-row
                  align="center"
                  justify="center"
                >
                  <v-col>
                    <ChartsDoughnut
                      v-if="
                        Number(balances) > 0 ||
                          rewards.amount > 0 ||
                          totalDelegated > 0 ||
                          totalUnbound > 0
                      "
                      :amount="Number(balances)"
                      :rewards-doughnut="rewards.amount"
                      :total-delegated="totalDelegated"
                      :total-unbound="totalUnbound"
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
                            Available
                          </td>
                          <td>
                            {{ (balances / 1000000).toFixed(6) }}
                            {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <v-icon
                              color="#33ffc9"
                              small
                            >
                              mdi-circle
                            </v-icon>
                            Delegated
                          </td>
                          <td>
                            {{ (totalDelegated / 1000000).toFixed(6) }}
                            {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <v-icon
                              color="#00b383"
                              small
                            >
                              mdi-circle
                            </v-icon>
                            Unbonding
                          </td>
                          <td>
                            {{ (totalUnbound / 1000000).toFixed(6) }}
                            {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <v-icon
                              color="#004d38"
                              small
                            >
                              mdi-circle
                            </v-icon>
                            Staking Reward
                          </td>
                          <td>
                            {{ (rewards.amount / 1000000).toFixed(6) }}
                            {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <v-icon
                              color="#00b786"
                              small
                            >
                              mdi-circle
                            </v-icon>
                            Total
                          </td>
                          <td>
                            {{ totalWallet }}
                            {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                          </td>
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
      <sequential-entrance />

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
      v-else
      cols="12"
    >
      <v-col class="ml-6 mb-6 text-h6 text-md-h5 text-lg-h4">
        {{ accounts[0].walletName }}'s portfolio
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
                    <span class="text-h6 text-md-h5 text-lg-h4">
                      {{ (balances / 1000000).toFixed(2) }}
                      {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                    </span>
                    <br>
                    <span class="text-h6"> ${{ totalWalletPrice }} </span>
                    <br>

                    <v-row class="mt-1">
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
                      color="#00b786"
                      rounded
                    >
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
                        <br><br>
                        <span class="mt-2"> {{ accounts[0].walletName }}'s portfolio</span> <br>
                        <span class="text-caption">
                          {{ accounts[0]?.address }}
                        </span>
                      </v-card>
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-col class="mt-4 ml-8 mb-6 text-h6 text-md-h5 text-lg-h4">
              Transactions
            </v-col>
            <template v-for="group in groupedEvents()">
              <div>
                <h3>{{ group[0].section }}</h3>
                
                <v-card
                  v-for="item in group"  
                  class="ma-2 pa-4 accent"
                  width="700"
                  min-height="50"
                >
                  <!-- {{ item }}  -->
                  <v-row
                    justify="space-around"
                    class="data-row"
                  >
                    <v-col>
                      <v-chip
                        class="mb-2"
                        :color="item.final.color"
                        outlined
                        label
                      >
                        {{ item.final.typeReadable }}
                      </v-chip>
                      <br>
                      {{ formatDate(item.final.timestamp) }}
                    </v-col>
                    <v-col
                      v-if="item.final.msgData.amount"
                      class="mt-4 text-right"
                    >
                      {{ item.final.msgData.amount }} BCNA
                    </v-col>
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
                    <span class="text-h6 text-md-h5 text-lg-h4">
                      Available to stake
                    </span>
                    <br>
                    <span class="text-h6">
                      {{ (balances / 1000000).toFixed(6) }}
                      {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                    </span>
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
                    <span class="text-h6 text-md-h5 text-lg-h4">
                      Your rewards
                    </span>
                    <br>
                    <span class="text-h6">
                      {{ (rewards.amount / 1000000).toFixed(6) }}
                      {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                    </span>
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

    <v-row justify="center">
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
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import dayjs from "dayjs";
import { reverse, sortBy, orderBy, uniqWith, groupBy } from "lodash";
import { setMsg } from "~/libs/msgType";
import cosmosConfig from "~/cosmos.config";

const categories = [
  {
    section: "Today",
    matcher: (event) => {
      console.log(dayjs(event.timestamp).isSame(dayjs(), "day"));
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
    rpcAllTxs: "",
    dialog: false,
    isCopied: false,
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
      "layout",
      "chainId",
      "balances",
      "rewards",
      "delegations",
      "allTxs",
      "allTxsLoaded",
      "priceNow",
      "aprNow",
      "totalDelegated",
      "balancesPrice",
      "totalUnbound",
      "totalWalletPrice",
      "totalWallet",
      "validators",
      "validatorsLoaded"
    ]),
  },
  watch: {},
  async mounted() {
    await this.$store.dispatch("keplr/checkLogin");
    if (!this.logged) {
      this.$router.push({ path: "/login" });
    }
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
      return this.allTxs.map((event) => {
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
