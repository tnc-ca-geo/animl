const mongoose = require('mongoose');
const shared = require('./shared');
const Schema = mongoose.Schema;


let DeploymentSchema = new Schema({
  name:         { type: String, required: true },
  description:  { type: String },
  location:     { type: shared.LocationSchema },
  camera:       { type: shared.CameraSchema, required: true },
  start:        { type: Date, required: true },
  end:          { type: Date, required: false },
});


module.exports = mongoose.model('Deployment', DeploymentSchema);