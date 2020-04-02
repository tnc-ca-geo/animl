const AWS = require('aws-sdk');
const moment = require('moment');
const utils = require('./utils');
const ImageModel = require('../../models/image');
const DeploymentModel = require('../../models/deployment');


class ImageService {

  async getImage(metaData) {
    const imageId = utils.makeId(metaData);
    const foundImages = await ImageModel.find({ 'imageId': imageId });
    return foundImages[0];
  };
  
  async saveImage(metaData) {
    console.log('saving image');
    const image = utils.mapMetaToModel(metaData);
    const savedImage = await image.save();
    return savedImage;
  };

  async mapToDeployment(metaData) {
    console.log('mapping image to deployment');
    const dto = moment(metaData.DateTimeOriginal, 'YYYY:MM:DD hh:mm:ss');
    const sn = metaData.SerialNumber;
    const deployments = await DeploymentModel.find({'camera.serialNumber': sn});
    const deploymentMatch = deployments.filter(dep => {
      dep.end = dep.end ? dep.end : moment();
      return dto >= dep.start && dto <= dep.end;
    })[0];
    if (!deploymentMatch) {
      console.log('couldn\'t find a registered deployment for this image!')
    }
    return deploymentMatch;
  };

}


module.exports = ImageService;