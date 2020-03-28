const AWS = require('aws-sdk');
const ImageModel = require('../../models/image');
const utils = require('./utils');
const config = require('../../config');


class MLService {

  async detectObjects(metaData, _id) {
    console.log('detecting objects... ');
    const modelConfig = config.models.megadetector.v1;
    const sageMakerRuntime = new AWS.SageMakerRuntime();
    let params = {
      Body: Buffer.from(metaData.Path),
      EndpointName: modelConfig.endpointName,
      ContentType: 'application/json',
    };
    sageMakerRuntime.invokeEndpoint(params, (err, data) => {
      const detections = utils.parseDetectorResponse(data, modelConfig);
      const update = { detections };
      ImageModel.findByIdAndUpdate(_id, update, (err, response) => {
        if (err) { console.log(err) };
        console.log(response);
      });
      return detections;
    });
  }

}


module.exports = MLService;