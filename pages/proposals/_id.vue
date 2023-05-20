<!-- eslint-disable -->
<template>
  <v-row
    v-if="$fetchState.pending"
    justify="center"
    align="center"
  />
  <v-row
    v-else-if="$fetchState.error"
    justify="center"
    align="center"
  />
  <v-row
    v-else
    justify="center"
    align="center"
  >
    <!-- If deposit period -->
    <v-col
      v-if="proposalData.proposal.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD'"
      cols="12"
      sm="8"
      md="10"
    >
      <v-row>
        <v-col
          cols="12"
          md="8"
        >
          <v-card
            dark
            class="accent"
          >
            <v-card-title>
              #{{ proposalData.proposal.proposal_id }}
              {{ proposalData.proposal.content.title }}
              <v-spacer />
              End time:
              {{ formatDate(proposalData.proposal.deposit_end_time) }}
            </v-card-title>
            <v-card-text>
              <div
                v-html="$md.render(proposalData.proposal.content.description)"
              />
              <!-- {{  proposalData.proposal.content.description }} -->
            </v-card-text>
          </v-card>
          <v-card
            dark
            class="accent mt-4"
          >
            test
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-card
            dark
            class="accent"
          >
            <v-card-title>
              <span class="text-h5">Deposite detail</span>
            </v-card-title>
            <v-card-text>
              <ChartsProposalDeposite
                :total_deposit="proposalData.proposal.total_deposit[0].amount"
                :min_deposit="paramsDeposit.min_deposit"
              />
              <br>

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
                      Minimum Deposit
                    </td>
                    <td>
                      {{ paramsDeposit.min_deposit }}
                      {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <v-icon
                        color="#33ffc9"
                        small
                      >
                        mdi-circle
                      </v-icon>
                      Total Deposit
                    </td>
                    <td>
                      {{
                        proposalData.proposal.total_deposit[0].amount / 1000000
                      }}
                      {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <v-icon
                        color="#00b383"
                        small
                      >
                        mdi-circle
                      </v-icon>
                      Deposit Remaining
                    </td>
                    <td>
                      {{
                        paramsDeposit.min_deposit -
                          proposalData.proposal.total_deposit[0].amount / 1000000
                      }}
                      {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
              <v-row class="mt-4">
                <v-col>
                  <v-text-field
                    v-model="initDeposit"
                    outlined
                    label="Deposit (bcna)"
                    required
                  />
                </v-col>
              </v-row>
              <v-btn
                color="#00b786"
                @click="submitDeposit"
              >
                Submit deposit
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col
      v-else
      cols="12"
      sm="8"
      md="10"
    >
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
                  #{{ proposalData.proposal.proposal_id }}
                  {{ proposalData.proposal.content.title }}
                  <v-spacer />
                  <td
                    v-if="
                      proposalData.proposal.status === 'PROPOSAL_STATUS_PASSED'
                    "
                  >
                    <v-chip
                      color="#00b786"
                      text-color="white"
                      label
                    >
                      <v-icon class="mr-1">
                        mdi-checkbox-marked-circle
                      </v-icon>
                      Proposal Passed
                    </v-chip>
                  </td>
                  <td
                    v-if="
                      proposalData.proposal.status ===
                        'PROPOSAL_STATUS_REJECTED'
                    "
                  >
                    <v-chip
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
                  <td
                    v-if="
                      proposalData.proposal.status ===
                        'PROPOSAL_STATUS_VOTING_PERIOD'
                    "
                  >
                    <!--{{ item.status }}-->
                    <SendProposalModal
                      :chain-id-props="
                        cosmosConfig[chainId].coinLookup.addressPrefix
                      "
                      :coin-icon="cosmosConfig[chainId].coinLookup.icon"
                      :id-proposal="id"
                      :cards-vote="cards"
                    />
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
                  <td
                    v-if="
                      proposalData.proposal.status ===
                        'PROPOSAL_STATUS_DEPOSIT_PERIOD'
                    "
                  >
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
                    <Doughnut
                      v-if="
                        getTally.tally.yes > 0 ||
                          getTally.tally.no > 0 ||
                          getTally.tally.abstain > 0 ||
                          getTally.tally.no_with_veto > 0
                      "
                      :data="chartData"
                    />
                    <h2
                      v-else
                      class="mt-10 d-flex justify-center align-center fill-height"
                    >
                      No vote
                    </h2>
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
                  <v-spacer />
                  <v-chip
                    v-if="
                      proposalData.proposal.content['@type'] ===
                        '/cosmos.gov.v1beta1.TextProposal'
                    "
                    color="#00b786"
                    outlined
                  >
                    Text Proposal
                  </v-chip>
                  <v-chip
                    v-if="
                      proposalData.proposal.content['@type'] ===
                        '/cosmos.distribution.v1beta1.CommunityPoolSpendProposal'
                    "
                    color="#00b786"
                    outlined
                  >
                    Community Pool Spend Proposal
                  </v-chip>
                  <v-chip
                    v-if="
                      proposalData.proposal.content['@type'] ===
                        '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal'
                    "
                    color="#00b786"
                    outlined
                  >
                    Software Upgrade Proposal
                  </v-chip>
                </v-card-title>
                <v-card-text>
                  <v-simple-table>
                    <template #default>
                      <tbody>
                        <tr
                          v-if="proposalData.proposal.total_deposit.length > 0"
                        >
                          <td>Total deposit</td>
                          <td>
                            {{
                              proposalData.proposal?.total_deposit[0].amount /
                                1000000
                            }}
                            {{ cosmosConfig[chainId].coinLookup.viewDenom }}
                          </td>
                        </tr>
                        <tr>
                          <td>Deposit End Time</td>
                          <td>
                            {{
                              formatDate(proposalData.proposal.deposit_end_time)
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>Voting Start</td>
                          <td>
                            {{
                              formatDate(proposalData.proposal.voting_start_time)
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>Voting End</td>
                          <td>
                            {{
                              formatDate(proposalData.proposal.voting_end_time)
                            }}
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>

                  <br><br><br><br>
                  <!-- {{proposalData.proposal}} -->
                  <v-stepper>
                    <v-stepper-header dark>
                      <v-stepper-step
                        v-if="
                          proposalData.proposal.status !==
                            'PROPOSAL_STATUS_DEPOSIT_PERIOD'
                        "
                        step="1"
                        complete
                        color="#00b786"
                      >
                        Created
                      </v-stepper-step>

                      <v-divider />

                      <v-stepper-step
                        step="2"
                        complete
                        color="#00b786"
                      >
                        Deposit Period Ends
                      </v-stepper-step>

                      <v-divider />

                      <v-stepper-step
                        step="3"
                        complete
                        color="#00b786"
                      >
                        Voting Period Starts
                      </v-stepper-step>

                      <v-divider />

                      <v-stepper-step
                        v-if="
                          proposalData.proposal.status ===
                            'PROPOSAL_STATUS_VOTING_PERIOD'
                        "
                        step="4"
                      >
                        Voting Period Ends
                      </v-stepper-step>
                      <v-stepper-step
                        v-else
                        step="4"
                        complete
                        color="#00b786"
                      >
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
              v-if="
                proposalData.proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD'
              "
              cols="12"
              md="6"
            >
              <v-card dark>
                <v-card-title>Quorum </v-card-title>
                <v-card-text>
                  <v-progress-linear
                    buffer-value="33"
                    stream
                    :value="
                      (
                        (totalTally / 1000000 / totalBonded /* * 0.33 */) *
                        100
                      ).toFixed(2)
                    "
                    height="20"
                    background-color="#00b786"
                    color="#14FFC0"
                    class="mb-10"
                  >
                    <div
                      v-if="
                        (
                          (totalTally / 1000000 / totalBonded /* * 0.33 */) *
                          100
                        ).toFixed(2) > 33
                      "
                      class="ml-10"
                    >
                      Quorum reached
                    </div>
                    <div
                      v-else
                      class="ml-10 text-red"
                    >
                      Quorum not reached
                    </div>
                  </v-progress-linear>
                  <v-simple-table>
                    <template #default>
                      <tbody>
                        <tr>
                          <td>
                            <v-icon
                              color="#00b786"
                              small
                            >
                              mdi-circle
                            </v-icon>
                            Total Bounded
                          </td>
                          <td>
                            100% ({{ Number(totalBonded).toFixed(2) }} bcna)
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <v-icon
                              color="#00b786"
                              small
                            >
                              mdi-circle
                            </v-icon>
                            Quorum needed
                          </td>
                          <td>
                            33% ({{
                              Number(totalBonded * 0.33).toFixed(2)
                            }}
                            bcna)
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <v-icon
                              color="#14FFC0"
                              small
                            >
                              mdi-circle
                            </v-icon>
                            Quorum actual
                          </td>
                          <td>
                            {{
                              Number(
                                (totalTally /
                                  1000000 /
                                  totalBonded /* * 0.33 */) *
                                  100
                              ).toFixed(2)
                            }}% ({{ (totalTally / 1000000).toFixed(2) }} bcna)
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col
              cols="12"
              :md="
                proposalData.proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD'
                  ? '6'
                  : '12'
              "
            >
              <v-card dark>
                <v-card-title>Threshold</v-card-title>
                <v-card-text>
                  <v-progress-linear
                    height="20"
                    background-color="error"
                    color="#00b786"
                    :value="
                      (
                        (Number(getTally.tally.yes) * 100) /
                        (Number(getTally.tally.yes) +
                          Number(getTally.tally.no) +
                          Number(getTally.tally.no_with_veto))
                      ).toFixed(2)
                    "
                    class="mb-10"
                  />

                  <v-simple-table>
                    <template #default>
                      <tbody>
                        <tr v-if="getTally.tally.yes > 0">
                          <td>
                            <v-icon
                              color="#00b786"
                              small
                            >
                              mdi-circle
                            </v-icon>
                            Voted yes
                          </td>
                          <td>
                            {{
                              (
                                (Number(getTally.tally.yes) * 100) /
                                (Number(getTally.tally.yes) +
                                  Number(getTally.tally.no) +
                                  Number(getTally.tally.no_with_veto))
                              ).toFixed(2)
                            }}
                            %
                          </td>
                          <td>{{ getTally.tally.yes / 1000000 }} BCNA</td>
                        </tr>
                        <tr v-else>
                          <td>
                            <v-icon
                              color="#00b786"
                              small
                            >
                              mdi-circle
                            </v-icon>
                            Voted yes
                          </td>
                          <td>0 %</td>
                          <td>0 BCNA</td>
                        </tr>
                        <tr v-if="getTally.tally.no > 0">
                          <td>
                            <v-icon
                              color="error"
                              small
                            >
                              mdi-circle
                            </v-icon>
                            Voted no
                          </td>
                          <td>
                            {{
                              (
                                (Number(getTally.tally.no) * 100) /
                                (Number(getTally.tally.yes) +
                                  Number(getTally.tally.no) +
                                  Number(getTally.tally.no_with_veto))
                              ).toFixed(2)
                            }}
                            %
                          </td>
                          <td>{{ getTally.tally.no / 1000000 }} BCNA</td>
                        </tr>
                        <tr v-else>
                          <td>
                            <v-icon
                              color="error"
                              small
                            >
                              mdi-circle
                            </v-icon>
                            Voted no
                          </td>
                          <td>0 %</td>
                          <td>0 BCNA</td>
                        </tr>
                        <tr v-if="getTally.tally.no_with_veto > 0">
                          <td>
                            <v-icon
                              color="#14FFC0"
                              small
                            >
                              mdi-circle
                            </v-icon>
                            No With Veto
                          </td>
                          <td>
                            {{
                              (
                                (Number(getTally.tally.no_with_veto) * 100) /
                                (Number(getTally.tally.yes) +
                                  Number(getTally.tally.no) +
                                  Number(getTally.tally.no_with_veto))
                              ).toFixed(2)
                            }}
                            %
                          </td>
                          <td>
                            {{ getTally.tally.no_with_veto / 1000000 }} BCNA
                          </td>
                        </tr>
                        <tr v-else>
                          <td>
                            <v-icon
                              color="#14FFC0"
                              small
                            >
                              mdi-circle
                            </v-icon>
                            No With Veto
                          </td>
                          <td>0 %</td>
                          <td>0 BCNA</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row
            v-if="
              proposalData.proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD'
            "
          >
            <v-col
              cols="12"
              md="12"
            >
              <v-card dark>
                <v-card-title>Voters </v-card-title>
                <v-card-text>
                  <v-data-table
                    :headers="headers"
                    :items="getVoters.votes"
                    :items-per-page="5"
                    class="elevation-1"
                  >
                    <template #item.options[0].option="{ item }">
                      <v-chip
                        v-if="item.options[0].option === 'VOTE_OPTION_YES'"
                        class="ma-2"
                        color="green"
                        outlined
                        label
                      >
                        YES
                      </v-chip>
                      <v-chip
                        v-if="item.options[0].option === 'VOTE_OPTION_NO'"
                        class="ma-2"
                        color="red"
                        outlined
                        label
                      >
                        NO
                      </v-chip>
                      <v-chip
                        v-if="item.options[0].option === 'VOTE_OPTION_ABSTAIN'"
                        class="ma-2"
                        color="red"
                        outlined
                        label
                      >
                        ABSTAIN
                      </v-chip>
                      <v-chip
                        v-if="
                          item.options[0].option === 'VOTE_OPTION_NO_WITH_VETO'
                        "
                        class="ma-2"
                        color="orange"
                        outlined
                        label
                      >
                        NO WITH VETO
                      </v-chip>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              md="128"
            >
              <v-card dark>
                <v-card-title>Proposal description</v-card-title>
                <v-card-text>
                  <div
                    v-html="
                      $md.render(proposalData.proposal.content.description)
                    "
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import {
  assertIsBroadcastTxSuccess,
  SigningStargateClient,
  defaultRegistryTypes,
  GasPrice,
} from "@cosmjs/stargate";
import cosmosConfig from "~/cosmos.config";

export default {
  name: "Proposal",
  data: () => ({
    loadedProposal: false,
    id: "",
    initDeposit: 0,
    cosmosConfig: cosmosConfig,
    getVoters: [],
    cards: [
      { title: "Yes", flex: 5 },
      { title: "No", flex: 5 },
      { title: "NoWithVeto", flex: 5 },
      { title: "Abstain", flex: 5 },
    ],
    headers: [
      {
        text: "Voter",
        align: "start",
        sortable: false,
        value: "voter",
      },
      { text: "Option", value: "options[0].option" },
      // { text: 'Voting power', value: 'options[0].weight' }
    ],
  }),
  async fetch() {
    this.proposalData = await fetch(
      cosmosConfig[this.chainId].apiURL +
        `/cosmos/gov/v1beta1/proposals/` +
        this.$route.params.id
    ).then((res) => res.json());

    this.proposalDeposits = await fetch(
      cosmosConfig[this.chainId].apiURL +
        "/cosmos/gov/v1beta1/proposals/" +
        this.$route.params.id +
        "/deposits"
    ).then((res) => res.json());

    this.getVoters = await fetch(
      cosmosConfig[this.chainId].apiURL +
        "/cosmos/gov/v1beta1/proposals/" +
        this.$route.params.id +
        "/votes"
    ).then((res) => res.json());

    this.getTally = await fetch(
      cosmosConfig[this.chainId].apiURL +
        "/cosmos/gov/v1beta1/proposals/" +
        this.$route.params.id +
        "/tally"
    ).then((res) => res.json());
  },  
  computed: {
    ...mapState("keplr", [`accounts`]),
    ...mapState("data", [
      "chainId",
      `balances`,
      "proposal",
      "proposalLoaded",
      "paramsDeposit",
      "totalBonded",
    ]),
    totalTally() {
      const totalTally =
        Number(this.getTally.tally.yes) +
        Number(this.getTally.tally.no) +
        Number(this.getTally.tally.no_with_veto) +
        Number(this.getTally.tally.abstain);
      console.log(totalTally);
      return totalTally;
    },
    chartData() {
      console.log(this.getTally);
      return {
        labels: ["Yes", "No", "No With Veto", "Abstain"],
        datasets: [
          {
            label: "",
            data: [
              this.getTally.tally.yes / 1000000,
              this.getTally.tally.no / 1000000,
              this.getTally.tally.no_with_veto / 1000000,
              this.getTally.tally.abstain / 1000000,
            ],
            backgroundColor: ["#b3ffeb", "#33ffc9", "#00b383", "#004d38"],
            //borderColor: '#00b786',
            borderWidth: 1,
            circular: false,
          },
        ],
      };
    },
  },
  async mounted() {
    //await this.$store.dispatch('data/getSingleProposal', this.$route.params.id)
    //await this.$store.dispatch('keplr/checkLogin')
    //console.log(this.$route.params.id)
    await this.$store.dispatch("keplr/checkLogin");
    this.id = this.$route.params.id;
    await this.$store.dispatch("data/getProposalParamsDeposit");
    await this.$store.dispatch("data/getProposalQuorum");
  },

  methods: {
    async submitDeposit() {
      console.log("submitDeposit");

      console.log(this.$route.params.id);

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
        (element) => element[0] === "/cosmos.gov.v1beta1.MsgDeposit"
      );

      const convertAmount = (this.initDeposit * 1000000).toFixed(0);
      const amount = {
        denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
        amount: convertAmount.toString(),
      };

      const finalMsg = {
        typeUrl: foundMsgType[0],
        value: foundMsgType[1].fromPartial({
          proposalId: this.$route.params.id,
          depositor: this.accounts[0].address,
          amount: [amount],
        }),
      };

      console.log(finalMsg);
      try {
        const result = await client.signAndBroadcast(
          this.accounts[0].address,
          [finalMsg],
          "auto",
          this.memo
        );
        assertIsBroadcastTxSuccess(result);
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    },
    validate() {
      if (this.$refs.form.validate() === true) {
        (async () => {
          // Send notification
          const returnWaiting = notifWaiting(this.$toast);
          this.loading = true;

          const chainId = cosmosConfig[this.chainId].chainId;
          await window.keplr.enable(chainId);
          const offlineSigner = await window.getOfflineSignerAuto(chainId);
          const accounts = await offlineSigner.getAccounts();

          const client = await SigningStargateClient.connectWithSigner(
            cosmosConfig[this.chainId].rpcURL,
            offlineSigner
          );
          const convertAmount = this.amount * 1000000;
          const amount = {
            denom: cosmosConfig[this.chainId].coinLookup.chainDenom,
            amount: convertAmount.toString(),
          };
          const fee = {
            amount: [
              {
                denom: cosmosConfig[this.chainId].chainDenom,
                amount: "5000",
              },
            ],
            gas: "200000",
          };
          try {
            const result = await client.sendTokens(
              accounts[0].address,
              this.address,
              [amount],
              fee,
              this.memo
            );
            assertIsBroadcastTxSuccess(result);
            this.dialog = false;
            this.loading = false;
            this.$toast.dismiss(returnWaiting);
            // Send notification
            notifSuccess(this.$toast, result.transactionHash);
            await this.$store.dispatch("data/refresh", accounts[0].address);
          } catch (error) {
            console.error(error);
            this.$toast.dismiss(returnWaiting);
            notifError(this.$toast);
            this.loading = false;
          }
        })();
      }
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
  }
};
</script>
