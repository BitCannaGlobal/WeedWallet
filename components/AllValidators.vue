<template>
  <v-row
    justify="center"
    align="center"
  >
    <v-col
      cols="12"
      sm="12"
      md="12"
    >
      <div class="row">
        <div class="col-sm">
          <v-data-table
            class="accent allValidators" 
            :headers="headers"
            :items="finalValidators"
            :items-per-page="150"
            hide-default-footer
          >
            <template #top />
 
            <template #item.name="{ item }">
              <a 
                class="linkFormat box"
                @click="selectValidator(item)"
              > 
                <v-chip
                  v-if="item.status === 'BOND_STATUS_BONDED'"
                  class="ma-2"
                  color="#00b786"
                  label
                >
                  Active
                </v-chip>
                <v-chip
                  v-else
                  class="ma-2"
                  color="red"
                  label
                >
                  Inactive
                </v-chip>  
                <img
                  src="BCNA-LOGO-C.svg"
                  alt="BitCanna"
                  height="40"
                  width="40"
                  class="ml-8"
                > 
                <span class="ml-8"><h3>{{ item.name }}</h3></span>                            
              </a>              
            </template>
            <template #item.crate="{ item }">
              <h3>{{ item.crate }}%</h3>
            </template>  
            <template #item.votingPower="{ item }">
              <h3><span>{{ item.votingPower }}%</span></h3>
            </template>
                    
            <template #item.validatorApr="{ item }">
              <h3><span>{{ item.validatorApr }}%</span></h3>
            </template>
          </v-data-table>
        </div>
      </div>
    </v-col>
    <v-dialog
      v-model="dialog"
      max-width="600" 
    >
      <v-card color="#161819">
        <v-card-title class="text-h5">
          Delegate
        </v-card-title>

        <v-card-text class="mt-6">
          <div 
            class="fill-height d-flex"
          >
            <img
              src="BCNA-LOGO-C.svg"
              alt="BitCanna"
              height="40"
              width="40"
            > 
            <span class="text-h6 mt-2 ml-8">{{ selectedValidator.name }}</span>
          </div> 


          <v-sheet
            outlined
            color="gray"
            rounded
            class="mt-4"
          >
            <v-card
              color="#1C1D20"
              class="pa-2"
              outlined
              tile 
            >
              <v-row>
                <v-col md="6">
                  <v-list-item two-line>
                    <v-list-item-content>        
                      <v-list-item-subtitle class="mb-2 subtitle-1">
                        Commition rate
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 subtitle-2">
                        {{ selectedValidator.crate }}%
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
                <v-col md="6">
                  <v-list-item two-line>
                    <v-list-item-content>        
                      <v-list-item-subtitle class="mb-2 subtitle-1">
                        Voting Power
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6">
                        {{ selectedValidator.votingPower }}%
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-card>
          </v-sheet>  

          <DelegateModal
            v-if="logged"
            :chain-id-props="cosmosConfig[chainId].coinLookup.addressPrefix"
            :address-to="selectedValidator.op_address"
            :validator-name="validatorDetails.description?.moniker" 
          />
        </v-card-text>

        <v-card-actions> 
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>     
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import {
  assertIsBroadcastTxSuccess,
  SigningStargateClient,
} from "@cosmjs/stargate";
import cosmosConfig from "~/cosmos.config";
import { notifWaiting, notifError, notifSuccess } from "~/libs/notifications";

export default {
  name: "Validators",
  props: ["getStatus"],
  data() {
    return {
      dialog: false,
      selectedValidator: "",
      myTotalUnDelegation: 0,
      headers: [
       /*  { text: "Status", value: "status" }, */
        { text: "Name", value: "name" },
        { text: "Commission rate", value: "crate" },
        { text: "Voting power", value: "votingPower" },
        { text: "validatorApr", value: "validatorApr" },
        { text: "", value: "actions" },
      ],
      finalValidators: [],
      valid: false,
      addressToDelegate: "",
      amountToDelegate: "0",
      amountRules: [
        (v) => !!v || "Amount is required",
        // v => Number.isInteger(v) || 'Name must be integer',
      ],
      loading: false,
      memo: "",
      dislableSend: true,
      cosmosConfig: cosmosConfig,
    };
  },
  computed: {
    ...mapState("data", [
      "chainId", 
      `balances`, 
      "validators", 
      "validatorDetails",
      "validatorDelegations",
      "validatorUnDelegations",
    ]),
    ...mapState("keplr", [`logged`, `accounts`]),
  },  
  watch: {
    getStatus: function (val) {
      if (val === "active") {
        const result = this.validators.filter(
          (val) => val.status === "BOND_STATUS_BONDED"
        );
        this.finalValidators = result;
      } else {
        this.finalValidators = this.validators;
      }
    },
  },
  async mounted() {
    // console.log(this.validators)
    await this.$store.dispatch("keplr/checkLogin");
    if (this.logged === "false") this.$router.push({ path: "login" });

    await this.$store.dispatch("data/getAllValidators");
    if (this.getStatus === "active") {
      const result = this.validators.filter(
        (val) => val.status === "BOND_STATUS_BONDED"
      );
      this.finalValidators = result;
    }
  },
  methods: {
    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLowerCase().indexOf(search) !== -1
      );
    },
    async selectValidator(validator) {
      this.dialog = true
      this.selectedValidator = validator;
      console.log(validator);
      await this.$store.dispatch("data/getValidatorDetails", validator.op_address);

      if (this.logged) {
        await this.$store.dispatch("data/getValidatorDelegation", {
          validatorAddr: validator.op_address,
          delegatorAddr: this.accounts[0].address,
        });
        await this.$store.dispatch("data/getValidatorUnDelegations", {
          validatorAddr: validator.op_address,
          delegatorAddr: this.accounts[0].address,
        });  
      }
    },
  },
};
</script>
<style>
.linkFormat {
  color: #e5e9ec !important;
  caret-color: #f4f4f4 !important;
  text-decoration: none;
}
.allValidators tr {
  height: 90px !important;
}
</style>
