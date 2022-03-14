const Joi = require('joi');
const { uriHash, xrplAddress } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    name: Joi.string().required().custom(uriHash),
    nftToken: Joi.string().length(64).pattern(/^[A-Z0-9]+$/).required(),
    parents: Joi.string(),
  }),
};

const queryUris = {
  query: Joi.object().keys({
    name: Joi.string().custom(uriHash),
    nftToken: Joi.string().length(64).pattern(/^[A-Z0-9]+$/),
    address: Joi.string().custom(xrplAddress),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const patchUri = {
  params: Joi.object().keys({
    name: Joi.string().custom(uriHash).required(),
  }),
  body: Joi.object()
    .keys({
      owner: Joi.string().custom(xrplAddress),
      offerBuy: Joi.string().custom(xrplAddress),
    })
    .min(1),
};

const historyUri = {
  params: Joi.object().keys({
    tokenId: Joi.string().length(64).pattern(/^[A-Z0-9]+$/),
  }),
};

module.exports = {
  register,
  queryUris,
  patchUri,
  historyUri,
};