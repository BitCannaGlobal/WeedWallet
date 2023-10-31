<template>
  <div>
      <v-btn
        size="large" 
        class="mt-2 white--text"
        color="#0FB786"
        @click="dialog = true"
      >
        <v-icon class="mr-2">
          mdi-download
        </v-icon> Claim all
      </v-btn>

 
  <v-dialog
    v-model="dialog"
    max-width="600px"
  >
 
    <v-card color="#161819">
      <v-toolbar
            color="rgba(0, 0, 0, 0)"
            theme="dark"
          >
            <template v-slot:prepend>
              <v-avatar>
                  <v-img
                    max-width="32"
                    max-height="32"
                    :src="cosmosConfig[store.chainSelected].coinLookup.icon"
                    alt="Bitcanna"
                  ></v-img>
                </v-avatar>
            </template>

            <v-toolbar-title class="text-h6">
              <span
                v-if="step1"
                class="text-h5"
              >Claim all</span>
              <span
                v-if="step2"
                class="text-h5"
              >Check transaction </span>
              <span
                v-if="step3"
                class="text-h5"
              >Wait from keplr</span>
              <span
                v-if="step4"
                class="text-h5"
              >Transaction send!</span> 
            </v-toolbar-title>

            <template v-slot:append>
              <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
            </template>
          </v-toolbar> 
 
      <v-card-text>
        <v-form
          v-if="step1"
          ref="form"
          v-model="dislableSend"
          lazy-validation
        >
          <v-table class="accent">
            <thead>
              <tr>
                <th class="text-left">
                  Validator name
                </th>
                <th class="text-left">
                  Delegate
                </th>
                <th class="text-left">
                  Amount rewarded
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in store.allMyDelegations"
                :key="item.op_address"
              >
              <!-- {{ item }} -->
                <td>{{ item.validatorName }}</td>
                <!--<td>{{ item.op_address }}</td>-->
                <td>
                  {{ (item.delegated / 1000000).toFixed(6) }}
                  {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}
                </td>
                <td>
                  {{ item.reward }}
                  {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-form>
        <v-form
          v-if="step2"
          ref="form"
          lazy-validation
        >
          <v-sheet
            outlined
            color="gray"
            rounded
          >
            <v-card
              color="#1C1D20"
              class="pa-2"
              outlined
              tile 
            >
              <v-list-item two-line>
                <v-list-item-content>        
                  <v-list-item-subtitle class="mb-2">
                    <h3>Gas/fee</h3>
                  </v-list-item-subtitle>
                  <v-list-item-title>
                    <h3>
                      {{ gasFee.gas }} / {{ gasFee.fee / 1000000 }}
                      {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}
                    </h3>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-if="memo !== ''"
                two-line
              >
                <v-list-item-content>        
                  <v-list-item-subtitle class="mb-2">
                    <h3>Memo</h3>
                  </v-list-item-subtitle>
                  <v-list-item-title>
                    <h3>{{ memo }}</h3>
                  </v-list-item-title> 
                </v-list-item-content>
              </v-list-item>      
            </v-card>
          </v-sheet>      
          <h3 class="mt-4 ml-1 mb-2">
            Memo (Optional)
          </h3>
          <v-text-field
            v-model="memo"              
            background-color="#0F0F0F"
            required
            flat 
            solo
          /> 
  
          <v-row>
            <v-col cols="12" />
          </v-row>    
        </v-form>

        <v-row v-if="step3">
          <v-col
            cols="12"
            align="center"
            justify="center"
          >
            <v-img
              max-height="102"
              max-width="102"
              src="https://wallet.bitcanna.io/icons/pending.svg"
            />
            <br>
            <h3>Transaction pending</h3> 
            <h4>Your transaction is waiting to get approved on the blockchain.</h4>
          </v-col>
        </v-row>
        <v-row v-if="step4">
          <v-col
            cols="12"
            align="center"
            justify="center"
          >
            <v-img
              max-height="102"
              max-width="102"
              src="https://wallet.bitcanna.io/icons/approved.svg"
            />
            <br>
            <h3>Transaction approved</h3> 
            <h4>Your transaction has been approved on the blockchain.</h4>
          </v-col>
        </v-row>
        <v-btn
          v-if="step2"
          color="#1C1D20"
          block
          size="large"
          class="mt-4"
          @click="returnStep"
        >
          Return
        </v-btn>
        <v-btn
          v-if="step1"
          :disabled="!dislableSend"
          :loading="loading"
          color="#00b786"
          block
          size="large"
          class="mt-4 "
          @click="validate"
        >
          Next step
        </v-btn>
        <v-btn
          v-if="step2"
          :disabled="!dislableSend"
          :loading="loading"
          color="#00b786"
          block
          size="large"
          class="mt-4 "
          @click="validatestep2"
        >
          Get reward
        </v-btn>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import { useAppStore } from '@/stores/data'
import { selectSigner, calculFee } from "~/libs/signer";
import cosmosConfig from "~/cosmos.config";

import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  GasPrice,
  calculateFee,
} from "@cosmjs/stargate";

export default {
  props: ["chainIdProps", "amountClaimAll", "getAllDelegation", "homePage"],
  data: () => ({
    dialog: false,
    dialogStepper: false,
    e1: 1,
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    gasFee: {},
    eError: true,
    dislableSend: true,
    address: "",
    addressRules: [
      (v) => !!v || "Address is required",
      // v => v.startsWith(instance.chainIdProps.toLowerCase()) || 'Address must start with "' + instance.chainIdProps.toLowerCase() + '"',
      // v => bech32Validation(v) || 'Bad address (not bech32)',
    ],
    amount: "",
    amountRules: [
      (v) => !!v || "Amount is required",
      (v) => !isNaN(v) || "Amount must be number",
    ],
    memo: "",
    loading: false,
    cosmosConfig: cosmosConfig,
  }),
  setup() {
    const store = useAppStore()

    return {
      store
    }
  },
  computed: {
    //...mapState("data", ["chainId", `balances`, "delegations"]),
  },
  methods: {
    async validate() {
 
        this.step1 = false;
        this.step2 = true;
        // Fee claculation
        let signer = await selectSigner(this.store.chainSelected, this.store.loggedType)
        /* const chainId = cosmosConfig[this.store.chainSelected].chainId;
        await window.keplr.enable(chainId);
        const offlineSigner = await window.getOfflineSignerAuto(chainId);
        const client = await SigningStargateClient.connectWithSigner(
          cosmosConfig[this.store.chainSelected].rpcURL,
          offlineSigner
        );

        const accounts = await offlineSigner.getAccounts(); */

        const foundMsgType = defaultRegistryTypes.find(
          (element) =>
            element[0] ===
            "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
        );
        const finalMsg = [];
        this.store.allMyDelegations.forEach(function (item) {
          finalMsg.push({
            typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
              delegatorAddress: signer.accounts[0].address,
              validatorAddress: item.op_address,
            }),
          });
        });
        const gasEstimation = await signer.client.simulate(
          signer.accounts[0].address,
          finalMsg,
          this.memo
        );
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.chainSelected].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.chainSelected].gasPrice +
              cosmosConfig[this.store.chainSelected].coinLookup.chainDenom
          )
        );
        this.gasFee = { fee: usedFee.amount[0].amount, gas: usedFee.gas };
 
    },
    returnStep() {
      this.step1 = true;
      this.step2 = false;
    },
    validatestep2() {
      (async () => {
        this.$refs.form.validate();
        this.dialogStepper = true;
        this.loading = true;
        this.step3 = true;
        this.step2 = false;

        /* const chainId = cosmosConfig[this.store.chainSelected].chainId;
        await window.keplr.enable(chainId);
        const offlineSigner = await window.getOfflineSignerAuto(chainId);
        const accounts = await offlineSigner.getAccounts();

        const client = await SigningStargateClient.connectWithSigner(
          cosmosConfig[this.store.chainSelected].rpcURL,
          offlineSigner,
          {
            gasPrice: GasPrice.fromString(
              cosmosConfig[this.store.chainSelected].gasPrice +
                cosmosConfig[this.store.chainSelected].coinLookup.chainDenom
            ),
          }
        ); */
        let signer = await selectSigner(this.store.chainSelected, this.store.loggedType)
        
        const foundMsgType = defaultRegistryTypes.find(
          (element) =>
            element[0] ===
            "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
        );
        const copieDelegator = [];
        this.store.allMyDelegations.forEach(function (item) {
          copieDelegator.push({
            typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
              delegatorAddress: signer.accounts[0].address,
              validatorAddress: item.op_address,
            }),
          });
        }); 
        try {
          const result = await signer.client.signAndBroadcast(
            signer.accounts[0].address,
            copieDelegator,
            "auto",
            ""
          );
          assertIsDeliverTxSuccess(result);
          // this.dialog = false
          this.step3 = false;
          this.step4 = true;
          this.loading = false;
          // await this.$store.dispatch("data/refresh", accounts[0].address);          
          await this.store.refresh()

        } catch (error) {
          console.error(error);
          this.eError = false;
          this.loading = false;
          this.step3 = false;
          this.step2 = true;
        } finally {
          await new Promise((resolve) => setTimeout(resolve, 4000));
          this.dialog = false;
        }
      })();
    },
  },
};
</script>

<style>
.vuetify-logo {
  height: 180px;
  width: 180px;
  transform: rotateY(560deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
