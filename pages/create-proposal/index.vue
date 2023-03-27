<template>

    <v-row justify="space-around">
    <v-col>
  <v-card>
    <v-tabs
      v-model="tab"
 
      centered
      dark
      icons-and-text
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        V1beta1
      </v-tab>

      <v-tab href="#tab-2">
        v1
      </v-tab>
 
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-1" >
        <v-card flat >
          <v-card-text>
          
          
 
      <v-card  class="accent justify-center" max-width="600">
        <v-card-title>
          <span class="text-h5">Create v1beta1 proposal</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="12"
              >
                <v-select
                  :items="items"
                  label="Proposal type"
                  required
                ></v-select>
              </v-col>            
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
                <v-text-field
                  label="Proposer"
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
                <v-text-field
                  label="initialDeposit" 
                ></v-text-field>
              </v-col>
 

 
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>  
 
      
      
      
      
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item value="tab-2">
        <v-card flat>
          <v-card-text>
      <v-col>
      <!--{{ infoGroupId }}-->

        <br />
        <v-row>
          <v-col cols="6">
            <v-card
            height="500"
            class="accent"
            >
              <v-card-title>
               Create proposal
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="12"
                    >
                      <v-text-field
                        v-model="title"
                        label="Title proposal"
                        required
                        outlined
                      ></v-text-field>
                    </v-col>

                    <!--<v-col cols="12">
                      <v-text-field
                        v-model="selectPolicy"
                        label="Policy address"
                        disabled
                        outlined
                      ></v-text-field>
                    </v-col>  v-model="accounts[0].address"-->
                    <v-col cols="12">
                      <v-text-field
                        v-model="accounts[0].address"
                        label="Proposers"
                        required
                        outlined
                        disabled
                      ></v-text-field>
                    </v-col>
                    <!--<v-col cols="12">
                      <v-text-field
                        label="Metadata"
                        required
                        outlined
                      ></v-text-field>
                    </v-col>-->
                    <v-col cols="12">
                      <!--<v-combobox
                        v-model="selectMsgType"
                        :items="items"
                        label="Select message"
                        multiple
                        chips
                        outlined
                        solo
                      ></v-combobox>-->
                      <v-select
                        v-model="selectMsgType"
                        :items="items"
                        label="Select"
                        multiple
                        chips
                        outlined
                        hint="Select type action of sdk"
                        persistent-hint
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>

              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
               <!-- <v-btn
                  color="blue darken-1"
                  text
                  @click="dialog = false"
                >
                  Close
                </v-btn>-->
                <v-btn
                  class="accent"
                  @click="createProposal"
                >
                  Create proposal
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card
              class="accent"
            >

              <v-card-title>
               Messages type


              </v-card-title>
              <v-card-text>
                <v-expansion-panels focusable>
                  <v-expansion-panel
                    v-for="(item,i) in selectMsgType"
                    :key="i"
                    class="accent"
                  >
                    <v-expansion-panel-header>{{ item }}</v-expansion-panel-header>
                    <v-expansion-panel-content v-if="item === 'Text Proposal'">
                      <messagesTypeTextProposal :from="selectPolicy" />
                    </v-expansion-panel-content>
                    <v-expansion-panel-content v-if="item === 'Delegate'">
                      <messagesTypeDelegateTx :from="selectPolicy" />
                    </v-expansion-panel-content>
                    <v-expansion-panel-content v-if="item === 'Create Validator'">
                      <messagesTypeCreateVal :from="selectPolicy" />
                    </v-expansion-panel-content>
                    <v-expansion-panel-content v-if="item === 'CosmWasm'">
                      <messagesTypeCosmwasmTx :from="selectPolicy" />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>



                <!--{{ selectMsgType }}-->
              </v-card-text>

            </v-card>
          </v-col>
        </v-row>


      </v-col>          
          </v-card-text>
        </v-card>
      </v-tab-item>      
    </v-tabs-items>
  </v-card>
  </v-col>

    </v-row>
</template>
<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { coins } from "@cosmjs/launchpad";
import { SigningStargateClient, AminoTypes } from "@cosmjs/stargate";
import { Registry, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { cosmos, cosmosProtoRegistry, cosmosAminoConverters } from 'interchain46';
import pkg from 'protobufjs';
const { Type, Field } = pkg;
import cosmosConfig from '~/cosmos.config'
import { notifWaiting, notifError, notifSuccess } from '~/libs/notifications'

export default {
  data: () => ({
    title: '',
    selectPolicy: '',
    selectMsgType: '',
    finalGroupData: '',
    allProps: [],
    allExec: [],
    allVotes: [],
    search: '',
    columnName:'id',
    isDescending:true,
    allPolicy: [],
    tab: null,
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

  }),
  computed: {
    ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
    ...mapState('data', [`myGroup`, 'infoGroupId', 'policyGroupId', 'finalMsgProp'])
  },
  watch: {
    // whenever question changes, this function will run
    selectPolicy(newQuestion, oldQuestion) {
      // console.log(newQuestion)
    }
  },
  async mounted () {

//     if (!this.logged) {
//       this.$router.push({path: "/login"})
//       return
//     }

const {
    deposit,
    submitProposal,
    vote,
    voteWeighted
} = cosmos.gov.v1.MessageComposer.fromPartial;

const registry = new Registry(cosmosProtoRegistry);

console.log(registry)

  },
  methods: {
      async createProposal() {

        var returnWaiting = notifWaiting(this.$toast)


        const registry = new Registry(cosmosProtoRegistry);
        const aminoTypes = new AminoTypes({ ...cosmosAminoConverters })

        const chainId = cosmosConfig[0].chainId;
        await window.keplr.enable(chainId);
        const offlineSigner = await window.getOfflineSignerAuto(chainId);
        const accounts = await offlineSigner.getAccounts();

        const client = await SigningStargateClient.connectWithSigner(
          cosmosConfig[0].rpcURL,
          offlineSigner,
          { registry: registry, aminoTypes: aminoTypes  }
        )

        const { submitProposal } = cosmos.gov.v1.MessageComposer.withTypeUrl;
        console.log(this.finalMsgProp)

        const msg = submitProposal({
            messages: this.finalMsgProp,
            initialDeposit: [],
            proposer: accounts[0].address,
            metadata: ''
        })
//         const fee = {
//           amount: coins(200, "udao"),
//           gas: "200000",
//         };
        const fee = {
          amount: coins(200, "utoken"),
          gas: "200000",
        };
           /* const fee = {
              amount: [
                {
                  denom: cosmosConfig[0].coinLookup.chainDenom,
                  amount: '5000',
                },
              ],
              gas: '200000',
            } */
        console.log(msg)

        try {
          const result = await client.signAndBroadcast(accounts[0].address, [msg], fee)
          console.log(result)

          //this.$toast.dismiss(returnWaiting);
          // Send notification
          // notifSuccess(this.$toast, result.transactionHash)
          // await this.$store.dispatch('data/getMyGroup', accounts[0].address)
        } catch (e) {
            console.error(e);
            this.$toast.dismiss(returnWaiting);
            notifError(this.$toast)
        }


      }

  }
}
</script>
<style>


</style>
