<template>
  <div class="">
    <v-row>
      <v-col cols="12">
        <sequential-entrance>
          <v-row justify="space-around">
            <v-col class="text-h6 text-md-h5 text-lg-h4">
              Buddhead NFT Collection
            </v-col>
            <v-col />
          </v-row>
        </sequential-entrance>






        <sequential-entrance>
          <v-row justify="space-around">
            <v-col>
              <v-card class="accent">
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      md="3"
                    > 
                      <v-avatar
                        color="#BABE5B"
                        size="56"
                      />
                    </v-col>
                    <v-col
                      cols="7" 
                    > 
                      <h4>
                        Floor Price
                      </h4>
                      <div v-if="collectionDataLoaded">
                        <h2>
                          {{
                            collectionData.data?.collection.floorPrice / 1000000
                          }}      
                          STARS
                        </h2>           
                      </div> 
                      <v-progress-circular
                        v-else
                        indeterminate
                        color="#00b786"
                      />   
                    </v-col>
                  </v-row>           
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="accent"> 
                <v-card-text>                  
                  <v-row>
                    <v-col
                      cols="12"
                      md="3"
                    > 
                      <v-avatar
                        color="#BABE5B"
                        size="56"
                      />
                    </v-col>
                    <v-col
                      cols="7" 
                    > 
                      <h4>
                        Best Offer
                      </h4>
                      <div v-if="collectionDataLoaded">
                        <h2>
                          {{
                            collectionData.data?.collection.stats.bestOffer / 1000000
                          }}      
                          STARS   
                        </h2>           
                      </div> 
                      <v-progress-circular
                        v-else
                        indeterminate
                        color="#00b786"
                      />   
                    </v-col>
                  </v-row>  
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="accent">
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      md="3"
                    > 
                      <v-avatar
                        color="#BABE5B"
                        size="56"
                      />
                    </v-col>
                    <v-col
                      cols="7" 
                    > 
                      <h4>
                        Tokens Alive
                      </h4>
                      <div v-if="collectionDataLoaded">
                        <h2>
                          {{ collectionData.data?.collection.numTokensAlive }} Buddhead   
                        </h2>           
                      </div> 
                      <v-progress-circular
                        v-else
                        indeterminate
                        color="#00b786"
                      />   
                    </v-col>
                  </v-row>  
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="accent">
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      md="3"
                    > 
                      <v-avatar
                        color="#BABE5B"
                        size="56"
                      />
                    </v-col>
                    <v-col
                      cols="7" 
                    > 
                      <h4>
                        Tokens For Sale
                      </h4>
                      <div v-if="collectionDataLoaded">
                        <h2>
                          {{
                            collectionData.data?.collection.numTokensForSale
                          }}
                          Buddhead  
                        </h2>           
                      </div> 
                      <v-progress-circular
                        v-else
                        indeterminate
                        color="#00b786"
                      />   
                    </v-col>
                  </v-row>  
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </sequential-entrance>
      </v-col>
    </v-row>

    <sequential-entrance>
      <v-row justify="space-around">
        <v-col class="text-h6 text-md-h5 text-lg-h4">
          Buddhead
        </v-col>
        <v-col />
      </v-row>
    </sequential-entrance>

    <sequential-entrance>
      <!--<h1>Buddhead collection</h1>-->
      <div
        v-for="index in myNft"
        :key="index.id"
        class="mt-4 mr-4 pa-4 card"
      >
        <v-skeleton-loader
          v-if="loading"
          :loading="loading"
          class="mx-auto"
          max-width="300"
          height="500"
          type="image"
        />
        <!-- Image à la une -->
        <div class="card-image">
          <img :src="index.url">
        </div>
        <!-- Fin de l'image à la une -->
        <!-- Corp de notre carte -->
        <div class="card-body">
          <!-- Date de publication de l'article-->
          Buddhead #{{ index.id }}
          <!-- Titre de l'article -->
          <div class="card-title" />
          <!-- Extrait de l'article -->
          <div class="card-excerpt">
            <br>
            <v-btn
              color="#00b786"
              :to="'/nfts/' + index.id"
              block
              x-large
            >
              Details
            </v-btn>
          </div>
        </div>
      </div>
    </sequential-entrance>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import bech32 from "bech32";
import cosmosConfig from "~/cosmos.config";

export default {
  name: `AppHeader`,
  data: () => ({
    isOpen: false,
    desktop: false,
    myNft: [],
    myNftDisplay: "",
    collectionUrl:
      "https://app.stargaze.zone/launchpad/stars1cpzvvmlrc9lcw3q5yrznax0uk5h6xww2d4ch9xve4xu8mfvgw2kqepnwd2",
    collectionData: "",
    collectionDataLoaded: false,
    loading: true,
  }),
  computed: {
    ...mapState("keplr", [`accounts`, "logged"]),
  },
  async beforeMount() {
    this.watchWindowSize();
    window.onresize = this.watchWindowSize;
    if (this.accounts[0].address) {
      const decode = bech32.decode(this.accounts[0].address);
      const starsAddr = await bech32.encode("stars", decode.words);
      const getMyNft = await axios.get(
        "https://nft-api.stargaze-apis.com/api/v1beta/profile/" +
          starsAddr +
          "/nfts"
      );
      const myNft = this.myNft;
      getMyNft.data.forEach(function (item) {
        if (
          item.collection.contractAddress ===
          "stars1w4dff5myjyzymk8tkpjrzj6gnv352hcdpt2dszweqnff927a9xmqc7e0gv"
        ) {
          myNft.push({
            url:
              "https://bafybeia45l2eflxa4xx7ii6mhekyhh5xnucudj5tzp2upzcoeqfl4uzdr4.ipfs.nftstorage.link/images/" +
              item.tokenId +
              ".png",
            id: item.tokenId,
            stargazeUrl:
              "https://app.stargaze.zone/media/" +
              cosmosConfig[0].sg721 +
              "/" +
              item.tokenId,
          });
        }
      });
    }
    this.loading = false;

    let finalData = [];
    await axios
      .post("https://graphql.stargaze-apis.com/", {
        query:
          "query ExampleQuery($address: String!) { collection(address: $address) { contractAddress stats { bestOffer numOwners } numTokensForSale numTokensAlive name floorPrice } }",
        variables: {
          address:
            "stars1w4dff5myjyzymk8tkpjrzj6gnv352hcdpt2dszweqnff927a9xmqc7e0gv",
        },
      })

      .then(async function (response) {
        finalData = response.data;

        //         response.data.data.tokens.tokens.forEach((item) => {
        //           // console.log({ token: item.id.replace(collectionAddr + '/', ''), owner: item.owner })
        //           finalData.push({ token: item.id.replace(collectionAddr + '/', ''), owner: item.owner })
        //         });
      });
    this.collectionData = finalData;
    this.collectionDataLoaded = true;
    
  },
  updated() {
    this.watchWindowSize();
    window.onresize = this.watchWindowSize;
  },
  methods: {
    close() {
      this.isOpen = false;
    },
    open() {
      this.isOpen = true;
    },
    watchWindowSize() {
      const w = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );

      if (w >= 1024) {
        this.close();
        this.desktop = true;
      } else {
        this.desktop = false;
      }
    },
  },
};
</script>
<style>
.swap-card2 {
  display: flex;
  flex-direction: column;
  background: var(--gray-1100);
  border-radius: var(--border-radius);
  padding: 2.5rem 2rem;
  position: relative;
  margin: 2rem 0;
  width: 100%;
}
.swap2 > h3 {
  font-size: 24px;
  color: var(--white);
  font-weight: 600;
  padding: 3rem 0 0;
}
.paragraph {
  margin-bottom: 15px;
  letter-spacing: 0.32px;
}

.card {
  width: 300px;
  background-color: #1c1d20;
  display: inline-block;
  border-radius: 10px;
}
.card a {
  color: #333;
  text-decoration: none;
}

.card-image {
  height: 450px;
  position: relative;
  overflow: hidden;
}
.card-image img {
  width: 150%;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 25px;
  transform: translate(-50%, -50%);
  transition-property: filter width;
  transition-duration: 0.3s;
  transition-timing-function: ease;
}

.card-body {
  text-align: center;
  padding: 15px 20px;
  box-sizing: border-box;
}
.v-skeleton-loader__image.v-skeleton-loader__bone { height: 100%; }
</style>
