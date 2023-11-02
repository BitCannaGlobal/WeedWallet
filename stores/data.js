import { defineStore } from 'pinia' 
import { getData, setData, removeItem } from 'nuxt-storage/local-storage';
import axios from "axios";
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client, Tendermint37Client } from "@cosmjs/tendermint-rpc";  
import Long from "long";
import cosmosConfig from '~/cosmos.config'

import * as bank from "cosmjs-types/cosmos/bank/v1beta1/query"; 
import * as staking from "cosmjs-types/cosmos/staking/v1beta1/query";
import * as distrib from "cosmjs-types/cosmos/distribution/v1beta1/query";
import * as feegrant from "cosmjs-types/cosmos/feegrant/v1beta1/query";
// Gov part
import * as govV1beta1 from "cosmjs-types/cosmos/gov/v1beta1/query";
import * as govV1 from "cosmjs-types/cosmos/gov/v1/query";

export const useAppStore = defineStore('app', {
  state: () => ({ 
    ibcVersion: '',
    sdkVersion: '',
    logged: false,
    loggedType: '',
    chainSelected: 0,
    addrWallet: '',
    nameWallet: '',
    rpcClient: null,
    rpcBase: null,
    spendableBalances: 0,
    totalDelegations: 0,
    totalUnbound: 0,
    totalRewards: 0,
    totalTokens: 0,
    totalSupply: 0,
    priceNow: "",
    aprNow: 0,
    fiatWalletValue: 0,
    myFeeAllowances: [],
    formFeeGranter: '',
    myFeeGrants: [],
    allValidators: [],
    allValidatorsOffline: [],
    allProposals: [],
    allMyDelegations: '',
    validatorDetails: '',
    validatorRewards: '',
    validatorDelegations: '',
    validatorUnDelegations: '',
    myAddressBook: [],
  }),
  actions: {
    async refresh() {
      await this.initRpc()
      await this.getSdkVersion()
      await this.getPriceNow()
      await this.getApr()
      await this.getBankModule()
      await this.getStakingModule()
      await this.getDistribModule()
      await this.getFeeGrantModule()
      await this.getWalletAmount()
      await this.getGovModule()
      await this.getDelegations()
      await this.getAddressBook()
    },
    setChainId(chainId) {
      this.chainSelected = chainId
    },
    async initRpc() {      
      if(this.rpcClient) {
        this.rpcBase.disconnect();
      } 
      const client = await Tendermint37Client.connect(cosmosConfig[this.chainSelected].rpcURL) 
      const queryClient = new QueryClient(client);
      const rpcClient = createProtobufRpcClient(queryClient);
      this.rpcClient = rpcClient
      this.rpcBase = client 
    },  
    async getSdkVersion() {
      const getSdk = await axios(
        cosmosConfig[this.chainSelected].apiURL +
          "/cosmos/base/tendermint/v1beta1/node_info"
      );
      for (let i of getSdk.data.application_version.build_deps) {
        let position = i.path.search("ibc-go");
        if (position !== -1) {
          this.ibcVersion = i.version
        }        
      } 
      this.sdkVersion = getSdk.data.application_version.cosmos_sdk_version
    },
    async getPriceNow() {
      const getPrice = await axios("https://bcnaracle.bitcanna.io/bcnaracle.json");
      this.priceNow = getPrice.data.bitcanna.usd
      // commit("setPriceNow", getPrice.data.bitcanna.usd.toFixed(5));
    },
    async getApr( ) {
      const totalSupply = await axios(
        cosmosConfig[this.chainSelected].apiURL + "/cosmos/bank/v1beta1/supply"
      );
      const inflation = await axios(
        cosmosConfig[this.chainSelected].apiURL + "/cosmos/mint/v1beta1/inflation"
      );
      const finalTotalBounded = await axios(
        cosmosConfig[this.chainSelected].apiURL + "/cosmos/staking/v1beta1/pool"
      );
  
      let foundSupply = totalSupply.data.supply.find(
        (element) =>
          element.denom === cosmosConfig[this.chainSelected].coinLookup.chainDenom
      );
      let finalApr = (
        ((foundSupply.amount * inflation.data.inflation) / finalTotalBounded.data.pool.bonded_tokens) *
        100
      ).toFixed(1);
  
      console.log('finalApr', finalApr)
      this.aprNow = finalApr 
    },
    async getWalletAmount() {
      let totalToken = 
        Number(this.spendableBalances) + 
        Number(this.totalDelegations) + 
        Number(this.totalUnbound) + 
        Number(this.totalRewards)

      this.totalTokens = (totalToken).toFixed(4)
      this.fiatWalletValue = (totalToken * this.priceNow).toFixed(4)
    },
    async getBankModule() {
      const queryBank = new bank.QueryClientImpl(this.rpcClient); 
      let spendableBalances = await queryBank.SpendableBalances({ address: this.addrWallet });
      let allBalances = await queryBank.AllBalances({ address: this.addrWallet });

      const found = spendableBalances.balances.find(element => element.denom === cosmosConfig[this.chainSelected].coinLookup.chainDenom);
      // TODO: fix this
      let returnValue = ''
      if ( found?.amount > 0){
        returnValue = found?.amount / 1000000
      } else {
        returnValue = 0
      }

      let totalSupply = await queryBank.SupplyOf({ denom: cosmosConfig[this.chainSelected].coinLookup.chainDenom }) 
      this.spendableBalances = returnValue 
      this.totalSupply = totalSupply.amount.amount 

      
      // this.totalSupplyPrice = ((totalSupply.amount.amount / 1000000) * this.chainSelectedPrice) 
    },
    async getStakingModule() {    
      const queryStaking = new staking.QueryClientImpl(this.rpcClient);
      let getPoolStaking = await queryStaking.Pool({ });  
      let allValidators = await queryStaking.Validators({ status: 'BOND_STATUS_BONDED' }); 
      let allValidatorsOffline = await queryStaking.Validators({ status: 'BOND_STATUS_UNBONDED' }); 
      let delegatorValidators = await queryStaking.DelegatorDelegations({ delegatorAddr: this.addrWallet, pagination: {
        countTotal: false,
        key: '',
        offset: Long.fromNumber(0, true),
        limit: Long.fromNumber(200, true),
        reverse: false,
      }}); 

      let total = 0;  
      let allUnbound = await queryStaking.DelegatorUnbondingDelegations({ delegatorAddr: this.addrWallet });       
      let totalUnbound = 0;

      for (let i of delegatorValidators.delegationResponses) { 
        total += Number(i.balance.amount);
      }   
      if (allUnbound.unbondingResponses.length > 0) {   
        for (let i of allUnbound.unbondingResponses) {
          for (let j of i.entries) {
            totalUnbound += Number(j.balance)
          }
        }   
      } else {
        totalUnbound = 0.00
      }

      // Detail of validators
      let copieValidators = [];
      allValidators.validators.map(async (item) => {
        let upTime = 0;
        if (item.status === 'BOND_STATUS_BONDED') {
          upTime = 100;
        }

        console.log(item.commission.commissionRates.rate / 10000000000000000)

        const rewardFactor = 1 - (item.commission.commissionRates.rate / 10000000000000000)
        const finalApr = this.aprNow * rewardFactor
        copieValidators.push({
          name: item.description.moniker,
          op_address: item.operatorAddress,
          crate:
            (Number(item.commission.commissionRates.rate / 10000000000000000)).toFixed(2),
          website: item.description.website,
          votingPower: ((item.tokens / getPoolStaking.pool.bondedTokens) * 100).toFixed(2),
          status: item.status,
          uptime: upTime,
          validatorApr: finalApr.toFixed(2)
        });

      });

      //console.log('poolStaking', getPoolStaking.pool.bondedTokens)
 
      this.totalDelegations = (total / 1000000).toFixed(2)
      this.totalUnbound = (totalUnbound / 1000000).toFixed(2)
      this.poolStaking = getPoolStaking.pool
      this.allValidators = copieValidators
      this.allValidatorsOffline = allValidatorsOffline.validators

      //this.allMyDelegations = delegatorValidators.delegationResponses
    }, 
    async getDistribModule() { 
      const queryDistrib = new distrib.QueryClientImpl(this.rpcClient);
      const queryDistribResult = await queryDistrib.DelegationTotalRewards({ delegatorAddress: this.addrWallet }); 
      const found = queryDistribResult.total.find(element => element.denom === cosmosConfig[this.chainSelected].coinLookup.chainDenom);
      let returnValue = ''
      if ( queryDistribResult.total.length > 0){
        returnValue = Number(found.amount / 1000000000000000000000000).toFixed(6)
      } else {
        returnValue = 0
      }
 
      
      let oldValue = this.totalRewards
      this.totalMyValidators = queryDistribResult.rewards.length
      this.totalDelegationsRewards = queryDistribResult.rewards
      this.totalRewards = returnValue

    }, 
    async getFeeGrantModule() { 
      const queryFeegrant = new feegrant.QueryClientImpl(this.rpcClient);      
      const queryFeegrantResult = await queryFeegrant.Allowances({ grantee: this.addrWallet }); 
      const queryAllowancesByGranterResult = await queryFeegrant.AllowancesByGranter({ granter: this.addrWallet });  
      this.myFeeAllowances = queryFeegrantResult.allowances 
      this.myFeeGrants = queryAllowancesByGranterResult.allowances 

      let finalGranter = []
      for (let i = 0; i < this.myFeeAllowances.length; i++) {
        
        finalGranter[i] = this.myFeeAllowances[i].granter    
      } 
      this.formFeeGranter = finalGranter
    }, 
    async getGovModule() { 
      let finalGov = govV1beta1
      if(this.sdkVersion.substring(0,5) === 'v0.47') {        
        finalGov = govV1
      }
      
      const queryGov = new finalGov.QueryClientImpl(this.rpcClient);      
      const queryGovResult = await queryGov.Proposals({ proposalStatus: 0, voter: '', depositor: '' });  

      this.allProposals = queryGovResult
    }, 
    async getValidatorDetail(address) { 
      const queryValidator = new staking.QueryClientImpl(this.rpcClient);
       
      let finalValidator = await queryValidator.Validator({ validatorAddr: address })
      this.validatorDetails = finalValidator.validator
    }, 
    async getValidatorDelegator(data) {
      // validatorRewards 
      await axios(
        // /cosmos/distribution/v1beta1/delegators/bcna13jawsn574rf3f0u5rhu7e8n6sayx5gkwgusz73/rewards/bcnavaloper1zvxldjgetj5u9wah0t8fnz229533xzsmm645gy
        cosmosConfig[this.chainSelected].apiURL +
          "/cosmos/distribution/v1beta1/delegators/" +
          data.delegatorAddr +
          "/rewards/" +
          data.validatorAddr
      )
        .then((res) => {
          this.validatorRewards = (res.data.rewards[0].amount / 1000000).toFixed(6) 
        })
        .catch((error) => { 
          this.validatorRewards = 0
        });

        // validatorDelegations
        await axios(
          cosmosConfig[this.chainSelected].apiURL +
            "/cosmos/staking/v1beta1/validators/" +
            data.validatorAddr +
            "/delegations/" +
            data.delegatorAddr
        )
          .then((res) => {
            this.validatorDelegations = res.data.delegation_response.balance.amount
          })
          .catch((error) => { 
            this.validatorDelegations = 0 
          });
        // validatorUnDelegations
        await axios(
          cosmosConfig[this.chainSelected].apiURL +
            "/cosmos/staking/v1beta1/validators/" +
            data.validatorAddr +
            "/delegations/" +
            data.delegatorAddr +
            "/unbonding_delegation"
        )
          .then((res) => {
            this.validatorUnDelegations = res.data.delegation_response.balance.amount
          })
          .catch((error) => { 
            this.validatorUnDelegations = 0 
          });         
    },
    async getDelegations() {
      const getDelegations = await axios(
        cosmosConfig[this.chainSelected].apiURL +
          "/cosmos/distribution/v1beta1/delegators/" +
          this.addrWallet +
          "/rewards"
      );
      const getUnDelegations = await axios(
        cosmosConfig[this.chainSelected].apiURL +
          "/cosmos/staking/v1beta1/delegators/" +
          this.addrWallet +
          "/unbonding_delegations"
      );
      const getRedelegations = await axios(
        cosmosConfig[this.chainSelected].apiURL +
          "/cosmos/staking/v1beta1/delegators/" +
          this.addrWallet +
          "/redelegations"
      );
  
      let foundMainDenom = getDelegations.data.total.find(
        (element) =>
          element.denom === cosmosConfig[this.chainSelected].coinLookup.chainDenom
      );
      if (typeof foundMainDenom === "undefined") {
        foundMainDenom = {
          denom: cosmosConfig[this.chainSelected].coinLookup.chainDenom,
          amount: "0",
        };
      }
      var copieRewards = [];
  
      const getValidatorInfo = await axios(
        cosmosConfig[this.chainSelected].apiURL +
          "/cosmos/staking/v1beta1/delegations/" +
          this.addrWallet
      );
      const getValidatorMainInfo = await axios(
        cosmosConfig[this.chainSelected].apiURL +
          "/cosmos/staking/v1beta1/validators?pagination.limit=250"
      );
  
      let totalDelegated = 0;
      let totalBonded2 = 0;
      const allValidators = await axios(
        cosmosConfig[this.chainSelected].apiURL + "/cosmos/staking/v1beta1/validators?pagination.limit=250"
      );
      await allValidators.data.validators.forEach(async (item) => {
        totalBonded2 += Number(item.tokens);
      });


      let finalChainSelected = this.chainSelected
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
            denom: cosmosConfig[finalChainSelected].coinLookup.chainDenom,
            amount: "0",
          };
        } else {
          let totalUnDelegations = 0;
          for (let i = 0; i < foundUnDelegations.entries.length; i++) {
            totalUnDelegations += foundUnDelegations.entries[i].balance / 1000000;
          }
          foundUnDelegations = {
            denom: cosmosConfig[finalChainSelected].coinLookup.chainDenom,
            amount: totalUnDelegations,
          };
        }
        if (typeof foundRedelegations === "undefined") {
          foundRedelegations = {
            denom: cosmosConfig[finalChainSelected].coinLookup.chainDenom,
            amount: "0",
          };
        } else {
          foundRedelegations = {
            denom: cosmosConfig[finalChainSelected].coinLookup.chainDenom,
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
          commission: (foundValidatorMainInfo?.commission.commission_rates.rate * 100).toFixed(2),
          votingPower: ((foundValidatorMainInfo?.tokens / totalBonded2) * 100).toFixed(2), 
        });
        totalDelegated += Number(foundDelegByValidator.balance.amount);
      });
  
      const getUnbound = await axios(
        cosmosConfig[this.chainSelected].apiURL +
          "/cosmos/staking/v1beta1/delegators/" +
          this.addrWallet +
          "/unbonding_delegations"
      );
      let sumUnbonding = 0;
      for (let i = 0; i < getUnbound.data.unbonding_responses.length; i++) {
        let item = getUnbound.data.unbonding_responses[i];
        for (let j = 0; j < item.entries.length; j++) {
          sumUnbonding += Number(item.entries[j].balance);
        }
      }
   
      this.allMyDelegations = copieRewards
      /* commit("setTotalUnbound", String(sumUnbonding));
      commit("setDelegations", copieRewards);
      commit("setRewards", foundMainDenom);
      commit("setTotalDelegated", String(totalDelegated));
      commit("setDelegationsLoaded", true);
      commit("setAllUnbonding", getUnDelegations.data.unbonding_responses);
      commit("setAllRedelegate", getRedelegations.data.redelegation_responses); */
    },
    async getAddressBook() {
      let myAddressBook = getData('bcnaAddressBook') 
      this.myAddressBook = myAddressBook
      console.log('myAddressBook', this.myAddressBook)
    },
    async addressBook(typeAction, data) {
      if (typeAction === 'addContact') {
        let getBookMark = getData('bcnaAddressBook') 
        if (getBookMark === null) {
          getBookMark = []
        }
        getBookMark.push(data)
        console.log('getBookMark', getBookMark)
        setData('bcnaAddressBook', getBookMark, 730, 'd')    
      } 

      /* setData('test', 'test1');
      console.log(getData('test')) */
    },
    async logout() {
      this.logged = false
      this.addrWallet = ''
      this.nameWallet = ''
      this.spendableBalances = 0
      this.totalUnbound = 0
      this.totalRewards = 0
      this.totalDelegations = 0
    },
    async keplrConnect() {
      if (!window.keplr) {
        alert("Please install keplr extension");
      } else {
        await window.keplr.experimentalSuggestChain({
          chainId: cosmosConfig[this.chainSelected].chainId,
          chainName: cosmosConfig[this.chainSelected].name,
          rpc: cosmosConfig[this.chainSelected].rpcURL,
          rest: cosmosConfig[this.chainSelected].apiURL,
          bip44: {
            coinType: 118,
          },
          bech32Config: {
            bech32PrefixAccAddr: cosmosConfig[this.chainSelected].coinLookup.addressPrefix,
            bech32PrefixAccPub: cosmosConfig[this.chainSelected].coinLookup.addressPrefix + "pub",
            bech32PrefixValAddr: cosmosConfig[this.chainSelected].coinLookup.addressPrefix + "valoper",
            bech32PrefixValPub: cosmosConfig[this.chainSelected].coinLookup.addressPrefix + "valoperpub",
            bech32PrefixConsAddr: cosmosConfig[this.chainSelected].coinLookup.addressPrefix + "valcons",
            bech32PrefixConsPub: cosmosConfig[this.chainSelected].coinLookup.addressPrefix + "valconspub",
          },
          currencies: [
            {
              coinDenom: cosmosConfig[this.chainSelected].coinLookup.viewDenom,
              coinMinimalDenom: cosmosConfig[this.chainSelected].coinLookup.chainDenom,
              coinDecimals: 6,
              coinGeckoId: cosmosConfig[this.chainSelected].coingeckoId,
            },
          ],
          feeCurrencies: [
            {
              coinDenom: cosmosConfig[this.chainSelected].coinLookup.viewDenom,
              coinMinimalDenom: cosmosConfig[this.chainSelected].coinLookup.chainDenom,
              coinDecimals: 6,
              coinGeckoId: cosmosConfig[this.chainSelected].coingeckoId,
              gasPriceStep: {
                low: 0.001,
                average: 0.0025,
                high: 0.01
              },
            },
          ],
          stakeCurrency: {
            coinDenom: cosmosConfig[this.chainSelected].coinLookup.viewDenom,
            coinMinimalDenom: cosmosConfig[this.chainSelected].coinLookup.chainDenom,
            coinDecimals: 6,
            coinGeckoId: cosmosConfig[this.chainSelected].coingeckoId,
          },
      })
        let chainId = cosmosConfig[this.chainSelected].chainId
    
        await window.keplr.enable(chainId);
        const offlineSigner = await window.getOfflineSignerAuto(chainId);
        const accounts = await offlineSigner.getAccounts();
        const getKey = await window.keplr.getKey(chainId);
        this.addrWallet = accounts[0].address
        this.nameWallet = getKey.name
        this.logged = true
        this.loggedType = 'keplr'
        //console.log('addr: '+accounts[0].address)
        /* commit('setAddrWallet', accounts[0].address)
        commit('setNameWallet', getKey.name)
        dispatch('getAccountData') */

        this.setLocalLogin(chainId, this.nameWallet, this.addrWallet, 'keplr')
      }
    },
    async cosmoStationConnect() { 
        if (!window.cosmostation) {
          alert("Please install cosmostation extension");
        } else {
          const chainId = cosmosConfig[this.chainSelected].chainId
       
          await window.cosmostation.providers.keplr.enable(chainId);
       
          const offlineSigner =
            window.cosmostation.providers.keplr.getOfflineSigner(chainId);
       
          const accounts = await offlineSigner.getAccounts();
          const getKey = await  window.cosmostation.providers.keplr.getKey(chainId); 

          this.addrWallet = accounts[0].address
          this.nameWallet = getKey.name
          this.logged = true
          this.loggedType = 'cosmostation'
          this.setLocalLogin(chainId, this.nameWallet, this.addrWallet, 'cosmostation')
        } 
        
    },
    async leapConnect() { 
      if (!window.leap) {
        alert("Please install leap extension");
      } else {
        const chainId = cosmosConfig[this.chainSelected].chainId
     
        await window.leap.enable(chainId);

        const offlineSigner = window.leap.getOfflineSigner(chainId); 
        const accounts = await offlineSigner.getAccounts(); 
        const getKey = await window.leap.getKey(chainId); 

        this.addrWallet = accounts[0].address
        this.nameWallet = getKey.name
        this.logged = true
        this.loggedType = 'leap'
        this.setLocalLogin(chainId, this.nameWallet, this.addrWallet, 'leap')
      } 
      
    },
    async setLocalLogin(chainId, name, address, type) {
      let id = 0
      if (chainId === 'bitcanna-1') {
        id = 1
      }
      setData(
        "account",
        {
          id: id,
          walletName: name,
          data: address,
          type: type
        },
        1000,
        "d"
      );
    },
    async removeLocalLogin() {
      removeItem("account");
    },
    async checkLogin() { 
      let getSession = getData('account') 
      if (getSession) { 
        console.log(getSession)
        this.chainSelected = getSession.id
        this.addrWallet = getSession.data
        this.nameWallet = getSession.walletName
        this.loggedType = getSession.type
        this.logged = true
        //commit("setAccounts", getSession);
        //commit("setLogged", "true");
      } else {
        console.log("No session!");
      }
    },
  },

})