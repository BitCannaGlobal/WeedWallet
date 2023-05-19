<template>
  <div class="d-inline">
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-icon class="mr-2">
            mdi-send-circle
          </v-icon> Vote for proposal
          {{ idProposal }}
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Vote for proposal {{ idProposal }}</span>
          <v-spacer />
          <v-icon
            class="mr-2"
            @click="dialog = false"
          >
            mdi-close-circle
          </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="dislableSend"
            lazy-validation
          >
            <v-item-group v-model="selected">
              <v-container>
                <v-container fluid>
                  <v-row dense>
                    <v-col
                      v-for="card in cardsVote"
                      :key="card.title"
                      class="mx-auto"
                      :cols="card.flex"
                    >
                      <v-item
                        v-slot="{ active, toggle }"
                        :value="card"
                      >
                        <v-card
                          :color="active ? 'green' : ''"
                          class="d-flex align-center"
                          @click="toggle()"
                        >
                          <v-btn icon>
                            <v-icon>mdi-vote-outline</v-icon>
                          </v-btn>
                          <v-card-title v-text="card.title" />
                        </v-card>
                      </v-item>
                    </v-col>
                  </v-row>
                </v-container>
              </v-container>
            </v-item-group>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="!dislableSend"
            :loading="loading"
            color="darken-1"
            @click="validate"
          >
            Send Vote
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
//import { decodeB32 } from '~/libs/address'
import { notifWaiting, notifError, notifSuccess } from "~/libs/notifications";
import cosmosConfig from "~/cosmos.config";
import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  SigningStargateClient,
} from "@cosmjs/stargate";

//   function bech32Validation(address) {
//     try {
//       decodeB32(address)
//       return true
//     } catch (error) {
//       return false
//     }
//   }
//   function prefixValidation(address) {
//     if (address && address.startsWith(this.network.addressPrefix)) {
//       return true
//     } else {
//       return false
//     }
//   }
export default {
  props: [
    "chainIdProps",
    "amountAvailable",
    "coinIcon",
    "idProposal",
    "cardsVote",
  ],
  data: (instance) => ({
    selected: [],
    dialog: false,
    dislableSend: true,
    address: "",
    addressRules: [
      (v) => !!v || "Address is required",
      //v => v.startsWith(instance.chainIdProps.toLowerCase()) || 'Address must start with "' + instance.chainIdProps.toLowerCase() + '"',
      //v => bech32Validation(v) || 'Bad address (not bech32)',
    ],
    amount: "",
    amountRules: [
      (v) => !!v || "Amount is required",
      //v => !isNaN(v) || 'Amount must be number',
      (v) =>
        v <= instance.amountAvailable ||
        "Amount equal or above available amount (" +
          instance.amountAvailable +
          ")",
    ],
    memo: "",
    loading: false,
    loadingInput: false,
    message: "Hey!",
    config: cosmosConfig,
  }),
  computed: {
    ...mapState("keplr", [`accounts`]),
    ...mapState("data", ["chainId", `balances`]),
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

    validate() {
      let finalVote;
      switch (this.selected.title) {
        case "Yes":
          finalVote = "1";
          break;
        case "Abstain":
          finalVote = "2";
          break;
        case "No":
          finalVote = "3";
          break;
        case "NoWithVeto":
          finalVote = "4";
          break;
        default:
          finalVote = "0";
      }
      console.log(finalVote);
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
          const fee = {
            amount: [
              {
                denom: cosmosConfig[this.chainId].chainDenom,
                amount: "5000",
              },
            ],
            gas: "200000",
          };
          const registryVote = defaultRegistryTypes[14][1];
          console.log(registryVote);
          const voteSend = [
            {
              typeUrl: "/cosmos.gov.v1beta1.MsgVote",
              value: registryVote.fromPartial({
                proposalId: this.idProposal,
                voter: accounts[0].address,
                option: finalVote,
              }),
            },
          ];
          console.log(voteSend);
          try {
            const result = await client.signAndBroadcast(
              accounts[0].address,
              voteSend,
              fee,
              ""
            );
            assertIsDeliverTxSuccess(result);
            this.dialog = false;
            this.loading = false;
            this.$toast.dismiss(returnWaiting);
            // Send notification
            notifSuccess(this.$toast, result.transactionHash);
            await this.$store.dispatch("data/refresh", accounts[0].address);
          } catch (error) {
            console.error(error);
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
