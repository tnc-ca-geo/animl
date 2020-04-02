const { checkSchema } = require('express-validator');

// Validate and sanitize
const validateFields = checkSchema({
  SerialNumber: {
    in: ['body'],
    errorMessage: 'Couldn\'t find camera SerialNumber',
  },
  DateTimeOriginal: {
    in: ['body'],
    errorMessage: 'Couldn\'t find image DateTimeOriginal',
  },
  Make: {
    in: ['body'],
    errorMessage: 'Couldn\'t find camera Make',
  },
  key: {
    in: ['body'],
    errorMessage: 'Couldn\'t find S3 key field',
  },
  bucket: {
    in: ['body'],
    errorMessage: 'Couldn\'t find S3 bucket field',
  },
});

module.exports = {
  validateFields,
}