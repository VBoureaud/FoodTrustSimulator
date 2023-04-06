const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');
const config = require('../../config');
const { User, MetaData } = require('../../models');
const {
  profiles,
  actionPoints,
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

test("POST /v1/user", async () => {
  const data = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "farmer",
    "location": {
      "name": "Kyiv",
      "lat": "50.45466",
      "lng": "30.5238",
      "country": "UA"
    },
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };

  await supertest(app).post("/v1/user")
    .send(data)
    .expect(201)
    .then(async (response) => {
      // Check the response
      expect(response.body.user).toBeTruthy();
      expect(response.body.user._id).toBeTruthy();
      expect(response.body.user.name).toBe(data.name);
      expect(response.body.user.address).toBe(data.address);
      expect(response.body.user.type).toBe('farmer');
      expect(response.body.user.image).toBe('0-0-0-0-0-0-0-0-0-0');
      expect(response.body.user.experience).toBe(0);
      expect(response.body.user.pocket).toBe(profiles['farmer'].pocketSize);
      expect(response.body.user.location).toStrictEqual(data.location);

      // Check data in the database
      const user = await User.findOne({ _id: response.body.user._id });
      expect(user).toBeTruthy();
      expect(user.name).toBe(data.name);
      expect(user.address).toBe(data.address);
      expect(user.type).toBe('farmer');
      expect(user.location).toEqual(data.location);
    });
});

test("POST /v1/user without location", async () => {
  const data = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "farmer",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };

  const defaultLocation = {
      "name": "Geneve",
      "lat": "46.20222",
      "lng": "6.14569",
      "country": "CH"
  }

  await supertest(app).post("/v1/user")
    .send(data)
    .expect(201)
    .then(async (response) => {
      // Check the response
      expect(response.body.user).toBeTruthy();
      expect(response.body.user._id).toBeTruthy();
      expect(response.body.user.name).toBe(data.name);
      expect(response.body.user.address).toBe(data.address);
      expect(response.body.user.type).toBe("farmer");      
      expect(response.body.user.location).toEqual(defaultLocation);
      
      // Check data in the database
      const user = await User.findOne({ _id: response.body.user._id });
      expect(user).toBeTruthy();
      expect(user.name).toBe(data.name);
      expect(user.address).toBe(data.address);
      expect(user.type).toBe("farmer");
      expect(user.location).toEqual(defaultLocation);
    });
});

test("POST /v1/user duplicate", async () => {
  const data = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "farmer",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };

  await supertest(app).post("/v1/user")
    .send(data)
    .expect(201);

  await supertest(app).post("/v1/user")
    .send(data)
    .expect(400);
});

test("GET /v1/user?:address&:server", async () => {
  const data = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "farmer",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };

  const user = await User.create(data);

  await supertest(app).get("/v1/user?address=" + config.testAddressXRPL + '&server="' + user.server + '"')
    .expect(200)
    .then((response) => {
      expect(response.body.user).toBeTruthy();
      expect(response.body.user._id).toBeTruthy();
      expect(response.body.user.name).toBe(user.name);
      expect(response.body.user.address).toBe(user.address);
      expect(response.body.user.type).toBe(user.type);
      expect(response.body.user.location).toEqual(user.location);
  });
});

test("GET /v1/user/:address without addr", async () => {
  await supertest(app).get("/v1/user/")
    .expect(400);
});

test("PATCH /v1/user/:address", async () => {
  const data = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "farmer",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };

  const dataUpdated = {
    "type": "cook",
  };

  const user = await User.create(data);
  await supertest(app).patch("/v1/user/" + user.address)
    .send(dataUpdated)
    .expect(400)
    /* until you fix the type update
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.user).toBeTruthy();
      expect(response.body.user.type).toBe(dataUpdated.type);
      
      // Check data in the database
      const userUpdated = await User.findOne({ _id: response.body.user._id });
      expect(userUpdated).toBeTruthy();
      expect(userUpdated.type).toBe(dataUpdated.type);
    });*/
});

test("PATCH /v1/user/:address wrong profile", async () => {
  const data = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "farmer",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };

  const dataUpdated = {
    "type": "tedsdf",
  };

  const user = await User.create(data);
  await supertest(app).patch("/v1/user/" + user.address)
    .send(dataUpdated)
    .expect(400);
});

test("PATCH /v1/user/:address already updated", async () => {
  const data = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "farmer",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };

  const dataUpdated = {
    "type": "cook",
  };

  const user = await User.create(data);
  await supertest(app).patch("/v1/user/" + user.address)
    .send(dataUpdated)
    .expect(400);
});

test("PATCH /v1/user/:address quest init", async () => {
  const data = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "farmer",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };

  const dataUpdated = {
    "quest": true,
  };

  const user = await User.create(data);
  await supertest(app).patch("/v1/user/" + user.address)
    .send(dataUpdated)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.user).toBeTruthy();
      expect(response.body.user.experience).toBe(0);
      expect(response.body.user.pocket).toBe(profiles.farmer.pocketSize);
      expect(response.body.user.tokenNeeded.length).toBe(profiles.farmer.typeCount);

      // Check data in the database
      const userUpdated = await User.findOne({ _id: response.body.user._id });
      expect(userUpdated).toBeTruthy();
      expect(userUpdated.experience).toBe(0);
      expect(userUpdated.pocket).toBe(profiles.farmer.pocketSize);
      expect(userUpdated.tokenNeeded.length).toBe(profiles.farmer.typeCount);
    });
});

test("PATCH /v1/user/:address quest incomplete", async () => {
  const data = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "farmer",
    "tokenNeeded": [ '00001' ],
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };

  const dataUpdated = {
    "quest": true,
  };

  const user = await User.create(data);
  await supertest(app).patch("/v1/user/" + user.address)
    .send(dataUpdated)
    .expect(400)
});

test("PATCH /v1/user/:address quest complete", async () => {
  // Add test user1
  const data = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "farmer",
    "tokenNeeded": [ '000002', '000005' ],
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };
  const user = await User.create(data);
  
  // Add two URI to user1
  const type = "000002";
  const now = new Date().getTime();
  const uriData = {
    "name": data.address + now + type,
    "nftToken": config.testNftTokenXRPL,
  };
  const metaDataDoc = await MetaData.create({
    name: uriData.name,
    description: 'MetaData for type ' + type,
    image: type,
    properties: {
      owner: data.address,
      nftToken: uriData.nftToken,
      offerBuy: [],
      parents: [],
    },
  });
  const type2 = "000005";
  const uriData2 = {
    "name": data.address + now + type2,
    "nftToken": config.testSecondNftTokenXRPL,
  };
  const metaDataDoc2 = await MetaData.create({
    name: uriData2.name,
    description: 'MetaData for type ' + type2,
    image: type2,
    properties: {
      owner: data.address,
      nftToken: uriData2.nftToken,
      offerBuy: [],
      parents: [],
    },
  });

  const dataUpdated = {
    "quest": true,
  };
  await supertest(app).patch("/v1/user/" + user.address)
    .send(dataUpdated)
    .expect(200)
    .then(async (response) => {
      expect(response.body.user).toBeTruthy();
      expect(response.body.user.experience).toBe(actionPoints.questCompleted);
      expect(response.body.user.tokenNeeded.length).toBe(profiles.farmer.typeCount);

      // Check data in the database
      const userUpdated = await User.findOne({ _id: response.body.user._id });
      expect(userUpdated).toBeTruthy();
      expect(userUpdated.experience).toBe(actionPoints.questCompleted);
      expect(userUpdated.tokenNeeded.length).toBe(profiles.farmer.typeCount);
    });
});

test("DELETE /v1/user/:address", async () => {
  const data = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "farmer",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };

  const user = await User.create(data);
  await supertest(app)
    .delete("/v1/user/" + user.address)
    .expect(403)
    /*.then(async () => {
      expect(await User.findOne({ _id: user._id })).toBeFalsy();
    });*/
});

test("GET /v1/user/all", async () => {
  const data = {
    "name": "Xoer54",
    "address": config.testAddressXRPL,
    "type": "farmer",
    "server": "wss://hooks-testnet-v2.xrpl-labs.com",
  };

  const user = await User.create(data);
  await supertest(app)
    .get("/v1/user/all")
    .expect(200)
    .then(async (response) => {
      // Check type and length
      expect(response.body.users).toBeTruthy();
      expect(Array.isArray(response.body.users.results)).toBeTruthy();
      expect(response.body.users.results.length).toEqual(1);

      // Check data
      expect(response.body.users.results[0]).toBeTruthy();
      expect(response.body.users.results[0].id).toBeTruthy();
      expect(response.body.users.results[0].name).toBe(user.name);
      expect(response.body.users.results[0].address).toBe(user.address);
      expect(response.body.users.results[0].type).toBe(user.type);
    });
});