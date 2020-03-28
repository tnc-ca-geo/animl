const moment = require('moment');
const ImageModel = require('../../../models/image');

const makeId = (metaData) => {
  const dateTimeOg = moment(metaData.DateTimeOriginal, 'YYYY:MM:DD hh:mm:ss');
  const dateStr = moment(dateTimeOg).format('YYYY-MM-DD:hh-mm-ss');
  const id = metaData.SerialNumber + ':' + dateStr;
  return id;
}

const mapMetaToModel = (metaData) => {
  const dateTimeOg = moment(metaData.DateTimeOriginal, 'YYYY:MM:DD hh:mm:ss');
  const id = makeId(metaData);

  let image = new ImageModel({
    image_id:             id,
    serial_number:        metaData.SerialNumber,
    file_name:            metaData.FileName,
    file_path:            metaData.Path,
    date_added:           moment(),
    date_time_original:   dateTimeOg,
    make:                 metaData.Make,
    model:                metaData.Model,
    image_width:          metaData.ImageWidth,
    image_height:         metaData.ImageHeight,
    megapixels:           metaData.Megapixels,
    mime_type:            metaData.MIMEType,
  });

  if (metaData.Make === 'BuckEyeCam') {
    image.user_label_1 = metaData.text_1;
    image.user_label_2 = metaData.text_2;
  } 
  else if (metaData.Make === 'RECONYX') {
    image.user_label_1 = metaData.UserLabel;
  }

  return image;
}


module.exports = {
  makeId,
  mapMetaToModel,
}