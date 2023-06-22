<template>
  <div>
    <v-row class="ma-2">
      <h1>
        Transactions 
      </h1>
      <v-spacer /> 
      <SendModal
        class="text-right mr-4"
        :chain-id-props="
          cosmosConfig[chainId].coinLookup.addressPrefix
        "
        :amount-available="balances / 1000000"
        :coin-icon="cosmosConfig[chainId].coinLookup.icon"
        type="simpleSend"
      />
      <v-btn
        large                          
        class="mt-2"
        color="#333333"
        @click.stop="dialog = true"
      >
        Receive
      </v-btn>
    </v-row>
    <v-divider class="mb-6" />
    <template v-for="group in groupedEvents()">
      <div class="mb-6">
        <h3 class="mb-6">
          {{ group[0].section }}
        </h3>
 
        <v-expansion-panels>
          <v-expansion-panel
            v-for="item in group"
            style="background:#1C1D20;color:white"
          > 
            <v-expansion-panel-header>
              <v-row no-gutters>
<!--                 <v-col cols="1">
                  <v-avatar class="mr-2">
                    <v-img
                      :src="'../transactions/' + item.final.icon"
                      :alt="item.final.typeReadable"
                    />
                  </v-avatar>
                </v-col> -->
                <!-- <v-col
                        cols="2"
                        class="mt-4"
                      >
                      {{ formatDate(item.final.timestamp) }}  
                      </v-col> -->
                <v-col
                  cols="6"
                  class="text--secondary"
                >
                  <v-fade-transition leave-absolute>
                    <v-row 
                      no-gutters
                      style="width: 100%"
                    >
                      <v-col cols="3">
                        <v-chip
                          class="mt-3"
                          :color="item.final.color"
                          outlined
                          label 
                        >
                          {{ item.final.typeReadable }}
                        </v-chip>
                      </v-col>
                      <v-col
                        cols="3"
                        class="mt-4"
                      >
                        {{ item.final.finalHash }} 
                      </v-col>
                    </v-row>
                  </v-fade-transition> 
                </v-col> 
                <v-col
                  align="right"
                  cols="5"
                  class="mt-4"
                > 
 <!--                  <div class="mr-4" v-if="item.final.msgData.option">
                    <v-chip
                            v-if="
                              item.final.msgData.option ===
                                'VOTE_OPTION_YES'
                            "
                            class="ma-2"
                            color="green"
                            outlined
                            label
                          >
                            YES
                          </v-chip>
                          <v-chip
                            v-if="
                              item.final.msgData.option ===
                                'VOTE_OPTION_NO'
                            "
                            class="ma-2"
                            color="red"
                            outlined
                            label
                          >
                            NO
                          </v-chip>
                          <v-chip
                            v-if="
                              item.final.msgData.option ===
                                'VOTE_OPTION_ABSTAIN'
                            "
                            class="ma-2"
                            color="red"
                            outlined
                            label
                          >
                            ABSTAIN
                          </v-chip>
                          <v-chip
                            v-if="
                              item.final.msgData.option ===
                                'VOTE_OPTION_NO_WITH_VETO'
                            "
                            class="ma-2"
                            color="orange"
                            outlined
                            label
                          >
                            NO WITH VETO
                          </v-chip> 
                  </div> -->
                  <div class="mr-4" v-if="item.final.msgData.amount">
                    {{ item.final.msgData.amount }} {{ cosmosConfig[0].coinLookup.viewDenom }}
                  </div>
                </v-col>                       
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <template
                v-if="
                  item.final.type === '/cosmos.bank.v1beta1.MsgSend'
                "
              >
                <v-simple-table class="accent">
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          From
                        </th>
                        <th class="text-left">
                          To
                        </th>
                        <th class="text-left">
                          Amount
                        </th>
                        <th class="text-left">
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ item.final.msgData.from }}</td>
                        <td>{{ item.final.msgData.to }}</td>
                        <td class="green--text">
                          {{ item.final.msgData.amount }}
                          {{ cosmosConfig[0].coinLookup.viewDenom }}
                        </td>
                        <td>
                          <v-btn
                            class=" mr-2"
                            elevation="2"
                            color="#333333"
                            :href="'https://explorer.bitcanna.io/transactions/' + item.final.finalHash"
                            target="_blank"
                            small
                          >
                            View in explorer
                          </v-btn>                        
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>

              <template
                v-if="
                  item.final.type ===
                    '/cosmos.staking.v1beta1.MsgDelegate'
                "
              >
                <v-simple-table class="accent">
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          From
                        </th>
                        <th class="text-left">
                          To validator
                        </th>
                        <th class="text-left">
                          Amount
                        </th>
                        <th class="text-left">
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {{ item.final.msgData.delegator_address }}
                        </td>
                        <td>
                          <v-icon class="mr-2">
                            mdi-shield-check
                          </v-icon>
                          {{ item.final.msgData.validator_address }}
                        </td>
                        <td class="green--text">
                          {{ item.final.msgData.amount }}
                          {{ cosmosConfig[0].coinLookup.viewDenom }}
                        </td>
                        <td>
                          <v-btn
                            class=" mr-2"
                            elevation="2"
                            color="#333333"
                            :href="'https://explorer.bitcanna.io/transactions/' + item.final.finalHash"
                            target="_blank"
                            small
                          >
                            View in explorer
                          </v-btn>                        
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
              <template
                v-if="
                  item.final.type ===
                    '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
                "
              >
                <v-simple-table class="accent">
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          From validator
                        </th>
                        <th class="text-left">
                          To delegator
                        </th>
                        <th class="text-left">
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <v-icon class="mr-2">
                            mdi-shield-check
                          </v-icon>
                          {{ item.final.msgData.validator_address }}
                        </td>
                        <td>
                          {{ item.final.msgData.delegator_address }}
                        </td>
                        <td>
                          <v-btn
                            class=" mr-2"
                            elevation="2"
                            color="#333333"
                            :href="'https://explorer.bitcanna.io/transactions/' + item.final.finalHash"
                            target="_blank"
                            small
                          >
                            View in explorer
                          </v-btn>                        
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
              <template
                v-if="
                  item.final.type === '/cosmos.gov.v1beta1.MsgVote'
                "
              >
                <v-simple-table class="accent">
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          proposal_id
                        </th>
                        <th class="text-left">
                          option
                        </th>
                        <th class="text-left">
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {{ item  }}
                      <tr>
                        <td>
                          #{{ item.final.msgData.proposal_id }}
                        </td>
                        <td>
                          <v-chip
                            v-if="
                              item.final.msgData.option ===
                                'VOTE_OPTION_YES'
                            "
                            class="ma-2"
                            color="green"
                            outlined
                            label
                          >
                            YES
                          </v-chip>
                          <v-chip
                            v-if="
                              item.final.msgData.option ===
                                'VOTE_OPTION_NO'
                            "
                            class="ma-2"
                            color="red"
                            outlined
                            label
                          >
                            NO
                          </v-chip>
                          <v-chip
                            v-if="
                              item.final.msgData.option ===
                                'VOTE_OPTION_ABSTAIN'
                            "
                            class="ma-2"
                            color="red"
                            outlined
                            label
                          >
                            ABSTAIN
                          </v-chip>
                          <v-chip
                            v-if="
                              item.final.msgData.option ===
                                'VOTE_OPTION_NO_WITH_VETO'
                            "
                            class="ma-2"
                            color="orange"
                            outlined
                            label
                          >
                            NO WITH VETO
                          </v-chip>
                        </td>
                        <td>
                          <v-btn
                            class=" mr-2"
                            elevation="2"
                            color="#333333"
                            :href="'https://explorer.bitcanna.io/transactions/' + item.final.finalHash"
                            target="_blank"
                            small
                          >
                            View in explorer
                          </v-btn>                        
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
              <template
                v-if="
                  item.final.type === '/cosmos.group.v1.MsgVote'
                "
              >
                <v-simple-table class="accent">
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          proposal_id
                        </th>
                        <th class="text-left">
                          option
                        </th>
                        <th class="text-left">
                          metadata
                        </th>
                        <th class="text-left">
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          #{{ item.final.msgData.proposal_id }}
                        </td>
                        <td>{{ item.final.msgData.option }}</td>
                        <td>{{ item.final.msgData.metadata }}</td>
                        <td>
                          <v-btn
                            class=" mr-2"
                            elevation="2"
                            color="#333333"
                            :href="'https://explorer.bitcanna.io/transactions/' + item.final.finalHash"
                            target="_blank"
                            small
                          >
                            View in explorer
                          </v-btn>                        
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
              <template
                v-if="
                  item.final.type ===
                    '/cosmos.gov.v1beta1.MsgDeposit'
                "
              >
                <v-simple-table class="accent">
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Proposal Id
                        </th>
                        <th class="text-left">
                          Deposit Amount
                        </th>
                        <th class="text-left">
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          #{{ item.final.msgData.proposal_id }}
                        </td>
                        <td>
                          {{ item.final.msgData.amount }}
                          {{ cosmosConfig[0].coinLookup.viewDenom }}
                        </td>
                        <td>
                          <v-btn
                            class=" mr-2"
                            elevation="2"
                            color="#333333"
                            :href="'https://explorer.bitcanna.io/transactions/' + item.final.finalHash"
                            target="_blank"
                            small
                          >
                            View in explorer
                          </v-btn>                        
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
              <template
                v-if="
                  item.final.type ===
                    '/cosmos.staking.v1beta1.MsgUndelegate'
                "
              >
                <v-simple-table class="accent">
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          From validator
                        </th>
                        <th class="text-left">
                          Amount
                        </th>
                        <th class="text-left">
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <v-icon class="mr-2">
                            mdi-shield-check
                          </v-icon>
                          {{ item.final.msgData.validator_address }}
                        </td>
                        <td>
                          {{ item.final.msgData.amount }}
                          {{ cosmosConfig[0].coinLookup.viewDenom }}
                        </td>
                        <td>
                          <v-btn
                            class=" mr-2"
                            elevation="2"
                            color="#333333"
                            :href="'https://explorer.bitcanna.io/transactions/' + item.final.finalHash"
                            target="_blank"
                            small
                          >
                            View in explorer
                          </v-btn>                        
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
              <template
                v-if="
                  item.final.type ===
                    '/cosmos.gov.v1beta1.MsgSubmitProposal'
                "
              >
                <v-simple-table class="accent">
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Proposal Id
                        </th> 
                        <th class="text-left">
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {{ item.final.msgData.proposal_id }}
                        </td> 
                        <td>
                          <v-btn
                            class=" mr-2"
                            elevation="2"
                            color="#333333"
                            :href="'https://explorer.bitcanna.io/transactions/' + item.final.finalHash"
                            target="_blank"
                            small
                          >
                            View in explorer
                          </v-btn>                        
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>                    
              <template
                v-if="
                  item.final.type ===
                    '/cosmos.staking.v1beta1.MsgBeginRedelegate'
                "
              >
                <v-simple-table class="accent">
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          From validator
                        </th>
                        <th class="text-left">
                          To validator
                        </th>
                        <th class="text-left">
                          Amount
                        </th>
                        <th class="text-left">
                          View
                        </th> 
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <v-icon class="mr-2">
                            mdi-shield-check
                          </v-icon>
                          {{ item.final.msgData.from }}
                        </td>
                        <td>
                          <v-icon class="mr-2">
                            mdi-shield-check
                          </v-icon>
                          {{ item.final.msgData.to }}
                        </td>
                        <td>
                          {{ item.messageInfo.msgData.amount }}
                          {{ cosmosConfig[0].coinLookup.viewDenom }}
                        </td>
                        <td>
                          <v-btn
                            class=" mr-2"
                            elevation="2"
                            color="#333333"
                            :href="'https://explorer.bitcanna.io/transactions/' + item.final.finalHash"
                            target="_blank"
                            small
                          >
                            View in explorer
                          </v-btn>                        
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <!-- {{ item }}  -->

        <!-- {{ group }} -->
      </div>
    </template>
    <v-card
      v-if="logged"
      class="mt-2 mx-auto"
      color="#000000"
    >
      <v-row justify="space-around">
        <v-col>
          <v-card
            class="accent"
            min-height="400"
          >
            <v-card-title class="headline">
              <!--<v-icon class="mr-2">mdi-wallet-outline</v-icon> Wallet amount-->
              <h4 class="icon">
                &ensp; Transactions historical
              </h4>
            </v-card-title>
            <v-card-text class="text-h5">
              <v-skeleton-loader
                v-if="firstLoad"
                :loading="loading"
                type="table"
              />
              
              <v-expansion-panels>
                <v-expansion-panel
                  v-for="item in rpcAllTxs"
                  :key="item.timestamp"
                  style="background: #090909; color: white"
                >
                  <v-expansion-panel-header>
                    <v-row no-gutters>
                      <v-col cols="1">
                        <v-avatar class="mr-2">
                          <v-img
                            :src="'../transactions/' + item.messageInfo.icon"
                            :alt="item.messageInfo.typeReadable"
                          />
                        </v-avatar>
                      </v-col>
                      <v-col
                        cols="2"
                        class="mt-4"
                      >
                        {{ formatDate(item.timestamp) }}
                      </v-col>
                      <v-col
                        cols="8"
                        class="text--secondary"
                      >
                        <v-fade-transition leave-absolute>
                          <v-row 
                            no-gutters
                            style="width: 100%"
                          >
                            <v-col cols="3">
                              <v-chip
                                class="mt-3"
                                :color="item.messageInfo.color"
                                outlined
                                label
                                small
                              >
                                {{ item.messageInfo.typeReadable }}
                              </v-chip>
                            </v-col>
                            <v-col
                              cols="9"
                              class="mt-4"
                            >
                              {{ item.txhash }}
                            </v-col>
                          </v-row>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <template
                      v-if="
                        item.messageInfo.type === '/cosmos.bank.v1beta1.MsgSend'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                From
                              </th>
                              <th class="text-left">
                                To
                              </th>
                              <th class="text-left">
                                Amount
                              </th>
                              <th class="text-left">
                                View
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{{ item.messageInfo.msgData.from }}</td>
                              <td>{{ item.messageInfo.msgData.to }}</td>
                              <td class="green--text">
                                {{ item.messageInfo.msgData.amount }}
                                {{ cosmosConfig[0].coinLookup.viewDenom }}
                              </td>
                              <td>
                                <v-btn
                                  class=" mr-2"
                                  elevation="2"
                                  color="#00b786"
                                  :href="'https://explorer.bitcanna.io/transactions/' + item.final.finalHash"
                                  target="_blank"
                                  small
                                >
                                  View in explorer
                                </v-btn>                        
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>

                    <template
                      v-if="
                        item.messageInfo.type ===
                          '/cosmos.staking.v1beta1.MsgDelegate'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                From
                              </th>
                              <th class="text-left">
                                To validator
                              </th>
                              <th class="text-left">
                                Amount
                              </th>
                              <th class="text-left">
                                View
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                {{ item.messageInfo.msgData.delegator_address }}
                              </td>
                              <td>
                                <v-icon class="mr-2">
                                  mdi-shield-check
                                </v-icon>
                                {{ item.messageInfo.msgData.validator_address }}
                              </td>
                              <td class="green--text">
                                {{ item.messageInfo.msgData.amount }}
                                {{ cosmosConfig[0].coinLookup.viewDenom }}
                              </td>
                              <td>
                                <v-btn
                                  class=" mr-2"
                                  elevation="2"
                                  color="#00b786"
                                  :href="'https://explorer.bitcanna.io/transactions/' + item.txhash"
                                  target="_blank"
                                  small
                                >
                                  View in explorer
                                </v-btn>                        
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <template
                      v-if="
                        item.messageInfo.type ===
                          '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                From validator
                              </th>
                              <th class="text-left">
                                To delegator
                              </th>
                              <th class="text-left">
                                View
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <v-icon class="mr-2">
                                  mdi-shield-check
                                </v-icon>
                                {{ item.messageInfo.msgData.validator_address }}
                              </td>
                              <td>
                                {{ item.messageInfo.msgData.delegator_address }}
                              </td>
                              <td>
                                <v-btn
                                  class=" mr-2"
                                  elevation="2"
                                  color="#00b786"
                                  :href="'https://explorer.bitcanna.io/transactions/' + item.txhash"
                                  target="_blank"
                                  small
                                >
                                  View in explorer
                                </v-btn>                        
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <template
                      v-if="
                        item.messageInfo.type === '/cosmos.gov.v1beta1.MsgVote'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                proposal_id
                              </th>
                              <th class="text-left">
                                option
                              </th>
                              <th class="text-left">
                                metadata
                              </th>
                              <th class="text-left">
                                View
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                #{{ item.messageInfo.msgData.proposal_id }}
                              </td>
                              <td>
                                <v-chip
                                  v-if="
                                    item.messageInfo.msgData.option ===
                                      'VOTE_OPTION_YES'
                                  "
                                  class="ma-2"
                                  color="green"
                                  outlined
                                  label
                                >
                                  YES
                                </v-chip>
                                <v-chip
                                  v-if="
                                    item.messageInfo.msgData.option ===
                                      'VOTE_OPTION_NO'
                                  "
                                  class="ma-2"
                                  color="red"
                                  outlined
                                  label
                                >
                                  NO
                                </v-chip>
                                <v-chip
                                  v-if="
                                    item.messageInfo.msgData.option ===
                                      'VOTE_OPTION_ABSTAIN'
                                  "
                                  class="ma-2"
                                  color="red"
                                  outlined
                                  label
                                >
                                  ABSTAIN
                                </v-chip>
                                <v-chip
                                  v-if="
                                    item.messageInfo.msgData.option ===
                                      'VOTE_OPTION_NO_WITH_VETO'
                                  "
                                  class="ma-2"
                                  color="orange"
                                  outlined
                                  label
                                >
                                  NO WITH VETO
                                </v-chip>
                              </td>
                              <td>
                                <v-btn
                                  class=" mr-2"
                                  elevation="2"
                                  color="#00b786"
                                  :href="'https://explorer.bitcanna.io/transactions/' + item.txhash"
                                  target="_blank"
                                  small
                                >
                                  View in explorer
                                </v-btn>                        
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <template
                      v-if="
                        item.messageInfo.type === '/cosmos.group.v1.MsgVote'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                proposal_id
                              </th>
                              <th class="text-left">
                                option
                              </th>
                              <th class="text-left">
                                metadata
                              </th>
                              <th class="text-left">
                                View
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                #{{ item.messageInfo.msgData.proposal_id }}
                              </td>
                              <td>{{ item.messageInfo.msgData.option }}</td>
                              <td>{{ item.messageInfo.msgData.metadata }}</td>
                              <td>
                                <v-btn
                                  class=" mr-2"
                                  elevation="2"
                                  color="#00b786"
                                  :href="'https://explorer.bitcanna.io/transactions/' + item.txhash"
                                  target="_blank"
                                  small
                                >
                                  View in explorer
                                </v-btn>                        
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <template
                      v-if="
                        item.messageInfo.type ===
                          '/cosmos.gov.v1beta1.MsgDeposit'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                Proposal Id
                              </th>
                              <th class="text-left">
                                Deposit Amount
                              </th>
                              <th class="text-left">
                                View
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                #{{ item.messageInfo.msgData.proposal_id }}
                              </td>
                              <td>
                                {{ item.messageInfo.msgData.amount }}
                                {{ cosmosConfig[0].coinLookup.viewDenom }}
                              </td>
                              <td>
                                <v-btn
                                  class=" mr-2"
                                  elevation="2"
                                  color="#00b786"
                                  :href="'https://explorer.bitcanna.io/transactions/' + item.txhash"
                                  target="_blank"
                                  small
                                >
                                  View in explorer
                                </v-btn>                        
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <template
                      v-if="
                        item.messageInfo.type ===
                          '/cosmos.staking.v1beta1.MsgUndelegate'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                From validator
                              </th>
                              <th class="text-left">
                                Amount
                              </th>
                              <th class="text-left">
                                View
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <v-icon class="mr-2">
                                  mdi-shield-check
                                </v-icon>
                                {{ item.messageInfo.msgData.validator_address }}
                              </td>
                              <td>
                                {{ item.messageInfo.msgData.amount }}
                                {{ cosmosConfig[0].coinLookup.viewDenom }}
                              </td>
                              <td>
                                <v-btn
                                  class=" mr-2"
                                  elevation="2"
                                  color="#00b786"
                                  :href="'https://explorer.bitcanna.io/transactions/' + item.txhash"
                                  target="_blank"
                                  small
                                >
                                  View in explorer
                                </v-btn>                        
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                    <template
                      v-if="
                        item.messageInfo.type ===
                          '/cosmos.gov.v1beta1.MsgSubmitProposal'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                Proposal Id
                              </th> 
                              <th class="text-left">
                                View
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                {{ item.messageInfo.msgData.proposal_id }}
                              </td> 
                              <td>
                                <v-btn
                                  class=" mr-2"
                                  elevation="2"
                                  color="#00b786"
                                  :href="'https://explorer.bitcanna.io/transactions/' + item.txhash"
                                  target="_blank"
                                  small
                                >
                                  View in explorer
                                </v-btn>                        
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>                    
                    <template
                      v-if="
                        item.messageInfo.type ===
                          '/cosmos.staking.v1beta1.MsgBeginRedelegate'
                      "
                    >
                      <v-simple-table class="accent">
                        <template #default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                From validator
                              </th>
                              <th class="text-left">
                                To validator
                              </th>
                              <th class="text-left">
                                Amount
                              </th>
                              <th class="text-left">
                                View
                              </th> 
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <v-icon class="mr-2">
                                  mdi-shield-check
                                </v-icon>
                                {{ item.messageInfo.msgData.from }}
                              </td>
                              <td>
                                <v-icon class="mr-2">
                                  mdi-shield-check
                                </v-icon>
                                {{ item.messageInfo.msgData.to }}
                              </td>
                              <td>
                                {{ item.messageInfo.msgData.amount }}
                                {{ cosmosConfig[0].coinLookup.viewDenom }}
                              </td>
                              <td>
                                <v-btn
                                  class=" mr-2"
                                  elevation="2"
                                  color="#00b786"
                                  :href="'https://explorer.bitcanna.io/transactions/' + item.txhash"
                                  target="_blank"
                                  small
                                >
                                  View in explorer
                                </v-btn>                        
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

import axios from "axios";
import dayjs from "dayjs";
import { reverse, sortBy, uniqWith, orderBy, groupBy } from "lodash";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { setMsg } from "~/libs/msgType";
import cosmosConfig from "~/cosmos.config";

const categories = [
  {
    section: "Today",
    matcher: (event) => {
      //console.log(dayjs(event.timestamp).isSame(dayjs(), "day"));
      // tests if the timestamp has the same day as today
      return dayjs(event.timestamp).isSame(dayjs(), "day");
    },
  },
  {
    section: "Yesterday",
    matcher: (event) => {
      return dayjs(event.timestamp).isSame(dayjs().subtract(1, "days"), "day");
    },
  },
];


export default {
  data: () => ({
    cosmosConfig: cosmosConfig,
    validatorAddr: "",
    totalProps: "",
    totalVoted: "",
    rpcSender: [],
    rpcRecipient: [],
    rpcAllTxs: [],
    loading: true,
    firstLoad: true,
  }),
  computed: {
    ...mapState("keplr", [`accounts`, "logged"]),
    ...mapState("data", [
      "chainId",
      "balances",
      "rewards",
      "delegations",
      "priceNow",
      "aprNow",
      "totalDelegated",
      "validatorDetails",
      "validators",
      "validatorsLoaded",
      "allTxs",
      "allTxsLoaded",
    ]),
  },
  watch: {},

  async beforeMount() {
    await this.$store.dispatch("keplr/checkLogin");
    await this.$store.dispatch("data/getAllValidators");
    // TODO
    // 1/ lcd -> get delegations
    // 2/ lcd -> get undelegate
    // 2/ rpc -> get historic
    if (this.logged && this.validatorsLoaded === true) {
      /*
      const rpcEndpoint = "https://rpc-devnet-6.bitcanna.io";
      const client = await tendermintRpc.Tendermint34Client.connect(rpcEndpoint);

      // Delegation historical
      const querySender = buildQuery({
        tags: [
          { key: "message.sender", value: this.accounts[0].address }
        ]
      });
      const queryRecipient = buildQuery({
        tags: [
          { key: "transfer.recipient", value: this.accounts[0].address }
        ]
      });
      const resultSender = await client.txSearch({ query: querySender });
      const resultRecipient = await client.txSearch({ query: queryRecipient });

      let decodedTx = decodeTxRaw(resultSender.txs[0].tx)

      const plain = Buffer.from(decodedTx.body.messages[0].value, 'base64').toString('utf8')

      console.log(resultSender)

      //console.log(resultSender.txs)

      console.log(resultRecipient)

      let finalResultSender = []

      resultSender.txs.forEach(async (item, index) => {
        if(item.result.code === 0) {
          let txEvent = JSON.parse(item.result.log)
          const txHash = toHex(item.hash)
          item.hashDecoded = txHash

          const foundMsg = txEvent[0].events.find(element => element.type === "message");
          const foundType = foundMsg.attributes.find(element => element.key === "action");
          item.msgType = foundType.value

          const responseDate = await client.txSearch({ query: `tx.hash='${item.hashDecoded}'` });
          let decodedTx = decodeTxRaw(responseDate.txs[0].tx)
          console.log(decodedTx)


          finalResultSender.push({
            height: item.height,
            hashDecoded: item.hashDecoded,
            msgType: item.msgType,
            // date: responseDate.header.time
          })
          // console.log(setMsg(item.msgType))
        }
      });


      // Recipient
      resultRecipient.txs.forEach(async (item) => {
        let txEvent = JSON.parse(item.result.log)
        const txHash = toHex(item.hash)
        item.hashDecoded = txHash

      }); */

      const resultSender = await axios(
        cosmosConfig[0].apiURL +
          "/cosmos/tx/v1beta1/txs?events=message.sender=%27" +
          this.accounts[0].address +
          "%27&limit=" +
          cosmosConfig[this.chainId].maxTxSender +
          "&order_by=2"
      );
      const resultRecipient = await axios(
        cosmosConfig[0].apiURL +
          "/cosmos/tx/v1beta1/txs?events=transfer.recipient=%27" +
          this.accounts[0].address +
          "%27&limit=" +
          cosmosConfig[this.chainId].maxTxSender +
          "&order_by=2"
      );
      const finalTxs = resultSender.data.tx_responses.concat(
        resultRecipient.data.tx_responses
      );

      this.rpcAllTxs = this.transactionsReducer(finalTxs);
      this.loading = false;
      this.firstLoad = false;
    }
  },
  methods: {
    groupedEvents() {
      if (this.allTxsLoaded && this.validatorsLoaded) {
        const test = orderBy(
          groupBy(this.categorizedEvents(), "section"),
          (group) => group[0].final.timestamp,
          "desc"
        );

        return test;
      }
    },    
    categorizedEvents() {
      return this.rpcAllTxs.map((event) => {
        // check if the tx is in Today, Yesterday or Last Week
        const dateString =
          ` (` + dayjs(event.timestamp).format("D MMMM YYYY") + `)`;

        const category = categories.find(({ matcher }) => matcher(event));
        
        if (category) {
          const final = this.getMessageType(
            event.tx.body.messages[0],
            event.timestamp,
            event.txhash
          );
          return {
            section: category.section + dateString,
            final,
          };
        }

        // check if tx is in a month this year
        const date = dayjs(event.timestamp);
        const today = dayjs();
        if (date.year() === today.year()) {
          const final = this.getMessageType(
            event.tx.body.messages[0],
            event.timestamp,
            event.txhash
          );

          return {
            section: date.format("D MMMM YYYY"),
            final,
          };
        }
        
        // tx is in a month another year
        const final = this.getMessageType(
          event.tx.body.messages[0],
          event.timestamp,
          event.txhash
        );

        return {
          section: date.format("MMMM D, YYYY"),
          final,
        };
      });
    },    
    transactionsReducer(txs) {
      // console.log(txs)
      const duplicateFreeTxs = uniqWith(txs, (a, b) => a.txhash === b.txhash);
      
      const sortedTxs = sortBy(duplicateFreeTxs, ["timestamp"]);
      const reversedTxs = reverse(sortedTxs);

      reversedTxs.forEach(async (item, i) => {
        reversedTxs[i].messageInfo = this.getMessageType(
          item.tx.body.messages[0]
        );
      });
      //console.log(reversedTxs)
      // here we filter out all transactions related to validators
      return reversedTxs.reduce((collection, transaction) => {
        return collection.concat(transaction);
      }, []);
    },
    getMessageType(msg, timestamp, txHash) { 
      const typeReadable = setMsg(
        msg,
        this.accounts[0].address,
        timestamp,
        this.validators,
        txHash
      );
      return typeReadable;
    },
    formatDate(dateStr) {
      return Intl.DateTimeFormat("us-EN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      }).format(new Date(dateStr))
    },    
  },

};
</script>
