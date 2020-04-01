const moment = require('moment');
const ImageModel = require('../../models/image');


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
    imageId:             id,
    serialNnumber:       metaData.SerialNumber,
    fileName:            metaData.FileName,
    filePath:            metaData.Path,
    dateAdded:           moment(),
    dateTimeOriginal:    dateTimeOg,
    make:                metaData.Make,
    model:               metaData.Model,
    imageWidth:          metaData.ImageWidth,
    imageHeight:         metaData.ImageHeight,
    megapixels:          metaData.Megapixels,
    mimeType:            metaData.MIMEType,
  });

  if (metaData.Make === 'BuckEyeCam') {
    // image.user_label_1 = metaData.text_1;
    // image.user_label_2 = metaData.text_2;
    // image.location = {
    //   // TODO: parse coordinate strings into decimal degrees
    //   coordinates: [metaData.GPSLongitude, GPSLatitude],  
    //   altitude: metaData.GPSAltitude,
    // }
  } 
  else if (metaData.Make === 'RECONYX') {
    // image.user_label_1 = metaData.UserLabel;
  }

  return image;
}


module.exports = {
  makeId,
  mapMetaToModel,
}