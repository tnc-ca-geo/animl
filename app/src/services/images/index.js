const AWS = require('aws-sdk');
const moment = require('moment');
const utils = require('./utils');
const ImageModel = require('../../models/image');
const DeploymentModel = require('../../models/deployment');
const config = require('../../config');


class ImageService {

  constructor(imageMetaData) {
    this.formats = config.timeFormats;
    this.imageMetaData = imageMetaData;
    this.md = {};
  }

  async init() {
    try {
      this.md.deployment = await this.mapToDeployment();
    } catch {
      throw new Error('Unable to find deployment for this image');
    }
  };

  async getImage() {
    try {
      const foundImages = await ImageModel.find({
        'camera.serialNumber': this.md.serialNumber,
        'dateTimeOriginal': this.md.dateTimeOriginal
      });
      return foundImages[0];
    } catch {
      throw new Error('Error retireving image');
    }
  };
  
  async saveImage() {
    try {
      const newImage = utils.mapMetaToModel(this.md);
      await newImage.save();
    } catch {
      throw new Error('Error saving image');
    }
  };

  async mapToDeployment() {
    try {
      const dto = this.md.dateTimeOriginal;
      const sn = this.md.serialNumber;
      const deployments = await DeploymentModel.find({
        'camera.serialNumber': sn 
      });
      const deploymentMatch = deployments.filter(dep => {
        dep.end = dep.end ? dep.end : moment();
        return dto >= dep.start && dto <= dep.end;
      })[0];
      if (!deploymentMatch) {
        console.log('couldn\'t find a registered deployment for this image!');
      }
      return deploymentMatch;
    } catch {
      throw new Error('Error mapping image to corresponding deployment')
    }
  };

};


module.exports = ImageService;