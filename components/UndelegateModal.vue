<template>
  <div>
    <v-dialog
      v-if="selectedDelegation"
      v-model="dialog"
      max-width="500px"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          dark
          v-bind="attrs"
          color="orange"
          v-on="on"
        >
          <v-icon class="mr-2">
            mdi-download
          </v-icon>
          Undelegate {{ selectedDelegation }}
          {{ config[0].coinLookup.viewDenom }}
        </v-btn>
      </template>
      <v-card
        class="accent"
        min-height="300"
      >
        <v-card-title>
          <span class="text-h5">Send transaction</span>
          <v-spacer />
          <v-icon
            class="mr-2"
            @click="dialog = false"
          >
            mdi-close-circle
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-simple-table>
            <template #default>
              <tbody>
                <tr>
                  <td>Rewards</td>
                  <td>
                    {{ selectedDelegation }}
                    {{ config[0].coinLookup.viewDenom }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="!dislableSend"
            :loading="loading"
            color="#00b786"
            @click="validate"
          >
            Send Tx
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { notifWaiting, notifError, notifSuccess } from "~/libs/notifications";
import cosmosConfig from "~/cosmos.config";
import {
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  defaultRegistryTypes,
} from "@cosmjs/stargate";

export default {
  props: [
    "chainIdProps",
    "amountAvailable",
    "coinIcon",
    "selected",
    "finalAmount",
  ],
  data: (instance) => ({
    e1: 1,
    eError: true,
    dialog: false,
    dialogStepper: false,
    dislableSend: true,
    address: "",
    addressRules: [
      (v) => !!v || "Address is required",
      (v) =>
        v.startsWith(instance.chainIdProps.toLowerCase()) ||
        'Address must start with "' + instance.chainIdProps.toLowerCase() + '"',
      //v => bech32Validation(v) || 'Bad address (not bech32)',
    ],
    amount: "",
    amountRules: [
      (v) => !!v || "Amount is required",
      //v => !isNaN(v) || 'Amount must be number',
      //v => v <= instance.amountAvailable || 'Amount equal or above available amount (' + instance.amountAvailable + ')',
    ],
    memo: "",
    loading: false,
    loadingInput: false,
    message: "Hey!",
    config: cosmosConfig,
    selectedDelegation: 0,
    finalUndelegate: [],
  }),
  computed: {
    ...mapState("keplr", [
      `accounts`,
      `initialized`,
      `error`,
      `logged`,
      `logout`,
    ]),
    ...mapState("data", ["chainId", `balances`, "delegations"]),
  },
  watch: {
    // whenever question changes, this function will run
    selected(newSelected) {
      const delegation = this.delegations;
      let selectedDelegation = 0;
      const finalUndelegate = [];
      newSelected.forEach(async (item) => {
        const findDelegation = delegation.find(
          (element) => element.op_address === item
        );
        selectedDelegation += Number(findDelegation.share);
        finalUndelegate.push({
          valAddress: findDelegation.op_address,
          amount: findDelegation.share,
        });
      });
      this.finalUndelegate = finalUndelegate;
      this.selectedDelegation = selectedDelegation / 1000000;
    },
  },
  methods: {
    getMax() {
      this.amount = this.amountAvailable;
    },
    getHalf() {
      this.amount = this.amountAvailable / 2;
    },
    getQuarter() {
      this.amount = this.amountAvailable / 4;
    },
    test() {
      this.dialogStepper = true;
    },
    validate() {
      (async () => {
        this.dialogStepper = true;
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

        const MsgUndelegate = defaultRegistryTypes[20][1]; // MsgWithdrawDelegatorReward
        console.log(defaultRegistryTypes[20][1]);

        const myAccount = this.accounts[0].address;
        const copieUndelegate = [];
        this.finalUndelegate.forEach(function (item) {
          const amount = {
            denom: "ubcna",
            amount: Number(item.amount).toFixed(0),
          };

          copieUndelegate.push({
            typeUrl: defaultRegistryTypes[20][0],
            value: MsgUndelegate.fromPartial({
              delegatorAddress: myAccount,
              validatorAddress: item.valAddress,
              amount: amount,
            }),
          });
        });
        console.log(copieUndelegate);

        const fee = {
          amount: [
            {
              denom: cosmosConfig[this.chainId].chainDenom,
              amount: "5000",
            },
          ],
          gas: "200000",
        };

        try {
          const result = await client.signAndBroadcast(
            myAccount,
            copieUndelegate,
            fee,
            ""
          );
          this.e1 = 2;
          assertIsDeliverTxSuccess(result);

          // this.dialog = false
          this.loading = false;
          this.$toast.dismiss(returnWaiting);
          // Send notification
          notifSuccess(this.$toast, result.transactionHash);
          await this.$store.dispatch("data/refresh", accounts[0].address);
          this.e1 = 3;
        } catch (error) {
          console.error(error);
          this.eError = false;
          this.$toast.dismiss(returnWaiting);
          notifError(this.$toast);
          this.loading = false;
        }
      })();
    },
  },
};
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
