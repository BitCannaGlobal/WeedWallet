<template>
  <div>
    <v-btn
      size="large"
      min-width="200"
      class="mt-8 white--text"
      color="#0FB786"
      @click="openDialog()"
    >
      <v-icon class="mr-2">
        mdi-cube-send
      </v-icon> Delegate BitCanna
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
            >Delegate token</span>
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
                <span class="text-left carmenBold">Available: {{ amountAvailable }} BCNA</span>
                <br><br> 
                <h3 class="mt-1 ml-1 carmenBold">
                  Amount to delegate*
                </h3>
                <v-text-field 
                  v-model="amountFinal" 
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
 
                <h3 class="mt-1 ml-1 mb-1 carmenBold">
                  Delegate to*
                </h3> 
                <v-select
                  v-model="addressTo"
                  :rules="addressToRules"
                  item-title="name"
                  item-value="address"
                  :items="validatorListSearch" 
                  required
                  variant="solo"
                  bg-color="#0F0F0F"
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
                <h3 class="mt-1 ml-1 mb-1 carmenBold">
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
                        {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}                        
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
                        {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}
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
                src="icons/pending.svg"
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
            size="large"
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
            size="large"
            class="mt-4 mb-4"
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
            size="large"
            class="mt-4 mb-4"
            @click="validatestep2"
          >
            Delegate
          </v-btn>
        </v-card-text> 
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
    "amountAvailable",
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
    amount: instance.amountAvailable,
    amountFinal: "",
    amountRules: [
      (v) => !!v || "Amount is required",
      (v) => !isNaN(v) || "Amount must be number",
      (v) =>
        v <= instance.amountAvailable ||
        "Amount must be above delegated amount (" +
          instance.amountAvailable +
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
    /* ...mapState("keplr", [`accounts`]),
    ...mapState("data", ["chainId", "allValidators"]), */   
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
 
  created() {
 

  },  
  methods: {
    openDialog() {
      this.dialog = true;
      //await this.store.getStakingModule()
      const selectValidatorList = [];
      for (const i of this.store.allValidators) {
        selectValidatorList.push({
          'name': i.name,
          'address': i.op_address,
        });
      }  
      
      this.validatorList = selectValidatorList;
      this.validatorListSearch = this.validatorList; 
    },
    getMax() {
      this.amountFinal = this.amountAvailable;
    },
    getHalf() {
      this.amountFinal = (this.amountAvailable / 2).toFixed(6);
    },
    getQuarter() {
      this.amountFinal = (this.amountAvailable / 4).toFixed(6);
    },
    searchVal() {
      if (!this.searchTerm) {
        this.validatorListSearch = this.validatorList;
      }
      this.validatorListSearch = this.validatorList.filter((val) => {        
        return val.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
    },       
    async validate() {
      //if (this.$refs.form.validate() === true) {
        this.step1 = false;
        this.step2 = true;

        this.valName = this.validatorList.find(
          (element) => element.address === this.addressTo
        ).name;

        // Fee claculation
        /* const chainId = cosmosConfig[this.store.chainSelected].chainId;
        await window.keplr.enable(chainId);
        const offlineSigner = await window.getOfflineSignerAuto(chainId);
        const client = await SigningStargateClient.connectWithSigner(
          cosmosConfig[this.store.chainSelected].rpcURL,
          offlineSigner
        ); */
        const signer = await selectSigner(this.store.chainSelected, this.store.loggedType)

        const foundMsgType = defaultRegistryTypes.find(
          (element) => element[0] === "/cosmos.staking.v1beta1.MsgDelegate"
        );

        const convertAmount = Math.round(this.amountFinal * 1000000);
        const amount = {
          denom: cosmosConfig[this.store.chainSelected].coinLookup.chainDenom,
          amount: convertAmount.toString(),
        };
        const finalMsg = {
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            delegatorAddress: signer.accounts[0].address,
            validatorAddress: this.addressTo,
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

        // console.log((usedFee.amount[0].amount / 1000000) + Number(this.amountFinal))
 
        if (
          usedFee.amount[0].amount / 1000000 + Number(this.amountFinal) >
          this.balances 
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

          /* const chainId = cosmosConfig[this.store.chainSelected].chainId;
          await window.keplr.enable(chainId);
          const offlineSigner = await window.getOfflineSignerAuto(chainId);
          const accounts = await offlineSigner.getAccounts();

          const client = await SigningStargateClient.connectWithSigner(
            cosmosConfig[this.store.chainSelected].rpcURL,
            offlineSigner,
            {
              gasPrice: GasPrice.fromString(
                cosmosConfig[this.store.chainSelected].gasPrice +
                  cosmosConfig[this.store.chainSelected].coinLookup.chainDenom
              ),
            }
          ); */
          const signer = await selectSigner(this.store.chainSelected, this.store.loggedType)


          const convertAmount = Math.round(this.amountFinal * 1000000);
          const amountFinal = {
            denom: cosmosConfig[this.store.chainSelected].coinLookup.chainDenom,
            amount: convertAmount.toString(),
          };

          try {
            const result = await signer.client.delegateTokens(
              signer.accounts[0].address,
              this.addressTo,
              amountFinal,
              'auto',
              this.memo
            );
            assertIsDeliverTxSuccess(result);
            await this.store.refresh()
            this.step3 = false;
            this.step4 = true;
            this.loading = false;
            
            /* await this.$store.dispatch(
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
            }); */
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
      //}
    },
  },
};
</script>
