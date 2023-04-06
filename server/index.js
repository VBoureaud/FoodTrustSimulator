const mongoose = require('mongoose');
const app = require('./src/app');
//const { wss } = require('./src/wssApp');
const config = require('./src/config');
const logger = require('./src/config/logger');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Http Server listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  /*if (wss) {
    wss.close();
  }*/
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
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
  /*if (wss) {
    wss.close();
  }*/
});
