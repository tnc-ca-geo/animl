const express = require('express');
const ImageService = require('../../services/image');
const imagesMiddleware = require('../middleware/imageMiddleware');
const MLService = require('../../services/ml');
const { logger } = require('../../logger');

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
        // TODO: consider separating this code into a controller that receives
        // a context object with the request payload rather than the req
        // itself. The challenge is how to return when the the image has been
        // saved to the DB so that the router can respond to the client,
        // but allow the controller function to continue on and 
        // trigger the detection job.

        // Save image
        const imageService = new ImageService(req.body);
        await imageService.init();
        await imageService.saveImage();
        res.status(201).send('Saved image metadata');

        // Kick off detection job
        const metadata = imageService.metadata;
        const mlService = new MLService(metadata, 'megadetector');
        mlService.init();
        await mlService.detectObjects();
      } catch (e) {
        logger.error('Error handling image post request - ', e);
        return next(e);
      }
    }
  );

  // // get images
  // route.get(
  //   '/',
  //   async (req, res, next) => {
  //     //...
  //     return res.status(202).json(images);
  //   },
  // );

  // // update image
  // route.post(
  //   '/update',
  //   async (req, res, next) => {
  //     //...
  //   },
  // );

  // Testing jest
  route.post(
    '/',
    async (req, res, next) => {
      res.status(201).send('testing jest');
    },
  );
};

module.exports = imageRouter;
