<!-- eslint-disable -->
<template>
  <div class="ma-6">
      <h1>
        Proposals 
      </h1>
      <v-spacer /> 
      <v-divider class="mb-6" />
      <!-- {{ setFinalPropos }}
      {{ store.allProposals.proposals }}  --> 
   <h3 class="mb-8">Active proposals</h3> 
    <span v-if="proposalsActive.length === 0">No active proposals are on chain at this moment<br /><br /><br /></span>
      <v-row v-if="proposalsActive.length > 0"> 
        <v-col
          v-for="item in proposalsActive"
          :key="item.voting_end_time"
          cols="6"
          md="6"
                 
        >

        <div v-if="item.status === 'PROPOSAL_STATUS_VOTING_PERIOD'">   
     
            <v-card
              dark 
              class="accent"
              @click="setSelectProposal(item)"
            >
            <v-card-title>{{ item.title }}</v-card-title>
            <v-divider  />
            <v-card-text>
              <v-row>
                <v-col cols="6"> 
                  Voting period end<br />
                  {{ formatDate(item.voting_end_time) }}
                </v-col> 
                <v-col cols="6" align="right"> 

           <td v-if="item.status === 'PROPOSAL_STATUS_PASSED'">
            <v-chip
              class="ma-2"
              color="green"
              text-color="white"
              label
            >
              <v-icon class="mr-1">
                mdi-checkbox-marked-circle
              </v-icon>
              Proposal Passed
            </v-chip>
          </td>
          <td v-if="item.status === 'PROPOSAL_STATUS_REJECTED'">
            <v-chip
              class="ma-2"
              color="red"
              text-color="white"
              label
            >
              <v-icon class="mr-1">
                mdi-delete-forever
              </v-icon>
              Proposal Rejected
            </v-chip>
          </td>
          <td v-if="item.status === 'PROPOSAL_STATUS_VOTING_PERIOD'">
 
            <v-chip
              class="ma-2"
              text-color="white"
              color="blue"
              label
            >
              <v-icon class="mr-1">
                mdi-alarm-check
              </v-icon>
              Voting Period
            </v-chip>
          </td>
          <td v-if="item.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD'">
 
            <v-chip
              class="ma-2"
              text-color="white"
              label
            >
              <v-icon class="mr-1">
                mdi-cash-fast
              </v-icon>
              Deposit Period
            </v-chip>
          </td>                 
                </v-col>
              </v-row> 
              <br>
 
                <div v-if="
                          item.final_tally_result.yes > 0 ||
                          item.final_tally_result.no > 0 ||
                          item.final_tally_result.abstain > 0 ||
                          item.final_tally_result.no_with_veto > 0
                      ">
                <v-progress-linear
                    height="10"
                    background-color="error"
                    color="#00b786"
                    :value="
                      (
                        (Number(item.final_tally_result.yes) * 100) /
                        (Number(item.final_tally_result.yes) +
                          Number(item.final_tally_result.no) +
                          Number(item.final_tally_result.no_with_veto))
                      ).toFixed(2)
                    " 
                  />                      
                    </div>
 

            </v-card-text>
            </v-card>          
          </div>         
      </v-col> 
       
      </v-row> 


        <h3 class="mt-4 mb-2">All proposals</h3>
 


      <v-row class="mb-4">        
        <v-col
          v-for="item in proposals"
          :key="item.voting_end_time"
          cols="6"
          md="6"
          
          
        >
 
        <div >

            
            <v-card
              dark 
              class="accent"
              @click="setSelectProposal(item)"
            >
            <v-card-title>{{ item.title }}</v-card-title>
            <v-divider  />
            <v-card-text>
              <v-row>
                <v-col cols="6"> 
                  Voting period end<br />
                  {{ formatDate(item.voting_end_time) }}
                </v-col> 
                <v-col cols="6" align="right"> 
                  <td v-if="item.status === 'PROPOSAL_STATUS_PASSED'">
                    <v-chip
                      class="ma-2"
                      color="green"
                      text-color="white"
                      label
                    >
                      <v-icon class="mr-1">
                        mdi-checkbox-marked-circle
                      </v-icon>
                      Proposal Passed
                    </v-chip>
                  </td>
                  <td v-if="item.status === 'PROPOSAL_STATUS_REJECTED'">
                    <v-chip
                      class="ma-2"
                      color="red"
                      text-color="white"
                      label
                    >
                      <v-icon class="mr-1">
                        mdi-delete-forever
                      </v-icon>
                      Proposal Rejected
                    </v-chip>
                  </td>
                  <td v-if="item.status === 'PROPOSAL_STATUS_VOTING_PERIOD'">
        
                    <v-chip
                      class="ma-2"
                      text-color="white"
                      color="blue"
                      label
                    >
                      <v-icon class="mr-1">
                        mdi-alarm-check
                      </v-icon>
                      Voting Period
                    </v-chip>
                  </td>
                  <td v-if="item.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD'">
        
                    <v-chip
                      class="ma-2"
                      text-color="white"
                      label
                    >
                      <v-icon class="mr-1">
                        mdi-cash-fast
                      </v-icon>
                      Deposit Period
                    </v-chip>
                  </td>                 
                </v-col>
              </v-row> 
              <br>
 
 
 


            </v-card-text>
            </v-card>          

          </div>
        </v-col>  
      </v-row> 


  <v-dialog
      v-model="dialog"
      max-width="600" 
    >
    
      <v-card color="#161819">
 
        <v-toolbar
            color="rgba(0, 0, 0, 0)"
            theme="dark"
          >
            <template v-slot:prepend>
              <v-avatar>
                  <v-img
                    max-width="32"
                    max-height="32"
                    :src="cosmosConfig[store.chainSelected].coinLookup.icon"
                    alt="BitCanna"
                  ></v-img>
                </v-avatar>
            </template>
        <v-toolbar-title carmenBold>
            <span 
              class="carmenBold"
            >Proposal #{{selectedProposal.id}}</span> 
            </v-toolbar-title>

            <template v-slot:append>
              <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
            </template>
          </v-toolbar> 
        <v-card-text class="mt-6 carmenLight" >

          <v-form
            v-if="step1"
            ref="form"
            lazy-validation
          >
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
              <h4>{{ selectedProposal.content?.title }}</h4>
              <v-divider></v-divider>
              <v-row class="mt-2">
                  <v-col md="6">
                    Voting period start<br />
                    <span v-if="selectedProposal.voting_start_time">{{ formatDate(selectedProposal?.voting_start_time) }}</span>
                    <span v-else><v-chip color="green">At the end deposit period</v-chip></span><br /><br />
                    <v-sheet
                      class="mb-2"
                      outlined
                      color="gray"
                      rounded
                    >
                      <v-card
                        color="#1C1D20"
                        class="pa-2"
                        outlined
                        tile 
                      >
                      <v-row>
                      <v-col md="2">
                        <v-sheet
                          color="#00BF7D"
                          elevation="1"
                          height="50"
                          width="10"
                        ></v-sheet>
                      </v-col>
                        <v-col md="10">Yes<br />  
                          <span
                            v-if="
                              selectedProposal.final_tally_result?.yes_count > 0 ||
                              selectedProposal.final_tally_result?.no_count > 0 ||
                              selectedProposal.final_tally_result?.abstain_count > 0 ||
                              selectedProposal.final_tally_result?.no_with_veto_count > 0
                            "
                          >
                            {{
                              (
                                (Number(selectedProposal.final_tally_result?.yes_count) * 100) /
                                (Number(selectedProposal.final_tally_result?.yes_count) +
                                  Number(selectedProposal.final_tally_result?.no_count) +
                                  Number(selectedProposal.final_tally_result?.abstain_count) +
                                  Number(selectedProposal.final_tally_result?.no_with_veto_count))
                              ).toFixed(2)
                            }}
                            % 
                          </span>
                          <span v-else>0%</span>
                        </v-col>
                      </v-row>
                      </v-card>
                    </v-sheet>
                    <v-sheet
                      outlined
                      color="gray"
                      rounded
                    >
                      <v-card
                        color="#1C1D20"
                        class="pa-2"
                        outlined
                        tile 
                      >
                      <v-row>
                      <v-col md="2">
                        <v-sheet
                          color="#FFAA3E"
                          elevation="1"
                          height="50"
                          width="10"
                        ></v-sheet>
                      </v-col>
                        <v-col md="10">No with veto<br />
                          <span
                            v-if="
                              selectedProposal.final_tally_result?.yes_count > 0 ||
                              selectedProposal.final_tally_result?.no_count > 0 ||
                              selectedProposal.final_tally_result?.abstain_count > 0 ||
                              selectedProposal.final_tally_result?.no_with_veto_count > 0
                            "
                          >
                          {{
                              (
                                (Number(selectedProposal.final_tally_result?.no_with_veto_count) * 100) /
                                (Number(selectedProposal.final_tally_result?.yes_count) +
                                  Number(selectedProposal.final_tally_result?.no_count) +
                                  Number(selectedProposal.final_tally_result?.abstain_count) +
                                  Number(selectedProposal.final_tally_result?.no_with_veto_count))
                              ).toFixed(2)
                            }}
                            %  
                          </span>
                          <span
                            v-else  
                          >0%</span> 
                        </v-col>
                      </v-row>

                      </v-card>
                    </v-sheet>
                  </v-col>
                  <v-col md="6">
                    Voting period end<br />
                    <span v-if="selectedProposal.deposit_end_time"><v-chip color="green">{{ formatDate(selectedProposal?.deposit_end_time) }}</v-chip></span><br /><br /> 
                    <v-sheet
                      class="mb-2"
                      outlined
                      color="gray"
                      rounded
                    >
                      <v-card
                        color="#1C1D20"
                        class="pa-2"
                        outlined
                        tile 
                      >
                      <v-row>
                      <v-col md="2">
                        <v-sheet
                          color="#FF0000"
                          elevation="1"
                          height="50"
                          width="10"
                        ></v-sheet>
                      </v-col>
                        <v-col md="10">No<br />
                          <span
                            v-if="
                              selectedProposal.final_tally_result?.yes_count > 0 ||
                              selectedProposal.final_tally_result?.no_count > 0 ||
                              selectedProposal.final_tally_result?.abstain_count > 0 ||
                              selectedProposal.final_tally_result?.no_with_veto_count > 0
                            "
                          >
                          {{
                              (
                                (Number(selectedProposal.final_tally_result?.no_count) * 100) /
                                (Number(selectedProposal.final_tally_result?.yes_count) +
                                  Number(selectedProposal.final_tally_result?.no_count) +
                                  Number(selectedProposal.final_tally_result?.abstain_count) +
                                  Number(selectedProposal.final_tally_result?.no_with_veto_count))
                              ).toFixed(2)
                            }}
                            %  
                            </span>
                            <span
                              v-else  
                            >0%</span> 
                        </v-col>
                      </v-row>

                      </v-card>
                    </v-sheet>
                    <v-sheet
                      outlined
                      color="gray"
                      rounded
                    >
                      <v-card
                        color="#1C1D20"
                        class="pa-2"
                        outlined
                        tile 
                      >
                      <v-row>
                      <v-col md="2">
                        <v-sheet
                          color="#FFFFFF"
                          elevation="1"
                          height="50"
                          width="10"
                        ></v-sheet>
                      </v-col>
                        <v-col md="10">Abstain<br />
                          <span
                            v-if="
                              selectedProposal.final_tally_result?.yes_count > 0 ||
                              selectedProposal.final_tally_result?.no_count > 0 ||
                              selectedProposal.final_tally_result?.abstain_count > 0 ||
                              selectedProposal.final_tally_result?.no_with_veto_count > 0
                            "
                          >{{
                              (
                                (Number(selectedProposal.final_tally_result?.abstain_count) * 100) /
                                (Number(selectedProposal.final_tally_result?.yes_count) +
                                  Number(selectedProposal.final_tally_result?.no_count) +
                                  Number(selectedProposal.final_tally_result?.abstain_count) +
                                  Number(selectedProposal.final_tally_result?.no_with_veto_count))
                              ).toFixed(2)
                            }}
                            %   
                          </span>
                          <span
                            v-else
                          >0%</span>
                        </v-col>
                      </v-row>

                      </v-card>
                    </v-sheet>                    
                  </v-col>
                </v-row>
            </v-card>
          </v-sheet> 
          
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
            <div
            v-if="dataLoaded"
            v-html="$mdRenderer.render(selectedProposal.summary)"
 
                  /> 
            </v-card>
          </v-sheet> 
        </v-form> 
          <v-form
            v-if="step2"
            ref="form"
            lazy-validation
          >
          <v-sheet> 
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
              <h4>{{ selectedProposal.content?.title }}</h4>
              <v-divider class="pa-4"></v-divider>



              <v-item-group v-model="selected">
 
      <v-row>
        <v-col
          v-for="n in voteChoise"
          :key="n.title"
          cols="12"
          md="6"
        >
          <v-item v-slot="{ active, toggle }">
                     <v-sheet 
                      outlined
                      color="gray"
                      rounded
                    >
                      <v-card
                        :color="active ? 'primary' : ''" 
                        class="pa-2"
                        outlined
                        tile 
                        @click="toggle"
                      >
                      <v-row>
                      <v-col md="2">
                        <v-sheet
                          :color="n.color"
                          elevation="1"
                          height="30"
                          width="10"
                        ></v-sheet>
                      </v-col>
                        <v-col md="10"  
                          :class="active ? 'black--text text--lighten-1 mt-1' : 'white--text text--lighten-1 mt-1'" 
                        >{{ n.title }}</v-col>
                      </v-row>
                      </v-card>
                    </v-sheet>
          </v-item>
        </v-col>
      </v-row> 
  </v-item-group>

            </v-card>
          </v-sheet> 
          </v-sheet> 

          <h3 class="mt-4 ml-1 mb-2 carmenBold">
              Memo (Optional)
            </h3>
            <v-text-field
              v-model="memo"              
              required
              variant="solo"
              bg-color="#0F0F0F"
            /> 

            <v-sheet                       
            outlined
            color="gray"
            rounded
          > 
          <v-card
              color="#1C1D20"
              class="pa-2 carmenBold"
              outlined
              tile 
            >
                <v-list-item two-line >
                  <v-list-item-content>        
                    <v-list-item-subtitle class="mb-2">
                      <h3>Vote</h3>
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      <h3>{{  finalVote }}</h3>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>        
                    <v-list-item-subtitle class="mb-2">
                      <h3>Gas/fee</h3>
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      <h3>
                        {{ gasFee.gas }} / {{ gasFee.fee / 1000000 }}
                        {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}
                      </h3>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  v-if="memo !== ''"
                  two-line
                >
                  <v-list-item-content>        
                    <v-list-item-subtitle class="mb-2">
                      <h3>Memo</h3>
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      <h3>{{ memo }}</h3>
                    </v-list-item-title> 
                  </v-list-item-content>
                </v-list-item>
          </v-card>
          </v-sheet>
        </v-form> 


          <v-row
            v-if="step3"
            class="carmenBold"
          >
            <v-col
              cols="12"
              align="center"
              justify="center"
            >
              <v-img
                max-height="102"
                max-width="102"
                src="icons/pending.svg"
              ></v-img>
              <br />
              <h3>Transaction pending</h3> 
              <h4>Your transaction is waiting to get approved on the blockchain.</h4>
            </v-col>
          </v-row>
          <v-row v-if="step4"
            class="carmenBold"
            >
            <v-col
              cols="12"
              align="center"
              justify="center"
            >
              <v-img
                max-height="102"
                max-width="102"
                src="icons/approved.svg"
              ></v-img>
              <br />
              <h3>Transaction approved</h3> 
              <h4>Your transaction has been approved on the blockchain.</h4>
            </v-col>
          </v-row>
          
          
          <v-btn  
            v-if="selectedProposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD' && !step2 && !step3 && !step4"
            color="#00b786"
            block
            class="mt-4"
            x-large   
            @click="validate(selectedProposal)"         
          >
            Vote
            <v-icon
              right
            >
              mdi-arrow-right-thick
            </v-icon>            
          </v-btn> 
          <v-btn  
            v-if="step2"
            color="#00b786"
            block
            class="mt-4"
            x-large   
            @click="validatestep2(selectedProposal)" 
            :disabled="!finalVote"        
          >
            Vote
            <v-icon
              right
            >
              mdi-arrow-right-thick
            </v-icon>            
          </v-btn>           
        </v-card-text>

        <v-card-actions>

          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog> 
  </div>
</template>
<script>
/* eslint-disable */
import { useAppStore } from '@/stores/data'
import axios from "axios";
import moment from "moment";

import { selectSigner, calculFee } from "~/libs/signer";

import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  GasPrice,
  calculateFee,
} from "@cosmjs/stargate";
import cosmosConfig from "~/cosmos.config";

export default {
  data() {
    return {
      dialog: false,
      selectedProposal: '',
      dataLoaded: false,
      selection: 0,
      chip4: true,
      proposals: [],
      proposalsActive: [],
      search: "",
      memo: "",
      headers: [
        { text: "Id", value: "proposal_id" },
        {
          text: "Title",
          align: "start",
          sortable: false,
          value: "content.title",
        },
        { text: "Status", value: "status" },

        { text: "Submit time", value: "submit_time" },
        { text: "Start time", value: "voting_start_time" },
        { text: "End time", value: "voting_end_time" },
      ],
      step1: true,
      step2: false,
      step3: false,
      step4: false,
      feeDeducted: false,
      gasFee: {},
      selected: '',
      finalVote: '',
      finalVoteId: '',
      cosmosConfig: cosmosConfig,
      voteChoise: [
        { title: 'Yes', flex: 5, color: '#00BF7D' },
        { title: 'No', flex: 5, color: '#FF0000' },
        { title: 'NoWithVeto', flex: 5, color: '#FFAA3E' },
        { title: 'Abstain', flex: 5, color: '#FFFFFF' },
      ],  
    };
  },
  computed: {
    /* ...mapState("keplr", [`accounts`]),
    ...mapState("data", [
      "chainId",
      `balances`,
      "proposal",
      "proposalLoaded",
      "paramsDeposit",
      "paramsVoting",
      "totalBonded",
    ]), */

  },
  setup() {
    const store = useAppStore()
    return {
      store
    }
  },
  watch: {
    dialog(value) {
      if (value) {
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.finalVote = '';
        this.finalVoteId = '';
        this.selected = '';
      }
    },
    selected(value) {
      
      let finalVote = ''
      let finalVoteId = ''
      switch (value) {
          case 0:
            finalVote = 'Yes'
            finalVoteId = 1
            break
          case 1:
            finalVote = 'No'
            finalVoteId = 3
            break
          case 2:
            finalVote = 'No with veto'
            finalVoteId = 4
            break
          case 3:
            finalVote = 'Abstain'
            finalVoteId = 2
            break 
        } 
        this.finalVote = finalVote
        this.finalVoteId = finalVoteId
    },    
  },
  async mounted() {
  // List of proposals from the blockchain
  const allProposals = await axios(
    cosmosConfig[this.store.chainSelected].apiURL + `/cosmos/gov/v1/proposals`
  );

  const setFinalPropos = [];
  console.log(allProposals.data.proposals);

  allProposals.data.proposals.forEach((item) => {
    // Fix markdown syntax and handle new structure safely
    if (item.messages.length > 0) {
      // Check if "content" exists (prior to v0.50)
      const content = item.messages[0].content;

      // If "content" exist and it has a "title", assign it, if not use "item.title" (introduced in v0.47) 
      item.title = content && content.title ? content.title : item.title;

      // If "content" exist and it has a "description", fix the format, if not, use "item.summary" as value.
      if (content && content.description) {
        item.summary = content.description.replace(/\\n/g, "\n ");
        item.summary = item.summary.replace(/\\u0026/g, "&");
      } else {
        item.summary = item.summary ? item.summary.replace(/\\n/g, "\n") : "";
        item.summary = item.summary.replace(/\\u0026/g, "&");
      }

      console.log(item.summary);
    } else {
      // As default process "item.summary" to format it
      item.summary = item.summary.replace(/\\n/g, "\n");
      item.summary = item.summary.replace(/\\u0026/g, "&");
    }

    setFinalPropos.push(item);
  });

  const setFinalPropsActive = [];
  allProposals.data.proposals.forEach((item) => {
    if (item.status === "PROPOSAL_STATUS_VOTING_PERIOD")
      setFinalPropsActive.push(item);
  });
  this.proposalsActive = setFinalPropsActive.reverse();
  this.proposals = setFinalPropos.reverse();

  // await this.$store.dispatch("data/getProposalParamsDeposit");
  // await this.$store.dispatch("data/getProposalParamsVoting");
},

  methods: {
    async validate(proposal) {
      //if (this.$refs.form.validate() === true) {
        this.step1 = false;
        this.step2 = true;
        // Fee claculation
        let signer = await selectSigner(this.store.chainSelected, this.store.loggedType)
        const foundMsgType = defaultRegistryTypes.find(
          (element) => element[0] === "/cosmos.gov.v1.MsgVote"
        );

        
        console.log(proposal)

        const finalMsg = {
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({           
            proposalId: proposal.id,
            voter: signer.accounts[0].address,
            option: 1,
            metadata: "",
          }),
        };
        

        const gasEstimation = await signer.client.simulate(
          signer.accounts[0].address,
          [finalMsg],
          this.memo
        ); 
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.chainSelected].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.chainSelected].gasPrice +
              cosmosConfig[this.store.chainSelected].coinLookup.chainDenom
          )
        );
        this.gasFee = { fee: usedFee.amount[0].amount, gas: usedFee.gas };
 
      //}
    },
    async validatestep2(proposal) { 

      let signer = await selectSigner(this.store.chainSelected, this.store.loggedType)

      const foundMsgType = defaultRegistryTypes.find(
        (element) => element[0] === "/cosmos.gov.v1.MsgVote"
      );

      const finalMsg = {
        typeUrl: foundMsgType[0],
        value: foundMsgType[1].fromPartial({
          proposalId: proposal.id,
          voter: signer.accounts[0].address,
          option: this.finalVoteId,
          metadata: "",
        }),
      };
      try {
        this.step2 = false;
        this.step3 = true;
        const result = await signer.client.signAndBroadcast(
          signer.accounts[0].address,
          [finalMsg],
          "auto",
          this.memo
        );
        console.log(result);
        this.step3 = false;
        this.step4 = true;
      } catch (error) {
        this.step2 = true;
        this.step3 = false;
        console.error(error);
      } 
    },
    totalTally(data) {
      const totalTally =
        Number(data.yes) +
        Number(data.no) +
        Number(data.no_with_veto) +
        Number(data.abstain); 
      return totalTally;
    },
    async setSelectProposal(proposal) {
      this.dialog = true
      this.selectedProposal = proposal   
      this.dataLoaded = true;
    },
    formatDate(dateStr) {
      return Intl.DateTimeFormat("us-EN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      }).format(new Date(dateStr))
    }, 
  },
  filters: {
    formatDateDeposite(dateStr) {
      return moment(dateStr.submit).add(dateStr.secondes, "s");
    },
    timeFromNow: (dateStr) => moment(dateStr).fromNow(),
    timeToNow: (dateStr) => moment(dateStr).toNow(),
  },
};
</script>

<style scoped>
.card-light {
  border-radius: 1em;
  border: 1px solid rgba(255, 255, 255, 0.5);
  text-shadow: 0 0 1em rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.2);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  transform: perspective(500px);
  transform-style: preserve-3d;
}
</style>