<template>
  <div>
        <v-btn
          v-if="type === 'simpleSend'"
          size="large" 
          block
          class="mt-5 white--text"
          color="#0FB786"
          @click="dialog = true"
        >
          Send
        </v-btn>
        <v-btn
          v-else 
          block
          class="mt-2 white--text"
          color="#0FB786"
          @click="dialog = true"
        >  Send
        </v-btn>    
    <v-dialog
      v-model="dialog"
      max-width="600px"
      overlay-opacity="0.8"
      overlay-color="#000000"
    >
 
      <v-card color="#161819">
        <v-toolbar
            color="rgba(0, 0, 0, 0)"
            theme="dark"
          >
            <template v-slot:prepend>
              <v-avatar>
                  <v-img
                    max-width="32"
                    max-height="32"
                    :src="cosmosConfig[store.chainSelected].coinLookup.icon"
                    alt="Bitcanna"
                  ></v-img>
                </v-avatar>
            </template>

            <v-toolbar-title class="text-h6">
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
            </v-toolbar-title>

            <template v-slot:append>
              <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
            </template>
          </v-toolbar> 
 
        <v-card-text>
          <v-form
            v-if="step1"
            ref="form"
            v-model="dislableSend"
            lazy-validation
          >
            <v-row>
              <v-col cols="12">
                <span class="carmenBold text-left">Available: {{ amountAvailable }} BCNA</span>
                <br><br>
                <h3 class="carmenBold mt-1 ml-1 mb-1"> 
                  Address*
                </h3>
                <v-text-field
                  v-model="address"
                  :rules="addressRules" 
                  required                    
                  variant="solo"
                    bg-color="#0F0F0F"
                >
                <!-- <template #append-inner>
                    <v-chip
                      label
                      small
                      @click="getMax"
                    >
                    Max
                    </v-chip>
                  </template>   -->
                </v-text-field>
                <h3 class="carmenBold ml-1 mb-1">
                  Amount*
                </h3>
                  <v-text-field 
                    v-model="amount" 
                    :rules="amountRules"
                    required
                    variant="solo"
                    bg-color="#0F0F0F"
                    
                  >
                  <template #append-inner>
                    <v-chip
                      label
                      small
                      @click="getMax"
                    >
                    Max
                    </v-chip>
                  </template>            
                </v-text-field>              
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
                class="pa-2 carmenBold"
                outlined
                tile 
              >
                <v-list-item two-line>
                  <v-list-item-content>        
                    <v-list-item-subtitle class="mb-2">
                      <h3>Transaction</h3>
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      <h3>${{ (amount * store.priceNow).toFixed(2) }}</h3><!--  ({{ priceNow }}) -->
                    </v-list-item-title>
                    <v-list-item-title>
                      <h3>{{ amount }} {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}</h3>
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
                        {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}
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
              required
              variant="solo"
              bg-color="#0F0F0F"
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
              />
              <br>
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
              />
              <br>
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
            size="x-large"
            @click="validatestep2"            
          >
            Send tx
         
          </v-btn>
          <v-btn
            v-if="step2"
            color="#1C1D20"
            block
            class="mt-4"
            size="x-large"
            @click="returnStep"
          >            
 
            Return
          </v-btn>
          <v-btn
            v-if="step1"
            :disabled="!dislableSend"
            :loading="loading"
            color="#00b786"
            block
            size="x-large"
            @click="validate"
          >
            Next step
            
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
import { useAppStore } from '@/stores/data'
import bech32 from "bech32";
import cosmosConfig from "~/cosmos.config";
import { selectSigner, calculFee } from "~/libs/signer";
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
  setup() {
    const store = useAppStore()
    return {
      store
    }
  },  
  computed: {
    //...mapState("keplr", [`accounts`]),
    //...mapState("data", ["chainId", `balances`, 'priceNow']),
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
      //if (this.$refs.form.validate() === true) {
        this.step1 = false;
        this.step2 = true;
        // Fee claculation
        let signer = await selectSigner(this.store.chainSelected, this.store.loggedType)

        const foundMsgType = defaultRegistryTypes.find(
          (element) => element[0] === "/cosmos.bank.v1beta1.MsgSend"
        );

        const convertAmount = Math.round(this.amount * 1000000);
        const amount = {
          denom: cosmosConfig[this.store.chainSelected].coinLookup.chainDenom,
          amount: convertAmount.toString(),
        };

        const finalMsg = {
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            fromAddress: signer.accounts[0].address,
            toAddress: this.address,
            amount: [amount],
          }),
        };

        const gasEstimation = await signer.client.simulate(
          signer.accounts[0].address,
          [finalMsg],
          this.memo
        );
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.chainSelected].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.chainSelected].gasPrice +
              cosmosConfig[this.store.chainSelected].coinLookup.chainDenom
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
      //}
    },
    returnStep() {
      this.step1 = true;
      this.step2 = false;
    },
    validatestep2() {
      //if (this.$refs.form.validate() === true) {
        (async () => {
          this.loading = true;
          this.step3 = true;
          this.step2 = false;

          let signer = await selectSigner(this.store.chainSelected, this.store.loggedType)
          const convertAmount = Math.round(this.amount * 1000000);
          const amount = {
            denom: cosmosConfig[this.store.chainSelected].coinLookup.chainDenom,
            amount: convertAmount.toString(),
          };

          try {
            const result = await signer.client.sendTokens(
              signer.accounts[0].address,
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
            // await this.$store.dispatch("data/refresh", accounts[0].address);
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
      //}
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
