<template>
  <v-dialog v-model="dialog" max-width="900px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mr-4" color="#00b786" v-bind="attrs" v-on="on">
        <v-icon class="mr-2">mdi-download</v-icon> Claim all
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span v-if="step1" class="text-h5">Claim all</span>
        <span v-if="step2" class="text-h5">Check transaction </span>
        <span v-if="step3" class="text-h5">Wait from keplr</span>
        <span v-if="step4" class="text-h5">Transaction send!</span>
        <v-spacer></v-spacer>
        <v-icon class="mr-2" @click="dialog = false">mdi-close-circle</v-icon>
      </v-card-title>
      <v-card-text>
        <v-form v-if="step1" ref="form" v-model="dislableSend" lazy-validation>
          <v-container>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Validator name</th>
                  <th class="text-left">Delegate</th>
                  <th class="text-left">Amount rewarded</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in delegations" :key="item.op_address">
                  <td>{{ item.validatorName }}</td>
                  <!--<td>{{ item.op_address }}</td>-->
                  <td>
                    {{ (item.delegated / 1000000).toFixed(6) }}
                    {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                  </td>
                  <td>
                    {{ item.reward }}
                    {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <!-- <v-stepper v-model="e1" v-if="dialogStepper">
              <v-stepper-header>
                <v-stepper-step
                  :complete="e1 > 1"
                  step="1"
                  color="#00b786"
                >
                  Generate Tx
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                  :rules="[() => eError]"
                  :complete="e1 > 2"
                  step="2"
                >
                  Keplr call
                </v-stepper-step>


                <v-divider></v-divider>      

                <v-stepper-step :rules="[() => eError]" step="3" :complete="e1 === 3" color="green darken-2">
                  Tx send!
                </v-stepper-step>
              </v-stepper-header> 
            </v-stepper>  -->
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
                      </td>
                    </tr>
                    <tr>
                      <td>To</td>
                      <td></td>
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
            <img src="accepted.png" />
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
          Send tx
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import { notifWaiting, notifError, notifSuccess } from "~/libs/notifications";
import cosmosConfig from "~/cosmos.config";
import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  GasPrice,
  calculateFee,
} from "@cosmjs/stargate";

export default {
  props: ["chainIdProps", "amountClaimAll", "getAllDelegation"],
  data: (instance) => ({
    dialog: false,
    dialogStepper: false,
    e1: 1,
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    gasFee: {},
    eError: true,
    dislableSend: true,
    address: "",
    addressRules: [
      (v) => !!v || "Address is required",
      // v => v.startsWith(instance.chainIdProps.toLowerCase()) || 'Address must start with "' + instance.chainIdProps.toLowerCase() + '"',
      // v => bech32Validation(v) || 'Bad address (not bech32)',
    ],
    amount: "",
    amountRules: [
      (v) => !!v || "Amount is required",
      (v) => !isNaN(v) || "Amount must be number",
    ],
    memo: "",
    loading: false,
    cosmosConfig: cosmosConfig,
  }),
  computed: {
    ...mapState("data", ["chainId", `balances`, "delegations"]),
  },
  methods: {
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
          offlineSigner
        );

        const accounts = await offlineSigner.getAccounts();

        const foundMsgType = defaultRegistryTypes.find(
          (element) =>
            element[0] ===
            "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
        );
        const finalMsg = [];
        this.getAllDelegation.forEach(function (item) {
          finalMsg.push({
            typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
              delegatorAddress: accounts[0].address,
              validatorAddress: item.op_address,
            }),
          });
        });
        let gasEstimation = await client.simulate(
          accounts[0].address,
          finalMsg,
          this.memo
        );
        let usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.chainId].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.chainId].gasPrice +
              cosmosConfig[this.chainId].coinLookup.chainDenom
          )
        );
        this.gasFee = { fee: usedFee.amount[0].amount, gas: usedFee.gas };
      }
    },
    returnStep() {
      this.step1 = true;
      this.step2 = false;
    },
    validatestep2() {
      (async () => {
        this.$refs.form.validate();
        this.dialogStepper = true;
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

        const foundMsgType = defaultRegistryTypes.find(
          (element) =>
            element[0] ===
            "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
        );
        const copieDelegator = [];
        this.getAllDelegation.forEach(function (item) {
          copieDelegator.push({
            typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
              delegatorAddress: accounts[0].address,
              validatorAddress: item.op_address,
            }),
          });
        });
        console.log(copieDelegator);
        try {
          const result = await client.signAndBroadcast(
            accounts[0].address,
            copieDelegator,
            "auto",
            ""
          );
          assertIsDeliverTxSuccess(result);
          // this.dialog = false
          this.step3 = false;
          this.step4 = true;
          this.loading = false;
          //notifSuccess(this.$toast, result.transactionHash)
          await this.$store.dispatch("data/refresh", accounts[0].address);
        } catch (error) {
          console.error(error);
          this.eError = false;
          //this.$toast.dismiss(returnWaiting);
          //notifError(this.$toast)
          this.loading = false;
          this.step3 = false;
          this.step2 = true;
        } finally {
          await new Promise((resolve) => setTimeout(resolve, 4000));
          this.dialog = false;
        }
      })();
    },
  },
};
</script>

<style>
.vuetify-logo {
  height: 180px;
  width: 180px;
  transform: rotateY(560deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
