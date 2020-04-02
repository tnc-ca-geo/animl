const moment = require('moment');
const ImageModel = require('../../models/image');
const config = require('../../config')


// Create ID out of image timestamp and camera serial number
const makeId = (md, format = config.timeFormats) => {
  const dateTimeOg = moment(md.DateTimeOriginal, format.exif);
  const dateStr = moment(dateTimeOg).format(format.imageId);
  const id = md.SerialNumber + ':' + dateStr;
  return id;
};

// Unpack user-set exif data
// NOTE: exif tags for storing user data are different for each camera make
const getUserSetData = (md) => {
  const userDataMap = {
    BuckEyeCam: (md) => {
      let userData = {};
      md.Comment.split('\n').forEach(item => {
        if (item.includes('TEXT1') || item.includes('TEXT2') ) {
          userData[item.split('=')[0]] = item.split('=')[1];
        }
      });
      return userData;
    },
    RECONYX: (md) => { userLabel: md.UserLabel },
  };
  const usd = userDataMap[md.Make](md);
  return usd ? usd : {};
};

// Parse string coordinates to decimal degrees
// input e.g. - `34 deg 6' 25.59" N`
const parseCoordinates = (md) => {
  function parse(stringCoord) {
    let deg, min, sec;
    [deg, min, sec] = stringCoord.match(/[+-]?(\d*\.)?\d+/g);
    const cardinal = stringCoord.match(/[N|S|E|W]$/g)[0];
    let degrees = Number(deg) + Number(min)/60 + Number(sec)/3600;
    return (cardinal === 'S' || cardinal === 'W') ? degrees * -1 : degrees;
  };

  return (md.GPSLongitude && md.GPSLatitude) 
    ? [ parse(md.GPSLongitude), parse(md.GPSLatitude) ]
    : null;
};

// Map image metadata to image schema
const mapMetaToModel = (md, format = config.timeFormats) => {
  console.log('mapping metadata to model');
  
  const dateTimeOg = moment(md.DateTimeOriginal, format.exif),
        id = makeId(md),
        coords = parseCoordinates(md),
        userSetData = getUserSetData(md);

  const camera = {    
    serialNumber: md.SerialNumber,
    make: md.Make,
    ...(md.Model && { model: md.Model}),
  };

  const location = coords && {
    geometry: { type: 'Point', coordinates: coords },
    ...(md.GPSAltitude && { altitude: md.GPSAltitude}),
  };
  
  const image = new ImageModel({
    imageId: id,
    filePath: md.key,
    bucket: md.bucket,
    objectKey: md.key,
    dateAdded: moment(),
    dateTimeOriginal: dateTimeOg,
    deployment: md.deployment,
    camera: camera,
    // optional fields
    ...(md.key          && { originalFileName: md.key }),
    ...(md.ImageWidth   && { imageWidth: md.ImageWidth }),
    ...(md.ImageHeight  && { imageHeight: md.ImageHeight}),
    ...(md.MIMEType     && { mimeType: md.MIMEType }),
    ...(userSetData     && { userSetData: userSetData }),
    ...(location        && { location: location }),
  });

  return image;
  
};


module.exports = {
  makeId,
  mapMetaToModel,
};