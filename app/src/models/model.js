const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
 * ModelPerformanceSchema
 * invocation_count - number of times the model has been invoked
 * correct_count  - number of times a reviewer validated the prediciton 
 * incorrect_count - number of times a reviewer invalidated the prediciton 
 */

let ModelPerformanceSchema = new Schema({
  invocation_count:      { type: Number },
  validation_count:      { type: Number },
  invalidation_count:    { type: Number },
});

/*
 * ModelSchema
 * endpointName - name of endpoint in Sagemaker
 * renderThreshold  - if set, only keep predictions with confidence above thresh
 * catagories - map of catagory ids to labels (e.g. {0: 'empty', 1: 'animal'})
 */

let ModelSchema = new Schema({
  name:             { type: String, required: true },
  description:      { type: String },
  endpointName:     { type: String, required: true },
  version:          { type: String, required: true },
  renderThreshold:  { type: Number },
  categories:       { type: Map },
  performance:      { type: ModelPerformanceSchema }
});


module.exports = mongoose.model('Model', ModelSchema);