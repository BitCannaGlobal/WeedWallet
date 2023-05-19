<template>
  <v-row>
    <v-btn class="ml-5" dark icon @click.stop="dialog = true">
      <v-icon color="darken-2"> mdi-vote-outline </v-icon>
    </v-btn>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">
          Vote proposal #{{ propId }}
        </v-card-title>

        <v-card-text>
          <v-item-group v-model="selected">
            <v-container>
              <v-row dense>
                <v-col
                  class="mx-auto"
                  v-for="card in cards"
                  :key="card.title"
                  :cols="card.flex"
                >
                  <v-item :value="card" v-slot="{ active, toggle }">
                    <v-card
                      :color="active ? 'primary' : ''"
                      class="d-flex align-center"
                      @click="toggle()"
                    >
                      <v-btn icon>
                        <v-icon>mdi-vote-outline</v-icon>
                      </v-btn>
                      <v-card-title v-text="card.title"></v-card-title>
                    </v-card>
                  </v-item>
                </v-col>
              </v-row>
            </v-container>
          </v-item-group>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn class="mb-5" dark @click="voteGroup"> Vote </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapState } from "vuex";
import axios from "axios";
import { coins } from "@cosmjs/launchpad";
import { SigningStargateClient } from "@cosmjs/stargate";
import { Registry, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import pkg from "protobufjs";
const { Type, Field } = pkg;
import cosmosConfig from "~/cosmos.config";

export default {
  props: ["addressAdmin", "propId"],
  data() {
    return {
      dialog: false,
      textFields: [],
      metadata: "",
      dislableSend: false,
      selected: [],
      cards: [
        {
          title: "Yes",
          src: "https://cdn.vuetifyjs.com/images/cards/house.jpg",
          flex: 5,
        },
        {
          title: "No",
          src: "https://cdn.vuetifyjs.com/images/cards/road.jpg",
          flex: 5,
        },
        {
          title: "NoWithVeto",
          src: "https://cdn.vuetifyjs.com/images/cards/plane.jpg",
          flex: 5,
        },
        {
          title: "Abstain",
          src: "https://cdn.vuetifyjs.com/images/cards/plane.jpg",
          flex: 5,
        },
      ],
    };
  },
  methods: {
    add() {
      this.textFields.push({
        label1: "Address",
        value1: "",
        label2: "weight",
        value2: "",
        label3: "Metadata",
        value3: "",
      });
    },

    remove(index) {
      this.textFields.splice(index, 1);
    },
    async voteGroup() {
      console.log(this.addressAdmin);
      console.log(this.metadata);
      console.log(this.textFields);

      const MsgVote = new Type("MsgVote")
        .add(new Field("proposal_id", 1, "uint64"))
        .add(new Field("voter", 2, "string"))
        .add(new Field("option", 3, "uint64"))
        .add(new Field("metadata", 4, "string"));

      const typeUrl = "/cosmos.group.v1.MsgVote";
      const registry = new Registry([[typeUrl, MsgVote]]);

      const chainId = cosmosConfig[0].chainId;
      await window.keplr.enable(chainId);
      const offlineSigner = await window.getOfflineSignerAuto(chainId);
      const accounts = await offlineSigner.getAccounts();

      const client = await SigningStargateClient.connectWithSigner(
        cosmosConfig[0].rpcURL,
        offlineSigner,
        { registry: registry }
      );
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
      const msg = {
        typeUrl,
        value: {
          proposal_id: this.propId,
          voter: accounts[0].address,
          option: finalVote,
          metadata: "First vote keplr",
        },
      };

      const fee = {
        amount: coins(200, "utoken"),
        gas: "200000",
      };
      console.log(msg);

      try {
        const result = await client.signAndBroadcast(
          accounts[0].address,
          [msg],
          fee
        );
        console.log(result);
        this.$nuxt.$emit("eventVote", true);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
