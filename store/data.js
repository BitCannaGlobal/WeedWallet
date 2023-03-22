import axios from 'axios'
import cosmosConfig from '~/cosmos.config'

export const state = () => ({
  block: undefined,
  chainId: 0,
  blockNow: '0',
  balances: [],
  delegations: '',
  totalDelegated: '',
  rewards: '',
  delegationsLoaded: false,
  proposal: [],
  chartProposalData: [],
  allValidators: '',
  validators: [],
  validatorsLoaded: false,
  finalMsgProp: [],
  proposalAllVote: '',
  api: undefined,
  priceNow: '',
  aprNow: '',
  sdkVersion: '',
  totalBonded: '',
  validatorDetails: ''
})

export const mutations = {
  // create set methods from data points
  ...Object.fromEntries(
    Object.keys(state()).map((entity) => {
      return [
        `set${entity.charAt(0).toUpperCase()}${entity.substr(1)}`,
        (state, value) => {
          state[entity] = value
        },
      ]
    })
  ),
  resetSessionData(state) {
    state.balances = []
  },
}

export const actions = {
  // this is never awaited in the code
  async refresh({ dispatch, state }, address) {
    const calls = [
      dispatch('getSdkVersion'),
      dispatch('getWalletInfo', address),
      dispatch('getDelegations', address),
      dispatch('getPriceNow'),
    ]
    await Promise.all(calls)
  },
  async getBlockNow({ commit, state }) {
    const getBlock = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/base/tendermint/v1beta1/blocks/latest')
    commit('setBlockNow', getBlock.data.block.header.height)
  },
  async getPriceNow({ commit, state }) {
    const getPrice = await axios('/api/price')
    commit('setPriceNow', getPrice.data.bitcanna.usd.toFixed(5))
  },
  async getApr({ commit, state }) {
    const getApr =  await axios('https://graphql.bitcanna.io/api/rest/price/apr')
    commit('setAprNow', Number (getApr.data.cmc_supply_apr[0].apr).toFixed(1))
  },
  async getSdkVersion({ commit, state }) {
    const getSdk =  await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/base/tendermint/v1beta1/node_info')
    commit('setSdkVersion', getSdk.data.application_version.cosmos_sdk_version)
  },

  async getWalletInfo({ commit, state }, address) {
    const accountInfo = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/bank/v1beta1/balances/' + address)
    const foundAccountInfo = accountInfo.data.balances.find(element => element.denom === cosmosConfig[state.chainId].coinLookup.chainDenom);

    commit('setBalances', foundAccountInfo?.amount)
    return accountInfo
  },

  async getDelegations({ commit, state }, address) {
    const getDelegations = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/distribution/v1beta1/delegators/' + address + '/rewards')
    let foundMainDenom = getDelegations.data.total.find(element => element.denom === cosmosConfig[state.chainId].coinLookup.chainDenom);
    if (typeof foundMainDenom === 'undefined') {
      foundMainDenom = {
        denom: cosmosConfig[state.chainId].coinLookup.chainDenom,
        amount: '0'
      }
    }
    var copieRewards = [];

    const getValidatorInfo = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/staking/v1beta1/delegations/' + address)
    const getValidatorMainInfo = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/staking/v1beta1/validators?pagination.limit=200')

    let totalDelegated = 0
    await getDelegations.data.rewards.forEach(function(item){
      let foundDelegByValidator = getValidatorInfo.data.delegation_responses.find(element => element.delegation.validator_address === item.validator_address);
      let foundValidatorMainInfo = getValidatorMainInfo.data.validators.find(element => element.operator_address === item.validator_address);

      copieRewards.push({
        validatorName: foundValidatorMainInfo?.description.moniker,
        op_address: foundDelegByValidator.delegation.validator_address,
        reward: (item.reward[0]?.amount / 1000000).toFixed(4),
        share: foundDelegByValidator.delegation.shares,
        status: foundValidatorMainInfo?.status
      });
      totalDelegated += Number(foundDelegByValidator.delegation.shares)
    });

    commit('setDelegations', copieRewards)
    commit('setRewards', foundMainDenom)
    commit('setTotalDelegated', String(totalDelegated))
    commit('setDelegationsLoaded', true)
  },

  async getSingleProposal({ commit, state }, proposalId) {
    const singleProposals = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/group/v1/proposal/' + proposalId)
    const allVotes = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/group/v1/votes_by_proposal/' + proposalId)
    const policyInfo = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/group/v1/group_policy_info/' + singleProposals.data.proposal.group_policy_address)
    const getAllUsersGroup = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/group/v1/group_members/' + policyInfo.data.info.group_id)


    allVotes.data.votes.forEach((item) => {

      let foundName = getAllUsersGroup.data.members.find(element => element.member.address === item.voter);

      item.name = foundName.member.metadata
    });

    let saveProps = []
    singleProposals.data.proposal.messages.forEach((item) => {

      let typeReadable = ''
      let finalAmount = ''

      switch (item['@type']) {
        case "/cosmos.bank.v1beta1.MsgSend":
          item.typeReadable = 'Send'
          item.finalAmount = item.amount[0].amount
          break;
        case "/cosmos.staking.v1beta1.MsgDelegate":
          item.typeReadable = 'Delegate'
          item.finalAmount = item.amount.amount
          //finalAmount = item.tx.body.messages[0].amount.amount
          break;
        case "/cosmwasm.wasm.v1.MsgExecuteContract":
          item.typeReadable = 'Wasm'
          item.finalAmount = ""
          //finalAmount = item.tx.body.messages[0].amount.amount
          break;
        case "/cosmos.staking.v1beta1.MsgCreateValidator":
          item.typeReadable = 'Create validator'
          item.finalAmount = ""
          //finalAmount = item.tx.body.messages[0].amount.amount
          break;

        default:
          console.log("Sorry, dont know " + item.tx.body.messages[0]['@type'] + ".");
      }
    });

    commit('setProposal', singleProposals.data.proposal)
    commit('setProposalAllVote', allVotes.data.votes)
  },

  async getSingleProposalVote({ commit, state }, proposalId) {
    const allProposals = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/group/v1/votes_by_proposal/' + proposalId)
  },

  async getAllValidator({ commit, state }, proposalId) {
    const allVal = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/staking/v1beta1/validators')
    commit('setAllValidators', allVal.data.validators)
  },

  async formatFinalMsgProp({ commit, state }, data) {
    let saveMsgs = []
    state.finalMsgProp.forEach((item) => {
      saveMsgs.push(item);
    });
    saveMsgs.push(data);


    commit('setFinalMsgProp', saveMsgs)
  },
  async resetFinalMsgProp({ commit, state }) {
    commit('setFinalMsgProp', [])
  },



  async getChartProposalData({ commit, state }, proposalId) {

    const allProposals = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/group/v1/proposals/'+proposalId+'/tally')

    const allData = {
      chartData: {
        labels: ['Abstain', 'No with veto', 'Yes', 'No'],
        datasets: [
          {
            backgroundColor: ['#d8ff00', '#E46651', '#54d854', '#ce2525'],
            data: [
              allProposals.data.tally.abstain_count,
              allProposals.data.tally.no_with_veto_count,
              allProposals.data.tally.yes_count,
              allProposals.data.tally.no_count
            ]
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    }

    commit('setChartProposalData', allData)
  },
  async getAllValidators({ commit, state }) {
    var copieValidators = []
    const allValidators = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/staking/v1beta1/validators')

    let totalBonded2 = 0
    await allValidators.data.validators.forEach(async (item) => {
      totalBonded2 += Number(item.tokens)
    })
    await Promise.all(allValidators.data.validators.map(async (item) => {

      copieValidators.push({
        name: item.description.moniker,
        op_address: item.operator_address,
        crate: (Number(item.commission.commission_rates.rate) * 100).toFixed(2)+ ' %',
        website: item.description.website,
        votingPower: ((item.tokens / totalBonded2) * 100 ).toFixed(2)+ ' %',
        status: item.status
      })
    }))

    commit('setTotalBonded', totalBonded2)
    commit('setValidators', copieValidators)
  },
  async getValidatorDetails({ commit, state }, valAddr) {

    const validatorDetails = await axios(cosmosConfig[state.chainId].apiURL + '/cosmos/staking/v1beta1/validators/' + valAddr)
    console.log(validatorDetails)

    commit('setValidatorDetails', validatorDetails.data.validator)
  },
  changeChaniId({ commit }, chainId) {
    commit('setChainId', chainId)
  },
  resetSessionData({ commit }) {
    commit('resetSessionData')
  },
}
