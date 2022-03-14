import { GetAccountPayload } from "../types/AccountTypes";
import { config } from "@config";

// WS Call
if (typeof module !== "undefined") var xrpl = require('xrpl')

export const getTokensXRPL = async (data: GetAccountPayload) => {
	const client = new xrpl.Client(config.xrpWs);
	await client.connect()

	const nfts = await client.request({
		method: "account_nfts",
		account: data.address
	})

	client.disconnect()
	return nfts;
}

export const accountInfoXRPL = async (data: GetAccountPayload) => {
	const client = new xrpl.Client(config.xrpWs);
	await client.connect()

	const response = await client.request({
	    "command": "account_info",
	    "account": data.address,
	    "ledger_index": "validated"
  	})
  	
	client.disconnect()
	return response;
}

export const mintToken = async (tokenUrl: string, secret: string) => {
	const wallet = xrpl.Wallet.fromSeed(secret);
	const client = new xrpl.Client(config.xrpWs);
	await client.connect();
	
	const transactionBlob = {
		TransactionType: "NFTokenMint",
		Account: wallet.classicAddress,
		URI: xrpl.convertStringToHex(tokenUrl),
		Flags: 8,// transferable
		TokenTaxon: 0 //Required, but if no use, set to zero.
	};
	const tx = await client.submitAndWait(transactionBlob, { wallet });

	if (!tx || tx.result.meta.TransactionResult != 'tesSUCCESS') {
		client.disconnect();
		return false;
	}

	// Get TokenID
	const nfts = await client.request({
		method: "account_nfts",
		account: wallet.classicAddress
	});

	client.disconnect();
	if (!nfts || !nfts.result || !nfts.result.account_nfts)
		return false;

	const tokenId = nfts.result.account_nfts[nfts.result.account_nfts.length - 1].TokenID;
	return tokenId;
}

export const burnToken = async (tokenId: string, secret: string) => {
  const wallet = xrpl.Wallet.fromSeed(secret);
  const client = new xrpl.Client(config.xrpWs);
  await client.connect();

  const transactionBlob = {
      "TransactionType": "NFTokenBurn",
      "Account": wallet.classicAddress,
      "TokenID": tokenId
  };

  const tx = await client.submitAndWait(transactionBlob, { wallet });
  client.disconnect();
  return tx && tx.result.meta.TransactionResult == 'tesSUCCESS';
}

export const createSellOffer = async (amount: string, tokenId: string, secret: string) => {
	const wallet = xrpl.Wallet.fromSeed(secret)
	const client = new xrpl.Client(config.xrpWs)
	await client.connect()

  const transactionBlob = {
  	"TransactionType": "NFTokenCreateOffer",
  	"Account": wallet.classicAddress,
  	"TokenID": tokenId,
  	"Amount": amount,
  	"Flags": 1
  };

  const tx = await client.submitAndWait(transactionBlob,{wallet})
  client.disconnect();

  return tx && tx.result.meta.TransactionResult == 'tesSUCCESS';
}

export const createBuyOffer = async (owner: string, amount: string, tokenId: string, secret: string) => {
	const wallet = xrpl.Wallet.fromSeed(secret)
	const client = new xrpl.Client(config.xrpWs)
	await client.connect()

  const transactionBlob = {
      	"TransactionType": "NFTokenCreateOffer",
      	"Account": wallet.classicAddress,
      	"Owner": owner,
      	"TokenID": tokenId,
      	"Amount": amount,
      	"Flags": 0
  }

  const tx = await client.submitAndWait(transactionBlob,{wallet})
  client.disconnect();

  return tx && tx.result.meta.TransactionResult == 'tesSUCCESS';
}

// Get Buy & Sell offers
export const getOffers = async (tokenId: string) => {
	const client = new xrpl.Client(config.xrpWs);
	await client.connect();
  
  let nftSellOffers = null;
  try {
    nftSellOffers = await client.request({
			method: "nft_sell_offers",
			tokenid: tokenId
		});

		if (nftSellOffers && nftSellOffers.result)
			nftSellOffers = nftSellOffers.result.offers;
	} catch (err) {
		nftSellOffers = null;
	}
  let nftBuyOffers = null;
  try {
    nftBuyOffers = await client.request({
		  method: "nft_buy_offers",
  		tokenid: tokenId
  	});
  	
  	if (nftBuyOffers && nftBuyOffers.result)
			nftBuyOffers = nftBuyOffers.result.offers;
  } catch (err) {
  	nftBuyOffers = null;
  }
  client.disconnect();
  
  return {
  	nftSellOffers,
  	nftBuyOffers
  }
}

export const cancelOffer = async (tokenOfferIndex: string, secret: string) => {
	const wallet = xrpl.Wallet.fromSeed(secret)
	const client = new xrpl.Client(config.xrpWs)
	await client.connect()

	const tokenIDs = [tokenOfferIndex];

  const transactionBlob = {
      	"TransactionType": "NFTokenCancelOffer",
      	"Account": wallet.classicAddress,
      	"TokenIDs": tokenIDs
  }

  const tx = await client.submitAndWait(transactionBlob,{wallet})
  client.disconnect();

	return tx && tx.result.meta.TransactionResult == 'tesSUCCESS';
}

type transactionAcceptOffer = {
	TransactionType: string;
	Account: string;
	BuyOffer?: string;
	SellOffer?: string;
};
export const acceptOffer = async (isBuyOffer: boolean, tokenOfferIndex: string, secret: string) => {
	const wallet = xrpl.Wallet.fromSeed(secret)
	const client = new xrpl.Client(config.xrpWs)
	await client.connect()
	const transactionBlob: transactionAcceptOffer = {
  	"TransactionType": "NFTokenAcceptOffer",
  	"Account": wallet.classicAddress,
  }
  transactionBlob[isBuyOffer ? 'BuyOffer' : 'SellOffer'] = tokenOfferIndex;

  const tx = await client.submitAndWait(transactionBlob,{wallet})
  client.disconnect();

	return tx && tx.result.meta.TransactionResult == 'tesSUCCESS';
}

// Transactions
export const accountTransactionXRPL = async (data: GetAccountPayload) => {
	const client = new xrpl.Client(config.xrpWs)
	await client.connect()
	const transactionBlob = {
	  "id": 1,
	  "command": "account_tx",
	  "account": data.address,
	  "ledger_index_min": -1,
	  "ledger_index_max": -1,
	  "binary": false,
	  "limit": 100,
	  "forward": false
	};
	const tx = await client.request(transactionBlob);
	client.disconnect();
	return tx;
}
