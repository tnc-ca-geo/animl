var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CameraSchema = new Schema(
  {
    sn:                 { type: String, required: true },
    make:               { type: String },
    camera_model_name:  { type: String },
    images:             [{ type: Schema.Types.ObjectId, ref: 'Image' }]
  }
);

module.exports = mongoose.model('Camera', CameraSchema);