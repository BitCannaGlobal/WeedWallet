<template> 
  <div>
    <v-btn
      color="#FF0F0F"
      block
      class="mt-2"
      size="large"    
      :disabled="!amountUn" 
      @click="dialog = true"
    >
      <v-icon class="mr-2">
        mdi-account-multiple-remove
      </v-icon> Undelegate
    </v-btn>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <v-card color="#161819">
        <v-toolbar
          color="rgba(0, 0, 0, 0)"
          theme="dark"
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

          <v-toolbar-title>
            <span
              v-if="step1"
              class="carmenBold"
            >Undelegate from {{ validatorName }}</span>
            <span
              v-if="step2"
              class="carmenBold"
            >Check transaction </span>
            <span
              v-if="step3"
              class="carmenBold"
            >Wait from keplr</span>
            <span
              v-if="step4"
              class="carmenBold"
            >Transaction send!</span>
          </v-toolbar-title>

          <template #append>
            <v-btn
              icon="mdi-close"
              @click="dialog = false"
            />
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
                <span class="ml-1 text-left carmenBold">Available: {{ amountUn }} BCNA</span>
                <br><br>
                <h3 class="mt-1 ml-1 carmenBold">
                  Amount to delegate*
                </h3>
                <v-text-field
                  v-model="amount"
                  :rules="!loadingInput ? amountRules : ''"
                  type="text"
                  class="mt-4"
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
                <h3 class="mt-1 ml-1 mb-3 carmenBold">
                  Memo
                </h3>
                <v-text-field
                  v-model="memo" 
                  required
                  variant="solo"
                  bg-color="#0F0F0F"
                />
              </v-col>
            </v-row> 
          </v-form>
          <v-form
            v-if="step2"
            ref="form"
            lazy-validation
          >
            <v-row>
              <v-col cols="12">
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
                          <h3>Amount</h3>
                        </v-list-item-subtitle>
                        <v-list-item-title>
                          <h3>{{ amount }} {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}</h3>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item two-line>
                      <v-list-item-content>        
                        <v-list-item-subtitle class="mb-2">
                          <h3>From</h3>
                        </v-list-item-subtitle>
                        <v-list-item-title>
                          <h3>{{ validatorName }}</h3>
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
                  </v-card>
                </v-sheet>  


              <!--               <v-simple-table class="accent">
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
                      <td>{{ validatorName }}</td>
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
              </v-col>
            </v-row>
          </v-form>

          <v-row
            v-if="step3"
            class="carmenBold"
          >
            <v-col
              cols="12"
              align="center"
              justify="center"
            >
              <v-img
                max-height="102"
                max-width="102"
                src="https://wallet.bitcanna.io/icons/pending.svg"
              />
              <br>
              <h3>Transaction pending</h3> 
              <h4>Your transaction is waiting to get approved on the blockchain.</h4>
            </v-col>
          </v-row>
          <v-row
            v-if="step4"
            class="carmenBold"
          >
            <v-col
              cols="12"
              align="center"
              justify="center"
            >
              <v-img
                max-height="102"
                max-width="102"
                src="https://wallet.bitcanna.io/icons/approved.svg"
              />
              <br>
              <h3>Transaction approved</h3> 
              <h4>Your transaction has been approved on the blockchain.</h4>
            </v-col>
          </v-row>
          <v-btn
            v-if="step2"
           
            block
            x-large
            class="mt-4"
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
            x-large
            @click="validate"
          >
            Next step
          </v-btn>
          <v-btn
            v-if="step2"
            :disabled="!dislableSend"
            :loading="loading"
            color="#00b786"
            block
            x-large
            class="mt-4"
            @click="validatestep2"
          >
            Undelegate
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
import { selectSigner } from "~/libs/signer";
import cosmosConfig from "~/cosmos.config";
import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  GasPrice,
  calculateFee,
} from "@cosmjs/stargate";

function countPlaces(num) {
  const sep = String(23.32).match(/\D/)[0];
  const b = String(num).split(sep);
  return b[1] ? b[1].length : 0;
}

export default {
  props: [
    "chainIdProps",
    "addressFrom",
    "amountUn",
    "amountTotalUn",
    "validatorName",
    "coinIcon",
  ],
  setup() {
    const store = useAppStore()
    return {
      store
    }
  },
  data: (instance) => ({
    dialog: false,
    dislableSend: true,
    address: instance.addressFrom,
    amount: "",
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    feeDeducted: false,
    gasFee: {},
    addressRules: [
      (v) => !!v || "Address is required",
      (v) =>
        v.startsWith(instance.chainIdProps.toLowerCase() + "valoper") ||
        'Address must start with "' +
          instance.chainIdProps.toLowerCase() +
          'valoper"',
      //v => bech32Validation(v) || 'Bad address (not bech32)',
    ],
    amountRules: [
      (v) => !!v || "Amount is required",
      (v) => !isNaN(v) || "Amount must be number",
      (v) =>
        v <= instance.amountUn ||
        "Amount equal or above delegated amount (" + instance.amountUn + ")",
      (v) => countPlaces(v) < 7 || "Bad decimal",
    ],
    memo: "",
    loading: false,
    loadingInput: false,
    cosmosConfig: cosmosConfig,
  }),
  computed: {
    //...mapState("keplr", [`accounts`]),
    //...mapState("data", ["chainId", `balances`]),
    enableModal: function () {
      let isDeleg = false;
      if (this.amountTotalUn !== "0") isDeleg = true;

      return isDeleg;
    },
  },
  watch: {
    dialog(value) {
      if (value) {
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.amount = "";
      }
    },
  },
  methods: {
    getMax() {
      this.amount = Number(this.amountUn);
    },
    getHalf() {
      this.amount = (this.amountUn / 2).toFixed(6);
    },
    getQuarter() {
      this.amount = (this.amountUn / 4).toFixed(6);
    },
    async validate() {
      //if (this.$refs.form.validate() === true) {
        this.step1 = false;
        this.step2 = true;
        // Fee claculation
        const signer = await selectSigner(this.store.chainSelected, this.store.loggedType)

        const foundMsgType = defaultRegistryTypes.find(
          (element) => element[0] === "/cosmos.staking.v1beta1.MsgUndelegate"
        );

        const convertAmount = (this.amount * 1000000).toFixed(0);
        const amount = {
          denom: cosmosConfig[this.store.chainSelected].coinLookup.chainDenom,
          amount: convertAmount.toString(),
        };
        const finalMsg = {
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            delegatorAddress: signer.accounts[0].address,
            validatorAddress: this.address,
            amount: amount,
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
        this.gasFee = { fee: usedFee.amount[0].amount, gas: usedFee.gas };
      //}
    },
    returnStep() {
      this.step1 = true;
      this.step2 = false;
    },
    validatestep2() {
      // if (this.$refs.form.validate() === true) {
        (async () => {
          this.loading = true;
          this.step3 = true;
          this.step2 = false;

          const signer = await selectSigner(this.store.chainSelected, this.store.loggedType)
          const convertAmount = Number(this.amount).toFixed(2) * 1000000;
          const amountFinal = {
            denom: cosmosConfig[this.store.chainSelected].coinLookup.chainDenom,
            amount: convertAmount.toString(),
          };

          try {
            const result = await signer.client.undelegateTokens(
              signer.accounts[0].address,
              this.address,
              amountFinal,
              "auto",
              this.memo
            );
            assertIsDeliverTxSuccess(result);
            this.step3 = false;
            this.step4 = true;
            this.loading = false;
            /* await this.$store.dispatch("data/refresh", accounts[0].address);
 
            await this.$store.dispatch("data/getValidatorDelegation", {
              validatorAddr: this.address,
              delegatorAddr: accounts[0].address,
            }); */
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
      // }
    },
  },
};
</script>
