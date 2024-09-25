<template>
  <div v-if="store.logged">
    <v-col
      cols="12"
    >
      <v-col class="ml-4 mt-6 mb-6">
        <!-- <h1>        <img
          src="/keplr.png"
          alt="bcna"
          height="40"
          width="40"
        >{{ store.nameWallet }}'s portfolio</h1> -->
 
        <v-list-item
          :class="windowWidth > 1755 ? 'background' : 'background fill-height d-flex flex-column'"  
          :prepend-avatar="store.loggedType + '.svg'" 
        >
          <h1>{{ store.nameWallet }}'s portfolio</h1>
        </v-list-item> 
      </v-col>
      <!-- {{ windowHeight }}, {{ windowWidth }} -->
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
                <v-col
                  md="6"
                  class="text-textbcna"
                >
                  Main account<br>
                  <h1 class="mt-2 carmenBold">
                    {{ store.totalTokens }}
                    {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}  
                  </h1>
                  <h3 class="mt-2">
                    ${{ store.fiatWalletValue }}
                  </h3>

                  <v-row class="mt-2">
                    <v-col md="6">
                      <!-- <actionsModals 
                          type="sendTokens" 
                          :spendableBalances="store.spendableBalances" 
                          :chain="cosmosConfig[store.chainSelected]" 
                        />  -->
                      <SendModal
                        class="text-right"
                        :chain-id-props="
                          cosmosConfig[store.chainSelected].coinLookup.addressPrefix
                        "
                        :amount-available="store.spendableBalances"
                        :coin-icon="cosmosConfig[store.chainSelected].coinLookup.icon"
                        type="simpleSend"
                      />
                    </v-col>
                    <v-col md="6">
                      <v-btn
                        size="large" 
                        block
                        class="mt-5 text-teal-accent-3"
                        color="white"
                        @click.stop="dialogReceive = true"
                      >
                        Receive
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col md="6">
                  <v-card
                    class="pa-2 accent" 
                    variant="outlined"
                    height="160"
                  >
                    <img
                      src="https://wallet.bitcanna.io/BCNA-LOGO-C.svg"
                      alt="bcna"
                      height="40"
                      width="40"
                    >
                    <br><br>
                    <span class="mt-2"> {{ store.nameWallet }}'s portfolio</span> <br>
                    <span class="text-caption">
                      {{ store.addrWallet }}
                    </span>
                  </v-card> 
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
                  <v-row
                    no-gutters
                    class="ma-2"
                  >
                    <v-col> 
                      <v-icon
                        color="#0EB584"
                        size="small"
                        class="mt-n1"
                      >
                        mdi-circle
                      </v-icon>
                      Available 
                    </v-col>
                    <v-col> 
                      {{ store.spendableBalances }}
                      {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}  
                    </v-col>
                  </v-row>
                  <v-row
                    no-gutters
                    class="ma-2"
                  >
                    <v-col> 
                      <v-icon
                        color="#79FFD8"
                        size="small"
                        class="mt-n1"
                      >
                        mdi-circle
                      </v-icon>
                      Delegated 
                    </v-col>
                    <v-col> 
                      {{ store.totalDelegations }}
                      {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}  
                    </v-col>
                  </v-row>
                  <v-row
                    no-gutters
                    class="ma-2"
                  >
                    <v-col> 
                      <v-icon
                        color="#FFFFFF"
                        size="small"
                        class="mt-n1"
                      >
                        mdi-circle
                      </v-icon>
                      Vested 
                    </v-col>
                    <v-col> 
                      0
                      {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}  
                    </v-col>
                  </v-row>  
                </v-col>
                <v-col 
                  cols="12"
                  sm="6"
                >
                  <v-row
                    no-gutters
                    class="ma-2"
                  >
                    <v-col> 
                      <v-icon
                        color="#FF7E7E"
                        size="small"
                        class="mt-n1"
                      >
                        mdi-circle
                      </v-icon>
                      Unbonding 
                    </v-col>
                    <v-col> 
                      {{ store.totalUnbound }} 
                      {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}  
                    </v-col>
                  </v-row> 
                  <v-row
                    no-gutters
                    class="ma-2"
                  >
                    <v-col> 
                      <v-icon
                        color="#006C4C"
                        size="small"
                        class="mt-n1"
                      >
                        mdi-circle
                      </v-icon>
                      Rewards 
                    </v-col>
                    <v-col> 
                      {{ store.totalRewards }}
                      {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}  
                    </v-col>
                  </v-row>  
                </v-col> 
              </v-row> 
            </v-card-text>
          </v-card>

          <v-col class="mt-6 fill-height d-flex flex-column "> 
            <h1
              class="ml-7"
            >
              Transactions
            </h1>
            <p
              class="mt-4 mr-9"
              style="text-align:right;"
            >
              <NuxtLink to="/transactions"> 
                See all transactions 
              </NuxtLink>
            </p>
          </v-col>
          <template v-for="group in groupedEvents()">
            <div class="text-textbcna">
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
                      variant="outlined"
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
                    v-if="item.final.msgData?.amount"
                    cols="2"
                    class="mt-2 text-right"
                  >
                    {{ item.final.msgData?.amount }} BCNA
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
          v-if="windowWidth > 1755"
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
                  <img src="https://wallet.bitcanna.io/icon-stake.png">
                </h4>
              </v-col>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col class="mt-2">
                  <span>
                    <h1 class="text-textbcna">Available to stake</h1>
                  </span>
                  <br>
                  <h2 class="text-textbcna">
                    {{ store.spendableBalances }}
                    {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}
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
                      v-if="store.logged"
                      :chain-id-props="cosmosConfig[store.chainSelected].coinLookup.addressPrefix"
                      :amount-available="store.spendableBalances"
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
                  <img src="https://wallet.bitcanna.io/icon-reward.png">
                </h4>
              </v-col>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col class="mt-2">
                  <span>
                    <h1 class="text-textbcna">Your rewards</h1>
                  </span>
                  <br>
                  <h2 class="text-textbcna">
                    {{ store.totalRewards }}
                    {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}
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
                      :amount-claim-all="0"
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
    </v-col>
    <v-dialog
      v-model="dialogReceive"
      max-width="450px"
    >
      <v-card>
        <v-toolbar
          color="rgba(0, 0, 0, 0)"
          theme="dark"
          align="center"
        >
          <template #prepend>
            <v-avatar>
              <v-img
                max-width="32"
                max-height="32"
                :src="cosmosConfig[store.chainSelected].coinLookup.icon"
                alt="Bitcanna"
              />
            </v-avatar>
          </template>

          <v-toolbar-title class="carmenBold">
            <v-tabs
              v-model="tab" 
              class="ma-4"
            >
              <v-tab value="one">
                Address
              </v-tab>
              <v-tab value="two">
                Mobile Tx
              </v-tab> 
            </v-tabs>
          </v-toolbar-title>

          <template #append>
            <v-btn
              icon="mdi-close"
              @click="dialogReceive = false"
            />
          </template>
        </v-toolbar>  


        <v-card-text align="center">
          <v-window v-model="tab">
            <v-window-item value="one"> 
              <QRCodeVue3                
                :width="256"
                :height="256"
                :value="store.addrWallet"
                :qr-options="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }" 
                :dots-options="{
                  type: 'dots',
                  color: '#3CC194',
                  gradient: {
                    type: 'linear',
                    rotation: 0,
                    colorStops: [
                      { offset: 0, color: '#3CC194' },
                      { offset: 1, color: '#3CC194' },
                    ],
                  },
                }"
                :background-options="{ color: '#ffffff' }"
                :corners-square-options="{ type: 'dot', color: '#000000' }"
                :corners-dot-options="{ type: undefined, color: '#000000' }"    
              />
              <v-chip
                class="mb-4 mt-4 ml-3"
                color="#00b786"
                variant="outlined"
                label 
                @click="copyAddr(store.addrWallet)"
              >
                {{ store.addrWallet }}
              </v-chip>             
            </v-window-item>

            <v-window-item value="two">
              Soon!
            </v-window-item> 
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>



    <!--    <QRCodeVue3
          :width="200"
          :height="200"
          value="https://scholtz.sk"
          :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }" 
          :dotsOptions="{
            type: 'dots',
            color: '#26249a',
            gradient: {
              type: 'linear',
              rotation: 0,
              colorStops: [
                { offset: 0, color: '#26249a' },
                { offset: 1, color: '#26249a' },
              ],
            },
          }"
          :backgroundOptions="{ color: '#ffffff' }"
          :cornersSquareOptions="{ type: 'dot', color: '#000000' }"
          :cornersDotOptions="{ type: undefined, color: '#000000' }"
          fileExt="png"
          :download="true"
          myclass="my-qur"
          imgclass="img-qr"
          downloadButton="my-button"
          :downloadOptions="{ name: 'vqr', extension: 'png' }"
          
        /> -->
  </div>
</template>

<script>
import { useAppStore } from '@/stores/data'
import axios from "axios"
import dayjs from "dayjs"
import QRCodeVue3 from "qrcode-vue3"
import useClipboard from '~/composables/useClipboard'
 
import { reverse, sortBy, orderBy, uniqWith, groupBy } from "lodash"


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
  components: {
    QRCodeVue3 
  },
  layout: "blog",
  setup() {

    const store = useAppStore()
    return {
      store
    }
  },
  data: () => ({
    cosmosConfig: cosmosConfig,
    rpcAllTxs: [],
    dialog: false,
    isCopied: false,
    walletDistribution: false,
    dialogReceive: false,
    tab: null,
    windowHeight: '',
    windowWidth: '',

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
      "balances",
      "chainId",
      "totalWallet",
      "totalWalletPrice",
      "rewards",
      "delegations",
      "allTxs",
      "allTxsLoaded",
      "validators",
      "validatorsLoaded",
      "totalDelegated",
      "totalUnbound",
    ]), */
  },
  
  watch: {},
  async mounted() {
    this.windowHeight = window.innerHeight
    this.windowWidth = window.innerWidth;

    window.addEventListener('resize', () => {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth;
    })
    const resultSender = await axios(
        cosmosConfig[this.store.chainSelected].apiURL +
          "/cosmos/tx/v1beta1/txs?query=message.sender=%27" +
          this.store.addrWallet +
          "%27&limit=" +
          cosmosConfig[this.store.chainSelected].maxTxSenderHome +
          "&order_by=2"
      );
      const resultRecipient = await axios(
        cosmosConfig[this.store.chainSelected].apiURL +
          "/cosmos/tx/v1beta1/txs?query=transfer.recipient=%27" +
          this.store.addrWallet +
          "%27&limit=" +
          cosmosConfig[this.store.chainSelected].maxTxRecipientHome +
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
      // here we filter out all transactions related to validators
      return reversedTxs.reduce((collection, transaction) => {
        return collection.concat(transaction);
      }, []);
    },
    groupedEvents() { 
        const test = orderBy(
          groupBy(this.categorizedEvents(), "section"),
          (group) => group[0].final.timestamp,
          "desc"
        );

        return test; 
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
      const typeReadable = setMsg(msg, this.store.addrWallet, timestamp, this.store.allValidators);
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
      const { toClipboard } = useClipboard()
      await toClipboard(text)
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
