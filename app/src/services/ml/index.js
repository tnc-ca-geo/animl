const util = require('util');
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

  init() {
    this.sageMakerRuntime = new AWS.SageMakerRuntime();
    const invokeEndpoint = util.promisify(this.sageMakerRuntime.invokeEndpoint);
    this.invokeEndpoint = invokeEndpoint.bind(this.sageMakerRuntime);
  }

  async getModel() {
    try {
      return await ModelModel.find({ 
        'name': this.modelConfig.name,
        'version': this.modelConfig.version
      });
    } catch {
      console.log('catching error in getModel()')
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
      console.log('catching error in saveModel()')
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
      console.log('catching error in createLabels()')
      throw new Error('Error creating labels from ML predictions');
    }
  };

  async handlePrediction(response) {
    try {
      const detections = utils.parseDetectorResponse(response, this.modelConfig);
      const labels = await this.createLabels(detections, this.modelConfig);
      if (labels.length){ 
        const query = { 
          'camera.serialNumber': this.md.serialNumber,
          'dateTimeOriginal': this.md.dateTimeOriginal,
        };
        const images = await ImageModel.find(query);
        const imgToUpdate = images[0];
        console.log('found image to update with labels: ', imgToUpdate);
        imgToUpdate.labels = imgToUpdate.labels.concat(labels);
        imgToUpdate.save();
        console.log('successfully updated image record');
      } else {
        console.log('no objects detected')
      }
    } catch {
      console.log('catching error in handlePredictions()')
      throw new Error('Error updating the image with new labels')
    }
  };

  async detectObjects() {
    try {
      if (!this.invokeEndpoint) { return; }
      const response = await this.invokeEndpoint({
        Body: Buffer.from(this.md.key),
        EndpointName: this.modelConfig.endpointName,
        ContentType: 'application/json',
      });
      this.handlePrediction(response);
    } catch {
      console.log('catching error in detectObjects()')
      throw new Error('Error invoking model endpoint');
    }
  };

};


module.exports = MLService;