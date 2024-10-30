<br/>
<p align="center">
  <h3 align="center">WeedWallet</h3>

  <p align="center">
    Welcome on the page for the readme for the testversion of our new webwallet, codename "WeedWallet"! On this page you'll find information about the webwallet, the underlying technology, and more.
    <br/>
    <br/>
    Find the WeedWallet <a href="https://wallet-testnet.bitcanna.io/login">here</a>.


## About The Wallet

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*6OPpDYowRWDtK6bnMG0Dnw.png)

Our WeedWallet is exclusively for the use of the BitCanna blockchain. This webwallet runs on Cosmos SDK 0.46.* and is compatible with the BitCanna devnet-1. It allows to use the main functionalities of Cosmos (send, receive, delegate, undelegate, redelegate, vote) and to display the main data of a BitCanna wallet.

During the testing of this new webwallet you are encouraged to use all the functions at your disposal to test all functionalities and stress test the wallet. Bugs, enhancements and other suggestions can all be mentioned on our github location which you can find <a href="https://github.com/BitCannaGlobal/WeedWallet">here</a>.

Please read <a href="https://github.com/BitCannaGlobal/WeedWallet/discussions/54">this thread on the Discussion page</a> to check how to record a new entry to discuss what is found and how to proceed. 
    
**TL:DR:**
* start new discussion on Github
* find desired solution through conversation with other testers and the BitCanna team
* convert discussion into issue (test results and final conclusion is gathered on the issue log)
* close issue (by either being solved or rejected)

**NOTE: we are working on the design, this will be implemented in the coming period. So ideas about design are not relevant at this stage, since it will get an overhaul anyway.**

### Portfolio page
This page gives an overview of the wallet. The total value of the wallet (taking into account available funds, but also delegated, unbonding and staking rewards). The current $BCNA price (as value, but also as graph of the price action of the past 5 days) as well as the APR on the chain is shown. Finally, a pie chart with the breakdown of the wallet in the various categories is visualised.
### Validators page
The Validators page gives an overview of the chain in terms of the validators securing it and your delegations to a selected subset of the validators. You can claim your rewards here and perform additional actions as delegating, redelegating and undelegating.
### Proposals page
The Proposals page gives insight in the active and past governance proposals. You can select a proposal to get more details and to cast your vote.
### Transactions page
The history of your wallet address is shown on the Transactions page. All the actions done using your wallet are shown and tagged with the type of action done (delegate, undelegate, redelegate, etc.). By clicking on a transaction more information can be shown.
### My NFTs page
The My NFTs page contains an overview of our NFT collection "BitCanna Buddheads". Based on your address we derive your stars-address and show Buddheads if you have any.
### Create proposal page
This is a temporary page only available during the testing of the webwallet. It makes it easier to create proposals on chain to be able to test voting proprely.
### Get BCNA page
And lastly a page which is important when we want to onboard as many new users as possible; a page showing where you can get $BCNA. Links to the respective exchanges are included, which will open in a separate tab in your browser.

## Developers
### Built With

For the creation of this webwallet, we used several technologies:

- NuxtJs  
- Vuetify  
- CosmJs  

### Getting Started

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

#### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* npm
* nodejs

```shell
sudo apt install nodejs
```

```shell
npm install npm@latest -g
```

#### Installation

1. Clone the repo

```sh
git clone https://github.com/BitCannaGlobal/WeedWallet.git
```

2. Go in folder

```sh
cd WeedWallet/
```

3. Install NPM packages

```sh
npm install
```

4. Run the webwallet

```JS
npm run dev
```

#### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
    
## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```    

## License

Distributed under the Apache License 2.0. See [LICENSE](https://github.com/BitCannaGlobal/WeedWallet/blob/main/LICENSE) for more information.

## Authors

* **atmon3r** - *Full dev of BitCanna* - [Github](https://github.com/atmoner) 

# Instructions with Docker-composer
Docker-composer allows you to run the three different configurations for each chain (bitcanna-1, devnet-1 & devnet-6) using the same Docker Image. Alternatively you can run a simple Docker Image to raise a MainNET Wallet.

## Bitcanna-1 MainNET 

### Docker-compose
```sh
docker-compose --profile bitcanna-1 up -d
```

### Run Docker Hub image
Alternatively you can run a simple Docker Image to raise a MainNET Wallet.

```sh
docker run -d -p 4200:3000 --name wallet-mainnet bernalraul/weedwallet:mainnet
```

#### Logs check:
- `docker container  logs wallet-mainnet`

#### Stop and remove data
- `docker-compose --profile bitcanna-1 down`

#### Create the systemd file:
As the container has always the same name, we can start & stop & restart it
```bash
cat <<'EOF' >>wallet-mainnet.service
[Unit]
Description=wallet-mainnet container  
Requires=docker.service  
After=docker.service

[Service]
Restart=always  
ExecStart=/usr/bin/docker start -a wallet-mainnet 
ExecStop=/usr/bin/docker stop -t 2 wallet-mainnet

[Install]
WantedBy=default.target
EOF
```

## BitCanna Devnet-1 (same for Devnet-6 replacing by that name)
It is the same Image but the App is rebuilt with DEVNET-1 config. Only with Docker-composer

### Docker-compose
```sh
docker-compose --profile devnet-1 up -d
```

#### Logs check:
- `docker container  logs wallet-devnet`

#### Stop and remove data
- `docker-compose --profile devnet-1 down`

#### Create the systemd file:
As the container has always the same name, we can start & stop & restart it
```bash
cat <<'EOF' >>wallet-devnet-1.service
[Unit]
Description=wallet-devnet-1 container  
Requires=docker.service  
After=docker.service

[Service]
Restart=always  
ExecStart=/usr/bin/docker start -a wallet-devnet-1 
ExecStop=/usr/bin/docker stop -t 2 wallet-devnet-1

[Install]
WantedBy=default.target
EOF
```
