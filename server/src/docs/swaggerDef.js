const { version } = require('../../package.json');
const config = require('../config');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: `${config.appName} API documentation`,
    version,
    license: {
      name: 'MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDefinition;
