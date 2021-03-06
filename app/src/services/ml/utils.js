const ModelModel = require('../../models/model');

const parseDetections = (data, modelConfig) => {
  const responseData = JSON.parse(Buffer.from(data.Body).toString('utf8'));
  const pred = responseData.predictions[0];
  let detections = [];
  for (let i = 0; i < pred.num_detections; i++) {
    if (pred.detection_scores[i] >= modelConfig.renderThreshold) {
      const box = pred.detection_boxes[i];
      const cat = modelConfig.categories[pred.detection_classes[i]];
      detections.push({
        category: cat,
        conf: pred.detection_scores[i],
        bbox: [box[1], box[0], box[3] - box[1], box[2] - box[0]],
      });
    }
  }
  return detections;
};

const createModelRecord = (modelConfig) => new ModelModel(modelConfig);

module.exports = {
  parseDetections,
  createModelRecord,
};
