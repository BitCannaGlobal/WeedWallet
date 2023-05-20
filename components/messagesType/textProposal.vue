<template>
  <v-container>
    <v-row class="mt-4">
      <v-spacer />

      <v-switch
        v-model="viewJson"
        :label="viewJson ? 'View form' : 'View json'"
      />
      <v-col
        v-if="viewJson"
        cols="12"
        sm="12"
        md="12"
      >
        <vue-json-pretty
          :data="jsonData"
          show-line
          show-line-number
          show-length
          show-icon
        />
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
        />

        <v-textarea
          v-model="textProp"
          outlined
          name="input-7-4"
          label="Outlined textarea"
          value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
        />

        <v-btn
          elevation="2"
          @click="checkMsg"
        >
          Check message
        </v-btn>
        <span v-if="showValidateData">
          {{ finalMsgProp }}
          <v-icon
            v-if="validateData"
            color="teal"
          > mdi-check </v-icon>

          <v-icon
            v-else
            color="red"
          > mdi-alert-circle </v-icon>
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import {
  cosmos
} from "interchain46";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import cosmosConfig from "~/cosmos.config";
const { MsgSend } = cosmos.bank.v1beta1;

export default {
  components: {
    VueJsonPretty,
  },
  props: {
    // Without options, just type reference
    from: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      textProp: "",
      viewJson: false,
      jsonData: "",
      validateData: false,
      showValidateData: false,
      cosmosConfig: cosmosConfig,
    };
  },
  computed: {
    ...mapState("data", ["finalMsgProp"]),
  },
  watch: {
    viewJson() {
      const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;
      const msgSend = send({
        fromAddress: this.textProp,
        toAddress: this.toAddress,
        amount: [
          { denom: cosmosConfig[0].coinLookup.chainDenom, amount: this.amount },
        ],
      });
      this.jsonData = msgSend;
    },
  },
  async mounted() {
    // console.log(cosmos.gov.v1beta1)
    // console.log(cosmos.gov)
  },
  methods: {
    async checkMsg() {
      // const { send } = cosmos.gov.v1beta1.MessageComposer.withTypeUrl;

      const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;
      /*const msgSend = send(
              {
                fromAddress: this.selectPolicy,
                toAddress: this.toAddress,
                amount:[{"denom": "ubcna","amount": this.amount}]
              }
          )  */
      const convertAmount = Number(1).toFixed(2) * 1000000;
      const amount = {
        denom: this.cosmosConfig[0].coinLookup.chainDenom,
        amount: convertAmount.toString(),
      };
      const msgSend = send(
        MsgSend.encode(
          MsgSend.fromPartial({
            fromAddress: "bcna1sw8xa00s68szlyvgp8l2fzqj95w5gjm5auc3le",
            toAddress: "bcna1sw8xa00s68szlyvgp8l2fzqj95w5gjm5auc3le",
            amount: [amount],
          })
        ).finish()
      );

      console.log(msgSend);

      // console.log(final)

      await this.$store.dispatch("data/formatFinalMsgProp", msgSend);
    },
  },
};
</script>
