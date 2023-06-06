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
            class="accent"
            :headers="headers"
            :items="finalValidators"
            :items-per-page="150"
            hide-default-footer
          >
            <template #top />
            <template #item.status="{ item }">
              <v-chip
                v-if="item.status === 'BOND_STATUS_BONDED'"
                class="ma-2"
                color="#00b786"
                outlined
                label
              >
                Active
              </v-chip>
              <v-chip
                v-else
                class="ma-2"
                color="red"
                outlined
                label
              >
                Inactive
              </v-chip>
            </template>
            <template #item.name="{ item }">
              <router-link
                :to="'/validators/' + item.op_address"
                class="linkFormat"
              >
                <v-icon class="mr-2">
                  mdi-shield-check
                </v-icon> {{ item.name }}
              </router-link>
            </template>
            <template #item.crate="{ item }">
              <span>{{item.crate}}%</span>
            </template>  
            <template #item.votingPower="{ item }">
              <span>{{item.votingPower}}%</span>
            </template>
                    
            <template #item.uptime="{ item }">
              <span>{{item.uptime}}%</span>
            </template>
          </v-data-table>
        </div>
      </div>
    </v-col>
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
      headers: [
        { text: "Status", value: "status" },
        { text: "Name", value: "name" },
        { text: "Commission rate", value: "crate" },
        { text: "Voting power", value: "votingPower" },
        { text: "Uptime", value: "uptime" },
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
    ...mapState("data", ["chainId", `balances`, "validators"]),
    ...mapState("keplr", [`logged`]),
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
    validate(addrValidator) {
      if (this.$refs.form.validate() === true) {
        (async () => {
          // Send notification
          const returnWaiting = notifWaiting(this.$toast);
          this.loading = true;

          const chainId = cosmosConfig[this.chainId].chainId;
          await window.keplr.enable(chainId);
          const offlineSigner = await window.getOfflineSignerAuto(chainId);
          const accounts = await offlineSigner.getAccounts();

          const client = await SigningStargateClient.connectWithSigner(
            cosmosConfig[this.chainId].rpcURL,
            offlineSigner
          );
          const convertAmount = this.amountToDelegate * 1000000;
          const amountFinal = {
            denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
            amount: convertAmount.toString(),
          };
          const fee = {
            amount: [
              {
                denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
                amount: "5000",
              },
            ],
            gas: "200000",
          };
          //var returnWaiting = notifWaiting(this.$toast);

          try {
            const result = await client.delegateTokens(
              accounts[0].address,
              addrValidator,
              amountFinal,
              fee,
              this.memo
            );
            assertIsBroadcastTxSuccess(result);
            // const result = await client.signAndBroadcast(accounts[0].address, [reDelegateMsg], fee, this.memo)
            // assertIsBroadcastTxSuccess(result)
            this.loading = false;
            this.$toast.dismiss(returnWaiting);
            // Send notification
            notifSuccess(this.$toast, result.transactionHash);
            await this.$store.dispatch("data/refresh", accounts[0].address);
          } catch (error) {
            console.error(error);
            //console.log(returnWaiting)
            this.$toast.dismiss(returnWaiting);
            notifError(this.$toast);
            this.loading = false;
          }
        })();
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
</style>
