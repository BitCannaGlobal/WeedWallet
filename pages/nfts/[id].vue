<template>
  <div v-if="store.logged">
    <!--    ID: {{ nftId }}<br />
    {{ nftData }}-->

    <v-container>
      <v-row>
        <v-col class="mb-4 text-h6 text-md-h5 text-lg-h4">
          Buddhead #{{ nftId }}
        </v-col>

        <v-chip
          class="mr-4"
          color="#00b786"
          outlined
          label
        > 
          You are owner
        </v-chip>
      </v-row>
      <v-row no-gutters>
        <v-col
          cols="6"
          md="4"
        >
          <v-card
            class="mr-4 pa-2"
            outlined
            tile
            min-height="523"
          >
            <v-img :src="nftData.data?.token.media.url" />
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="8"
        >
          <v-card
            class="pa-2"
            outlined
            tile
          >
            <v-table>
              <template #default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Name
                    </th>
                    <th class="text-left">
                      value
                    </th>
                    <th class="text-left">
                      rarity
                    </th>
                    <th class="text-left">
                      Rarity Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in nftData.data?.token.traits"
                    :key="item.name"
                  >
                    <td>{{ item.name }}</td>
                    <td>{{ item.value }}</td>
                    <td>{{ item.rarity }}%</td>
                    <td>{{ item.rarityScore.toFixed(2) }}</td>
                  </tr>
                </tbody>
              </template>
            </v-table>
          </v-card>
          <v-card
            class="mt-2 pa-2"
            outlined
            tile
          >
            <v-table>
              <template #default>
                <tbody>
                  <tr>
                    <td>Total Rarity Score</td>
                    <td />
                    <td />
                    <td>{{ nftData.data?.token.rarityScore }}</td>
                  </tr>
                </tbody>
              </template>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { useAppStore } from '@/stores/data'
import axios from "axios";
import cosmosConfig from "~/cosmos.config";

export default {
  filters: {},
  setup() {
    const store = useAppStore()

    return {
      store
    }
  },
  data: () => ({
    cosmosConfig: cosmosConfig,
    nftId: "",
    nftData: "",
  }),
  computed: {},
  watch: {},
  async beforeMount() {
    this.nftId = this.$route.params.id;

    let finalData = [];
    await axios
      .post("https://graphql.mainnet.stargaze-apis.com/graphql", {
        query:
          "query Token($collectionAddr: String!, $tokenId: String!) { token(collectionAddr: $collectionAddr, tokenId: $tokenId) { name rarityScore traits { name rarity rarityPercent rarityScore value }     media { url} } }",
        variables: {
          collectionAddr:
            "stars1w4dff5myjyzymk8tkpjrzj6gnv352hcdpt2dszweqnff927a9xmqc7e0gv",
          tokenId: this.nftId,
        },
      })
      .then(async function (response) { 
        finalData = response.data;
      });

    this.nftData = finalData;
  },
  async mounted() {},
  methods: {},
};
</script>
