const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    PORT_WS: Joi.number().default(3005),
    APP_NAME: Joi.string().description('Project Name'),
    CLIENT_URL: Joi.string().description('Url of front project'),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    XRPL_URL: Joi.string().required().description('TESTNET XRPL'),
    TEST_SECOND_ADDRESS_XRPL: Joi.string().required().description('For uri.test, real address from XRPL'),
    TEST_ADDRESS_XRPL: Joi.string().required().description('For uri.test, real address from XRPL'),
    TEST_NFT_TOKEN_XRPL: Joi.string().required().description('For uri.test, real NFTtoken from XRPL'),
    TEST_SECOND_NFT_TOKEN_XRPL: Joi.string().required().description('For uri.test, real NFTtoken from XRPL'),
    ABLY_KEY: Joi.string().required().description('Ably Key to connect WebSocket.'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  port_ws: envVars.PORT_WS,
  appName: envVars.APP_NAME,
  clientUrl: envVars.CLIENT_URL,
  xrplUrl: envVars.XRPL_URL,
  testAddressXRPL: envVars.TEST_ADDRESS_XRPL,
  testSecondAddressXRPL: envVars.TEST_SECOND_ADDRESS_XRPL,
  testNftTokenXRPL: envVars.TEST_NFT_TOKEN_XRPL,
  testSecondNftTokenXRPL: envVars.TEST_SECOND_NFT_TOKEN_XRPL,
  ably_key: envVars.ABLY_KEY,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
