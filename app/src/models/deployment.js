const mongoose = require('mongoose');
const shared = require('./shared');
const Schema = mongoose.Schema;


let DeploymentSchema = new Schema({
  name:         { type: String, required: true },
  description:  { type: String },
  location:     { type: shared.LocationSchema },
  camera:       { type: shared.CameraSchema, required: true },
  start_date:   { type: Date, required: true },
  end_date:     { type: Date, required: false },
});


module.exports = mongoose.model('Deployment', DeploymentSchema);