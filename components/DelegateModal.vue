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
      <v-card>
        <v-card-title>
          <span class="text-h5">Delegate to {{ validatorName }}</span>
        </v-card-title>
        <v-card-text>
        <v-form
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
                <v-text-field
                  v-model="addressVal"
                  label="Validator address*"
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
          </v-container>
          <small>*indicates required field</small>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="darken-1"
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            :disabled="!dislableSend"
            :loading="loading"
            color="darken-1"
            @click="validate"
          >
            Send Tx
          </v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>

</template>

<script>
import { mapState } from 'vuex'
import { bech32 } from 'bech32'
import { notifWaiting, notifError, notifSuccess } from '~/libs/notifications'
import cosmosConfig from '~/cosmos.config'
import {
  defaultRegistryTypes,
	assertIsDeliverTxSuccess,
	SigningStargateClient,
	GasPrice
} from '@cosmjs/stargate'

  function bech32Validation(address) {
    try {
      const words = bech32.decode(address)
      // Buffer.from(bech32.fromWords(words.words)).toString(`hex`)
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
  export default {
    props: ['chainIdProps', 'addressTo', 'validatorName', 'balances', 'chainName'],
    data: (instance) => ({
      dialog: false,
      dislableSend: true,
      address: instance.addressFrom,
      addressVal: instance.addressTo,
      addressRules: [
        v => !!v || 'Address is required',
        v => v.startsWith(instance.chainIdProps.toLowerCase() + 'valoper') || 'Address must start with "' + instance.chainIdProps.toLowerCase() + 'valoper"',
        // v => bech32Validation(v) || 'Bad address (not bech32) ' + bech32Validation(v),
      ],
      amount: (instance.balances / 1000000),
      amountFinal: (instance.balances / 1000000),
      amountRules: [
        v => !!v || 'Amount is required',
        v => !isNaN(v) || 'Amount must be number',
        v => v <= (instance.balances / 1000000) || 'Amount must be above delegated amount (' + (instance.balances / 1000000) + ')',
      ],
      amountToDelegate: '',
      memo: '',
      loading: false,
      config: cosmosConfig
    }),
    computed: {
      ...mapState('data', ['chainId']),
    },
    methods: {
      getMax () {
        this.amountFinal = this.amount
      },
      getHalf () {
        this.amountFinal = this.amount / 2
      },
      getQuarter () {
        this.amountFinal = this.amount / 4
      },
      validate () {
        if (this.$refs.form.validate() === true) {
          (async () => {
            // Send notification
            var returnWaiting = notifWaiting(this.$toast)
            this.loading = true

            const chainId = cosmosConfig[this.chainId].chainId;
            await window.keplr.enable(chainId);
            const offlineSigner = await window.getOfflineSignerAuto(chainId);
            const accounts = await offlineSigner.getAccounts();

            const client = await SigningStargateClient.connectWithSigner(
              cosmosConfig[this.chainId].rpcURL,
              offlineSigner,
              { gasPrice: GasPrice.fromString('0.001' + cosmosConfig[this.chainId].coinLookup.chainDenom) }
            )
            const convertAmount = Number(this.amountFinal).toFixed(0) * 1000000
            const amountFinal = {
              denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
              amount: convertAmount.toString(),
            }

            try {
              const result = await client.delegateTokens(accounts[0].address, this.addressVal, amountFinal, 'auto', this.memo)
              assertIsDeliverTxSuccess(result)
              // const result = await client.signAndBroadcast(accounts[0].address, [reDelegateMsg], fee, this.memo)
              // assertIsBroadcastTxSuccess(result)
              this.dialog = false
              this.loading = false
              this.$toast.dismiss(returnWaiting);
              // Send notification
              notifSuccess(this.$toast, result.transactionHash)
              await this.$store.dispatch('data/refresh', accounts[0].address)
             } catch (error) {
                console.error(error);
                this.$toast.dismiss(returnWaiting);
                notifError(this.$toast)
                this.loading = false
            }
          })();
        }
      },
    },
  }
</script>

