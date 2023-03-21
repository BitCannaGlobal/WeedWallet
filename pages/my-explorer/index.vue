<template>
  <v-row>
    <v-col cols="12">
      <v-row justify="space-around">
        <v-col cols="9">
          <v-card>
            <!--<webSocketGetTxs />-->
          </v-card>
      <div class="row">
        <div class="col-sm">
          <v-card>
            <v-card-title class="headline">
              Last 50 Transactions
            </v-card-title>
            <v-card-text>
              <!--<v-expansion-panels>
                <v-expansion-panel
                  v-for="item in lastTxs.tx_responses"
                  :key="item.txhash"
                >
                  <v-expansion-panel-header>
                    <v-row no-gutters>
                      <v-col cols="4">
                        Start and end dates
                      </v-col>
                      <v-col
                        cols="8"
                        class="text--secondary"
                      >
                        <v-fade-transition leave-absolute>
                          <span v-if="open">When do you want to travel?</span>
                          <v-row
                            v-else
                            no-gutters
                            style="width: 100%"
                          >
                            <v-col cols="6">
                              {{ item.timestamp | formatDate }}
                            </v-col>
                            <v-col cols="6">
                              End date:
                            </v-col>
                          </v-row>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>-->



              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Date
                      </th>
                      <th class="text-left">
                        height
                      </th>
                      <th class="text-left">
                        txhash
                      </th>
                      <th class="text-left">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in lastTxs.tx_responses"
                      :key="item.txhash"
                    >
                      <td>{{ item.timestamp | formatDate }}</td>
                      <td>{{ item.height }}</td>

                      <!--<td>{{ item.tx.body.messages[0]['@type'] }}</td>-->
                      <td v-if='item.tx.body.messages[0]["@type"] === "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"'>
                        <v-chip
                          class="ma-2"
                        >
                          Withdraw Delegator Reward
                        </v-chip>
                      </td>
                      <td v-if='item.tx.body.messages[0]["@type"] === "/cosmos.bank.v1beta1.MsgSend"'>
                        <v-chip
                          class="ma-2"
                        >
                          Msg Send
                        </v-chip>
                      </td>
                      <td v-if='item.tx.body.messages[0]["@type"] === "/cosmos.staking.v1beta1.MsgDelegate"'>
                        <v-chip
                          class="ma-2"
                        >
                         Delegate
                        </v-chip>
                      </td>

                      <td v-if='item.tx.body.messages[0]["@type"] === "/cosmos.group.v1.MsgExec"'>
                        <v-chip
                          class="ma-2"
                        >
                          Msg Exec
                        </v-chip>
                      </td>
                      <td v-if='item.tx.body.messages[0]["@type"] === "/cosmos.group.v1.MsgSubmitProposal"'>
                        <v-chip
                          class="ma-2"
                        >
                          Submit Proposal
                        </v-chip>
                      </td>
                      <td v-if='item.tx.body.messages[0]["@type"] === "/cosmos.group.v1.MsgVote"'>
                        <v-chip
                          class="ma-2"
                        >
                          Group Vote
                        </v-chip>
                      </td>
                      <td v-if='item.tx.body.messages[0]["@type"] === "/cosmos.group.v1.MsgCreateGroupWithPolicy"'>
                        <v-chip
                          class="ma-2"
                        >
                          Create Group With Policy
                        </v-chip>
                      </td>
                      <td v-if='item.tx.body.messages[0]["@type"] === "/ibc.applications.transfer.v1.MsgTransfer"'>
                        <v-chip
                          class="ma-2"
                        >
                          IBC MsgTransfer
                        </v-chip>
                      </td>
                      <td v-if='item.tx.body.messages[0]["@type"] === "/ibc.core.client.v1.MsgUpdateClient"'>
                        <v-chip
                          class="ma-2"
                        >
                          IBC MsgUpdateClient
                        </v-chip>
                      </td>
                      <td v-if='item.tx.body.messages[0]["@type"] === "/ibc.core.channel.v1.MsgChannelOpenInit"'>
                        <v-chip
                          class="ma-2"
                        >
                          IBC MsgChannelOpenInit
                        </v-chip>
                      </td>
                      <td v-if='item.tx.body.messages[0]["@type"] === "/ibc.core.connection.v1.MsgConnectionOpenInit"'>
                        <v-chip
                          class="ma-2"
                        >
                          IBC MsgConnectionOpenInit
                        </v-chip>
                      </td>
                      <td v-if='item.tx.body.messages[0]["@type"] === "/ibc.core.client.v1.MsgCreateClient"'>
                        <v-chip
                          class="ma-2"
                        >
                          IBC MsgCreateClient
                        </v-chip>
                      </td>
                      <td v-if='item.tx.body.messages[0]["@type"] === "/cosmos.group.v1.MsgUpdateGroupMembers"'>
                        <v-chip
                          class="ma-2"
                        >
                          Update Group Members
                        </v-chip>
                      </td>
                      <td v-if='item.tx.body.messages[0]["@type"] === "/cosmos.group.v1.MsgUpdateGroupMetadata"'>
                        <v-chip
                          class="ma-2"
                        >
                          Update Group Metadata
                        </v-chip>
                      </td>
                      <td>
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              v-on="on"
                            >
                              View detail
                            </v-btn>
                          </template>
                          <span>{{ item.txhash }}</span>
                        </v-tooltip>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
                  <!--<div class="text-center">
                    <v-pagination
                      v-model="currentPage"
                      color="#00fafa"
                      :length="totalPage"
                      @input="handlePageChange"
                    ></v-pagination>
                  </div>-->
            </v-card-text>
          </v-card>
        </div>
      </div>
        </v-col>
      </v-row>
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
    cosmosConfig: cosmosConfig,
    totalPage: '',
    lastTxs: [],

  }),
  computed: {
    ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
    ...mapState('data', ['chainId', 'balances', 'rewards', 'delegations']),
  },
  async fetch() {
    var getTotalPages = await fetch(
      cosmosConfig[this.chainId].apiURL + '/cosmos/tx/v1beta1/txs?events=message.action=%27%27&page=1&limit=50&order_by=2'
    ).then(res => res.json())
    this.totalPage = Number(getTotalPages.total)
    console.log(this.totalPage)
    console.log(getTotalPages)
    this.lastTxs = getTotalPages
  },
  methods: {

  },
  filters: {
    formatDate: (dateStr) =>
      Intl.DateTimeFormat("us-EN",
        {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false
        }).format(new Date(dateStr)),

    formatDateCountDown(dateStr) {
      return Intl.DateTimeFormat("en-US",
        {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false
        }).format(new Date(dateStr))
    },
  },
}
</script>
