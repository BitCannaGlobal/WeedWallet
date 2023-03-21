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
          v-model="amount"
          label="Amount"
          :suffix="cosmosConfig[0].coinLookup.viewDenom"
          required
          outlined
        ></v-text-field>

        <v-textarea
          v-model="textProp"
          outlined
          name="input-7-4"
          label="Outlined textarea"
          value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
        ></v-textarea>

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
const {
  TextProposal
} = cosmos.gov.v1beta1;



  export default {
    props: ['from'],
    components: {
      VueJsonPretty,
    },
    data (props) {
      return {
        dialog: false,
        textProp: '',
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

      viewJson(newData, oldData) {
        const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;
        const msgSend = send(
            {
              fromAddress: this.textProp,
              toAddress: this.toAddress,
              amount:[{"denom": cosmosConfig[0].coinLookup.chainDenom,"amount": this.amount}]
            }
        )
        this.jsonData = msgSend
      },
    },
    async mounted () {
      // console.log(cosmos.gov.v1beta1)


    },
    methods: {
      async checkMsg() {
        console.log(TextProposal)


        const test = TextProposal.encode(TextProposal.fromPartial({
                  title: 'title test',
                  description: 'description test'
            })).finish()
        const final = {
          typeUrl: '/cosmos.gov.v1beta1.TextProposal',
          value: test
        }
        console.log(final)

        await this.$store.dispatch('data/formatFinalMsgProp', final)

      },
    }
  }
</script>
