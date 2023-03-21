<template>
  <p v-if="$fetchState.pending">
  <v-row justify="center" align="center">

    <v-col cols="12" sm="8" md="10">
      <br />
      <div class="row">
        <div class="col-sm">
          <v-card class="accent">
            <v-card-title class="headline">
              Proposal loading
            </v-card-title>
            <v-card-text>
               <br />
              <v-col cols="12">
                <v-progress-linear
                  color="#00fafa"
                  indeterminate
                  rounded
                  height="20"
                  bottom
                ></v-progress-linear>
              </v-col>
            </v-card-text>
          </v-card>
        </div>
      </div>

    </v-col>
  </v-row>
  </p>
  <p v-else-if="$fetchState.error">Une erreur est survenue :(</p>

  <v-row v-else justify="center" align="center">

    <v-col cols="12" sm="8" md="10">
      <br />
      <div class="row">
        <div class="col-sm">
          <v-card class="accent" height="444">
            <v-card-title class="headline">
            </v-card-title>

            <v-card-text v-if="proposalLoaded === true && proposal.final_tally_result.yes != 0">
               <ProposalChart />
            </v-card-text>
            <v-card-text v-else>

              No data for now
              <!--<v-container fluid>
                <v-row dense>
                  <v-col
                  class="mx-auto"
                    v-for="card in cards"
                    :key="card.title"
                    :cols="card.flex"
                  >
                    <v-card>
                      <v-card-title v-text="card.title"></v-card-title>

                      <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn icon>
                          <v-icon>mdi-heart</v-icon>
                        </v-btn>

                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>-->

            </v-card-text>
          </v-card>
        </div>
        <div class="col-sm">
          <v-card class="accent" height="444">
            <v-card-title class="headline">
              #{{ id }} <v-spacer />
              <div v-if="proposalData.proposal.status === 'PROPOSAL_STATUS_PASSED'">
                <v-chip
                  class="ma-2"
                  color="green"
                  text-color="white"
                  label
                >
                  <v-icon class="mr-1">mdi-checkbox-marked-circle</v-icon>
                  Proposal Passed
                </v-chip>
              </div>
              <div v-if="proposalData.proposal.status === 'PROPOSAL_STATUS_REJECTED'">
                <v-chip
                  class="ma-2"
                  color="red"
                  text-color="white"
                  label
                >
                  <v-icon class="mr-1">mdi-delete-forever</v-icon>
                  Proposal Rejected
                </v-chip>
              </div>
              <div v-if="proposalData.proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD'">
                <v-chip
                  class="ma-2"
                  color="primary"
                  text-color="white"
                  label
                >
                  <v-icon class="mr-1">mdi-alarm-check</v-icon>
                  Voting Period
                </v-chip>
              </div>
              <div v-if="proposalData.proposal.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD'">
                <v-chip
                  class="ma-2"
                  color="primary"
                  text-color="white"
                  label
                >
                  <v-icon class="mr-1">mdi-cash-fast</v-icon>
                  Voting Period
                </v-chip>
              </div>
            </v-card-title>
            <v-card-text>
                 <!--<v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Total deposit</v-list-item-title>
                    <v-list-item-subtitle v-if="proposalData.proposal.total_deposit.length > 0">
                      {{ proposalData.proposal.total_deposit[0].amount / 1000000 }} {{ config[chainId].coinLookup.viewDenom }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle v-else>
                      Waiting end of Voting Period
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Voting Start</v-list-item-title>
                    <v-list-item-subtitle>{{ $moment(proposalData.proposal.voting_start_time) }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Voting End</v-list-item-title>
                    <v-list-item-subtitle>{{ $moment(proposalData.proposal.voting_end_time) }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Deposit End Time</v-list-item-title>
                    <v-list-item-subtitle>{{ $moment(proposalData.proposal.deposit_end_time) }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item><br />-->

              <v-col class="text-right"  v-if="proposalData.proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD'">

                <SendProposalModal
                  :chainIdProps="config[chainId].coinLookup.addressPrefix"
                  :coinIcon="config[chainId].coinLookup.icon"
                  :idProposal="id"
                  :cardsVote="cards"
                />
              </v-col>
            </v-card-text>
          </v-card>
        </div>
      </div>
      <div class="row">
        <div class="col-sm">
          <v-card class="accent">
            <v-card-title class="headline">
              {{ proposalData.proposal.content.title }}
            </v-card-title>
            <!--<v-card-text v-html="$md.render(proposalData.proposal.content.description)">
              <v-col class="text-right">
              <v-btn
                class="ma-2"
                nuxt
              >
                Website
              </v-btn>
              </v-col>
            </v-card-text>-->
          </v-card>
        </div>
      </div>
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
} from '@cosmjs/stargate'
import cosmosConfig from '~/cosmos.config'

export default {
  name: 'Proposal',
  data: () => ({
      loadedProposal: false,
      id: '',
      config: cosmosConfig,
      cards: [
        { title: 'Yes', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 5 },
        { title: 'No', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 5 },
        { title: 'NoWithVeto', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 5 },
        { title: 'Abstain', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 5 },
      ],
  }),
  computed: {
    ...mapState('data', ['chainId', `balances`, 'proposal', 'proposalLoaded']),

  },
    methods: {
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
    console.log(this.proposalData)
  },
  async mounted () {
    //await this.$store.dispatch('data/getSingleProposal', this.$route.params.id)
    //await this.$store.dispatch('keplr/checkLogin')
    //console.log(this.$route.params.id)
    this.id = this.$route.params.id
  }
}
</script>

