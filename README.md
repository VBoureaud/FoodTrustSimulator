![Banner](./front/assets/images/banner.png)

# FoodTrust Simulator XRPL

A project developed during XRPL Hackathon 2022, which attempts to illustrate the interactions and traceability around the food sphere in a blockchain ecosystem proposed by XRPL.

It works as a game where everyone with an XRPLedger account can play on the NFT-Devnet. The game offers possibilities to mint nftTokens which refer to unique ingredients. Then you can trade with others on the plateform. The main functionality lies in the traceability of ingredients during exchanges, thanks to the management of URIs implemented according to EIP-1155.


## Table of Contents
1. [Dependencies](#dependencies)
2. [How does it work ?](#how-does-it-work-?)
3. [Installation & launch](#installation-&-launch)
4. [Documentation](#documentation)
5. [Tests](#test)
6. [Demo](#demo)
7. [In the Future](#in-the-future)
8. [Known issues](#known-issues)
8. [Credits](#credits)
9. [Contributing](#contributing)
10. [License](#license)


## Usage

#### Dependencies

Before running FoodTrust Simulator the following dependencies need to be installed.

| Dependencies | Version |
| ------------ | ------- |
| NodeJS       | 14+     |
| MongoDB      | 5+      |


### How does it work ?

Use your XRPL Account on the web application in pair with game server.
Both communicate with XRPLedger, with a WebSocket from the front and JSON-RPC requests from the server, to manage the account and maintain consistency.
Authentication is not yet integrated with Xumm. You will need to provide your secret credentials for each required action, as we never save them. 

When you mint a new token, it's registered in XRPL and on the game server where the link between them is the generated URI as follow:
```
rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2 1647343480246 000005
+--------------------------------- +------------ +-----
|                                  |             |
|                                  |             `---> Type: Flag to identify token in game
|                                  |`---> Date: Timestamp
`---> Creator: XRPL Account Address
```
On XRPL, see how NFT works: [official XLS-20d Non-Fungible Token documentation](https://github.com/XRPLF/XRPL-Standards/discussions/46).
On Game Server, URI metaData is implemented by following [ERC-1155 Metadata](https://eips.ethereum.org/EIPS/eip-1155).

### Installation & launch

```bash
$ cd front
$ npm install
$ npm start
```

```bash
$ cd server
$ npm install
$ npm run dev
```
If you want an AutoCompletion for location when you Sign Up, before starting the server you can seed it:

```bash
$ cd server
$ npm run seeddb
```

### Documentation

When the server is launched in development mode, you can find Swagger Documentation at localhost:3002/v1/docs/


### Tests
You can find a list of tests for the server, developed with Jest. 
To launch them you need to modify the .env and add two XRPL addresses and two NFT Tokens belonging to the first XRPL address.  
```bash
$ cd server
$ npm run test
```

### Demo

There is a live demo running on NFT-Devnet. You can find it [here](https://foodtrust.boureaud.com/)
It is hosted on Heroku, MongoDB Atlas and OVH.

### In the Future
Still a lot of ideas that I would like to implement:

| Ideas        |
|--------------|
| Warn when you update a level |
| Warn when you win a new badge |
| Warn when a offer is accepted |
| Subscribe to the transaction of your XRPL account to be notified when you have a new offer |
| View your quest & progress in the navigation bar |
| Show user-buildable ingredients directly in MarketPage |
| Trade NFTokens directly, without XRP Currency |
| Deadline for offers |
| New and more mini-games |
| Dont scroll back when you click on an User profil from Market Page and come back |

### Known issues
To be corrected in the next version. 

| Issues       |
|--------------|
| Sign up with an account that already has an nfts collection will break the count  |
| Leaving the website while creating a new NFT may lose the URI on game server.  |

Find an issue ? Contact me at valentin@boureaud.com

## Credits
Some awesome libraries/projects help power this one:

* [P5](https://github.com/processing/p5.js/), for mini-games
* [React-Simple-Maps](https://github.com/zcreativelabs/react-simple-maps), for WorldMap design and interactions
* [Material-UI](https://github.com/mui/material-ui), for the global design of the web app
* [TypeScript](https://www.typescriptlang.org/), write JS with syntax for types
* [Express](http://expressjs.com/) - Fast node.js network app framework
* [Node.js](http://nodejs.org/) - Evented I/O for the backend
* [Reactjs](https://reactjs.org) - Library for building user interfaces
* [Front Boilerplate](https://github.com/codesbiome/react-webpack-typescript-2022)
* [Server Boilerplate](https://github.com/codesbiome/react-webpack-typescript-2022)
* [List of Cities](https://github.com/lutangar/cities.json)
* and many more.. look at package.json

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

##


![Transactions](./front/assets/images/transactions.png)