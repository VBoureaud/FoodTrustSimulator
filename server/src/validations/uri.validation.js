const Joi = require('joi');
const { 
  uriHash,
  xrplAddress,
  xrplOffer,
  updateUriActionType
} = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    name: Joi.string().required().custom(uriHash),
    nftToken: Joi.string().length(64).pattern(/^[A-Z0-9]+$/).required(),
    parents: Joi.array().items(Joi.string()),
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
      offer: Joi.string().custom(xrplOffer),
      action: Joi.string().custom(updateUriActionType),
    })
    .min(1),
};

const deleteUri = {
  params: Joi.object().keys({
    name: Joi.string().custom(uriHash).required(),
  }),
  body: Joi.object()
    .keys({
      owner: Joi.string().custom(xrplAddress),
    })
    .min(1),
};

const parentsUri = {
  params: Joi.object().keys({
    name: Joi.string().custom(uriHash).required(),
  }),
};

module.exports = {
  register,
  queryUris,
  patchUri,
  deleteUri,
  parentsUri,
};