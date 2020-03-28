const AWS = require('aws-sdk');
const ImageModel = require('../../models/image');
const utils = require('./utils');
const config = require('../../config');


class ImageService {

  async saveImage(metaData) {
    const image = utils.mapMetaToModel(metaData);
    const savedImage = await image.save();
    return savedImage;
  }

  async getImages(data) {
    console.log('getting images');
  }

}


module.exports = ImageService;