// Schema shared by multiple models

const PointSchema = new mongoose.Schema({
  type:                { type: String, enum: ['Point'], required: true },
  coordinates:         { type: [Number], required: true }
});

let LocationSchema = new Schema({
  geometry:            { type: PointSchema, required: true },
  altitude:            { type: String },
  azimuth:             { type: Number },
});

let CameraSchema = new Schema({
  make:                { type: String, default: 'unknown', required: true },
  model:               { type: String },
  serial_number:       { type: String, required: true },
});

module.exports = {
  PointSchema, 
  LocationSchema,
  CameraSchema,
}