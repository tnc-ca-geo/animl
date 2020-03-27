const moment = require('moment');
const Image = require('../models/image');

// exports.index = function(req, res) {
//     res.send('NOT IMPLEMENTED: Site Home Page');
// };

// // Display list of all images.
// exports.image_list = function(req, res) {
//     res.send('NOT IMPLEMENTED: image list');
// };

// // Display detail page for a specific image.
// exports.image_detail = function(req, res) {
//     res.send('NOT IMPLEMENTED: image detail: ' + req.params.id);
// };

// // Display image create form on GET.
// exports.image_create_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: image create GET');
// };

// Handle image create on POST.
exports.image_create_post = async function(req, res) {
  console.log('requeset body: ', req.body)

  const data = req.body,
        dateTimeOriginal = moment(data.DateTimeOriginal, 'YYYY:MM:DD hh:mm:ss'),
        dateString = moment(dateTimeOriginal).format('YYYY-MM-DD:hh-mm-ss'),
        id = data.SerialNumber + ':' + dateString;

  let image = new Image({
    image_id:             id,        
    serial_number:        data.SerialNumber,
    file_name:            data.FileName,
    file_path:            data.Path,
    date_time_original:   dateTimeOriginal,
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

  try {
    const savedImage = await image.save();
    console.log('saved image: ', savedImage)
    res.end('saved image metadata');
  } catch(err) {
    console.log(err);
    res.end('ERROR saving image metadata');
  }

};

// // Display image delete form on GET.
// exports.image_delete_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: image delete GET');
// };

// Handle image delete on POST.
exports.image_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: image delete POST');
};

// // Display image update form on GET.
// exports.image_update_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: image update GET');
// };

// // Handle image update on POST.
// exports.image_update_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: image update POST');
// };