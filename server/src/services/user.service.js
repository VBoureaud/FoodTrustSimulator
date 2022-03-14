const config = require('../config');
const { 
  profiles,
  getRandomType,
  buildUpdatedUser,
  actionPoints
} = require('../config/gameEngine');
const { decodeHashURI } = require('../utils');
const httpStatus = require('http-status');
const { User } = require('../models');
const { MetaData } = require('../models');
const ApiError = require('../utils/ApiError');
const xrpl = require('./xrpl.service');

/**
 * Create an User
 * @param {Object} data
 * @param {string} [data.name] - name or pseudo for this user
 * @param {string} [data.profile] - profile reference
 * @param {string} [data.address] - address account XRPL
 * @returns {Promise<User>}
 */
const createUser = async (data) => {
  // check title
  let name = data.name.trim();
  let profile = data.profile ? data.profile.trim() : null;
  let address = data.address.trim();
  let location = data.location;

  const user = await getOne(address);
  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist for this address');
  }
  const accountNTFS = await xrpl.getAccountNFTS(data.address);
  if (!accountNTFS) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Account not found');
  }

  const userDoc = await User.create({
    name,
    profile,
    address,
    location,
  });
  return userDoc;
};

/**
 * Get all users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const allUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};


/**
 * Get one user with this address
 * @param {string} address
 * @returns {Promise<QueryResult>}
 */
const getOne = async (address) => {
  const user = await User.find({ address });
  return user ? user[0] : null;
};

/**
 * Update user by address
 * Can only work for update profile, one time
 * or for Quest Completed.
 * @param {string} address
 * @param {Object} updateBody
 * @param {string} [updateBody.profile] - profile type for user
 * @param {boolean} [updateBody.quest] - if true, check quest validation
 * @returns {Promise<User>}
 */
const updateUserByAddr = async (address, updateBody) => {
  const user = await getOne(address);
  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  
  if (updateBody.profile && user.profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot update a second time');
  } else if (updateBody.profile) {
    const profilesAvailable = Object.keys(profiles);
    if (profilesAvailable.indexOf(updateBody.profile) == -1)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Profile');

    // force farmer, until others profiles are developped
    updateBody['tokenBuildable'] = getRandomType([], 'farmer');
    updateBody['tokenNeeded'] = getRandomType(updateBody['tokenBuildable'], 'farmer');
    updateBody['pocket'] = profiles['farmer'].pocketSize;

    Object.assign(user, updateBody);
    await user.save();

    return user;  
  } else if (updateBody.quest) {
    // Check nb collection then match list
    const requiredCollection = user.tokenNeeded;
    const metaDatas = await MetaData.find({ 'properties.owner': address });
    if (metaDatas.length < requiredCollection.length)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request');
    
    let collectionFind = [];
    for (let i = 0; i < metaDatas.length; i++) {
      const type = decodeHashURI(metaDatas[i].name).type;
      if (requiredCollection.indexOf(type) != -1 && collectionFind.indexOf(type) == -1)
        collectionFind.push(type);
    }
    
    if (collectionFind.length != requiredCollection.length)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request');
    
    // UPDATE TIME
    const updatedBody = buildUpdatedUser(user.experience, collectionFind.length > 0 ? actionPoints.questCompleted : 0);
    updatedBody['tokenNeeded'] = getRandomType([], 'farmer');
    Object.assign(user, updatedBody);
    await user.save();
    return user;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request');
};

/**
 * Delete user by address
 * @param {Object} address
 * @returns {Promise<User>}
 */
const deleteUserByAddr = async (address) => {
  const user = await getOne(address);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // Forbidden action by default
  throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  await user.remove();
  return user;
};


module.exports = {
  createUser,
  allUsers,
  getOne,
  updateUserByAddr,
  deleteUserByAddr,
};
