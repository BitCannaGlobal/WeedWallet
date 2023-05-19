<template>
  <v-row justify="space-around">
    <v-col cols="9">
      <v-row justify="space-around">
        <v-col>
          <v-card>
            <v-card-title class="headline">
              <v-icon class="mr-2">
                mdi-wallet-outline
              </v-icon> Transaction
              detail
            </v-card-title>
            <v-card-text class="text-right text-h5">
              test
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title class="headline">
              <v-icon class="mr-2">
                mdi-wallet-outline
              </v-icon> Wallet reward
            </v-card-title>
            <v-card-text class="text-right text-h5">
              test
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import { mapState } from "vuex";
import axios from "axios";

import { coins } from "@cosmjs/launchpad";
import { SigningStargateClient, AminoTypes } from "@cosmjs/stargate";
import { Registry, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
  cosmos,
  cosmosProtoRegistry,
  cosmosAminoConverters,
} from "interchain46";
import pkg from "protobufjs";
const { Type, Field } = pkg;
import cosmosConfig from "~/cosmos.config";

export default {
  data: () => ({
    cosmosConfig: cosmosConfig,
  }),
  computed: {
    ...mapState("keplr", [
      `accounts`,
      `initialized`,
      `error`,
      `logged`,
      `logout`,
    ]),
    ...mapState("data", [
      `myGroup`,
      "infoGroupId",
      "policyGroupId",
      "finalMsgProp",
    ]),
  },

  async mounted() {},
  methods: {},
};
</script>
<style></style>
