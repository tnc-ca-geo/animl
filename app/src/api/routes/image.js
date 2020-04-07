const express = require('express');
const ImagesService = require('../../services/images');
const imagesMiddleware = require('../middleware/images');
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
        // Save image
        const imgService = new ImagesService(req.body);
        await imgService.init();
        await imgService.saveImage();
        res.status(201).send('Saved image metadata');

        // Kick off detection job
        const metadata = imgService.metadata;
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
