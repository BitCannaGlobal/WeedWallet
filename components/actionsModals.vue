<template>
  <div>
    <v-btn
      v-if="type === 'getRewards'"
      :color="cosmosConfig[store.chainSelected].color"
      variant="text"
      @click="openRewards"
    >
      <v-icon
        class="mr-2"
        :color="cosmosConfig[store.chainSelected].color"
      >
        mdi-download
      </v-icon>
      Get rewards
    </v-btn>
 
    <v-btn
      v-if="type === 'sendTokens'" 
 
      large
      block
      class="mt-2 green--text"
      :color="cosmosConfig[store.chainSelected].color"
      @click="openSendTokens"
    > 
      Send
    </v-btn> 
    <v-btn
      v-if="type === 'delegate'" 
      variant="text"
      :color="cosmosConfig[store.chainSelected].color"
      @click="openDelegate"
    >
      <v-icon
        size="large" 
        class="mr-2"
        :color="cosmosConfig[store.chainSelected].color"
      >
        mdi-upload
      </v-icon>
      Delegate  
    </v-btn> 
    <v-btn
      v-if="type === 'validatorRewards'"
      :color="cosmosConfig[store.chainSelected].color"
      variant="text"
      @click="openValidatorRewards"
    >
      <v-icon :color="cosmosConfig[store.chainSelected].color">
        mdi-send-circle-outline
      </v-icon>
      Get validator Rewards
    </v-btn>    

    <v-btn
      v-if="type === 'feeGrant'"
      :color="cosmosConfig[store.chainSelected].color"
      variant="text"
      @click="openFeeGrant"
    >
      <v-icon :color="cosmosConfig[store.chainSelected].color">
        mdi-send-circle-outline
      </v-icon>
      Grant Allowance
    </v-btn>   

    <v-btn
      v-if="type === 'removeFeeGrant'" 
      variant="text"
      @click="openRemoveFeeGrant"
    >
      <v-icon
        size="large"
        color="red darken-1" 
      >
        mdi-account-multiple-remove-outline
      </v-icon>      
    </v-btn> 

    <v-btn
      v-if="type === 'voteGovernance'" 
      variant="text"
      @click="openVote"
    >
      <v-icon
        size="large" 
      >
        mdi-vote-outline
      </v-icon>
      Vote now!  
    </v-btn> 

    <v-btn
      v-if="type === 'addAuthz'" 
      variant="text"
      @click="openAddAuthz"
    >
      <v-icon
        size="large" 
      >
        mdi-vote-outline
      </v-icon>
      Add authZ 
    </v-btn>     

    <v-btn
      v-if="type === 'removeAuthz'" 
      variant="text"
      @click="openRemoveAuthz"
    >
      <v-icon
        size="large"
        color="red darken-1" 
      >
        mdi-account-multiple-remove-outline
      </v-icon>      
    </v-btn> 

    <v-btn
      v-if="type === 'delegatorWithdrawAddress'" 
      variant="text"
      @click="openDelegatorWithdrawAddress"
    >
      <v-icon
        size="large"
        :color="cosmosConfig[store.chainSelected].color"
      >
        mdi-pencil
      </v-icon>      
    </v-btn>    

    <v-btn
      v-if="type === 'checkArbitrary'" 
      variant="text"
      @click="verifyArbitrary"
    >
      <v-icon
        size="large"
        :color="cosmosConfig[store.chainSelected].color"
      >
        mdi-pencil
      </v-icon>      
    </v-btn>    

    <v-dialog
      v-model="dialogSendTokens"  
      transition="dialog-top-transition"
      absolute 
      max-width="600px" 
    > 
      <v-card> 
        <v-toolbar
          color="rgba(0, 0, 0, 0)"
          theme="dark"
        >
          <template #prepend>
            <v-avatar>
              <v-img
                max-width="32"
                max-height="32"
                :src="cosmosConfig[store.chainSelected].coinLookup.icon"
                alt="John"
              />
            </v-avatar>
          </template>

          <v-toolbar-title class="text-h6">
            Send tokens
          </v-toolbar-title>

          <template #append>
            <v-btn
              icon="mdi-close"
              @click="dialogSendTokens = false"
            />
          </template>
        </v-toolbar> 
        <v-card-text>            
          <v-form
            v-if="step1"
            ref="formSend" 
            v-model="formSend"
          > 
            <h3 class="ml-1 mb-1">
              Address*
            </h3>
            <v-text-field
              v-model="sendTo" 
              :rules="[rules.required, rules.bech32, rules.bech32Prefix]" 
              variant="solo"
              bg-color="#0F0F0F"
            >
              <template #append-inner>
                <v-chip
                  label
                  small
                  @click="setAddress"
                >
                  Me
                </v-chip>
              </template>            
            </v-text-field>
            <h3 class="ml-1 mb-1">
              Amount*
            </h3>
            <v-text-field
              v-model="sendAmount" 
              :rules="[rules.required, rules.checkAmount, rules.checkDecimal]"
              class="mb-2"  
              variant="solo"
              bg-color="#0F0F0F"
            >
              <template #append-inner>
                <v-chip
                  label
                  small
                  @click="getMax"
                >
                  Max
                </v-chip>
              </template>
            </v-text-field>
            <h3 class="ml-1 mb-1">
              Memo (Optional)
            </h3>
            <v-text-field
              v-model="memo" 
              variant="solo"
              bg-color="#0F0F0F"
            />
            <!-- <h4 v-if="store.myFeeAllowances.length > 0"> Fee </h4>  
            <v-select
              v-model="feeAllowancesFrom" 
              v-if="store.myFeeAllowances.length > 0"
              label="Select"
              :items="['', store.myFeeAllowances[0].granter]"
              variant="outlined"
            ></v-select> -->
          </v-form>   
          <div v-if="step2">
            <v-row>
              <v-col>
                <v-card
                  class="pa-2 accent" 
                  variant="outlined" 
                >                          
                  <v-row>
                    <v-col>
                      <v-sheet class="pa-2 ma-2">
                        Fee
                      </v-sheet>
                    </v-col>
                    <v-col>
                      <v-sheet class="pa-2 ma-2">
                        {{ gasFee.fee }}
                      </v-sheet>
                    </v-col>
                  </v-row>                  
                </v-card>
              </v-col>
              <v-col>
                <v-card
                  class="pa-2 accent" 
                  variant="outlined" 
                >   
                  <v-row>
                    <v-col>
                      <v-sheet class="pa-2 ma-2">
                        Gas
                      </v-sheet>
                    </v-col>
                    <v-col>
                      <v-sheet class="pa-2 ma-2">
                        {{ gasFee.gas }}
                      </v-sheet>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>   
            <!-- <br />
            <span v-if="store.myFeeAllowances.length > 0" class=" ">Select your fee payer <br /><br /> </span>   
            
            <v-card
              v-if="store.myFeeAllowances.length > 0"
              class=" accent" 
              variant="outlined" 
            >              
            <br />
              <v-radio-group v-model="finalFeeGranter" >
                <v-radio v-for="addr in store.formFeeGranter" :label="truncate(addr)" :value="addr"></v-radio>
              </v-radio-group> 
            </v-card>  -->
          </div> 
          <div
            v-if="step3"
            class="ma-8 text-center"
          >
            <v-progress-circular                
              :size="100"
              :width="5"
              :color="cosmosConfig[store.chainSelected].color"
              indeterminate 
              justify="center"
            />   
          </div>
          <div
            v-if="step4"
            class="ma-8 text-center"
          >
            <v-icon
              size="150"
              color="green darken-2"
            >
              mdi-check-circle-outline
            </v-icon>  
            <br><br>
            {{ txResult.transactionHash }} 
          </div>
        </v-card-text>
        <v-btn 
          v-if="step1"
          class="text-none ml-6 mr-6 mb-4"
          :disabled="!formSend"
          :color="cosmosConfig[store.chainSelected].color" 
          size="large"
          @click="calculateSendFee()"
        >
          Check fee
        </v-btn> 
        <v-btn 
          v-if="step2"
          class="text-none ml-6 mr-6 mb-4"
          :disabled="!formSend"
          :color="cosmosConfig[store.chainSelected].color" 
          size="large"
          @click="sendNow()"
        >
          Send now
        </v-btn>
      </v-card>  
    </v-dialog>
    

    <v-dialog
      v-model="dialog" 
      width="500" 
      transition="dialog-top-transition"
      absolute
    >
      <v-card> 
        <v-toolbar
          color="rgba(0, 0, 0, 0)"
          theme="dark"
        >
          <template #prepend>
            <v-avatar>
              <v-img
                max-width="32"
                max-height="32"
                :src="cosmosConfig[store.chainSelected].coinLookup.icon"
                alt="John"
              />
            </v-avatar>
          </template>

          <v-toolbar-title class="text-h6">
            Get rewards
          </v-toolbar-title>

          <template #append>
            <v-btn
              icon="mdi-close"
              @click="dialog = false"
            />
          </template>
        </v-toolbar> 
        <v-card-text>            
          <v-table v-if="step1">
            <tbody>
              <tr>
                <td>Total rewards</td>
                <td> 
                  {{ store.totalRewards }}
                  <strong :style="'color:' + cosmosConfig[store.chainSelected].color">
                    {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}
                  </strong>                   
                </td>
              </tr>
              <tr>
                <td>Fee</td>
                <td>
                  {{ gasFee.fee }}
                  <strong :style="'color:' + cosmosConfig[store.chainSelected].color">
                    {{ cosmosConfig[store.chainSelected].coinLookup.viewDenom }}
                  </strong>  
                </td>
              </tr>
            </tbody>
          </v-table>    
          <div
            v-if="step2"
            class="ma-8 text-center"
          >
            <v-progress-circular                
              :size="100"
              :width="5"
              :color="cosmosConfig[store.chainSelected].color"
              indeterminate 
              justify="center"
            />   
          </div>
          <div
            v-if="step3"
            class="ma-8 text-center"
          >
            <v-icon
              size="150"
              color="green darken-2"
            >
              mdi-check-circle-outline
            </v-icon>  
            <br><br>
            {{ txResult.transactionHash }} 
          </div>       
        </v-card-text>
 
        <v-btn 
          v-if="step1"
          class="text-none ma-4"
          :color="cosmosConfig[store.chainSelected].color"
          prepend-icon="mdi-export-variant" 
          size="large"
          @click="getRewards()"
        >
          Claim
        </v-btn>
      </v-card>
    </v-dialog>
      
    <v-dialog
      v-model="dialogFeeGrant" 
      width="500" 
      transition="dialog-top-transition"
      absolute
    >
      <v-card> 
        <v-toolbar
          color="rgba(0, 0, 0, 0)"
          theme="dark"
        >
          <template #prepend>
            <v-avatar>
              <v-img
                max-width="32"
                max-height="32"
                :src="cosmosConfig[store.chainSelected].coinLookup.icon"
                alt="John"
              />
            </v-avatar>
          </template>

          <v-toolbar-title class="text-h6">
            Grant Fee Allowance
          </v-toolbar-title>

          <template #append>
            <v-btn
              icon="mdi-close"
              @click="dialogFeeGrant = false"
            />
          </template>
        </v-toolbar> 
        <v-card-text>     
          <div v-if="step1">
            <v-text-field
              v-model="grantee" 
              :rules="[rules.required, rules.bech32]" 
              label="Gantee address"
              placeholder="Enter address"
              variant="outlined"
            />
            <v-text-field
              v-model="amountFeeGrant" 
              :rules="[rules.required]"
              class="mb-2" 
              label="Amount to grant by tx"
              placeholder="Enter amount"
              variant="outlined" 
            />
          </div>
 
          <div
            v-if="step2"
            class="ma-8 text-center"
          >
            <v-progress-circular                
              :size="100"
              :width="5"
              :color="cosmosConfig[store.chainSelected].color"
              indeterminate 
              justify="center"
            />   
          </div>
          <div
            v-if="step3"
            class="ma-8 text-center"
          >
            <v-icon
              size="150"
              color="green darken-2"
            >
              mdi-check-circle-outline
            </v-icon>  
            <br><br>
            {{ txResult.transactionHash }} 
          </div>       
        </v-card-text>
 
        <v-btn 
          v-if="step1"
          class="text-none ma-6"
          :color="cosmosConfig[store.chainSelected].color"
          prepend-icon="mdi-export-variant" 
          size="large"
          @click="sendFeeGrant()"
        >
          Send Fee Grant
        </v-btn>
      </v-card>
    </v-dialog>  
          
    <v-dialog
      v-model="dialogRemoveAuthz" 
      width="500" 
      transition="dialog-top-transition"
      absolute
    >
      <v-card> 
        <v-toolbar
          color="rgba(0, 0, 0, 0)"
          theme="dark"
        >
          <template #prepend>
            <v-avatar>
              <v-img
                max-width="32"
                max-height="32"
                :src="cosmosConfig[store.chainSelected].coinLookup.icon"
                alt="John"
              />
            </v-avatar>
          </template>

          <v-toolbar-title class="text-h6">
            Remove Authz
          </v-toolbar-title>

          <template #append>
            <v-btn
              icon="mdi-close"
              @click="dialogRemoveAuthz = false"
            />
          </template>
        </v-toolbar> 
        <v-card-text>     
          <div v-if="step1">
            <v-table theme="dark">
              <tbody>
                <tr>
                  <td>AuthZ type</td>
                  <td>{{ authZdata.finalData.titleMsg }}</td>
                </tr>
                <tr>
                  <td>From grantee</td>
                  <td>{{ truncate(authZdata.grantee) }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
 
          <div
            v-if="step2"
            class="ma-8 text-center"
          >
            <v-progress-circular                
              :size="100"
              :width="5"
              :color="cosmosConfig[store.chainSelected].color"
              indeterminate 
              justify="center"
            />   
          </div>
          <div
            v-if="step3"
            class="ma-8 text-center"
          >
            <v-icon
              size="150"
              color="green darken-2"
            >
              mdi-check-circle-outline
            </v-icon>  
            <br><br>
            {{ txResult.transactionHash }} 
          </div>       
        </v-card-text>
 
        <v-btn 
          v-if="step1" 
          class="text-none ma-4"
          :color="cosmosConfig[store.chainSelected].color"
          prepend-icon="mdi-export-variant" 
          size="large"
          @click="sendRemoveAuthz()"
        >
          Remove this authZ
        </v-btn>
      </v-card>
    </v-dialog> 
      
      
    <v-dialog
      v-model="dialogRemoveFeeGrant" 
      width="500" 
      transition="dialog-top-transition"
      absolute
    >
      <v-card> 
        <v-toolbar
          color="rgba(0, 0, 0, 0)"
          theme="dark"
        >
          <template #prepend>
            <v-avatar>
              <v-img
                max-width="32"
                max-height="32"
                :src="cosmosConfig[store.chainSelected].coinLookup.icon"
                alt="John"
              />
            </v-avatar>
          </template>

          <v-toolbar-title class="text-h6">
            Remove Fee Allowance
          </v-toolbar-title>

          <template #append>
            <v-btn
              icon="mdi-close"
              @click="dialogRemoveFeeGrant = false"
            />
          </template>
        </v-toolbar> 
        <v-card-text>     
          <div v-if="step1">
            Soon
          </div>
 
          <div
            v-if="step2"
            class="ma-8 text-center"
          >
            <v-progress-circular                
              :size="100"
              :width="5"
              :color="cosmosConfig[store.chainSelected].color"
              indeterminate 
              justify="center"
            />   
          </div>
          <div
            v-if="step3"
            class="ma-8 text-center"
          >
            <v-icon
              size="150"
              color="green darken-2"
            >
              mdi-check-circle-outline
            </v-icon>  
            <br><br>
            {{ txResult.transactionHash }} 
          </div>       
        </v-card-text>
 
        <!-- <v-btn 
            v-if="step1"
            disabled="true"
            class="text-none ma-4"
            :color="cosmosConfig[store.chainSelected].color"
            prepend-icon="mdi-export-variant" 
            @click="sendFeeGrant()"
            size="large"
          >
            Remove FeeGrant
          </v-btn>  -->
      </v-card>
    </v-dialog>   
    <v-dialog
      v-model="dialogVote" 
      width="500" 
      transition="dialog-top-transition" 
    >
      <v-card> 
        <v-toolbar
          color="rgba(0, 0, 0, 0)"
          theme="dark"
        >
          <template #prepend>
            <v-avatar>
              <v-img
                max-width="32"
                max-height="32"
                :src="cosmosConfig[store.chainSelected].coinLookup.icon"
                alt="John"
              />
            </v-avatar>
          </template>

          <v-toolbar-title class="text-h6">
            Vote
          </v-toolbar-title>

          <template #append>
            <v-btn
              icon="mdi-close"
              @click="dialogVote = false"
            />
          </template>
        </v-toolbar> 
        <v-card-text>     
          <div v-if="step1">
            <v-row dense>
              <v-col
                v-for="vote in voteList"
                :key="vote.title"
                class="mx-auto"
                :cols="vote.flex"
                @click="voteNow(vote.title)"
              >
                <v-sheet
                  border
                  class="ma-2 pa-2"
                  rounded="lg"
                >
                  <v-card-title :v-text="vote.title" />
                </v-sheet>
              </v-col>
            </v-row>
          </div>
 
          <div
            v-if="step2"
            class="ma-8 text-center"
          >
            <v-progress-circular                
              :size="100"
              :width="5"
              :color="cosmosConfig[store.chainSelected].color"
              indeterminate 
              justify="center"
            />   
          </div>
          <div
            v-if="step3"
            class="ma-8 text-center"
          >
            <v-icon
              size="150"
              color="green darken-2"
            >
              mdi-check-circle-outline
            </v-icon>  
            <br><br>
            {{ txResult.transactionHash }} 
          </div>       
        </v-card-text>
 
        <!-- <v-btn 
            v-if="step1"
            disabled="true"
            class="text-none ma-4"
            :color="cosmosConfig[store.chainSelected].color"
            prepend-icon="mdi-export-variant" 
            @click="sendFeeGrant()"
            size="large"
          >
            Remove FeeGrant
          </v-btn>  -->
      </v-card>
    </v-dialog>   
    <v-dialog
      v-model="dialogDelegate" 
      width="500" 
      transition="dialog-top-transition" 
    >
      <v-card> 
        <v-toolbar
          color="rgba(0, 0, 0, 0)"
          theme="dark"
        >
          <template #prepend>
            <v-avatar>
              <v-img
                max-width="32"
                max-height="32"
                :src="cosmosConfig[store.chainSelected].coinLookup.icon"
                alt="John"
              />
            </v-avatar>
          </template>

          <v-toolbar-title class="text-h6">
            Delegate
          </v-toolbar-title>

          <template #append>
            <v-btn
              icon="mdi-close"
              @click="dialogDelegate = false"
            />
          </template>
        </v-toolbar> 
        <v-card-text>     
          <div v-if="step1">
            <span class="mr-2">Select an validator</span>
            <v-sheet 
              v-for="item in store.allValidators" 
              border="md" 
              class="ma-2 pa-2" 
              @click="selectDelValidator(item)"
            >
              <v-list lines="one">
                <v-list-item 
                  :key="item.title"
                  :title="item.description.moniker"
                  :subtitle="'Commission: ' + item.commission.commission_rates.rate * 100 + '%'"
                >
                <!-- {{ item.commission.commission_rates.rate }} -->
                </v-list-item>
              </v-list>   
            </v-sheet>
          </div>
            
          <div
            v-if="step2"
            class="ma-2 "
          >
            <!-- {{ selectedValDel }} -->


            <v-form 
              ref="formDelegate" 
              v-model="formDelegate"
            > 
              <v-text-field
                v-model="delegateAmount" 
                :rules="[rules.required, rules.checkAmount]"
                class="mb-4 mt-2" 
                label="Amount to delegate"
                placeholder="Enter amount"
                variant="outlined" 
              >
                <template #append-inner>
                  <v-chip
                    label
                    small
                    @click="getMax"
                  >
                    Max
                  </v-chip>
                </template>
              </v-text-field>

              <v-text-field
                v-model="delegateTo"  
                label="Address to delegate"
                placeholder="Enter address"
                variant="outlined"
                class="mt-4"
              />
            <!-- <h4 v-if="store.myFeeAllowances.length > 0"> Fee </h4>  
            <v-select
              v-model="feeAllowancesFrom" 
              v-if="store.myFeeAllowances.length > 0"
              label="Select"
              :items="['', store.myFeeAllowances[0].granter]"
              variant="outlined"
            ></v-select> -->
            </v-form>   
            <v-btn   
              :disabled="!formDelegate"  
              :color="cosmosConfig[store.chainSelected].color"
              block
              @click="delegateNow()"
            >
              Delegate
            </v-btn> 
          </div>
          <div
            v-if="step3"
            class="ma-8 text-center"
          >
            <v-progress-circular                
              :size="100"
              :width="5"
              :color="cosmosConfig[store.chainSelected].color"
              indeterminate 
              justify="center"
            />   
          </div>
          <div
            v-if="step4"
            class="ma-8 text-center"
          >
            <v-icon
              size="150"
              color="green darken-2"
            >
              mdi-check-circle-outline
            </v-icon>  
            <br><br>
            {{ txResult.transactionHash }} 
          </div>       
        </v-card-text>
 
        <!-- <v-btn 
            v-if="step1"
            disabled="true"
            class="text-none ma-4"
            :color="cosmosConfig[store.chainSelected].color"
            prepend-icon="mdi-export-variant" 
            @click="sendFeeGrant()"
            size="large"
          >
            Remove FeeGrant
          </v-btn>  -->
      </v-card>
    </v-dialog>   
    <v-dialog
      v-model="dialogAddAuthz" 
      width="500" 
      transition="dialog-top-transition" 
    >
      <v-card> 
        <v-toolbar
          color="rgba(0, 0, 0, 0)"
          theme="dark"
        >
          <template #prepend>
            <v-avatar>
              <v-img
                max-width="32"
                max-height="32"
                :src="cosmosConfig[store.chainSelected].coinLookup.icon"
                alt="John"
              />
            </v-avatar>
          </template>

          <v-toolbar-title class="text-h6">
            Add authz
          </v-toolbar-title>

          <template #append>
            <v-btn
              icon="mdi-close"
              @click="dialogAddAuthz = false"
            />
          </template>
        </v-toolbar> 
        <v-card-text>     
          <div v-if="step1">
            <v-select
              v-model="selectedAuhz"
              label="Select authz"
              :items="['Send', 'Delegate', 'Unbond', 'Redelegate', 'Vote', 'MultiSend']"
              variant="outlined"  
            />  
            <v-text-field
              v-model="authzSendGrantee" 
              :rules="[rules.required, rules.bech32]" 
              label="Gantee address"
              placeholder="Enter address"
              variant="outlined"  
            />
          </div>
          <v-btn 
            v-if="step1"
            class="text-none ma-4"
            :color="cosmosConfig[store.chainSelected].color"
            prepend-icon="mdi-export-variant" 
            size="large"
            @click="sendAddAuthz()"  
          />
            
 
          <div
            v-if="step2"
            class="ma-8 text-center"
          >
            <v-progress-circular                
              :size="100"
              :width="5"
              :color="cosmosConfig[store.chainSelected].color"
              indeterminate 
              justify="center"
            />   
          </div>
          <div
            v-if="step3"
            class="ma-8 text-center"
          >
            <v-icon
              size="150"
              color="green darken-2"
            >
              mdi-check-circle-outline
            </v-icon>  
            <br><br>
            {{ txResult.transactionHash }} 
          </div>       
        </v-card-text>
      </v-card>
    </v-dialog> 
    <v-dialog
      v-model="dialogWithdrawAddress" 
      width="500" 
      transition="dialog-top-transition" 
    >
      <v-card> 
        <v-toolbar
          color="rgba(0, 0, 0, 0)"
          theme="dark"
        >
          <template #prepend>
            <v-avatar>
              <v-img
                max-width="32"
                max-height="32"
                :src="cosmosConfig[store.chainSelected].coinLookup.icon"
                alt="John"
              />
            </v-avatar>
          </template>

          <v-toolbar-title class="text-h6">
            Change your withdraw address
          </v-toolbar-title>

          <template #append>
            <v-btn
              icon="mdi-close"
              @click="dialogWithdrawAddress = false"
            />
          </template>
        </v-toolbar> 
        <v-card-text>     
          <div v-if="step1">
            <v-text-field
              v-model="withdrawAddressToSet" 
              :rules="[rules.required, rules.bech32]" 
              label="Your new withdraw address"
              placeholder="Enter address"
              variant="outlined"  
            />
          </div>
          <v-btn 
            v-if="step1"
            class="text-none mt-4 mb-4"
            :color="cosmosConfig[store.chainSelected].color"
            prepend-icon="mdi-export-variant" 
            size="large"
            block  
            @click="setWithdrawAddressNow()"
          >
            Change address
          </v-btn>
            
 
          <div
            v-if="step2"
            class="ma-8 text-center"
          >
            <v-progress-circular                
              :size="100"
              :width="5"
              :color="cosmosConfig[store.chainSelected].color"
              indeterminate 
              justify="center"
            />   
          </div>
          <div
            v-if="step3"
            class="ma-8 text-center"
          >
            <v-icon
              size="150"
              color="green darken-2"
            >
              mdi-check-circle-outline
            </v-icon>  
            <br><br>
            {{ txResult.transactionHash }} 
          </div>       
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>  
</template>

<script>
import {
  defaultRegistryTypes,
  assertIsDeliverTxSuccess,
  GasPrice,
  calculateFee,
} from "@cosmjs/stargate";
import {
  coins,
} from "@cosmjs/proto-signing";
import bech32 from "bech32";

import { selectSigner } from "~/libs/signer";
import { BasicAllowance } from "cosmjs-types/cosmos/feegrant/v1beta1/feegrant";
import { MsgGrantAllowance } from "cosmjs-types/cosmos/feegrant/v1beta1/tx";
import { GenericAuthorization } from "cosmjs-types/cosmos/authz/v1beta1/authz";
import { MsgRevoke } from "cosmjs-types/cosmos/authz/v1beta1/tx";

import { useAppStore } from '~/stores/data'
import cosmosConfig from '~/cosmos.config' 

function checkBech32Address(address) {
  try {
    bech32.decode(address);
    return true;
  } catch (error) {
    return false;
  }
} 
function checkBech32Prefix(address, chainId) {
  try {
    const { prefix } = bech32.decode(address);
    console.log(prefix);
    console.log(chainId.coinLookup.addressPrefix);
    if (prefix === chainId.coinLookup.addressPrefix) {
      return true;
    }
    // return prefix === cosmosConfig[store.chainSelected].prefix;
  } catch (error) {
    return false;
  }
}
function converteToValidator(address) {
  try {
    const { prefix, words } = bech32.decode(address);
    console.log(words);
    return bech32.encode(prefix + 'valoper', words);
    // return prefix === cosmosConfig[store.chainSelected].prefix;
  } catch (error) {
    return false;
  }
}
function countPlaces(num) {
  const sep = String(23.32).match(/\D/)[0];
  const b = String(num).split(sep);
  return b[1] ? b[1].length : 0;
}

export default {
  name: 'App', 
  props: ['type', 'chain', 'spendableBalances', 'propData', 'authZdata'],
  setup() {
    const store = useAppStore()
    console.log(store.spendableBalances)
    return {
      store
    }
  },
  data: (store) => ({
    cosmosConfig: cosmosConfig,
    dialog: false,
    type: store.type,
    selectedAuhz: '',
    gasFee: 0,
    dialogSendTokens: false,
    dialogFeeGrant: false,
    dialogRemoveFeeGrant: false,
    dialogDelegate: false,
    dialogVote: false,
    dialogAddAuthz: false,
    dialogRemoveAuthz: false,
    dialogWithdrawAddress: false,
    sendAmount: '',
    sendTo: '',
    delegateAmount: '',
    delegateTo: '',
    formSend: false,
    formDelegate: false,
    grantee: '',
    amountFeeGrant: '',
    feeAllowancesFrom: '',
    selectedValDel: '',
    authzSendGrantee: '',
    finalFeeGranter: '',
    withdrawAddressToSet: '',

    rules: {
      required: value => !!value || 'Required.',
      checkAmount: value => value <= store.spendableBalances || ' Not enough funds, you need: ' + store.spendableBalances,
      checkDecimal: value => countPlaces(value) < 7 || "Bad decimal",
      counter: value => value.length <= 20 || 'Max 20 characters', 
      bech32: value => checkBech32Address(value) || 'Bad address (bech32)', 
      bech32Prefix: value => checkBech32Prefix(value, store.chain) || 'Bad prefix', 
    },
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    txResult: '',
    voteList: [
        { title: 'Yes', flex: 5 },
        { title: 'No', flex: 5 },
        { title: 'NoWithVeto', flex: 5 },
        { title: 'Abstain', flex: 5 },
      ],  
    voteValue: null,
  }),
  computed: {

  },
  watch: { 
  },
  mounted() {

  },
  methods: { 

    getMax() {
      this.sendAmount = this.store.spendableBalances
      this.delegateAmount = this.store.spendableBalances
    },
    setAddress() {
      this.sendTo = this.store.addrWallet
    },
    openVote() {
      this.dialogVote = true
    },
    selectDelValidator(item) {
      console.log(item)
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.selectedValDel = item
      this.delegateTo = this.selectedValDel.operator_address 
    },
    openAddAuthz() {
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.dialogAddAuthz = true      
    },
    openDelegate() {
      this.selectedValDel = ''
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.dialogDelegate = true      
    },
    openDelegatorWithdrawAddress() {
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.dialogWithdrawAddress = true      
    },
    async setWithdrawAddressNow() {
      this.step1 = false;
      this.step2 = true;

      const signer = await selectSigner(this.store.chainSelected)  
      

      const foundMsgType = defaultRegistryTypes.find(
        (element) =>
          element[0] ===
          "/cosmos.distribution.v1beta1.MsgSetWithdrawAddress"
      );

      console.log(defaultRegistryTypes)
         const finalMsg = {
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({           
            delegatorAddress: signer.accounts[0].address,
            withdrawAddress: this.withdrawAddressToSet
          }),
        };
        console.log(finalMsg)
        
        try {
          const result = await signer.client.signAndBroadcast(
            signer.accounts[0].address,
            [finalMsg],
            "auto",
            ""
          );
          assertIsDeliverTxSuccess(result);
          console.log(result)
          console.log(result)
          this.txResult = result
          this.step2 = false;
          this.step3 = true;
        } catch (error) {
          console.error(error); 
          this.step2 = false;
          this.step1 = true;
        } 
    },    
    async sendRemoveAuthz() {
      this.step1 = false;
      this.step2 = true;

      const signer = await selectSigner(this.store.chainSelected)     

      const foundMsgType = defaultRegistryTypes.find(
        (element) =>
          element[0] ===
          "/cosmos.authz.v1beta1.MsgRevoke"
      );   
      const finalMsg = {
        typeUrl: foundMsgType[0],
        value: MsgRevoke.fromPartial({           
          granter: this.authZdata.granter,
          grantee: this.authZdata.grantee,
          msgTypeUrl: this.authZdata.finalData.finalType
        }),
      };
      

      try {
        const result = await signer.client.signAndBroadcast(
          signer.accounts[0].address,
          [finalMsg],
          "auto",
          ""
        );
        assertIsDeliverTxSuccess(result);
        console.log(result) 
        await this.store.getAuthzModule()
        this.txResult = result
        this.step2 = false;
        this.step3 = true;
      } catch (error) {
        console.error(error); 
        this.step2 = false;
        this.step1 = true;
      } 
    },
    async sendAddAuthz () {
      this.step1 = false;
      this.step2 = true;
        const signer = await selectSigner(this.store.chainSelected)     

        const foundMsgType = defaultRegistryTypes.find(
          (element) =>
            element[0] ===
            "/cosmos.authz.v1beta1.MsgGrant"
        ); 
 
        console.log(defaultRegistryTypes)
        let finalType = ''
        switch (this.selectedAuhz) {
          case 'Send':
            finalType = '/cosmos.bank.v1beta1.MsgSend'
            break;
          case 'Delegate':
            finalType = '/cosmos.staking.v1beta1.MsgDelegate'
            break;
          case 'Unbond':
            finalType = '/cosmos.staking.v1beta1.MsgUndelegate'
            break;
          case 'Redelegate':
            finalType = '/cosmos.staking.v1beta1.MsgBeginRedelegate'
            break;   
          case 'Vote':
            finalType = '/cosmos.gov.v1beta1.MsgVote'
            break;                                          
          case 'MultiSend':
            finalType = '/cosmos.bank.v1beta1.MsgMultiSend'
            break; 
          default:
            break;
        }

        const authzMsg = {
          typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
          value: GenericAuthorization.encode(GenericAuthorization.fromPartial({
            msg: finalType
          })).finish(),
        };

        const finalMsg = {
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({           
            granter: signer.accounts[0].address,
            grantee: this.authzSendGrantee,
            grant: {
              authorization: authzMsg
            } 
          }),
        };
        console.log(finalMsg)
        
        try {
          const result = await signer.client.signAndBroadcast(
            signer.accounts[0].address,
            [finalMsg],
            "auto",
            ""
          );
          assertIsDeliverTxSuccess(result);
          console.log(result) 
          await this.store.getAuthzModule()
          this.txResult = result
          this.step2 = false;
          this.step3 = true;
          
        } catch (error) {
          console.error(error); 
          this.step2 = false;
          this.step1 = true;
        }
    },
    async delegateNow() {
      this.step1 = false;
      this.step2 = true;

      if (this.delegateNow) { 
        this.step2 = false
        this.step3 = true
        console.log(this.delegateAmount)
        console.log(this.delegateTo)
        
        const signer = await selectSigner(this.store.chainSelected)
        const foundMsgType = defaultRegistryTypes.find(
            (element) =>
              element[0] ===
              "/cosmos.staking.v1beta1.MsgDelegate"
          );
          console.log(foundMsgType)
          
          //const amount = coins(this.delegateAmount * 1000000, cosmosConfig[this.store.chainSelected].coinLookup.chainDenom);
 
          const finalAmount =  {
              denom: cosmosConfig[this.store.chainSelected].coinLookup.chainDenom,
              amount: (this.delegateAmount * 1000000).toString(),
          }
          const finalMsg = {
          typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
              delegatorAddress: signer.accounts[0].address,
              validatorAddress: this.delegateTo,
              amount: finalAmount,
            }),
          }     
          console.log('delegateTx', finalMsg)

          // Fee/Gas
          const gasEstimation = await signer.client.simulate(
            signer.accounts[0].address,
            [finalMsg],
            'Delegate Tokens'
          ); 
          const usedFee = calculateFee(
            Math.round(gasEstimation * cosmosConfig[this.store.chainSelected].feeMultiplier),
            GasPrice.fromString(
              cosmosConfig[this.store.chainSelected].gasPrice +
                cosmosConfig[this.store.chainSelected].coinLookup.chainDenom
            )
          );
          this.gasFee = { fee: (usedFee.amount[0].amount / 1000000), gas: usedFee.gas };
          
          const feeAmount = coins(usedFee.amount[0].amount, cosmosConfig[this.store.chainSelected].coinLookup.chainDenom);
          const finalFee = {
            amount: feeAmount,
            gas: usedFee.gas,
            granter: this.feeAllowancesFrom,
          }
          console.log(finalFee) 
        try {          
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [finalMsg], finalFee, '')
          assertIsDeliverTxSuccess(result)
          console.log(result)
          this.txResult = result
          this.step3 = false;
          this.step4 = true;
        } catch (error) {
          console.error(error); 
          this.step3 = false;
          this.step2 = true;
        }
      }

    },
    async voteNow(vote) {
      this.step1 = false;
      this.step2 = true;
      
      switch (vote) {
        case 'Yes':
          this.voteValue = 1
          break;
        case 'No':
          this.voteValue = 3
          break;
        case 'NoWithVeto':
          this.voteValue = 4
          break;
        case 'Abstain':
          this.voteValue = 2
          break;      
        default:
          break;
      }
      console.log(this.propData)

      const signer = await selectSigner(this.store.chainSelected) 
 
      

        const foundMsgType = defaultRegistryTypes.find(
          (element) =>
            element[0] ===
            "/cosmos.gov.v1beta1.MsgVote"
        );
        const finalMsg = {
          typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({           
            proposalId: this.propData.proposal_id,
            voter: signer.accounts[0].address,
            option: this.voteValue,
          }),
        };
        console.log(finalMsg)
        
        try {
          const result = await signer.client.signAndBroadcast(
            signer.accounts[0].address,
            [finalMsg],
            "auto",
            ""
          );
          assertIsDeliverTxSuccess(result);
          console.log(result)
          console.log(result)
          this.txResult = result
          this.step2 = false;
          this.step3 = true;
        } catch (error) {
          console.error(error); 
          this.step2 = false;
          this.step1 = true;
        } 



    },
    async openSendTokens() {
      this.dialogSendTokens = true
      this.sendAmount = ''
      this.sendTo = ''
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
    },
    async calculateSendFee () {
      this.step1 = false;
      this.step2 = true;
      const signer = await selectSigner(this.store.chainSelected, this.store.loggedType)

      const foundMsgType = defaultRegistryTypes.find(
        (element) =>
          element[0] ===
            "/cosmos.bank.v1beta1.MsgSend"
      );
          
        const amount = coins(1 * 1000000, cosmosConfig[this.store.chainSelected].coinLookup.chainDenom);
        const finalMsg = {
        typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            fromAddress: signer.accounts[0].address,
            toAddress: signer.accounts[0].address,
            amount: amount,
          }),
        }     
        console.log('sendTx', finalMsg)

        // Fee/Gas
        const gasEstimation = await signer.client.simulate(
          signer.accounts[0].address,
          [finalMsg],
          'Send Tokens'
        ); 
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.chainSelected].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.chainSelected].gasPrice +
              cosmosConfig[this.store.chainSelected].coinLookup.chainDenom
          )
        );
        this.gasFee = { fee: (usedFee.amount[0].amount / 1000000), gas: usedFee.gas };


    },
    async sendNow() {
      this.step2 = false;
      this.step3 = true;

      //const { valid } = await this.$refs.formSend.validate()
      //console.log(valid)
      if (this.formSend) { 
        console.log(this.sendAmount)
        console.log(this.sendTo) 
        const signer = await selectSigner(this.store.chainSelected, this.store.loggedType)
        const foundMsgType = defaultRegistryTypes.find(
            (element) =>
              element[0] ===
              "/cosmos.bank.v1beta1.MsgSend"
          );
          
          const amount = coins(this.sendAmount * 1000000, cosmosConfig[this.store.chainSelected].coinLookup.chainDenom);
          const finalMsg = {
          typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
              fromAddress: signer.accounts[0].address,
              toAddress: this.sendTo,
              amount: amount,
            }),
          }     
          console.log('sendTx', finalMsg)

          // Fee/Gas
          const gasEstimation = await signer.client.simulate(
            signer.accounts[0].address,
            [finalMsg],
            'Send Tokens'
          ); 
          const usedFee = calculateFee(
            Math.round(gasEstimation * cosmosConfig[this.store.chainSelected].feeMultiplier),
            GasPrice.fromString(
              cosmosConfig[this.store.chainSelected].gasPrice +
                cosmosConfig[this.store.chainSelected].coinLookup.chainDenom
            )
          );
          this.gasFee = { fee: (usedFee.amount[0].amount / 1000000), gas: usedFee.gas };
          
          const feeAmount = coins(usedFee.amount[0].amount, cosmosConfig[this.store.chainSelected].coinLookup.chainDenom);
          const finalFee = {
            amount: feeAmount,
            gas: usedFee.gas,
            granter: this.finalFeeGranter,
          }
          console.log(finalFee) 
        try {          
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [finalMsg], finalFee, '')
          assertIsDeliverTxSuccess(result)
          console.log(result)
          this.txResult = result
          this.step3 = false;
          this.step4 = true;
        } catch (error) {
          console.error(error); 
          this.step3 = false;
          this.step2 = true;
        }
      }

    },
    async openValidatorRewards() {   
      const signer = await selectSigner(this.store.chainSelected)
      const foundMsgType = defaultRegistryTypes.find(
          (element) =>
            element[0] ===
            "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission"
        );
        const valAddress = converteToValidator(signer.accounts[0].address) 
          
        const withdrawValidatorCommissionMsg = {
        typeUrl: foundMsgType[0],
          value: foundMsgType[1].fromPartial({
            validatorAddress: valAddress
          }),
        }    
        
        const gasEstimation = await signer.client.simulate(
          signer.accounts[0].address,
          [withdrawValidatorCommissionMsg],
          'withdrawValidatorCommissionMsg'
        ); 
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.chainSelected].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.chainSelected].gasPrice +
              cosmosConfig[this.store.chainSelected].coinLookup.chainDenom
          )
        );
        this.gasFee = { fee: (usedFee.amount[0].amount / 1000000), gas: usedFee.gas };
        console.log(this.gasFee)
            
        try {          
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [withdrawValidatorCommissionMsg], "auto", '')
          assertIsDeliverTxSuccess(result)
          console.log(result)
        } catch (error) {
          console.error(error); 
        }
    },
    async openRewards() {
      this.dialog = true
      const signer = await selectSigner(this.store.chainSelected)
      const foundMsgType = defaultRegistryTypes.find(
          (element) =>
            element[0] ===
            "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
        );
        const finalMsg = [];
        this.store.totalDelegationsRewards.forEach(function (item) {
          finalMsg.push({
            typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
              delegatorAddress: signer.accounts[0].address,
              validatorAddress: item.validatorAddress,
            }),
          });
        });
        const gasEstimation = await signer.client.simulate(
          signer.accounts[0].address,
          finalMsg,
          ''
        );
        const usedFee = calculateFee(
          Math.round(gasEstimation * cosmosConfig[this.store.chainSelected].feeMultiplier),
          GasPrice.fromString(
            cosmosConfig[this.store.chainSelected].gasPrice +
              cosmosConfig[this.store.chainSelected].coinLookup.chainDenom
          )
        );
        this.gasFee = { fee: (usedFee.amount[0].amount / 1000000), gas: usedFee.gas };
        if(this.store.spendableBalances < this.gasFee.fee) {
          this.canRewards = false;
        } else {
          this.canRewards = true;
        } 
        console.log(this.store.spendableBalances, this.gasFee.fee)
    },
    async getRewards() {
        this.step1 = false;
        this.step2 = true;
        const signer = await selectSigner(this.store.chainSelected) 
        console.log( signer.accounts)
        const foundMsgType = defaultRegistryTypes.find(
          (element) =>
            element[0] ===
            "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
        );
        const copieDelegator = [];
        this.store.totalDelegationsRewards.forEach(function (item) {
          
          copieDelegator.push({
            typeUrl: foundMsgType[0],
            value: foundMsgType[1].fromPartial({
              delegatorAddress: signer.accounts[0].address,
              validatorAddress: item.validatorAddress,
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
          console.log(result)
          console.log(result)
          this.txResult = result
          this.step2 = false;
          this.step3 = true;
        } catch (error) {
          console.error(error); 
          this.step2 = false;
          this.step1 = true;
        }
    },
    openRemoveAuthz() {
      this.dialogRemoveAuthz = true
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
    },
    openRemoveFeeGrant() {
      this.dialogRemoveFeeGrant = true
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
    },
    async openFeeGrant() {
      this.dialogFeeGrant = true
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.grantee = ''
      this.amountFeeGrant = ''
    },
    async sendFeeGrant() {
      this.step1 = false;
      this.step2 = true;
      console.log(this.grantee)
      console.log(this.amountFeeGrant)

      const signer = await selectSigner(this.store.chainSelected)
        // Create feegrant allowance
        const allowance = {
          typeUrl: "/cosmos.feegrant.v1beta1.BasicAllowance",
          value: Uint8Array.from(
            BasicAllowance.encode({
              spendLimit: [
                {
                  denom: cosmosConfig[this.store.chainSelected].coinLookup.chainDenom,
                  amount: (this.amountFeeGrant * 1000000).toString(),
                },
              ],
            }).finish(),
          ),
        }; 
        
        
        const grantMsg = {
          typeUrl: "/cosmos.feegrant.v1beta1.MsgGrantAllowance",
          value: MsgGrantAllowance.fromPartial({
            granter: signer.accounts[0].address, // Signer is the granter
            grantee: this.grantee, // The address of the grantee
            allowance: allowance,
          }),
        };
        console.log(grantMsg)  
        //const fee = 1.5; // See https://github.com/cosmos/cosmos-sdk/issues/16020
        // const grantResult = await signer.client.signAndBroadcast(signer.accounts[0].address, [grantMsg], 'auto', "Create allowance");  
        try {
          const result = await signer.client.signAndBroadcast(signer.accounts[0].address, [grantMsg], 'auto', "");  
          assertIsDeliverTxSuccess(result);
          console.log(result) 
          this.txResult = result
          this.step2 = false;
          this.step3 = true;
        } catch (error) {
          console.error(error); 
          this.step2 = false;
          this.step1 = true;
        }
    },
    truncate(
      fullStr,
      strLen = 16,
      separator = ".........",
      frontChars = 8,
      backChars = 8
    ) {
      if (fullStr.length <= strLen) return fullStr;

      return (
        fullStr.substr(0, frontChars) +
        separator +
        fullStr.substr(fullStr.length - backChars)
      );
    }    
  }
}   
</script>