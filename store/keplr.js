// import cosmos from 'cosmos-lib'
import cosmosConfig from '~/cosmos.config'
import { connectKeplrSuggest } from '~/libs/keplrAuth'

export const state = () => ({
  accounts: [],
  initialized: false,
  error: undefined,
  loading: false,
  logged: false,
})

export const mutations = {
  setAccounts(state, accounts) {
    state.accounts = []
    state.accounts.push({
      id: accounts.id,
      walletName: accounts.walletName,
      address: accounts.data[0].address,
      pubkey: accounts.pubkey
    })
    //console.log(state.accounts)
    //console.log(state.accounts)
    //state.accounts = accounts
  },
  setInitialized(state) {
    state.initialized = true
  },
  setError(state, error) {
    state.error = error
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setLogged(state, status) {
    state.logged = true
  },
  setLogout(state, loading) {
    state.accounts = [],
    state.initialized = false,
    state.error = undefined,
    state.loading = false,
    state.logged = false
  },
}

export const actions = {
  async logout({
    commit,
    dispatch
  }, trys = 0) {
    commit('setLogout')
  },
  async checkLogin({
    commit,
    state
  }, trys = 0) {
    /*console.log(state.accounts.length)
    if (state.accounts.length !== 0) {
      // commit('setLogged', 'true')
    } else {
      commit('setLogged', 'false')
    }
    console.log(state.logged)*/
  },
  async changeKeplrAccount({
    commit,
    dispatch
  }, trys = 0) {
    window.addEventListener('keplr_keystorechange', () => loadEdit(this), false)
    async function loadEdit(store) {
      const chainId = cosmosConfig[0].chainId
      await window.keplr.enable(chainId)
      const offlineSigner = window.getOfflineSigner(chainId)
      const account = await offlineSigner.getAccounts()

      commit('setAccounts', {id: cosmosConfig[0].name, data: account})
      return account
    }
  },
  async connectWallet({
    commit,
    dispatch
  }, chainId) {
      var returnAcount = await connectKeplrSuggest(chainId.key1)
      console.log( returnAcount);
      commit('setAccounts', {
          id: chainId.key1.name,
          walletName: returnAcount.getKey.name,
          data: returnAcount.accounts,
          pubkey: returnAcount.accounts[0].pubkey
      })
      commit('setInitialized')
      commit('setLogged')

  },
}
