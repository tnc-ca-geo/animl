const util = require('util');
const AWS = require('aws-sdk');
const moment = require('moment');
const ImageModel = require('../../models/image');
const ModelModel = require('../../models/model');
const utils = require('./utils');
const config = require('../../config');
const { logger } = require('../../logger');

class MLService {
  constructor(imageMetaData, modelName) {
    this.md = imageMetaData;
    this.modelConfig = config.models.filter((m) => m.name === modelName)[0];
  }

  init() {
    this.sageMakerRuntime = new AWS.SageMakerRuntime();
    const invokeEndpoint = util.promisify(this.sageMakerRuntime.invokeEndpoint);
    this.invokeEndpoint = invokeEndpoint.bind(this.sageMakerRuntime);
  }

  async getModel() {
    try {
      return await ModelModel.find({
        name: this.modelConfig.name,
        version: this.modelConfig.version,
      });
    } catch (e) {
      logger.error('Error finding model record - ', e);
    }
  }

  async saveModel() {
    try {
      const currModel = await this.getModel(this.modelConfig);
      if (!currModel.length) {
        const newModel = new ModelModel(this.modelConfig);
        await newModel.save();
        logger.info('Saved model record');
      }
    } catch (e) {
      logger.error('Error saving model record - ', e);
    }
  }

  async createLabels(predictions) {
    try {
      const model = await this.getModel();
      return predictions.map((pred) => ({
        type: 'ml',
        category: pred.category,
        conf: pred.conf,
        bbox: pred.bbox,
        labeledDate: moment(),
        model: model[0]._id,
      }));
    } catch (e) {
      logger.error('Error creating labels from ML predictions - ', e);
    }
  }

  async handlePrediction(response) {
    try {
      const detections = utils.parseDetections(response, this.modelConfig);
      const labels = await this.createLabels(detections, this.modelConfig);
      if (labels.length) {
        logger.info('Detected objects in image: ', labels);
        const query = {
          'camera.serialNumber': this.md.serialNumber,
          dateTimeOriginal: this.md.dateTimeOriginal,
        };
        const images = await ImageModel.find(query);
        const imgToUpdate = images[0];
        imgToUpdate.labels = imgToUpdate.labels.concat(labels);
        imgToUpdate.save();
        logger.info('Updated image record with new labels');
      } else {
        logger.info('No objects detected in image');
      }
    } catch (e) {
      logger.error('Error updating the image with new labels - ', e);
    }
  }

  async detectObjects() {
    try {
      if (!this.invokeEndpoint) {
        throw new Error('Sagemaker runtime has not been initialized');
      }
      logger.info('Attempting to detect objects');
      const response = await this.invokeEndpoint({
        Body: Buffer.from(this.md.key),
        EndpointName: this.modelConfig.endpointName,
        ContentType: 'application/json',
      });
      this.handlePrediction(response);
    } catch (e) {
      logger.error('Error invoking model endpoint - ', e);
    }
  }
}

module.exports = MLService;
