  import axios from "axios";

export default defineEventHandler(async (event) => { 
  const finalData =  await axios
    .post("https://graphql.mainnet.stargaze-apis.com/graphql", {
      query:
        "query ExampleQuery($address: String!) { collection(address: $address) { contractAddress stats { bestOffer numOwners } name floorPrice } }",
      variables: {
        address:
          "stars1w4dff5myjyzymk8tkpjrzj6gnv352hcdpt2dszweqnff927a9xmqc7e0gv",
      },
    }) 
  return {
    finalData: finalData.data
  }
})
 