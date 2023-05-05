const httpStatus = require('http-status');
const MetaData = require('../models/metaData.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { 
  decodeHashURI,
  hashURI,
  displayDate,
  generateImageSpecs,
  randomInt,
  getObjInArray,
  getIndexInArray,
} = require('../utils');
const { 
  actionPoints,
  calculPocketSize,
  limitGame,
  profiles,
  buildUpdatedUser,
  type,
  levelDisplay,
  notifType,
  getRandomType,
  recipeCondition,
  getRecipePercent,
  configOnChain,
} = require('../config/gameEngine');
const xrplService = require('./xrpl.service');
const xrpl = require('xrpl');
const { addNotification } = require('./notification.service');
const {
  sendNotification
} = require('../wssApp');

/**
 * Create an MetaData
 * @param {Object} data {
 *  {string} address
 *  {string} name
 *  {string} nftToken
 *  {array} parents // if parents, check pockets
 *  {boolean} isSynchronise // block exp update & notif spam
 * }
 * @returns {Promise<MetaData>}
 */
const register = async (data) => {
  const debug = false;

  const nftToken = data.nftToken;
  const decoded = decodeHashURI(xrpl.convertHexToString(data.name));
  const address = data.address ? data.address : decoded.address;
  
  // If User exist
  const user = await User.findOne({ address });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  const server = getObjInArray(configOnChain, 'name', user.server);

  // If Token Exist (Server || XRPL)
  let metaData;
  let validity = true;
  metaData = await MetaData.findOne({ name: data.name });
  if (metaData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'URI already added');
  }
  metaData = await MetaData.findOne({ 'properties.nftToken': nftToken });
  if (metaData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'URI already added - 2');
  }

  let metaDataOwned = await MetaData.find({ 'properties.owner': user.address });
  metaDataOwned = metaDataOwned.filter(elt => elt.validity);
  // if 002001=Box, can be full pocket can tokens will migrate to the box
  if (decoded.type !== '002001' && metaDataOwned.length >= user.pocket) {
    //throw new ApiError(httpStatus.BAD_REQUEST, 'Pocket full');
    if (debug) console.log('pocket full');
    validity = false;
  }
  const accountNTFS = await xrplService.getAccountNFTS(user.address, server.url);
  if (!accountNTFS || accountNTFS.filter(e => e.NFTokenID == nftToken).length == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  }

  // recipe limitation
  if (validity && decoded.type === '001000') {
    const dayMillisec = 24 * 60 * 60 * 1000;
    const recipes = metaDataOwned.filter(elt => elt.validity && elt.image === '001000');
    const hasRecipeToday = recipes.filter(e => new Date().getTime() - new Date(decodeHashURI(xrpl.convertHexToString(e.name)).date).getTime() < dayMillisec);
    if (hasRecipeToday.length >= limitGame.recipeCreatedByDay)
      validity = false;
  }

  let parents = [];
  let validFusion = false;
  if (data.parents && data.parents.length > 0) { // NftToken merge - check if can
    if (debug) console.log('parents');

    // Check tokens exists
    for (let i = 0; i < data.parents.length; i++) {
      const uriCurrent = metaDataOwned.filter(e => e.name == data.parents[i])[0];
      if (!uriCurrent)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found or not valid.');
      parents.push(uriCurrent);
    }

    // Check valid Uri
    const recipes = metaDataOwned.filter((e) => e.validity && e.image.split('#')[0] === '001000').map((e) => e.properties.details);
    const details = parents.map((e) => e.image.split('#')[0]).sort();
    if (decoded.type === '001000') { // recipe only
      const recipePercent = recipeCondition(recipes, details);
      const recipe = getRecipePercent(type, recipePercent);
      if (debug) console.log({ recipe });
      if (!recipe || recipe.id !== decoded.type) {
          //throw new ApiError(httpStatus.BAD_REQUEST, 'Impossible to build this recipe.');
          if (debug) console.log('Impossible to build this recipe');
          validity = false;
      }
      validFusion = recipe && recipe.percent > 0;
    } else if (decoded.type === '002001') { // box only
      validFusion = true;
    }

    // Update Uri to !validity + history
    const destroyActionName = {
      '001000': 'cooked',
      '002001': 'packaged',
    }
    for (let i = 0; i < parents.length; i++) {
      const historyParent = parents[i].properties.history;
      historyParent.push({
        action: destroyActionName[decoded.type],
        date: new Date().getTime(),
        user: address,
        price: null,
      });
      parents[i].validity = false;
      parents[i].properties.history = historyParent;
      parents[i].save();
    }

    // transform parents metaData[] to name[]
    parents = parents.map(e => e.name);

  } else { // mint a token - check if you can
    //throw new ApiError(httpStatus.BAD_REQUEST, 'Nope2.');
    //return false;
    if (user.tokenBuildable.indexOf(decoded.type) === -1) {
      if (debug) console.log('no permission for this token');
      //throw new ApiError(httpStatus.BAD_REQUEST, 'No permission for this token');
      validity = false;
    }
  }

  // mint a recipe, a box or coin - cook & manager
  let details = '';
  let power = data.parents && validFusion ? limitGame.powerWhenParents : limitGame.powerDefault;
  let durability = data.parents ? limitGame.durabilityTokenFusionned : limitGame.durabilityDefault;
  if (decoded.type === '001000') {
    const nbTokens = randomInt(2, 7);
    const needInRecipe = getRandomType([], 'farmer', nbTokens);
    details = needInRecipe.join(';');
    durability = 0;
    power = limitGame.powerDefault;
  } else if (decoded.type === '002000') {
    durability = 0;
    power = limitGame.powerDefault;
  }

  const history = [{
    action: 'created',
    date: new Date().getTime(),
    user: decoded.address,
    price: null,
  }];
  if (!validity) {
    history.push({
      action: 'destroyed',
      date: new Date().getTime(),
      user: address,
      price: null,
    });
  }

  const metaDataDoc = await MetaData.create({
    name: data.name,
    description: `MetaData for ${nftToken} type ${decoded.type}`,
    image: decoded.type + (parseInt(decoded.type) < 1000 && validity ? '#' + generateImageSpecs() : ''),
    properties: {
      owner: address,
      history,
      nftToken,
      offerBuy: [],
      parents,
      durability: validity ? durability : 0,
      details,
      power: validity ? power : limitGame.powerDefault,
    },
    validity,
  });

  if (!data.isSynchronise) {
    const xpWinned = data.parents && validFusion && decoded.type === '001000' ? actionPoints.fusionTokenValid : actionPoints.mintToken;
    const descriptionValid = 'You have minted a ' + type[decoded.type].name + ' ('+ decoded.type +'). This gives you ' + xpWinned + ' more xp.\nReference: ' + nftToken;
    const descriptionNotValid = 'You have minted a ' + type[decoded.type].name + ' ('+ decoded.type +').\nReference: ' + nftToken;

    const notifs = await addNotification(
      address,
      user.server,
      notifType.mintToken,
      'NFT created',
      validity ? descriptionValid : descriptionNotValid
    );

    // Update User Exp && Validity
    if (validity) {      
      const updatedUser = buildUpdatedUser(user.experience, xpWinned, null, user.type)

      if (levelDisplay(user.experience) != levelDisplay(updatedUser.experience)) {
        // Add notif new level
        const notifs = await addNotification(
          user.address,
          user.server,
          notifType.levelUp,
          'Level Up',
          'You have reached level ' + levelDisplay(updatedUser.experience));
      }

      Object.assign(user, updatedUser);
      await user.save();
    } else {
      const notifs = await addNotification(
        address,
        user.server,
        notifType.deleteToken,
        'NFT deleted',
        'Validation of this new token failed on Game Server.');
    }
  }

  return metaDataDoc;
};

/**
 * Query for Uris
 * @param {Object} filter - Mongo filter
 * @param {string} [filter.properties.owner] - get Uris with this owner
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
 * @param {string} [updateBody.owner] - change owner token, update history
 * @param {string} [updateBody.offer] - Add or remove an offer Buy or Sell
 * @param {string} [updateBody.validity] - Change validity
 * @param {string} [updateBody.action] - Edit Image
 * @param {boolean} isSynchronise - when come from synchronise
 * @returns {Promise<URI>}
 */
const patchUri = async (name, updateBody, isSynchronise=false) => {
  const debug = false;
  const decoded = decodeHashURI(xrpl.convertHexToString(name));
  const now = new Date().getTime();
  let price = null;

  // If MetaData exist
  const metaData = await MetaData.findOne({ 'name': name });
  if (!metaData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'URI not found');
  }
  const typeToken = metaData.image.split('#')[0];

  // current owner
  const user1 = await User.findOne({ address: metaData.properties.owner });
  if (!user1) throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  const server = getObjInArray(configOnChain, 'name', user1.server);

  // Change Owner, User1 transfer to User2 
  // Check User exist + owner get token on XRPL
  if (updateBody.owner) {
    const user2 = await User.findOne({ address: updateBody.owner });
    if (!user2)
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');

    // Check coherence with XRPL
    if (user1.server != user2.server)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Addresses not on the same network.');
    const accountNTFS = await xrplService.getAccountNFTS(updateBody.owner, server.url);
    if (accountNTFS.filter(e => e.NFTokenID == metaData.properties.nftToken).length == 0)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found');

    // Check Offer coherence with XRPL and get Price
    const buyOffersNFT = await xrplService.getOffersNFT(metaData.properties.nftToken, server.url, true);
    const sellOffersNFT = await xrplService.getOffersNFT(metaData.properties.nftToken, server.url, false);
    const isBuyOfferOnXRPL = buyOffersNFT.filter(e => e.owner == updateBody.owner).length == 1;
    const isSellOfferOnXRPL = sellOffersNFT.filter(e => e.owner == updateBody.owner).length == 1;
    const isBuyOfferOnGameServer = metaData.properties.offerBuy.filter(e => e.split('_')[0] == updateBody.owner).length == 1;
    const isSellOfferOnGameServer = metaData.properties.offerSell.filter(e => e.split('_')[0] == metaData.properties.owner).length == 1;
    if (debug) console.log({ isBuyOfferOnXRPL });
    if (debug) console.log({ isSellOfferOnXRPL });
    if (debug) console.log({ isBuyOfferOnGameServer });
    if (debug) console.log({ isSellOfferOnGameServer });

    // Buy offer complete
    if (isBuyOfferOnGameServer && !isBuyOfferOnXRPL) {
      if (debug) console.log('its a buy');
      const indexBuyToRm = getIndexInArray(metaData.properties.offerBuy.map(e => e.split('_')[0]), updateBody.owner);
      if (indexBuyToRm !== -1) {
        price = metaData.properties.offerBuy[indexBuyToRm].split('_')[1];
        metaData.properties.offerBuy.splice(indexBuyToRm, 1);
      }
    }
    // Sell offer complete
    else if (isSellOfferOnGameServer && !isSellOfferOnXRPL) {
      if (debug) console.log('its a sell');
      const indexSellToRm = getIndexInArray(metaData.properties.offerSell.map(e => e.split('_')[0]), metaData.properties.owner);
      if (indexSellToRm !== -1) {
        price = metaData.properties.offerSell[indexSellToRm].split('_')[1];
        metaData.properties.offerSell.splice(indexSellToRm, 1);
      }
    }

    // OK UPDATE
    const oldOwner = metaData.properties.owner;
    metaData.properties.owner = updateBody.owner;
    metaData.properties.history.push({
      action: 'sell',
      date: new Date().getTime(),
      user: updateBody.owner,
      price,
    });
    await metaData.save();

    // Add Notifications for both users.
    if (!isSynchronise) {
      const isSmallProfile = user1.experience < limitGame.smallProfile;
      const expVolumeOldOwner = actionPoints.acceptedOffer;
      const expVolumeNewOwner = isSmallProfile ? actionPoints.buyOfferToSmallLevel : 0;

      await addNotification(
        user1.address,
        user1.server,
        notifType.transferToken,
        'NFT transferred',
        `You sold your ${type[typeToken].name} (${decoded.type}) to ${user2.name}. This gives you ${expVolumeOldOwner} more xp.\nReference: ${metaData.properties.nftToken}`
      );
      await addNotification(
        user2.address,
        user2.server,
        notifType.transferToken,
        'NFT transferred',
        `You bought a ${type[typeToken].name} (${decoded.type}) from ${user1.name}. ${expVolumeNewOwner ? `It is an user with beginner experience, this gives you ${expVolumeNewOwner} more xp.` : ''}\nReference: ${metaData.properties.nftToken}`
      );

      // Update User1 & User2
      const updatedUser1 = buildUpdatedUser(user1.experience, expVolumeOldOwner, user1.transactions, user1.type);
      if (levelDisplay(user1.experience) != levelDisplay(updatedUser1.experience)) {
        // Add notif new level
        await addNotification(
          user1.address,
          user1.server,
          notifType.levelUp,
          'Level Up',
          'You have reached level ' + levelDisplay(updatedUser1.experience));
      }
      Object.assign(user1, updatedUser1);
      await user1.save();

      const updatedUser2 = buildUpdatedUser(user2.experience, expVolumeNewOwner, user2.transactions, user2.type);
      if (levelDisplay(user2.experience) != levelDisplay(updatedUser2.experience)) {
        // Add notif new level
        await addNotification(
          user2.address,
          user2.server,
          notifType.levelUp,
          'Level Up',
          'You have reached level ' + levelDisplay(updatedUser2.experience));
      }
      Object.assign(user2, updatedUser2);
      await user2.save();
    }

    return metaData;
  }

  // Add / Rm an Offer Buy or Sell (if same user)
  if (metaData.validity && updateBody.offer) {
    /*if (updateBody.offer == metaData.properties.owner) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Same User Owner & Offer.');
    }*/

    const offer = updateBody.offer.split('_');//address_price
    const user2 = await User.findOne({ address: offer[0] });
    if (!user1 || !user2) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
    }

    const isBuyOffer = user1.address != user2.address;
    const currentOffersNFT = await xrplService.getOffersNFT(metaData.properties.nftToken, server.url, isBuyOffer);
    const isOfferOnXRPL = currentOffersNFT.filter(e => e.owner == offer[0]).length == 1;

    const isOfferBuyOnGameServer = metaData.properties.offerBuy.filter(e => e.split('_')[0] == offer[0]).length == 1;
    const isOfferSellOnGameServer = metaData.properties.offerSell.filter(e => e.split('_')[0] == offer[0]).length == 1;
    if (debug) console.log({ isBuyOffer });
    if (debug) console.log({ isOfferOnXRPL });
    if (debug) console.log({ isOfferBuyOnGameServer });
    if (debug) console.log({ isOfferSellOnGameServer });

    if ((isOfferBuyOnGameServer || isOfferSellOnGameServer) && !isOfferOnXRPL) {
      // rm offer
      const indexBuyToRm = getIndexInArray(metaData.properties.offerBuy.map(e => e.split('_')[0]), offer[0]);
      const indexSellToRm = getIndexInArray(metaData.properties.offerSell.map(e => e.split('_')[0]), offer[0]);

      if (isBuyOffer && indexBuyToRm !== -1) {
        metaData.properties.offerBuy.splice(indexBuyToRm, 1);
        await metaData.save();
      }
      else if (!isBuyOffer && indexSellToRm !== -1) {
        metaData.properties.offerSell.splice(indexSellToRm, 1);
        await metaData.save();
      }
      return metaData;
    }
    else if ((!isOfferBuyOnGameServer && !isOfferSellOnGameServer) && isOfferOnXRPL) {
      // add offer
      if (isBuyOffer)
        metaData.properties.offerBuy.push(updateBody.offer + '_' + now);
      else
        metaData.properties.offerSell.push(updateBody.offer + '_' + now);

      await metaData.save();
      if (isBuyOffer) // contact the owner
        await sendNotification(user1.address, user1.server, `You have received an offer for your ${type[typeToken].name}.\nReference: ${metaData.properties.nftToken}`);
      return metaData;
    } else {
      //throw new ApiError(httpStatus.BAD_REQUEST, 'Coherence issue');
      console.log('Update Offer - Coherence issue');
      return null;
    }
  }

  // Change validity
  if (metaData.validity && updateBody.validity != null && updateBody.validity === false) {
    metaData.validity = updateBody.validity;
    metaData.properties.history.push({
      action: 'destroyed',
      date: new Date().getTime(),
      user: user1,
      price: null,
    });

    await metaData.save();
    return metaData;
  }

  // Update Image Cold or Heat 
  // Same actionName to update in generateImageSpecs
  const actionList = ['freeze', 'bake'];
  if (metaData.validity && updateBody.action && actionList.indexOf(updateBody.action) !== -1) {
    let durability = metaData.durability;
    let power = metaData.power;
    let image = metaData.image.split('#')[0];
    image = image + '#' + generateImageSpecs(updateBody.action);
    
    durability = updateBody.action === 'freeze' ? limitGame.durabilityWhenCold : limitGame.durabilityWhenHeat;
    power = updateBody.action === 'bake' ?
      (metaData.parents && metaData.parents.length > 0 ? limitGame.powerWhenHeatWParents : limitGame.powerWhenHeat)
      : limitGame.powerWhenCold;

    metaData.properties.durability = durability;
    metaData.properties.power = power;
    metaData.image = image;
    metaData.properties.history.push({
      action: updateBody.action,
      date: new Date().getTime(),
      user: user1.address,
      price: null,
    });

    await metaData.save();
    return metaData;
  }

  //throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Uri 1');
  return null;
};


/**
 * Delete URI - Check delete onchain & update URI to validity false
 * @param {string} name
 * @param {Object} body
 * @param {string} [body.owner]
 * @returns {Promise<URI>}
 */
const deleteUri = async (name, body) => {
  const decoded = decodeHashURI(xrpl.convertHexToString(name));

  // If MetaData exist
  const metaData = await MetaData.findOne({ 'name': name });
  if (!metaData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'URI not found');
  }
  else if (!metaData.validity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'URI already invalidated.');
  }
  const user1 = await User.findOne({ address: metaData.properties.owner });
  if (!user1)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  const server = getObjInArray(configOnChain, 'name', user1.server);

  const accountNTFS = await xrplService.getAccountNFTS(body.owner, server.url);
  if (accountNTFS.filter(e => e.NFTokenID == metaData.properties.nftToken).length != 0)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token not deleted on-chain');

  metaData.validity = false;
  metaData.properties.history.push({
      action: 'destroyed',
      date: new Date().getTime(),
      user: metaData.properties.owner,
      price: null,
    });
  await metaData.save();
  //await metaData.remove();

  const notifs = await addNotification(
      user1.address,
      user1.server,
      notifType.deleteToken,
      'NFT deleted',
      'You deleted a ' + (type[decoded.type] ? type[decoded.type].name : 'unknown') + ' ('+ decoded.type +').\nReference: ' + metaData.properties.nftToken);

  return metaData;
}


/**
 * Parents URI - Get all parents from a child
 * @param {string} name
 * @returns {ancestor}
 */
const parentsUri = async (name) => {
  console.log('parentsUri');
  const decoded = decodeHashURI(xrpl.convertHexToString(name));

  // If MetaData exist
  const metaData = await MetaData.findOne({ 'name': name });
  if (!metaData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'URI not found');
  }
  const userWhoCreateToken = metaData.properties.history[0].user;
  const user1 = await User.findOne({ address: userWhoCreateToken });

  // structure: { elt: { uri: Uri, user: User }, children: [{ structure }] }
  let ancestor = {};
  const createNode = async (ancestor) => {
    for (let i = 0; i < ancestor.children.length; i++) {
      const metaDataChild = await MetaData.findOne({ 'name': ancestor.children[i] });
      if (metaDataChild) {
        const userWhoCreateToken = metaDataChild.properties.history[0].user;
        const user1 = await User.findOne({ address: userWhoCreateToken });

        const node = { elt: { uri: metaDataChild, user: user1 }, children: metaDataChild.properties.parents };
        ancestor.children[i] = node;
        await createNode(ancestor.children[i]);
      }
    }
  }

  if (metaData.properties.parents && metaData.properties.parents.length > 0) {
    const parents = metaData.properties.parents.slice();
    ancestor = { elt: { uri: metaData, user: user1 }, children: parents };
    await createNode(ancestor);
  }

  return ancestor;
}

/**
 * Synchronise NFT between XRPL and GameServer
 * @param {string} address
 * @param {array[object]} accountNFTS
 *  {
  *   Flags,
  *   Issuer,
  *   NFTokenID,
  *   NFTokenTaxon,
  *   URI,
  *   nft_serial,
 *  }
 */
const synchroniseUris = async (address, accountNTFS) => {
  console.log('synchroniseUris');
  let howManyUpdate = 0;
  let howManyAdd = 0;
  let howManyDelete = 0;
  const foodTrustNFTS = accountNTFS.map((elt) => ({ ...elt, URI_decoded: decodeHashURI(xrpl.convertHexToString(elt.URI)) }) ).filter(elt => elt.URI_decoded.date !== NaN);
  const urisGameServer = await queryUris({ "properties.owner": address }, {});
  const urisName = urisGameServer.results ? urisGameServer.results.map((elt) => elt.name) : [];

  // check coherence NFTS from XRPL and GameServer for this account
  for (let i = 0; i < foodTrustNFTS.length; i++) {
    // check if valid NFTs for FTS
    if (isNaN(foodTrustNFTS[i].URI_decoded.date.getTime())) {
      console.log('is not a fts token');
      continue;
    }
    
    // check if exist in GameServer
    const uri = await MetaData.findOne({ name: foodTrustNFTS[i].URI });
    if (uri && uri.properties.owner != address) {
      // need update owner in GameServer
      const res = await patchUri(
          foodTrustNFTS[i].URI, {
            owner: address
          },
          true
        );
        if (!res) throw new ApiError(httpStatus.BAD_REQUEST, 'Issue during update Uris - E0.1');
        howManyUpdate = howManyUpdate + 1;
    } else if (!uri) {
      // need add in GameServer
      const res = await register({
        address,
        name: foodTrustNFTS[i].URI,
        nftToken: foodTrustNFTS[i].NFTokenID,
        parents: [],
        isSynchronise: true,
      });
      if (!res) throw new ApiError(httpStatus.BAD_REQUEST, 'Issue during update Uris - E0.2');
    
      howManyAdd = howManyAdd + 1;
    }

    // save coherence fixed for this uri
    if (urisName.indexOf(foodTrustNFTS[i].URI) !== -1)
      urisName.splice(urisName.indexOf(foodTrustNFTS[i].URI), 1);
  }
  
  // still some ? need delete in GameServer
  if (urisName.length) {
    for (let i = 0; i < urisName.length; i++) {
      if (urisGameServer.results.filter(elt => elt.name === urisName[i])[0].validity) {
        howManyDelete++;
        deleteUri(urisName[i], { owner: address })
      }
    }
  }

  if (howManyAdd)
    console.log('Added', howManyAdd, 'URIs.');
  if (howManyDelete)
    console.log('Deleted', howManyDelete, 'URIs.');
  if (howManyUpdate)
    console.log('Updated', howManyUpdate, 'URIs.');
  return { howManyAdd, howManyDelete, howManyUpdate };
}


module.exports = {
  register,
  queryUris,
  patchUri,
  deleteUri,
  parentsUri,
  synchroniseUris,
};