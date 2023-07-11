<template>
  <div>
    <h3>
      {{ validatorDetails.description?.moniker }} 
    </h3>
    <v-divider class="mb-6" />
    <v-sheet
        color="#0F1011"
        min-height="520"
        class="pa-4 pt-6 pl-10 ma-8 mx-auto"
        elevation="2"
        height="60"
      >
      <h3>
        <v-avatar>
          <v-img
            :src="'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/bitcanna/moniker/'+validatorAddr+'.png'" 
            :alt="validatorDetails.description?.moniker" 
          /> 
        </v-avatar>          
        <span class="ml-4">{{ validatorDetails.description?.moniker }}</span>
        <v-chip
          class="ma-2 ml-4"
          label
          small
          color="#0FB786"
        >
          Online
        </v-chip>
      </h3>
      <div class="mt-6">
        <h4>Website</h4>
        <a :href="validatorDetails.description?.website" target="_blank">
          {{ validatorDetails.description?.website }} 
        </a>
      </div>
      <div class="mt-6">
        <h4>Description</h4>
        {{ validatorDetails.description?.details }} 
      </div>
      
      <div class="mt-6">
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="4"
            class="pa-4" 
          > 
            <h4>Current commission rate</h4>
              {{
                validatorDetails.commission?.commission_rates.rate * 100
              }}
              %
            <h4 class="mt-2">Voting Power</h4>
              10%
          </v-col>
          <v-divider 
            vertical
          />
          <v-col
            cols="12"
            sm="4"
            class="pa-4" 
          > 
            <h4>Total Stake</h4>
              {{ validatorDelegations / 1000000 }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}
            <h4 class="mt-2">Rewards (APR)</h4>
            {{ validatorApr.toFixed(2) }}%
          </v-col>
          <v-divider 
            vertical
          />
          <v-col
            v-if="logged"
            cols="12"
            sm="4"
            class="pa-4" 
          > 
            <h4>Your Rewards</h4> 
            <span v-if="validatorRewards !== ''">{{ validatorRewards }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</span>
            <br /> 
            <SoloRewardModal 
                :validator-name="validatorDetails.description?.moniker"
                :op-address="validatorDetails.operator_address"
                :total-reward="validatorRewards" 
                type="fromValidatorDetail"
            />
          </v-col>
        </v-row>
      </div>
      <!-- Button part -->
      <div class="mt-6">
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="4"
            class="pa-4" 
          > 
 
            <DelegateModal
              v-if="logged"
              :chain-id-props="cosmosConfig[chainId].coinLookup.addressPrefix"
              :address-to="validatorAddr"
              :validator-name="validatorDetails.description?.moniker" 
            />
          </v-col>
          <v-col
            cols="12"
            sm="4"
            class="pa-4" 
          > 
          <RedelegateModal
              v-if="logged"
              :chain-id-props="cosmosConfig[chainId].coinLookup.addressPrefix"
              :address-from="validatorAddr"
              :amount-re="validatorDelegations / 1000000"
              :validator-name="validatorDetails.description?.moniker"
              :coin-icon="cosmosConfig[chainId].coinLookup.icon"
            />
          </v-col>
          <v-col
            cols="12"
            sm="4"
            class="pa-4" 
          > 
            <UndelegateSingleModal
              v-if="logged"
              :chain-id-props="cosmosConfig[chainId].coinLookup.addressPrefix"
              :address-from="validatorAddr"
              :amount-un="validatorDelegations / 1000000"
              :amount-total-un="myTotalUnDelegation"
              :validator-name="validatorDetails.description?.moniker"
              :coin-icon="cosmosConfig[chainId].coinLookup.icon"
            />
          </v-col>
        </v-row>
      </div>
    </v-sheet>
  </div>
</template>
<script>
import { mapState } from "vuex";
import dayjs from "dayjs";
import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  GasPrice,
  calculateFee,
} from "@cosmjs/stargate";
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
    myTotalUnDelegation: "", 
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
      "validatorUnDelegations",
      "validatorRewards",
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
    this.validatorAddr = this.$route.params.id;
    await this.$store.dispatch("data/getValidatorDetails", this.validatorAddr);
  },
  async mounted() {
    await this.$store.dispatch("keplr/checkLogin");
    await this.$store.dispatch("data/getValidatorRewards", { validatorAddr: this.validatorAddr, delegatorAddr: this.accounts[0].address });
  },
  methods: {
    async getTxDate(height) {
      const block = await this.rpcClient.block(Number(height));
      return block.block.header.time;
    },
    async getValidatorRewards() {

        const chainId = cosmosConfig[this.chainId].chainId;
        await window.keplr.enable(chainId);
        const offlineSigner = await window.getOfflineSignerAuto(chainId);
        const accounts = await offlineSigner.getAccounts();

        const client = await SigningStargateClient.connectWithSigner(
          cosmosConfig[this.chainId].rpcURL,
          offlineSigner,
          {
            gasPrice: GasPrice.fromString(
              cosmosConfig[this.chainId].gasPrice +
                cosmosConfig[this.chainId].coinLookup.chainDenom
            ),
          }
        );

        const foundMsgType = defaultRegistryTypes.find(
          (element) =>
            element[0] ===
            "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
        );
        const copieDelegator = [];
 
        copieDelegator.push({
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            delegatorAddress: accounts[0].address,
            validatorAddress: this.validatorAddr,
          }),
        });
 
        try {
          const result = await client.signAndBroadcast(
            accounts[0].address,
            copieDelegator,
            "auto",
            ""
          );
          assertIsDeliverTxSuccess(result);

        } catch (error) {
          console.error(error);
        }
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
