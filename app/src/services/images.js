const moment = require('moment');
const ImageModel = require('../models/image');
const AWS = require('aws-sdk');
const config = require('../config');

class ImageService {
  constructor() {
    this.model = ImageModel;
  }

  async saveImage(data) {
    const dateTimeOg = moment(data.DateTimeOriginal, 'YYYY:MM:DD hh:mm:ss'),
          dateStr = moment(dateTimeOg).format('YYYY-MM-DD:hh-mm-ss'),
          id = data.SerialNumber + ':' + dateStr;

    let image = new this.model({
      image_id:             id,        
      serial_number:        data.SerialNumber,
      file_name:            data.FileName,
      file_path:            data.Path,
      date_time_original:   dateTimeOg,
      make:                 data.Make,
      model:                data.Model,
      image_width:          data.ImageWidth,
      image_height:         data.ImageHeight,
      megapixels:           data.Megapixels,
      mime_type:            data.MIMEType,
    });

    if (data.Make === 'BuckEyeCam') {
      image.user_label_1 = data.text_1;
      image.user_label_2 = data.text_2;
    } 
    else if (data.Make === 'RECONYX') {
      image.user_label_1 = data.UserLabel;
    }

    const savedImage = await image.save();
    return savedImage;
        
  }

  async getImages(data) {
    console.log('getting images');
  }

  async detectObjects(imageData) {
    const modelConfig = config.models.megadetector.v1;
    const sageMakerRuntime = new AWS.SageMakerRuntime();
    let params = {
      Body: new Buffer(imageData.Path),
      EndpointName: modelConfig.endpointName,
      ContentType: 'application/json',
    };
    sageMakerRuntime.invokeEndpoint(params, function(err, data) {
      const responseData = JSON.parse(Buffer.from(data.Body).toString('utf8'));
      console.log(responseData.predictions[0].detection_classes);
    });
  }

}


module.exports = ImageService;