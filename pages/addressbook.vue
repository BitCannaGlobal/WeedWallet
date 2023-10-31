<template>
  <v-container>
  <v-btn size="large" color="#0FB786" class="mb-4" @click="openDial()">
    Add contact
  </v-btn> 
<v-card v-for="(item, index) in store.myAddressBook" class="mb-4">


    <v-list v-if="store.myAddressBook.length > 0" lines="two" >
 
      <v-list-item      
        :key="item.name"
        :title="item.name"
        :subtitle="item.address"
      >
 
        <template v-slot:prepend>
          <v-avatar color="#0FB786">
            <v-icon color="white">mdi-account</v-icon>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-btn
            color="red"
            icon="mdi-close-box"
            variant="text"
            @click.stop="removeContact(index)"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
 
    <v-dialog
      v-model="dialog"  
      transition="dialog-bottom-transition"
      max-width="600px"
    >
 
      <v-card color="#161819">

        <v-form ref="form"> 
        <v-toolbar 
          color="#1C1D20"
          theme="dark"
        > 
        <template v-slot:prepend>
              <v-avatar>
                  <v-img
                    max-width="32"
                    max-height="32"
                    :src="cosmosConfig[0].coinLookup.icon"
                    alt="Bitcanna"
                  ></v-img>
                </v-avatar>
            </template>
          <v-toolbar-title>Add contact</v-toolbar-title> 
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <!-- <v-divider></v-divider>
        <v-list
          lines="two"
          subheader
        >
          <v-list-item title="Add new contact" subtitle="Add new contact in your addressbook"></v-list-item>
        </v-list>
         -->
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <h3 class="mt-1 ml-1 mb-3">
              Name
            </h3>
            <v-text-field
                v-model="name"
                :rules="nameRules"
                variant="outlined"
                color="#00b786" 
                class="mt-2" 
                
            ></v-text-field>
          </v-list-item>
        <v-list-item>       
            <h3 class="mt-1 ml-1 mb-3">
              Address
            </h3>  
            <v-text-field
                v-model="recipient"
                :rules="addressRules"
                variant="outlined"
                color="#00b786"  
                class="mt-4" 
 
            ></v-text-field>
          </v-list-item>  
          <v-list-item>
            <v-btn 
            size="large"   
              block 
              color="#0FB786"
              :disabled="loading"
              :loading="loading"
              @click="addContact()
            ">Add contact</v-btn>
          </v-list-item>
        </v-list>   
      </v-form>
 
      </v-card>
    </v-dialog>
 


  </v-container>
</template>
<script>
import { useAppStore } from '@/stores/data'
import cosmosConfig from "~/cosmos.config";

//import { addContact, getAllContact, removeContactId } from '@/libs/storage.js';

  export default {
    data: () => ({
      dialog: false,
      cosmosConfig: cosmosConfig,
      notifications: false,
      removeScan: false,
      recipient: '',
      allContacts: [],
      files: [
        {
          color: '#0FB786',
          icon: 'mdi-account',
          subtitle: 'bcna13jawsn574rf3f0u5rhu7e8n6sayx5gkwgusz73',
          title: 'atmon3r',
        },
        {
          color: '#0FB786',
          icon: 'mdi-account',
          subtitle: 'bcna148ml2tghqkfvzj8q27dlxw6ghe3vlmprhru76x',
          title: 'Wallet1',
        },
      ]
    }),
    setup() {
    const store = useAppStore()
      return {
        store
      }
    },
    async mounted() { 
      await this.store.addressBook('getAllContact')
      let addressBook = this.store.myAddressBook
      console.log(addressBook)
    },
    methods: {
      removeContact(index) {
        removeContactId(index)
        this.allContacts.splice(index, 1)
      },
      openDial() {
        this.dialog = true
        this.name = ''
        this.recipient = ''
        this.removeScan = false
      },
      async addContact() {
        this.dialog = false
        /* await addContact(this.name, this.recipient)
        let getAllContacts = await getAllContact()
        this.allContacts =  JSON.parse(getAllContacts) */
        this.store.addressBook('addContact', { name: this.name, address: this.recipient})
        this.store.getAddressBook()
      },
       
      truncateString(str, num) {
        if (str.length <= num) {
          return str
        }
        return str.slice(0, num) + '...'
      },
    },
  }
</script>