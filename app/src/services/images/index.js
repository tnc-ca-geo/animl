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

      const responseData = JSON.parse(Buffer.from(data.Body).toString('utf8'));
      const pred = responseData.predictions[0];
      let detections = [];
      for (let i = 0; i < pred.num_detections; i++ ) {
        if (pred.detection_scores[i] >= modelConfig.renderThreshold) {
          const box = pred.detection_boxes[i];
          detections.push({
            category: pred.detection_classes[i],
            conf: pred.detection_scores[i],
            bbox: [box[1], box[0], box[3] - box[1], box[2] - box[0]]
          });
        }
      }
      console.log('detections above threshold: ', detections);

      const update = { detections };
      ImageModel.findByIdAndUpdate(_id, update, (err, response) => {
        if (err) { console.log(err) };
        console.log(response);
      });

      return detections;
    });
  }

}


module.exports = ImageService;