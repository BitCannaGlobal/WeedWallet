<template>
  <v-item-group active-class="primary">
    <v-container>
      <v-row
        justify="center"
        align="center"
      >
        <v-col 
          cols="12"
        >
          <v-row class="ma-2">
            <h1>
              Buy BCNA
            </h1>
            <v-spacer />
          </v-row>
          <v-divider class="mb-6" />
          <ChartsBar />
          <br /><br />
          <v-row>
            <v-col 
              cols="12"
              sm="6"
              md="6"
            > 
              <v-card     
                height="95"      
                dark 
                class="pa-4 mb-4" 
                href="https://coinmerce.io/en/bitcanna/"
                target="_blank"
              >
                <v-row
                  justify="center"
                  align="center"
                >
                  <v-col 
                    cols="12"
                    sm="2" 
                  >                   
                    <v-img
                      height="52"
                      width="52"
                      class="ml-4 mt-2"
                      src="coinmerce.png"
                    /> 
                  </v-col> 
                  <v-col 
                    cols="12"
                    sm="6"
                    class="mt-2" 
                  >                   
                    <h3>Coinmerce</h3>
                  </v-col> 
                  <v-col 
                    cols="12"
                    sm="4" 
                  >                   
                    <v-btn
                      block
                      x-large
                      class="mr-4"
                      color="#0EB584"
                    >
                      Buy here
                    </v-btn>
                  </v-col> 
                </v-row>
              </v-card> 
            </v-col> 
            <v-col 
              cols="12"
              sm="6"
              md="6"
            > 
              <v-card     
                height="95"      
                dark 
                class="pa-4 mb-4" 
                href="https://app.osmosis.zone/?from=USDC&to=BCNA"
                target="_blank"
              >
                <v-row
                  justify="center"
                  align="center"
                >
                  <v-col 
                    cols="12"
                    sm="2" 
                  >                   
                    <v-img
                      height="52"
                      width="52"
                      class="ml-4 mt-2"
                      src="icons/osmosis.svg"
                    /> 
                  </v-col> 
                  <v-col 
                    cols="12"
                    sm="6"
                    class="mt-2" 
                  >                   
                    <h3>Osmosis</h3>
                  </v-col> 
                  <v-col 
                    cols="12"
                    sm="4" 
                  >                   
                    <v-btn
                      block
                      x-large
                      class="mr-4"
                      color="#0EB584"
                    >
                      Buy here
                    </v-btn>
                  </v-col> 
                </v-row>
              </v-card> 
            </v-col>              
            <v-col 
              cols="12"
              sm="6"
              md="6"
            > 
              <v-card     
                height="95"      
                dark 
                class="pa-4 mb-4" 
                href="https://app.rango.exchange/swap/COSMOS.ATOM/OSMOSIS.BCNA--ibc%2Fd805f1da50d31b96e4282c1d4181eddfb1a44a598bff5666f4b43e4b8bea95a5/"
                target="_blank"
              >
                <v-row
                  justify="center"
                  align="center"
                >
                  <v-col 
                    cols="12"
                    sm="2" 
                  >                   
                    <v-img
                      height="52"
                      width="52"
                      class="ml-4 mt-2"
                      src="icons/rango.png"
                    /> 
                  </v-col> 
                  <v-col 
                    cols="12"
                    sm="6"
                    class="mt-2" 
                  >                   
                    <h3>Rango</h3>
                  </v-col> 
                  <v-col 
                    cols="12"
                    sm="4" 
                  >                   
                    <v-btn
                      block
                      x-large
                      class="mr-4"
                      color="#0EB584"
                    >
                      Buy here
                    </v-btn>
                  </v-col> 
                </v-row>
              </v-card> 
            </v-col>
          </v-row>
          <!--          <sequential-entrance>
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
          <sequential-entrance>
            <v-card          
              dark 
              class="pa-2 mb-4" 
              href="https://app.osmosis.zone/?from=USDC&to=BCNA"
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
                    src="https://app.osmosis.zone/tokens/usdc.svg"
                  /> 
                </div>
              </div>
              <v-card-actions class="pt-0">
                <v-spacer />
                <v-btn
                  text
                  color="teal accent-4" 
                >
                  Buy on osmosis
                </v-btn>
              </v-card-actions>        
            </v-card>
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
          </sequential-entrance> -->
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