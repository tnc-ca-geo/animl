const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imagesController');

// // testing 
// router.get('/', function(req, res) {
//   res.send('hello, you reached the api endpoint');
// })

// posting images
router.post('/images', imageController.image_create_post);

module.exports = router;