const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    APP_NAME: Joi.string().description('Project Name'),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    XRPL_URL: Joi.string().required().description('DevNet NFT XRPL'),
    TEST_SECOND_ADDRESS_XRPL: Joi.string().required().description('For uri.test, real address from XRPL'),
    TEST_ADDRESS_XRPL: Joi.string().required().description('For uri.test, real address from XRPL'),
    TEST_NFT_TOKEN_XRPL: Joi.string().required().description('For uri.test, real NFTtoken from XRPL'),
    TEST_SECOND_NFT_TOKEN_XRPL: Joi.string().required().description('For uri.test, real NFTtoken from XRPL'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  appName: envVars.APP_NAME,
  xrplUrl: envVars.XRPL_URL,
  testAddressXRPL: envVars.TEST_ADDRESS_XRPL,
  testSecondAddressXRPL: envVars.TEST_SECOND_ADDRESS_XRPL,
  testNftTokenXRPL: envVars.TEST_NFT_TOKEN_XRPL,
  testSecondNftTokenXRPL: envVars.TEST_SECOND_NFT_TOKEN_XRPL,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};
