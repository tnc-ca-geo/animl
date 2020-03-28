const dotenv = require('dotenv');
// config() will read your .env file, parse the contents, 
// assign it to process.env.
dotenv.config();

const config = {
  port: process.env.PORT,
  databaseURL: process.env.DB_URI,
  api: {
    prefix: '/api/v1/',
  },
  models: {
    megadetector: {
      v1: {
        endpointName: 'sagemaker-tensorflow-serving-2020-03-27-03-18-29-899',
        renderThreshold: 0.8,
      }
    }
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION,
  },
};

module.exports = config;
