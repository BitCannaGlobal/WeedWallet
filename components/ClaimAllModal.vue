<template>
    <v-dialog
      v-model="dialog"
      max-width="900px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        class="mr-4"
        color="#00b786"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon class="mr-2">mdi-download</v-icon> Claim all
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Claim all</span>
          <v-spacer></v-spacer>
          <v-icon class="mr-2" @click="dialog = false">mdi-close-circle</v-icon>
        </v-card-title>
        <v-card-text>
        <v-form
          ref="form"
          v-model="dislableSend"
          lazy-validation
        >        
          <v-container>
            <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">
                  Validator name
                </th>
                <th class="text-left">
                  Delegate
                </th>
                <th class="text-left">
                  Amount rewarded
                </th>
              </tr>
            </thead>      
            <tbody>
              <tr
                v-for="item in delegations"
                :key="item.op_address"
              >
                <td>{{ item.validatorName }}</td>
                <!--<td>{{ item.op_address }}</td>-->
                <td> {{ (item.delegated / 1000000).toFixed(6) }} {{ config[chainId].coinLookup.viewDenom }}</td>
                <td> {{ item.reward }} {{ config[chainId].coinLookup.viewDenom }}</td>
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!dislableSend"
            :loading="loading"
            color="darken-1"
            @click="validate"
          >
            Claim all
          </v-btn> 
        </v-card-actions>
      </v-card>
      
    </v-dialog>

</template>

<script>
import { mapState } from 'vuex'
import { notifWaiting, notifError, notifSuccess } from '~/libs/notifications'
import cosmosConfig from '~/cosmos.config'
import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  SigningStargateClient,
} from '@cosmjs/stargate'

  export default {
    props: ['chainIdProps', 'amountClaimAll', 'getAllDelegation'],
    data: (instance) => ({
      dialog: false,
      dialogStepper: false,
      e1: 1,
      eError: true,
      dislableSend: true,
      address: '',
      addressRules: [
        v => !!v || 'Address is required',
        // v => v.startsWith(instance.chainIdProps.toLowerCase()) || 'Address must start with "' + instance.chainIdProps.toLowerCase() + '"',
        // v => bech32Validation(v) || 'Bad address (not bech32)',
      ],
      amount: '',
      amountRules: [
        v => !!v || 'Amount is required',
        v => !isNaN(v) || 'Amount must be number',
      ],
      memo: '',
      loading: false,
      config: cosmosConfig 
    }),
    computed: {
      ...mapState('data', ['chainId', `balances`, 'delegations']),
    }, 
    methods: {
      validate () {    

      (async () => {
        this.$refs.form.validate()
        this.dialogStepper = true
        this.loading = true
        
        // Send notification
        var returnWaiting = notifWaiting(this.$toast)  
        
        const chainId = cosmosConfig[this.chainId].chainId;
        await window.keplr.enable(chainId);
        const offlineSigner = await window.getOfflineSignerAuto(chainId);
        const accounts = await offlineSigner.getAccounts();

        const client = await SigningStargateClient.connectWithSigner(
          cosmosConfig[this.chainId].rpcURL,
          offlineSigner
        )
        const convertAmount = this.amount * 1000000
        const amount = {
          denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
          amount: convertAmount.toString(),
        }
        const fee = {
          amount: [
            {
              denom: cosmosConfig[this.chainId].chainDenom,
              amount: '5000',
            },
          ],
          gas: '1000000',
        }

        const WithdrawDelegatorReward = defaultRegistryTypes[3][1] // MsgWithdrawDelegatorReward
        const foundMsgType = defaultRegistryTypes.find(element => element[0] === '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward');

        // console.log(WithdrawDelegatorReward)
        const copieDelegator = []
        this.getAllDelegation.forEach(function (item) {
          copieDelegator.push({
            typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
              delegatorAddress: accounts[0].address,
              validatorAddress: item.op_address,
            }),
          })
        })
        console.log(copieDelegator)
        try {          
          const result = await client.signAndBroadcast(accounts[0].address, copieDelegator, fee, '')
          assertIsDeliverTxSuccess(result)
          // this.dialog = false
          this.loading = false
          this.$toast.dismiss(returnWaiting);
          // Send notification   
          notifSuccess(this.$toast, result.transactionHash)            
          await this.$store.dispatch('data/refresh', accounts[0].address)        
        } catch (error) {
            console.error(error);
            this.eError = false
            this.$toast.dismiss(returnWaiting);
            notifError(this.$toast)
            this.loading = false
        }
        })();

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
</style>
