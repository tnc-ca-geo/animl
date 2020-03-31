const mongoose = require('mongoose');
const shared = require('./shared')
const Schema = mongoose.Schema;

/*
 * ValidationSchema
 * reviewed - has the image been reviewed by a user
 * validated - the prediction was validated by a user 
 *            (true = correct prediction, false = incorrect prediction)
 */

let ValidationSchema = new Schema({
  reviewed:            { type: Boolean, default: false, required: true },
  validated:           { type: Boolean, default: false, required: true },
  review_date:         { type: Date },
  user:                { type: Schema.Types.ObjectId, ref: 'User' },
});

/*
 * LabelSchema
 * conf - confidence of prediction
 * bbox - [x, y, box_width, box_height], normalized
 */

let LabelSchema = new Schema({
  type:                { type: String, enum: ['manual', 'ml'], requried: true },
  category:            { type: String, default: 'none', required: true },
  conf:                { type: Number },
  bbox:                { type: [Number] },
  labeled_date:        { type: Date, default: Date.now, required: true },
  validation:          { type: ValidationSchema, requried: true },
  model:               { type: Schema.Types.ObjectId, ref: 'Model' },
});

/*
 * ImageSchema
 * image_id   - combination of sn + DateTimeOriginal. Not sure if necessary
 * file_path  - rel path to image accessible to front end via cloudfront distro
 * object_key - to find image in s3
 * user_data  - user configured EXIF data
 */

let ImageSchema = new Schema({
  image_id:            { type: String, required: true },
  file_path:           { type: String, required: true },
  obeject_key:         { type: String, required: true },
  date_added:          { type: Date, default: Date.now, required: true },
  date_time_original:  { type: Date, required: true },
  image_width:         { type: Number },
  image_height:        { type: Number },
  mime_type:           { type: String },
  user_data:           { type: Map, of: String },
  camera:              { type: shared.CameraSchema, required: true },
  location:            { type: shared.LocationSchema },
  labels:              { type: [LabelSchema] },
  deployment: { 
    type: Schema.Types.ObjectId, 
    ref: 'Deployment', 
    required: true 
  },
});

ImageSchema.index({ deployment: 1 })

module.exports = mongoose.model('Image', ImageSchema);