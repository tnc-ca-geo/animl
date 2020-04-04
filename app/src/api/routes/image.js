const express = require('express');
const ImagesService = require('../../services/images');
const imagesMiddleware = require('../middleware/images')
const MLService = require('../../services/ml');

const route = express.Router();

const imageRouter = (app) => {
  app.use('/images', route);

  // save images
  route.post(
    '/save',
    imagesMiddleware.validate,
    imagesMiddleware.sanitize,
    async (req, res, next) => {
      try {
                
        // Save image
        const imgService = new ImagesService(req.body);
        await imgService.init();
        await imgService.saveImage();

        // Kick off detection job
        const metadata = imgService.metadata;
        const mlService = new MLService(metadata, 'megadetector');
        await mlService.detectObjects();
        
        return res.status(201).end('saved image metadata');

      } catch (err) {
        // logger.error('🔥 error: %o', e);
        return next(err);
      }
    },
  );

  // get images
  route.get(
    '/',
    async (req, res, next) => {
      const imageServiceInstance = new ImagesService;
      const images = imageService.getImages(req);
      return res.status(202).json(images);
    },
  );

  // update image
  // route.post(
  //   '/update',
  //   async (req, res, next) => {
  //     //...
  //   },
  // );

};


module.exports = imageRouter;