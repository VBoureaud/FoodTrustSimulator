import { GetAccountPayload } from "../types/AccountTypes";
import { config, configOnChain } from "@config";
import { 
	decodeHashURI,
	getObjInArray,
} from "@utils/helpers";
import { 
	nameTypeToken,
} from "@utils/gameEngine";

// WS Call
if (typeof module !== "undefined") var xrpl = require('xrpl')

export const getTokensXRPL = async (data: GetAccountPayload) => {
	try {
		const client = new xrpl.Client(data.server, { connectionTimeout: 10000 });
		await client.connect()

		const nfts = await client.request({
			method: "account_nfts",
			account: data.address,
			validated: true,
		})

		client.disconnect();

		const listDecoded = [];
		for (let i = 0; i < nfts.result.account_nfts.length; i++) {
			const decoded = decodeHashURI(xrpl.convertHexToString(nfts.result.account_nfts[i].URI));
			
			// if Nfts on account but not FTS nfts
			if (isNaN(decoded.date.getTime()))
				continue;

			listDecoded.push({
				...nfts.result.account_nfts[i],
				date: decoded.date,
				type: decoded.type,
				nameToken: nameTypeToken[decoded.type].name,
				creator: nameTypeToken[decoded.type].profile,
			})
		}

		const listSorted = listDecoded.sort(function(a: any, b: any){
		  return new Date(a.date).getTime() - new Date(b.date).getTime();
		});

		return listSorted;
	} catch (e) {
		console.log({ e });
		return false;
	}
}

export const accountInfoXRPL = async (data: GetAccountPayload) => {
	try {
		const client = new xrpl.Client(data.server, { connectionTimeout: 10000 });
		await client.connect()

		const response = await client.request({
				"command": "account_info",
				"account": data.address,
				"ledger_index": "validated"
			})

		client.disconnect()
		return response;
	} catch(e) {
		console.log(e);
	}
}

// no used yet
export const subscribe = async (account: string) => {
	try {
		const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
		await client.connect()

		const response = await client.request({
			"command": "subscribe",
			"accounts": [ account ],
			"streams": [ "consensus", "ledger", "manifests", "transactions", "transactions_proposed", "server", "validations" ],
			//"ledger_index": "validated"
		})

		client.on("connected", async (ledger: any) => {
			console.log('connected');
		})
		client.on("disconnected", async (ledger: any) => {
			console.log('disconnected');
		})

		client.disconnect()
		return response;
	} catch(e) {
		console.log({ e });
	}
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
export const getOffers = async (server: string, tokenId: string) => {
	try {
		const client = new xrpl.Client(server, { connectionTimeout: 10000 });
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
	} catch(e) {
		console.log(e);
	}
}

// Transactions
export const accountTransactionXRPL = async (data: GetAccountPayload) => {
	const client = new xrpl.Client(data.server, { connectionTimeout: 10000 });
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
