import React, { useState, useEffect } from 'react'

import BasicModal from "./Modal";

import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from "@mui/material/CircularProgress";

import { limitGame } from "@utils/gameEngine";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: 1,
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(2em)`,
    width: '100%',
    height: '32px',
  },
}));
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '4px',
  backgroundColor: '#d9d9d9',
  '&:hover': {
    backgroundColor: '#333',
  },
  width: '100%',
  maxWidth: '235px',
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: 2,
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const faqReference: {[key: string]: number} = {
  'Blockchain': 1,
  'XRPL': 2,
  'XRPL Account': 3,
  'Wallets': 4,
  'Transactions': 5,
  'Fees': 6,
  'Token': 7,
  'NFTs': 8,
  'Ownership': 9,
  'Mint': 10,
  'Uri': 11,
  'Burn': 12,
  'Create an account': 13,
  'Profiles': 14,
  'Choose a Location': 15,
  'Play': 16,
  'Puzzle': 17,
  'Mix': 18,
  'Freeze': 19,
  'Bake': 20,
  'Recipe': 21,
  'Coin': 22,
  'Ad': 23,
  'Box': 24,
  'Collection': 25,
  'Longevity': 26,
  'Power': 27,
  'Family Tree': 28,
  'Quest': 29,
  'Experience': 30,
  'Level': 31,
  'Badges': 32,
  'Burnout': 33,
  'Notifications': 34,
  'NFT transactions': 35,
  'Buy a token when pocket are full': 36,
  'DashBoard': 37,
  'Logout': 38,
  'Collection Remote': 39,
  'Market': 40,
  'Limitations': 41,
  'Report an issue': 42,
  'Terms of Service': 43,
  'Privacy Policy': 44,
};

const categoryReference: {[key: string]: { background: string; border: string; }} = {
  'What is it': { background: '#a3ff474d', border: '1px solid #a3ff47' },
  'How to play': { background: 'rgba(71, 117, 255, 0.29)', border: '1px solid #6f47ff' },
  'How to help': { background: '#ff63474a', border: '1px solid tomato' },
  'Read more': { background: '#ffda477a', border: '1px solid #ffda47' },
}

export const faqData: {[key: string]: { category: string; content: string; }} = {
  'Blockchain': {
    category: 'What is it',
    content: `
      A distributed ledger with growing lists of records (called block) that are securely linked  together via cryptographic hashes. Each block contains a cryptographic hash of the previous block, a timestamp and transaction data. The timestamp proves that the transaction data existed   when the block was created. Since each block contains information about the previous block, they effectively from a chain, with each additionnal block linking to the ones before it. Consequently, blockchain transactions are irreversible in that, once they are recorded, the data in any given block cannot be altered retroactively without altering all subsequent block.
      <br/>
      Blockchain technology has been compared to the Internet itself in both form and impact. Some have said this tool may change society as we know it. Blockchains are being used to create autonomous computer programs known as “smart contracts,” to expedite payments, to create financial instruments, to organize the exchange of data and information, and to facilitate interactions between humans and machines. The technology could affect governance itself, by supporting new organizational structures that promote more democratic and participatory decision making.
    `,
  },
  'XRPL': {
    category: 'What is it',
    content: `
      The XRP Ledger (XRPL) is a decentralized, public blockchain led by a global developer community. It’s fast, energy efficient, and reliable. With ease of development, low transaction costs, and a knowledgeable community, it provides developers with a strong open-source foundation for executing on the most demanding projects—without hurting the environment.
    `,
  },
  'XRPL Account': {
    category: 'What is it',
    content: `
      Each XRP holder and sender of transactions is identified by an unique address (ex:rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn). This address corresponds to the description of an "Account".
    `,
  },
  'Wallets': {
    category: 'What is it',
    content: `
      A blockchain wallet is a software that enables sending and receiving cryptocurrencies. It stores the record of transactions and also public and private keys which are used to perform transactions.<br/>
      A public key is similar to an account number. If A wants to send some XRP to B when A sends the public key address to B. Anyone can send XRP using the public key.<br/> 
      A private key is similar to an account password. Only the account holder knows the private key. The private key is used to send money.<br/>
      Public-Private keys are always present in pairs. A traditional wallet stores the currency. While a blockchain wallet never stores any cryptocurrencies. It contains the record of transactions performed by the users. It also stores the public and private keys of the user.<br/>
      On Food Trust Simulator, you can use Xumm Wallet, Gem Wallet or no wallet at all, with the bridge solution.<br/>
    `,
  },
  'Transactions': {
    category: 'What is it',
    content: `
      A transaction is a transfer of value on the blockchain.<br/>
      When you try to do a transaction on-chain, several steps are raised:<br/>
      - Someone requests a transaction.<br/>
      - Transaction is broadcast to all P2P participation computers in the specific blockchain network. These are called Nodes that will verify the transaction.<br/>
      - Every computer in the network checks the transaction against some validation rules that are set by the creators of the specific blockchain network.<br/>
      - Validated transactions are stored into a block and are sealed with a lock referred to as the Hash.<br/>
      - New block is added to the existing Blockchain. This block becomes part of the blockchain when other computers in the network validate if the lock on the block is correct.<br/>
      - The transaction is complete. Now the transaction is part of the blockchain and cannot be altered in any way.<br/>
    `,
  },
  'Fees': {
    category: 'What is it',
    content: `
      Gas fees are paid by users as part of the transaction to compensate for the computing energy required to process and validate transactions on the blockchain.
    `,
  },
  'Token': {
    category: 'What is it',
    content: `
      A token is a collective term that encapsulates both bona-fide cryptocurrencies (bitcoin, ether), and crypto assets.<br/>

      Tokens have several functions and are presently divided into several categories:<br/>
      • Blockchain-tied assets that mimic the traditional financial system (lending, saving, insurance) and can be traded or held like a cryptocurrency.<br/>
      • Assets that, through allowing holders to signal on the blockchain for or against a vote. These assets are often termed "governance tokens".<br/>
      • Assets that serve as a record for ownership rights to unique digital.<br/>
      • Digital forms of traditional items of value that live on a blockchain, which represent ownership or a fraction of the value of an asset.<br/>
    `,
  },
  'NFTs': {
    category: 'What is it',
    content: `
      NFTs (or "non-fungible tokens") are a special kind of crypto asset in which each token is unique. Because every NFT is unique, they can be used to authenticate ownership of digital assets like artworks, recordings, and virtual real estate as just a few examples.<br/>
    `,
  },
  'Ownership': {
    category: 'What is it',
    content: `
      Blockchain technology allows users to trace who owns particular tokens by providing an immutable and transparent record of ownership.
    `,
  },
  'Mint': {
    category: 'What is it',
    content: `
      "Minting" an NFT is the process of writing a digital item to the blockchain. This establishes its immutable record of authenticity and ownership.
    `,
  },
  'Uri': {
    category: 'What is it',
    content: `
      To minimize the footprint of NFTs without sacrificing functionality or imposing unnecessary restrictions, XRPL NFTs do not have arbitrary data fields.<br/>
      Instead, data is maintained separately and referenced by the NFT. The URI provides a reference to immutable content for the Hash and any mutable data for the NFToken object.<br/> 
      On Food Trust Simulator, the URI is a string formatted as follow:<br/>
      rHwhFEvTwUSn4AxcpRmfAjJ1Qap2iJ9gbA 1680487422159 000020<br/>
      for the issuer address, the timestamp of creation and the type of NFT.<br/>
      In conclusion, the URI is the link to the NFT on-chain and the data on the Game Server.<br/>
    `,
  },
  'Burn': {
    category: 'What is it',
    content: `
      Burning a token means permanently destroying it. Why ? Many reasons exist to justify this action, but more complexe at the moment for the purpose of this game. In the case of this game, it allows to free up space in one's pockets or to allow an action.<br/>
    `,
  },
  'Create an account': {
    category: 'How to play',
    content: `
      On XRPL there is not a dedicated "create account" transaction. The Payment transaction automatically creates a new account if the payment sends XRP equal to or greater than the   account reserve to a mathematically-valid address that does not already have an account. This is called funding an account. On testnet, you can use a faucet to generate an funded account. Read more about it here: https://xrpl.org/xrp-testnet-faucet.html.<br/>
      When your account on-chain is ready, let's connect to your account in-game.<br/>
      From the main page of Food Trust Simulator, click on "Enter". A pop-up will appear and offering different ways to manage the bridge between your on-chain account and your in-game account. Choose the solution that best suits your use. Then you are already connected. As you use your on-chain account to sign the transactions, we no longer need a classic authentication with username and password. It becomes easier and faster to start.<br/>
      Customize now your in-game account in 4 steps: Profile Type, Picture Creation, Name and Location
      Please note that the name and location cannot be changed after.
    `,
  },
  'Profiles': {
    category: 'How to play',
    content: `
      You can find three profiles on Food Trust Simulator:<br/>
      - Farmer<br/>
      This profile illustrate the labor of working on the farm, in an educational and fun context.
      By solving puzzles, you will create ingredients that will be useful to other players. You will be able to create 5 different ingredients for each level and start with a pocket size of 7.<br/>
        - Manager<br/>
        This profile illustrates the role of marketplace manager, with inventory management and community needs. You start with a pocket size of 14 and your objective will be to find the best way to deploy strategy to obtain more influence. By solving puzzles, you will be able to create Coin or Box. Another of its capabilities is to be able to send advertisements to other players.<br/>
        - Cook<br/>
        This profile illustrates the profession of cook, using items got from other players to prepare them for consumption. You have the power to heat, freeze and mix your collection, in order to modify certain properties of the tokens. By solving puzzles, you will be able to create Recipe and Merged Tokens.<br/>
    `,
  },
  'Choose a Location': {
    category: 'How to play',
    content: `
      When you create a new account on Food Trust Simulator, you can choose a location that will be the reference point for the tokens you are going to create.<br/>
      Choose a place by writing the name of a city.<br/>
      Please note that you will not be able to change it afterwards.<br/>
    `,
  },
  'Play': {
    category: 'How to play',
    content: `
      When you are connected, you can find in the navigation bar a link to the puzzles called "Play". According to your profile, the illustration and puzzles, the actions you can perform will be different.<br/>
      Click on an action box to open a popup containing the puzzle with different condition to succeed.<br/>
    `,
  },
  'Puzzle': {
    category: 'How to play',
    content: `
      From the page entitled "Play", you will find small boxes on an illustration representing your profile. Clicking on it, will open a puzzle where you can find a description of the objective and the loot. Then good luck !<br/>
      Be careful, certain conditions will sometimes be necessary to be able to play.
    `,
  },
  'Mix': {
    category: 'How to play',
    content: `
      Mix is a cook's puzzle. You will need to have at least two ingredients available. Then you can choose them and start the puzzle. If successful, a recipe will be created. But what recipe ? There is 5 different recipes in Food Trust Simulator. To successfully complete a recipe, you will need to follow the ingredient list on one of your recipe token.
    `,
  },
  'Freeze': {
    category: 'How to play',
    content: `
      Freeze is a cook's puzzle. Choose your ingredient, solve the puzzle and that will update the longevity of the ingredient or the recipe choosed.
    `,
  },
  'Bake': {
    category: 'How to play',
    content: `
      Bake is a cook's puzzle. Choose your ingredient, solve the puzzle and that will update the power of the ingredient or the recipe choosed.
    `,
  },
  'Recipe': {
    category: 'How to play',
    content: `
      Recipe is a cook's puzzle. Once per day, you can solve a puzzle to create a new recipe. The recipe is generated with a random number of ingredients necessary for its success.
    `,
  },
  'Coin': {
    category: 'How to play',
    content: `
     Coin is a manager's puzzle. Solve a puzzle and create a Coin. You can burn a Coin to activate the burnout action.
    `,
  },
  'Ad': {
    category: 'How to play',
    content: `
      Ad is a manager's puzzle. Solve a puzzle to send an announcement to a player. The announcement is a message that will appear on the player's home page. With a longevity of 24h, try to have more visibility with this strategy. You are limited to 5 ads per day and 1 per user.
    `,
  },
  'Box': {
    category: 'How to play',
    content: `
      Box is a manager's puzzle. Choose a list of ingredients to pack, solve a puzzle and it will generate a Box which will contain the list of ingredients of your choice. Easier to sell, can solve the problem of non-validated ingredients and save your pocket space.
    `,
  },
  'Collection': {
    category: 'How to play',
    content: `
      When you are connected, you can find a link to the Collection Page in the navigation bar.<br/>
      Here you will find the list of NFTs you own. By clicking on it you will be redirected to a more detailed page on the specific token.<br/>
      You can also sort by:<br/>
        - Issuer: To see only NFTs you created, not the NFTs you purchased.<br/>
        - Unvalidated: NFTs that you own on-chain and/or in-game which no longer have any value in the game.<br/>
        - With Offers: NFTS you own that had received offers.<br/>
        - Merge: NFTs that have parents.<br/>
    `,
  },
  'Longevity': {
    category: 'How to play',
    content: `
      The longevity is a value that you can find on some NFTs from the game. It's encoded in the NFT's URI, which means we can never change it or make it opaque thanks to the immutable property of the blockchain.<br/>
      This value adds an expiration date for validating the item during your quest.<br/>
    `,
  },
  'Power': {
    category: 'How to play',
    content: `
      The power is a value that you can find on each NFTs from the game.<br/>
      Used when validating the quest, if the power is 2, the value of the items will be multiplied by 2. Learn more about it on Quest FAQ.<br/>
      Cook profile can increase Power value of ingredients or recipes.<br/>
    `,
  },
  'Family Tree': {
    category: 'How to play',
    content: `
      The Cook and Manage profile can mix some NFTs to create a unique one (Recipe and Box).<br/>
      You need to validate some conditions:<br/>
      - Recipe: A list of valid ingredients. The closer you are to a recipe you own, the more powerful the recipe you can create.<br/>
      - Box: A list of valid ingredients to put in a box. Can temporary fix the issue with validating NFTs to valid them in a Quest.<br/>
      On the page of this new NFT, you will find a Family Tree to keep traceability of history.<br/>
    `,
  },
  'Quest': {
    category: 'How to play',
    content: `
      When you are connected, you can find a link to the Quest Page in the navigation bar.<br/>
      Here is a list of items you need to own to claim a reward. You will need to trade with other players to succeed.<br/>
      Reward is default of 900xp but can be more. It is divided by the number of items needed and each individual item can multiplied its value according to its power.<br/>
      For example: With 5 NFTs to complete the Quest, 900 / 5 = 180. If one of the Items has a power of 2 the result wil be: 180 + 180 + 180 + 180 + 180 * 2 = 1080 xp.<br/>

      You can validate only a Quest each 24 hours.<br/>
    `,
  },
  'Experience': {
    category: 'How to play',
    content: `
      One of the goals of the game is to first reach level 100. To do this, you gain experience (xp) when you validate an action.<br/>
      How scoring works:<br/>
        - Play and win a Token: 100xp<br/>
        - Sell a Token: 500xp<br/>
        - Buy a Token to a small level account: 700xp<br/>
        - Win a Quest: 900xp*<br/>
        Can be more: Each ingredient power is a multiplier.<br/>
    `,
  },
  'Level': {
    category: 'How to play',
    content: `
      According to the experience you have, we use a simple equation (similar to Pokemon) to get a displayable level.<br/>
      ∛((4*xp) / 5)
    `,
  },
  'Badges': {
    category: 'How to play',
    content: `
        From a player's profile, you can find a Badge collection. Each represents an achievement you get while playing Food Trust Simulator.<br/>
        There is 15 Badges that you will discover during the game on your profile or on the profile of other players.
    `,
  },
  'Burnout': {
    category: 'How to play',
    content: `
      When you are connected, from your profile, you can find a button called "Burnout".<br/>
      By burning a Coin (manager's token), you will be able to "Burnout".<br/> During this step, you will change your profile type and picture.<br/>
      You keep all your NFTs and switch to a new profile behavior.<br/> 
      You can Burnout only each 24hours maximum.<br/>
    `,
  },
  'Notifications': {
    category: 'How to play',
    content: `
      During the game experience, Notifications will be used to provide more help and informations about your progress in-game.<br/>
      Technically, how does it work? Your session connect to a websocket managed by Ably (an external infrastructure), and push notifications on the website when you receive information from the game server.<br/>
    `,
  },
  'NFT transactions': {
    category: 'How to play',
    content: `
      When you create (or mint) a NFT other players can make offers (Bid) which you may accept.<br/>
      You can also create an offer to sell (Ask) to indicate that you are ready to sell at this price.<br/>
      When an offer is accepted, XRP are exchanged and the NFT owner change.<br/> 
      Special case: If you indicate a buy offer higher than a current sell offer, this will directly buy the token at your price but will not indicate it in the history.<br/>
      Special case: If you indicate a sell offer lower than current buy offers, that will invalidate the NFT.<br/>
    `,
  },
  'Buy a token when pocket are full': {
    category: 'How to play',
    content: `
      When you create a NFT, you need at least one space in your pocket to handle this new one.<br/>
      But for an offer, it is different.<br/>
      You can buy a token even if you have no more space in your pocket.<br/>
      Thanks to this, the offers are not put on hold and the game continues.
    `,
  },
  'Logout': {
    category: 'How to play',
    content: `
      From the navigation bar, at the top right of the screen, clicking on the icon of your profession to open a menu containing Logout.
    `,
  },
  'DashBoard': {
    category: 'How to play',
    content: `
      From the navigation bar, at the top of the screen, click on Home or on the logo to display the Home Page.<br/>
      You will find there several informations in Box:<br/>
      - Ad: When a manager sends you an ad with a personalized message, you will recieve it at the top of this page.<br/>
      - Current Balance: The number of XRPL held by your account. If you don't have any more, you can no longer trade.<br/>
      - NFTs Collection: with the limit of your pocket size and the number of your collection.<br/>
      - Buy Offers: A list of your items that have received offers from other players.<br/>
      - Transactions: A list of your account transactions saved on-chain, unforgeable, forever.<br/>
    `,
  },
  'Collection Remote': {
    category: 'How to play',
    content: `
      After finding a profile from the Market page, you come to its collection page. It contains the list of his NFTs available as well as additional information such as his last connection, his XRPL address, his badges and his statistics.
    `,
  },
  'Market': {
    category: 'How to play',
    content: `
      The market is the reference to search for players on a world map and find your next NFT.<br/>
      Click on a red dot to get a specific user.
    `,
  },
  'Limitations': {
    category: 'How to play',
    content: `
      Here you can read the game engine limitations.<br/>
      - Size max for Pocket: ${limitGame.pocket}.<br/>
      - Are a low level profile if experience less than ${limitGame.smallProfile}xp.<br/>
      - Level maximal: ${limitGame.maxLevel}.<br/>
      - If applicable, by default, longevity for a token is ${limitGame.durabilityDefault} day.<br/> 
      - If applicable, when freeze, longevity for a token is ${limitGame.durabilityWhenCold} day.<br/> 
      - If applicable, when bake, longevity for a token is ${limitGame.durabilityWhenHeat} day.<br/> 
      - If applicable, when token is a merged token, longevity is by default ${limitGame.durabilityTokenFusionned} day.<br/> 
      - Power of token is by default ${limitGame.powerDefault}.<br/>
      - Power when token is a merged token, is ${limitGame.powerWhenParents}.<br/>
      - Power when token is a merged token and bake, is ${limitGame.powerWhenHeatWParents}.<br/>
      - Power when token is bake, is ${limitGame.powerWhenHeat}.<br/>
      - Power when token is freeze, is ${limitGame.powerWhenCold}.<br/>
      - For Cook Profile, maximum recipe you can create by day is ${limitGame.recipeCreatedByDay}.<br/>
      - For Manager Profile, maximum ad you can create by day is ${limitGame.adCreatedByDay}.<br/>
      - For Manager Profile, maximum ad you can create by user by day is ${limitGame.adCreatedForUser}.<br/>
      - The time limit for a new Burnout is ${limitGame.maxDayBurnout} day.<br/>
    `,
  },
  'Report an issue': {
    category: 'How to help',
    content: `
      Are you having a problem during your gaming experience ?<br/>
      First of all, we apologize for the inconvenience.<br/>
      Then you can help us to help you:<br/>
      - Open your browser's console (F12 or right click and "Inspect", then you should have a tab called "Console", click on that to view the potential error detected here).<br/>
      - From there, take a screenshot and email us at contact@FoodTrustSimulator.app with your account name or address, a copy of your current url and a description of what you tried to do.<br/>
      Thanks !<br/>
    `,
  },
  'Terms of Service': {
    category: 'Read more',
    content: `
      Updated - 05 April 2023<br/>

      These Terms of Use apply when you use the services of Food Trust Simulator, including our application programming interface, tools, developer services, data, documentation, and websites (“Services”). The Terms include our Service Terms, Sharing & Publication Policy, Usage Policies, and other documentation, guidelines, or policies we may provide in writing. By using our Services, you agree to these Terms. Our Privacy Policy explains how we collect and use personal information.<br/>

      1. Registration and Access<br/>

        Anyone with an XRPL address can use the Services. If you are under 18 you must have your parent or legal guardian’s permission to use the Services. If you use the Services on behalf of another person or entity, you must have the authority to accept the Terms on their behalf. You may not make your access credentials or account available to others outside your organization, and you are responsible for all activities that occur using your credentials.<br/>
      2. Usage Requirements<br/>
      You may access, and we grant you a non-exclusive right to use, the Services in accordance with these Terms. You will comply with these Terms and all applicable laws when using the Services. We and our affiliates own all rights, title, and interest in and to the Services<br/>
      3. Security<br/>
      You must implement reasonable and appropriate measures designed to help secure your access to and use of the Services. If you discover any vulnerabilities or breaches related to your use of the Services, you must promptly contact Food Trust Simulator Team and provide details of the vulnerability or breach.
    `,
  },
  'Privacy Policy': {
    category: 'Read more',
    content: `
      Updated - 05 April 2023<br/>
      In order for us to provide you the best possible experience on our application, we need to collect and process certain information. Depending on your use of the Services, that may include:<br/>
      Usage data — when you visit our site, we will store: the website from which you visited us from, the parts of our site you visit, the date and duration of your visit, your anonymised IP address, information from the device (device type, operating system, screen resolution, language, country you are located in, and web browser type) you used during your visit, and more. We process this usage data in Matomo Analytics for statistical purposes, to improve our site and to recognize and stop any misuse.<br/>
      Cookies — we use cookies (small data files transferred onto computers or devices by sites) for record-keeping purposes and to enhance functionality on our site. You may deactivate or restrict the transmission of cookies by changing the settings of your web browser. Cookies that are already stored may be deleted at any time.<br/>
      Create an account — when you sign up for and open an account on our application, we may ask you to provide us information such as a name, an XRPL address and a location. This informations can be removed at any time by contacting us.<br/>
      Your Rights<br/>
      You have the right to be informed of Personal Data processed by Food Trust Simulator, a right to rectification/correction, erasure and restriction of processing. You also have the right to ask from us a structured, common and machine-readable format of Personal Data you provided to us.<br/>
    `,
  },
};

type Data = (string | JSX.Element)[][];
/*let data = [
  [ 'id', 'title', 'content' ],
];*/

type EnumData = {
  id: number;
  title: number;
  description: number;
}

const buildData = (shouldInclude?: number[]) => {
  const faqReferenceTitle = Object.keys(faqReference);
  const builded = faqReferenceTitle
    .filter((title: string) => shouldInclude && shouldInclude.length > 0 
      ? shouldInclude.indexOf(faqReference[title]) !== -1
      : true)
    .map((title: string) => [
      // id
      faqReference[title] + '',
      // title
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }}}>
        <span style={{ 
          borderRadius: '4px',
          padding: '7px',
          marginRight: '5px',
          background: categoryReference[faqData[title].category].background,
          border: categoryReference[faqData[title].category].border,
        }}>
            {faqData[title].category}
          </span>
        <span>{title}</span>
      </Box>,
      // content
      faqData[title].content
    ]);

  builded.unshift([
    'N°',
    'TITLE',
    'DESCRIPTION'
  ]);
  return builded;
}

const enumD: {[key: string]: number} = {
  id: 0,
  title: 1,
  description: 2,
};
const inCollapse = [ 2 ];

function descendingComparator(a: any, b: any, orderBy: string) {
  if (b[enumD[orderBy]] < a[enumD[orderBy]]) {
    return -1;
  }
  if (b[enumD[orderBy]] > a[enumD[orderBy]]) {
    return 1;
  }
  return 0;
}
function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array: string[], comparator: Function) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a: number[], b: number[]) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
function validURL(str: string) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}


type RowProps = {
  key: number;
  line: string[];
}

const Row : React.FunctionComponent<RowProps> = (props) => {
  const { line } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow onClick={() => setOpen(!open)} sx={{ 
          cursor: 'pointer',
          '& > *': { borderBottom: 'unset', borderTop: '1px solid black' }
        }}>
        <TableCell sx={{ width: '50px' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        {line.filter((e, i) => inCollapse.indexOf(i) === -1).map((e:string, i: number) => 
          <TableCell 
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontSize: '13px',
            }}
            key={i}>{validURL(e) ? <a target="_blank" href={e}>{e}</a> : e}</TableCell>)}
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, background: 'rgb(15, 15, 15)', borderLeft: '1px solid grey', borderRight: '1px solid grey', color: '#fff' }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, mb: 5, mt: 3 }}>
              {line.filter((e: string, i: number) => 
                inCollapse.indexOf(i) !== -1)
                .map((e: string) => 
                  e.split('<br/>')
                    .map((e: string, i: number) => 
                      <Typography key={i} variant="body1" sx={{ mb: 2 }}>
                        {e}
                      </Typography>)
                    )
              }
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}


type FaqProps = {}
const Faq : React.FunctionComponent<FaqProps> = (props) => {
  const [data, setData] = useState<Data>(null);
  const [search, setSearch] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [lineTable, setLineTable] = useState(null);

  useEffect(() => {
    setData(buildData());
  }, []);

  useEffect(() => {
    if (!data) return ;
    setLineTable(
      stableSort(
        filterData(currentSearch, data),
        getComparator(order, orderBy)).map((row: any, i: number) => (
        <Row key={i} line={row} />
      ))
    );
  }, [orderBy, order]);

  useEffect(() => {
    if (!data) return ;
   	setLineTable(
  		stableSort(
        filterData(currentSearch, data),
        getComparator(order, orderBy)).map((row: any, i: number) => (
        <Row key={i} line={row} />
      ))
  	);
  }, [currentSearch]);

  useEffect(() => {
    if (!data) return ;
    setLineTable(
      stableSort(
        filterData(currentSearch, data),
        getComparator(order, orderBy)).map((row: any, i: number) => (
        <Row key={i} line={row} />
      ))
    );
  }, [data]);

  const filterData = (currentSearch: string, data: any) => {
    if (!data) return ;
    if (currentSearch) 
      return data.filter((e:Data, i: number) => i != 0 && e.filter((f: any) => f.toLowerCase().indexOf(currentSearch.toLowerCase()) !== -1).length > 0)
    return data.filter((e:Data, i: number) => i != 0);
  }

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property.toLowerCase() && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property.toLowerCase());
  };

  return (
    <TableContainer component={Paper}>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h1">FAQ</Typography>
      </Box>
      <Box sx={{ mt:2, mb: 6, display: 'flex', justifyContent: 'center' }}>
	      <Search sx={{ background: '#333', color: 'white' }}>
	        <SearchIconWrapper sx={{ mr: 1, pr: 1 }}>
	          <SearchIcon />
	        </SearchIconWrapper>
	        <StyledInputBase
	        	onChange={(event) => setSearch(event.target.value)}
	          placeholder="Description..."
	          inputProps={{ 'aria-label': 'search' }}
	        />
	      </Search>
        <Button onClick={() => setCurrentSearch(search)} sx={{}} variant="contained">Search</Button>
       </Box>
      <Table aria-label="collapsible table">
        {/* Filters */}
        <TableHead>
          <TableRow>
            <TableCell />
            {data && data[0].filter((e: string, i: number) => inCollapse.indexOf(i) === -1).map((label: string, i:number) => 
              <TableCell
                key={i}
                align="left"
                //sortDirection={orderBy === label.toLowerCase() ? order : false}
              >
                <TableSortLabel
                  active={orderBy === label.toLowerCase()}
                  //direction={orderBy === label.toLowerCase() ? order : 'asc'}
                  onClick={() => handleRequestSort(label)}
                >
                  {label}
                  {/*orderBy === label ? (
                    <Box component="span">
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null*/}
                </TableSortLabel>
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {lineTable}
        </TableBody>
      </Table>

      {!lineTable && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 2, color: "white" }} />}


      <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
        <Typography variant="h6">Complementary resources</Typography>
        <Typography variant="body1"><a href="https://github.com/VBoureaud/FoodTrustSimulator">Sources</a></Typography>
        <Typography variant="body1" sx={{ fontSize: '13px' }}>Presentation. <a target="_blank" href="https://www.valentin.boureaud.com/slides/foodtrust/">Slides</a></Typography>
        <Typography variant="body1" sx={{ fontSize: '13px' }}>Whitepaper (in progress). <a target="_blank" href="https://www.valentin.boureaud.com/whitepaper/whitepaper_foodtrustsimulator_v0.4.pdf">Document</a></Typography>
        <Typography variant="body1" sx={{ fontSize: '13px' }}>Mail. contact@foodtrustsimulator.app</Typography>
      </Box>
    </TableContainer>
  )
}

type FaqModalProps = {
  shouldInclude: number[];
  onClose: Function;
  openDelay?: number;
}
export const FaqModal : React.FunctionComponent<FaqModalProps> = (props) => {
  const [data, setData] = useState<Data>(null);
  const [lineTable, setLineTable] = useState(null);
  const [currentSearch, setCurrentSearch] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  
  useEffect(() => {
    setData(buildData(props.shouldInclude));
  }, []);

  useEffect(() => {
    if (!data) return ;
    setLineTable(
      stableSort(
        filterData(currentSearch, data),
        getComparator(order, orderBy)).map((row: any, i: number) => (
        <Row key={i} line={row} />
      ))
    );
  }, [data]);

  const filterData = (currentSearch: string, data: any) => {
    if (!data) return ;
    if (currentSearch) 
      return data.filter((e:Data, i: number) => i != 0 && e.filter((f: any) => f.toLowerCase().indexOf(currentSearch.toLowerCase()) !== -1).length > 0)
    return data.filter((e:Data, i: number) => i != 0);
  }

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property.toLowerCase() && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property.toLowerCase());
  };

  return (
    <BasicModal
      children={<>
          <Typography sx={{ textAlign: 'center' }} variant="h5">FAQ</Typography>
          <Table aria-label="collapsible table">
          {/* Filters */}
          <TableHead>
            <TableRow>
              <TableCell />
              {data && data[0].filter((e: string, i: number) => inCollapse.indexOf(i) === -1).map((label: string, i:number) => 
                <TableCell
                  key={i}
                  align="center"
                >
                  <TableSortLabel
                    active={orderBy === label.toLowerCase()}
                    onClick={() => handleRequestSort(label)}
                  >
                    {label}
                  </TableSortLabel>
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {lineTable}
          </TableBody>
        </Table>
        </>}      
      autoOpen={true}
      openDelay={props.openDelay}
      onClose={props.onClose}
    />
  ); 
}

export default Faq;