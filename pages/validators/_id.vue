<template>
  <div>
    <v-card
      class="mx-auto accent"
      max-width="1200"
      min-height="500"
    >
      <v-img
        height="200"
        src="https://pbs.twimg.com/profile_banners/602625556/1649007099/1500x500"
      />
      <v-row style="margin: 2.5%; position: absolute; top: 130px">
        <v-list-item>
          <v-list-item-avatar size="100">
            <img
              src="https://pbs.twimg.com/profile_images/1455116847024586757/T9o06sNM_400x400.png"
              alt="John"
            >
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              class="title"
              style="margin-top: 20px"
            >
              {{
                validatorDetails.description?.moniker
              }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ validatorAddr }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-spacer />
          <!--          <v-btn
            class="mt-4 mr-2"
            elevation="2"
            color="#00b786"
          >Delegate</v-btn>-->
          <div class="mt-2">
            <DelegateModal
              v-if="logged"
              :chain-id-props="cosmosConfig[chainId].coinLookup.addressPrefix"
              :address-to="validatorAddr"
              :validator-name="validatorDetails.description?.moniker"
              :balances="balances"
            />
            <UndelegateSingleModal
              v-if="logged"
              :chain-id-props="cosmosConfig[chainId].coinLookup.addressPrefix"
              :address-from="validatorAddr"
              :amount-un="validatorDelegations / 1000000"
              :amount-total-un="myTotalUnDelegation"
              :validator-name="validatorDetails.description?.moniker"
              :coin-icon="cosmosConfig[chainId].coinLookup.icon"
            />
            <RedelegateModal
              v-if="logged"
              :chain-id-props="cosmosConfig[chainId].coinLookup.addressPrefix"
              :address-from="validatorAddr"
              :amount-re="validatorDelegations / 1000000"
              :validator-name="validatorDetails.description?.moniker"
              :coin-icon="cosmosConfig[chainId].coinLookup.icon"
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
              <template #default>
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
                    <td>
                      {{
                        validatorDetails.commission?.commission_rates.rate * 100
                      }}
                      %
                    </td>
                  </tr>
                  <tr>
                    <td>APR</td>
                    <td>{{ validatorApr.toFixed(2) }}%</td>
                  </tr>
                  <tr>
                    <td>Last update</td>
                    <td>
                      {{ lastUpdate(validatorDetails.commission?.update_time) }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col>
            <ChartsPropsValidator
              :total-props="totalProps"
              :total-voted="totalVoted"
            />
          </v-col>
        </v-row>
      </v-row>
    </v-card>

    <v-card
      class="mt-4 mx-auto"
      color="#000000"
      max-width="1200"
    >
      <v-row justify="space-around">
        <v-col>
          <v-card class="accent">
            <v-card-title class="headline">
              <!--<v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet amount-->
              <h4 class="icon">
                <!--<img src="icon/wallet.png" />-->
                &ensp; My Delegation
              </h4>
            </v-card-title>
            <v-card-text class="text-right text-h5">
              {{ validatorDelegations / 1000000 }}
              {{ cosmosConfig[chainId].coinLookup.viewDenom }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="accent">
            <v-card-title class="headline">
              <h4 class="icon">
                <!--<img src="icon/tokens.png" />-->
                &ensp; My Undelegate
              </h4>
            </v-card-title>
            <v-card-text class="text-right text-h5">
              {{ myDelegatorData.myTotalUnDelegation }}
              {{ cosmosConfig[chainId].coinLookup.viewDenom }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-card
      class="pa-8 mt-4 mx-auto accent"
      max-width="1200"
    >
      <v-sheet
        color="#000000"
        class="pa-2 mt-4 mx-auto"
        elevation="2"
        height="60"
      >
        <v-row justify="space-around">
          <v-col class="ml-4">
            Consensus Pubkey<br>
            {{ validatorDetails.consensus_pubkey?.key }}
          </v-col>
          <v-col>
            tokens<br>
            {{ (validatorDetails.tokens / 1000000).toFixed(2) }}
            {{ cosmosConfig[chainId].coinLookup.viewDenom }}
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
          <v-col> test </v-col>
        </v-row>
      </v-sheet>
      <!--{{ validatorDetails }}-->
    </v-card>

    <v-card
      v-if="logged"
      class="mt-4 mx-auto"
      color="#000000"
      max-width="1200"
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
                <!--<img src="icon/wallet.png" />-->
                &ensp; My Delegation historical
              </h4>
            </v-card-title>
            <v-card-text class="text-h5"> 
              <v-simple-table class="accent">
                <template #default>
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
                      v-for="item in myDelegatorData.delegationsRpc"
                      :key="item.hashDecoded"
                    >
                      <td>
                        <a
                          :href="'https://explorer.bitcanna.io/blocks/' + item.height"
                          target="_blank"
                        >{{ item.height }}</a>
                      </td>
                      <td>
                        <a
                          :href="'https://explorer.bitcanna.io/transactions/' + item.hashDecoded"
                          target="_blank"
                        >{{ truncate(item.hashDecoded) }}</a>
                      </td>
                      <td class="green--text">
                        {{ item.amount / 1000000 }}
                        {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table> 
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card
            class="accent"
            min-height="400"
          >
            <v-card-title class="headline">
              <h4 class="icon">
                <!--<img src="icon/tokens.png" />-->
                &ensp; My Undelegate historical
              </h4>
            </v-card-title>
            <v-card-text class="text-h5">
              <v-simple-table class="accent">
                <template #default>
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
                      v-for="item in myDelegatorData.unDelegateRpc"
                      :key="item.hashDecoded"
                    >
                      <td>
                        <a
                          :href="'https://explorer.bitcanna.io/blocks/' + item.height"
                          target="_blank"
                        >{{ item.height }}</a>
                      </td>
                      <td>
                        <a
                          :href="'https://explorer.bitcanna.io/transactions/' + item.hashDecoded"
                          target="_blank"
                        >{{ truncate(item.hashDecoded) }}</a>
                      </td>
                      <td class="red--text">
                        {{ item.amount / 1000000 }}
                        {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
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
import bech32 from "bech32";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import cosmosConfig from "~/cosmos.config";

export default {
  data: () => ({
    cosmosConfig: cosmosConfig,
    validatorAddr: "",
    totalProps: "",
    totalVoted: "",
    delegationsRpc: [],
    unDelegateRpc: [],
    myTotalDelegation: "",
    myTotalUnDelegation: ""
  }),
  computed: {
    ...mapState("keplr", [`accounts`, "logged"]),
    ...mapState("data", [
      "chainId",
      "myDelegatorData",
      "balances",
      "rewards",
      "delegations",
      "priceNow",
      "aprNow",
      "totalDelegated",
      "validatorDetails",
      "validatorDelegations",
    ]),
    validatorApr() {
      const rewardFactor =
        1 - this.validatorDetails.commission?.commission_rates.rate;
      const finalApr = this.aprNow * rewardFactor;
      return finalApr;
    },
    lastUpdate() {
      const fromNow = (date) => dayjs(date).fromNow();
      return fromNow;
    },
  },
  watch: {},

  async beforeMount() {
    // TODO refactoring all data in vueX
    this.validatorAddr = this.$route.params.id;
    await this.$store.dispatch("data/getValidatorDetails", this.validatorAddr);

    const decode = bech32.decode(this.validatorAddr);
    const delAddr = bech32.encode("bcna", decode.words);

    const totalProp = await axios(
      cosmosConfig[0].apiURL + "/cosmos/gov/v1/proposals"
    );
    const totalVoted = await axios(
      cosmosConfig[0].apiURL +
        "/cosmos/tx/v1beta1/txs?events=message.sender=%27" +
        delAddr +
        "%27&events=message.action=%27/cosmos.gov.v1beta1.MsgVote%27"
    );
    this.totalProps = totalProp.data.pagination.total;
    this.totalVoted = totalVoted.data.total;
  },
  async mounted() {
    if (this.logged) {
      await this.$store.dispatch("data/initRpc");
      await this.$store.dispatch("data/getDelegatorDataRpc", {
        validator: this.validatorAddr,
        delegator: this.accounts[0].address,
      });
      await this.$store.dispatch("data/getValidatorDelegation", {
        validatorAddr: this.validatorAddr,
        delegatorAddr: this.accounts[0].address,
      });
    }
  },
  methods: {
    async getTxDate(height) {
      const block = await this.rpcClient.block(Number(height));
      return block.block.header.time;
    },
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
    },    
  }
};
</script>
