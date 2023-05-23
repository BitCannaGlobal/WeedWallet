<template>
  <v-item-group active-class="primary">
    <v-container>
      <v-row
        justify="center"
        align="center"
      >
        <v-col 
          cols="12"
          sm="8"
          md="8"
        >
          <p class="text-center text-h2">
            Buy BitCanna
          </p>
          <sequential-entrance>
            <v-card          
              dark 
              class="pa-2 mb-4" 
              href="https://coinmerce.io/en/bitcanna/"
              target="_blank"
            >
              <v-card-title>coinmerce.io</v-card-title>   
              <v-img
                height="90"
                width="90"
                class="ml-8"
                src="coinmerce.png"
              /> 
              <v-card-actions class="pt-0">
                <v-spacer />
                <v-btn
                  text
                  color="teal accent-4" 
                >
                  Buy on coinmerce
                </v-btn>
              </v-card-actions>        
            </v-card>
          </sequential-entrance>
          <sequential-entrance from-left>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-item>
                  <v-card
                    class="pa-2 mb-4" 
                    dark
                    height="200"
                    href="https://app.osmosis.zone/pool/571"
                    target="_blank"
                  >
                    <v-card-title>osmosis.zone</v-card-title>
                    <div class="parent"> 
                      <div class="child child2">
                        <v-img
                          height="90"
                          width="90"
                          class="ml-8"
                          src="https://app.osmosis.zone/tokens/bcna.svg"
                        />
                      </div>  
                      <div class="child">
                        <v-img
                          height="90"
                          width="90"
                          class="ml-8"        
                          src="https://app.osmosis.zone/tokens/atom.svg"
                        /> 
                      </div>
                    </div>
                    <v-card-actions class="pt-0">
                      <v-spacer />
                      <v-btn
                        text
                        color="teal accent-4" 
                      >
                        Buy on pool 571
                      </v-btn>
                    </v-card-actions>  
                  </v-card>
                </v-item>
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-item>
                  <v-card
                    class="pa-2 mb-4" 
                    dark
                    height="200"
                    href="https://app.osmosis.zone/pool/572"
                    target="_blank"
                  >
                    <v-card-title>osmosis.zone</v-card-title>
                    <div class="parent"> 
                      <div class="child child2">
                        <v-img
                          height="90"
                          width="90"
                          class="ml-8"
                          src="https://app.osmosis.zone/tokens/bcna.svg"
                        />
                      </div>  
                      <div class="child">
                        <v-img
                          height="90"
                          width="90"
                          class="ml-8"        
                          src="https://app.osmosis.zone/tokens/osmo.svg"
                        /> 
                      </div>
                    </div>
                    <v-card-actions class="pt-0">
                      <v-spacer />
                      <v-btn
                        text
                        color="teal accent-4" 
                      >
                        Buy on pool 572
                      </v-btn>
                    </v-card-actions>  
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </sequential-entrance>
          <sequential-entrance>
            <v-card          
              dark 
              class="pa-2 mb-4" 
              href="https://app.rango.exchange/swap/COSMOS.ATOM/OSMOSIS.BCNA--ibc%2Fd805f1da50d31b96e4282c1d4181eddfb1a44a598bff5666f4b43e4b8bea95a5/"
              target="_blank"
            >
              <v-card-title>Rango.exchange</v-card-title>    
              <v-img
                height="90"
                width="90"
                class="ml-8"
                src="https://assets.coingecko.com/coins/images/24735/large/tFBWVfzA.png?1648765730"
              /> 
              <v-card-actions class="pt-0">
                <v-spacer />
                <v-btn
                  text
                  color="teal accent-4" 
                >
                  Buy on Rango
                </v-btn>
              </v-card-actions>        
            </v-card>  
          </sequential-entrance>
        </v-col> 
      </v-row> 
    </v-container>
  </v-item-group>
</template> 

<style>
 

.parent {
  display: grid;
 
}

.child {
  grid-area: 1 / 1 / 2 / 2;  
  width: 250px;
}

.child2 {
  margin-left: 50px;
}
</style>