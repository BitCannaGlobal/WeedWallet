import {
  SigningStargateClient,
  GasPrice
} from "@cosmjs/stargate";
import cosmosConfig from '../cosmos.config'


export async function selectSigner(chain, type) { 
  let accounts = ''
  let client = ''
  let chainId = cosmosConfig[chain].chainId;
  if (type === 'keplr') {
    // Keplr connect
    
    await window.keplr.enable(chainId);
    const offlineSigner = await window.getOfflineSignerAuto(chainId);
  
    accounts = await offlineSigner.getAccounts();

    client = await SigningStargateClient.connectWithSigner(
      cosmosConfig[chain].rpcURL,
      offlineSigner,
      {
        gasPrice: GasPrice.fromString(
          cosmosConfig[chain].gasPrice +
            cosmosConfig[chain].coinLookup.chainDenom
        ),
      }
    );
  } else if (type === 'cosmostation') {
    await window.cosmostation.providers.keplr.enable(chainId); 
    const offlineSigner =
      window.cosmostation.providers.keplr.getOfflineSigner(chainId);
 
    accounts = await offlineSigner.getAccounts();

    client = await SigningStargateClient.connectWithSigner(
      cosmosConfig[chain].rpcURL,
      offlineSigner,
      {
        gasPrice: GasPrice.fromString(
          cosmosConfig[chain].gasPrice +
            cosmosConfig[chain].coinLookup.chainDenom
        ),
      }
    );
  } else if (type === 'leap') {
    await window.leap.enable(chainId); 
    const offlineSigner =
      window.leap.getOfflineSigner(chainId);
 
    accounts = await offlineSigner.getAccounts();

    client = await SigningStargateClient.connectWithSigner(
      cosmosConfig[chain].rpcURL,
      offlineSigner,
      {
        gasPrice: GasPrice.fromString(
          cosmosConfig[chain].gasPrice +
            cosmosConfig[chain].coinLookup.chainDenom
        ),
      }
    );
  }

  return { client, accounts };
}

export async function calculFee(msg) { 
  // calcul Fee

  return { msg };
}