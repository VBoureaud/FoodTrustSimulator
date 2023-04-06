const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, notificationService } = require('../services');
const { sleep, diacriticSensitiveRegex } = require('../utils');

const addOne = catchAsync(async (req, res) => {
  //await sleep(2000);
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ user: user });
});

const updateOne = catchAsync(async (req, res) => {
  const user = await userService.updateUserByAddr(req.params.address, req.body);
  res.status(httpStatus.OK).send({ user: user });
});

const deleteOne = catchAsync(async (req, res) => {
  await userService.deleteUserByAddr(req.params.address);
  res.status(httpStatus.NO_CONTENT).send({});
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUser(req.query.address, req.query.server);
  if (user) {
    const notifications = await notificationService.getNotification(req.query.address, req.query.server);
    return res.status(httpStatus.OK).send({ user: { ...user.toObject(), notifications } });
  }
  return res.status(httpStatus.OK).send({ user });
});

const allUsers = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  let filter = pick(req.query, ['name', 'address', 'location', 'server' ]);

  // search name
  if (filter && filter.name)
   filter = { ...filter, "name": { "$regex": diacriticSensitiveRegex(filter.name.toLowerCase()), "$options": "i" } }
  else delete filter['name']
  // search address
  if (filter && filter.address)
   filter = { ...filter, "address": { "$regex": diacriticSensitiveRegex(filter.address), "$options": "i" } }
  else delete filter['address']
  // search location
  if (filter && filter.location)
   filter = { ...filter, "location.name": { "$regex": diacriticSensitiveRegex(filter.location), "$options": "i" } }
  else delete filter['location']

  const users = await userService.allUsers(filter, options);
  res.status(httpStatus.OK).send({ users: users });
});

const createAd = catchAsync(async (req, res) => {
  const user = await userService.createAd(req.params.address, req.body);
  res.status(httpStatus.OK).send({ user });
});

const logoutUser = catchAsync(async (req, res) => {
  const logout = await userService.logoutUserByAddr(req.params.address, req.params.server);
  res.status(httpStatus.OK).send({ logout });
});

module.exports = {
  addOne,
  updateOne,
  deleteOne,
  getUser,
  allUsers,
  createAd,
  logoutUser,
};