const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');
const config = require('./config')
const app = require('./app'); 

// May require additional time for downloading MongoDB binaries
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;

describe('Save image', () => {
  let mongoServer;
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  beforeAll(async () => {
    
    // Connect to in-memory mongoDB
    console.log('conencting to in memory mongoDB')
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, opts, (err) => {
      if (err) console.error(err);
    });

    // Clear database
    console.log('Clearing out old data from db');
    for (const i in mongoose.connection.collections) {
      console.log('Getting rid of collection: ', i);
      await mongoose.connection.collections[i].remove();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('Handling new images', () => {
    it('should return a 201', async () => {
      const res = await supertest(app).post(config.api.prefix + 'images');
      // console.log(res.body);
      expect(res.status).toBe(201);
      // const User = mongoose.model('User', new mongoose.Schema({ name: String }));
      // const count = await User.count();
      // expect(count).toEqual(0);
    });
  });
});