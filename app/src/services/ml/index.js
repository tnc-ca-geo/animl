const AWS = require('aws-sdk');
const moment = require('moment');
const ImageModel = require('../../models/image');
const utils = require('./utils');
const config = require('../../config');


class MLService {

  async createLabels(predictions, modelConfig) {
    const model = await utils.getModel(modelConfig);
    return predictions.map(pred => ({
      type: 'ml',
      category: pred.category,
      conf: pred.conf,
      bbox: pred.bbox,
      labeledDate: moment(),
      model: model[0]._id
    }))
  };

  async handlePrediction(pred, image, modelConfig) {
    console.log('handling returned prediction');
    const detections = utils.parseDetectorResponse(pred, modelConfig);
    const labels = await this.createLabels(detections, modelConfig);
    console.log('labels: ', labels);
    ImageModel.find({ 'imageId': image.imageId }, (err, response) => {
      image.labels = image.labels.concat(labels);
      image.save();
    });
    return detections;
  };

  async detectObjects(image, models = config.models) {
    console.log('detecting objects');
    const modelConfig = models.filter(m => m.name === 'megadetector')[0];
    const sageMakerRuntime = new AWS.SageMakerRuntime();
    const detections = sageMakerRuntime.invokeEndpoint({
      Body: Buffer.from(image.objectKey),
      EndpointName: modelConfig.endpointName,
      ContentType: 'application/json',
    }, (err, data) => {
      if (err) { throw new Error('Bad response from sagemaker') };
      this.handlePrediction(data, image, modelConfig);
    });
    return detections;
  };

};


module.exports = MLService;