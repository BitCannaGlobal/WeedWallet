<template>
  <div>
    <v-item-group>
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="3">
            <v-item>
              <div class="flex-grow-1 text-center">
                <v-hover v-slot="{ hover }" open-delay="200">
                  <v-card
                    class="rounded-lg justify-center mx-auto"
                    :elevation="hover ? 16 : 2"
                    :class="{ 'on-hover': hover }"
                    :color="$vuetify.theme.dark ? 'theme-dark' : 'theme-light'"
                    tile
                    outlined
                  >
                    <div
                      class="d-flex text-5 white--text font-weight-bold pt-10 justify-center mx-auto mb-6"
                    >
                      POOL 571
                    </div>
                    <img src="icon/BCNA-Osmo.svg" width="80" height="45" />

                    <v-list color="transparent" class="text-center" nav dense>
                      <v-list-item-title class="text-h6 font-weight-bold">
                        Title
                      </v-list-item-title>
                      <v-list-item class="rounded-lg justify-center mx-auto">
                        Sub title Sub title Sub title Sub title
                      </v-list-item>
                      <v-list-item-group v-model="selectedItem" color="primary">
                        <v-list-item v-for="(item, i) in items" :key="i">
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.text"
                            ></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                    <div class="text-center ma-3">
                      <v-btn dark> Choose Plan </v-btn>
                    </div>
                  </v-card>
                </v-hover>
              </div>
            </v-item>
          </v-col>

          <v-col cols="12" md="3">
            <v-item>
              <div class="flex-grow-1 text-center">
                <v-hover v-slot="{ hover }" open-delay="200">
                  <v-card
                    class="rounded-lg justify-center mx-auto"
                    :elevation="hover ? 16 : 2"
                    :class="{ 'on-hover': hover }"
                    :color="$vuetify.theme.dark ? 'theme-dark' : 'theme-light'"
                    tile
                    outlined
                  >
                    <div
                      class="d-flex text-5 white--text font-weight-bold pt-10 justify-center mx-auto mb-6"
                    >
                      POOL 572
                    </div>

                    <img src="icon/BCNA-Atom.svg" />
                    <v-list color="transparent" class="text-center" nav dense>
                      <v-list-item-title class="text-h6 font-weight-bold">
                        Title
                      </v-list-item-title>
                      <v-list-item class="rounded-lg justify-center mx-auto">
                        Sub title Sub title Sub title Sub title
                      </v-list-item>
                      <v-list-item-group v-model="selectedItem" color="primary">
                        <v-list-item v-for="(item, i) in items" :key="i">
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="item.text"
                            ></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                    <div class="text-center ma-3">
                      <v-btn dark> Choose Plan </v-btn>
                    </div>
                  </v-card>
                </v-hover>
              </div>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </div>
</template>
<!--   <div>

    <sequential-entrance>
    <v-row justify="space-around">
      <v-col>
        <v-card
          class="ma-4 pa-4 accent"
        >
          <h1>BCNA Earn</h1>
          <br />
          BitCanna Earn displays the various methods to utilize your BCNA assets to (potentially) earn additional income. <br />
          You can either lock your BCNA in liquidity pools, or use your BCNA to secure the BitCanna network. <br /><br />

          <p>For more information about liquidity pools, click here. For more information about staking, click here.</p>
        </v-card>
      </v-col>
      </v-row>
      </sequential-entrance>
      <sequential-entrance fromBottom>
      <v-row>
      <v-col>
        <v-card
          class="ma-4 pa-4 accent"
        >
          <h1>Pooling</h1>
          <table class="tableearn">
            <col style="width: 20%" />
            <col style="width: 20%" />
            <col style="width: 20%" />
            <col style="width: 20%" />
            <col style="width: 20%" />
            <thead>
              <tr>
                <th class="cell"></th>
                <th class="cell"></th>
                <th class="cell">Lockup</th>
                <th class="cell">TVL</th>
                <th class="cell">APR</th>
                <th class="cell"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="cell">BCNA/ATOM</td>
                <td class="cell">
                  <img src="icon/BCNA-Atom.svg" />
                </td>
                <td class="cell">1-7-14 days</td>
                <td class="cell">$ {{ tvlData572 }}</td>
                <td class="cell">{{ apr572 }}% + {{ bonus572 }}% BONUS BCNA</td>
                <td class="cell">

                </td>
              </tr>
              <tr>
                <td class="cell">BCNA/OSMO</td>
                <td class="cell">
                  <img src="icon/BCNA-Osmo.svg" width="80" height="45" />
                </td>
                <td class="cell">1-7-14 days</td>
                <td class="cell">$ {{ tvlData571 }}</td>
                <td class="cell">{{ apr571 }}% +  {{ bonus571 }}% BONUS BCNA</td>
                <td class="cell">

                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <h1>Stake</h1>
          <table class="tableearn">
            <col style="width: 20%" />
            <col style="width: 20%" />
            <col style="width: 20%" />
            <col style="width: 20%" />
            <col style="width: 20%" />
            <thead>
              <tr>
                <th class="cell index"></th>
                <th class="cell"></th>
                <th class="cell">Lockup</th>
                <th class="cell">TVL</th>
                <th class="cell">APR</th>
                <th class="cell"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="cell">BitCanna Delegate</td>
                <td class="cell">
                  <img src="icon/BCNA-icon.svg" width="45" height="45" />
                </td>
                <td class="cell">14 days</td>
                <td class="cell">
                  $ {{ bcnaBonded }}
                </td>
                <td class="cell">
                  {{ aprNow }}% (excl. commission)

                </td>
                <td class="cell noel">

                </td>
              </tr>
              <tr>
                <td class="cell">BitCanna Validate</td>
                <td class="cell">
                  <img src="icon/BCNA-icon.svg" width="45" height="45" />
                </td>
                <td class="cell">NA</td>
                <td class="cell">
                  $ {{ bcnaBonded }}
                </td>
                <td class="cell">
                  {{ aprNow }}% (excl. commission)

                </td>
                <td class="cell">

                </td>
              </tr>
            </tbody>
          </table>
        </v-card>
      </v-col>
    </v-row>
    </sequential-entrance>
  </div> -->

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  data: () => ({
    tvlData571: "",
    tvlData572: "",
    bcnaAprr: "",
    apr571: "",
    apr572: "",
    bonus571: "",
    bonus572: "",
    bcnaBonded: "",

    items2: [
      {
        icon: "mdi-wifi",
        text: "Wifi",
      },
      {
        icon: "mdi-bluetooth",
        text: "Bluetooth",
      },
      {
        icon: "mdi-chart-donut",
        text: "Data Usage",
      },
    ],
    model: 1,
    selectedItem: 0,
    items: [
      {
        text: "Data 1",
        icon: "done",
      },
      {
        text: "Data 2",
        icon: "done",
      },
      {
        text: "Data 3",
        icon: "done",
      },
      {
        text: "Data 4",
        icon: "done",
      },
      {
        text: "Data 5",
        icon: "done",
      },
    ],
  }),
  computed: {
    ...mapState("data", ["priceNow", "aprNow"]),
  },
  async beforeMount() {
    const responseBcnaBonded = await axios.get(
      "https://graphql.bitcanna.io/api/rest/supply/bonded"
    );
    this.bcnaBonded = (
      (responseBcnaBonded.data.staking_pool[0].bonded_tokens / 1000000) *
      this.priceNow
    ).toFixed(2);
    console.log(this.bcnaBonded);
    // Pool 571
    const responseData571 = await axios.get("/api/pool/571");
    this.tvlData571 = responseData571.data[0].liquidity;

    // Pool 572
    const responseData572 = await axios.get("/api/pool/572");
    this.tvlData572 = responseData572.data[0].liquidity;

    // Apr 571
    const aprData572 = await axios.get("/api/apr/572");
    console.log(aprData572.data[0]);
    // TODO Improve this fucking shit!
    this.apr572 = (
      Number(aprData572.data[0].apr_list[0].apr_14d).toFixed(10) * 10000000
    ).toFixed(2);

    // Apr 571
    const aprData571 = await axios.get("/api/apr/571");

    this.apr571 = (
      Number(aprData571.data[0].apr_list[0].apr_14d).toFixed(10) * 10000000
    ).toFixed(2);
    // you take the total liquidity of the pool (1.75M)
    // and the bonus rewards (2.4M)
    // (((((2.4M * 0.14) / 180) / 1.75M) * 365) * 100)
    // console.log(this.priceNow)
    const finalBonus571 = (
      ((1600000 * this.priceNow) / 180 / responseData571.data[0].liquidity) *
      365 *
      100
    ).toFixed(2);
    this.bonus571 = finalBonus571;

    const finalBonus572 = (
      ((2400000 * this.priceNow) / 180 / responseData572.data[0].liquidity) *
      365 *
      100
    ).toFixed(2);
    this.bonus572 = finalBonus572;
  },
};
</script>

<style>
.swap2 {
  padding: 0 1.5rem 3rem;
}

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
</style>
<style>
.container2 {
  /* overflow: auto; */
  border-radius: var(--border-radius);
  background: var(--gray-1100);
}

.container2 > h1 {
  font-size: 24px;
  color: #fff;
  color: var(--white);
  font-weight: 600;
  padding-bottom: 1rem;
}

.icon {
  display: inline-flex;
  align-self: center;
}

.tableearn {
  table-layout: fixed;
  min-width: 100%;
  border-radius: 30px;
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: -10px;
}

.tableearn th {
  padding: 1rem 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.tableearn td {
  vertical-align: middle;
  border: solid 1px #000;
  border-style: solid none;
  padding: 15px;
  background-color: black;
}

.tableearn td:first-child {
  border-left-style: solid;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.tableearn td:last-child {
  border-right-style: solid;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
}
</style>
