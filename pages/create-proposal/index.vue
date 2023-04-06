<template>
  <v-row align="center" justify="center" style="height:100vh" dense>
    <v-col cols="12" lg="6" md="6" class=" fill-height d-flex flex-column align-center">
      <v-alert
      v-if="isSend"
      dense
      text
      color="#00b786"
      type="success"
      width="600"
    >
      Your proposal has been created! <strong>Click here</strong> to see the proposal
    </v-alert>
      <v-card class="accent" max-width="600">
        <v-card-title>
          <span class="text-h5">Create text proposal (v1beta)</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
             <!--  <v-col cols="12" sm="12">
                <v-select :items="items" label="Proposal type" required></v-select>
              </v-col> -->
              <v-col cols="12" sm="12">
                <v-text-field
                  v-model="propTitle"
                  label="Proposal title" 
                  outlined
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12">
                <v-textarea
                  v-model="propText"
                  outlined
                  name="input-7-4"
                  label="Proposal text"
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="proposer" outlined label="Proposer" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="initDeposit" outlined label="Initial Deposit (ubcna)" required></v-text-field>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="#00b786" @click="createProposalv1Beta">
            Submit proposal
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

  </v-row>
</template>
<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { coins } from "@cosmjs/launchpad";
import { SigningStargateClient, AminoTypes, defaultRegistryTypes, GasPrice, assertIsDeliverTxSuccess } from "@cosmjs/stargate";
import { Registry } from "@cosmjs/proto-signing";
import { cosmos, cosmosProtoRegistry, cosmosAminoConverters } from 'interchain46';
import { Any } from "cosmjs-types/google/protobuf/any";
import { TextProposal } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import pkg from 'protobufjs';
const { Type, Field } = pkg;
import cosmosConfig from '~/cosmos.config'
import { notifWaiting, notifError, notifSuccess } from '~/libs/notifications'

export default {
  data: () => ({
    items: [
      'Text Proposal',
      //'Parameter Change Proposal',
      //'Software Upgrade Proposal',
      //'Cancel Software Upgrade Proposal',
      //'Community Pool Spend Proposal',
      //'Community Pool Spend Proposal With Deposit',
      //'Create Validator',
      //'CosmWasm',
    ],
    // New
    propText: '',
    propTitle: '',
    proposer: '',
    initDeposit: '4200000',
    isSend: false,
  }),
  computed: {
    ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
    ...mapState('data', ['chainId'])
  },
  watch: {

  },
  async mounted() {
    this.isSend = false
    this.proposer = this.accounts[0].address
  },
  methods: {
    async createProposalv1Beta() {

      const chainId = cosmosConfig[this.chainId].chainId;
      await window.keplr.enable(chainId);
      const offlineSigner = await window.getOfflineSignerAuto(chainId);

      const client = await SigningStargateClient.connectWithSigner(
        cosmosConfig[this.chainId].rpcURL,
        offlineSigner,
        { gasPrice: GasPrice.fromString(cosmosConfig[this.chainId].gasPrice + cosmosConfig[this.chainId].coinLookup.chainDenom) }
      )

      const foundMsgType = defaultRegistryTypes.find(element => element[0] === '/cosmos.gov.v1beta1.MsgSubmitProposal');
      const textProposal = TextProposal.fromPartial({
        title: this.propTitle,
        description: this.propText,
      });
      const initialDeposit = coins(this.initDeposit, "ubcna");

      const finalMsg = {

        typeUrl: foundMsgType[0],
        value: foundMsgType[1].fromPartial({
          content: Any.fromPartial({
            typeUrl: "/cosmos.gov.v1beta1.TextProposal",
            value: Uint8Array.from(TextProposal.encode(textProposal).finish()),
          }),
          proposer: this.accounts[0].address,
          initialDeposit: initialDeposit,
        })

      }
      console.log(finalMsg)

      try {
        const proposalResult = await client.signAndBroadcast(
          this.accounts[0].address,
          [finalMsg],
          'auto',
          "Test proposal from ui",
        );
        assertIsDeliverTxSuccess(proposalResult);
        console.log(proposalResult)
        this.isSend = true
      } catch (e) {
        console.error(e);
      }
    },
  }
}
</script>
<style></style>
