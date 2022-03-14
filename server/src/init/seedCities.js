const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../config/logger');
const { Cities } = require('../models');

const citiesJson = require('./cities_min.json');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(async () => {
  logger.info('Connected to MongoDB');
  logger.info('Start insertMany... Please wait');
  const count = await Cities.countDocuments({});
  if (!count) {
    await Cities.insertMany(citiesJson)
      .then(function(){
        logger.info('Data inserted');
        exitHandler();
      }).catch(function(error){
        console.log(error);
      });
  } else {
    logger.info('You already have filled your db.');
    exitHandler();
  }
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
