const Joi = require('joi');
const { objectId, xrplAddress } = require('./custom.validation');

const addOne = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    profile: Joi.string().optional().allow(''),
    address: Joi.string().custom(xrplAddress),
    location: Joi.object().optional().keys({
      name: Joi.string(),
      lat: Joi.string(),
      lng: Joi.string(),
      country: Joi.string(),
    })
  }),
};
const getOne = {
  params: Joi.object().keys({
    address: Joi.string().custom(xrplAddress),
  }),
};
const updateOne = {
  params: Joi.object().keys({
    address: Joi.string().custom(xrplAddress),
  }),
  body: Joi.object()
    .keys({
      profile: Joi.string(),
      quest: Joi.boolean(),
    })
    .min(1),
};
const deleteOne = {
  params: Joi.object().keys({
    address: Joi.string().custom(xrplAddress),
  }),
};
const allUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    address: Joi.string(),
    location: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


module.exports = {
  addOne,
  getOne,
  updateOne,
  deleteOne,
  allUsers,
};