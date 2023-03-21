<template>
  <v-container>
    <v-row class="mt-4">
      <v-spacer></v-spacer>

      <v-switch
        v-model="viewJson"
        :label="viewJson ? 'View form' : 'View json'"
      ></v-switch>
      <v-col
        v-if="viewJson"
        cols="12"
        sm="12"
        md="12"
      >
        <vue-json-pretty :data="jsonData" show-line show-line-number show-length show-icon />
      </v-col>

      <v-col
        v-if="!viewJson"
        cols="12"
        sm="12"
        md="12"
      >

        <v-text-field
          v-model="selectPolicy"
          label="From address"
          required
          outlined
          disabled
        ></v-text-field>
        <v-text-field
          v-model="toAddress"
          label="To address"
          required
          outlined
        ></v-text-field>
        <v-text-field
          v-model="amount"
          label="Amount"
          :suffix="cosmosConfig[0].coinLookup.viewDenom"
          required
          outlined
        ></v-text-field>
        <v-btn
          elevation="2"
          @click="checkMsg"
        >Check message</v-btn>
        <span v-if="showValidateData">
        {{ finalMsgProp }}
          <v-icon
            v-if="validateData"
            color="teal"
          >
            mdi-check
          </v-icon>

          <v-icon
            v-else
            color="red"
          >
            mdi-alert-circle
          </v-icon>
        </span>
        </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { coins } from "@cosmjs/launchpad";
import { SigningStargateClient } from "@cosmjs/stargate";
import { Registry, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { cosmos, cosmosProtoRegistry, cosmosAminoConverters } from 'interchain46';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import pkg from 'protobufjs';
const { Type, Field } = pkg;
import cosmosConfig from '~/cosmos.config'
        const {
            MsgSend
        } = cosmos.bank.v1beta1;


  export default {
    props: ['from'],
    components: {
      VueJsonPretty,
    },
    data (props) {
      return {
        dialog: false,
        selectPolicy: props.from,
        toAddress: '',
        amount: '',
        viewJson: false,
        jsonData: '',
        validateData: false,
        showValidateData: false,
        cosmosConfig: cosmosConfig
      }
    },
    computed: {
      ...mapState('data', ['finalMsgProp'])
    },
    watch: {
      from(newData, oldData) {
        this.selectPolicy = newData
      },
      viewJson(newData, oldData) {
        const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;
        const msgSend = send(
            {
              fromAddress: this.selectPolicy,
              toAddress: this.toAddress,
              amount:[{"denom": cosmosConfig[0].coinLookup.chainDenom,"amount": this.amount}]
            }
        )
        this.jsonData = msgSend
      },
    },
    methods: {
      async checkMsg() {
        this.showValidateData = true
        if (this.selectPolicy !== '' && this.toAddress !== '' && this.amount !== '' ) {
          this.validateData = true

          const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;
          /*const msgSend = send(
              {
                fromAddress: this.selectPolicy,
                toAddress: this.toAddress,
                amount:[{"denom": "ubcna","amount": this.amount}]
              }
          )  */
          const convertAmount = Number(this.amount).toFixed(2) * 1000000
          const amount = {
            denom: cosmosConfig[0].coinLookup.chainDenom,
            amount: convertAmount.toString(),
          }
          const msgSend = send(
              MsgSend.encode(MsgSend.fromPartial({
                fromAddress: this.selectPolicy,
                toAddress: this.toAddress,
                amount:[amount]
              })).finish()
          )

          console.log(msgSend)

          await this.$store.dispatch('data/formatFinalMsgProp', msgSend)
        } else
          this.validateData = false

      },
    }
  }
</script>
