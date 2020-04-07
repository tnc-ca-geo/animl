const { checkSchema, body } = require('express-validator');
const moment = require('moment');
const config = require('../../config');

const validate = checkSchema({
  SerialNumber: {
    in: ['body'],
    errorMessage: "Couldn't find camera SerialNumber",
  },
  DateTimeOriginal: {
    in: ['body'],
    errorMessage: "Couldn't find image DateTimeOriginal",
  },
  Make: {
    in: ['body'],
    errorMessage: "Couldn't find camera Make",
  },
  key: {
    in: ['body'],
    errorMessage: "Couldn't find S3 key field",
  },
  bucket: {
    in: ['body'],
    errorMessage: "Couldn't find S3 bucket field",
  },
});

const sanitize = body().customSanitizer((body, { req }) => {
  let sanitized = {};
  // If second char in key is uppercase,
  // assume it's an acronym (like GPSLatitude) & leave it, else camel case
  for (let key in body) {
    const newKey = !(key.charAt(1) == key.charAt(1).toUpperCase())
      ? key.charAt(0).toLowerCase() + key.slice(1)
      : key;
    sanitized[newKey] = body[key];
  }
  const dto = moment(sanitized.dateTimeOriginal, config.timeFormats.exif);
  sanitized.dateTimeOriginal = dto;
  return sanitized;
});

module.exports = {
  validate,
  sanitize,
};
