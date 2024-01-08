<template>
  <div>
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
              theme="dark"
              class="accent table allValidators" 
              :headers="headers"
              :items="finalValidators"
              :items-per-page="150"
              hide-default-footer
            >
              <template #top />
 
              <template #item.name="{ item }">
                <!--  <a 
                class="linkFormat box"
                @click="selectValidator(item)"
              > 
 
                <v-avatar class="ml-8">
                  <v-img
                    :src="'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/bitcanna/moniker/'+item.op_address+'.png'" 
                    :alt="item.name"
                  /> 
                </v-avatar>
                <span class="ml-8"><h3>{{ item.name }}</h3></span>                            
              </a>   
               -->
              
                <router-link
                  :to="'/validators/' + item.op_address"
                  class="linkFormat box"
                >
                  <v-chip
                    v-if="item.status === 3"
                    class="ma-2"
                    color="#00b786"
                    label
                    variant="flat"
                  >
                    Active
                  </v-chip>
                  <v-chip
                    v-else
                    class="ma-2"
                    color="red"
                    label
                    variant="flat"
                  >
                    Inactive
                  </v-chip> 
                  <v-avatar>
                    <v-img
                      :src="'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/bitcanna/moniker/'+item.op_address+'.png'" 
                      :alt="item.name" 
                    /> 
                  </v-avatar>
                  <span class="ml-8"><h3>{{ item.name }}</h3></span> 
                </router-link>
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
              <v-avatar>
                <v-img
                  :src="'https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/bitcanna/moniker/'+selectedValidator.op_address+'.png'" 
                  :alt="selectedValidator.validatorName" 
                /> 
              </v-avatar>
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
                          Commission rate
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
            <v-btn 
              class="mt-4"
              :to="`/validators/${selectedValidator.op_address}`"
              block
              x-large
            >
              View profile
            </v-btn>
          </v-card-text>

          <v-card-actions> 
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>     
    </v-row>
  </div>
</template>

<script>
import { useAppStore } from '@/stores/data'
import cosmosConfig from "~/cosmos.config";

export default {
  name: "Validators",
  props: ["getStatus"],
  setup() {
    const store = useAppStore()

    return {
      store
    }
  },
  data() {
    return {
      dialog: false,
      selectedValidator: "",
      myTotalUnDelegation: 0,
      headers: [
       /*  { text: "Status", value: "status" }, */
        { title: "Name", key: "name" },
        { title: "Commission rate", key: "crate" },
        { title: "Voting power", key: "votingPower" },
        { title: "validatorApr", key: "validatorApr" },
        { title: "", key: "actions" },
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
    /* ...mapState("data", [
      "chainId", 
      `balances`, 
      "validators", 
      "validatorDetails",
      "validatorDelegations",
      "validatorUnDelegations",
    ]),
    ...mapState("keplr", [`logged`, `accounts`]), */
  },  
  watch: {
    getStatus: function (val) {
      if (val === "active") {
        this.finalValidators = this.store.allValidators;
      } else {
        this.finalValidators = this.store.allValidatorsOffline;
      }
    },
  },
  async mounted() {
    //await this.$store.dispatch("keplr/checkLogin");
    //if (this.logged === "false") this.$router.push({ path: "login" });

    //await this.$store.dispatch("data/getAllValidators");
    if (this.getStatus === "active") {
 
      this.finalValidators = this.store.allValidators;
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
