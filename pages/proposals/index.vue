<!-- eslint-disable -->
<template>
  <div>
 
    <h3 class="mb-2">Active proposals</h3>
    <v-row> 
        <v-col
        v-for="item in proposals"
          :key="item.voting_end_time"
          cols="6"
          md="6"
          v-if="item.status === 'PROPOSAL_STATUS_VOTING_PERIOD'"
          
        >
        <v-item>
            
            <v-card
              dark 
              class="accent"
              @click="setSelectProposal(item)"
            >
            <v-card-title>{{ item.content.title }}</v-card-title>
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
            <!--{{ item.status }}-->
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
            <!--{{ item.status }}-->
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
                <!-- <v-progress-linear
                  background-color="success"
                  color="error"
                  value="45"
                  height="10"
                ></v-progress-linear> -->
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
                    <div v-else>
                      No votes cast
                      </div>
 


            </v-card-text>
            </v-card>          
          </v-item>        
      </v-col>   
      </v-row> 
      <h3 class="mt-4 mb-2">Past proposals</h3>
    <sequential-entrance fromBottom>
      
      <v-row class="mb-4">        
        <v-col
          v-for="item in proposals"
          :key="item.voting_end_time"
          cols="6"
          md="6"
          v-if="item.status !== 'PROPOSAL_STATUS_VOTING_PERIOD'"
          
        >
 
        

          <v-item>
            
            <v-card
              dark 
              class="accent"
              @click="setSelectProposal(item)"
            >
            <v-card-title>{{ item.content.title }}</v-card-title>
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
            <!--{{ item.status }}-->
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
            <!--{{ item.status }}-->
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
                <!-- <v-progress-linear
                  background-color="success"
                  color="error"
                  value="45"
                  height="10"
                ></v-progress-linear> -->
 
 


            </v-card-text>
            </v-card>          
          </v-item>  

        </v-col>  
      </v-row> 

    </sequential-entrance>


<!--     <v-card class="accent">
      <v-card-title>
        All proposals
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        class="accent"
        :headers="headers"
        :items="proposals"
        :search="search"
      >
        <template #item.content.title="{ item }">
          <span v-if="item.content.title">
            <NuxtLink :to="'proposals/' + item.proposal_id">
              {{ item.content.title }}
            </NuxtLink>
          </span>
          <span v-else> Bad title </span>
        </template>
        <template #item.status="{ item }">
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
        </template>

        <template #item.submit_time="{ item }">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <span
                class="mt-n1"
                v-bind="attrs"
                v-on="on"
              >{{
                item.submit_time | timeFromNow
              }}</span>
            </template>
            <span>
              {{ formatDate(item.submit_time) }}
            </span>
          </v-tooltip>
        </template>
        <template #item.voting_start_time="{ item }">
          <td>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <span
                  class="mt-n1"
                  v-bind="attrs"
                  v-on="on"
                >{{
                  item.submit_time | timeFromNow
                }}</span>
              </template>
              <span>
                {{ formatDate(item.submit_time) }}
              </span>
            </v-tooltip>
          </td>
        </template>
        <template #item.voting_end_time="{ item }">
          <td v-if="item.status !== 'PROPOSAL_STATUS_DEPOSIT_PERIOD'">
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <span
                  class="mt-n1"
                  v-bind="attrs"
                  v-on="on"
                >{{
                  item.voting_end_time | timeFromNow
                }}</span>
              </template>
              <span>
                {{ formatDate(item.voting_end_time) }}
              </span>
            </v-tooltip>
          </td>
          <td v-else>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <span
                  class="mt-n1"
                  v-bind="attrs"
                  v-on="on"
                >{{
                  {
                    submit: item.submit_time,
                    secondes: paramsDeposit.max_deposit_seconde,
                  }
                    | formatDateDeposite
                    | timeFromNow
                }}
                </span>
              </template>
              <span>
                {{
                  {
                    submit: item.submit_time,
                    secondes: paramsDeposit.max_deposit_seconde,
                  }
                    | formatDateDeposite
                    | formatDate
                }}
              </span>
            </v-tooltip>
          </td>
        </template>
        <template #item.myvote="{ item }">
          <v-btn
            class="ma-2"
            disabled
          >
            View my vote (soon)
          </v-btn>
        </template>
      </v-data-table>
    </v-card> -->

<v-dialog
      v-model="dialog"
      max-width="600" 
    >
    
      <v-card color="#161819">
        <v-card-title class="text-h5">
          Proposal #{{selectedProposal.proposal_id}}
          <v-spacer />
          <v-icon
            class="mr-2"
            @click="dialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text class="mt-6">

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
                    <span v-if="selectedProposal.voting_start_time">{{ formatDate(selectedProposal?.voting_start_time) }}</span><br /><br />
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
                              selectedProposal.final_tally_result?.yes > 0 ||
                              selectedProposal.final_tally_result?.no > 0 ||
                              selectedProposal.final_tally_result?.abstain > 0 ||
                              selectedProposal.final_tally_result?.no_with_veto > 0
                            "
                          >
                            {{
                              (
                                (Number(selectedProposal.final_tally_result?.yes) * 100) /
                                (Number(selectedProposal.final_tally_result?.yes) +
                                  Number(selectedProposal.final_tally_result?.no) +
                                  Number(selectedProposal.final_tally_result?.abstain) +
                                  Number(selectedProposal.final_tally_result?.no_with_veto))
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
                              selectedProposal.final_tally_result?.yes > 0 ||
                              selectedProposal.final_tally_result?.no > 0 ||
                              selectedProposal.final_tally_result?.abstain > 0 ||
                              selectedProposal.final_tally_result?.no_with_veto > 0
                            "
                          >
                          {{
                              (
                                (Number(selectedProposal.final_tally_result?.no_with_veto) * 100) /
                                (Number(selectedProposal.final_tally_result?.yes) +
                                  Number(selectedProposal.final_tally_result?.no) +
                                  Number(selectedProposal.final_tally_result?.abstain) +
                                  Number(selectedProposal.final_tally_result?.no_with_veto))
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
                    <span v-if="selectedProposal.deposit_end_time">{{ formatDate(selectedProposal?.deposit_end_time) }}</span><br /><br /> 
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
                              selectedProposal.final_tally_result?.yes > 0 ||
                              selectedProposal.final_tally_result?.no > 0 ||
                              selectedProposal.final_tally_result?.abstain > 0 ||
                              selectedProposal.final_tally_result?.no_with_veto > 0
                            "
                          >
                          {{
                              (
                                (Number(selectedProposal.final_tally_result?.no) * 100) /
                                (Number(selectedProposal.final_tally_result?.yes) +
                                  Number(selectedProposal.final_tally_result?.no) +
                                  Number(selectedProposal.final_tally_result?.abstain) +
                                  Number(selectedProposal.final_tally_result?.no_with_veto))
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
                              selectedProposal.final_tally_result?.yes > 0 ||
                              selectedProposal.final_tally_result?.no > 0 ||
                              selectedProposal.final_tally_result?.abstain > 0 ||
                              selectedProposal.final_tally_result?.no_with_veto > 0
                            "
                          >{{
                              (
                                (Number(selectedProposal.final_tally_result?.abstain) * 100) /
                                (Number(selectedProposal.final_tally_result?.yes) +
                                  Number(selectedProposal.final_tally_result?.no) +
                                  Number(selectedProposal.final_tally_result?.abstain) +
                                  Number(selectedProposal.final_tally_result?.no_with_veto))
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
                    v-html="
                      $md.render(selectedProposal.content?.description)
                    "
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

          <h3 class="mt-4 ml-1 mb-2">
              Memo (Optional)
            </h3>
            <v-text-field
              v-model="memo"              
              background-color="#0F0F0F"
              required
              flat 
              solo
            /> 

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
                        {{ cosmosConfig[chainId].coinLookup.viewDenom }}
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


        <v-row v-if="step3">
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
          <v-row v-if="step4">
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
import { mapState } from "vuex";
import axios from "axios";
import moment from "moment";

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
    ...mapState("keplr", [`accounts`]),
    ...mapState("data", [
      "chainId",
      `balances`,
      "proposal",
      "proposalLoaded",
      "paramsDeposit",
      "paramsVoting",
      "totalBonded",
    ]),

  },
  watch: {
    dialog(value) {
      if (value) {
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.finalVote = '';
        this.finalVoteId = false;
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


    // List of proposal from the blockchain
    const allProposals = await axios(
      cosmosConfig[0].apiURL + `/cosmos/gov/v1beta1/proposals`
    );
 
    if ($nuxt.$route.hash) {
      const proposalId = $nuxt.$route.hash.replace("#", "");
      const foundProp = allProposals.data.proposals.find(
        (element) => element.proposal_id === proposalId
      );       
      this.dialog = true
      this.selectedProposal = foundProp   
      this.dataLoaded = true;
    }    

    const setFinalPropos = [];
    allProposals.data.proposals.forEach((item) => {
      setFinalPropos.push(item);
    });
    console.log(setFinalPropos);
    this.proposals = setFinalPropos.reverse();

    await this.$store.dispatch("data/getProposalParamsDeposit");
    await this.$store.dispatch("data/getProposalParamsVoting");
    
  },
  methods: {
    async validate(proposal) {
      if (this.$refs.form.validate() === true) {
        console.log(this.accounts)
        this.step1 = false;
        this.step2 = true;
        // Fee claculation
        const chainId = cosmosConfig[this.chainId].chainId;
        await window.keplr.enable(chainId);
        const offlineSigner = await window.getOfflineSignerAuto(chainId);
        const client = await SigningStargateClient.connectWithSigner(
          cosmosConfig[this.chainId].rpcURL,
          offlineSigner,
            {
              gasPrice: GasPrice.fromString(
                cosmosConfig[this.chainId].gasPrice +
                  cosmosConfig[this.chainId].coinLookup.chainDenom
              ),
            }          
        );

        const foundMsgType = defaultRegistryTypes.find(
          (element) => element[0] === "/cosmos.gov.v1beta1.MsgVote"
        );

        
     

        const finalMsg = {
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({           
            proposalId: proposal.proposal_id,
            voter: this.accounts[0].address,
            option: 1,
          }),
        };
        

        const gasEstimation = await client.simulate(
          this.accounts[0].address,
          [finalMsg],
          this.memo
        ); 
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.chainId].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.chainId].gasPrice +
              cosmosConfig[this.chainId].coinLookup.chainDenom
          )
        );
        console.log(usedFee)
        this.gasFee = { fee: usedFee.amount[0].amount, gas: usedFee.gas };
        /* 
        // Recalculate fee if amount is too high
        if (
          usedFee.amount[0].amount / 1000000 + Number(this.amount) >
          this.amountAvailable
        ) {
          this.amount = (
            Number(this.amount) -
            usedFee.amount[0].amount / 1000000
          ).toFixed(6);
          this.feeDeducted = true;
        } else {
          this.feeDeducted = false;
        }

        this.gasFee = { fee: usedFee.amount[0].amount, gas: usedFee.gas }; */
      }
    },
    async validatestep2(proposal) {
      console.log("vote!");
 

      const chainId = cosmosConfig[this.chainId].chainId;
      await window.keplr.enable(chainId);
      const offlineSigner = await window.getOfflineSignerAuto(chainId);
      const client = await SigningStargateClient.connectWithSigner(
        cosmosConfig[this.chainId].rpcURL,
        offlineSigner,
        {
          gasPrice: GasPrice.fromString(
            0.25 + cosmosConfig[this.chainId].coinLookup.chainDenom
          ),
        }
      );

      const foundMsgType = defaultRegistryTypes.find(
        (element) => element[0] === "/cosmos.gov.v1beta1.MsgVote"
      );

      const finalMsg = {
        typeUrl: foundMsgType[0],
        value: foundMsgType[1].fromPartial({
          proposalId: proposal.proposal_id,
          voter: this.accounts[0].address,
          option: this.finalVoteId,
        }),
      };

      console.log(finalMsg);
      try {
        this.step2 = false;
        this.step3 = true;
        const result = await client.signAndBroadcast(
          this.accounts[0].address,
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