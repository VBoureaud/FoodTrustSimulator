const httpStatus = require('http-status');
const fetch = require('node-fetch');
const xrpl = require('xrpl');
const config = require('../config');
const ApiError = require('../utils/ApiError');

/**
 * Get Account_NFTS from XRPLedger
 * @param {String} address
 * @returns {Promise<Account_NFTS>}
 */
const getAccountNFTS = async (address, server) => {
  try {
    const client = new xrpl.Client(server ? server : config.xrplUrl, { connectionTimeout: 10000 });
    await client.connect();

    const nfts = await client.request({
      method: "account_nfts",
      account: address
    })

    client.disconnect()

    if (nfts && nfts.result && nfts.result.account_nfts)
      return nfts.result.account_nfts;
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account_Nfts not found');
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account_Nfts not found');
  }

  // HTTP CALLs
  /*const body = {
      "method": "account_nfts",
      "params": [{
          "account": address,
          "strict": true,
          "ledger_index": "validated",
          "api_version": 1
        }
      ]
  };

  try {
    let response = await fetch(config.xrplUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(body)
    });
    let data = await response.json();
    if (data && data.result && data.result.account_nfts)
      return data.result.account_nfts;
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account_Nfts not found');
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account_Nfts not found');
  }*/
};

/**
 * Get Buy or Sell Offers for a NFTtoken from XRPLedger
 * @param {String} tokenid
 * @param {String} server
 * @returns {Promise<OffersNFT>}
 */
const getOffersNFT = async (tokenid, server, isBuy=true) => {
  try {
    const client = new xrpl.Client(server ? server : config.xrplUrl, { connectionTimeout: 10000 });
    await client.connect();
    const nftOffers = await client.request({
        method: isBuy ? "nft_buy_offers" : "nft_sell_offers",
        nft_id: tokenid
      });
    if (nftOffers && nftOffers.result)
        return nftOffers.result.offers;
    throw new ApiError(httpStatus.BAD_REQUEST, 'TokenId not found');
  } catch (error) {
    //console.log({ error });
    return [];
  }

  // HTTPs calls
  /*const body = {
      "method": "nft_buy_offers",
      "params": [{
        "nft_id": tokenid,
        "strict": true,
        "ledger_index": "validated",
        "api_version": 1
      }]
  };

  try {
    let response = await fetch(config.xrplUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(body)
    });
    let data = await response.json();
    if (data && data.result && data.result.offers)
      return data.result.offers;
    throw new ApiError(httpStatus.BAD_REQUEST, 'TokenId not found');
  } catch (error) {
    return [];
  }*/
};

module.exports = {
  getAccountNFTS,
  getOffersNFT,
};
