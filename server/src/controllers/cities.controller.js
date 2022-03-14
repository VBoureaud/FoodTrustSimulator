const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { citiesService } = require('../services');
const { diacriticSensitiveRegex } = require('../utils');

const getName = catchAsync(async (req, res) => {
  const name = req.params.name.replace(/[^a-zA-Z0-9 ]/g, '');
  
  const filter = { "name": { "$regex": "^" + diacriticSensitiveRegex(name.toLowerCase()), "$options": "i" } };
  const options = { "limit": 10 };

  const cities = await citiesService.queryName(filter, options);
  res.status(httpStatus.OK).send({ cities });
});

module.exports = {
  getName,
}