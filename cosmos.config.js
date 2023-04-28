export default [
 /* {
    chainId: 'bitcanna-dev-6',
    name: 'Bitcanna-testnet',
    desc: 'Bitcanna-testnet',
    apiURL: 'https://lcd-devnet-6.bitcanna.io',
    rpcURL: 'https://rpc-devnet-6.bitcanna.io',
    coinLookup: {
      viewDenom: 'BCNA',
      chainDenom: 'ubcna',
      addressPrefix: 'bcna',
      icon: `https://raw.githubusercontent.com/cosmos/chain-registry/master/bitcanna/images/bcna.svg`,
    },
    feeMultiplier: 1.3,
    gasPrice: 0.025,
    coingeckoId: 'bitcanna',
    nftContract: 'stars1cpzvvmlrc9lcw3q5yrznax0uk5h6xww2d4ch9xve4xu8mfvgw2kqepnwd2',
    sg721: 'stars1w4dff5myjyzymk8tkpjrzj6gnv352hcdpt2dszweqnff927a9xmqc7e0gv'
  },*/
  {
    chainId: 'bitcanna-dev-1',
    name: 'Bitcanna-testnet-1',
    desc: 'Bitcanna-testnet',
    apiURL: 'https://lcd-testnet.bitcanna.io',
    rpcURL: 'https://rpc-testnet.bitcanna.io',
    coinLookup: {
      viewDenom: 'BCNA',
      chainDenom: 'ubcna',
      addressPrefix: 'bcna',
      icon: `https://raw.githubusercontent.com/cosmos/chain-registry/master/bitcanna/images/bcna.svg`,
    },
    feeMultiplier: 1.3,
    gasPrice: 0.025,    
    coingeckoId: 'bitcanna',
    maxTxSender: 20,
    maxTxRecipient: 20,
  },
]
