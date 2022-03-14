const Joi = require('joi');

const getName = {
  params: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

module.exports = {
  getName,
}