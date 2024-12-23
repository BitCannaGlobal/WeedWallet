export default [
  {
    chainId: 'bitcanna-dev-6',
    name: 'Bitcanna-testnet',
    slot: "Bitcanna-testnet",
    desc: '',
    apiURL: 'https://lcd-devnet-6.bitcanna.io',
    rpcURL: 'https://rpc-devnet-6.bitcanna.io',
    coinLookup: {
      viewDenom: 'BCNA',
      chainDenom: 'ubcna',
      addressPrefix: 'bcna',
      icon: `https://raw.githubusercontent.com/cosmos/chain-registry/master/bitcanna/images/bcna.svg`,
      banner: "https://pbs.twimg.com/profile_banners/602625556/1649007099/1500x500",
    },
    explorerUrl: 'https://explorer-devnet-6.bitcanna.io/bitcanna-dev6/tx/',
    coingeckoId: 'bitcanna',
    feeMultiplier: 1.9,
    gasPrice: 0.0025,
    maxTxSenderHome: 5,
    maxTxRecipientHome: 5,
    maxTxSender: 50,
    maxTxRecipient: 50,
    color: '#33ffc9',
    colorChart: ["#b3ffeb", "#33ffc9", "#00b383", "#004d38"], 
    modules: {
      feeGrant: true,
      authz: true,
      wasm: false,
      group: true,
    }
  },
  {
    chainId: 'bitcanna-dev-1',
    name: 'BitCanna testnet',
    desc: 'Harnessing the power of blockchain to create equal opportunities for cannabis-related industries ',
    slot: "bitcanna",
    apiURL: 'https://lcd-testnet.bitcanna.io',
    rpcURL: 'https://rpc-testnet.bitcanna.io',
    coinLookup: {
      viewDenom: 'BCNA',
      chainDenom: 'ubcna',
      addressPrefix: 'bcna',
      icon: `https://raw.githubusercontent.com/cosmos/chain-registry/master/bitcanna/images/bcna.svg`,
      banner: "https://pbs.twimg.com/profile_banners/602625556/1649007099/1500x500",
    },
    explorerUrl: 'https://explorer-devnet-6.bitcanna.io/bitcanna-dev1/tx/',
    coingeckoId: 'bitcanna',
    feeMultiplier: 1.9,
    gasPrice: 0.0025,
    maxTxSenderHome: 5,
    maxTxRecipientHome: 5,
    maxTxSender: 50,
    maxTxRecipient: 50,
    color: '#33ffc9',
    colorChart: ["#b3ffeb", "#33ffc9", "#00b383", "#004d38"],
    modules: {
      feeGrant: true,
      authz: true,
      wasm: false,
      group: true,
    }
  },
  {
    chainId: 'bitcanna-1',
    name: 'BitCanna',
    desc: 'Harnessing the power of blockchain to create equal opportunities for cannabis-related industries ',
    slot: "bitcanna",
    apiURL: 'https://lcd.bitcanna.io',
    rpcURL: 'https://rpc.bitcanna.io',
    coinLookup: {
      viewDenom: 'BCNA',
      chainDenom: 'ubcna',
      addressPrefix: 'bcna',
      icon: `https://raw.githubusercontent.com/cosmos/chain-registry/master/bitcanna/images/bcna.svg`,
      banner: "https://pbs.twimg.com/profile_banners/602625556/1649007099/1500x500",
    },
    explorerUrl: 'https://explorer.bitcanna.io/transactions/',
    coingeckoId: 'bitcanna',
    feeMultiplier: 1.9,
    gasPrice: 0.0025,
    maxTxSenderHome: 5,
    maxTxRecipientHome: 5,
    maxTxSender: 50,
    maxTxRecipient: 50,
    color: '#33ffc9',
    colorChart: ["#b3ffeb", "#33ffc9", "#00b383", "#004d38"],
    modules: {
      feeGrant: true,
      authz: true,
      wasm: false,
      group: true,
    }
  },  
]
