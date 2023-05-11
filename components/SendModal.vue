<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-if="type === 'simpleSend'"
          large
          block
          v-bind="attrs"
          v-on="on"
          class="mt-2 white--text" 
          color="#0FB786"
        >
          Send
        </v-btn>  
        <v-btn
          v-else
          dark
          v-bind="attrs"
          v-on="on"
          color="#00b786"
        >
          <v-icon class="mr-2">mdi-send-circle</v-icon> Send
        </v-btn>      
      </template>
      <v-card class="accent">
        <v-card-title>
          <span v-if="step1" class="text-h5">Send transaction</span>
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
                  v-model="amount"
                  outlined
                  dense
                  label="Amount*"
                  :rules="amountRules"
                  type="text"
                >
                  <template v-slot:append>
                    <img
                      width="24"
                      height="24"
                      :srcset='coinIcon'
                      alt=""
                      :class="`rounded-xl`"
                    >
                  </template>
                </v-text-field>

                <v-text-field
                  v-model="address"
                  label="Address*"
                  :rules="addressRules"
                  required
                  outlined
                  dense
                ></v-text-field>

                <v-text-field
                  v-model="memo"
                  label="Memo"
                  required
                  outlined
                  dense
                ></v-text-field> 
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
 
                <v-simple-table class="accent">
                  <template v-slot:default>
                     <tbody>
                      <tr>
                        <td>Amount</td>
                        <td>{{ amount }} {{ cosmosConfig[chainId].coinLookup.viewDenom }} 
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
                        <td>{{ address }}</td>
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
                <img src="accepted.png">
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

  </div>
</template>

<script>
import { mapState } from 'vuex'
import bech32 from 'bech32'
import cosmosConfig from '~/cosmos.config'
import {
  defaultRegistryTypes,
	assertIsDeliverTxSuccess,
	SigningStargateClient,
	GasPrice,
  calculateFee  
} from '@cosmjs/stargate'


  function bech32Validation(address) {
    try {
      bech32.decode(address)
      return true
    } catch (error) {
      return false
    }
  }
  function prefixValidation(address) {
    if (address && address.startsWith(this.network.addressPrefix)) {
      return true
    } else {
      return false
    }
  }
  function countPlaces(num) {
    var sep = String(23.32).match(/\D/)[0];
    var b = String(num).split(sep);
    return b[1]? b[1].length : 0;
  }  
  export default {
    props: ['chainIdProps', 'amountAvailable', 'coinIcon', 'type'],
    data: (instance) => ({
      e1: 1,
      eError: true,
      dialog: false,
      dialogStepper: false,
      dislableSend: true,
      address: '',
      step1: true,
      step2: false,
      step3: false,
      step4: false,
      feeDeducted: false,
      gasFee: {},
      bcnaAddon: false,
      addressRules: [
        v => !!v || 'Address is required',
        v => v.startsWith(instance.chainIdProps.toLowerCase()) || 'Address must start with "' + instance.chainIdProps.toLowerCase() + '"',
        v => bech32Validation(v) || 'Bad address (not bech32)',
      ],
      amount: '',
      amountRules: [
        v => !!v || 'Amount is required',
        v => !isNaN(v) || 'Amount must be number',
        v => v <= instance.amountAvailable || 'Amount equal or above available amount (' + instance.amountAvailable + ')',
        v => countPlaces(v) < 7 || 'Bad decimal',
      ],
      memo: '',
      loading: false,
      loadingInput: false,
      cosmosConfig: cosmosConfig
    }),
    computed: {
      ...mapState('keplr', [`accounts`]),
      ...mapState('data', ['chainId', `balances`]),
    },    
    watch: {
 
    },    
    async mounted () {
      // TODO: https://gist.github.com/atmoner/a5f22555948a285890c8d95be908bac7
    },
    methods: {
      getMax () {
        this.amount = this.amountAvailable
      },
      getHalf () {
        this.amount = (this.amountAvailable / 2).toFixed(6)
      },
      getQuarter () {
        this.amount = (this.amountAvailable / 4).toFixed(6)
      },
      test () {
        this.dialogStepper = true
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
             
          const foundMsgType = defaultRegistryTypes.find(element => element[0] === '/cosmos.bank.v1beta1.MsgSend');

          const convertAmount = Math.round(this.amount * 1000000)
          const amount = {
            denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
            amount: convertAmount.toString(),
          }

          const finalMsg = {
            typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
                fromAddress: this.accounts[0].address,
                toAddress: this.address,
                amount: [amount],
            })
          }          
 
          let gasEstimation = await client.simulate(this.accounts[0].address, [finalMsg], this.memo)
          let usedFee = calculateFee(
              Math.round(gasEstimation * cosmosConfig[this.chainId].feeMultiplier), 
              GasPrice.fromString(cosmosConfig[this.chainId].gasPrice + cosmosConfig[this.chainId].coinLookup.chainDenom)
          )
          // Recalculate fee if amount is too high
          if ((usedFee.amount[0].amount / 1000000) + Number(this.amount) > this.amountAvailable) {
            this.amount = (Number(this.amount) - (usedFee.amount[0].amount / 1000000)).toFixed(6)
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
            console.log(cosmosConfig[this.chainId].gasPrice + cosmosConfig[this.chainId].coinLookup.chainDenom)

            const client = await SigningStargateClient.connectWithSigner(
              cosmosConfig[this.chainId].rpcURL,
              offlineSigner,
              { gasPrice: GasPrice.fromString(cosmosConfig[this.chainId].gasPrice + cosmosConfig[this.chainId].coinLookup.chainDenom) }
            )
            const convertAmount = Math.round(this.amount * 1000000)
            const amount = {
              denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
              amount: convertAmount.toString(),
            }

            try {

              const result = await client.sendTokens(accounts[0].address, this.address, [amount], 'auto', this.memo)
              this.e1 = 2
              assertIsDeliverTxSuccess(result)
              this.step3 = false
              this.step4 = true
              this.loading = false
              await this.$store.dispatch('data/refresh', accounts[0].address)
              this.e1 = 3              
            } catch (error) {
                console.error(error);
                this.eError = false
                this.loading = false
                this.step3 = false
                this.step2 = true
            } finally {
              await new Promise(resolve => setTimeout(resolve, 4000))
              this.dialog = false
            }
          })();
        }
      },
    },
  }
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

.invertColor {
   -webkit-filter: invert(1);
   filter: invert(1);
   }
</style>
