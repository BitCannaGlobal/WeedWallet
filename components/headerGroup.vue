<template>
<div>
    <v-app-bar
      class="mb-3"
      flat
    >
      <v-container class="py-0 fill-height">
        <v-btn class="mr-2" text :to="'/group/' + infoGroupId.id">
          Home
        </v-btn>
        <v-btn class="mr-2" text :to="'/group/policy/' + infoGroupId.id">
          Policy
        </v-btn>
        <v-btn class="mr-2" text :to="'/group/create-proposal/' + infoGroupId.id">
          Submit Proposal
        </v-btn>

        <v-spacer></v-spacer>

        <v-chip
          v-if="infoGroupId.admin === accounts[0].address"
          class="ma-2"
          color="green"
          label
          outlined
        >
          You are admin
        </v-chip>
        <v-chip
          v-if="infoGroupId.admin === accounts[0].address"
          class="ma-2"
          color="green"
          label
          outlined
        >
          <EditGroup :addressAdmin="accounts[0].address" :groupId="infoGroupId.id" />
        </v-chip>
        <v-chip
          v-else
          class="ma-2"
          color="red"
          label
          outlined
        >
          You are not admin
        </v-chip>
      </v-container>
    </v-app-bar>


      <!--{{ infoGroupId }}-->
      <v-card>
        <v-img
          height="200px"
          :src="infoGroupId.meta?.group_banner"
        >


          <v-card-title class="white--text ">
            <v-avatar size="56">
              <img
                alt="user"
                :src="infoGroupId.meta?.group_icon"
                class="invertColor"
              >
            </v-avatar>
            <p class="ml-3">
              {{ infoGroupId.meta?.name }}<br /> Members: {{ infoGroupId.members?.length }}
            </p>

            <v-spacer /> {{ infoGroupId.meta?.description }}
          </v-card-title>

            <p class="ml-3">
              <br /> Active Proposals: {{ allProps.length }}<br />
                All Policies: {{ infoGroupId.policy?.length }}
            </p>
        </v-img>
      </v-card>

</div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { coins } from "@cosmjs/launchpad";
import { SigningStargateClient, AminoTypes } from "@cosmjs/stargate";
import { Registry, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { cosmos, cosmosProtoRegistry, cosmosAminoConverters } from 'interchain46';
import pkg from 'protobufjs';
const { Type, Field } = pkg;
import cosmosConfig from '~/cosmos.config'
import { notifWaiting, notifError, notifSuccess } from '~/libs/notifications'

  export default {

    data () {
      return {
        allProps: [],
      }
    },
    computed: {
      ...mapState('keplr', [`accounts`]),
      ...mapState('data', ['infoGroupId'])
    },
    async mounted () {
      await this.$store.dispatch('data/getInfoGroupId', {id: this.$route.params.id, account: this.accounts[0].address} )
      console.log(this.infoGroupId)
      let allProps = this.allProps
      this.infoGroupId.policy.forEach(async (item) => {
        const getProps = await axios(cosmosConfig[0].apiURL + `/cosmos/group/v1/proposals_by_group_policy/` + item.address)
        const getPropsFinal = getProps.data.proposals
  //       let findVoteByUser = getPropsFinal.find(element => element.id === getVoteByUser.data.votes.id);
  //       console.log(getVoteByUser)
        getPropsFinal.forEach(async (itemFinal) => {
            //console.log(itemFinal)
            allProps.push(itemFinal)
        })
      })
    },

  }
</script>
<style>
.invertColor {
   -webkit-filter: invert(1);
   filter: invert(1);
   }

</style>
