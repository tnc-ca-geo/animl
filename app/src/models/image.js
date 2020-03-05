var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ImageSchema = new Schema(
  {
    sn:                 { type: String, required: true },
    file_name:          { type: String, required: true },
    file_path:          { type: String, required: true },
    mime_type:          { type: String },
    make:               { type: String },
    camera_model_name:  { type: String },
    date_time_original: { type: Date, required: true },
    image_width:        { type: Number },
    image_height:       { type: Number },
    megapixels:         { type: Number },
    camera:             { type: Schema.Types.ObjectId, ref: 'Camera' }
  }
);

module.exports = mongoose.model('Image', ImageSchema);