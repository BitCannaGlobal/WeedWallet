<!--==============================
=            PROJECTS            =
===============================-->

<template>

  <div>
    <v-card class="accent">
    <v-card-title>
      All proposals
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
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
      <span v-else>
      Bad title
      </span>        
    </template>       
    <template #item.status="{ item }">
        <td v-if="item.status === 'PROPOSAL_STATUS_PASSED'">              
                <v-chip
                  class="ma-2"
                  color="green"
                  text-color="white"
                  label
                >
                  <v-icon class="mr-1">mdi-checkbox-marked-circle</v-icon>
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
                  <v-icon class="mr-1">mdi-delete-forever</v-icon>
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
      </template>  
      <template #item.submit_time="{ item }">
        {{ item.submit_time | formatDate }}     
      </template>          
      <template #item.voting_start_time="{ item }">
        <td v-if="item.status !== 'PROPOSAL_STATUS_DEPOSIT_PERIOD'">{{ item.voting_start_time | formatDate }} </td>      
      </template>        
      <template #item.voting_end_time="{ item }">
        <td v-if="item.status !== 'PROPOSAL_STATUS_DEPOSIT_PERIOD'">{{ item.voting_end_time | formatDate }} </td>         
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
 
  </v-card>
    <!--{{ proposals }}-->

    <!-- <sequential-entrance fromBottom>
    <v-row>
      <v-col cols="12" md="4" sm="12" v-for="item in proposals.reverse()" :key="item.id">
          <v-card class="accent" :to="'proposals/'+item.id">
            <v-card-title class="headline">

            <v-list-item dark>
             <v-card class="ml-n2 mr-3 elevation-2 card-light   rounded-lg ">
             <img class="mt-2" src="icon/bcna.png">
             </v-card>
              <v-list-item-content>

                <v-list-item-title class="subtitle-1 font-weight-bold">
                  Proposal #{{item.id}}
                </v-list-item-title>
                <v-spacer></v-spacer>
                <v-list-item-subtitle v-if="item.status === 'PROPOSAL_STATUS_PASSED'">
                  <v-chip color="#00b786">Passed</v-chip>
                </v-list-item-subtitle>
                <v-list-item-subtitle v-if="item.status === 'PROPOSAL_STATUS_REJECTED'">
                  <v-chip color="red" >                  
                    <v-icon class="mr-1">mdi-delete-forever</v-icon>
                    Proposal Rejected
                  </v-chip>
                </v-list-item-subtitle>     
                <v-list-item-subtitle v-if="item.status === 'PROPOSAL_STATUS_VOTING_PERIOD'">
                  <v-chip color="primary" >                  
                    <v-icon class="mr-1">mdi-alarm-check</v-icon>
                    Voting Period
                  </v-chip>
                </v-list-item-subtitle>    
                <v-list-item-subtitle v-if="item.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD'">
                  <v-chip color="green" >                  
                    <v-icon class="mr-1">mdi-cash-fast</v-icon>
                    Deposit Period
                  </v-chip>
                </v-list-item-subtitle>                                             
              </v-list-item-content>


            </v-list-item>
          </v-card-title>
          <v-card-text class="text-right text-h5">
              <v-chip-group v-model="selection" color="#00b786" class="ml-3" column>
                <v-chip v-for="msgType in item.messages" :key="item.id" label >{{ msgType.content?.title }}</v-chip>
              </v-chip-group>
            <v-card-actions class="pa-3">
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>




    </v-row>
</sequential-entrance> -->
  </div>

</template>
<script>
import axios from 'axios'
import cosmosConfig from '~/cosmos.config'

  export default {

    data() {
      return {
        selection: 0,
        chip4: true,
        proposals: [],
        search: '',
        headers: [
          { text: 'Id', value: 'proposal_id' },
          {
            text: 'Title',
            align: 'start',
            sortable: false,
            value: 'content.title',
          },
          { text: 'Status', value: 'status' },
          
          { text: 'Submit time', value: 'submit_time' },
          { text: 'Start time', value: 'voting_start_time' },
          { text: 'End time', value: 'voting_end_time' }, 
        ],   
      }
    },
  async mounted () {
    //https://lcd-devnet-6.bitcanna.io/cosmos/gov/v1/proposals
    const allProposals = await axios(cosmosConfig[0].apiURL + `/cosmos/gov/v1beta1/proposals`)
    
    let setFinalPropos = []
    allProposals.data.proposals.forEach((item) => {
      setFinalPropos.push(item);
    });
    console.log(setFinalPropos)
    this.proposals =  setFinalPropos.reverse()
  },
  filters: {
      formatDate: (dateStr) =>
        Intl.DateTimeFormat("us-EN",
          {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false
          }).format(new Date(dateStr)),
    }     
  }
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

<!--====  End of PROJECTS  ====-->

