const dotenv = require('dotenv');

// config() will read your .env file, parse the contents,
// assign it to process.env.
const envFound = dotenv.config();

if (!envFound) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const config = {
  port: process.env.PORT,
  testPort: process.env.TEST_PORT,
  dbURL: process.env.DB_URI,
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION,
  },
  api: {
    prefix: '/api/v1/',
  },
  timeFormats: {
    exif: 'YYYY:MM:DD hh:mm:ss',
    // imageId: 'YYYY-MM-DD:hh-mm-ss',
  },
  models: [
    {
      // need some unique ID for this
      name: 'megadetector',
      version: '3',
      endpointName: 'sagemaker-tensorflow-serving-2020-03-27-03-18-29-899',
      description: 'Microsoft Megadetector',
      renderThreshold: 0.8,
      categories: {
        0: 'empty',
        1: 'animal',
        2: 'person',
        3: 'group-of-animals',
        4: 'vehicle',
      },
    },
  ],
  deployments: [
    {
      name: 'nattys alley',
      description: 'test deployment in the alley next to nattys house',
      location: {
        geometry: {
          type: 'Point',
          coordinates: [-118.20408225059509, 34.10711648356844],
        },
      },
      camera: {
        make: 'BuckEyeCam',
        model: 'X80',
        serialNumber: 'X8114566',
      },
      start: '2020-3-24',
    },
    {
      name: 'Jasper Ridge',
      description: 'Images from Jasper Ridge biological preserve',
      location: {
        geometry: {
          type: 'Point',
          coordinates: [-122.228118, 37.406889],
        },
      },
      camera: {
        make: 'BuckEyeCam',
        model: 'X7D',
        serialNumber: 'X01002E7',
      },
      start: '2017-1-1',
      end: '2020-1-1',
    },
  ],
};

module.exports = config;
