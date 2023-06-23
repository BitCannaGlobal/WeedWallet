<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="600px"
      overlay-opacity="0.8"
      overlay-color="#000000"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          v-if="type === 'simpleSend'"
          large
          block
          v-bind="attrs"
          class="mt-2 white--text"
          color="#0FB786"
          v-on="on"
        >
          Send
        </v-btn>
        <v-btn
          v-else
          dark
          v-bind="attrs"
          color="#00b786"
          v-on="on"
        >
          <v-icon class="mr-2">
            mdi-send-circle
          </v-icon> Send
        </v-btn>
      </template>
      <v-card color="#161819">
        <v-card-title>
          <span
            v-if="step1"
            class="text-h5"
          >Send transaction</span>
          <span
            v-if="step2"
            class="text-h5"
          >Check transaction </span>
          <span
            v-if="step3"
            class="text-h5"
          >Wait from keplr</span>
          <span
            v-if="step4"
            class="text-h5"
          >Transaction send!</span>
          <v-spacer />
          <v-icon
            class="mr-2"
            @click="dialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form
            v-if="step1"
            ref="form"
            v-model="dislableSend"
            lazy-validation
          >
            <v-row>
              <v-col cols="12">
                <!-- <v-col class="text-right">
                  <v-chip @click="getQuarter">
                    1/4
                  </v-chip>
                  <v-chip @click="getHalf">
                    1/2
                  </v-chip>
                  <v-chip @click="getMax">
                    Max
                  </v-chip>
                </v-col> -->
                <span class="text-left">Available: {{ amountAvailable }} BCNA</span>
                <br><br>
                <h3 class="mt-1 ml-1 mb-1">
                  Address*
                </h3>
                <v-text-field
                  v-model="address"
                  :rules="addressRules"
                  background-color="#0F0F0F"
                  required                    
                  flat 
                  solo
                />
                <h3 class="ml-1 mb-1">
                  Amount*
                </h3>
                <v-text-field
                  v-model="amount"
                  flat 
                  solo
                  :rules="amountRules"
                  type="text"
                  background-color="#0F0F0F"
                >
                  <template #append>
                    <!-- <img
                      width="24"
                      height="24"
                      :srcset="coinIcon"
                      alt=""
                      :class="`rounded-xl`"
                    > -->
                    <v-chip
                      label
                      small
                      @click="getMax"
                    >
                      Max
                    </v-chip>
                  </template>
                </v-text-field>
                <h3 class="ml-1 mb-1">
                  Memo (Optional)
                </h3>
                <v-text-field
                  v-model="memo"
                  background-color="#0F0F0F"
                  required
                  flat 
                  solo
                />
              </v-col>
            </v-row>
          </v-form>
          <v-form
            v-if="step2"
            ref="form"
            lazy-validation
          >
            <v-sheet
              outlined
              color="gray"
              rounded
            >
              <v-card
                color="#1C1D20"
                class="pa-2"
                outlined
                tile 
              >
                <v-list-item two-line>
                  <v-list-item-content>        
                    <v-list-item-subtitle class="mb-2">
                      <h3>Transaction</h3>
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      <h3>${{ (amount * priceNow).toFixed(2) }}</h3><!--  ({{ priceNow }}) -->
                    </v-list-item-title>
                    <v-list-item-title>
                      <h3>{{ amount }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</h3>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>        
                    <v-list-item-subtitle class="mb-2">
                      <h3>Gas/fee</h3>
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      <h3>
                        {{ gasFee.gas }} / {{ gasFee.fee / 1000000 }}
                        {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                      </h3>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  v-if="memo !== ''"
                  two-line
                >
                  <v-list-item-content>        
                    <v-list-item-subtitle class="mb-2">
                      <h3>Memo</h3>
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      <h3>{{ memo }}</h3>
                    </v-list-item-title> 
                  </v-list-item-content>
                </v-list-item>    
                <!-- <v-simple-table class="accent">
                  <template #default>
                    <tbody>
                      <tr>
                        <td>Amount</td>
                        <td>
                          {{ amount }}
                          {{ cosmosConfig[chainId].coinLookup.viewDenom }} 

                          <v-tooltip
                            v-if="feeDeducted"
                            color="black"
                            top
                          >
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
                              The fees have been deducted automatically
                            </span>
                          </v-tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>To</td>
                        <td>{{ address }}</td>
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
                </v-simple-table> -->
              </v-card>
            </v-sheet>      
            <h3 class="mt-4 ml-1 mb-2">
              Memo (Optional)
            </h3>
            <v-text-field
              v-model="memo"              
              background-color="#0F0F0F"
              required
              flat 
              solo
            /> 
  
            <v-row>
              <v-col cols="12" />
            </v-row>
          </v-form>

          <v-row v-if="step3">
            <v-col
              cols="12"
              align="center"
              justify="center"
            >
            <v-img
                max-height="102"
                max-width="102"
                src="icons/pending.svg"
              ></v-img>
              <br />
              <h3>Transaction pending</h3> 
              <h4>Your transaction is waiting to get approved on the blockchain.</h4>
            </v-col>
          </v-row>
          <v-row v-if="step4">
            <v-col
              cols="12"
              align="center"
              justify="center"
            >
            <v-img
                max-height="102"
                max-width="102"
                src="icons/approved.svg"
              ></v-img>
              <br />
              <h3>Transaction approved</h3> 
              <h4>Your transaction has been approved on the blockchain.</h4>
            </v-col>
          </v-row>
          <v-btn
            v-if="step2"
            :disabled="!dislableSend"
            :loading="loading"
            color="#00b786"
            block
            class="mt-1"
            x-large
            @click="validatestep2"            
          >
            Send tx
            <v-icon
              right
            >
              mdi-arrow-right-thick
            </v-icon>            
          </v-btn>
          <v-btn
            v-if="step2"
            color="#1C1D20"
            block
            class="mt-4"
            x-large
            @click="returnStep"
          >            
            <v-icon
              left
            >
              mdi-arrow-left-thick
            </v-icon> 
            Return
          </v-btn>
          <v-btn
            v-if="step1"
            :disabled="!dislableSend"
            :loading="loading"
            color="#00b786"
            block
            x-large
            @click="validate"
          >
            Next step
            <v-icon
              right
            >
              mdi-arrow-right-thick
            </v-icon>             
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import bech32 from "bech32";
import cosmosConfig from "~/cosmos.config";
import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  GasPrice,
  calculateFee,
} from "@cosmjs/stargate";

function bech32Validation(address) {
  try {
    bech32.decode(address);
    return true;
  } catch (error) {
    return false;
  }
}
function countPlaces(num) {
  const sep = String(23.32).match(/\D/)[0];
  const b = String(num).split(sep);
  return b[1] ? b[1].length : 0;
}
export default {
  props: ["chainIdProps", "amountAvailable", "coinIcon", "type"],
  data: (instance) => ({
    e1: 1,
    eError: true,
    dialog: false,
    dialogStepper: false,
    dislableSend: true,
    address: "",
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    feeDeducted: false,
    gasFee: {},
    bcnaAddon: false,
    addressRules: [
      (v) => !!v || "Address is required",
      (v) =>
        v.startsWith(instance.chainIdProps.toLowerCase()) ||
        'Address must start with "' + instance.chainIdProps.toLowerCase() + '"',
      (v) => bech32Validation(v) || "Bad address (not bech32)",
    ],
    amount: "",
    amountRules: [
      (v) => !!v || "Amount is required",
      (v) => !isNaN(v) || "Amount must be number",
      (v) =>
        v <= instance.amountAvailable ||
        "Amount equal or above available amount (" +
          instance.amountAvailable +
          ")",
      (v) => countPlaces(v) < 7 || "Bad decimal",
    ],
    memo: "",
    loading: false,
    loadingInput: false,
    cosmosConfig: cosmosConfig,
  }),
  computed: {
    ...mapState("keplr", [`accounts`]),
    ...mapState("data", ["chainId", `balances`, 'priceNow']),
  },
  watch: {
    dialog(value) {
      if (value) {
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.address = "";
        this.amount = "";
      }
    },
  },
  async mounted() {
    // TODO: https://gist.github.com/atmoner/a5f22555948a285890c8d95be908bac7
    this.step1 = true;
  },
  methods: {
    getMax() {
      this.amount = this.amountAvailable;
    },
    getHalf() {
      this.amount = (this.amountAvailable / 2).toFixed(6);
    },
    getQuarter() {
      this.amount = (this.amountAvailable / 4).toFixed(6);
    },
    test() {
      this.dialogStepper = true;
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
          offlineSigner
        );

        const foundMsgType = defaultRegistryTypes.find(
          (element) => element[0] === "/cosmos.bank.v1beta1.MsgSend"
        );

        const convertAmount = Math.round(this.amount * 1000000);
        const amount = {
          denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
          amount: convertAmount.toString(),
        };

        const finalMsg = {
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            fromAddress: this.accounts[0].address,
            toAddress: this.address,
            amount: [amount],
          }),
        };

        const gasEstimation = await client.simulate(
          this.accounts[0].address,
          [finalMsg],
          this.memo
        );
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.chainId].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.chainId].gasPrice +
              cosmosConfig[this.chainId].coinLookup.chainDenom
          )
        );
        // Recalculate fee if amount is too high
        if (
          usedFee.amount[0].amount / 1000000 + Number(this.amount) >
          this.amountAvailable
        ) {
          this.amount = (
            Number(this.amount) -
            usedFee.amount[0].amount / 1000000
          ).toFixed(6);
          this.feeDeducted = true;
        } else {
          this.feeDeducted = false;
        }

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
          console.log(
            cosmosConfig[this.chainId].gasPrice +
              cosmosConfig[this.chainId].coinLookup.chainDenom
          );

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
          const amount = {
            denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
            amount: convertAmount.toString(),
          };

          try {
            const result = await client.sendTokens(
              accounts[0].address,
              this.address,
              [amount],
              "auto",
              this.memo
            );
            this.e1 = 2;
            assertIsDeliverTxSuccess(result);
            this.step3 = false;
            this.step4 = true;
            this.loading = false;
            await this.$store.dispatch("data/refresh", accounts[0].address);
            this.e1 = 3;
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
