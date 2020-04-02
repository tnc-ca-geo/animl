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
    imagesMiddleware.validateFields,
    async (req, res, next) => {
      try {
        let md = req.body;
        const imgService = new ImagesService;
        const mlService = new MLService;

        // Make sure image hasn't already been stored
        const existingRecord = await imgService.getImage(md);
        if (existingRecord) {
          console.log('found an existing image in db, throwing error')
          throw new Error('Duplicate warning! Image already saved in DB');
        }

        // Determine what deployment an image belongs to
        const deployment = await imgService.mapToDeployment(md);
        if (!deployment) {
          throw new Error('Unable to find deployment for this image');
        }
        md.deployment = deployment._id;

        // Save image
        const savedImage = await imgService.saveImage(md);

        // Kick off detection job
        mlService.detectObjects(savedImage);
        
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
      console.log('requeset body: ', req.body)
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