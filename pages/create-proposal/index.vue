<template>
  <v-row align="center" justify="center"  dense>
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
          <span class="text-h5">Create BitCanna proposal (v1beta)</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
             <v-col cols="12" sm="12">
                <v-select v-model="propType" :items="items" label="Proposal type" required outlined></v-select>
              </v-col>
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
<!--     <div id="editor">
      <textarea :value="input" @input="update"></textarea>
      <div v-html="compiledMarkdown"></div>
    </div>      -->           
              </v-col>
              
              <v-col cols="12" sm="12" md="12">
                <v-text-field v-model="initDeposit" outlined label="Initial Deposit (ubcna)" required></v-text-field>
              </v-col>   

              <v-col v-if="propType === 'Community Pool Spend Proposal'" cols="12" sm="6" md="6">
                <v-text-field v-model="amountSpend" outlined label="Amount spend" required></v-text-field>
              </v-col>
              <v-col v-if="propType === 'Community Pool Spend Proposal'"  cols="12" sm="6" md="6">
                <v-text-field v-model="receivingAddress" outlined label="Receiving address" required></v-text-field>
              </v-col>              
              <!-- <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="proposer" outlined label="Proposer" required></v-text-field>
              </v-col> -->

              
              <v-col v-if="propType === 'Software Upgrade Proposal'" cols="12" sm="6" md="6">
                <v-text-field v-model="upgradeName" outlined label="Upgrade Name" required></v-text-field>
              </v-col>
              <v-col v-if="propType === 'Software Upgrade Proposal'"  cols="12" sm="6" md="6">
                <v-text-field v-model="upgradeHeight" outlined label="Upgrade Height" required></v-text-field>
              </v-col>
              <v-col v-if="propType === 'Software Upgrade Proposal'"  cols="12" sm="12" md="12">
                <v-text-field v-model="upgradeInfo" outlined label="Upgrade Info" required></v-text-field>
              </v-col>   
              
              
              <v-col v-if="propType === 'Parameter Change Proposal'" cols="12" sm="4" md="4">
                <v-text-field v-model="amountSpend" outlined label="Subspace" required></v-text-field>
              </v-col>
              <v-col v-if="propType === 'Parameter Change Proposal'"  cols="12" sm="4" md="4">
                <v-text-field v-model="receivingAddress" outlined label="Key" required></v-text-field>
              </v-col> 
              <v-col v-if="propType === 'Parameter Change Proposal'"  cols="12" sm="4" md="4">
                <v-text-field v-model="receivingAddress" outlined label="Value" required></v-text-field>
              </v-col>              



    

            </v-row>
            <span
              v-if="propType === 'Parameter Change Proposal'"
              v-for="(textField, i) in textFields"
              :key="i"  
            >
              <!-- <v-text-field
              :label="textField.label1"
              v-model="textField.value1"
              ></v-text-field>

              <v-text-field
              :label="textField.label2"
              v-model="textField.value2"
              ></v-text-field> -->
              <v-row>
                <v-col v-if="propType === 'Parameter Change Proposal'" cols="12" >
                  <v-btn @click="remove(i)" class="error">
                    <v-icon
                      large 
                    >
                    mdi-delete-forever-outline
                    </v-icon>                  
                  </v-btn>
                </v-col>                
                <v-col v-if="propType === 'Parameter Change Proposal'" cols="12" sm="4" md="4">
                    <v-text-field v-model="amountSpend" outlined label="Subspace" required></v-text-field>
                </v-col>
                <v-col v-if="propType === 'Parameter Change Proposal'"  cols="12" sm="4" md="4">
                  <v-text-field v-model="receivingAddress" outlined label="Key" required></v-text-field>
                </v-col> 
                <v-col v-if="propType === 'Parameter Change Proposal'"  cols="12" sm="4" md="4">
                  <v-text-field v-model="receivingAddress" outlined label="Value" required></v-text-field>
                </v-col>     
                
              </v-row>
            </span>            
            <v-btn v-if="propType === 'Parameter Change Proposal'" @click="add">add</v-btn>
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
import { CommunityPoolSpendProposal  } from "cosmjs-types/cosmos/distribution/v1beta1/distribution";
import { SoftwareUpgradeProposal, Plan } from "cosmjs-types/cosmos/upgrade/v1beta1/upgrade";
import Long from 'long';
// import { ParameterChangeProposal, ParamChange } from "cosmjs-types/cosmos/params/v1beta1/params";

import cosmosConfig from '~/cosmos.config'
import { notifWaiting, notifError, notifSuccess } from '~/libs/notifications'

export default {
  data: () => ({
    items: [
      'Text Proposal',
      'Community Pool Spend Proposal',
      //'Community Pool Spend Proposal With Deposit',
      'Software Upgrade Proposal',
      //'Parameter Change Proposal',
      
    ],
    // New
    propType: '',
    propText: '',
    propTitle: '',
    proposer: '',
    amountSpend: '',
    receivingAddress: '',
    initDeposit: '10000000',
    isSend: false,
    // Upgrade part
    upgradeName: '',
    upgradeHeight: '',
    upgradeInfo: '',
    textFields: []
  }),
  computed: {
    ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
    ...mapState('data', ['chainId'])
  },
  watch: {
    // whenever question changes, this function will run
    propType(newdata) {
      console.log(newdata)
    }
  },
  async mounted() {
    this.isSend = false
    this.proposer = this.accounts[0].address
  },
  methods: {
    add () {
        this.textFields.push({ 
          label1: "Subspace", 
          value1: "",
          label2: "key",
          value2: ""
        })
     },

     remove (index) {
         this.textFields.splice(index, 1)
     },

    async createProposalv1Beta() {

      console.log(CommunityPoolSpendProposal)


      const chainId = cosmosConfig[this.chainId].chainId;
      await window.keplr.enable(chainId);
      const offlineSigner = await window.getOfflineSignerAuto(chainId);

      const client = await SigningStargateClient.connectWithSigner(
        cosmosConfig[this.chainId].rpcURL,
        offlineSigner,
        { gasPrice: GasPrice.fromString(cosmosConfig[this.chainId].gasPrice + cosmosConfig[this.chainId].coinLookup.chainDenom) }
      )
      
      const foundMsgType = defaultRegistryTypes.find(element => element[0] === '/cosmos.gov.v1beta1.MsgSubmitProposal');
      const initialDeposit = coins(this.initDeposit, "ubcna");
      let finalMsg = {}

      if (this.propType === "Text Proposal") {
        const textProposal = TextProposal.fromPartial({
          title: this.propTitle,
          description: this.propText,
        });
        finalMsg = {
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
      }
      if (this.propType === "Community Pool Spend Proposal") {
        const communityPoolSpend = CommunityPoolSpendProposal.fromPartial({
          title: this.propTitle,
          description: this.propText,
          recipient: this.receivingAddress,
          amount: coins(this.amountSpend, "ubcna"),
        });
        finalMsg = {
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            content: Any.fromPartial({
              typeUrl: "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal",
              value: Uint8Array.from(CommunityPoolSpendProposal.encode(communityPoolSpend).finish()),
            }),
            proposer: this.accounts[0].address,
            initialDeposit: initialDeposit,
          })
        }
      }
      if (this.propType === "Software Upgrade Proposal") {

        const softwareUpgrade = SoftwareUpgradeProposal.fromPartial({
          title: this.propTitle,
          description: this.propText,
          // plan: Uint8Array.from(Plan.encode(softwarePlan).finish()),
          plan: {
            name: this.upgradeName,
            /* time: {
              nanos: 0,
              seconds: Long.fromValue(0)
            }, */
            height: Long.fromValue(this.upgradeHeight),
            info: this.upgradeInfo,
            upgradedClientState: undefined,
          },
        });

        finalMsg = {
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            content: Any.fromPartial({
              typeUrl: "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal",
              value: Uint8Array.from(SoftwareUpgradeProposal.encode(softwareUpgrade).finish()),
            }),
            proposer: this.accounts[0].address,
            initialDeposit: initialDeposit,
          })
        }
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
