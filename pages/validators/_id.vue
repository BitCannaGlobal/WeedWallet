<template>
  <div>
    <v-card class="mx-auto accent" max-width="1200" min-height="500">
      <v-img height="200" src="https://pbs.twimg.com/profile_banners/602625556/1649007099/1500x500"></v-img>
      <v-row style="margin:2.5%;position:absolute; top: 130px">

        <v-list-item>
          <v-list-item-avatar size="100">
            <img
              src="https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/bitcanna/moniker/bcnavaloper1ttkg00prt6w9a9zsgh9ywvftmqm22n4z5xezma.png"
              alt="John">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title" style="margin-top:20px;">{{ validatorDetails.description?.moniker }}</v-list-item-title>
            <v-list-item-subtitle>{{ validatorAddr }}</v-list-item-subtitle>

          </v-list-item-content>
          <v-spacer></v-spacer>
<!--          <v-btn
            class="mt-4 mr-2"
            elevation="2"
            color="#00b786"
          >Delegate</v-btn>-->
          <div class="mt-2">
            <DelegateModal
              v-if="logged"
              :chainIdProps="cosmosConfig[chainId].coinLookup.addressPrefix"
              :addressTo="validatorAddr"
              :validatorName="validatorDetails.description?.moniker"
              :balances="balances"
            />
                <UndelegateSingleModal
                  v-if="logged"
                  :chainIdProps="cosmosConfig[chainId].coinLookup.addressPrefix"
                  :addressFrom="validatorAddr"
                  :amountUn="myTotalDelegation"
                  :validatorName="validatorDetails.description?.moniker"
                  :coinIcon="cosmosConfig[chainId].coinLookup.icon"
                />
                <RedelegateModal
                  v-if="logged"
                  :chainIdProps="cosmosConfig[chainId].coinLookup.addressPrefix"
                  :addressFrom="validatorAddr"
                  :amountRe="myTotalDelegation"
                  :validatorName="validatorDetails.description?.moniker"
                  :coinIcon="cosmosConfig[chainId].coinLookup.icon"
                />
          </div>
          <!--<v-btn
            class="mt-4 mr-2"
            elevation="2"
            color="#00b786"
          >Undelegate</v-btn>
          <v-btn
            class="mt-4"
            elevation="2"
            color="#00b786"
          >Redelegate</v-btn>-->
        </v-list-item>
        <v-row>
          <v-col>
            <v-simple-table class="accent">
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td>Status</td>
                    <td>
                      <v-chip
                        v-if="validatorDetails.status === 'BOND_STATUS_BONDED'"
                        color="#00b786"
                        outlined
                        label
                      >
                        <!--{{ item.status }}-->
                        Online
                      </v-chip>

                    </td>
                  </tr>
                  <tr>
                    <td>Commission</td>
                    <td>{{ validatorDetails.commission?.commission_rates.rate * 100 }} %</td>
                  </tr>
                  <tr>
                    <td>APR</td>
                    <td>{{ validatorApr.toFixed(2) }}%</td>
                  </tr>
                  <tr>
                    <td>Last update</td>
                    <td>{{ lastUpdate(validatorDetails.commission?.update_time) }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col>
          <ChartsPropsValidator :totalProps="totalProps" :totalVoted="totalVoted" />
          </v-col>
        </v-row>
      </v-row>
    </v-card>

    <v-card class="mt-4 mx-auto" color="#000000"  max-width="1200">
      <v-row justify="space-around">
        <v-col>
          <v-card class="accent">
            <v-card-title class="headline">
              <!--<v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet amount-->
              <h4 class="icon">
                <img src="icon/wallet.png" />
                &ensp; My Delegation
              </h4>
            </v-card-title>
            <v-card-text class="text-right text-h5">
              {{ myTotalDelegation }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="accent">
            <v-card-title class="headline">
            <h4 class="icon">
              <img src="icon/tokens.png" />
              &ensp; My Undelegate
            </h4>
            </v-card-title>
            <v-card-text class="text-right text-h5">
              {{ myTotalUnDelegation }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="pa-8 mt-4 mx-auto accent"  max-width="1200" >
      <v-sheet
        color="#000000"
        class="pa-2 mt-4 mx-auto"
        elevation="2"
        height="60"
      >
        <v-row justify="space-around">
          <v-col class="ml-4">
            Consensus Pubkey<br />
            {{ validatorDetails.consensus_pubkey?.key }}
          </v-col>
          <v-col>
            tokens<br />
            {{ (validatorDetails.tokens / 1000000).toFixed(2) }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}
          </v-col>
        </v-row>
      </v-sheet>
      <v-sheet
        color="#000000"
        class="pa-2 mt-4 mx-auto"
        elevation="2"
        height="60"
      >
        <v-row justify="space-around">
          <v-col class="ml-4">
            test
          </v-col>
          <v-col>
            test
          </v-col>
        </v-row>
      </v-sheet>
      <!--{{ validatorDetails }}-->
    </v-card>

    <v-card v-if="logged" class="mt-4 mx-auto" color="#000000"  max-width="1200">
      <v-row justify="space-around">
        <v-col>
          <v-card class="accent" min-height="400">
            <v-card-title class="headline">
              <!--<v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet amount-->
              <h4 class="icon">
                <img src="icon/wallet.png" />
                &ensp; My Delegation historical
              </h4>
            </v-card-title>
            <v-card-text class="text-h5">
            <template>
              <v-simple-table class="accent">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Block
                      </th>
                      <th class="text-left">
                        Tx hash
                      </th>
                      <th class="text-left">
                        Amount delegate
                      </th>

                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in delegationsRpc"
                      :key="item.hashDecoded"
                    >
                      <td>{{ item.height }}</td>
                      <td>{{ item.hashDecoded | truncate }}</td>
                      <td class="green--text">{{ item.amount / 1000000 }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>

                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </template>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="accent" min-height="400">
            <v-card-title class="headline">
            <h4 class="icon">
              <img src="icon/tokens.png" />
              &ensp; My Undelegate historical
            </h4>
            </v-card-title>
            <v-card-text class="text-h5">
            <template>
              <v-simple-table class="accent">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Block
                      </th>
                      <th class="text-left">
                        Tx hash
                      </th>
                      <th class="text-left">
                        Amount delegate
                      </th>

                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in unDelegateRpc"
                      :key="item.hashDecoded"
                    >
                      <td>{{ item.height }}</td>
                      <td>{{ item.hashDecoded | truncate }}</td>
                      <td class="red--text">{{ item.amount / 1000000 }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>

                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

  </div>
</template>
<script>
import { mapState } from 'vuex'

import axios from 'axios'
import bech32 from 'bech32'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

var tendermintRpc = require('@cosmjs/tendermint-rpc')
const { toAscii, toHex } = require("@cosmjs/encoding")
var { buildQuery } = require('@cosmjs/tendermint-rpc/build/tendermint34/requests.js')






import cosmosConfig from '~/cosmos.config'

export default {
  data: () => ({
    cosmosConfig: cosmosConfig,
    validatorAddr: '',
    totalProps: '',
    totalVoted: '',
    delegationsRpc: [],
    unDelegateRpc: [],
    myTotalDelegation: '',
    myTotalUnDelegation: ''
  }),
  computed: {
    ...mapState('keplr', [`accounts`, 'logged']),
    ...mapState('data', ['chainId', 'balances', 'rewards', 'delegations', 'priceNow', 'aprNow', 'totalDelegated', 'validatorDetails']),
    validatorApr() {
      // const commission = this.validator.commission * 100 // this.validator.commission = 0.1
      // const finalApr = this.aprNow - commission
      const rewardFactor = 1 - (this.validatorDetails.commission?.commission_rates.rate)
      const finalApr = this.aprNow * rewardFactor
      return finalApr
    },
    lastUpdate(date) {
      const fromNow = (date) => dayjs(date).fromNow()
      return fromNow
    },
  },
  watch: {

  },

  async beforeMount () {



    this.validatorAddr = this.$route.params.id
    await this.$store.dispatch('data/getValidatorDetails', this.validatorAddr)

    const decode = bech32.decode(this.validatorAddr)
    const delAddr = bech32.encode('bcna', decode.words)

    const totalProp = await axios(cosmosConfig[0].apiURL + '/cosmos/gov/v1/proposals')
    const totalVoted = await axios(cosmosConfig[0].apiURL + '/cosmos/tx/v1beta1/txs?events=message.sender=%27' + delAddr + '%27&events=message.action=%27/cosmos.gov.v1beta1.MsgVote%27')
    this.totalProps = totalProp.data.pagination.total
    this.totalVoted = totalVoted.data.total
    // https://lcd-devnet-6.bitcanna.io/cosmos/tx/v1beta1/txs?events=message.sender=%27bcna1zvxldjgetj5u9wah0t8fnz229533xzsmz8y5js%27&events=message.action=%27/cosmos.gov.v1beta1.MsgVote%27
  },
  async mounted () {

    // TODO
    // 1/ lcd -> get delegations
    // 2/ lcd -> get undelegate
    // 2/ rpc -> get historic
    if (this.logged) {

      const getTotalDelegated = await axios(cosmosConfig[0].apiURL + '/cosmos/staking/v1beta1/validators/'+this.validatorAddr+'/delegations/'+this.accounts[0].address)
      try {
        const getTotalUnDelegated = await axios(cosmosConfig[0].apiURL + '/cosmos/staking/v1beta1/validators/'+this.validatorAddr+'/delegations/'+this.accounts[0].address+'/unbonding_delegation')
        this.myTotalUnDelegation = getTotalUnDelegated.data.unbond.entries[0].initial_balance / 1000000
      } catch (error) {
        console.error(error);
      }


      //console.log(getTotalUnDelegated.data)
      this.myTotalDelegation = getTotalDelegated.data.delegation_response.balance.amount / 1000000

      const rpcEndpoint = "https://rpc-devnet-6.bitcanna.io";
      const client = await tendermintRpc.Tendermint34Client.connect(rpcEndpoint);

      // Delegation historical
      const queryDelegate = buildQuery({
        tags: [
          { key: "delegate.validator", value: this.validatorAddr },
          { key: "message.sender", value: this.accounts[0].address },
        ]
      });
      const resultDelegate = await client.txSearch({ query: queryDelegate });

      resultDelegate.txs.forEach(async (item) => {
        let txEvent = JSON.parse(item.result.log)
        const txHash = toHex(item.hash)
        item.hashDecoded = txHash
        item.txEvent = txEvent[0].events
        const found = txEvent[0].events.find(element => element.type === 'delegate');
        const foundAmount = found.attributes.find(element => element.key === 'amount');
        item.amount = foundAmount.value.replace('ubcna', '')
      });
      this.delegationsRpc = resultDelegate.txs.reverse()

      // UnDelegation historical
      const queryUnDelegate = buildQuery({
        tags: [
          { key: "unbond.validator", value: this.validatorAddr },
          { key: "message.sender", value: this.accounts[0].address },
        ]
      });
      const resultUnDelegate = await client.txSearch({ query: queryUnDelegate });
      console.log(resultUnDelegate)

      resultUnDelegate.txs.forEach(async (item) => {
        let txEvent = JSON.parse(item.result.log)
        const txHash = toHex(item.hash)
        item.hashDecoded = txHash
        item.txEvent = txEvent[0].events
        const found = txEvent[0].events.find(element => element.type === 'unbond');
        const foundAmount = found.attributes.find(element => element.key === 'amount');
        item.amount = foundAmount.value.replace('ubcna', '')
      });
      this.unDelegateRpc = resultUnDelegate.txs.reverse()


    }
  },
  methods: {
    async getTxDate(height) {
        const rpcEndpoint = "https://rpc-devnet-6.bitcanna.io";
        const client = await tendermintRpc.Tendermint34Client.connect(rpcEndpoint);
        //console.log(height)
        const block = await client.block(Number(height));
        return block.block.header.time

    }
  },
  filters: {
    truncate(
      fullStr,
      strLen = 8,
      separator = ".....",
      frontChars = 6,
      backChars = 6
    ) {
      if (fullStr.length <= strLen) return fullStr;

      return (
        fullStr.substr(0, frontChars) +
        separator +
        fullStr.substr(fullStr.length - backChars)
      );
    }
  }
}
</script>
