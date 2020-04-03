const AWS = require('aws-sdk');
const moment = require('moment');
const ImageModel = require('../../models/image');
const ModelModel = require('../../models/model');
const utils = require('./utils');
const config = require('../../config');


class MLService {

  constructor(imageMetaData, modelName) {
    this.md = imageMetaData;
    this.modelConfig = config.models.filter(m => m.name === modelName)[0];
  };

  async getModel() {
    try {
      return await ModelModel.find({ 
        'name': this.modelConfig.name,
        'version': this.modelConfig.version
      });
    } catch {
      throw new Error('Error finding model record');
    }
  };

  async saveModel() {
    try {
      const currModel = await this.getModel(this.modelConfig);
      if (!currModel.length) {
        const newModel = new ModelModel(this.modelConfig)
        await newModel.save();
      }
    } catch {
      throw new Error('Error saving model record');
    }
  };

  async createLabels(predictions) {
    try {
      const model = await this.getModel();
      return predictions.map(pred => ({
        type: 'ml',
        category: pred.category,
        conf: pred.conf,
        bbox: pred.bbox,
        labeledDate: moment(),
        model: model[0]._id
      }));
    } catch {
      throw new Error('Error creating labels from ML predictions');
    }
  };

  async handlePrediction(response) {
    try {
      const detections = utils.parseDetectorResponse(response, this.modelConfig);
      const labels = await this.createLabels(detections, this.modelConfig);
      const query = { 
        'camera.serialNumber': this.md.serialNumber,
        'dateTimeOriginal': this.md.dateTimeOriginal,
      };
      ImageModel.find(query, (err, response) => {
        let imageRecord = response[0];
        imageRecord.labels = imageRecord.labels.concat(labels);
        imageRecord.save();
      });
      return detections;
    } catch {
      throw new Error('Error updating the image with new labels')
    }
  };

  async detectObjects() {
    try {
      const sageMakerRuntime = new AWS.SageMakerRuntime();
      const detections = sageMakerRuntime.invokeEndpoint({
        Body: Buffer.from(this.md.key),
        EndpointName: this.modelConfig.endpointName,
        ContentType: 'application/json',
      }, (err, response) => {
        if (err) { throw new Error('Bad response from sagemaker') };
        this.handlePrediction(response);
      });
      return detections;
    } catch {
      throw new Error('Error invoking model endpoint');
    }
  };

};


module.exports = MLService;