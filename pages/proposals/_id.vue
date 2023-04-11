<template>
  <v-row v-if="$fetchState.pending" justify="center" align="center"></v-row>
  <v-row v-else-if="$fetchState.error" justify="center" align="center"></v-row>
  <v-row v-else justify="center" align="center">
    <!-- If deposit period -->
    <v-col v-if="proposalData.proposal.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD'" cols="12" sm="8" md="10">
      <v-row>
            <v-col
              cols="12"
              md="8"
            >
              <v-card
                dark
 
              >
                <v-card-title>
                  #{{ proposalData.proposal.proposal_id }} {{ proposalData.proposal.content.title }}
                  <v-spacer></v-spacer>
                  {{ proposalData.proposal.deposit_end_time | formatDate }}
                </v-card-title>
                <v-card-text>
 
                  <div v-html="$md.render(proposalData.proposal.content.description)"></div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                dark
 
              >
                <v-card-title><span class="text-h5">Deposite detail</span></v-card-title>
                <v-card-text>      
                  <ChartsProposalDeposite  
                    :total_deposit="proposalData.proposal.total_deposit[0].amount" 
                    :min_deposit="configDeposite.deposit_params.min_deposit[0].amount" 
                  />   
                  <br /> 

                  <v-simple-table class="accent">

                    <tbody>
                      <tr>
                        <td>
                          <v-icon
                            color="#b3ffeb"
                            small
                          >
                            mdi-circle
                          </v-icon>                      
                          Minimum Deposit</td>
                        <td>{{ configDeposite.deposit_params.min_deposit[0].amount / 1000000 }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
                      </tr>
                      <tr>
                        <td>
                          <v-icon
                            color="#33ffc9"
                            small
                          >
                            mdi-circle
                          </v-icon>                            
                          Total Deposit</td>
                        <td>{{ proposalData.proposal.total_deposit[0].amount / 1000000 }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
                      </tr>
                      <tr>
                        <td>
                          <v-icon
                            color="#00b383"
                            small
                          >
                            mdi-circle
                          </v-icon>                          
                          Deposit Remaining</td>
                        <td>{{ (configDeposite.deposit_params.min_deposit[0].amount - proposalData.proposal.total_deposit[0].amount) / 1000000 }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
                      </tr>

                    </tbody>
                  </v-simple-table>                  
                </v-card-text>
              </v-card>
            </v-col>            
          </v-row>      

    </v-col>
    <v-col v-else cols="12" sm="8" md="10">
      <v-item-group>
        <v-container>
          <v-row>
            <v-col
              cols="12"
              md="12"
            >
              <v-card
                dark
                height="65"
              >
              <v-card-title>
                #{{ proposalData.proposal.proposal_id }} {{ proposalData.proposal.content.title }}   
                <v-spacer></v-spacer>
              <td v-if="proposalData.proposal.status === 'PROPOSAL_STATUS_PASSED'">              
                <v-chip
                  color="green"
                  text-color="white"
                  label
                >
                  <v-icon class="mr-1">mdi-checkbox-marked-circle</v-icon>
                  Proposal Passed 
                </v-chip>              
              </td>
              <td v-if="proposalData.proposal.status === 'PROPOSAL_STATUS_REJECTED'">
                <v-chip
                  color="red"
                  text-color="white"
                  label
                >
                  <v-icon class="mr-1">mdi-delete-forever</v-icon>
                  Proposal Rejected
                </v-chip>                  
              </td>
              <td v-if="proposalData.proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD'">
                <!--{{ item.status }}-->
                <v-chip
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
              <td v-if="proposalData.proposal.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD'">
                <!--{{ item.status }}-->
                <v-chip
                  text-color="white" 
                  label
                >
                  <v-icon class="mr-1">
                    mdi-cash-fast
                  </v-icon>
                  Deposit Period
                </v-chip>              
              </td>  
              </v-card-title>

              </v-card>
            </v-col>         
          </v-row>

          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                dark
                height="480"
              >
              <v-card-title>Proposal result</v-card-title>
              <v-card-text>

                <client-only>
                  <PolarArea 
                    :data="chartData" 
                  />
                </client-only>                
              </v-card-text>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              md="8"
            >
              <v-card
                dark
                height="480"
              >
                <v-card-title>
                  Proposal info
                  <v-spacer></v-spacer>
                  <v-chip   
                    v-if="proposalData.proposal.content['@type'] === '/cosmos.gov.v1beta1.TextProposal'"
                    color="#00b786"
                    outlined
                  >  
                  Text Proposal   
                  </v-chip> 
                  <v-chip   
                    v-if="proposalData.proposal.content['@type'] === '/cosmos.distribution.v1beta1.CommunityPoolSpendProposal'"
                    color="#00b786"
                    outlined
                  >  
                  Community Pool Spend Proposal
                  </v-chip>   
                  <v-chip   
                    v-if="proposalData.proposal.content['@type'] === '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal'"
                    color="#00b786"
                    outlined
                  >  
                  Software Upgrade Proposal  
                  </v-chip>                                                       
                </v-card-title>
                <v-card-text>
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr v-if="proposalData.proposal.total_deposit.length > 0">
                          <td>Total deposit</td>
                          <td>{{ proposalData.proposal?.total_deposit[0].amount / 1000000 }} {{ cosmosConfig[chainId].coinLookup.viewDenom }}</td>
                        </tr>
                        <tr>
                          <td>Deposit End Time</td>
                          <td>{{ proposalData.proposal.deposit_end_time | formatDate }}</td>
                        </tr>                          
                        <tr>
                          <td>Voting Start</td>
                          <td>{{ proposalData.proposal.voting_start_time | formatDate }}</td>
                        </tr>
                        <tr>
                          <td>Voting End</td>
                          <td>{{ proposalData.proposal.voting_end_time | formatDate }}</td>
                        </tr>                     
                      </tbody>
                    </template>
                  </v-simple-table>
                  <br /><br /><br /><br />
  <v-stepper >
    <v-stepper-header dark>
      <v-stepper-step
        v-if="proposalData.proposal.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD'"
        step="1"
        complete
        color="#00b786"
      >
        Created
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        step="2"
        complete
        color="#00b786"
      >
        Deposit Period Ends
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        step="3"
      >
        Voting Period Starts
        <small>Alert message</small>
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="4">
        Voting Period Ends
      </v-stepper-step>
    </v-stepper-header>
  </v-stepper>
                </v-card-text>
              </v-card>
            </v-col>            
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="8"
            >
              <v-card
                dark
                height="200"
              >
                <v-card-title>Voter</v-card-title>
                <v-card-text>Card content</v-card-text>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                dark
                height="200"
              >
                <v-card-title>Taly</v-card-title>
                <v-card-text>Card content</v-card-text>
              </v-card>
            </v-col>            
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="8"
            >
              <v-card
                dark
                height="200"
              >
                <v-card-title>Voter</v-card-title>
                <v-card-text>Card content</v-card-text>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-card
                dark
                height="200"
              >
                <v-card-title>Taly</v-card-title>
                <v-card-text>Card content</v-card-text>
              </v-card>
            </v-col>            
          </v-row>

        </v-container>
      </v-item-group>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
const { SigningCosmosClient } = require("@cosmjs/launchpad");
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import {
	assertIsBroadcastTxSuccess,
	SigningStargateClient,
  defaultRegistryTypes,
  GasPrice
} from '@cosmjs/stargate'
import cosmosConfig from '~/cosmos.config'

export default {
  name: 'Proposal',
  data: () => ({
      loadedProposal: false,
      id: '',
      initDeposit: 0,
      configDeposite: '',
      cosmosConfig: cosmosConfig,
      cards: [
        { title: 'Yes', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 5 },
        { title: 'No', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 5 },
        { title: 'NoWithVeto', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 5 },
        { title: 'Abstain', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 5 },
      ],
  }),
  computed: {
    ...mapState('keplr', [`accounts`]),
    ...mapState('data', ['chainId', `balances`, 'proposal', 'proposalLoaded']),
    chartData() {
      return {
        labels: ['Yes', 'No', 'No With Veto', 'Abstain'],
        datasets: [
          {
            label: '',
            data: [10, 2, 15, 7],
            backgroundColor: [
              '#33ffc9',
              '#00b383',
              '#00b383',
              '#004d38'
            ],
            //borderColor: '#00b786',
            borderWidth: 1,
            circular: false,
          },
        ],
      }
    },
  },
    methods: {
      async submitDeposit () {
        console.log('submitDeposit')
  
        console.log(this.$route.params.id)

          const chainId = cosmosConfig[this.chainId].chainId;
          await window.keplr.enable(chainId);
          const offlineSigner = await window.getOfflineSignerAuto(chainId);
          const client = await SigningStargateClient.connectWithSigner(
            cosmosConfig[this.chainId].rpcURL,
            offlineSigner,
            { gasPrice: GasPrice.fromString(0.25 + cosmosConfig[this.chainId].coinLookup.chainDenom) }
          )
             
          const foundMsgType = defaultRegistryTypes.find(element => element[0] === '/cosmos.gov.v1beta1.MsgDeposit');

          const convertAmount = (this.initDeposit * 1000000).toFixed(0)
          const amount = {
            denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
            amount: convertAmount.toString(),
          }

          const finalMsg = {
            typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
                proposalId: this.$route.params.id,
                depositor: this.accounts[0].address,
                amount: [amount],
            })
          }     

          console.log(finalMsg)
            try {

              const result = await client.signAndBroadcast(this.accounts[0].address, [finalMsg], 'auto', this.memo)
              assertIsBroadcastTxSuccess(result)
              console.log(result)
 
            } catch (error) {
              console.error(error)
 
            }          
      },
      validate () {
        if (this.$refs.form.validate() === true) {
          (async () => {
            // Send notification
            var returnWaiting = notifWaiting(this.$toast)
            this.loading = true

            const chainId = cosmosConfig[this.chainId].chainId;
            await window.keplr.enable(chainId);
            const offlineSigner = await window.getOfflineSignerAuto(chainId);
            const accounts = await offlineSigner.getAccounts();

            const client = await SigningStargateClient.connectWithSigner(
              cosmosConfig[this.chainId].rpcURL,
              offlineSigner
            )
            const convertAmount = this.amount * 1000000
            const amount = {
              denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
              amount: convertAmount.toString(),
            }
            const fee = {
              amount: [
                {
                  denom: cosmosConfig[this.chainId].chainDenom,
                  amount: '5000',
                },
              ],
              gas: '200000',
            }
            try {
              const result = await client.sendTokens(accounts[0].address, this.address, [amount], fee, this.memo)
              assertIsBroadcastTxSuccess(result)
              this.dialog = false
              this.loading = false
              this.$toast.dismiss(returnWaiting);
              // Send notification
              notifSuccess(this.$toast, result.transactionHash)
              await this.$store.dispatch('data/refresh', accounts[0].address)
            } catch (error) {
                console.error(error);
                this.$toast.dismiss(returnWaiting);
                notifError(this.$toast)
                this.loading = false
            }
          })();
        }
      },
    },
  async fetch() {
    this.proposalData = await fetch(
      cosmosConfig[this.chainId].apiURL + `/cosmos/gov/v1beta1/proposals/` + this.$route.params.id
    ).then(res => res.json())
    this.proposalDeposits = await fetch(
      cosmosConfig[this.chainId].apiURL + '/cosmos/gov/v1beta1/proposals/' + this.$route.params.id + '/deposits'
    ).then(res => res.json())    
    
    console.log(this.proposalData)
  },
  async mounted () {
    //await this.$store.dispatch('data/getSingleProposal', this.$route.params.id)
    //await this.$store.dispatch('keplr/checkLogin')
    //console.log(this.$route.params.id)
    this.id = this.$route.params.id

    this.configDeposite = await fetch(
      cosmosConfig[this.chainId].apiURL + `/cosmos/gov/v1beta1/params/deposit`
    ).then(res => res.json())
    console.log(this.configDeposite)   
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

