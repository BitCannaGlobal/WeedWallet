<template>
  <div>
    <v-card
      v-if="logged"
      class="mt-2 mx-auto"
      color="#000000"
    >
      <v-row justify="space-around">
        <v-col>
          <v-card
            class="accent"
            min-height="400"
          >
            <v-card-title class="headline">
              <!--<v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet amount-->
              <h4 class="icon">
                &ensp; Transactions historical
              </h4>
            </v-card-title>
            <v-card-text class="text-h5">
              <v-skeleton-loader
                v-if="firstLoad"
                :loading="loading"
                type="table"
              />
              <v-expansion-panels>
                <v-expansion-panel
                  v-for="item in rpcAllTxs"
                  :key="item.timestamp"
                  style="background: #090909; color: white"
                >
                  <v-expansion-panel-header v-slot="{ open }">
                    <v-row no-gutters>
                      <v-col cols="1">
                        <v-avatar class="mr-2">
                          <v-img
                            :src="'../transactions/' + item.messageInfo.icon"
                            :alt="item.messageInfo.typeReadable"
                          />
                        </v-avatar>
                      </v-col>
                      <v-col
                        cols="2"
                        class="mt-4"
                      >
                        {{ formatDate(item.timestamp) }}
                      </v-col>
                      <v-col
                        cols="8"
                        class="text--secondary"
                      >
                        <v-fade-transition leave-absolute>
                          <span v-if="open">
                            <v-chip
                              class="mt-3"
                              :color="item.messageInfo.color"
                              outlined
                              label
                              small
                            >
                              {{ item.messageInfo.typeReadable }}
                            </v-chip>
                          </span>
                          <v-row
                            v-else
                            no-gutters
                            style="width: 100%"
                          >
                            <v-col cols="3">
                              <v-chip
                                class="mt-3"
                                :color="item.messageInfo.color"
                                outlined
                                label
                                small
                              >
                                {{ item.messageInfo.typeReadable }}
                              </v-chip>
                            </v-col>
                            <v-col
                              cols="9"
                              class="mt-4"
                            >
                              {{ item.txhash }}
                            </v-col>
                          </v-row>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <template
                      v-if="
                        item.messageInfo.type === '/cosmos.bank.v1beta1.MsgSend'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                From
                              </th>
                              <th class="text-left">
                                To
                              </th>
                              <th class="text-left">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{{ item.messageInfo.msgData.from }}</td>
                              <td>{{ item.messageInfo.msgData.to }}</td>
                              <td class="green--text">
                                {{ item.messageInfo.msgData.amount }}
                                {{ cosmosConfig[0].coinLookup.viewDenom }}
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>

                    <template
                      v-if="
                        item.messageInfo.type ===
                          '/cosmos.staking.v1beta1.MsgDelegate'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                From
                              </th>
                              <th class="text-left">
                                To validator
                              </th>
                              <th class="text-left">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                {{ item.messageInfo.msgData.delegator_address }}
                              </td>
                              <td>
                                <v-icon class="mr-2">
                                  mdi-shield-check
                                </v-icon>
                                {{ item.messageInfo.msgData.validator_address }}
                              </td>
                              <td class="green--text">
                                {{ item.messageInfo.msgData.amount }}
                                {{ cosmosConfig[0].coinLookup.viewDenom }}
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <template
                      v-if="
                        item.messageInfo.type ===
                          '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                From validator
                              </th>
                              <th class="text-left">
                                To delegator
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <v-icon class="mr-2">
                                  mdi-shield-check
                                </v-icon>
                                {{ item.messageInfo.msgData.validator_address }}
                              </td>
                              <td>
                                {{ item.messageInfo.msgData.delegator_address }}
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <template
                      v-if="
                        item.messageInfo.type === '/cosmos.gov.v1beta1.MsgVote'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                proposal_id
                              </th>
                              <th class="text-left">
                                option
                              </th>
                              <th class="text-left">
                                metadata
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                #{{ item.messageInfo.msgData.proposal_id }}
                              </td>
                              <td>
                                <v-chip
                                  v-if="
                                    item.messageInfo.msgData.option ===
                                      'VOTE_OPTION_YES'
                                  "
                                  class="ma-2"
                                  color="green"
                                  outlined
                                  label
                                >
                                  YES
                                </v-chip>
                                <v-chip
                                  v-if="
                                    item.messageInfo.msgData.option ===
                                      'VOTE_OPTION_NO'
                                  "
                                  class="ma-2"
                                  color="red"
                                  outlined
                                  label
                                >
                                  NO
                                </v-chip>
                                <v-chip
                                  v-if="
                                    item.messageInfo.msgData.option ===
                                      'VOTE_OPTION_ABSTAIN'
                                  "
                                  class="ma-2"
                                  color="red"
                                  outlined
                                  label
                                >
                                  ABSTAIN
                                </v-chip>
                                <v-chip
                                  v-if="
                                    item.messageInfo.msgData.option ===
                                      'VOTE_OPTION_NO_WITH_VETO'
                                  "
                                  class="ma-2"
                                  color="orange"
                                  outlined
                                  label
                                >
                                  NO WITH VETO
                                </v-chip>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <template
                      v-if="
                        item.messageInfo.type === '/cosmos.group.v1.MsgVote'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                proposal_id
                              </th>
                              <th class="text-left">
                                option
                              </th>
                              <th class="text-left">
                                metadata
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                #{{ item.messageInfo.msgData.proposal_id }}
                              </td>
                              <td>{{ item.messageInfo.msgData.option }}</td>
                              <td>{{ item.messageInfo.msgData.metadata }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <template
                      v-if="
                        item.messageInfo.type ===
                          '/cosmos.gov.v1beta1.MsgDeposit'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                Proposal Id
                              </th>
                              <th class="text-left">
                                Deposit Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                #{{ item.messageInfo.msgData.proposal_id }}
                              </td>
                              <td>
                                {{ item.messageInfo.msgData.amount }}
                                {{ cosmosConfig[0].coinLookup.viewDenom }}
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <template
                      v-if="
                        item.messageInfo.type ===
                          '/cosmos.staking.v1beta1.MsgUndelegate'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                From validator
                              </th>
                              <th class="text-left">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <v-icon class="mr-2">
                                  mdi-shield-check
                                </v-icon>
                                {{ item.messageInfo.msgData.validator_address }}
                              </td>
                              <td>
                                {{ item.messageInfo.msgData.amount }}
                                {{ cosmosConfig[0].coinLookup.viewDenom }}
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <template
                      v-if="
                        item.messageInfo.type ===
                          '/cosmos.staking.v1beta1.MsgBeginRedelegate'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                From validator
                              </th>
                              <th class="text-left">
                                To validator
                              </th>
                              <th class="text-left">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <v-icon class="mr-2">
                                  mdi-shield-check
                                </v-icon>
                                {{ item.messageInfo.msgData.from }}
                              </td>
                              <td>
                                <v-icon class="mr-2">
                                  mdi-shield-check
                                </v-icon>
                                {{ item.messageInfo.msgData.to }}
                              </td>
                              <td>
                                {{ item.messageInfo.msgData.amount }}
                                {{ cosmosConfig[0].coinLookup.viewDenom }}
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

              <!--<template>
              <v-simple-table class="accent">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Date
                      </th>
                      <th class="text-left">
                        Type
                      </th>
                      <th class="text-left">
                        Hash
                      </th>
                      <th class="text-left">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>

                    <tr
                      v-for="item in rpcAllTxs"
                      :key="item.timestamp"
                    >
                      <td>{{ item.timestamp | formatDate }}</td>
                      <td>{{ getMessageType(item.tx.body.messages[0]['@type']) }}</td>
                      <td>{{ item.txhash }}</td>
                      <td class="green--text">{{ item.amount / 1000000 }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>

                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </template>-->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

import axios from "axios";
import dayjs from "dayjs";
import { reverse, sortBy, uniqWith } from "lodash";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { setMsg } from "~/libs/msgType";
import cosmosConfig from "~/cosmos.config";

export default {
  data: () => ({
    cosmosConfig: cosmosConfig,
    validatorAddr: "",
    totalProps: "",
    totalVoted: "",
    rpcSender: [],
    rpcRecipient: [],
    rpcAllTxs: [],
    loading: true,
    firstLoad: true,
  }),
  computed: {
    ...mapState("keplr", [`accounts`, "logged"]),
    ...mapState("data", [
      "chainId",
      "balances",
      "rewards",
      "delegations",
      "priceNow",
      "aprNow",
      "totalDelegated",
      "validatorDetails",
      "validators",
      "validatorsLoaded",
    ]),
  },
  watch: {},

  async beforeMount() {
    await this.$store.dispatch("keplr/checkLogin");
    await this.$store.dispatch("data/getAllValidators");
    // TODO
    // 1/ lcd -> get delegations
    // 2/ lcd -> get undelegate
    // 2/ rpc -> get historic
    if (this.logged && this.validatorsLoaded === true) {
      /*
      const rpcEndpoint = "https://rpc-devnet-6.bitcanna.io";
      const client = await tendermintRpc.Tendermint34Client.connect(rpcEndpoint);

      // Delegation historical
      const querySender = buildQuery({
        tags: [
          { key: "message.sender", value: this.accounts[0].address }
        ]
      });
      const queryRecipient = buildQuery({
        tags: [
          { key: "transfer.recipient", value: this.accounts[0].address }
        ]
      });
      const resultSender = await client.txSearch({ query: querySender });
      const resultRecipient = await client.txSearch({ query: queryRecipient });

      let decodedTx = decodeTxRaw(resultSender.txs[0].tx)

      const plain = Buffer.from(decodedTx.body.messages[0].value, 'base64').toString('utf8')

      console.log(resultSender)

      //console.log(resultSender.txs)

      console.log(resultRecipient)

      let finalResultSender = []

      resultSender.txs.forEach(async (item, index) => {
        if(item.result.code === 0) {
          let txEvent = JSON.parse(item.result.log)
          const txHash = toHex(item.hash)
          item.hashDecoded = txHash

          const foundMsg = txEvent[0].events.find(element => element.type === "message");
          const foundType = foundMsg.attributes.find(element => element.key === "action");
          item.msgType = foundType.value

          const responseDate = await client.txSearch({ query: `tx.hash='${item.hashDecoded}'` });
          let decodedTx = decodeTxRaw(responseDate.txs[0].tx)
          console.log(decodedTx)


          finalResultSender.push({
            height: item.height,
            hashDecoded: item.hashDecoded,
            msgType: item.msgType,
            // date: responseDate.header.time
          })
          // console.log(setMsg(item.msgType))
        }
      });


      // Recipient
      resultRecipient.txs.forEach(async (item) => {
        let txEvent = JSON.parse(item.result.log)
        const txHash = toHex(item.hash)
        item.hashDecoded = txHash

      }); */

      const resultSender = await axios(
        cosmosConfig[0].apiURL +
          "/cosmos/tx/v1beta1/txs?events=message.sender=%27" +
          this.accounts[0].address +
          "%27&limit=" +
          cosmosConfig[this.chainId].maxTxSender +
          "&order_by=2"
      );
      const resultRecipient = await axios(
        cosmosConfig[0].apiURL +
          "/cosmos/tx/v1beta1/txs?events=transfer.recipient=%27" +
          this.accounts[0].address +
          "%27&limit=" +
          cosmosConfig[this.chainId].maxTxSender +
          "&order_by=2"
      );
      const finalTxs = resultSender.data.tx_responses.concat(
        resultRecipient.data.tx_responses
      );

      this.rpcAllTxs = this.transactionsReducer(finalTxs);
      this.loading = false;
      this.firstLoad = false;
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
    getMessageType(msg) {
      const typeReadable = setMsg(
        msg,
        this.accounts[0].address,
        "",
        this.validators
      );
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
  },

};
</script>
