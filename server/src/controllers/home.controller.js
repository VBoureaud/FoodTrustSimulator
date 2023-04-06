const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const Ably = require('ably/promises');
const config = require('../config');

const rest = new Ably.Rest(config.ably_key);

const getHome = catchAsync(async (req, res) => {
  const data = 'Hello from Food Trust Simulator';

  res.status(httpStatus.OK).send({ data });
});

// create Token from Ably Lib
const getWss = catchAsync(async (req, res) => {
  const tokenParams = {
    clientId: "dev_fts",
  };

  rest.auth.createTokenRequest(tokenParams, (err, tokenRequest) => {
    if (err) {
      res.status(500).send("Error requesting token: " + JSON.stringify(err));
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(tokenRequest));
    }
  });  
});

module.exports = {
  getHome,
  getWss,
};