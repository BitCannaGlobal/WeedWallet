import axios from "axios";

export default defineEventHandler(async (event) => {
  const addr = getRouterParam(event, 'addr')

  const getMyNft = await axios.get(
    "https://nft-api.stargaze-apis.com/api/v1beta/profile/" +
      addr +
      "/nfts"
    ); 
  return {
    getMyNft: getMyNft.data
  }
})
