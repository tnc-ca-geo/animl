const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let ImageSchema = new Schema(
  {
    serial_number:      { type: String, required: true },
    file_name:          { type: String, required: true },
    file_path:          { type: String, required: true },
    date_time_original: { type: Date, required: true },
    make:               { type: String },
    model:              { type: String },
    image_width:        { type: Number },
    image_height:       { type: Number },
    megapixels:         { type: Number },
    mime_type:          { type: String },
    user_label_1:       { type: String },
    user_label_2:       { type: String },
    predictions:        [{ type: String }],   // ml predictions
    labels:             [{ type: String }],   // human labels
    // camera:             { type: Schema.Types.ObjectId, ref: 'Camera' },
    // location:           { type: Schema.Types.ObjectId, ref: 'Location' },
  }
);

// // Virtual for detected objects? 
// ImageSchema
// .virtual('detected_objects')
// .get(function () {
//   let detected_objects = false;
//   this.predictions.forEach(predict) {
//     // if prediction is an object detection, set to true
//   }
//   return detected_objects;
// });


module.exports = mongoose.model('Image', ImageSchema);