<template>
  <div>
    <v-subheader>Live Tx's</v-subheader>
    <!--{{ blockData }}-->
    <v-list two-line>
      <template v-for="n in blockData">
        <v-list-item :key="n.data.block">
          {{ n.data.block }}<br />
          {{ n.data.hash }}<br />
          {{ n.data.action }}<br />
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import cosmosConfig from "~/cosmos.config";

export default {
  data: () => ({
    config: cosmosConfig,
    blockData: [],
  }),
  computed: {
    ...mapState("data", ["chainId"]),
  },
  async mounted() {
    this.$socket.$on("message", (data) => {
      var finalData = JSON.parse(data.data.toString("utf-8"));

      if (finalData?.result.data) {
        // finalData.result.data.value.TxResult.result.log
        let finalDataDecode = finalData.result.data;
        let finalDataDecodeEvents = finalData.result.events;
        console.log(finalDataDecodeEvents);
        let dataShow = {};

        this.blockData.unshift({ data: dataShow });
        if (this.blockData.length > 5) {
          this.blockData.splice(-1);
        }
      }
    });
  },
  beforeDestroy() {
    this.$socketManager.close(1000);
  },
  methods: {},
};
</script>
