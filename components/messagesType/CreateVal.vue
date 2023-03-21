<template>
  <v-container>
    <v-row class="mt-4">
      <v-spacer></v-spacer>

      <v-switch
        v-model="viewJson"
        :label="viewJson ? 'View form' : 'View json'"
      ></v-switch>
      <v-col
        v-if="viewJson"
        cols="12"
        sm="12"
        md="12"
      >
        <vue-json-pretty :data="jsonData" show-line show-line-number show-length show-icon />
      </v-col>

      <v-col
        v-if="!viewJson"
        cols="12"
        sm="12"
        md="12"
      >
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="6"
        >
          <v-text-field
            v-model="formMoniker"
            label="Moniker"
            required
            outlined

          ></v-text-field>
          <v-text-field
            v-model="formIdentity"
            label="Identity"
            required
            outlined
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="formWebsite"
            label="Website"
            required
            outlined
          ></v-text-field>
          <v-text-field
            v-model="formSecurityContact"
            label="Security contact"
            required
            outlined
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          sm="12"
          md="12"
        >
        <v-text-field
          v-model="formDetails"
          label="Details"
          required
          outlined
        ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="6"
        >
          <v-text-field
            v-model="formRate"
            label="Rate"
            required
            outlined
          ></v-text-field>

          <v-text-field
            v-model="formMaxRate"
            label="Max Rate"
            required
            outlined
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="formMaxChangeRate"
            label="Max change rate"
            required
            outlined
          ></v-text-field>

          <v-text-field
            v-model="formMinSelfDelegation"
            label="Min Self Delegation"
            required
            outlined
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="6"
        >
          <v-text-field
            v-model="formDelegatorAddress"
            label="Delegator Address"
            required
            outlined
          ></v-text-field>
          <v-text-field
            v-model="formValidatorAddress"
            label="Validator Address"
            required
            outlined
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="formPubkey"
            label="Public Key"
            required
            outlined
          ></v-text-field>
          <v-text-field
            v-model="formValue"
            label="Amount delegate"
            required
            outlined
          ></v-text-field>
        </v-col>
      </v-row>


        <v-btn
          elevation="2"
          @click="checkMsg"
        >Check message</v-btn>
        <span v-if="showValidateData">
        {{ finalMsgProp }}
          <v-icon
            v-if="validateData"
            color="teal"
          >
            mdi-check
          </v-icon>

          <v-icon
            v-else
            color="red"
          >
            mdi-alert-circle
          </v-icon>
        </span>
        </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { coins } from "@cosmjs/launchpad";
import { SigningStargateClient, MsgCreateValidatorEncodeObject } from "@cosmjs/stargate";
import { Registry, DirectSecp256k1HdWallet, coin } from "@cosmjs/proto-signing";
import { cosmos, cosmosProtoRegistry, cosmosAminoConverters } from 'interchain46';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import pkg from 'protobufjs';
const { Type, Field } = pkg;
import bech32 from 'bech32';

import { PubKey as CosmosCryptoEd25519Pubkey } from "cosmjs-types/cosmos/crypto/ed25519/keys";
import {
  MsgBeginRedelegate,
  MsgCreateValidator,
  MsgDelegate,
  MsgEditValidator,
  MsgUndelegate,
} from "cosmjs-types/cosmos/staking/v1beta1/tx";


import cosmosConfig from '~/cosmos.config'
        const {
            MsgSend
        } = cosmos.bank.v1beta1;


  export default {
    props: ['from'],
    components: {
      VueJsonPretty,
    },
    data (props) {
      return {
        dialog: false,
        selectPolicy: props.from,
        formMoniker: 'atmon3r-val',
        formIdentity: '123456789',
        formWebsite: 'https://atmon3r.dev',
        formSecurityContact: 'sec@atmon3r.dev',
        formDetails: 'atmon3r atmon3r atmon3r',
        formRate: '100000000000000000',
        formMaxRate: '200000000000000000',
        formMaxChangeRate: '10000000000000000',
        formMinSelfDelegation: '100000',
        formDelegatorAddress: props.from,
        formValidatorAddress: '',
        formPubkey: 'A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ',
        formValue: '',
        viewJson: false,
        jsonData: '',
        validateData: false,
        showValidateData: false,
        cosmosConfig: cosmosConfig
      }
    },
    computed: {
      ...mapState('keplr', [`accounts`, `initialized`, `error`, `logged`, `logout`]),
      ...mapState('data', ['finalMsgProp', 'infoGroupId'])
    },
    async mounted () {


    },
    watch: {
      from(newData, oldData) {

          const decode = bech32.decode(newData)
          const valAddrBech32 = bech32.encode('osmovaloper', decode.words)
          console.log(valAddrBech32)


        this.formDelegatorAddress = newData
        this.formValidatorAddress = valAddrBech32
      },
      viewJson(newData, oldData) {
        const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;
        const msgSend = send(
            {
              fromAddress: this.selectPolicy,
              toAddress: this.toAddress,
              amount:[{"denom": cosmosConfig[0].coinLookup.chainDenom,"amount": (this.amount / 1000000)}]
            }
        )
        this.jsonData = msgSend
      },
    },
    methods: {
      async checkMsg() {
        this.showValidateData = true
        //if (this.selectPolicy !== '' && this.toAddress !== '' && this.amount !== '' ) {
          this.validateData = true

          /*const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;
          const msgSend = send(
              MsgSend.encode(MsgSend.fromPartial({
                fromAddress: this.selectPolicy,
                toAddress: this.toAddress,
                amount:[{"denom": cosmosConfig[0].coinLookup.chainDenom,"amount": this.amount}]
              })).finish()
          )

          console.log(msgSend) */
          const {
              MsgCreateValidator
          } = cosmos.staking.v1beta1;
          const { createValidator } = cosmos.staking.v1beta1.MessageComposer.withTypeUrl;


          const MsgCreateValidatorEncodeObject = {
              typeUrl: "/cosmos.staking.v1beta1.MsgCreateValidator",
              value: MsgCreateValidator.encode(MsgCreateValidator.fromPartial({
                description: {
                    moniker: this.formMoniker,
                    identity: this.formIdentity,
                    website: this.formWebsite,
                    security_contact: this.formSecurityContact,
                    details: this.formDetails,
                },
                commission: {
                    maxChangeRate: this.formMaxChangeRate,
                    maxRate: this.formMaxRate,
                    rate: this.formRate,
                },
                minSelfDelegation: this.formMinSelfDelegation,
                delegatorAddress: this.formDelegatorAddress,
                validatorAddress: this.formValidatorAddress,
                pubkey: {
                  typeUrl: "/cosmos.crypto.ed25519.PubKey",
                  value: Uint8Array.from(
                    CosmosCryptoEd25519Pubkey.encode(
                      CosmosCryptoEd25519Pubkey.fromPartial({
                        key: 'tRk69DlZyvWGI4/HrsZxU0OUpDB/p0NPXDcGINFIeDs=',
                      }),
                    ).finish(),
                  ),
                },

                value: coin(1000000, "uosmo"),
              })).finish()
          }


          /*const msgCreateVal = createValidator(
              MsgCreateValidator.encode(MsgCreateValidator.fromPartial({
                description: {
                    moniker: this.formMoniker,
                    identity: this.formIdentity,
                    website: this.formWebsite,
                    security_contact: this.formSecurityContact,
                    details: this.formDetails,
                },
                commission: {
                    rate: this.formRate,
                    max_rate: this.formMaxRate,
                    max_change_rate: this.formMaxChangeRate,
                },
                min_self_delegation: this.formMinSelfDelegation,
                delegator_address: this.formDelegatorAddress,
                validator_address: this.formValidatorAddress,
                pubkey: {
                  type: "tendermint/PubKeySecp256k1",
                  value: this.formPubkey,
                },
                value: coin(1000000, "uosmo"),
              }))
          ) */

          console.log(MsgCreateValidatorEncodeObject)
          //console.log(MsgCreateValidator)

          await this.$store.dispatch('data/formatFinalMsgProp', MsgCreateValidatorEncodeObject)
        /*} else
          this.validateData = false */

      },
    }
  }
</script>
