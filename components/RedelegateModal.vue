<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="ma-2"
        color="#00b786"
        v-bind="attrs"
        v-on="on"
        :disabled="!enableModal"
      >
        <v-icon class="mr-2">mdi-account-convert</v-icon> Redelegate
      </v-btn>
    </template>
    <v-card class="accent">
      <v-card-title>
        <span v-if="step1" class="text-h5"
          >Redelegate from {{ validatorName }}</span
        >
        <span v-if="step2" class="text-h5">Check transaction </span>
        <span v-if="step3" class="text-h5">Wait from keplr</span>
        <span v-if="step4" class="text-h5">Transaction send!</span>
        <v-spacer></v-spacer>
        <v-icon class="mr-2" @click="dialog = false">mdi-close-circle</v-icon>
      </v-card-title>
      <v-card-text>
        <v-form v-if="step1" ref="form" v-model="dislableSend" lazy-validation>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-col class="text-right">
                  <v-chip @click="getQuarter"> 1/4 </v-chip>
                  <v-chip @click="getHalf"> 1/2 </v-chip>
                  <v-chip @click="getMax"> Max </v-chip>
                </v-col>

                <v-text-field
                  v-model="amount"
                  outlined
                  label="Amount Redelegate*"
                  :rules="!loadingInput ? amountRules : ''"
                  type="text"
                  dense
                >
                  <template v-slot:append>
                    <img
                      width="24"
                      height="24"
                      :srcset="coinIcon"
                      alt=""
                      :class="`rounded-xl`"
                    />
                  </template>
                </v-text-field>
                <v-select
                  v-model="addressTo"
                  :rules="addressToRules"
                  item-text="name"
                  item-value="address"
                  :items="validatorList"
                  label="Redelegate to"
                  dense
                  outlined
                ></v-select>
                <v-text-field
                  v-model="memo"
                  label="Memo"
                  required
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-form v-if="step2" ref="form" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-simple-table class="accent">
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <td>Amount</td>
                      <td>
                        {{ amount }}
                        {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                        <!-- <span>Fee are automaticly deducted</span> -->

                        <v-tooltip v-if="feeDeducted" color="black" top>
                          <template v-slot:activator="{ on, attrs }">
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
                            The fees have been deducted automatically
                          </span>
                        </v-tooltip>
                      </td>
                    </tr>
                    <tr>
                      <td>From</td>
                      <td>{{ validatorName }}</td>
                    </tr>
                    <tr>
                      <td>To</td>
                      <td>{{ addressTo }}</td>
                    </tr>
                    <tr>
                      <td>Memo</td>
                      <td>{{ memo }}</td>
                    </tr>
                    <tr>
                      <td>Gas/fee</td>
                      <td>
                        {{ gasFee.gas }} / {{ gasFee.fee / 1000000 }}
                        {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-form>

        <v-row v-if="step3">
          <v-col cols="12" align="center" justify="center">
            <v-progress-circular
              :size="100"
              :width="10"
              color="#00b786"
              indeterminate
            ></v-progress-circular>
          </v-col>
        </v-row>
        <v-row v-if="step4">
          <v-col cols="12" align="center" justify="center">
            <img src="https://weedwallet-6.bitcanna.io/accepted.png" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="step2" color="#00b786" @click="returnStep"> Return </v-btn>
        <v-btn
          v-if="step1"
          :disabled="!dislableSend"
          :loading="loading"
          color="#00b786"
          @click="validate"
        >
          Next step
        </v-btn>
        <v-btn
          v-if="step2"
          :disabled="!dislableSend"
          :loading="loading"
          color="#00b786"
          @click="validatestep2"
        >
          Redelegate
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import { bech32 } from "bech32";
import { notifWaiting, notifError, notifSuccess } from "~/libs/notifications";
import cosmosConfig from "~/cosmos.config";
import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  GasPrice,
  calculateFee,
} from "@cosmjs/stargate";

function countPlaces(num) {
  var sep = String(23.32).match(/\D/)[0];
  var b = String(num).split(sep);
  return b[1] ? b[1].length : 0;
}
export default {
  props: [
    "chainIdProps",
    "addressFrom",
    "amountRe",
    "validatorName",
    "coinIcon",
  ],
  data: (instance) => ({
    dialog: false,
    dislableSend: true,
    address: instance.addressFrom,
    addressTo: "",
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    feeDeducted: false,
    gasFee: {},
    addressToRules: [(v) => !!v || "Address to is required"],
    addressRules: [
      (v) => !!v || "Address is required",
      (v) =>
        v.startsWith(instance.chainIdProps.toLowerCase() + "valoper") ||
        'Address must start with "' +
          instance.chainIdProps.toLowerCase() +
          'valoper"',
      //v => bech32Validation(v) || 'Bad address (not bech32)',
    ],
    amount: instance.amountRe,
    amountRules: [
      (v) => !!v || "Amount is required",
      (v) => !isNaN(v) || "Amount must be number",
      (v) =>
        v <= instance.amountRe ||
        "Amount equal or above delegated amount (" + instance.amountRe + ")",
      (v) => countPlaces(v) < 7 || "Bad decimal",
    ],
    memo: "",
    loading: false,
    loadingInput: false,
    cosmosConfig: cosmosConfig,
    validatorList: [],
  }),
  watch: {
    dialog(value) {
      if (value) {
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.addressTo = "";
        this.amount = "";
      }
    },
  },
  computed: {
    ...mapState("keplr", [`accounts`]),
    ...mapState("data", ["chainId", `balances`, "allValidators"]),
    enableModal: function () {
      var isDeleg = false;
      if (this.amountRe !== 0) isDeleg = true;
      return isDeleg;
    },
  },
  async mounted() {
    await this.$store.dispatch("data/getAllValidator");
    let selectValidatorList = [];
    this.allValidators.forEach((item) => {
      if (item.description.moniker !== this.validatorName) {
        selectValidatorList.push({
          name: item.description.moniker,
          address: item.operator_address,
        });
      }
    });
    this.validatorList = selectValidatorList;
  },
  methods: {
    getMax() {
      this.amount = this.amountRe;
    },
    getHalf() {
      this.amount = this.amountRe / 2;
    },
    getQuarter() {
      this.amount = this.amountRe / 4;
    },
    async validate() {
      if (this.$refs.form.validate() === true) {
        this.step1 = false;
        this.step2 = true;
        // Fee claculation
        const chainId = cosmosConfig[this.chainId].chainId;
        await window.keplr.enable(chainId);
        const offlineSigner = await window.getOfflineSignerAuto(chainId);
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
            element[0] === "/cosmos.staking.v1beta1.MsgBeginRedelegate"
        );

        const convertAmount = Math.round(this.amount * 1000000);
        const amount = {
          denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
          amount: convertAmount.toString(),
        };
        const finalMsg = {
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            delegatorAddress: this.accounts[0].address,
            validatorSrcAddress: this.address,
            validatorDstAddress: this.addressTo,
            amount: amount,
          }),
        };

        let gasEstimation = await client.simulate(
          this.accounts[0].address,
          [finalMsg],
          this.memo
        );

        let usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.chainId].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.chainId].gasPrice +
              cosmosConfig[this.chainId].coinLookup.chainDenom
          )
        );
        console.log(usedFee);
        console.log(usedFee.amount[0].amount / 1000000 + Number(this.amount));
        // Recalculate fee if amount is too high
        /* if ((usedFee.amount[0].amount / 1000000) + Number(this.amount) > (this.balances /1000000)) {
            this.amount = (Number(this.amount) - (usedFee.amount[0].amount / 1000000)).toFixed(6)
            this.feeDeducted = true
          } else {
            this.feeDeducted = false
          } */

        this.gasFee = { fee: usedFee.amount[0].amount, gas: usedFee.gas };
      }
    },
    returnStep() {
      this.step1 = true;
      this.step2 = false;
    },
    validatestep2() {
      if (this.$refs.form.validate() === true) {
        (async () => {
          this.loading = true;
          this.step3 = true;
          this.step2 = false;

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
          const convertAmount = Math.round(this.amount * 1000000);

          const amountFinal = {
            denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
            amount: convertAmount.toString(),
          };
          const fee = {
            amount: [
              {
                denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
                amount: "5000",
              },
            ],
            gas: "300000", // Need more gas for redelegation!
          };
          const MsgBeginRedelegate = defaultRegistryTypes[16][1]; // MsgBeginRedelegate
          const reDelegateMsg = {
            typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
            value: MsgBeginRedelegate.fromPartial({
              delegatorAddress: accounts[0].address,
              validatorSrcAddress: this.address,
              validatorDstAddress: this.addressTo,
              amount: amountFinal,
            }),
          };
          console.log(reDelegateMsg);
          try {
            const result = await client.signAndBroadcast(
              accounts[0].address,
              [reDelegateMsg],
              "auto",
              this.memo
            );
            assertIsDeliverTxSuccess(result);
            this.step3 = false;
            this.step4 = true;
            this.loading = false;

            await this.$store.dispatch("data/refresh", accounts[0].address);
            await this.$store.dispatch("data/getValidatorDelegation", {
              validatorAddr: this.address,
              delegatorAddr: accounts[0].address,
            });
          } catch (error) {
            console.error(error);
            this.eError = false;
            this.loading = false;
            this.step3 = false;
            this.step2 = true;
          } finally {
            await new Promise((resolve) => setTimeout(resolve, 4000));
            this.dialog = false;
          }
        })();
      }
    },
  },
};
</script>
