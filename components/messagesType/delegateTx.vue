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
          v-model="selectPolicy"
          label="From address"
          required
          outlined
          disabled
        />

        <v-select
          v-model="valSelected"
          :items="allValSelect"
          label="To validator"
          required
          outlined
        />
        <!--<v-text-field
          label="To validator"
          required
          outlined
        ></v-text-field>-->
        <v-text-field
          v-model="amount"
          label="Amount"
          :suffix="cosmosConfig[0].coinLookup.viewDenom"
          required
          outlined
        />
        <v-btn
          elevation="2"
          @click="checkMsg"
        >
          Check message
        </v-btn>
        <span v-if="showValidateData">
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

export default {
  components: {
    VueJsonPretty,
  },
  props: {
    from: {
      type: String,
      required: true,
    },
  },
  data(props) {
    return {
      dialog: false,
      selectPolicy: props.from,
      valSelected: "",
      allValSelect: [],
      amount: "",
      viewJson: false,
      jsonData: "",
      validateData: false,
      showValidateData: false,
      cosmosConfig: cosmosConfig,
    };
  },
  computed: {
    ...mapState("data", [`allValidators`]),
  },  
  watch: {
    from(newData) {
      this.selectPolicy = newData;
    },
    viewJson() {
      const { delegate } = cosmos.staking.v1beta1.MessageComposer.withTypeUrl;

      const msgDelegate = delegate({
        delegatorAddress: this.selectPolicy,
        validatorAddress: this.valSelected,
        amount: [
          { denom: cosmosConfig[0].coinLookup.chainDenom, amount: this.amount },
        ],
      });
      console.log(msgDelegate);
      this.jsonData = msgDelegate;
    },
  },
  async mounted() {
    await this.$store.dispatch("data/getAllValidator");

    const allValSelect = this.allValSelect;
    this.allValidators.forEach(async (item) => {
      allValSelect.push({
        text: item.description.moniker,
        value: item.operator_address,
      });
    });
  },
  methods: {
    async checkMsg() {
      this.showValidateData = true;
      if (
        this.selectPolicy !== "" &&
        this.valSelected !== "" &&
        this.amount !== ""
      ) {
        this.validateData = true;
        console.log(cosmos.staking.v1beta1);
        const { delegate } = cosmos.staking.v1beta1.MessageComposer.withTypeUrl;
        const { MsgDelegate } = cosmos.staking.v1beta1;

        const convertAmount = Number(this.amount).toFixed(2) * 1000000;
        const amount = {
          denom: cosmosConfig[0].coinLookup.chainDenom,
          amount: convertAmount.toString(),
        };

        const msgDelegate = delegate(
          MsgDelegate.encode(
            MsgDelegate.fromPartial({
              delegatorAddress: this.selectPolicy,
              validatorAddress: this.valSelected,
              amount: amount,
            })
          ).finish()
        );

        console.log(amount);

        await this.$store.dispatch("data/formatFinalMsgProp", msgDelegate);
      } else this.validateData = false;
    },
  },
};
</script>
