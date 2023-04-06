const mongoose = require('mongoose');
const supertest = require('supertest');
const { User, MetaData } = require('../../models');
const config = require('../../config');
const app = require('../../app');
const { 
  actionPoints,
  profiles
} = require('../../config/gameEngine');

beforeEach((done) => {
  mongoose.connect(config.mongoose.url, config.mongoose.options)
  .then(() => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  });
});

test("POST /v1/uri - after mint a nftToken", async () => {
  const userData = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };
  const user = await User.create(userData);

  const type = "000001";
  const now = new Date().getTime();
  const uriData = {
    "name": config.testAddressXRPL + now + type,
    "nftToken": config.testNftTokenXRPL,
  };

  await supertest(app).post("/v1/uri")
    .send(uriData)
    .expect(201)
    .then(async (response) => {
      // Check the response
      expect(response.body.uri).toBeTruthy();
      expect(response.body.uri.id).toBeTruthy();
      expect(response.body.uri.name).toBe(uriData.name);
      expect(response.body.uri.image).toBe(type);
      expect(response.body.uri.properties).toBeTruthy();
      expect(response.body.uri.properties.owner).toBe(userData.address);
      expect(response.body.uri.properties.nftToken).toBe(uriData.nftToken);
      expect(response.body.uri.properties.history.length).toBe(1);
      
      // Check data in the database
      const metaData = await MetaData.findOne({ _id: response.body.uri.id });
      expect(metaData).toBeTruthy();
      expect(metaData.name).toBe(uriData.name);
      expect(metaData.image).toBe(type);
      expect(metaData.properties).toBeTruthy();
      expect(metaData.properties.owner).toBe(userData.address);
      expect(metaData.properties.nftToken).toBe(uriData.nftToken);    
      expect(metaData.properties.history.length).toBe(1);
      
      const userUpdated = await User.findOne({ _id: user.id });
      expect(userUpdated).toBeTruthy();
      expect(userUpdated.experience).toBe(actionPoints.mintToken);
      expect(userUpdated.pocket).toBe(profiles.farmer.pocketSize);
    });
});

test("GET /v1/uri", async () => {
  const userData = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };
  const user = await User.create(userData);

  const type = "000001";
  const now = new Date().getTime();
  const uriData = {
    "name": config.testAddressXRPL + now + type,
    "nftToken": config.testNftTokenXRPL,
  };
  const metaDataDoc = await MetaData.create({
    name: uriData.name,
    description: 'MetaData for type ' + type,
    image: type,
    properties: {
      owner: config.testAddressXRPL,
      nftToken: uriData.nftToken,
      offerBuy: [],
      parents: [],
    },
  });

  await supertest(app).get("/v1/uri?address=" + config.testAddressXRPL)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.result).toBeTruthy();
      expect(response.body.result.results).toBeTruthy();
      expect(response.body.result.results.length).toBe(1);  
    });

  await supertest(app).get("/v1/uri?nftToken=" + uriData.nftToken)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.result).toBeTruthy();
      expect(response.body.result.results).toBeTruthy();
      expect(response.body.result.results.length).toBe(1);  
    });

  await supertest(app).get("/v1/uri?name=" + uriData.name)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.result).toBeTruthy();
      expect(response.body.result.results).toBeTruthy();
      expect(response.body.result.results.length).toBe(1);  
    });
});

// How to test Patch ?
// Need two XRPL Account (on .env), one Token on first one, and a Buy Offer on first one
test("PATCH /v1/uri/:name - change owner", async () => {
  const userData = {
    "name": "FunnyGuy",
    "address": config.testAddressXRPL,
    "type": "",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };
  const userSecondData = {
    "name": "Xoer542",
    "address": config.testSecondAddressXRPL,
    "type": "",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };
  const user1 = await User.create(userData);
  const user2 = await User.create(userSecondData);

  // Add URI to second user
  const type = "000001";
  const now = new Date().getTime();
  const uriData = {
    "name": userSecondData.address + now + type,
    "nftToken": config.testNftTokenXRPL,
  };
  const metaDataDoc = await MetaData.create({
    name: uriData.name,
    description: 'MetaData for type ' + type,
    image: type,
    properties: {
      owner: userSecondData.address,
      nftToken: uriData.nftToken,
      offerBuy: [ userData.address ],
      parents: [],
    },
  });

  // Update, TOKEN belong to user1 now - todo history check
  const uriPatchData = {
    "owner": userData.address,
  };
  await supertest(app).patch("/v1/uri/" + uriData.name)
    .send(uriPatchData)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.uri).toBeTruthy();
      expect(response.body.uri.id).toBeTruthy();
      expect(response.body.uri.name).toBe(uriData.name);
      expect(response.body.uri.image).toBe(type);
      expect(response.body.uri.properties).toBeTruthy();
      expect(response.body.uri.properties.owner).toBe(uriPatchData.owner);
      expect(response.body.uri.properties.offerBuy.length).toBe(0);
      
      // Check data in the database
      const metaData = await MetaData.findOne({ _id: response.body.uri.id });
      expect(metaData).toBeTruthy();
      expect(metaData.name).toBe(uriData.name);
      expect(metaData.image).toBe(type);
      expect(metaData.properties).toBeTruthy();
      expect(metaData.properties.owner).toBe(uriPatchData.owner);
      // get a CoreMongooseArray, need to trad to string
      expect(metaData.properties.offerBuy.length).toBe(0);

      // Check Updated Users
      const userUpdated = await User.findOne({ _id: user1.id });
      expect(userUpdated).toBeTruthy();
      expect(userUpdated.experience).toBe(0);
      const userUpdated2 = await User.findOne({ _id: user2.id });
      expect(userUpdated2).toBeTruthy();
      expect(userUpdated2.experience).toBe(actionPoints.buyOfferToSmallLevel);
    });
});
test("PATCH /v1/uri/:name - add offerBuy", async () => {
  const userData = {
    "name": "FunnyGuy",
    "address": config.testAddressXRPL,
    "type": "",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };
  const userSecondData = {
    "name": "Xoer542",
    "address": config.testSecondAddressXRPL,
    "type": "",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };
  const user1 = await User.create(userData);
  const user2 = await User.create(userSecondData);

  // Add URI to user1
  const type = "000001";
  const now = new Date().getTime();
  const uriData = {
    "name": userData.address + now + type,
    "nftToken": config.testNftTokenXRPL,
  };
  const metaDataDoc = await MetaData.create({
    name: uriData.name,
    description: 'MetaData for type ' + type,
    image: type,
    properties: {
      owner: userData.address,
      nftToken: uriData.nftToken,
      offerBuy: [],
      parents: [],
    },
  });

  // Update, Add Offer from second
  const uriPatchData = {
    "offerBuy": userSecondData.address,
  };

  await supertest(app).patch("/v1/uri/" + uriData.name)
    .send(uriPatchData)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.uri).toBeTruthy();
      expect(response.body.uri.id).toBeTruthy();
      expect(response.body.uri.name).toBe(uriData.name);
      expect(response.body.uri.image).toBe(type);
      expect(response.body.uri.properties).toBeTruthy();
      expect(response.body.uri.properties.offerBuy).toEqual([ userSecondData.address ]);

      // Check data in the database
      const metaData = await MetaData.findOne({ _id: response.body.uri.id });
      expect(metaData).toBeTruthy();
      expect(metaData.name).toBe(uriData.name);
      expect(metaData.image).toBe(type);
      expect(metaData.properties).toBeTruthy();
      // get a CoreMongooseArray, need to trad to string
      expect(...metaData.properties.offerBuy).toEqual(userSecondData.address);
    });
});
test("PATCH /v1/uri/:name - rm offerBuy", async () => {
  const userData = {
    "name": "FunnyGuy",
    "address": config.testAddressXRPL,
    "type": "",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };
  const userSecondData = {
    "name": "Xoer542",
    "address": config.testSecondAddressXRPL,
    "type": "",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };
  const user1 = await User.create(userData);
  const user2 = await User.create(userSecondData);

  // Add URI to user1
  const type = "000001";
  const now = new Date().getTime();
  const uriData = {
    "name": userData.address + now + type,
    "nftToken": config.testSecondNftTokenXRPL,
  };
  const metaDataDoc = await MetaData.create({
    name: uriData.name,
    description: 'MetaData for type ' + type,
    image: type,
    properties: {
      owner: userData.address,
      nftToken: uriData.nftToken,
      offerBuy: [ userSecondData.address ],
      parents: [],
    },
  });

  // Update, rm Offer
  const uriPatchData = {
    "offerBuy": userSecondData.address,
  };
  await supertest(app).patch("/v1/uri/" + uriData.name)
    .send(uriPatchData)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.uri).toBeTruthy();
      expect(response.body.uri.id).toBeTruthy();
      expect(response.body.uri.name).toBe(uriData.name);
      expect(response.body.uri.image).toBe(type);
      expect(response.body.uri.properties).toBeTruthy();
      expect(response.body.uri.properties.offerBuy.length).toBe(0);
      
      // Check data in the database
      const metaData = await MetaData.findOne({ _id: response.body.uri.id });
      expect(metaData).toBeTruthy();
      expect(metaData.name).toBe(uriData.name);
      expect(metaData.image).toBe(type);
      expect(metaData.properties).toBeTruthy();
      expect(metaData.properties.offerBuy.length).toBe(0);
    });
});
test("PATCH /v1/uri/:name - fail offerBuy", async () => {
  const userData = {
    "name": "FunnyGuy",
    "address": config.testAddressXRPL,
    "type": "",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };
  const user1 = await User.create(userData);

  // Add URI to user1
  const type = "000001";
  const now = new Date().getTime();
  const uriData = {
    "name": userData.address + now + type,
    "nftToken": config.testNftTokenXRPL,
  };
  const metaDataDoc = await MetaData.create({
    name: uriData.name,
    description: 'MetaData for type ' + type,
    image: type,
    properties: {
      owner: userData.address,
      nftToken: uriData.nftToken,
      offerBuy: [ userData.address ],
      parents: [],
    },
  });

  // Update, rm Offer
  const uriPatchData = {
    "offerBuy": userData.address,
  };
  await supertest(app).patch("/v1/uri/" + uriData.name)
    .send(uriPatchData)
    .expect(400);
});

test("GET /v1/uri/history/:tokenId - get History details", async () => {
  const userData = {
    "name": "FunnyGuy",
    "address": config.testAddressXRPL,
    "type": "",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };
  const userSecondData = {
    "name": "Xoer542",
    "address": config.testSecondAddressXRPL,
    "type": "",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };
  const user1 = await User.create(userData);
  const user2 = await User.create(userSecondData);

  // Add URI to user1
  const type = "000001";
  const now = new Date().getTime();
  const uriData = {
    "name": userData.address + now + type,
    "nftToken": config.testNftTokenXRPL,
  };
  const metaDataDoc = await MetaData.create({
    name: uriData.name,
    description: 'MetaData for type ' + type,
    image: type,
    properties: {
      owner: userData.address,
      nftToken: uriData.nftToken,
      offerBuy: [ userData.address ],
      parents: [],
    },
  });

  await supertest(app).get("/v1/uri/history/" + uriData.nftToken)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.history).toBeTruthy();
      expect(response.body.history.name).toBe(uriData.name);
      expect(response.body.history.details).toBeTruthy();
      expect(response.body.history.details.length).toBe(2);
      // Check data in the database
      const metadata = await MetaData.findOne({ name: response.body.history.name });
      expect(metadata).toBeTruthy();
      expect(metadata.name).toBe(uriData.name);
      expect(metadata.properties).toBeTruthy();
      expect(metadata.properties.offerBuy.length).toBe(1);
    });
});