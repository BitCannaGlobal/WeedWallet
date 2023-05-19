<template>
  <div>
    <!--{{ txData }}-->
    <v-list-item>
      <v-list-item-action>
        <v-icon> mdi-eye-outline </v-icon>
      </v-list-item-action>
      <v-list-item-title>Live transactions</v-list-item-title>
      <v-icon @click="deleteHistory">
        mdi-trash-can-outline
      </v-icon>
    </v-list-item>

    <v-expansion-panels class="ml-1 mr-1">
      <!--  <v-expansion-panel>
            <v-expansion-panel-header class="col-8 text-truncate">
              123456789
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-simple-table >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        block
                      </th>
                      <th class="text-left">
                        action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Block</td>
                      <td>4523</td>
                    </tr>
                    <tr>
                      <td>Action</td>
                      <td>123</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-expansion-panel-content>
          </v-expansion-panel>-->
      <v-expansion-panel
        v-for="n in txData"
        :key="n.data.block"
        class="v-expansion-panel-ws"
      >
        <v-expansion-panel-header class=" ">
          <!--{{ n.data.hash }}-->
          {{ n.data.typeReadable }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-btn> View detail </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mapState } from "vuex";
import cosmosConfig from "~/cosmos.config";

export default {
  props: ["enable"],
  data: () => ({
    config: cosmosConfig,
    txData: [],
  }),
  computed: {
    ...mapState("data", ["chainId"]),
  },
  watch: {
    enable(newData, oldData) {
      console.log(newData);
      //         if (newData === false) {
      //           this.$socketManager.close(1000)
      //           console.log("connection closed")
      //         }
    },
  },
  async mounted() {
    this.$socket.$on("message", (data) => {
      const finalData = JSON.parse(data.data.toString("utf-8"));

      if (finalData?.result.data) {
        this.rightDrawer = true;
        // finalData.result.data.value.TxResult.result.log
        const finalDataDecode = finalData.result.data;
        const finalDataDecodeEvents = finalData.result.events;
        console.log(finalDataDecodeEvents);
        const dataShow = {};
        dataShow.block = finalDataDecodeEvents["tx.height"][0];
        dataShow.hash = finalDataDecodeEvents["tx.hash"][0];
        dataShow.action = finalDataDecodeEvents["message.action"][0];

        switch (finalDataDecodeEvents["message.action"][0]) {
          case "/cosmos.bank.v1beta1.MsgSend":
            dataShow.typeReadable = "Send";
            break;
          case "/cosmos.staking.v1beta1.MsgDelegate":
            dataShow.typeReadable = "Delegate";
            break;
          case "/cosmwasm.wasm.v1.MsgExecuteContract":
            dataShow.typeReadable = "Wasm";
            break;
          case "/cosmos.staking.v1beta1.MsgCreateValidator":
            dataShow.typeReadable = "Create validator";
            break;
          case "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward":
            dataShow.typeReadable = "Withdraw delegator";
            break;
          case "/cosmos.group.v1.MsgExec":
            dataShow.typeReadable = "Group Exec";
            break;
          case "/cosmos.group.v1.MsgSubmitProposal":
            dataShow.typeReadable = "Submit Proposal";
            break;
          case "/cosmos.group.v1.MsgVote":
            dataShow.typeReadable = "Vote group";
            break;
          case "/cosmos.group.v1.MsgUpdateGroupMetadata":
            dataShow.typeReadable = "Update Group Metadata";
            break;

          default:
            dataShow.typeReadable = "Unknow mesage";
        }

        /*
          let dataShow = {}
          let finalDataDecodeFor = JSON.parse(finalDataDecode.value.TxResult?.result.log)
          // console.log(finalDataDecodeFor);
          finalDataDecodeFor.forEach((item) => {
            let foundMsg = item.events.find(element => element.type === 'message');
            let foundMsgType = foundMsg.attributes.find(element => element.key === 'action');
            console.log(finalDataDecode.value.TxResult.height)
            dataShow.block = finalDataDecode.value.TxResult.height
            dataShow.type = foundMsgType.value
          });*/

        this.txData.unshift({ data: dataShow });
        if (this.txData.length > 10) {
          this.txData.splice(-1);
        }
      }
    });
  },

  methods: {
    deleteHistory() {
      this.txData = [];
    },
  },
};
</script>
<style>
.v-expansion-panel-ws {
  max-width: 220px;
  margin-right: 1em;
}
</style>
