const mongoose = require('mongoose');
const supertest = require('supertest');
const config = require('../../config');
const app = require('../../app');

beforeEach((done) => {
	mongoose.connect(config.mongoose.url, config.mongoose.options)
	.then(() => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  });
});

test("GET /v1", async () => {
  await supertest(app).get("/v1")
    .expect(200)
    .then((response) => {
    	const result = {"data": "Hello World"};
      	expect(response.body).toStrictEqual(result);
    });
});