import axios from "axios";
import moment from "moment";
//import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { buildQuery } from "@cosmjs/tendermint-rpc/build/tendermint34/requests.js";
import { toHex } from "@cosmjs/encoding";
import cosmosConfig from "~/cosmos.config";

export const state = () => ({
  layout: true,
  block: undefined,
  rpcClient: "",
  chainId: 0,
  blockNow: "0",
  balances: [],
  balancesPrice: "",
  myDelegatorData: [],
  delegations: "",
  totalDelegated: "",
  rewards: "",
  totalUnbound: "",
  delegationsLoaded: false,
  proposal: [],
  chartProposalData: [],
  allValidators: "",
  validators: [],
  validatorsLoaded: false,
  finalMsgProp: [],
  proposalAllVote: "",
  api: undefined,
  priceNow: "",
  aprNow: "",
  sdkVersion: "",
  validatorDetails: "",
  totalWallet: "",
  totalWalletPrice: "",
  validatorDelegations: "",
  validatorUnDelegations: "",
  paramsDeposit: "",
  paramsVoting: "",
  totalBonded: "",
  allUnbonding: "",
  allRedelegate: "",
  allTxs: "",
  allTxsLoaded: false,
});

export const mutations = {
  // create set methods from data points
  ...Object.fromEntries(
    Object.keys(state()).map((entity) => {
      return [
        `set${entity.charAt(0).toUpperCase()}${entity.substr(1)}`,
        (state, value) => {
          state[entity] = value;
        },
      ];
    })
  ),
  resetSessionData(state) {
    state.balances = [];
  },
};

export const actions = {
  // this is never awaited in the code
  async refresh({ dispatch }, address) {
    const calls = [
      dispatch("getSdkVersion"),
      dispatch("getWalletInfo", address),
      dispatch("getDelegations", address),
      dispatch("getPriceNow"),
    ];
    await Promise.all(calls);
  },
  async changeLayout({ commit }, value) {
    commit("setLayout", value);
  },
  async getBlockNow({ commit, state }) {
    const getBlock = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/base/tendermint/v1beta1/blocks/latest"
    );
    commit("setBlockNow", getBlock.data.block.header.height);
  },
  async getPriceNow({ commit }) {
    const getPrice = await axios("/api/price");
    commit("setPriceNow", getPrice.data.bitcanna.usd.toFixed(5));
  },
  async getApr({ commit, state }) {
    const totalSupply = await axios(
      cosmosConfig[state.chainId].apiURL + "/cosmos/bank/v1beta1/supply"
    );
    const inflation = await axios(
      cosmosConfig[state.chainId].apiURL + "/cosmos/mint/v1beta1/inflation"
    );

    let foundSupply = totalSupply.data.supply.find(
      (element) =>
        element.denom === cosmosConfig[state.chainId].coinLookup.chainDenom
    );
    let finalApr = (
      ((foundSupply.amount * inflation.data.inflation) / state.totalBonded) *
      100
    ).toFixed(1);
    commit("setAprNow", finalApr);
  },
  async getSdkVersion({ commit, state }) {
    const getSdk = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/base/tendermint/v1beta1/node_info"
    );
    commit("setSdkVersion", getSdk.data.application_version.cosmos_sdk_version);
  },
  async initRpc({ commit, state }) {
    const client = await Tendermint34Client.connect(
      cosmosConfig[state.chainId].rpcURL
    );
    // const queryClient = new QueryClient(client);
    // const rpcClient = createProtobufRpcClient(queryClient);
    // commit("setRpcClient", rpcClient);
    commit("setRpcClient", client);
  },
  async getDelegatorDataRpc({ commit, state }, data) {
    // Delegation historical
    const queryDelegate = buildQuery({
      tags: [
        { key: "delegate.validator", value: data.validator },
        { key: "message.sender", value: data.delegator },
      ],
    });
    const resultDelegate = await state.rpcClient.txSearch({
      query: queryDelegate,
    });

    let sumDelegation = 0;
    resultDelegate.txs.forEach(async (item) => {
      let txEvent = JSON.parse(item.result.log);
      const txHash = toHex(item.hash);
      item.hashDecoded = txHash;
      item.txEvent = txEvent[0].events;
      const found = txEvent[0].events.find(
        (element) => element.type === "delegate"
      );
      const foundAmount = found.attributes.find(
        (element) => element.key === "amount"
      );
      item.amount = foundAmount.value.replace("ubcna", "");
      sumDelegation += parseInt(item.amount);
    });
    this.delegationsRpc = resultDelegate.txs.reverse();
    this.myTotalDelegation = (sumDelegation / 1000000).toFixed(2);

    // UnDelegation historical
    const queryUnDelegate = buildQuery({
      tags: [
        { key: "unbond.validator", value: data.validator },
        { key: "message.sender", value: data.delegator },
      ],
    });
    const resultUnDelegate = await state.rpcClient.txSearch({
      query: queryUnDelegate,
    });
    //console.log(resultUnDelegate)

    let sumUnDelegate = 0;
    resultUnDelegate.txs.forEach(async (item) => {
      let txEvent = JSON.parse(item.result.log);
      const txHash = toHex(item.hash);
      item.hashDecoded = txHash;
      item.txEvent = txEvent[0].events;
      const found = txEvent[0].events.find(
        (element) => element.type === "unbond"
      );
      const foundAmount = found.attributes.find(
        (element) => element.key === "amount"
      );
      item.amount = foundAmount.value.replace("ubcna", "");
      sumUnDelegate += parseInt(item.amount);
    });
    this.unDelegateRpc = resultUnDelegate.txs.reverse();
    this.myTotalUnDelegation = (sumUnDelegate / 1000000).toFixed(2);

    let myFinalData = {
      delegationsRpc: resultDelegate.txs.reverse(),
      unDelegateRpc: resultUnDelegate.txs.reverse(),
      myTotalDelegation: (sumDelegation / 1000000).toFixed(2),
      myTotalUnDelegation: (sumUnDelegate / 1000000).toFixed(2),
    };
    commit("setMyDelegatorData", myFinalData);
  },
  async getWalletInfo({ commit, state }, address) {
    // /cosmos/bank/v1beta1/balances/
    // /cosmos/bank/v1beta1/spendable_balances/{address}
    const accountInfo = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/bank/v1beta1/spendable_balances/" +
        address
    );
    let foundAccountInfo = accountInfo.data.balances.find(
      (element) =>
        element.denom === cosmosConfig[state.chainId].coinLookup.chainDenom
    );

    if (typeof foundAccountInfo === "undefined") {
      foundAccountInfo = {
        denom: cosmosConfig[state.chainId].coinLookup.chainDenom,
        amount: "0",
      };
    }

    commit(
      "setBalancesPrice",
      ((foundAccountInfo?.amount / 1000000) * state.priceNow).toFixed(2)
    );
    commit("setBalances", foundAccountInfo?.amount);
    return accountInfo;
  },

  async getAllTxs({ commit }, address) {
    const resultSender = await axios(
      cosmosConfig[0].apiURL +
        "/cosmos/tx/v1beta1/txs?events=message.sender=%27" +
        address +
        "%27&limit=20&order_by=2"
    );
    const resultRecipient = await axios(
      cosmosConfig[0].apiURL +
        "/cosmos/tx/v1beta1/txs?events=transfer.recipient=%27" +
        address +
        "%27&limit=20&order_by=2"
    );
    const finalTxs = resultSender.data.tx_responses.concat(
      resultRecipient.data.tx_responses
    );

    commit("setAllTxs", finalTxs);
    commit("setAllTxsLoaded", true);
  },

  async getDelegations({ commit, state }, address) {
    const getDelegations = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/distribution/v1beta1/delegators/" +
        address +
        "/rewards"
    );
    const getUnDelegations = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/staking/v1beta1/delegators/" +
        address +
        "/unbonding_delegations"
    );
    const getRedelegations = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/staking/v1beta1/delegators/" +
        address +
        "/redelegations"
    );

    let foundMainDenom = getDelegations.data.total.find(
      (element) =>
        element.denom === cosmosConfig[state.chainId].coinLookup.chainDenom
    );
    if (typeof foundMainDenom === "undefined") {
      foundMainDenom = {
        denom: cosmosConfig[state.chainId].coinLookup.chainDenom,
        amount: "0",
      };
    }
    var copieRewards = [];

    const getValidatorInfo = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/staking/v1beta1/delegations/" +
        address
    );
    const getValidatorMainInfo = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/staking/v1beta1/validators?pagination.limit=200"
    );

    let totalDelegated = 0;
    await getDelegations.data.rewards.forEach(function (item) {
      let foundDelegByValidator =
        getValidatorInfo.data.delegation_responses.find(
          (element) =>
            element.delegation.validator_address === item.validator_address
        );
      let foundValidatorMainInfo = getValidatorMainInfo.data.validators.find(
        (element) => element.operator_address === item.validator_address
      );
      let foundUnDelegations = getUnDelegations.data.unbonding_responses.find(
        (element) => element.validator_address === item.validator_address
      );
      let foundRedelegations =
        getRedelegations.data.redelegation_responses.find(
          (element) =>
            element.redelegation.validator_src_address ===
            item.validator_address
        );

      if (typeof foundUnDelegations === "undefined") {
        foundUnDelegations = {
          denom: cosmosConfig[state.chainId].coinLookup.chainDenom,
          amount: "0",
        };
      } else {
        let totalUnDelegations = 0;
        for (let i = 0; i < foundUnDelegations.entries.length; i++) {
          totalUnDelegations += foundUnDelegations.entries[i].balance / 1000000;
        }
        foundUnDelegations = {
          denom: cosmosConfig[state.chainId].coinLookup.chainDenom,
          amount: totalUnDelegations,
        };
      }
      if (typeof foundRedelegations === "undefined") {
        foundRedelegations = {
          denom: cosmosConfig[state.chainId].coinLookup.chainDenom,
          amount: "0",
        };
      } else {
        foundRedelegations = {
          denom: cosmosConfig[state.chainId].coinLookup.chainDenom,
          amount: foundRedelegations.entries[0].balance / 1000000,
        };
      }

      let finalRewardAmount = 0;
      if (typeof item.reward[0]?.amount === "undefined") {
        finalRewardAmount = 0;
      } else {
        finalRewardAmount = (item.reward[0].amount / 1000000).toFixed(6);
      }

      copieRewards.push({
        validatorName: foundValidatorMainInfo?.description.moniker,
        op_address: foundDelegByValidator.delegation.validator_address,
        reward: finalRewardAmount,
        share: foundDelegByValidator.delegation.shares,
        delegated: foundDelegByValidator.balance.amount,
        unDelegations: foundUnDelegations,
        reDelegations: foundRedelegations,
        status: foundValidatorMainInfo?.status,
      });
      totalDelegated += Number(foundDelegByValidator.balance.amount);
    });

    const getUnbound = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/staking/v1beta1/delegators/" +
        address +
        "/unbonding_delegations"
    );
    let sumUnbonding = 0;
    for (let i = 0; i < getUnbound.data.unbonding_responses.length; i++) {
      let item = getUnbound.data.unbonding_responses[i];
      for (let j = 0; j < item.entries.length; j++) {
        sumUnbonding += Number(item.entries[j].balance);
      }
    }

    commit("setTotalUnbound", String(sumUnbonding));
    commit("setDelegations", copieRewards);
    commit("setRewards", foundMainDenom);
    commit("setTotalDelegated", String(totalDelegated));
    commit("setDelegationsLoaded", true);
    commit("setAllUnbonding", getUnDelegations.data.unbonding_responses);
    commit("setAllRedelegate", getRedelegations.data.redelegation_responses);
  },
  getAllBalances({ commit, state }) {
    var sum =
      parseFloat(state.balances) +
      parseFloat(state.rewards.amount) +
      parseFloat(state.totalUnbound) +
      parseFloat(state.totalDelegated);

    commit("setTotalWallet", (sum / 1000000).toFixed(6));
    commit(
      "setTotalWalletPrice",
      ((sum / 1000000) * state.priceNow).toFixed(4)
    );
  },
  async getSingleProposal({ commit, state }, proposalId) {
    const singleProposals = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/group/v1/proposal/" +
        proposalId
    );
    const allVotes = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/group/v1/votes_by_proposal/" +
        proposalId
    );
    const policyInfo = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/group/v1/group_policy_info/" +
        singleProposals.data.proposal.group_policy_address
    );
    const getAllUsersGroup = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/group/v1/group_members/" +
        policyInfo.data.info.group_id
    );

    allVotes.data.votes.forEach((item) => {
      let foundName = getAllUsersGroup.data.members.find(
        (element) => element.member.address === item.voter
      );

      item.name = foundName.member.metadata;
    });
 
    singleProposals.data.proposal.messages.forEach((item) => {

      switch (item["@type"]) {
        case "/cosmos.bank.v1beta1.MsgSend":
          item.typeReadable = "Send";
          item.finalAmount = item.amount[0].amount;
          break;
        case "/cosmos.staking.v1beta1.MsgDelegate":
          item.typeReadable = "Delegate";
          item.finalAmount = item.amount.amount;
          //finalAmount = item.tx.body.messages[0].amount.amount
          break;
        case "/cosmwasm.wasm.v1.MsgExecuteContract":
          item.typeReadable = "Wasm";
          item.finalAmount = "";
          //finalAmount = item.tx.body.messages[0].amount.amount
          break;
        case "/cosmos.staking.v1beta1.MsgCreateValidator":
          item.typeReadable = "Create validator";
          item.finalAmount = "";
          //finalAmount = item.tx.body.messages[0].amount.amount
          break;

        default:
          console.log(
            "Sorry, dont know " + item.tx.body.messages[0]["@type"] + "."
          );
      }
    });

    commit("setProposal", singleProposals.data.proposal);
    commit("setProposalAllVote", allVotes.data.votes);
  },

/*   async getSingleProposalVote({ state }, proposalId) {
    const allProposals = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/group/v1/votes_by_proposal/" +
        proposalId
    );
  }, */

  async getAllValidator({ commit, state }) {
    const allVal = await axios(
      cosmosConfig[state.chainId].apiURL + "/cosmos/staking/v1beta1/validators"
    );
    
    var randomizeEntries = allVal.data.validators.sort(() => Math.random() - 0.5) 
    commit("setAllValidators", randomizeEntries);
    commit("setValidatorsLoaded", true);
  },

  async formatFinalMsgProp({ commit, state }, data) {
    let saveMsgs = [];
    state.finalMsgProp.forEach((item) => {
      saveMsgs.push(item);
    });
    saveMsgs.push(data);

    commit("setFinalMsgProp", saveMsgs);
  },
  async resetFinalMsgProp({ commit }) {
    commit("setFinalMsgProp", []);
  },

  async getProposalParamsDeposit({ commit, state }) {
    const paramsDeposit = await axios(
      cosmosConfig[state.chainId].apiURL + "/cosmos/gov/v1beta1/params/deposit"
    );

    var duration = moment.duration(
      paramsDeposit.data.deposit_params.max_deposit_period.replace("s", ""),
      "seconds"
    );
    const days = duration.days();
    const hours = duration.hours();
    let saveParams = {
      min_deposit: (
        paramsDeposit.data.deposit_params.min_deposit[0].amount / 1000000
      ).toFixed(2),
      max_deposit_period: `${days} days, ${hours} hours`,
      max_deposit_seconde:
        paramsDeposit.data.deposit_params.max_deposit_period.replace("s", ""),
    };
    commit("setParamsDeposit", saveParams);
  },

  async getProposalParamsVoting({ commit, state }) {
    const paramsDeposit = await axios(
      cosmosConfig[state.chainId].apiURL + "/cosmos/gov/v1beta1/params/voting"
    );

    var duration = moment.duration(
      paramsDeposit.data.voting_params.voting_period.replace("s", ""),
      "seconds"
    ); 
    const hours = duration.hours();
    const minutes = duration.minutes();

    let saveParams = {
      voting_period: `${hours} hours, ${minutes} minutes`,
    };
    commit("setParamsVoting", saveParams);
  },

/*   async getProposalDeposits({ state }, idProposal) {
    // https://lcd-devnet-6.bitcanna.io/cosmos/gov/v1beta1/proposals/27/deposits
    const proposalDeposits = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/gov/v1beta1/proposals/" +
        idProposal +
        "/deposits"
    );

    // commit('setParamsVoting', saveParams)
  }, */

  async getChartProposalData({ commit, state }, proposalId) {
    const allProposals = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/group/v1/proposals/" +
        proposalId +
        "/tally"
    );

    const allData = {
      chartData: {
        labels: ["Abstain", "No with veto", "Yes", "No"],
        datasets: [
          {
            backgroundColor: ["#d8ff00", "#E46651", "#54d854", "#ce2525"],
            data: [
              allProposals.data.tally.abstain_count,
              allProposals.data.tally.no_with_veto_count,
              allProposals.data.tally.yes_count,
              allProposals.data.tally.no_count,
            ],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };

    commit("setChartProposalData", allData);
  },

  async getProposalQuorum({ commit, state }) {
    const allDelegations = await axios(
      cosmosConfig[state.chainId].apiURL + "/cosmos/staking/v1beta1/validators"
    );

    let totalBonded = 0;
    for (let i = 0; i < allDelegations.data.validators.length; i++) {
      const item = allDelegations.data.validators[i].tokens / 1000000;
      totalBonded += Number(item);
    }
    commit("setTotalBonded", totalBonded);
  },

  async getAllValidators({ commit, state }) {
    var copieValidators = [];
    const allValidators = await axios(
      cosmosConfig[state.chainId].apiURL + "/cosmos/staking/v1beta1/validators"
    );

    let totalBonded2 = 0;
    await allValidators.data.validators.forEach(async (item) => {
      totalBonded2 += Number(item.tokens);
    });
    await Promise.all(
      allValidators.data.validators.map(async (item) => {
        let upTime = 0;
        if (item.status === 'BOND_STATUS_BONDED') {
          upTime = 100;
        }
        copieValidators.push({
          name: item.description.moniker,
          op_address: item.operator_address,
          crate:
            (Number(item.commission.commission_rates.rate) * 100).toFixed(2),
          website: item.description.website,
          votingPower: ((item.tokens / totalBonded2) * 100).toFixed(2),
          status: item.status,
          uptime: upTime,
        });
      })
    );

    commit("setTotalBonded", totalBonded2);
    commit(
      "setValidators",
      copieValidators.sort(() => 0.5 - Math.random())
    );
    commit("setValidatorsLoaded", true);
  },
  async getValidatorDetails({ commit, state }, valAddr) {
    const validatorDetails = await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/staking/v1beta1/validators/" +
        valAddr
    );

    commit("setValidatorDetails", validatorDetails.data.validator);
  },
  async getValidatorDelegation({ commit, state }, data) {
    await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/staking/v1beta1/validators/" +
        data.validatorAddr +
        "/delegations/" +
        data.delegatorAddr
    )
      .then((res) => {
        commit(
          "setValidatorDelegations",
          res.data.delegation_response.balance.amount
        );
        return res.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getValidatorUnDelegations({ commit, state }, data) {
    await axios(
      cosmosConfig[state.chainId].apiURL +
        "/cosmos/staking/v1beta1/validators/" +
        data.validatorAddr +
        "/delegations/" +
        data.delegatorAddr + '/unbonding_delegation'
    )
      .then((res) => {
        let sumUndelegate = 0;
        for (let i = 0; i < res.data.unbond.entries.length; i++) {
          sumUndelegate += Number(res.data.unbond.entries[i].initial_balance);
        }
        commit(
          "setValidatorUnDelegations",
          sumUndelegate
        );
        return res.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },  
  changeChaniId({ commit }, chainId) {
    commit("setChainId", chainId);
  },
  resetSessionData({ commit }) {
    commit("resetSessionData");
  },
};
