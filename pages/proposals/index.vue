<!--==============================
=            PROJECTS            =
===============================-->

<template>

  <div>

    <!--{{ proposals }}-->

    <sequential-entrance fromBottom>
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

              <!--<v-row class="mt-n5 ">
                <v-col md="6">
                  <v-card class="pa-2 ml-3 transparent" flat  tile>
                    <v-avatar size="40" class="mr-n5">
                      <img src="../../assets/images/users/1.jpg" alt="John">
                    </v-avatar>
                    <v-avatar size="40" class="mr-n5">
                      <img src="../../assets/images/users/3.jpg" alt="John">
                    </v-avatar>
                    <v-avatar size="40" class="mr-n5">
                      <img src="../../assets/images/users/4.jpg" alt="John">
                    </v-avatar>
                    <v-avatar size="40" class="mr-n5">
                      <img src="../../assets/images/users/5.jpg" alt="John">
                    </v-avatar>

                    <v-avatar color="primary" dark class="mr-n5">
                      <v-icon dark>person_add_alt_1</v-icon>
                    </v-avatar>
                  </v-card>
                </v-col>

              </v-row>-->
              <v-chip-group v-model="selection" color="#00b786" class="ml-3" column>
                <v-chip v-for="msgType in item.messages" :key="item.id" label >{{ msgType.content?.title }}</v-chip>

              </v-chip-group>
            <!-- <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>
                  <v-progress-linear value="100" height="10" striped color="#00b786"></v-progress-linear>
                </v-list-item-title>
                <v-list-item-subtitle class="white--text" >
                100 % complet
                </v-list-item-subtitle>

              </v-list-item-content>
            </v-list-item> -->
            <v-card-actions class="pa-3">


              <!--{{ item.final_tally_result }}-->
            </v-card-actions>

          </v-card-text>
        </v-card>
      </v-col>




    </v-row>
</sequential-entrance>
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
        items: [{
          img: '12',
          title: 'AWS',
          color: 'error',
          status: 'pending',
          subtitle: 'Apple is Aliqua esse ipsum sint nulla Lorem',

        }, {
          img: '2',
          title: 'Arsona',
          color: 'success',
          status: 'complete',
          subtitle: 'AAliqua esse ipsum sint nulla',

        }, {
          img: '3',
          title: 'Web Site',
          color: 'success',
          status: 'complete',
          subtitle: ' proident elit eu officia. .',

        }, {
          img: '4',
          title: 'In',
          color: 'error',
          status: 'pending',
          subtitle: ' Culpa deserunt proident elit eu officia. .',

        }, {
          img: '5',
          title: 'Objective',
          color: 'error',
          status: 'pending',
          subtitle: ' Culpa deserunt proident elit eu officia. .',

        }, {
          img: '6',
          title: 'Quasae',
          color: 'error',
          status: 'pending',
          subtitle: 'Aliquip aliqua duis non sit. Culpa deserunt proident elit eu officia. .',

        },  ]
      }
    },
  async mounted () {
    //https://lcd-devnet-6.bitcanna.io/cosmos/gov/v1/proposals
    const allProposals = await axios(cosmosConfig[0].apiURL + `/cosmos/gov/v1/proposals`)
    console.log(allProposals)
    let setFinalPropos = this.proposals
    allProposals.data.proposals.forEach((item) => {
      setFinalPropos.push(item);
    });
  },

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

