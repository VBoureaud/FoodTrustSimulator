const httpStatus = require('http-status');
const MetaData = require('../models/metaData.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { decodeHashURI } = require('../utils');
const { 
  actionPoints,
  calculPocketSize,
  limitGame,
  levelDisplay,
  getRandomType,
  profiles,
  buildUpdatedUser,
} = require('../config/gameEngine');
const xrpl = require('./xrpl.service');

/**
 * Create an MetaData
 * @param {Object} data {
 *  {string} name
 *  {string} nftToken
 *  {array} parents
 * }
 * @returns {Promise<MetaData>}
 */
const register = async (data) => {
  const nftToken = data.nftToken;
  const decoded = decodeHashURI(data.name);

  // If User exist
  const user = await User.findOne({ address: decoded.address });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  // If Token Exist (Server || XRPL)
  let metaData;
  metaData = await MetaData.findOne({ name: data.name });
  if (metaData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'URI already added');
  }
  metaData = await MetaData.findOne({ 'properties.nftToken': nftToken });
  if (metaData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'URI already added');
  }
  const accountNTFS = await xrpl.getAccountNFTS(decoded.address);
  if (accountNTFS.filter(e => e.NFTokenID == nftToken).length == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  }

  const metaDataDoc = await MetaData.create({
    name: data.name,
    description: `MetaData for ${nftToken} type ${decoded.type}`,
    image: decoded.type,
    properties: {
      owner: decoded.address,
      ownerHistory: [],
      nftToken,
      offerBuy: [],
      parents: [],
    },
  });

  // Update User Exp
  const updatedUser = buildUpdatedUser(user.experience, actionPoints.mintToken)
  Object.assign(user, updatedUser);
  await user.save();

  return metaDataDoc;
};

/**
 * Query for Uris
 * @param {Object} filter - Mongo filter
 * @param {string} [filter.name] - get Uris with this name
 * @param {string} [filter.nftToken] - get Uris with this nftToken
 * @param {string} [filter.address] - get Uris with this address
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUris = async (filter, options) => {
  const uris = await MetaData.paginate(filter, options);
  return uris;
};

/**
 * Update URI
 * @param {string} name
 * @param {Object} updateBody
 * @param {string} [updateBody.owner] - change owner token, update ownerHistory
 * @param {string} [updateBody.offerBuy] - Add or remove an offerBuy
 * @returns {Promise<URI>}
 */
const patchUri = async (name, updateBody) => {
  const decoded = decodeHashURI(name);

  // If MetaData exist
  const metaData = await MetaData.findOne({ 'name': name });
  if (!metaData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'URI not found');
  }

  // Change Owner, User1 transfer to User2 
  // Check User exist + owner get token on XRPL
  if (updateBody.owner) {
    const user1 = await User.findOne({ address: metaData.properties.owner });
    const user2 = await User.findOne({ address: updateBody.owner });
    if (!user1 || !user2)
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');

    // Check coherence with XRPL
    const accountNTFS = await xrpl.getAccountNFTS(updateBody.owner);
    if (accountNTFS.filter(e => e.NFTokenID == metaData.properties.nftToken).length == 0)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found');

    // Rm Buy Offer belonging to new owner
    if (metaData.properties.offerBuy.indexOf(updateBody.owner) != -1)
      metaData.properties.offerBuy.splice(metaData.properties.offerBuy.indexOf(updateBody.owner), 1);

    // OK UPDATE
    const oldOwner = metaData.properties.owner;
    metaData.properties.owner = updateBody.owner;
    metaData.properties.ownerHistory = [ ...metaData.properties.ownerHistory, oldOwner ];
    await metaData.save();

    // Update User1 & User2
    const expVolume = user2.experience < limitGame.smallProfile ? actionPoints.buyOfferToSmallLevel : actionPoints.acceptedOffer;
    const updatedUser = buildUpdatedUser(user1.experience, expVolume, user1.transactions);
    Object.assign(user1, updatedUser);
    await user1.save();

    const updatedUser2 = {
      transactions: user2.transactions ? user2.transactions + 1 : 1,
    };
    Object.assign(user2, updatedUser2);
    await user2.save();

    return metaData;
  }

  // Add / Rm an Offer Buy
  if (updateBody.offerBuy) {
    if (updateBody.offerBuy == metaData.properties.owner) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Same User Owner & Offer.');
    }

    const user2 = await User.findOne({ address: updateBody.offerBuy });
    if (!user2) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
    }

    const currentOffersNFT = await xrpl.getOffersNFT(metaData.properties.nftToken);
    const isOfferOnXRPL = currentOffersNFT.filter(e => e.owner == updateBody.offerBuy).length == 1;

    const isOfferOnGameServer = metaData.properties.offerBuy.filter(e => e == updateBody.offerBuy).length == 1;
    
    if (isOfferOnGameServer && !isOfferOnXRPL) {
      // rm offer
      metaData.properties.offerBuy.splice(
        metaData.properties.offerBuy.indexOf(updateBody.offerBuy),
        1
      );
      await metaData.save();
      return metaData;
    }
    else if (!isOfferOnGameServer && isOfferOnXRPL) {
      // add offer
      metaData.properties.offerBuy.push(updateBody.offerBuy);
      await metaData.save();
      return metaData;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Coherence issue');
    }
  }

  throw new ApiError(httpStatus.BAD_REQUEST, '');
};

/**
 * Get URI History with location
 * @param {string} tokenId
 * @returns {Promise<URI>}
 */
const historyUri = async (tokenId) => {
  // If MetaData exist
  const metaData = await MetaData.findOne({ 'properties.nftToken': tokenId });
  if (!metaData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'URI not found');
  }
  const finalDest = metaData.properties.owner;
  const history = metaData.properties.ownerHistory.reverse();
  history.unshift(finalDest);

  const res = {
    name: metaData.name,
    details: [],
  };
  for (let i = 0; i < history.length; i++) {
    const user = await User.findOne({ address: history[i] });
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
    }
    res.details.push({
      userName: user.name,
      address: user.address,
      country: user.location.country,
      name: user.location.name,
      lat: user.location.lat,
      lng: user.location.lng,
    });
  }

  return res;
}

module.exports = {
  register,
  queryUris,
  patchUri,
  historyUri,
};