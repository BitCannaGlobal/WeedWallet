<template>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
      <br />
        <v-btn
          class="ma-2"
          dark
          v-bind="attrs"
          v-on="on"
          color="#00b786"
        >
        <v-icon class="mr-2">mdi-cube-send</v-icon> Delegate {{ chainName }}
        </v-btn>
      </template>
      <v-card class="accent">
        <v-card-title>
     
          <span v-if="step1" class="text-h5">Delegate to {{ validatorName }}</span>
          <span v-if="step2" class="text-h5">Check transaction </span>
          <span v-if="step3" class="text-h5">Wait from keplr</span>
          <span v-if="step4" class="text-h5">Transaction send!</span>
          <v-spacer></v-spacer>
          <v-icon class="mr-2" @click="dialog = false">mdi-close-circle</v-icon>          
        </v-card-title>
        <v-card-text>
        <v-form
          v-if="step1"
          ref="form"
          v-model="dislableSend"
          lazy-validation
        >
          <v-container>

            <v-row>
              <v-col cols="12">
                <v-col class="text-right">
                  <v-chip
                    @click="getQuarter"
                  >
                  1/4
                  </v-chip>
                  <v-chip
                    @click="getHalf"
                  >
                  1/2
                  </v-chip>
                  <v-chip
                    @click="getMax"
                  >
                  Max
                  </v-chip>
                </v-col>
                <v-text-field
                  v-model="amountFinal"
                  label="Amount to delegate*"
                  :rules="amountRules"
                  required
                  outlined
                  dense
                ></v-text-field>
                <!-- <v-text-field
                  v-model="addressVal"
                  label="Validator address*"
                  :rules="addressRules"
                  required
                  outlined
                  dense
                ></v-text-field> -->
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
          <v-form
          v-if="step2"
          ref="form"
          lazy-validation
        >

            <v-row>
              <v-col cols="12">
 
                <v-simple-table class="accent">
                  <template v-slot:default>
                     <tbody>
                      <tr>
                        <td>Amount</td>
                        <td>{{ amountFinal }} {{ cosmosConfig[chainId].coinLookup.viewDenom }} 
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
                        <td>To</td>
                        <td>{{ validatorName }}</td>
                      </tr>   
                      <tr>
                        <td>Memo</td>
                        <td>{{ memo }}</td>
                      </tr>    
                      <tr>
                        <td>Gas/fee</td>
                        <td>{{ gasFee.gas }} / {{ gasFee.fee  / 1000000 }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
                      </tr>                                                             
                    </tbody>
                  </template>
                </v-simple-table> 
              </v-col>
            </v-row>
          </v-form>   
          
            <v-row v-if="step3" >
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
                <img src="https://weedwallet-6.bitcanna.io/accepted.png">
              </v-col>
            </v-row>           
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="step2"
            color="#00b786"
            @click="returnStep"
          >
            Return
          </v-btn>   
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
import { mapState } from 'vuex'
import cosmosConfig from '~/cosmos.config'
import {
  defaultRegistryTypes,
	assertIsDeliverTxSuccess,
	SigningStargateClient,
	GasPrice,
  calculateFee,
  parseCoins
} from '@cosmjs/stargate'

  function countPlaces(num) {
    var sep = String(23.32).match(/\D/)[0];
    var b = String(num).split(sep);
    return b[1]? b[1].length : 0;
  } 

  export default {
    props: ['chainIdProps', 'addressTo', 'validatorName', 'balances', 'chainName'],
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
        v => !!v || 'Address is required',
        v => v.startsWith(instance.chainIdProps.toLowerCase() + 'valoper') || 'Address must start with "' + instance.chainIdProps.toLowerCase() + 'valoper"',
        // v => bech32Validation(v) || 'Bad address (not bech32) ' + bech32Validation(v),
      ],
      amount: (instance.balances / 1000000),
      amountFinal: '',
      amountRules: [
        v => !!v || 'Amount is required',
        v => !isNaN(v) || 'Amount must be number',
        v => v <= (instance.balances / 1000000) || 'Amount must be above delegated amount (' + (instance.balances / 1000000) + ')',
        v => countPlaces(v) < 7 || 'Bad decimal',
      ],
      amountToDelegate: '',
      memo: '',
      loading: false,
      cosmosConfig: cosmosConfig
    }),
    computed: {
      ...mapState('keplr', [`accounts`]),
      ...mapState('data', ['chainId']),
    },  
    methods: {
      getMax () {
        this.amountFinal = this.amount
      },
      getHalf () {
        this.amountFinal = (this.amount / 2).toFixed(6)
      },
      getQuarter () {
        this.amountFinal = (this.amount / 4).toFixed(6)
      },
      async validate () {
        
        if  (this.$refs.form.validate() === true) {
          this.step1 = false
          this.step2 = true
          // Fee claculation 
          const chainId = cosmosConfig[this.chainId].chainId;
            await window.keplr.enable(chainId);
            const offlineSigner = await window.getOfflineSignerAuto(chainId);
            const client = await SigningStargateClient.connectWithSigner(
              cosmosConfig[this.chainId].rpcURL,
              offlineSigner
            )
             
          const foundMsgType = defaultRegistryTypes.find(element => element[0] === '/cosmos.staking.v1beta1.MsgDelegate');

          const convertAmount = Math.round(this.amount * 1000000)
          const amount = {
            denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
            amount: convertAmount.toString(),
          }             
          const finalMsg = {
              typeUrl: foundMsgType[0],
              value: foundMsgType[1].fromPartial({
                  delegatorAddress: this.accounts[0].address,
                  validatorAddress: this.addressVal,
                  amount: amount,
              }),
          };          
          let gasEstimation = await client.simulate(this.accounts[0].address, [finalMsg], this.memo)
          let usedFee = calculateFee(
              Math.round(gasEstimation * cosmosConfig[this.chainId].feeMultiplier), 
              GasPrice.fromString(cosmosConfig[this.chainId].gasPrice + cosmosConfig[this.chainId].coinLookup.chainDenom)
          )

          // console.log((usedFee.amount[0].amount / 1000000) + Number(this.amountFinal))
          // Recalculate fee if amount is too high
          if ((usedFee.amount[0].amount / 1000000) + Number(this.amountFinal) > (this.balances /1000000)) {
            this.amountFinal = (Number(this.amount) - (usedFee.amount[0].amount / 1000000)).toFixed(6)
            this.feeDeducted = true
          } else {
            this.feeDeducted = false
          }

          this.gasFee = { fee: (usedFee.amount[0].amount), gas: usedFee.gas } 
        }
      },
      returnStep () {
        this.step1 = true
        this.step2 = false
      },       
      validatestep2 () {
        if (this.$refs.form.validate() === true) {
          (async () => {

            this.loading = true
            this.step3 = true
            this.step2 = false

            const chainId = cosmosConfig[this.chainId].chainId;
            await window.keplr.enable(chainId);
            const offlineSigner = await window.getOfflineSignerAuto(chainId);
            const accounts = await offlineSigner.getAccounts();

            const client = await SigningStargateClient.connectWithSigner(
              cosmosConfig[this.chainId].rpcURL,
              offlineSigner,
              { gasPrice: GasPrice.fromString(cosmosConfig[this.chainId].gasPrice + cosmosConfig[this.chainId].coinLookup.chainDenom) }
            )
            
            const convertAmount = Math.round(this.amountFinal * 1000000)
            const amountFinal = {
              denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
              amount: convertAmount.toString(),
            }

            console.log(amountFinal)
 

            try {
              const result = await client.delegateTokens(accounts[0].address, this.addressVal, amountFinal, 1.3, this.memo)
              assertIsDeliverTxSuccess(result)
              console.log(result)
              this.step3 = false
              this.step4 = true
              this.loading = false
              await this.$store.dispatch('data/getDelegations', accounts[0].address)
              // await this.$store.dispatch('data/refresh', accounts[0].address)
             } catch (error) {
                console.error(error);
                this.eError = false
                this.loading = false
                this.step3 = false
                this.step2 = true
            }
          })();
        }
      },
    },
  }
</script>

