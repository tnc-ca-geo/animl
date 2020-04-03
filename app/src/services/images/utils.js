const moment = require('moment');
const ImageModel = require('../../models/image');
const config = require('../../config')


const prepMetaData = (md) => {
  let mdProcessed = {};
  // If second char in key is uppercase, 
  // assume it's an acronym & leave it, else camel case the key
  for (let key in md) {
    const newKey = !(key.charAt(1) == key.charAt(1).toUpperCase())
      ? key.charAt(0).toLowerCase() + key.slice(1)
      : key;
    mdProcessed[newKey] = md[key];
  };
  const dto = moment(mdProcessed.dateTimeOriginal, config.timeFormats.exif);
  mdProcessed.dateTimeOriginal = dto;
  return mdProcessed;
};

// Unpack user-set exif tags
const getUserSetData = (md) => {
  const userDataMap = {
    BuckEyeCam: (md) => {
      let userData = {};
      md.comment.split('\n').forEach(item => {
        if (item.includes('TEXT1') || item.includes('TEXT2') ) {
          userData[item.split('=')[0]] = item.split('=')[1];
        }
      });
      return userData;
    },
    RECONYX: (md) => { userLabel: md.userLabel },
  };
  const usd = userDataMap[md.make](md);
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
    ? [parse(md.GPSLongitude), parse(md.GPSLatitude)]
    : null;
};

// Map image metadata to image schema
const mapMetaToModel = (md) => {
  
  const coords = parseCoordinates(md),
        userSetData = getUserSetData(md);

  const camera = {    
    serialNumber: md.serialNumber,
    make: md.make,
    ...(md.model && { model: md.model}),
  };

  const location = coords && {
    geometry: { type: 'Point', coordinates: coords },
    ...(md.GPSAltitude && { altitude: md.GPSAltitude}),
  };
  
  const image = new ImageModel({
    // hash: md.hash,
    filePath: md.key,
    bucket: md.bucket,
    objectKey: md.key,
    dateAdded: moment(),
    dateTimeOriginal: md.dateTimeOriginal,
    deployment: md.deployment,
    camera: camera,
    // optional fields
    ...(md.key          && { originalFileName: md.key }),
    ...(md.imageWidth   && { imageWidth: md.imageWidth }),
    ...(md.imageHeight  && { imageHeight: md.imageHeight}),
    ...(md.MIMEType     && { mimeType: md.MIMEType }),
    ...(userSetData     && { userSetData: userSetData }),
    ...(location        && { location: location }),
  });

  return image;
  
};


module.exports = {
  prepMetaData,
  mapMetaToModel,
};