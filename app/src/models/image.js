const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let DetectionSchema = new Schema(
  {
    category: { type: Number },
    conf:     { type: Number },
    bbox:     { type: [Number], requred: true },
  }
);

let ImageSchema = new Schema(
  {
    image_id:           { type: String, required: true },
    serial_number:      { type: String, required: true },
    file_name:          { type: String, required: true },
    file_path:          { type: String, required: true },
    date_added:         { type: Date, required: true },
    date_time_original: { type: Date, required: true },
    make:               { type: String },
    model:              { type: String },
    image_width:        { type: Number },
    image_height:       { type: Number },
    megapixels:         { type: Number },
    mime_type:          { type: String },
    user_label_1:       { type: String },
    user_label_2:       { type: String },
    detections:         { type: [DetectionSchema] },  // object detections
    predictions:        [{ type: String }],           // ml predictions
    labels:             [{ type: String }],           // human labels
    // camera:             { type: Schema.Types.ObjectId, ref: 'Camera' },
    // location:           { type: Schema.Types.ObjectId, ref: 'Location' },
  }
);


module.exports = mongoose.model('Image', ImageSchema);