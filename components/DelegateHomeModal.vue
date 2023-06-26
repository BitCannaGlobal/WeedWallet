<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
  >
    <template #activator="{ on, attrs }">
      <br>
      <v-btn
        large
        min-width="200"
        class="mt-2 white--text"
        color="#0FB786"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon class="mr-2">
          mdi-cube-send
        </v-icon> Delegate BitCanna
      </v-btn>
    </template>
    <v-card color="#161819">
      <v-card-title>
        <span
          v-if="step1"
          class="text-h5"
        >Delegate token</span>
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
          v-if="step1"
          ref="form"
          v-model="dislableSend"
          lazy-validation
        > 
          <v-row>
            <v-col cols="12">
              <span class="text-left">Available: {{ amount }} BCNA</span>
              <br><br> 
              <h3 class="mt-1 ml-1 ">
                Amount to delegate*
              </h3>
              <v-text-field
                v-model="amountFinal" 
                :rules="amountRules"
                required
                flat 
                solo
                background-color="#0F0F0F"
                class="mt-1"
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
              <h3 class="mt-1 ml-1 mb-1">
                Delegate to*
              </h3>
              <v-select
                v-model="addressTo"
                :rules="addressToRules"
                item-text="name"
                item-value="address"
                :items="validatorListSearch" 
                flat 
                solo
                background-color="#0F0F0F"
              >
                <template #prepend-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-text-field
                        v-model="searchTerm"
                        outlined
                        placeholder="Search validator"
                        @input="searchVal"
                      />
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-2" />
                </template> 
              </v-select>
              <h3 class="mt-1 ml-1 mb-1">
                Memo
              </h3>
              <v-text-field
                v-model="memo"
                required
                flat 
                solo
                background-color="#0F0F0F"
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
                    <h3>Delegate to</h3>
                  </v-list-item-subtitle>
                  <v-list-item-title>
                    <h3>{{ valName }}</h3> 
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
                      {{ amountFinal }}
                      {{ cosmosConfig[chainId].coinLookup.viewDenom }}                        
                    </h3> 
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
            </v-card>
          </v-sheet>  
          <!--          <v-row>
            <v-col cols="12">
              <v-simple-table class="accent">
                <template #default>
                  <tbody>
                    <tr>
                      <td>Amount</td>
                      <td>
                        {{ amountFinal }}
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
                      <td>{{ addressTo }} </td>
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
          </v-row> -->
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
          color="#1C1D20"
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
          class="mt-4"
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
          Delegate
        </v-btn>
      </v-card-text> 
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
    "balances",
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
    address: '',
    addressVal: '',
    addressTo: '',
    addressToRules: [(v) => !!v || "Address to is required"],
    addressRules: [
      (v) => !!v || "Address is required",
      (v) =>
        v.startsWith(instance.chainIdProps.toLowerCase() + "valoper") ||
        'Address must start with "' +
          instance.chainIdProps.toLowerCase() +
          'valoper"',
      // v => bech32Validation(v) || 'Bad address (not bech32) ' + bech32Validation(v),
    ],
    amount: instance.balances / 1000000,
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
    validatorList: [],
    validatorListSearch: [],
    searchTerm: "",    
    valName: ''
  }),
  computed: {
    ...mapState("keplr", [`accounts`]),
    ...mapState("data", ["chainId", "allValidators"]),   
  },
  watch: {
    dialog(value) {
      if (value) {
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.amountFinal = "";
        this.addressTo = ''
      }
    },
  },
  async mounted() {
    
    await this.$store.dispatch("data/getAllValidator");
    const selectValidatorList = [];
    this.allValidators.forEach((item) => {
      selectValidatorList.push({
        name: item.description.moniker,
        address: item.operator_address,
      });
    });
    this.validatorList = selectValidatorList;
    this.validatorListSearch = this.validatorList;
  },  
  methods: {
    getMax() {
      this.amountFinal = this.amount;
    },
    getHalf() {
      this.amountFinal = (this.amount / 2).toFixed(6);
    },
    getQuarter() {
      this.amountFinal = (this.amount / 4).toFixed(6);
    },
    searchVal() {
      if (!this.searchTerm) {
        this.validatorListSearch = this.validatorList;
      }
      this.validatorListSearch = this.validatorList.filter((val) => {
        console.log(val.name);
        console.log(this.searchTerm);
        
        return val.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
    },       
    async validate() {
      if (this.$refs.form.validate() === true) {
        this.step1 = false;
        this.step2 = true;

        this.valName = this.validatorList.find(
          (element) => element.address === this.addressTo
        ).name;

        // Fee claculation
        const chainId = cosmosConfig[this.chainId].chainId;
        await window.keplr.enable(chainId);
        const offlineSigner = await window.getOfflineSignerAuto(chainId);
        const client = await SigningStargateClient.connectWithSigner(
          cosmosConfig[this.chainId].rpcURL,
          offlineSigner
        );

        const foundMsgType = defaultRegistryTypes.find(
          (element) => element[0] === "/cosmos.staking.v1beta1.MsgDelegate"
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
            validatorAddress: this.addressTo,
            amount: amount,
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

        // console.log((usedFee.amount[0].amount / 1000000) + Number(this.amountFinal))
        // Recalculate fee if amount is too high
        if (
          usedFee.amount[0].amount / 1000000 + Number(this.amountFinal) >
          this.balances / 1000000
        ) {
          this.amountFinal = (
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

          const convertAmount = Math.round(this.amountFinal * 1000000);
          const amountFinal = {
            denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
            amount: convertAmount.toString(),
          };

          try {
            const result = await client.delegateTokens(
              accounts[0].address,
              this.addressTo,
              amountFinal,
              1.3,
              this.memo
            );
            assertIsDeliverTxSuccess(result);
            console.log(result);
            this.step3 = false;
            this.step4 = true;
            this.loading = false;
            await this.$store.dispatch(
              "data/getDelegations",
              accounts[0].address
            );
            await this.$store.dispatch("data/getDelegatorDataRpc", {
              validator: this.addressTo,
              delegator: accounts[0].address,
            });
            await this.$store.dispatch("data/getValidatorDelegation", {
              validatorAddr: this.addressTo,
              delegatorAddr: accounts[0].address,
            });
            // await this.$store.dispatch('data/refresh', accounts[0].address)
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
