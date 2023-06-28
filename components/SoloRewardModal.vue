<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    max-height="1200px"
  >
    <template #activator="{ on, attrs }">
 
      <v-btn
        v-bind="attrs"
        block 
        v-on="on"
      > Claim
      </v-btn>
    </template>
    <v-card color="#161819">
      <v-card-title>
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
          mdi-close-circle
        </v-icon>
      </v-card-title>
      <v-card-text>
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
                  class="pa-2"
                  outlined
                  tile 
                >
                  <v-list-item two-line>
                    <v-list-item-content>        
                      <v-list-item-subtitle class="mb-2">
                        <h3>Claim from</h3>
                      </v-list-item-subtitle>
                      <v-list-item-title>
                        <h3>{{ validatorName }}</h3> 
                        <h5>{{ opAddress }}</h5>  
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item two-line>
                    <v-list-item-content>        
                      <v-list-item-subtitle class="mb-2">
                        <h3>Amount</h3>
                      </v-list-item-subtitle>
                      <v-list-item-title>
                        <h3>
                          {{ validatorRewards }}
                          {{ cosmosConfig[chainId].coinLookup.viewDenom }}                        
                        </h3> 
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>                
 
                </v-card>
              </v-sheet> 
            </v-col>
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
          x-large
          class="mt-4"
          @click="validatestep2"
        >
          Claim
        </v-btn>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import cosmosConfig from "~/cosmos.config";
import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  GasPrice,
  calculateFee
} from "@cosmjs/stargate";

function countPlaces(num) {
  const sep = String(23.32).match(/\D/)[0];
  const b = String(num).split(sep);
  return b[1] ? b[1].length : 0;
}

export default {
  props: [
    "chainIdProps",
    "addressTo",
    "validatorName",
    "opAddress",
    "totalReward",
  ],
  data: (instance) => ({
    dialog: false,
    dislableSend: true,
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    feeDeducted: false,
    gasFee: {},
    address: instance.addressFrom,
    addressVal: instance.addressTo,
    addressRules: [
      (v) => !!v || "Address is required",
      (v) =>
        v.startsWith(instance.chainIdProps.toLowerCase() + "valoper") ||
        'Address must start with "' +
          instance.chainIdProps.toLowerCase() +
          'valoper"',
      // v => bech32Validation(v) || 'Bad address (not bech32) ' + bech32Validation(v),
    ],
    amountFinal: "",
    amountRules: [
      (v) => !!v || "Amount is required",
      (v) => !isNaN(v) || "Amount must be number",
      (v) =>
        v <= instance.balances / 1000000 ||
        "Amount must be above delegated amount (" +
          instance.balances / 1000000 +
          ")",
      (v) => countPlaces(v) < 7 || "Bad decimal",
    ],
    amountToDelegate: "",
    memo: "",
    loading: false,
    cosmosConfig: cosmosConfig,
  }),
  computed: {
    ...mapState("keplr", [`accounts`]),
    ...mapState("data", ["chainId", 'balances', 'validatorRewards']),
  },
  watch: {
    dialog(value) {
      if (value) {
        this.step1 = false;
        this.step2 = true;
        this.step3 = false;
        this.step4 = false;
        this.amountFinal = "";
      }
    },
  }, 
  methods: {
 
    validatestep2() {
      if (this.$refs.form.validate() === true) {

        this.loading = true;
        this.step3 = true;
        this.step2 = false;
        (async () => {
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
        const fee = {
          amount: [
            {
              denom: cosmosConfig[this.chainId].chainDenom,
              amount: "5000",
            },
          ],
          gas: "200000",
        };
 
        try {
          console.log(this.opAddress)
          const result = await client.withdrawRewards(
            accounts[0].address,
            this.opAddress,
            fee,
            ""
          );
          assertIsDeliverTxSuccess(result);
          this.step3 = false;
          this.step4 = true;
          this.loading = false;
          await this.$store.dispatch(
            "data/getDelegations",
            accounts[0].address
          );
          this.$store.commit("data/setValidatorRewards", 0.000000);
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
