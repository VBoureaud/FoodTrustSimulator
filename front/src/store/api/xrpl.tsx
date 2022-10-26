import { GetAccountPayload } from "../types/AccountTypes";
import { config } from "@config";


// WS Call
if (typeof module !== "undefined") var xrpl = require('xrpl')

export const getTokensXRPL = async (data: GetAccountPayload) => {
	const client = new xrpl.Client(config.xrpWss);
	await client.connect()

	const nfts = await client.request({
		method: "account_nfts",
		account: data.address
	})

	client.disconnect()
	return nfts;
}

export const accountInfoXRPL = async (data: GetAccountPayload) => {
	const client = new xrpl.Client(config.xrpWss);
	await client.connect()

	const response = await client.request({
	    "command": "account_info",
	    "account": data.address,
	    "ledger_index": "validated"
  	})
  	
	client.disconnect()
	return response;
}

type transactionAcceptOffer = {
	TransactionType: string;
	Account?: string;
	NFTokenBuyOffer?: string;
	NFTokenSellOffer?: string;
};

export const mintToken = (tokenUrl: string) => ({
	"TransactionType": "NFTokenMint",
	"URI": xrpl.convertStringToHex(tokenUrl),
	"Flags": 8,// transferable
	"NFTokenTaxon": 0 //Required, but if no use, set to zero.
})

export const burnToken = (tokenId: string) => ({
	"TransactionType": "NFTokenBurn",
	"NFTokenID": tokenId,
})
export const createSellOffer = (amount: string, tokenId: string) => ({
	"TransactionType": "NFTokenCreateOffer",
	"NFTokenID": tokenId,
	"Amount": amount,
	"Flags": 1
})

export const createBuyOffer = (owner: string, amount: string, tokenId: string) => ({
	"TransactionType": "NFTokenCreateOffer",
	"Owner": owner,
	"NFTokenID": tokenId,
	"Amount": amount,
	"Flags": 0
})

export const cancelOffer = (tokenOfferIndex: string) => ({
	"TransactionType": "NFTokenCancelOffer",
	"NFTokenOffers": [tokenOfferIndex],
})

export const acceptOffer = (isBuyOffer: boolean, tokenOfferIndex: string) => {
	const transactionBlob: transactionAcceptOffer = {
  	"TransactionType": "NFTokenAcceptOffer",
  }
  transactionBlob[isBuyOffer ? 'NFTokenBuyOffer' : 'NFTokenSellOffer'] = tokenOfferIndex;
  return transactionBlob;
}


// Get Buy & Sell offers
export const getOffers = async (tokenId: string) => {
	const client = new xrpl.Client(config.xrpWss);
	await client.connect();
  
  let nftSellOffers = null;
  try {
    nftSellOffers = await client.request({
			method: "nft_sell_offers",
			nft_id: tokenId
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
  		nft_id: tokenId
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

// Transactions
export const accountTransactionXRPL = async (data: GetAccountPayload) => {
	const client = new xrpl.Client(config.xrpWss)
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
