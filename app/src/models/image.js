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
  reviewDate:          { type: Date },
  user:                { type: Schema.Types.ObjectId, ref: 'User' },
});

/*
 * LabelSchema
 * conf - confidence of prediction
 * bbox - [x, y, boxWidth, boxHeight], normalized
 */

let LabelSchema = new Schema({
  type:                { type: String, enum: ['manual', 'ml'], requried: true },
  category:            { type: String, default: 'none', required: true },
  conf:                { type: Number },
  bbox:                { type: [Number] },
  labeledDate:         { type: Date, default: Date.now, required: true },
  validation:          { type: ValidationSchema, requried: true },
  model:               { type: Schema.Types.ObjectId, ref: 'Model' },
});

/*
 * ImageSchema
 * imageId   - combination of sn + DateTimeOriginal. Not sure if necessary
 * filePath  - rel path to image accessible to front end via cloudfront distro
 * objectKey - to find image in s3
 * userData  - user configured EXIF data
 */

let ImageSchema = new Schema({
  imageId:             { type: String, required: true },
  filePath:            { type: String, required: true },
  obejectKey:          { type: String, required: true },
  dateAdded:           { type: Date, default: Date.now, required: true },
  dateTimeOriginal:    { type: Date, required: true },
  imageWidth:          { type: Number },
  imageHeight:         { type: Number },
  mimeType:            { type: String },
  userData:            { type: Map, of: String },
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