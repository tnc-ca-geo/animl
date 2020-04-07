const moment = require('moment');
const utils = require('./utils');
const ImageModel = require('../../models/image');
const DeploymentModel = require('../../models/deployment');
const config = require('../../config');
const { logger } = require('../../logger');

class ImageService {
  constructor(imageMetaData) {
    this.formats = config.timeFormats;
    this.md = imageMetaData;
  }

  async init() {
    this.md.deployment = await this.mapImgToDeployment();
  }

  get metadata() {
    if (this.md.deployment) {
      return this.md;
    }
    logger.warn('Image metadata missing deployment info - ', this.md);
  }

  async getImage() {
    try {
      const foundImages = await ImageModel.find({
        'camera.serialNumber': this.md.serialNumber,
        dateTimeOriginal: this.md.dateTimeOriginal,
      });
      return foundImages[0];
    } catch (e) {
      logger.warn('Error getting image - ', e);
    }
  }

  async saveImage() {
    try {
      const newImage = utils.mapMetaToModel(this.md);
      await newImage.save();
      logger.info('Saved new image record');
    } catch (e) {
      logger.error('Error saving image - ', e);
      throw new Error('Could not save image');
    }
  }

  async mapImgToDeployment() {
    try {
      const dto = this.md.dateTimeOriginal;
      const deployments = await DeploymentModel.find({
        'camera.serialNumber': this.md.serialNumber,
      });

      const deploymentMatch = deployments.filter((dep) => {
        dep.end = dep.end ? dep.end : moment();
        return dto >= dep.start && dto <= dep.end;
      })[0];

      !deploymentMatch
        ? logger.warn("Couldn't find the deployment for image - ", this.md)
        : logger.info('Found the corresponding deployment for image');

      return deploymentMatch;
    } catch (e) {
      logger.error('Error mapping image to corresponding deployment - ', e);
      throw new Error('Could not find corresponding deployment for image');
    }
  }
}

module.exports = ImageService;
